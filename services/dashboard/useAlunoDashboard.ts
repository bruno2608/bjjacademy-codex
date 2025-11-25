import { useMemo } from 'react'

import { GRADUATION_RULES } from '@/config/graduationRules'
import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils'
import { buildAttendanceSnapshot, normalizeFaixaSlug } from '@/lib/alunoStats'
import { calculateNextStep, estimateGraduationDate } from '@/lib/graduationRules'
import { useCurrentAluno } from '@/hooks/useCurrentAluno'
import { useAlunosStore } from '@/store/alunosStore'
import { usePresencasStore } from '@/store/presencasStore'
import { useTreinosStore } from '@/store/treinosStore'
import type { BjjBeltVisualConfig } from '@/types/bjjBelt'
import type { Aluno } from '@/types/aluno'
import type { GraduationRecommendation } from '@/types/graduacao'
import type { Presenca } from '@/types/presenca'

export interface AlunoDashboardData {
  aluno: Aluno | null
  faixaConfig: BjjBeltVisualConfig
  grauAtual: number
  faixaSlug: string

  aulasNoGrau: number
  aulasMetaNoGrau: number
  percentualProgresso: number

  totalPresencasConfirmadas: number
  totalFaltas: number
  totalPendentes: number

  ultimaPresenca?: Presenca | null
  ultimasPresencas: Presenca[]
  treinoPorId: Map<string, { id: string; nome: string; hora?: string }>

  proximaGraduacao: GraduationRecommendation | null
  proximaGraduacaoLabel: string
  proximaGraduacaoEstimativa: string | null
  proximaGraduacaoPercentual: number | null
  proximaGraduacaoAulasRealizadas: number | null
  proximaGraduacaoAulasMinimas: number | null
}

export function useAlunoDashboard(alunoId?: string): AlunoDashboardData {
  const { aluno: alunoFromUser } = useCurrentAluno()
  const alunos = useAlunosStore((state) => state.alunos)
  const presencas = usePresencasStore((state) => state.presencas)
  const treinos = useTreinosStore((state) => state.treinos)

  const aluno = useMemo<Aluno | null>(() => {
    if (alunoId) {
      return alunos.find((item) => item.id === alunoId) ?? null
    }
    return alunoFromUser ?? null
  }, [alunoFromUser, alunoId, alunos])

  const faixaSlug = useMemo(
    () => normalizeFaixaSlug(aluno?.faixaSlug || aluno?.faixa || 'branca-adulto'),
    [aluno?.faixa, aluno?.faixaSlug]
  )

  const faixaConfig = useMemo(
    () => getFaixaConfigBySlug(faixaSlug) || getFaixaConfigBySlug('branca-adulto')!,
    [faixaSlug]
  )

  const grauAtual = useMemo(() => Math.max(0, Number(aluno?.graus ?? 0)), [aluno?.graus])

  const regra = useMemo(
    () =>
      Object.values(GRADUATION_RULES).find(
        (rule) => normalizeFaixaSlug(rule.faixaSlug) === faixaSlug
      ) ?? null,
    [faixaSlug]
  )

  const presencasDoAluno = useMemo(
    () => presencas.filter((item) => item.alunoId === aluno?.id),
    [aluno?.id, presencas]
  )

  const attendanceSnapshot = useMemo(
    () => (aluno ? buildAttendanceSnapshot(aluno, presencasDoAluno) : null),
    [aluno, presencasDoAluno]
  )

  const aulasNoGrau = attendanceSnapshot?.aulasNoGrauAtual ?? aluno?.aulasNoGrauAtual ?? 0
  const grausRegra = regra?.graus ?? []
  const grauIndex = Math.min(Math.max(grauAtual, 0), Math.max(grausRegra.length - 1, 0))
  const aulasMetaNoGrau = grausRegra[grauIndex]?.aulasMinimas ?? regra?.aulasMinimas ?? 20

  const percentualProgresso = aulasMetaNoGrau > 0
    ? Math.min(100, Math.round((aulasNoGrau / aulasMetaNoGrau) * 100))
    : 0

  const totalPresencasConfirmadas = useMemo(
    () => presencasDoAluno.filter((item) => item.status === 'PRESENTE').length,
    [presencasDoAluno]
  )
  const totalFaltas = useMemo(
    () => presencasDoAluno.filter((item) => item.status === 'FALTA').length,
    [presencasDoAluno]
  )
  const totalPendentes = useMemo(
    () => presencasDoAluno.filter((item) => item.status === 'PENDENTE').length,
    [presencasDoAluno]
  )

  const ultimasPresencas = useMemo(() => {
    const ordenadas = [...presencasDoAluno].sort((a, b) => {
      const dataA = new Date(a.data || '').getTime()
      const dataB = new Date(b.data || '').getTime()
      return dataB - dataA
    })
    return ordenadas.slice(0, 5)
  }, [presencasDoAluno])

  const ultimaPresenca = ultimasPresencas[0] ?? null

  const treinoPorId = useMemo(() => {
    const map = new Map<string, { id: string; nome: string; hora?: string }>()
    treinos.forEach((treino) => map.set(treino.id, treino))
    return map
  }, [treinos])

  const proximaGraduacao = useMemo(
    () => (aluno ? calculateNextStep(aluno, { presencas: presencasDoAluno }) : null),
    [aluno, presencasDoAluno]
  )

  const proximaGraduacaoLabel = useMemo(() => {
    if (!proximaGraduacao) return 'Em avaliação pela equipe'
    if (proximaGraduacao.tipo === 'Grau') {
      return `${proximaGraduacao.grauAlvo}º grau em ${proximaGraduacao.faixaAtual}`
    }
    return `${proximaGraduacao.faixaAtual} → ${proximaGraduacao.proximaFaixa}`
  }, [proximaGraduacao])

  const proximaGraduacaoEstimativa = useMemo(() => {
    if (!aluno || proximaGraduacao?.mesesRestantes == null) return null
    const estimada = estimateGraduationDate(aluno, proximaGraduacao.mesesRestantes)
    const parsed = new Date(estimada)
    if (Number.isNaN(parsed.getTime())) return null
    return parsed.toISOString().split('T')[0]
  }, [aluno, proximaGraduacao?.mesesRestantes])

  const proximaGraduacaoPercentual = useMemo(() => {
    if (!proximaGraduacao) return percentualProgresso
    const percentual =
      proximaGraduacao.tipo === 'Grau'
        ? proximaGraduacao.progressoAulasGrau
        : proximaGraduacao.progressoAulasFaixa
    return percentual ?? percentualProgresso
  }, [percentualProgresso, proximaGraduacao])

  const proximaGraduacaoAulasRealizadas = useMemo(() => {
    if (!proximaGraduacao) return aulasNoGrau
    if (proximaGraduacao.tipo === 'Grau')
      return proximaGraduacao.aulasRealizadasNoGrau ?? aulasNoGrau
    return proximaGraduacao.aulasRealizadasNaFaixa ?? aluno?.aulasDesdeUltimaFaixa ?? aulasNoGrau
  }, [aluno?.aulasDesdeUltimaFaixa, aulasNoGrau, proximaGraduacao])

  const proximaGraduacaoAulasMinimas = useMemo(() => {
    if (!proximaGraduacao) return aulasMetaNoGrau
    return proximaGraduacao.aulasMinimasRequeridas ?? aulasMetaNoGrau
  }, [aulasMetaNoGrau, proximaGraduacao])

  return {
    aluno,
    faixaConfig,
    grauAtual,
    faixaSlug: faixaConfig.slug,
    aulasNoGrau,
    aulasMetaNoGrau,
    percentualProgresso,
    totalPresencasConfirmadas,
    totalFaltas,
    totalPendentes,
    ultimaPresenca,
    ultimasPresencas,
    treinoPorId,
    proximaGraduacao,
    proximaGraduacaoLabel,
    proximaGraduacaoEstimativa,
    proximaGraduacaoPercentual,
    proximaGraduacaoAulasRealizadas,
    proximaGraduacaoAulasMinimas
  }
}
