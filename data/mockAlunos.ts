import type { Aluno } from '../types';
import { normalizeAluno } from '../lib/alunoStats';

const BIRTHDAYS_BY_ID: Record<string, string> = {
  '1': '1990-01-05',
  '2': '1992-02-14',
  '3': '1991-03-08',
  '4': '1988-04-22',
  '5': '1993-05-17',
  '6': '1990-06-11',
  '7': '1992-07-09',
  '8': '1989-08-27',
  '9': '1994-09-03',
  '10': '1987-10-30',
  '11': '1996-11-12',
  '12': '1992-12-19',
  '13': '1990-01-21',
  '14': '1993-02-27',
  '15': '1995-03-25',
  '16': '1991-04-05',
  '17': '1995-05-28',
  '18': '1991-06-29',
  '19': '1992-07-24',
  '20': '1990-08-15'
};

const BASE_MOCK_ALUNOS: Aluno[] = [
  normalizeAluno({
    id: '1',
    nome: 'João Silva',
    telefone: '(11) 98888-7766',
    plano: 'Mensal',
    status: 'Ativo',
    faixa: 'Roxa',
    graus: 2,
    mesesNaFaixa: 14,
    avatarUrl: 'https://images.unsplash.com/photo-1593104547489-e03a09fd1ccb?auto=format&fit=crop&w=320&q=80',
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
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80',
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

export const MOCK_ALUNOS: Aluno[] = BASE_MOCK_ALUNOS.map((aluno) => ({
  ...aluno,
  dataNascimento: aluno.dataNascimento ?? BIRTHDAYS_BY_ID[aluno.id] ?? null
}));
