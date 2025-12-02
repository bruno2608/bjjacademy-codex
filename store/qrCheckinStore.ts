import { create } from 'zustand'

import type { MockQrAcademia, MockQrValidacao, QrCheckinResultado } from '@/data/mocks/mockQrCheckin'
import {
  getQrAcademiaAtual,
  listarValidacoesQr,
  regenerarQrAcademia,
  registrarValidacaoSimulada,
} from '@/services/qrCheckinService'

interface QrCheckinState {
  qrAtual: MockQrAcademia | null
  expiresIn: number
  isActive: boolean
  validations: MockQrValidacao[]
  ultimaValidacao: MockQrValidacao | null
  loadInitial: () => void
  generateNewQr: () => void
  tick: () => void
  registerValidation: (resultado: QrCheckinResultado, motivo: string, alunoNome?: string) => void
}

const calculateExpires = (qr: MockQrAcademia | null) => {
  if (!qr?.expiresAt) return 0
  const diff = Math.floor((new Date(qr.expiresAt).getTime() - Date.now()) / 1000)
  return Math.max(0, diff)
}

export const useQrCheckinStore = create<QrCheckinState>((set, get) => ({
  qrAtual: null,
  expiresIn: 0,
  isActive: false,
  validations: [],
  ultimaValidacao: null,
  loadInitial: () => {
    const qr = getQrAcademiaAtual()
    const validations = listarValidacoesQr()
    const expiresIn = calculateExpires(qr) || 60
    set({
      qrAtual: qr,
      validations,
      ultimaValidacao: validations[0] ?? null,
      expiresIn,
      isActive: expiresIn > 0,
    })
  },
  generateNewQr: () => {
    const qr = regenerarQrAcademia()
    set({ qrAtual: qr, expiresIn: 60, isActive: true })
  },
  tick: () => {
    const { expiresIn } = get()
    if (expiresIn <= 0) {
      set({ expiresIn: 0, isActive: false })
      return
    }
    const next = Math.max(0, expiresIn - 1)
    set({ expiresIn: next, isActive: next > 0 })
  },
  registerValidation: (resultado, motivo, alunoNome = 'Visitante') => {
    const registro = registrarValidacaoSimulada(resultado, motivo, alunoNome)
    set((state) => ({
      validations: [registro, ...state.validations],
      ultimaValidacao: registro,
    }))
  },
}))
