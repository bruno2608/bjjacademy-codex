/**
 * Zustand store centraliza informações do usuário logado
 * e fornece utilitários para mock de autenticação, alunos,
 * presenças e graduações simulando o comportamento do backend.
 */
import { create } from 'zustand';
import { calculateNextStep, getMaxStripes, getNextBelt } from '../lib/graduationRules';
import { DEFAULT_TREINOS, useTreinosStore } from './treinosStore';
import { ROLE_KEYS, normalizeRoles } from '../config/roles';

const deriveRolesFromEmail = (email) => {
  const normalized = (email || '').toLowerCase();
  const baseRoles = new Set([ROLE_KEYS.instructor, ROLE_KEYS.teacher]);
  if (normalized.includes('admin')) baseRoles.add(ROLE_KEYS.admin);
  if (normalized.includes('ti')) baseRoles.add(ROLE_KEYS.ti);
  if (normalized.includes('aluno') || normalized.includes('student')) baseRoles.add(ROLE_KEYS.student);
  return Array.from(baseRoles);
};

const persistRoles = (roles) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('bjj_roles', JSON.stringify(roles));
  }
  if (typeof document !== 'undefined') {
    document.cookie = `bjj_roles=${roles.join(',')}; path=/; max-age=${60 * 60 * 24 * 30}`;
  }
};

const clearPersistedRoles = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('bjj_roles');
    window.localStorage.removeItem('bjj_user');
  }
  if (typeof document !== 'undefined') {
    document.cookie = 'bjj_roles=; path=/; max-age=0';
  }
};

const getCurrentTime = () =>
  new Date()
    .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    .padStart(5, '0');

const normalizeAluno = (aluno) => ({
  ...aluno,
  graus: Number(aluno.graus ?? 0),
  mesesNaFaixa: Number(aluno.mesesNaFaixa ?? 0),
  historicoGraduacoes: Array.isArray(aluno.historicoGraduacoes)
    ? aluno.historicoGraduacoes
    : [],
  dataInicio:
    aluno.dataInicio ||
    aluno.dataUltimaGraduacao ||
    new Date().toISOString().split('T')[0]
});

const parseISODate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const countAttendancesFrom = (registros, inicio) => {
  if (!inicio) return registros.length;
  const reference = inicio.getTime();
  return registros.filter((item) => {
    const data = parseISODate(item.data);
    return data && data.getTime() >= reference;
  }).length;
};

const getLatestHistoryRecord = (historico, predicate) => {
  if (!Array.isArray(historico)) return null;
  return historico
    .filter((item) => predicate(item) && parseISODate(item.data))
    .sort((a, b) => parseISODate(b.data) - parseISODate(a.data))[0] || null;
};

const buildAttendanceStatsForAluno = (aluno, presencas = []) => {
  const registrosAluno = presencas.filter(
    (item) => item.alunoId === aluno.id && item.status === 'Presente'
  );

  const historico = Array.isArray(aluno.historicoGraduacoes)
    ? aluno.historicoGraduacoes
    : [];
  const faixaAtual = aluno.faixa;
  const grauAtual = Number(aluno.graus || 0);

  const ultimoRegistroFaixa = getLatestHistoryRecord(
    historico,
    (item) => item.tipo === 'Faixa' && item.faixa === faixaAtual
  );
  const inicioFaixa =
    parseISODate(ultimoRegistroFaixa?.data) ||
    parseISODate(aluno.dataUltimaGraduacao) ||
    parseISODate(aluno.dataInicio);

  const aulasDesdeFaixa = countAttendancesFrom(registrosAluno, inicioFaixa);

  const ultimoRegistroGrau = getLatestHistoryRecord(
    historico,
    (item) => item.tipo === 'Grau' && item.faixa === faixaAtual && Number(item.grau) === grauAtual
  );
  const inicioGrau = grauAtual > 0 ? parseISODate(ultimoRegistroGrau?.data) || inicioFaixa : inicioFaixa;
  const aulasNoGrauAtual = countAttendancesFrom(registrosAluno, inicioGrau);

  return {
    totalAulas: registrosAluno.length,
    aulasDesdeUltimaFaixa: aulasDesdeFaixa,
    aulasNoGrauAtual
  };
};

const applyAttendanceStats = (alunos, presencas) =>
  alunos.map((aluno) => {
    const stats = buildAttendanceStatsForAluno(aluno, presencas);
    return {
      ...aluno,
      aulasTotais: stats.totalAulas,
      aulasDesdeUltimaFaixa: stats.aulasDesdeUltimaFaixa,
      aulasNoGrauAtual: stats.aulasNoGrauAtual
    };
  });

const mockTreinos = DEFAULT_TREINOS.map((treino) => ({ ...treino }));

// Dados iniciais de alunos para alimentar as telas de listagem e formulários.
const mockAlunos = [
  normalizeAluno({
    id: '1',
    nome: 'João Silva',
    telefone: '(11) 98888-7766',
    plano: 'Mensal',
    status: 'Ativo',
    faixa: 'Roxa',
    graus: 2,
    mesesNaFaixa: 14,
    dataInicio: '2018-02-12',
    dataUltimaGraduacao: '2023-03-10',
    historicoGraduacoes: [
      {
        id: 'h1',
        tipo: 'Faixa',
        faixa: 'Azul',
        grau: null,
        data: '2019-10-03',
        instrutor: 'Prof. Ana',
        descricao: 'Faixa Branca → Azul'
      },
      {
        id: 'h2',
        tipo: 'Faixa',
        faixa: 'Roxa',
        grau: null,
        data: '2021-12-12',
        instrutor: 'Prof. Bruno',
        descricao: 'Faixa Azul → Roxa'
      },
      {
        id: 'h3',
        tipo: 'Grau',
        faixa: 'Roxa',
        grau: 1,
        data: '2022-08-20',
        instrutor: 'Prof. Ana',
        descricao: '1º grau em Roxa'
      }
    ]
  }),
  normalizeAluno({
    id: '2',
    nome: 'Maria Souza',
    telefone: '(21) 97777-6655',
    plano: 'Anual',
    status: 'Ativo',
    faixa: 'Azul',
    graus: 3,
    mesesNaFaixa: 20,
    dataInicio: '2019-05-01',
    dataUltimaGraduacao: '2022-12-01',
    historicoGraduacoes: [
      {
        id: 'h4',
        tipo: 'Faixa',
        faixa: 'Azul',
        grau: null,
        data: '2021-03-10',
        instrutor: 'Prof. Ana',
        descricao: 'Faixa Branca → Azul'
      },
      {
        id: 'h5',
        tipo: 'Grau',
        faixa: 'Azul',
        grau: 1,
        data: '2021-11-18',
        instrutor: 'Prof. Carla',
        descricao: '1º grau em Azul'
      },
      {
        id: 'h6',
        tipo: 'Grau',
        faixa: 'Azul',
        grau: 2,
        data: '2022-05-03',
        instrutor: 'Prof. Carla',
        descricao: '2º grau em Azul'
      }
    ]
  }),
  normalizeAluno({
    id: '3',
    nome: 'Carlos Pereira',
    telefone: '(31) 96666-5544',
    plano: 'Trimestral',
    status: 'Inativo',
    faixa: 'Marrom',
    graus: 1,
    mesesNaFaixa: 7,
    dataInicio: '2015-07-22',
    dataUltimaGraduacao: '2023-11-18',
    historicoGraduacoes: [
      {
        id: 'h7',
        tipo: 'Faixa',
        faixa: 'Azul',
        grau: null,
        data: '2016-08-14',
        instrutor: 'Prof. Diego',
        descricao: 'Faixa Branca → Azul'
      },
      {
        id: 'h8',
        tipo: 'Faixa',
        faixa: 'Roxa',
        grau: null,
        data: '2018-09-20',
        instrutor: 'Prof. Diego',
        descricao: 'Faixa Azul → Roxa'
      },
      {
        id: 'h9',
        tipo: 'Faixa',
        faixa: 'Marrom',
        grau: null,
        data: '2021-06-30',
        instrutor: 'Prof. Lúcia',
        descricao: 'Faixa Roxa → Marrom'
      }
    ]
  }),
  normalizeAluno({
    id: '4',
    nome: 'Ana Martins',
    telefone: '(11) 97777-2211',
    plano: 'Semestral',
    status: 'Ativo',
    faixa: 'Azul',
    graus: 1,
    mesesNaFaixa: 9,
    dataInicio: '2020-01-15',
    dataUltimaGraduacao: '2023-09-30',
    historicoGraduacoes: [
      {
        id: 'h10',
        tipo: 'Faixa',
        faixa: 'Azul',
        grau: null,
        data: '2022-04-18',
        instrutor: 'Prof. Bruno',
        descricao: 'Faixa Branca → Azul'
      }
    ]
  }),
  normalizeAluno({
    id: '5',
    nome: 'Pedro Lima',
    telefone: '(21) 93456-8899',
    plano: 'Mensal',
    status: 'Ativo',
    faixa: 'Branca',
    graus: 0,
    mesesNaFaixa: 4,
    dataInicio: '2023-02-10',
    historicoGraduacoes: []
  }),
  normalizeAluno({
    id: '6',
    nome: 'Fernanda Alves',
    telefone: '(31) 99876-4455',
    plano: 'Anual',
    status: 'Ativo',
    faixa: 'Roxa',
    graus: 3,
    mesesNaFaixa: 26,
    dataInicio: '2016-07-19',
    dataUltimaGraduacao: '2022-11-05',
    historicoGraduacoes: [
      {
        id: 'h11',
        tipo: 'Faixa',
        faixa: 'Roxa',
        grau: null,
        data: '2020-08-12',
        instrutor: 'Prof. Ana',
        descricao: 'Faixa Azul → Roxa'
      },
      {
        id: 'h12',
        tipo: 'Grau',
        faixa: 'Roxa',
        grau: 1,
        data: '2021-05-25',
        instrutor: 'Prof. Carla',
        descricao: '1º grau em Roxa'
      },
      {
        id: 'h13',
        tipo: 'Grau',
        faixa: 'Roxa',
        grau: 2,
        data: '2022-01-10',
        instrutor: 'Prof. Carla',
        descricao: '2º grau em Roxa'
      }
    ]
  }),
  normalizeAluno({
    id: '7',
    nome: 'Rafael Costa',
    telefone: '(41) 91234-5566',
    plano: 'Trimestral',
    status: 'Ativo',
    faixa: 'Marrom',
    graus: 2,
    mesesNaFaixa: 16,
    dataInicio: '2014-03-02',
    dataUltimaGraduacao: '2022-07-19',
    historicoGraduacoes: [
      {
        id: 'h14',
        tipo: 'Faixa',
        faixa: 'Roxa',
        grau: null,
        data: '2018-05-05',
        instrutor: 'Prof. Diego',
        descricao: 'Faixa Roxa conquistada'
      },
      {
        id: 'h15',
        tipo: 'Faixa',
        faixa: 'Marrom',
        grau: null,
        data: '2021-01-22',
        instrutor: 'Prof. Diego',
        descricao: 'Faixa Marrom conquistada'
      }
    ]
  }),
  normalizeAluno({
    id: '8',
    nome: 'Beatriz Ramos',
    telefone: '(51) 94567-1122',
    plano: 'Mensal',
    status: 'Ativo',
    faixa: 'Azul',
    graus: 0,
    mesesNaFaixa: 6,
    dataInicio: '2021-06-30',
    dataUltimaGraduacao: '2023-12-15',
    historicoGraduacoes: [
      {
        id: 'h16',
        tipo: 'Faixa',
        faixa: 'Azul',
        grau: null,
        data: '2023-12-15',
        instrutor: 'Prof. Ana',
        descricao: 'Faixa Branca → Azul'
      }
    ]
  }),
  normalizeAluno({
    id: '9',
    nome: 'Thiago Santos',
    telefone: '(61) 95678-3344',
    plano: 'Anual',
    status: 'Ativo',
    faixa: 'Preta',
    graus: 1,
    mesesNaFaixa: 36,
    dataInicio: '2010-09-18',
    dataUltimaGraduacao: '2021-04-11',
    historicoGraduacoes: [
      {
        id: 'h17',
        tipo: 'Faixa',
        faixa: 'Preta',
        grau: null,
        data: '2018-10-21',
        instrutor: 'Prof. Mauro',
        descricao: 'Faixa Marrom → Preta'
      },
      {
        id: 'h18',
        tipo: 'Grau',
        faixa: 'Preta',
        grau: 1,
        data: '2021-04-11',
        instrutor: 'Prof. Mauro',
        descricao: '1º grau em Preta'
      }
    ]
  }),
  normalizeAluno({
    id: '10',
    nome: 'Camila Nogueira',
    telefone: '(71) 98765-9900',
    plano: 'Semestral',
    status: 'Ativo',
    faixa: 'Roxa',
    graus: 0,
    mesesNaFaixa: 5,
    dataInicio: '2018-11-05',
    dataUltimaGraduacao: '2024-02-12',
    historicoGraduacoes: [
      {
        id: 'h19',
        tipo: 'Faixa',
        faixa: 'Roxa',
        grau: null,
        data: '2024-02-12',
        instrutor: 'Prof. Ana',
        descricao: 'Faixa Azul → Roxa'
      }
    ]
  }),
  normalizeAluno({
    id: '11',
    nome: 'Lucas Araújo',
    telefone: '(81) 99881-2244',
    plano: 'Mensal',
    status: 'Ativo',
    faixa: 'Roxa',
    graus: 1,
    mesesNaFaixa: 11,
    dataInicio: '2017-04-14',
    dataUltimaGraduacao: '2023-06-08',
    historicoGraduacoes: [
      {
        id: 'h20',
        tipo: 'Faixa',
        faixa: 'Roxa',
        grau: null,
        data: '2022-02-20',
        instrutor: 'Prof. Bruno',
        descricao: 'Faixa Azul → Roxa'
      },
      {
        id: 'h21',
        tipo: 'Grau',
        faixa: 'Roxa',
        grau: 1,
        data: '2023-06-08',
        instrutor: 'Prof. Bruno',
        descricao: '1º grau em Roxa'
      }
    ]
  }),
  normalizeAluno({
    id: '12',
    nome: 'Juliana Teixeira',
    telefone: '(85) 98564-7788',
    plano: 'Trimestral',
    status: 'Ativo',
    faixa: 'Azul',
    graus: 2,
    mesesNaFaixa: 15,
    dataInicio: '2020-08-09',
    dataUltimaGraduacao: '2023-01-30',
    historicoGraduacoes: [
      {
        id: 'h22',
        tipo: 'Faixa',
        faixa: 'Azul',
        grau: null,
        data: '2021-12-01',
        instrutor: 'Prof. Carla',
        descricao: 'Faixa Branca → Azul'
      },
      {
        id: 'h23',
        tipo: 'Grau',
        faixa: 'Azul',
        grau: 1,
        data: '2022-07-14',
        instrutor: 'Prof. Carla',
        descricao: '1º grau em Azul'
      }
    ]
  }),
  normalizeAluno({
    id: '13',
    nome: 'Bruno Rocha',
    telefone: '(62) 93456-0021',
    plano: 'Mensal',
    status: 'Ativo',
    faixa: 'Branca',
    graus: 3,
    mesesNaFaixa: 18,
    dataInicio: '2022-01-16',
    historicoGraduacoes: [
      {
        id: 'h24',
        tipo: 'Grau',
        faixa: 'Branca',
        grau: 1,
        data: '2022-07-01',
        instrutor: 'Prof. Ana',
        descricao: '1º grau em Branca'
      },
      {
        id: 'h25',
        tipo: 'Grau',
        faixa: 'Branca',
        grau: 2,
        data: '2023-01-20',
        instrutor: 'Prof. Ana',
        descricao: '2º grau em Branca'
      }
    ]
  }),
  normalizeAluno({
    id: '14',
    nome: 'Patrícia Mendes',
    telefone: '(65) 97654-8890',
    plano: 'Anual',
    status: 'Ativo',
    faixa: 'Azul',
    graus: 1,
    mesesNaFaixa: 10,
    dataInicio: '2019-09-08',
    dataUltimaGraduacao: '2023-05-05',
    historicoGraduacoes: [
      {
        id: 'h26',
        tipo: 'Faixa',
        faixa: 'Azul',
        grau: null,
        data: '2020-12-17',
        instrutor: 'Prof. Lúcia',
        descricao: 'Faixa Branca → Azul'
      }
    ]
  }),
  normalizeAluno({
    id: '15',
    nome: 'Eduardo Farias',
    telefone: '(67) 93210-3456',
    plano: 'Semestral',
    status: 'Ativo',
    faixa: 'Marrom',
    graus: 0,
    mesesNaFaixa: 3,
    dataInicio: '2013-03-29',
    dataUltimaGraduacao: '2024-03-01',
    historicoGraduacoes: [
      {
        id: 'h27',
        tipo: 'Faixa',
        faixa: 'Marrom',
        grau: null,
        data: '2024-03-01',
        instrutor: 'Prof. Mauro',
        descricao: 'Faixa Roxa → Marrom'
      }
    ]
  }),
  normalizeAluno({
    id: '16',
    nome: 'Larissa Costa',
    telefone: '(68) 98811-9988',
    plano: 'Mensal',
    status: 'Ativo',
    faixa: 'Roxa',
    graus: 2,
    mesesNaFaixa: 18,
    dataInicio: '2016-05-11',
    dataUltimaGraduacao: '2022-09-09',
    historicoGraduacoes: [
      {
        id: 'h28',
        tipo: 'Faixa',
        faixa: 'Roxa',
        grau: null,
        data: '2020-03-15',
        instrutor: 'Prof. Bruno',
        descricao: 'Faixa Azul → Roxa'
      }
    ]
  }),
  normalizeAluno({
    id: '17',
    nome: 'Marcelo Dias',
    telefone: '(69) 97777-5544',
    plano: 'Anual',
    status: 'Ativo',
    faixa: 'Azul',
    graus: 4,
    mesesNaFaixa: 28,
    dataInicio: '2018-06-23',
    dataUltimaGraduacao: '2023-04-18',
    historicoGraduacoes: [
      {
        id: 'h29',
        tipo: 'Faixa',
        faixa: 'Azul',
        grau: null,
        data: '2020-02-05',
        instrutor: 'Prof. Ana',
        descricao: 'Faixa Branca → Azul'
      }
    ]
  }),
  normalizeAluno({
    id: '18',
    nome: 'Sabrina Gomes',
    telefone: '(71) 98800-7654',
    plano: 'Mensal',
    status: 'Ativo',
    faixa: 'Roxa',
    graus: 1,
    mesesNaFaixa: 12,
    dataInicio: '2017-12-03',
    dataUltimaGraduacao: '2023-08-27',
    historicoGraduacoes: [
      {
        id: 'h30',
        tipo: 'Faixa',
        faixa: 'Roxa',
        grau: null,
        data: '2021-11-11',
        instrutor: 'Prof. Carla',
        descricao: 'Faixa Azul → Roxa'
      }
    ]
  }),
  normalizeAluno({
    id: '19',
    nome: 'Daniel Pires',
    telefone: '(73) 91234-6677',
    plano: 'Trimestral',
    status: 'Ativo',
    faixa: 'Azul',
    graus: 0,
    mesesNaFaixa: 2,
    dataInicio: '2023-10-19',
    historicoGraduacoes: []
  }),
  normalizeAluno({
    id: '20',
    nome: 'Renata Lima',
    telefone: '(75) 97890-3322',
    plano: 'Mensal',
    status: 'Ativo',
    faixa: 'Branca',
    graus: 2,
    mesesNaFaixa: 11,
    dataInicio: '2022-06-01',
    historicoGraduacoes: [
      {
        id: 'h31',
        tipo: 'Grau',
        faixa: 'Branca',
        grau: 1,
        data: '2023-02-14',
        instrutor: 'Prof. Ana',
        descricao: '1º grau em Branca'
      }
    ]
  })
];

const getTreinoMeta = (treinoId) => {
  const treino = mockTreinos.find((item) => item.id === treinoId);
  return {
    treinoId: treinoId || null,
    tipoTreino: treino?.nome || 'Sessão principal',
    treinoModalidade: treino?.tipo || 'Livre'
  };
};

// Presenças simuladas com status mutável para demonstrar as interações do painel.
const mockPresencas = [
  {
    id: 'p1',
    alunoId: '1',
    alunoNome: 'João Silva',
    faixa: 'Roxa',
    graus: 2,
    data: '2024-05-06',
    hora: '07:55',
    status: 'Presente',
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
    status: 'Presente',
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
    status: 'Ausente',
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
    status: 'Presente',
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
    status: 'Presente',
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
    status: 'Presente',
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
    status: 'Presente',
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
    status: 'Ausente',
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
    status: 'Presente',
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
    status: 'Presente',
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
    status: 'Presente',
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
    status: 'Ausente',
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
    status: 'Presente',
    ...getTreinoMeta('t5')
  }
];

const initialAlunos = applyAttendanceStats(mockAlunos, mockPresencas);

// Graduações mock seguem a lógica de acompanhamento de graus e faixas.
const mockGraduacoes = [
  {
    id: 'g1',
    alunoId: '1',
    alunoNome: 'João Silva',
    faixaAtual: 'Roxa',
    proximaFaixa: 'Marrom',
    tipo: 'Faixa',
    grauAlvo: null,
    criterioTempo: 'Tempo mínimo: 18 meses na faixa roxa',
    mesesRestantes: 4,
    previsao: '2024-10-15',
    status: 'Em progresso',
    instrutor: 'Prof. Bruno'
  },
  {
    id: 'g2',
    alunoId: '2',
    alunoNome: 'Maria Souza',
    faixaAtual: 'Azul',
    proximaFaixa: 'Azul',
    tipo: 'Grau',
    grauAlvo: 4,
    criterioTempo: 'Tempo mínimo: 24 meses para o 4º grau',
    mesesRestantes: 4,
    previsao: '2024-09-01',
    status: 'Planejado',
    instrutor: 'Prof. Carla'
  },
  {
    id: 'g3',
    alunoId: '6',
    alunoNome: 'Fernanda Alves',
    faixaAtual: 'Roxa',
    proximaFaixa: 'Preta',
    tipo: 'Faixa',
    grauAlvo: null,
    criterioTempo: 'Tempo mínimo: 36 meses na faixa roxa',
    mesesRestantes: 10,
    previsao: '2025-02-20',
    status: 'Em progresso',
    instrutor: 'Prof. Ana'
  },
  {
    id: 'g4',
    alunoId: '8',
    alunoNome: 'Beatriz Ramos',
    faixaAtual: 'Azul',
    proximaFaixa: 'Azul',
    tipo: 'Grau',
    grauAlvo: 1,
    criterioTempo: 'Tempo mínimo: 6 meses para o 1º grau',
    mesesRestantes: 0,
    previsao: '2024-06-10',
    status: 'Pronto para avaliar',
    instrutor: 'Prof. Carla'
  },
  {
    id: 'g5',
    alunoId: '13',
    alunoNome: 'Bruno Rocha',
    faixaAtual: 'Branca',
    proximaFaixa: 'Azul',
    tipo: 'Faixa',
    grauAlvo: null,
    criterioTempo: 'Tempo mínimo: 24 meses e 4 graus para faixa azul',
    mesesRestantes: 6,
    previsao: '2024-12-01',
    status: 'Em progresso',
    instrutor: 'Prof. Ana'
  },
  {
    id: 'g6',
    alunoId: '17',
    alunoNome: 'Marcelo Dias',
    faixaAtual: 'Azul',
    proximaFaixa: 'Roxa',
    tipo: 'Faixa',
    grauAlvo: null,
    criterioTempo: 'Tempo mínimo: 24 meses com 4 graus completos',
    mesesRestantes: 2,
    previsao: '2024-07-22',
    status: 'Em avaliação',
    instrutor: 'Prof. Bruno'
  }
];

const useUserStore = create((set) => ({
  user: null,
  token: null,
  hydrated: false,
  alunos: initialAlunos,
  presencas: mockPresencas,
  graduacoes: mockGraduacoes,
  treinos: mockTreinos,
  login: ({ email, roles }) => {
    const fakeToken = 'bjj-token-' + Date.now();
    localStorage.setItem('bjj_token', fakeToken);
    const resolvedRoles = normalizeRoles(roles);
    const finalRoles = resolvedRoles.length ? resolvedRoles : deriveRolesFromEmail(email);
    const alunoId = finalRoles.includes(ROLE_KEYS.student) ? initialAlunos[0]?.id || null : null;
    persistRoles(finalRoles);
    const normalizedUser = {
      name: email.split('@')[0] || 'Instrutor',
      email,
      roles: finalRoles,
      avatarUrl: null,
      telefone: null,
      alunoId
    };
    localStorage.setItem('bjj_user', JSON.stringify(normalizedUser));
    set({
      user: normalizedUser,
      token: fakeToken,
      hydrated: true
    });
  },
  updateUser: (payload = {}) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...payload } : state.user
    })),
  logout: () => {
    localStorage.removeItem('bjj_token');
    clearPersistedRoles();
    set({ user: null, token: null });
  },
  hydrateFromStorage: () => {
    if (typeof window === 'undefined') return;
    const hasToken = window.localStorage.getItem('bjj_token');
    const rawUser = window.localStorage.getItem('bjj_user');
    const rawRoles = window.localStorage.getItem('bjj_roles');

    const cookieRoles = typeof document !== 'undefined'
      ? document.cookie
          .split(';')
          .map((entry) => entry.trim())
          .find((entry) => entry.startsWith('bjj_roles='))
          ?.replace('bjj_roles=', '')
      : undefined;

    const parsedRoles = normalizeRoles(
      rawRoles
        ? JSON.parse(rawRoles)
        : cookieRoles
        ? cookieRoles.split(',')
        : []
    );

    if (!hasToken && !parsedRoles.length) {
      set({ hydrated: true });
      return;
    }

    let parsedUser = null;
    if (rawUser) {
      try {
        parsedUser = JSON.parse(rawUser);
      } catch (error) {
        parsedUser = null;
      }
    }

    const fallbackUser = {
      name: parsedRoles.includes(ROLE_KEYS.student) ? 'Aluno' : 'Instrutor',
      email: parsedRoles.includes(ROLE_KEYS.student) ? 'aluno@bjj.academy' : 'instrutor@bjj.academy',
      avatarUrl: null,
      telefone: null,
      roles: parsedRoles,
      alunoId: parsedRoles.includes(ROLE_KEYS.student) ? initialAlunos[0]?.id || null : null
    };

    set({
      user: parsedUser ? { ...fallbackUser, ...parsedUser, roles: parsedRoles } : fallbackUser,
      token: hasToken || null,
      hydrated: true
    });
  },
  setAlunos: (alunos) =>
    set((state) => {
      const normalizados = alunos.map(normalizeAluno);
      return {
        alunos: applyAttendanceStats(normalizados, state.presencas)
      };
    }),
  setPresencas: (presencas) =>
    set((state) => {
      const lista = Array.isArray(presencas) ? presencas : [];
      return {
        presencas: lista,
        alunos: applyAttendanceStats(state.alunos, lista)
      };
    }),
  setGraduacoes: (graduacoes) => set({ graduacoes }),
  syncAlunoReferencias: (alunoAtualizado) =>
    set((state) => {
      const presencasAtualizadas = state.presencas.map((item) =>
        item.alunoId === alunoAtualizado.id
          ? {
              ...item,
              alunoNome: alunoAtualizado.nome,
              faixa: alunoAtualizado.faixa,
              graus: alunoAtualizado.graus
            }
          : item
      );
      const graduacoesAtualizadas = state.graduacoes.map((item) =>
        item.alunoId === alunoAtualizado.id
          ? {
              ...item,
              alunoNome: alunoAtualizado.nome,
              faixaAtual: alunoAtualizado.faixa,
              grauAtual: alunoAtualizado.graus
            }
          : item
      );
      const alunosAtualizados = state.alunos.map((aluno) =>
        aluno.id === alunoAtualizado.id ? { ...aluno, ...alunoAtualizado } : aluno
      );
      return {
        presencas: presencasAtualizadas,
        graduacoes: graduacoesAtualizadas,
        alunos: applyAttendanceStats(alunosAtualizados, presencasAtualizadas)
      };
    }),
  addPresenca: (novaPresenca) =>
    set((state) => {
      const lista = Array.isArray(state.presencas) ? state.presencas : [];
      const payload = {
        ...novaPresenca,
        hora: novaPresenca.hora ?? getCurrentTime()
      };
      const existenteIndex = lista.findIndex(
        (item) =>
          item.alunoId === payload.alunoId &&
          item.data === payload.data &&
          item.treinoId === payload.treinoId
      );
      const atualizadas =
        existenteIndex >= 0
          ? lista.map((item, index) => (index === existenteIndex ? { ...item, ...payload } : item))
          : [...lista, payload];
      return {
        presencas: atualizadas,
        alunos: applyAttendanceStats(state.alunos, atualizadas)
      };
    }),
  removePresenca: (id) =>
    set((state) => {
      const atualizadas = state.presencas.filter((item) => item.id !== id);
      return {
        presencas: atualizadas,
        alunos: applyAttendanceStats(state.alunos, atualizadas)
      };
    }),
  updatePresenca: (id, payload) =>
    set((state) => {
      const atualizadas = state.presencas.map((item) =>
        item.id === id ? { ...item, ...payload } : item
      );
      return {
        presencas: atualizadas,
        alunos: applyAttendanceStats(state.alunos, atualizadas)
      };
    }),
  togglePresencaStatus: (id) =>
    set((state) => {
      const atualizadas = state.presencas.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'Presente' ? 'Ausente' : 'Presente',
              hora: item.status === 'Presente' ? null : getCurrentTime()
            }
          : item
      );
      return {
        presencas: atualizadas,
        alunos: applyAttendanceStats(state.alunos, atualizadas)
      };
    }),
  updateGraduacaoStatus: (id, payload) =>
    set((state) => ({
      graduacoes: state.graduacoes.map((item) => (item.id === id ? { ...item, ...payload } : item))
    })),
  applyGraduacaoConclusao: (graduacao) =>
    set((state) => {
      if (!graduacao?.alunoId) return {};
      const alunosAtualizados = state.alunos.map((aluno) => {
        if (aluno.id !== graduacao.alunoId) return aluno;
        const historicoAtual = Array.isArray(aluno.historicoGraduacoes)
          ? aluno.historicoGraduacoes
          : [];
        const registroHistorico = {
          id: `history-${Date.now()}`,
          tipo: graduacao.tipo,
          faixa:
            graduacao.tipo === 'Faixa' ? graduacao.proximaFaixa : graduacao.faixaAtual,
          grau: graduacao.tipo === 'Grau' ? graduacao.grauAlvo : null,
          data: graduacao.previsao,
          instrutor: graduacao.instrutor || 'Equipe BJJ Academy',
          descricao:
            graduacao.tipo === 'Faixa'
              ? `${graduacao.faixaAtual} → ${graduacao.proximaFaixa}`
              : `${graduacao.grauAlvo}º grau em ${graduacao.faixaAtual}`
        };

        if (graduacao.tipo === 'Grau') {
          const limite = getMaxStripes(aluno.faixa);
          const novoGrau = Math.min((aluno.graus || 0) + 1, limite || aluno.graus + 1);
          return {
            ...aluno,
            graus: novoGrau,
            mesesNaFaixa: 0,
            dataUltimaGraduacao: graduacao.previsao,
            historicoGraduacoes: [...historicoAtual, registroHistorico]
          };
        }
        if (graduacao.tipo === 'Faixa') {
          const proximaFaixa = graduacao.proximaFaixa || getNextBelt(aluno.faixa) || aluno.faixa;
          const recomendacao = calculateNextStep(
            { ...aluno, faixa: proximaFaixa, graus: 0, mesesNaFaixa: 0 },
            { presencas: state.presencas }
          );
          return {
            ...aluno,
            faixa: proximaFaixa,
            graus: 0,
            mesesNaFaixa: 0,
            dataUltimaGraduacao: graduacao.previsao,
            historicoGraduacoes: [...historicoAtual, registroHistorico],
            proximaMeta: recomendacao
          };
        }
        return {
          ...aluno,
          historicoGraduacoes: [...historicoAtual, registroHistorico]
        };
      });
      return {
        alunos: applyAttendanceStats(alunosAtualizados, state.presencas)
      };
    })
}));

if (typeof window !== 'undefined') {
  useTreinosStore.subscribe((state) => {
    useUserStore.setState({ treinos: state.treinos });
  });
}

export default useUserStore;
