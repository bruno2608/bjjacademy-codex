import { useEffect, useMemo } from 'react'

import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils'
import { normalizeFaixaSlug } from '@/lib/alunoStats'
import { calculateNextStep, estimateGraduationDate } from '@/lib/graduationRules'
import { useGraduacoesProfessorView } from '@/hooks/useGraduacoesProfessorView'
import { useAlunosStore } from '@/store/alunosStore'
import { useMatriculasStore } from '@/store/matriculasStore'
import { usePresencasStore } from '@/store/presencasStore'
import { useTreinosStore } from '@/store/treinosStore'
import type { BjjBeltVisualConfig } from '@/types/bjjBelt'
import type { Aluno } from '@/types/aluno'
import type { GraduacaoPlanejada } from '@/types/graduacao'
import type { Matricula } from '@/types/matricula'
import type { PresencaRegistro } from '@/types/presenca'

export type HistoricoGraduacaoResumo = {
  id: string
  data: string | null
  titulo: string
  descricao?: string | null
  faixaSlug?: string | null
  grau?: number | null
  instrutor?: string | null
  tipo: 'Faixa' | 'Grau'
}

export type PresencaResumo = {
  referenciaDias: number
  percentual: number | null
  presentes: number
  faltas: number
  justificadas: number
  pendentes: number
  totalConsiderado: number
  ultimas: PresencaRegistro[]
}

export type ProximaGraduacaoResumo = GraduacaoPlanejada & {
  faixaConfigAtual?: BjjBeltVisualConfig | null
  faixaConfigDestino?: BjjBeltVisualConfig | null
  faixaSlugAtual: string
  proximaFaixaSlug: string | null
  grauDestino: number | null
  dataPrevista: string | null
  progressoPercentual: number | null
  aulasFeitas?: number | null
  aulasMeta?: number | null
}

export type AlunoDetalhesStaffData = {
  aluno: Aluno | null
  faixaConfig: BjjBeltVisualConfig | null
  faixaSlug: string | null
  grauAtual: number
  matriculaPrincipal: Matricula | null
  resumoPresencas: PresencaResumo
  proximaGraduacao: ProximaGraduacaoResumo | null
  historicoGraduacoes: HistoricoGraduacaoResumo[]
  treinosMap: Map<string, { id: string; nome: string; hora?: string }>
}

const parseDate = (value?: string | null): Date | null => {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const ordenarPorDataDesc = <T extends { data: string | null }>(lista: T[]) =>
  [...lista].sort((a, b) => {
    const dataA = parseDate(a.data)?.getTime() ?? 0
    const dataB = parseDate(b.data)?.getTime() ?? 0
    return dataB - dataA
  })

const filtrarRecentes = (presencas: PresencaRegistro[], dias: number) => {
  const agora = Date.now()
  const limiteMs = dias * 24 * 60 * 60 * 1000
  return presencas.filter((item) => {
    const data = parseDate(item.data)
    if (!data) return false
    return agora - data.getTime() <= limiteMs
  })
}

export function useAlunoDetalhesStaff(alunoId?: string): AlunoDetalhesStaffData {
  const alunos = useAlunosStore((state) => state.alunos)
  const presencas = usePresencasStore((state) => state.presencas)
  const matriculas = useMatriculasStore((state) => state.matriculas)
  const carregarMatriculas = useMatriculasStore((state) => state.carregarMatriculas)
  const treinos = useTreinosStore((state) => state.treinos)
  const { graduacoes: graduacoesView } = useGraduacoesProfessorView()

  useEffect(() => {
    if (!matriculas.length) {
      carregarMatriculas().catch(() => {})
    }
  }, [carregarMatriculas, matriculas.length])

  const aluno = useMemo<Aluno | null>(() => {
    if (!alunoId) return null
    return alunos.find((item) => item.id === alunoId) ?? null
  }, [alunoId, alunos])

  const faixaSlug = useMemo(() => normalizeFaixaSlug(aluno?.faixaSlug || aluno?.faixa), [aluno?.faixa, aluno?.faixaSlug])

  const faixaConfig = useMemo(
    () => (faixaSlug ? getFaixaConfigBySlug(faixaSlug) : null) || getFaixaConfigBySlug('branca-adulto'),
    [faixaSlug]
  )

  const grauAtual = Math.max(0, Number(aluno?.graus ?? 0))

  const matriculaPrincipal = useMemo<Matricula | null>(() => {
    const doAluno = matriculas.filter((item) => item.alunoId === alunoId)
    const ativa = doAluno.find((item) => item.status === 'ativo')
    if (ativa) return ativa
    if (doAluno.length === 0) return null
    return ordenarPorDataDesc(
      doAluno.map((item) => ({ ...item, data: item.dataInicio || null }))
    )[0] as Matricula
  }, [alunoId, matriculas])

  const presencasDoAluno = useMemo(() => presencas.filter((item) => item.alunoId === alunoId), [alunoId, presencas])

  const resumoPresencas = useMemo<PresencaResumo>(() => {
    const referenciaDias = 30
    const recentes = filtrarRecentes(presencasDoAluno, referenciaDias)
    const presentes = recentes.filter((item) => item.status === 'PRESENTE').length
    const faltas = recentes.filter((item) => item.status === 'FALTA').length
    const justificadas = recentes.filter((item) => item.status === 'JUSTIFICADA').length
    const pendentes = recentes.filter((item) => item.status === 'PENDENTE').length
    const totalConsiderado = presentes + faltas + justificadas
    const percentual = totalConsiderado > 0 ? Math.round((presentes / totalConsiderado) * 100) : null

    const ultimas = ordenarPorDataDesc(
      presencasDoAluno.map((item) => ({ ...item, data: item.data || null }))
    ).slice(0, 5) as PresencaRegistro[]

    return {
      referenciaDias,
      percentual,
      presentes,
      faltas,
      justificadas,
      pendentes,
      totalConsiderado,
      ultimas
    }
  }, [presencasDoAluno])

  const graduacoesDoAluno = useMemo(() => graduacoesView.filter((g) => g.alunoId === alunoId), [alunoId, graduacoesView])

  const proximaGraduacao = useMemo<ProximaGraduacaoResumo | null>(() => {
    if (!aluno) return null
    const candidatas = graduacoesDoAluno.filter((g) => g.status !== 'Concluído')
    const ordenadas = candidatas.sort((a, b) => {
      const dataA = parseDate(a.dataPrevista || a.previsao)?.getTime() ?? 0
      const dataB = parseDate(b.dataPrevista || b.previsao)?.getTime() ?? 0
      return dataA - dataB
    })
    const selecionada = ordenadas[0]

    if (selecionada) {
      return {
        ...selecionada,
        faixaConfigAtual: selecionada.faixaAtualConfig,
        faixaConfigDestino: selecionada.proximaFaixaConfig,
        faixaSlugAtual: selecionada.faixaSlugAtual,
        proximaFaixaSlug: selecionada.proximaFaixaSlug,
        grauDestino: selecionada.grauDestino,
        dataPrevista: selecionada.dataPrevista ?? selecionada.previsao ?? null,
        progressoPercentual: selecionada.progressoPercentual ?? null,
        aulasFeitas: selecionada.aulasFeitas ?? null,
        aulasMeta: selecionada.aulasMeta ?? null
      }
    }

    const recomendacao = calculateNextStep(aluno, { presencas: presencasDoAluno })
    if (!recomendacao) return null

    const estimada = recomendacao.mesesRestantes
      ? estimateGraduationDate(aluno, recomendacao.mesesRestantes)
      : null

    const destinoSlug = normalizeFaixaSlug(
      recomendacao.tipo === 'Faixa'
        ? recomendacao.proximaFaixa
        : recomendacao.faixaAtual
    )

    return {
      id: recomendacao.tipo === 'Faixa' ? `next-faixa-${aluno.id}` : `next-grau-${aluno.id}`,
      alunoId: aluno.id,
      alunoNome: aluno.nomeCompleto || aluno.nome,
      faixaAtual: recomendacao.faixaAtual,
      proximaFaixa: recomendacao.tipo === 'Faixa' ? recomendacao.proximaFaixa : recomendacao.faixaAtual,
      tipo: recomendacao.tipo,
      grauAlvo: recomendacao.tipo === 'Grau' ? recomendacao.grauAlvo : null,
      criterioTempo: `${recomendacao.tempoNecessario} meses`,
      mesesRestantes: recomendacao.mesesRestantes ?? 0,
      previsao: estimada ?? '',
      dataConclusao: null,
      instrutor: 'Equipe BJJ Academy',
      status: 'Em progresso',
      faixaSlugAtual: faixaSlug || recomendacao.faixaAtual,
      proximaFaixaSlug: destinoSlug,
      grauDestino: recomendacao.tipo === 'Grau' ? recomendacao.grauAlvo : null,
      dataPrevista: estimada,
      faixaConfigAtual: faixaConfig,
      faixaConfigDestino: getFaixaConfigBySlug(destinoSlug),
      progressoPercentual:
        recomendacao.tipo === 'Grau'
          ? recomendacao.progressoAulasGrau
          : recomendacao.progressoAulasFaixa,
      aulasFeitas:
        recomendacao.tipo === 'Grau'
          ? recomendacao.aulasRealizadasNoGrau
          : recomendacao.aulasRealizadasNaFaixa,
      aulasMeta: recomendacao.aulasMinimasRequeridas
    }
  }, [aluno, faixaConfig, graduacoesDoAluno, presencasDoAluno, faixaSlug])

  const historicoGraduacoes = useMemo<HistoricoGraduacaoResumo[]>(() => {
    const concluidas = graduacoesDoAluno
      .filter((g) => g.status === 'Concluído' || g.dataPrevista || g.dataConclusao)
      .map((g) => ({
        id: g.id,
        data: g.dataConclusao || g.dataPrevista || g.previsao || null,
        titulo: g.tipo === 'Faixa' ? `${g.faixaAtual} → ${g.proximaFaixa || g.proximaFaixaSlug || g.faixaAtual}` : `${
          g.grauDestino ?? g.grauAlvo ?? ''
        }º grau em ${g.faixaAtual}`,
        descricao: g.criterioTempo,
        faixaSlug: normalizeFaixaSlug(g.proximaFaixaSlug || g.faixaSlugAtual || g.faixaAtual),
        grau: g.grauDestino ?? g.grauAlvo ?? null,
        instrutor: g.instrutor,
        tipo: g.tipo
      }))

    const doAluno = (aluno?.historicoGraduacoes || []).map((item) => ({
      id: item.id,
      data: item.data || null,
      titulo: item.tipo === 'Faixa' ? `${item.faixa}` : `${item.grau}º grau em ${item.faixa}`,
      descricao: item.descricao,
      faixaSlug: item.faixaSlug ?? normalizeFaixaSlug(item.faixa),
      grau: item.grau,
      instrutor: item.instrutor,
      tipo: item.tipo
    }))

    return ordenarPorDataDesc([...concluidas, ...doAluno]).slice(0, 3)
  }, [aluno?.historicoGraduacoes, graduacoesDoAluno])

  const treinosMap = useMemo(() => {
    const map = new Map<string, { id: string; nome: string; hora?: string }>()
    treinos.forEach((treino) => map.set(treino.id, treino))
    return map
  }, [treinos])

  return {
    aluno,
    faixaConfig,
    faixaSlug,
    grauAtual,
    matriculaPrincipal,
    resumoPresencas,
    proximaGraduacao,
    historicoGraduacoes,
    treinosMap
  }
}
