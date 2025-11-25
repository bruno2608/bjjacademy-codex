import { useMemo } from 'react'

import { GRADUATION_RULES } from '@/config/graduationRules'
import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils'
import { usePresencasStore } from '@/store/presencasStore'
import { useTreinosStore } from '@/store/treinosStore'
import { useCurrentAluno } from '@/hooks/useCurrentAluno'

export interface AlunoDashboardData {
  aluno: ReturnType<typeof useCurrentAluno>['aluno']
  faixaConfig: ReturnType<typeof getFaixaConfigBySlug>
  faixaSlug: string
  grauAtual: number
  aulasFeitasNoGrau: number
  aulasMetaNoGrau: number | null
  percentual: number | null
  stats: { presentes: number; faltas: number; pendentes: number }
  progressoProximoGrau: { aulasNoGrau: number; alvo: number; percent: number }
  ultimasPresencas: ReturnType<typeof usePresencasStore>['presencas']
  statusLabel: string
  treinoPorId: Map<string, { id: string; nome: string; hora?: string }>
}

export function useAlunoDashboard(): AlunoDashboardData {
  const { aluno } = useCurrentAluno()
  const presencas = usePresencasStore((state) => state.presencas)
  const treinos = useTreinosStore((state) => state.treinos)

  const faixaSlug = aluno?.faixaSlug || aluno?.faixa || 'branca-adulto'
  const faixaConfig = getFaixaConfigBySlug(faixaSlug) || getFaixaConfigBySlug('branca-adulto')
  const grauAtual = aluno?.graus ?? faixaConfig?.grausMaximos ?? 0

  const regra = useMemo(
    () => Object.values(GRADUATION_RULES).find((rule) => rule.faixaSlug === faixaSlug) ?? null,
    [faixaSlug]
  )

  const aulasFeitasNoGrau = Number.isFinite(aluno?.aulasNoGrauAtual)
    ? Number(aluno?.aulasNoGrauAtual)
    : presencas.filter((item) => item.alunoId === aluno?.id && item.status === 'PRESENTE').length
  const aulasMetaNoGrau =
    regra?.graus?.[Math.min(grauAtual, Math.max(0, (regra?.graus?.length ?? 1) - 1))]?.aulasMinimas ??
    regra?.aulasMinimas ??
    null

  const percentual =
    typeof aulasMetaNoGrau === 'number' && aulasMetaNoGrau > 0
      ? Math.min(100, Math.round((aulasFeitasNoGrau / aulasMetaNoGrau) * 100))
      : null

  const stats = useMemo(() => {
    const registrosAluno = presencas.filter((item) => item.alunoId === aluno?.id)
    const presentes = registrosAluno.filter((item) => item.status === 'PRESENTE').length
    const faltas = registrosAluno.filter((item) => item.status === 'FALTA').length
    const pendentes = registrosAluno.filter((item) => item.status === 'PENDENTE').length
    return { presentes, faltas, pendentes }
  }, [aluno?.id, presencas])

  const progressoProximoGrau = useMemo(() => {
    const aulasNoGrau = aulasFeitasNoGrau || 0
    const alvo = aulasMetaNoGrau ?? 20
    const percent = alvo > 0 ? Math.min(100, Math.round((aulasNoGrau / alvo) * 100)) : 0
    return { aulasNoGrau, alvo, percent }
  }, [aulasFeitasNoGrau, aulasMetaNoGrau])

  const ultimasPresencas = useMemo(
    () =>
      presencas
        .filter((item) => item.alunoId === aluno?.id)
        .slice(-5)
        .reverse(),
    [aluno?.id, presencas]
  )

  const statusLabel = useMemo(() => {
    const raw = aluno?.status || 'ativo'
    return raw.charAt(0).toUpperCase() + raw.slice(1)
  }, [aluno?.status])

  const treinoPorId = useMemo(() => {
    const map = new Map<string, { id: string; nome: string; hora?: string }>()
    treinos.forEach((treino) => map.set(treino.id, treino))
    return map
  }, [treinos])

  return {
    aluno,
    faixaConfig,
    faixaSlug: faixaConfig?.slug || faixaSlug,
    grauAtual,
    aulasFeitasNoGrau,
    aulasMetaNoGrau,
    percentual,
    stats,
    progressoProximoGrau,
    ultimasPresencas,
    statusLabel,
    treinoPorId
  }
}
