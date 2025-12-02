export type QrCheckinResultado = 'SUCESSO' | 'FALHA'

export interface MockQrAcademia {
  id: string
  codigo: string
  createdAt: string
  expiresAt: string
}

export interface MockQrValidacao {
  id: string
  academiaCodigo: string
  resultado: QrCheckinResultado
  motivo: string
  alunoNome: string
  dataHora: string
}

const agora = new Date()

export const mockQrAcademiaAtual: MockQrAcademia = {
  id: 'qr-abc123',
  codigo: 'USGO-UDIA-1-XYZ123',
  createdAt: agora.toISOString(),
  expiresAt: new Date(agora.getTime() + 60 * 1000).toISOString(),
}

export const mockQrValidacoes: MockQrValidacao[] = [
  {
    id: 'qr-val-001',
    academiaCodigo: 'USGO-UDIA-1-XYZ123',
    resultado: 'SUCESSO',
    motivo: 'QR válido dentro do prazo',
    alunoNome: 'Mariana Souza',
    dataHora: '2025-12-02 19:25',
  },
  {
    id: 'qr-val-002',
    academiaCodigo: 'USGO-UDIA-1-XYZ123',
    resultado: 'FALHA',
    motivo: 'QR expirado',
    alunoNome: 'Carlos Oliveira',
    dataHora: '2025-12-02 19:10',
  },
  {
    id: 'qr-val-003',
    academiaCodigo: 'USGO-UDIA-1-XYZ123',
    resultado: 'SUCESSO',
    motivo: 'QR válido dentro do prazo',
    alunoNome: 'Ana Lima',
    dataHora: '2025-12-01 18:45',
  },
]
