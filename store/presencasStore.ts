import { create } from 'zustand'

import {
  atualizarStatusPresenca,
  criarPresenca,
  fecharTreino as serviceFecharTreino,
  listarPresencasPorAluno,
  listarPresencasPorTreino,
  listarTodasPresencas,
  registrarCheckin as serviceRegistrarCheckin,
  removerPresenca,
  snapshotPresencas,
} from '@/services/presencasService'
import type { PresencaRegistro, PresencaStatus } from '@/types/presenca'
import { useAlunosStore } from './alunosStore'

type RegistroCheckinPayload = {
  alunoId: string
  treinoId: string
  data?: string
  horaInicio?: string
}

type CheckinStatus = 'checkin' | 'pendente' | 'duplicado' | 'fechado'

type PresencasState = {
  presencas: PresencaRegistro[]
  treinosFechados: Record<string, 'FECHADO_MANUAL'>
  setPresencas: (presencas: PresencaRegistro[]) => void
  carregarTodas: () => Promise<void>
  carregarPorAluno: (alunoId: string) => Promise<void>
  carregarPorTreino: (treinoId: string) => Promise<void>
  registrarCheckin: (payload: RegistroCheckinPayload) => Promise<{ registro: PresencaRegistro | null; status: CheckinStatus }>
  salvarPresenca: (presenca: Omit<PresencaRegistro, 'createdAt' | 'updatedAt'> & { createdAt?: string; updatedAt?: string }) => Promise<PresencaRegistro>
  atualizarStatus: (
    id: string,
    status: PresencaStatus,
    observacao?: string,
  ) => Promise<PresencaRegistro | null>
  excluirPresenca: (id: string) => Promise<void>
  fecharTreino: (treinoId: string) => Promise<void>
  marcarTreinoFechado: (data: string, treinoId: string | null) => void
  isTreinoFechado: (data: string, treinoId: string | null) => boolean
}

const syncAlunos = (presencas: PresencaRegistro[]) => {
  useAlunosStore.getState().recalculateFromPresencas(presencas)
}

const initialPresencas = snapshotPresencas()

export const usePresencasStore = create<PresencasState>((set, get) => ({
  presencas: initialPresencas,
  treinosFechados: {},
  setPresencas: (presencas) => {
    set({ presencas })
    syncAlunos(presencas)
  },
  carregarTodas: async () => {
    const lista = await listarTodasPresencas()
    set({ presencas: lista })
    syncAlunos(lista)
  },
  carregarPorAluno: async (alunoId) => {
    const lista = await listarPresencasPorAluno(alunoId)
    const outras = get().presencas.filter((item) => item.alunoId !== alunoId)
    const combinadas = [...outras, ...lista]
    set({ presencas: combinadas })
    syncAlunos(combinadas)
  },
  carregarPorTreino: async (treinoId) => {
    const lista = await listarPresencasPorTreino(treinoId)
    const combinadas = [...get().presencas.filter((item) => item.treinoId !== treinoId), ...lista]
    set({ presencas: combinadas })
    syncAlunos(combinadas)
  },
  registrarCheckin: async (payload) => {
    const sessionKey = `${payload.data || ''}::${payload.treinoId || 'principal'}`
    if (get().treinosFechados[sessionKey]) {
      return { registro: null, status: 'fechado' }
    }

    const existente = get().presencas.find(
      (item) => item.alunoId === payload.alunoId && item.treinoId === payload.treinoId && item.data === payload.data
    )

    if (existente && ['PENDENTE', 'PRESENTE'].includes(existente.status)) {
      return { registro: existente, status: 'duplicado' }
    }

    const registro = await serviceRegistrarCheckin(payload.alunoId, payload.treinoId, payload.data)
    const atualizadas = [...get().presencas.filter((item) => item.id !== registro.id), registro]
    set({ presencas: atualizadas })
    syncAlunos(atualizadas)
    return { registro, status: 'checkin' }
  },
  salvarPresenca: async (presenca) => {
    const registro = await criarPresenca(presenca)
    const atualizadas = [...get().presencas.filter((item) => item.id !== registro.id), registro]
    set({ presencas: atualizadas })
    syncAlunos(atualizadas)
    return registro
  },
  atualizarStatus: async (id, status, observacao) => {
    const registro = await atualizarStatusPresenca(id, status, observacao)
    const atualizadas = get().presencas.some((item) => item.id === id)
      ? get().presencas.map((item) => (item.id === id ? registro : item))
      : [...get().presencas, registro]
    set({ presencas: atualizadas })
    syncAlunos(atualizadas)
    return registro
  },
  excluirPresenca: async (id) => {
    await removerPresenca(id)
    const atualizadas = get().presencas.filter((item) => item.id !== id)
    set({ presencas: atualizadas })
    syncAlunos(atualizadas)
  },
  fecharTreino: async (treinoId) => {
    await serviceFecharTreino(treinoId)
    const lista = snapshotPresencas()
    set({ presencas: lista })
    syncAlunos(lista)
  },
  marcarTreinoFechado: (data, treinoId) => {
    set((state) => ({
      treinosFechados: {
        ...state.treinosFechados,
        [`${data}::${treinoId || 'principal'}`]: 'FECHADO_MANUAL',
      },
    }))
  },
  isTreinoFechado: (data, treinoId) => {
    const sessionKey = `${data || ''}::${treinoId || 'principal'}`
    return Boolean(get().treinosFechados[sessionKey])
  },
}))

syncAlunos(initialPresencas)
