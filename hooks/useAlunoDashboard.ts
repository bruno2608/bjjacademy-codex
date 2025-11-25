import { useMemo } from 'react'

import { GRADUATION_RULES } from '@/config/graduationRules'
import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils'
import { useAlunosStore } from '@/store/alunosStore'
import { usePresencasStore } from '@/store/presencasStore'

export function useAlunoDashboard(alunoId?: string | null) {
  const alunos = useAlunosStore((s) => s.alunos)
  const getAlunoById = useAlunosStore((s) => s.getAlunoById)
  const presencas = usePresencasStore((s) => s.presencas) // mantém sincronizado com stats recalculadas

  const aluno = useMemo(() => {
    if (alunoId) {
      return getAlunoById(alunoId)
    }
    return alunos[0] ?? null
  }, [alunoId, alunos, getAlunoById])

  const faixaSlug = aluno?.faixaSlug ?? 'branca-adulto'
  const faixaConfig =
    getFaixaConfigBySlug(faixaSlug) || getFaixaConfigBySlug('branca-adulto')
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

  return {
    aluno,
    faixaConfig,
    faixaSlug: faixaConfig?.slug || faixaSlug,
    grauAtual,
    aulasFeitasNoGrau,
    aulasMetaNoGrau,
    percentual
  }
}
