export type QrCodeStatus = 'ATIVO' | 'EXPIRADO'

export interface AcademiaQrCode {
  id: string
  academiaId: string
  codigo: string
  expiresAt: string
  status: QrCodeStatus
  criadoEm: string
}

export type QrValidationStatus = 'SUCESSO' | 'FALHA'

export interface QrCodeValidationLog {
  id: string
  qrCodeId: string
  academiaId: string
  resultado: QrValidationStatus
  mensagem: string
  criadoEm: string
}
