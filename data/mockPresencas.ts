import type { Presenca } from '../types';
import { DEFAULT_TREINOS } from '../store/treinosStore';

const getTreinoMeta = (treinoId: string | null) => {
  const treino = DEFAULT_TREINOS.find((item) => item.id === treinoId);
  return {
    treinoId: treinoId || null,
    tipoTreino: treino?.nome || 'Sessão principal',
    treinoModalidade: treino?.tipo || 'Livre'
  };
};

export const MOCK_PRESENCAS: Presenca[] = [
  {
    id: 'p1',
    alunoId: '1',
    alunoNome: 'João Silva',
    faixa: 'Roxa',
    graus: 2,
    data: '2024-05-06',
    hora: '07:55',
    status: 'CONFIRMADO',
    ...getTreinoMeta('t1')
  },
  {
    id: 'p1b',
    alunoId: '1',
    alunoNome: 'João Silva',
    faixa: 'Roxa',
    graus: 2,
    data: '2024-05-06',
    hora: '19:05',
    status: 'CONFIRMADO',
    ...getTreinoMeta('t2')
  },
  {
    id: 'p2',
    alunoId: '2',
    alunoNome: 'Maria Souza',
    faixa: 'Azul',
    graus: 3,
    data: '2024-05-06',
    hora: null,
    status: 'AUSENTE',
    ...getTreinoMeta('t2')
  },
  {
    id: 'p3',
    alunoId: '3',
    alunoNome: 'Carlos Pereira',
    faixa: 'Marrom',
    graus: 1,
    data: '2024-05-04',
    hora: '08:12',
    status: 'CONFIRMADO',
    ...getTreinoMeta('t3')
  },
  {
    id: 'p4',
    alunoId: '4',
    alunoNome: 'Ana Martins',
    faixa: 'Azul',
    graus: 1,
    data: '2024-05-04',
    hora: '08:05',
    status: 'CONFIRMADO',
    ...getTreinoMeta('t1')
  },
  {
    id: 'p5',
    alunoId: '5',
    alunoNome: 'Pedro Lima',
    faixa: 'Branca',
    graus: 0,
    data: '2024-05-03',
    hora: '07:48',
    status: 'CONFIRMADO',
    ...getTreinoMeta('t1')
  },
  {
    id: 'p6',
    alunoId: '6',
    alunoNome: 'Fernanda Alves',
    faixa: 'Roxa',
    graus: 3,
    data: '2024-05-03',
    hora: '09:10',
    status: 'CONFIRMADO',
    ...getTreinoMeta('t6')
  },
  {
    id: 'p7',
    alunoId: '7',
    alunoNome: 'Rafael Costa',
    faixa: 'Marrom',
    graus: 2,
    data: '2024-05-02',
    hora: null,
    status: 'AUSENTE',
    ...getTreinoMeta('t2')
  },
  {
    id: 'p8',
    alunoId: '8',
    alunoNome: 'Beatriz Ramos',
    faixa: 'Azul',
    graus: 0,
    data: '2024-05-02',
    hora: '08:22',
    status: 'CONFIRMADO',
    ...getTreinoMeta('t1')
  },
  {
    id: 'p9',
    alunoId: '9',
    alunoNome: 'Thiago Santos',
    faixa: 'Preta',
    graus: 1,
    data: '2024-05-01',
    hora: '07:40',
    status: 'CONFIRMADO',
    ...getTreinoMeta('t3')
  },
  {
    id: 'p10',
    alunoId: '10',
    alunoNome: 'Camila Nogueira',
    faixa: 'Roxa',
    graus: 0,
    data: '2024-05-01',
    hora: '08:30',
    status: 'CONFIRMADO',
    ...getTreinoMeta('t6')
  },
  {
    id: 'p11',
    alunoId: '11',
    alunoNome: 'Eduarda Faria',
    faixa: 'Cinza',
    graus: 1,
    data: '2024-05-06',
    hora: '18:05',
    status: 'Presente',
    ...getTreinoMeta('t4')
  },
  {
    id: 'p12',
    alunoId: '12',
    alunoNome: 'Gabriel Torres',
    faixa: 'Cinza',
    graus: 0,
    data: '2024-05-06',
    hora: null,
    status: 'AUSENTE',
    ...getTreinoMeta('t4')
  },
  {
    id: 'p13',
    alunoId: '14',
    alunoNome: 'Larissa Prado',
    faixa: 'Amarela',
    graus: 2,
    data: '2024-05-04',
    hora: '10:05',
    status: 'CONFIRMADO',
    ...getTreinoMeta('t5')
  }
];

