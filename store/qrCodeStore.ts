import { create } from 'zustand'

import {
  gerarNovoQrCode,
  getQrCodeAtualDaAcademia,
  listarValidacoesPorAcademia,
  registrarValidacaoQr,
  snapshotQrCodes,
  snapshotQrValidations,
} from '@/services/qrCodeService'
import type { AcademiaQrCode, QrCodeValidationLog, QrValidationStatus } from '@/types/qrCode'

interface QrCodeState {
  qrAtual: AcademiaQrCode | null
  validacoes: QrCodeValidationLog[]
  carregado: boolean
  carregarEstadoInicial: (academiaId: string) => Promise<void>
  gerarNovoQr: (academiaId: string) => Promise<AcademiaQrCode | null>
  registrarValidacaoFake: (
    academiaId: string,
    resultado: QrValidationStatus,
    mensagem: string
  ) => Promise<QrCodeValidationLog | null>
  marcarExpirado: (qrCodeId: string) => void
}

const initialState = {
  qrAtual: snapshotQrCodes()[0] ?? null,
  validacoes: snapshotQrValidations(),
  carregado: false,
}

export const useQrCodeStore = create<QrCodeState>((set, get) => ({
  ...initialState,
  carregarEstadoInicial: async (academiaId) => {
    const [qrAtual, validacoes] = await Promise.all([
      getQrCodeAtualDaAcademia(academiaId),
      listarValidacoesPorAcademia(academiaId),
    ])
    set({ qrAtual, validacoes, carregado: true })
  },
  gerarNovoQr: async (academiaId) => {
    const qr = await gerarNovoQrCode(academiaId)
    set({ qrAtual: qr })
    return qr
  },
  registrarValidacaoFake: async (academiaId, resultado, mensagem) => {
    const qrCodeId = get().qrAtual?.id
    if (!qrCodeId) return null

    const registro = await registrarValidacaoQr({ academiaId, resultado, mensagem, qrCodeId })
    set((state) => ({ validacoes: [registro, ...state.validacoes] }))
    return registro
  },
  marcarExpirado: (qrCodeId) => {
    set((state) =>
      state.qrAtual && state.qrAtual.id === qrCodeId
        ? { qrAtual: { ...state.qrAtual, status: 'EXPIRADO' as const } }
        : state
    )
  },
}))
