import type { PresencaRegistro } from '@/types/presenca'

const dateFromOffset = (daysOffset: number) => {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset)
  return date.toISOString().split('T')[0]
}

const build = (
  id: string,
  alunoId: string,
  treinoId: string,
  daysOffset: number,
  status: PresencaRegistro['status'],
  origem: PresencaRegistro['origem']
): PresencaRegistro => ({
  id,
  alunoId,
  treinoId,
  data: dateFromOffset(daysOffset),
  status,
  origem,
})

export const MOCK_PRESENCAS: PresencaRegistro[] = [
  build('p-today-joao', 'aluno_joao_silva', 't1', 0, 'PENDENTE', 'ALUNO'),
  build('p-today-maria', '2', 't2', 0, 'PENDENTE', 'ALUNO'),
  build('p-today-cancelado', '3', 't3', 0, 'FALTA', 'PROFESSOR'),

  build('p-1', 'aluno_joao_silva', 't1', -2, 'PRESENTE', 'PROFESSOR'),
  build('p-2', 'aluno_joao_silva', 't2', -5, 'PRESENTE', 'ALUNO'),
  build('p-3', 'aluno_joao_silva', 't1', -12, 'PRESENTE', 'ALUNO'),
  build('p-4', 'aluno_joao_silva', 't4', -18, 'PRESENTE', 'PROFESSOR'),
  build('p-5', 'aluno_joao_silva', 't1', -27, 'JUSTIFICADA', 'PROFESSOR'),
  build('p-6', 'aluno_joao_silva', 't1', -34, 'PRESENTE', 'ALUNO'),
  build('p-7', 'aluno_joao_silva', 't2', -48, 'PRESENTE', 'ALUNO'),
  build('p-8', 'aluno_joao_silva', 't1', -62, 'PRESENTE', 'PROFESSOR'),
  build('p-9', 'aluno_joao_silva', 't2', -78, 'PRESENTE', 'PROFESSOR'),

  build('p-10', '2', 't2', -2, 'PRESENTE', 'ALUNO'),
  build('p-11', '2', 't2', -11, 'PRESENTE', 'ALUNO'),
  build('p-12', '2', 't3', -26, 'FALTA', 'PROFESSOR'),
  build('p-13', '2', 't2', -44, 'JUSTIFICADA', 'ALUNO'),
  build('p-14', '2', 't6', -63, 'PRESENTE', 'PROFESSOR'),
  build('p-15', '2', 't1', -85, 'PRESENTE', 'PROFESSOR'),

  build('p-16', '6', 't6', -1, 'PRESENTE', 'ALUNO'),
  build('p-17', '6', 't4', -16, 'PRESENTE', 'PROFESSOR'),
  build('p-18', '6', 't6', -33, 'JUSTIFICADA', 'ALUNO'),

  build('p-19', '5', 't1', -3, 'PENDENTE', 'ALUNO'),
  build('p-20', '5', 't2', -9, 'PRESENTE', 'ALUNO'),
  build('p-21', '5', 't1', -19, 'FALTA', 'PROFESSOR'),

  build('p-22', '8', 't2', -7, 'FALTA', 'ALUNO'),
  build('p-23', '8', 't1', -13, 'PRESENTE', 'PROFESSOR'),

  build('p-24', '11', 't4', -29, 'PRESENTE', 'PROFESSOR'),
  build('p-25', '11', 't4', -72, 'JUSTIFICADA', 'ALUNO'),

  build('p-26', '4', 't1', -6, 'PRESENTE', 'PROFESSOR'),
  build('p-27', '4', 't2', -23, 'PRESENTE', 'PROFESSOR'),

  build('p-28', '13', 't1', -14, 'PRESENTE', 'ALUNO'),
  build('p-29', '13', 't5', -37, 'PRESENTE', 'PROFESSOR'),

  build('p-30', '17', 't2', -4, 'PENDENTE', 'ALUNO'),
  build('p-31', '17', 't2', -10, 'PRESENTE', 'ALUNO'),
  build('p-32', '17', 't2', -41, 'FALTA', 'PROFESSOR'),

  build('p-33', '9', 't3', -8, 'PRESENTE', 'PROFESSOR'),
  build('p-34', '9', 't3', -52, 'PRESENTE', 'PROFESSOR'),

  build('p-35', '14', 't5', -15, 'PRESENTE', 'PROFESSOR'),
  build('p-36', '14', 't5', -58, 'FALTA', 'ALUNO'),

  build('p-37', '18', 't4', -21, 'PRESENTE', 'PROFESSOR'),
  build('p-38', '18', 't4', -70, 'PRESENTE', 'ALUNO'),

  build('p-39', '20', 't1', -17, 'PRESENTE', 'PROFESSOR'),
  build('p-40', '20', 't1', -32, 'JUSTIFICADA', 'ALUNO'),
]
