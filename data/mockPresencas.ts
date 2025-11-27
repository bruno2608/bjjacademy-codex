import type { PresencaRegistro } from '@/types/presenca'

const dateFromOffset = (daysOffset: number) => {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset)
  return date.toISOString().split('T')[0]
}

const aulaIdFor = (turmaId: string, daysOffset: number) => `aula_${turmaId}_${dateFromOffset(daysOffset).replaceAll('-', '_')}`

const build = (
  id: string,
  alunoId: string,
  turmaId: string,
  daysOffset: number,
  status: PresencaRegistro['status'],
  origem: PresencaRegistro['origem']
): PresencaRegistro => ({
  id,
  alunoId,
  treinoId: turmaId,
  turmaId,
  aulaId: aulaIdFor(turmaId, daysOffset),
  data: dateFromOffset(daysOffset),
  status,
  origem,
})

export const MOCK_PRESENCAS: PresencaRegistro[] = [
  build('presenca-hoje-joao', 'aluno_joao_silva', 'turma_adulto_gi', 0, 'PENDENTE', 'ALUNO'),
  build('presenca-hoje-maria', '2', 'turma_adulto_gi', 0, 'PENDENTE', 'ALUNO'),
  build('presenca-hoje-kids', '4', 'turma_kids_fundamental', 0, 'PENDENTE', 'PROFESSOR'),
  build('presenca-hoje-competicao', '5', 'turma_competicao_noite', 0, 'PENDENTE', 'ALUNO'),

  build('presenca-ontem-joao', 'aluno_joao_silva', 'turma_adulto_gi', -1, 'PRESENTE', 'PROFESSOR'),
  build('presenca-ontem-maria', '2', 'turma_adulto_gi', -1, 'JUSTIFICADA', 'PROFESSOR'),
  build('presenca-ontem-competicao', '5', 'turma_competicao_noite', -1, 'PENDENTE', 'ALUNO'),

  build('presenca-kids-2d', '4', 'turma_kids_fundamental', -2, 'PRESENTE', 'PROFESSOR'),
  build('presenca-comp-3d', '5', 'turma_competicao_noite', -3, 'PRESENTE', 'ALUNO'),

  build('presenca-historico-joao-1', 'aluno_joao_silva', 'turma_adulto_gi', -7, 'PRESENTE', 'ALUNO'),
  build('presenca-historico-joao-2', 'aluno_joao_silva', 'turma_adulto_gi', -14, 'PRESENTE', 'ALUNO'),
  build('presenca-historico-joao-3', 'aluno_joao_silva', 'turma_kids_fundamental', -21, 'JUSTIFICADA', 'PROFESSOR'),
  build('presenca-historico-maria', '2', 'turma_adulto_gi', -10, 'FALTA', 'ALUNO'),
  build('presenca-historico-ana', '4', 'turma_kids_fundamental', -9, 'PRESENTE', 'ALUNO'),
  build('presenca-historico-pedro', '5', 'turma_competicao_noite', -8, 'PRESENTE', 'PROFESSOR')
]
