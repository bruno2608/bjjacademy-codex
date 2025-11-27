import { create } from 'zustand'

import {
  atualizarStatusPresenca,
  criarPresenca,
  fecharAula as serviceFecharAula,
  fecharTreino as serviceFecharTreino,
  listarPresencasPorAluno,
  listarPresencasPorAula,
  listarPresencasPorTreino,
  listarTodasPresencas,
  registrarCheckin as serviceRegistrarCheckin,
  registrarOuAtualizarPresenca,
  removerPresenca,
  snapshotPresencas,
} from '@/services/presencasService'
import type { PresencaOrigem, PresencaRegistro, PresencaStatus } from '@/types/presenca'
import { useAlunosStore } from './alunosStore'
import { useAulasStore } from './aulasStore'

const hoje = () => new Date().toISOString().split('T')[0]

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
  carregarPorAula: (aulaId: string) => Promise<void>
  registrarCheckin: (payload: RegistroCheckinPayload) => Promise<{ registro: PresencaRegistro | null; status: CheckinStatus }>
  registrarPresencaEmAula: (
    payload: Omit<PresencaRegistro, 'id' | 'createdAt' | 'updatedAt' | 'origem'> & { status?: PresencaStatus; origem?: PresencaOrigem }
  ) => Promise<PresencaRegistro>
  salvarPresenca: (presenca: Omit<PresencaRegistro, 'createdAt' | 'updatedAt'> & { createdAt?: string; updatedAt?: string }) =>
    Promise<PresencaRegistro>
  atualizarStatus: (
    id: string,
    status: PresencaStatus,
    observacao?: string,
  ) => Promise<PresencaRegistro | null>
  excluirPresenca: (id: string) => Promise<void>
  fecharTreino: (treinoId: string) => Promise<void>
  fecharAula: (aulaId: string, turmaId?: string) => Promise<void>
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
  carregarPorAula: async (aulaId) => {
    const lista = await listarPresencasPorAula(aulaId)
    const combinadas = [...get().presencas.filter((item) => item.aulaId !== aulaId), ...lista]
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
  registrarPresencaEmAula: async (payload) => {
    const registro = await registrarOuAtualizarPresenca({
      alunoId: payload.alunoId,
      turmaId: payload.turmaId ?? payload.treinoId,
      aulaId: payload.aulaId ?? '',
      status: payload.status,
      origem: payload.origem ?? 'PROFESSOR',
      data: payload.data,
    })

    const atualizadas = [...get().presencas.filter((item) => item.id !== registro.id), registro]
    set({ presencas: atualizadas })
    syncAlunos(atualizadas)
    return registro
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
  fecharAula: async (aulaId, turmaId) => {
    await serviceFecharAula(aulaId)
    const lista = snapshotPresencas()
    set({ presencas: lista })
    syncAlunos(lista)
    if (aulaId) {
      useAulasStore.getState().atualizarStatusLocal(aulaId, 'encerrada')
    }
    if (turmaId) {
      get().marcarTreinoFechado(hoje(), turmaId)
    }
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
