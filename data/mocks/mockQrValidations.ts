import type { QrCodeValidationLog } from '@/types/qrCode'

const agora = new Date()

export const MOCK_QR_VALIDATIONS: QrCodeValidationLog[] = [
  {
    id: 'qr-log-1',
    qrCodeId: 'qr-0',
    academiaId: 'academia-001',
    resultado: 'SUCESSO',
    mensagem: 'QR Code válido e dentro do prazo.',
    criadoEm: new Date(agora.getTime() - 3 * 60 * 1000).toISOString(),
  },
  {
    id: 'qr-log-2',
    qrCodeId: 'qr-0',
    academiaId: 'academia-001',
    resultado: 'FALHA',
    mensagem: 'QR Code expirado ou inválido.',
    criadoEm: new Date(agora.getTime() - 2 * 60 * 1000).toISOString(),
  },
]
