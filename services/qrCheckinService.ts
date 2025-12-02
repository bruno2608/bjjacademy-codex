import {
  MockQrAcademia,
  MockQrValidacao,
  QrCheckinResultado,
  mockQrAcademiaAtual,
  mockQrValidacoes,
} from '@/data/mocks/mockQrCheckin'

let qrAtual: MockQrAcademia = { ...mockQrAcademiaAtual }
let validacoes: MockQrValidacao[] = [...mockQrValidacoes]

const cloneQr = (qr: MockQrAcademia) => ({ ...qr })
const cloneValidacoes = (lista: MockQrValidacao[]) => lista.map((item) => ({ ...item }))

const gerarCodigoAleatorio = () => {
  const token = Math.random().toString(36).slice(2, 6).toUpperCase()
  const sufixo = Math.random().toString(16).slice(2, 6).toUpperCase()
  return `USGO-UDIA-1-${token}${sufixo}`
}

export function getQrAcademiaAtual(): MockQrAcademia {
  return cloneQr(qrAtual)
}

export function regenerarQrAcademia(): MockQrAcademia {
  const agora = Date.now()
  qrAtual = {
    id: `qr-${agora}`,
    codigo: gerarCodigoAleatorio(),
    createdAt: new Date(agora).toISOString(),
    expiresAt: new Date(agora + 60 * 1000).toISOString(),
  }
  return cloneQr(qrAtual)
}

export function listarValidacoesQr(): MockQrValidacao[] {
  return cloneValidacoes(validacoes)
}

export function registrarValidacaoSimulada(
  resultado: QrCheckinResultado,
  motivo: string,
  alunoNome: string
): MockQrValidacao {
  const registro: MockQrValidacao = {
    id: `qr-val-${Date.now()}`,
    academiaCodigo: qrAtual.codigo,
    resultado,
    motivo,
    alunoNome,
    dataHora: new Date().toLocaleString('pt-BR'),
  }
  validacoes = [registro, ...validacoes]
  return { ...registro }
}

export type { MockQrAcademia, MockQrValidacao, QrCheckinResultado }
