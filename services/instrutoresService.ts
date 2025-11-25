import { MOCK_INSTRUTORES } from '@/data/mockInstrutores'
import { normalizeFaixaSlug } from '@/lib/alunoStats'
import type { InstrutorProfile } from '@/types/instrutor'

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

export async function listarInstrutores(): Promise<InstrutorProfile[]> {
  return clone(
    MOCK_INSTRUTORES.map((item) => ({
      id: item.id,
      nome: item.nome,
      nomeCompleto: item.nome,
      email: item.email ?? null,
      faixaSlug: normalizeFaixaSlug(item.faixa),
      graus: item.graus,
      status: item.status,
      avatarUrl: item.avatarUrl ?? null,
      instrutorId: item.id,
      professorId: item.id,
      alunoId: null,
      academiaId: null
    }))
  )
}

export async function buscarInstrutorPorId(id: string): Promise<InstrutorProfile | null> {
  const lista = await listarInstrutores()
  return lista.find((item) => item.id === id) ?? null
}
