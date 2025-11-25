import { useEffect, useMemo } from 'react'

import { useAlunosStore } from '@/store/alunosStore'
import { normalizeFaixaSlug } from '@/lib/alunoStats'
import { useInstrutoresStore } from '@/store/instrutoresStore'
import { useCurrentUser } from './useCurrentUser'

export function useCurrentInstrutor() {
  const { user } = useCurrentUser()
  const getAlunoById = useAlunosStore((s) => s.getAlunoById)
  const carregarInstrutores = useInstrutoresStore((s) => s.carregar)
  const getInstrutorById = useInstrutoresStore((s) => s.getInstrutorById)
  const instrutores = useInstrutoresStore((s) => s.instrutores)
  const hydrated = useInstrutoresStore((s) => s.hydrated)

  useEffect(() => {
    if (!hydrated) {
      void carregarInstrutores()
    }
  }, [carregarInstrutores, hydrated])

  const instrutor = useMemo(() => {
    const candidatoId = user?.instrutorId || user?.professorId
    const instrutorAtual = candidatoId ? getInstrutorById(candidatoId) : null
    if (instrutorAtual) {
      return {
        ...instrutorAtual,
        nomeCompleto: instrutorAtual.nomeCompleto || instrutorAtual.nome,
      }
    }

    const alunoPerfil = user?.alunoId ? getAlunoById(user.alunoId) : null
    if (alunoPerfil) {
      return {
        id: user?.instrutorId || alunoPerfil.id,
        nome: alunoPerfil.nome,
        nomeCompleto: alunoPerfil.nomeCompleto || alunoPerfil.nome,
        faixaSlug: normalizeFaixaSlug(alunoPerfil.faixaSlug || alunoPerfil.faixa),
        graus: alunoPerfil.graus ?? 0,
        status: alunoPerfil.status ?? 'Ativo',
        avatarUrl: alunoPerfil.avatarUrl || user?.avatarUrl || null,
        alunoId: alunoPerfil.id,
        instrutorId: user?.instrutorId || null,
        professorId: user?.professorId || null,
        academiaId: alunoPerfil.academiaId ?? null
      }
    }

    if (instrutores[0]) {
      return instrutores[0]
    }

    return null
  }, [getAlunoById, getInstrutorById, instrutores, user?.alunoId, user?.avatarUrl, user?.instrutorId, user?.professorId])

  return { user, instrutor }
}
