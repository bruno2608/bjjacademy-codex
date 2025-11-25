import { useMemo } from 'react'

import { MOCK_INSTRUTORES } from '@/data/mockInstrutores'
import { useAlunosStore } from '@/store/alunosStore'
import { normalizeFaixaSlug } from '@/lib/alunoStats'
import { useCurrentUser } from './useCurrentUser'

export function useCurrentInstrutor() {
  const { user } = useCurrentUser()
  const getAlunoById = useAlunosStore((s) => s.getAlunoById)

  const instrutor = useMemo(() => {
    const alunoPerfil = user?.alunoId ? getAlunoById(user.alunoId) : null
    if (alunoPerfil) {
      return {
        id: user?.instrutorId || alunoPerfil.id,
        nome: alunoPerfil.nome,
        faixaSlug: normalizeFaixaSlug(alunoPerfil.faixaSlug || alunoPerfil.faixa),
        graus: alunoPerfil.graus ?? 0,
        status: alunoPerfil.status ?? 'Ativo',
        avatarUrl: alunoPerfil.avatarUrl || user?.avatarUrl || null
      }
    }

    const fallback = MOCK_INSTRUTORES[0]
    if (fallback) {
      return {
        id: fallback.id,
        nome: fallback.nome,
        faixaSlug: normalizeFaixaSlug(fallback.faixa),
        graus: fallback.graus,
        status: fallback.status,
        avatarUrl: fallback.avatarUrl || user?.avatarUrl || null
      }
    }

    return null
  }, [getAlunoById, user?.alunoId, user?.avatarUrl, user?.instrutorId])

  return { user, instrutor }
}
