import type { AulaInstancia } from '@/types';

const formatDate = (daysOffset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

const buildAulaId = (turmaId: string, date: string) => `aula_${turmaId}_${date.replaceAll('-', '_')}`;

const aulaRecente = (turmaId: string, daysOffset: number, status: AulaInstancia['status']): AulaInstancia => {
  const data = formatDate(daysOffset);
  return {
    id: buildAulaId(turmaId, data),
    turmaId,
    data,
    horaInicio: turmaId === 'turma_kids_fundamental' ? '18:00' : turmaId === 'turma_adulto_gi' ? '19:00' : '20:30',
    horaFim: turmaId === 'turma_kids_fundamental' ? '19:00' : turmaId === 'turma_adulto_gi' ? '20:30' : '22:00',
    status
  };
};

export const MOCK_AULAS_INSTANCIAS: AulaInstancia[] = [
  aulaRecente('turma_kids_fundamental', -2, 'encerrada'),
  aulaRecente('turma_kids_fundamental', 0, 'prevista'),
  aulaRecente('turma_kids_fundamental', 2, 'prevista'),
  aulaRecente('turma_adulto_gi', -1, 'encerrada'),
  aulaRecente('turma_adulto_gi', 0, 'prevista'),
  aulaRecente('turma_adulto_gi', 3, 'prevista'),
  aulaRecente('turma_competicao_noite', -3, 'encerrada'),
  aulaRecente('turma_competicao_noite', 0, 'prevista'),
  aulaRecente('turma_competicao_noite', 4, 'prevista'),
  {
    id: 'aula_turma_kids_2024_05_20',
    turmaId: 'turma_kids_fundamental',
    data: '2024-05-20',
    horaInicio: '18:00',
    horaFim: '19:00',
    status: 'encerrada'
  },
  {
    id: 'aula_turma_kids_2024_05_22',
    turmaId: 'turma_kids_fundamental',
    data: '2024-05-22',
    horaInicio: '18:00',
    horaFim: '19:00',
    status: 'encerrada'
  },
  {
    id: 'aula_turma_kids_2024_05_27',
    turmaId: 'turma_kids_fundamental',
    data: '2024-05-27',
    horaInicio: '18:00',
    horaFim: '19:00',
    status: 'prevista'
  },
  {
    id: 'aula_turma_adulto_2024_05_20',
    turmaId: 'turma_adulto_gi',
    data: '2024-05-20',
    horaInicio: '19:00',
    horaFim: '20:30',
    status: 'encerrada'
  },
  {
    id: 'aula_turma_adulto_2024_05_22',
    turmaId: 'turma_adulto_gi',
    data: '2024-05-22',
    horaInicio: '19:00',
    horaFim: '20:30',
    status: 'encerrada'
  },
  {
    id: 'aula_turma_adulto_2024_05_24',
    turmaId: 'turma_adulto_gi',
    data: '2024-05-24',
    horaInicio: '19:00',
    horaFim: '20:30',
    status: 'encerrada'
  },
  {
    id: 'aula_turma_adulto_2024_05_27',
    turmaId: 'turma_adulto_gi',
    data: '2024-05-27',
    horaInicio: '19:00',
    horaFim: '20:30',
    status: 'prevista'
  },
  {
    id: 'aula_turma_competicao_2024_05_21',
    turmaId: 'turma_competicao_noite',
    data: '2024-05-21',
    horaInicio: '20:30',
    horaFim: '22:00',
    status: 'encerrada'
  },
  {
    id: 'aula_turma_competicao_2024_05_23',
    turmaId: 'turma_competicao_noite',
    data: '2024-05-23',
    horaInicio: '20:30',
    horaFim: '22:00',
    status: 'prevista'
  }
];
