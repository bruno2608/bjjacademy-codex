import { useMemo } from 'react'

import { normalizeFaixaSlug } from '@/lib/alunoStats'
import { useAlunosStore } from '@/store/alunosStore'
import { useCurrentUser } from './useCurrentUser'
import type { StaffProfile } from '@/types/user'

const normalizarStatus = (status?: string | null): StaffProfile['status'] => {
  if (!status) return 'ATIVO'
  const normalizado = status.toString().toUpperCase()
  return normalizado === 'INATIVO' ? 'INATIVO' : 'ATIVO'
}

export function useCurrentStaff() {
  const { user } = useCurrentUser()
  const getAlunoById = useAlunosStore((s) => s.getAlunoById)

  const staff: StaffProfile | null = useMemo(() => {
    if (!user) return null

    const aluno = user.alunoId ? getAlunoById(user.alunoId) : null
    const faixaSlug = normalizeFaixaSlug(aluno?.faixaSlug || aluno?.faixa)
    const grauAtual = typeof aluno?.graus === 'number' ? aluno.graus : null

    return {
      id: user.id,
      nome: aluno?.nomeCompleto || aluno?.nome || user.nomeCompleto || user.name || 'Instrutor',
      email: aluno?.email ?? user.email ?? null,
      avatarUrl: aluno?.avatarUrl ?? user.avatarUrl ?? null,
      roles: user.roles || [],
      alunoId: aluno?.id ?? user.alunoId ?? null,
      faixaSlug: faixaSlug || null,
      grauAtual: grauAtual ?? null,
      status: normalizarStatus(aluno?.status),
      academiaId: aluno?.academiaId ?? user.academiaId ?? null,
    }
  }, [getAlunoById, user])

  return { user, staff }
}
