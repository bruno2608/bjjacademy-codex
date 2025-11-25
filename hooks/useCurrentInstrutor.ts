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
  const atualizarInstrutor = useInstrutoresStore((s) => s.atualizar)
  const instrutores = useInstrutoresStore((s) => s.instrutores)
  const hydrated = useInstrutoresStore((s) => s.hydrated)

  useEffect(() => {
    if (!hydrated && (user?.instrutorId || user?.professorId || instrutores.length === 0)) {
      void carregarInstrutores()
    }
  }, [carregarInstrutores, hydrated, instrutores.length, user?.instrutorId, user?.professorId])

  useEffect(() => {
    const candidatoId = user?.instrutorId || user?.professorId
    if (!candidatoId) return
    const atual = getInstrutorById(candidatoId)
    if (!atual) return

    const nomeResolvido = user?.nomeCompleto || atual.nomeCompleto || atual.nome
    const avatarResolvido = atual.avatarUrl || user?.avatarUrl || null
    const emailResolvido = atual.email ?? user?.email ?? null

    if (
      nomeResolvido !== atual.nomeCompleto ||
      avatarResolvido !== atual.avatarUrl ||
      emailResolvido !== atual.email
    ) {
      void atualizarInstrutor(candidatoId, {
        nome: nomeResolvido,
        nomeCompleto: nomeResolvido,
        avatarUrl: avatarResolvido,
        email: emailResolvido,
        roles: user?.roles,
      })
    }
  }, [
    atualizarInstrutor,
    getInstrutorById,
    instrutores.length,
    user?.avatarUrl,
    user?.email,
    user?.instrutorId,
    user?.nomeCompleto,
    user?.professorId,
    user?.roles,
  ])

  const instrutor = useMemo(() => {
    const candidatoId = user?.instrutorId || user?.professorId
    const instrutorAtual = candidatoId ? getInstrutorById(candidatoId) : null
    if (instrutorAtual) {
      const nomeResolvido = user?.nomeCompleto || instrutorAtual.nomeCompleto || instrutorAtual.nome
      const avatarResolvido = instrutorAtual.avatarUrl || user?.avatarUrl || null
      const emailResolvido = instrutorAtual.email ?? user?.email ?? null
      return {
        ...instrutorAtual,
        nome: nomeResolvido || instrutorAtual.nome,
        nomeCompleto: nomeResolvido || instrutorAtual.nome,
        avatarUrl: avatarResolvido,
        email: emailResolvido,
        roles: user?.roles || instrutorAtual.roles,
      }
    }

    const alunoPerfil = !candidatoId && user?.alunoId ? getAlunoById(user.alunoId) : null
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

    if (!candidatoId && instrutores[0]) {
      return instrutores[0]
    }

    return null
  }, [
    getAlunoById,
    getInstrutorById,
    instrutores,
    user?.alunoId,
    user?.avatarUrl,
    user?.instrutorId,
    user?.professorId
  ])

  return { user, instrutor }
}
