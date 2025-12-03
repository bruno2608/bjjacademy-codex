export type PresencaStatus =
  | 'PENDENTE' // aluno fez check-in, professor ainda não confirmou
  | 'PRESENTE' // confirmado pelo professor ou ao fechar aula
  | 'FALTA' // não apareceu / não registrou check-in
  | 'JUSTIFICADA' // falta com justificativa (opcional)

export type PresencaOrigem = 'ALUNO' | 'PROFESSOR' | 'SISTEMA' | 'QR_CODE'

export interface PresencaRegistro {
  id: string
  alunoId: string
  treinoId: string
  turmaId?: string | null
  aulaId?: string | null
  status: PresencaStatus
  origem: PresencaOrigem
  observacao?: string | null
  createdAt: string
  updatedAt: string
  /**
   * Compatibilidade com os mocks atuais: mantemos a data da sessão como campo
   * opcional enquanto os treinos ainda são baseados em agendamento semanal.
   */
  data?: string
}
