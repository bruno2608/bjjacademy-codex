import type { AcademiaQrCode } from '@/types/qrCode'

const agora = new Date()
const daquiUmMinuto = new Date(agora.getTime() + 60 * 1000)

export const MOCK_QR_CODES: AcademiaQrCode[] = [
  {
    id: 'qr-1',
    academiaId: 'academia-001',
    codigo: 'BJJACADEMIA-QR-001',
    status: 'ATIVO',
    criadoEm: agora.toISOString(),
    expiresAt: daquiUmMinuto.toISOString(),
  },
  {
    id: 'qr-0',
    academiaId: 'academia-001',
    codigo: 'BJJACADEMIA-QR-000',
    status: 'EXPIRADO',
    criadoEm: new Date(agora.getTime() - 5 * 60 * 1000).toISOString(),
    expiresAt: new Date(agora.getTime() - 2 * 60 * 1000).toISOString(),
  },
]
