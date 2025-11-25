import { create } from 'zustand'

import type { InstrutorProfile } from '@/types/instrutor'
import { buscarInstrutorPorId, listarInstrutores } from '@/services/instrutoresService'

type InstrutoresState = {
  instrutores: InstrutorProfile[]
  hydrated: boolean
  carregar: () => Promise<void>
  getInstrutorById: (id: string) => InstrutorProfile | null
}

export const useInstrutoresStore = create<InstrutoresState>((set, get) => ({
  instrutores: [],
  hydrated: false,
  carregar: async () => {
    const lista = await listarInstrutores()
    set({ instrutores: lista, hydrated: true })
  },
  getInstrutorById: (id: string) => {
    const cached = get().instrutores.find((item) => item.id === id)
    if (cached) return cached
    return null
  }
}))

export async function buscarInstrutor(id: string): Promise<InstrutorProfile | null> {
  const cached = useInstrutoresStore.getState().getInstrutorById(id)
  if (cached) return cached
  const resolved = await buscarInstrutorPorId(id)
  if (resolved) {
    const state = useInstrutoresStore.getState()
    useInstrutoresStore.setState({ instrutores: [...state.instrutores, resolved] })
  }
  return resolved
}
