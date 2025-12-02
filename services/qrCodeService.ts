import { MOCK_QR_CODES } from '@/data/mocks/mockQrCodes'
import { MOCK_QR_VALIDATIONS } from '@/data/mocks/mockQrValidations'
import type { AcademiaQrCode, QrCodeValidationLog, QrValidationStatus } from '@/types/qrCode'

let qrCodesDb: AcademiaQrCode[] = [...MOCK_QR_CODES]
let qrValidationsDb: QrCodeValidationLog[] = [...MOCK_QR_VALIDATIONS]

const cloneCodes = (lista: AcademiaQrCode[]) => lista.map((item) => ({ ...item }))
const cloneValidations = (lista: QrCodeValidationLog[]) => lista.map((item) => ({ ...item }))

const agoraIso = () => new Date().toISOString()

const gerarCodigoAleatorio = () => {
  const token = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `${token}-${Date.now()}`
}

const gerarId = () => `qr-${Math.random().toString(16).slice(2)}-${Date.now()}`

const normalizarStatus = (codigo: AcademiaQrCode): AcademiaQrCode => {
  const expirado = new Date(codigo.expiresAt).getTime() < Date.now()
  if (expirado && codigo.status !== 'EXPIRADO') {
    return { ...codigo, status: 'EXPIRADO' }
  }
  return codigo
}

export async function getQrCodeAtualDaAcademia(academiaId: string): Promise<AcademiaQrCode | null> {
  const codigosAcademia = qrCodesDb.filter((item) => item.academiaId === academiaId)
  if (!codigosAcademia.length) return null

  const ordenados = codigosAcademia.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
  const atualizado = normalizarStatus(ordenados[0])
  qrCodesDb = qrCodesDb.map((item) => (item.id === atualizado.id ? atualizado : item))
  return { ...atualizado }
}

export async function gerarNovoQrCode(academiaId: string): Promise<AcademiaQrCode> {
  const agora = agoraIso()
  const novo: AcademiaQrCode = {
    id: gerarId(),
    academiaId,
    codigo: gerarCodigoAleatorio(),
    status: 'ATIVO',
    criadoEm: agora,
    expiresAt: new Date(Date.now() + 60 * 1000).toISOString(),
  }

  qrCodesDb = [...qrCodesDb, novo]
  return { ...novo }
}

export async function registrarValidacaoQr(params: {
  academiaId: string
  resultado: QrValidationStatus
  mensagem: string
  qrCodeId: string
}): Promise<QrCodeValidationLog> {
  const registro: QrCodeValidationLog = {
    id: `qr-log-${gerarId()}`,
    academiaId: params.academiaId,
    qrCodeId: params.qrCodeId,
    resultado: params.resultado,
    mensagem: params.mensagem,
    criadoEm: agoraIso(),
  }

  qrValidationsDb = [registro, ...qrValidationsDb]
  return { ...registro }
}

export async function listarValidacoesPorAcademia(academiaId: string): Promise<QrCodeValidationLog[]> {
  return cloneValidations(
    qrValidationsDb
      .filter((item) => item.academiaId === academiaId)
      .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
  )
}

export function snapshotQrCodes(): AcademiaQrCode[] {
  return cloneCodes(qrCodesDb)
}

export function snapshotQrValidations(): QrCodeValidationLog[] {
  return cloneValidations(qrValidationsDb)
}

export function resetQrCodeMocks(): void {
  qrCodesDb = [...MOCK_QR_CODES]
  qrValidationsDb = [...MOCK_QR_VALIDATIONS]
}
