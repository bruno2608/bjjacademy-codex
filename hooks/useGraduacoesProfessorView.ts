import { useMemo } from 'react'

import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils'
import { buildAttendanceSnapshot, normalizeFaixaSlug } from '@/lib/alunoStats'
import { calculateNextStep, estimateGraduationDate } from '@/lib/graduationRules'
import { useAlunosStore } from '@/store/alunosStore'
import { useGraduacoesStore } from '@/store/graduacoesStore'
import { usePresencasStore } from '@/store/presencasStore'
import type { BjjBeltVisualConfig } from '@/types/bjjBelt'
import type { Aluno } from '@/types/aluno'
import type { GraduacaoPlanejada, GraduacaoStatus } from '@/types/graduacao'
import type { PresencaRegistro } from '@/types/presenca'

type AlunoLookupValue = Aluno & {
  faixaSlug: string
  nomeCompleto: string
  attendance?: ReturnType<typeof buildAttendanceSnapshot>
  presencas?: PresencaRegistro[]
}

export type ProximaGraduacaoAluno = GraduacaoPlanejada & {
  alunoNome: string
  faixaSlugAtual: string
  faixaAtualConfig?: BjjBeltVisualConfig | null
  proximaFaixaSlug: string | null
  proximaFaixaConfig?: BjjBeltVisualConfig | null
  grauAtual: number
  grauDestino: number | null
  status: GraduacaoStatus
  dataPrevista: string | null
  progressoPercentual: number | null
  aulasFeitas?: number | null
  aulasMeta?: number | null
}

const parseTempoNecessario = (criterioTempo?: string | null) => {
  if (!criterioTempo) return null
  const match = criterioTempo.match(/(\d+)/)
  return match ? Number(match[1]) : null
}

const calcularProgressoPorTempo = (graduacao: GraduacaoPlanejada): number | null => {
  const tempoNecessario = parseTempoNecessario(graduacao.criterioTempo)
  if (!tempoNecessario || tempoNecessario <= 0) return null

  const mesesRestantes = Number(graduacao.mesesRestantes ?? 0)
  const mesesCumpridos = Math.max(tempoNecessario - mesesRestantes, 0)
  return Math.min(100, Math.round((mesesCumpridos / tempoNecessario) * 100))
}

export function useGraduacoesProfessorView() {
  const graduacoes = useGraduacoesStore((state) => state.graduacoes)
  const alunos = useAlunosStore((state) => state.alunos)
  const presencas = usePresencasStore((state) => state.presencas)

  const presencasPorAluno = useMemo(() => {
    const map = new Map<string, PresencaRegistro[]>()
    presencas.forEach((presenca) => {
      const lista = map.get(presenca.alunoId) ?? []
      lista.push(presenca)
      map.set(presenca.alunoId, lista)
    })
    return map
  }, [presencas])

  const alunoLookup = useMemo<Record<string, AlunoLookupValue>>(() => {
    const lookup: Record<string, AlunoLookupValue> = {}
    alunos.forEach((aluno) => {
      const faixaSlug = normalizeFaixaSlug(aluno.faixaSlug ?? aluno.faixa)
      const registros = presencasPorAluno.get(aluno.id) ?? []
      const attendance = buildAttendanceSnapshot(aluno, registros)

      lookup[aluno.id] = {
        ...aluno,
        faixaSlug,
        nomeCompleto: aluno.nomeCompleto || aluno.nome,
        attendance,
        presencas: registros
      }
    })
    return lookup
  }, [alunos, presencasPorAluno])

  const graduacoesView = useMemo<ProximaGraduacaoAluno[]>(() => {
    return graduacoes.map((graduacao) => {
      const aluno = alunoLookup[graduacao.alunoId]
      const faixaSlugAtual = normalizeFaixaSlug(aluno?.faixaSlug ?? graduacao.faixaAtual)
      const proximaFaixaSlug =
        graduacao.tipo === 'Faixa'
          ? normalizeFaixaSlug(graduacao.proximaFaixa ?? graduacao.proximaFaixaSlug ?? faixaSlugAtual)
          : faixaSlugAtual
      const faixaAtualConfig = faixaSlugAtual ? getFaixaConfigBySlug(faixaSlugAtual) : null
      const proximaFaixaConfig = proximaFaixaSlug ? getFaixaConfigBySlug(proximaFaixaSlug) : null
      const faixaAtualNome = faixaAtualConfig?.nome || graduacao.faixaAtual || aluno?.faixa || faixaSlugAtual
      const proximaFaixaNome =
        proximaFaixaConfig?.nome || graduacao.proximaFaixa || graduacao.proximaFaixaSlug || proximaFaixaSlug

      const grauAtual = Math.max(0, Number(aluno?.graus ?? graduacao.grauAtual ?? 0))
      const grauDestino =
        graduacao.tipo === 'Grau'
          ? Math.max(grauAtual, Number(graduacao.grauAlvo ?? grauAtual ?? 0))
          : null

      const atingiuFaixa = graduacao.tipo === 'Faixa' && proximaFaixaSlug === faixaSlugAtual
      const atingiuGrau = graduacao.tipo === 'Grau' && grauDestino !== null && grauAtual >= grauDestino
      const status: GraduacaoStatus = atingiuFaixa || atingiuGrau ? 'Concluído' : graduacao.status

      const recomendacao = aluno
        ? calculateNextStep(aluno as Aluno, { presencas: aluno.presencas })
        : null

      const progressoPorPresenca = recomendacao && recomendacao.tipo === graduacao.tipo
        ? graduacao.tipo === 'Grau'
          ? recomendacao.progressoAulasGrau ?? recomendacao.progressoAulasFaixa ?? null
          : recomendacao.progressoAulasFaixa ?? recomendacao.progressoAulasGrau ?? null
        : null

      const progressoPercentual = status === 'Concluído'
        ? 100
        : progressoPorPresenca ?? calcularProgressoPorTempo(graduacao)

      const aulasFeitas = recomendacao
        ? graduacao.tipo === 'Grau'
          ? recomendacao.aulasRealizadasNoGrau ?? aluno?.attendance?.aulasNoGrauAtual ?? null
          : recomendacao.aulasRealizadasNaFaixa ?? aluno?.attendance?.aulasDesdeUltimaFaixa ?? null
        : aluno?.attendance?.aulasNoGrauAtual ?? null

      const aulasMeta = recomendacao?.aulasMinimasRequeridas ?? null

      const dataPrevista =
        graduacao.previsao ||
        (recomendacao && aluno ? estimateGraduationDate(aluno as Aluno, recomendacao.mesesRestantes ?? 0) : null) ||
        graduacao.dataConclusao ||
        null

      return {
        ...graduacao,
        alunoNome: aluno?.nomeCompleto || graduacao.alunoNome,
        faixaSlugAtual,
        proximaFaixaSlug,
        faixaAtualConfig,
        proximaFaixaConfig,
        faixaAtual: faixaAtualNome,
        proximaFaixa: proximaFaixaNome,
        grauAtual,
        grauDestino,
        status,
        dataPrevista,
        progressoPercentual: progressoPercentual ?? null,
        aulasFeitas,
        aulasMeta
      }
    })
  }, [alunoLookup, graduacoes])

  const faixasDisponiveis = useMemo(() => {
    const slugs = new Set<string>()
    graduacoesView.forEach((item) => {
      if (item.faixaSlugAtual) slugs.add(item.faixaSlugAtual)
      if (item.proximaFaixaSlug) slugs.add(item.proximaFaixaSlug)
    })
    return Array.from(slugs).filter(Boolean)
  }, [graduacoesView])

  return { graduacoes: graduacoesView, alunoLookup, faixasDisponiveis }
}
