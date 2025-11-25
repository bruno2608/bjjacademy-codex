import { useEffect, useMemo } from 'react'

import { normalizeFaixaSlug } from '@/lib/alunoStats'
import { useInstrutoresStore } from '@/store/instrutoresStore'
import { useCurrentUser } from './useCurrentUser'
import type { StaffProfile, StaffRole } from '@/types/user'

const mapRoles = (roles?: string[] | null): StaffRole[] => {
  if (!roles) return []
  return roles
    .map((role) => role.toUpperCase())
    .filter((role): role is StaffRole =>
      ['PROFESSOR', 'INSTRUTOR', 'ADMIN', 'TI'].includes(role)
    )
}

export function useCurrentStaff() {
  const { user } = useCurrentUser()
  const getInstrutorById = useInstrutoresStore((s) => s.getInstrutorById)
  const instrutores = useInstrutoresStore((s) => s.instrutores)
  const hydrated = useInstrutoresStore((s) => s.hydrated)
  const carregarInstrutores = useInstrutoresStore((s) => s.carregar)

  useEffect(() => {
    if (!hydrated && (user?.instrutorId || user?.professorId || instrutores.length === 0)) {
      void carregarInstrutores()
    }
  }, [carregarInstrutores, hydrated, instrutores.length, user?.instrutorId, user?.professorId])

  const staff: StaffProfile | null = useMemo(() => {
    const candidateId = user?.instrutorId || user?.professorId
    const instrutor = candidateId ? getInstrutorById(candidateId) : null
    const fallback = instrutor || instrutores[0]

    if (!fallback && user) {
      const resolvedRoles = mapRoles(user.roles)
      return {
        id: user.id,
        nome: user.nomeCompleto || user.name || 'Instrutor',
        email: user.email || null,
        avatarUrl: user.avatarUrl || null,
        roles: resolvedRoles.length ? resolvedRoles : [],
        faixaSlug: null,
        grauAtual: null,
        status: 'ATIVO',
      }
    }

    if (!fallback) return null

    const faixaSlug = normalizeFaixaSlug(fallback.faixaSlug || fallback.faixa)
    const rolesFromUser = mapRoles(user?.roles)
    const rolesFromFallback = mapRoles(fallback.roles)
    const roles = rolesFromUser.length ? rolesFromUser : rolesFromFallback

    return {
      id: fallback.id,
      nome: fallback.nomeCompleto || fallback.nome,
      email: fallback.email ?? user?.email ?? null,
      avatarUrl: fallback.avatarUrl || user?.avatarUrl || null,
      roles,
      faixaSlug: faixaSlug || null,
      grauAtual: typeof fallback.graus === 'number' ? fallback.graus : null,
      status: (fallback.status?.toUpperCase() as StaffProfile['status']) || 'ATIVO',
      alunosAtivos: fallback.alunosAtivos,
      totalAlunos: fallback.totalAlunos,
      graduacoesPendentes: fallback.graduacoesPendentes,
      checkinsRegistradosSemana: fallback.checkinsRegistradosSemana,
      presencasHoje: fallback.presencasHoje,
      faltasHoje: fallback.faltasHoje,
      pendentesHoje: fallback.pendentesHoje,
    }
  }, [getInstrutorById, instrutores, user])

  return { user, staff }
}
