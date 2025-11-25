import { MOCK_INSTRUTORES } from '@/data/mockInstrutores'
import { normalizeFaixaSlug } from '@/lib/alunoStats'
import type { InstrutorProfile } from '@/types/instrutor'

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value))

let instrutoresCache: InstrutorProfile[] | null = null

const seedCache = () =>
  clone(
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

const ensureCache = (): InstrutorProfile[] => {
  if (!instrutoresCache) {
    instrutoresCache = seedCache()
  }
  return instrutoresCache
}

export async function listarInstrutores(): Promise<InstrutorProfile[]> {
  return clone(ensureCache())
}

export async function buscarInstrutorPorId(id: string): Promise<InstrutorProfile | null> {
  const lista = ensureCache()
  const encontrado = lista.find((item) => item.id === id)
  return encontrado ? clone(encontrado) : null
}

export async function atualizarInstrutor(
  id: string,
  payload: Partial<InstrutorProfile>
): Promise<InstrutorProfile | null> {
  const lista = ensureCache()
  const index = lista.findIndex((item) => item.id === id)
  if (index === -1) return null

  const atual = lista[index]
  const atualizado: InstrutorProfile = {
    ...atual,
    ...payload,
    nome: payload.nome || payload.nomeCompleto || atual.nome,
    nomeCompleto: payload.nomeCompleto || payload.nome || atual.nomeCompleto || atual.nome,
    faixaSlug: normalizeFaixaSlug(payload.faixaSlug || atual.faixaSlug)
  }

  lista[index] = atualizado
  instrutoresCache = lista
  return clone(atualizado)
}
