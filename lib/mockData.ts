type PresencaFluxoMock = {
  id: string;
  alunoId: string;
  alunoNome: string;
  turmaId: string;
  horarioInicio: string;
  horarioFim: string;
  status: 'confirmada' | 'pendente' | 'falta' | 'automatico' | 'atraso' | 'aguardando' | 'corrigida' | 'cancelada';
  data: string;
};

type AlunoFluxoMock = {
  id: string;
  nome: string;
  faixa: string;
  grau: number;
  avatar: string;
  status: 'ativo' | 'inativo' | 'pendente' | 'graduado';
};

type TurmaFluxoMock = {
  id: string;
  modalidade: string;
  inicio: string;
  fim: string;
  professor: string;
  instrutores: string[];
  alunosConfirmados: number;
  alunosPendentes: number;
  alunosFaltaram: number;
  status?: 'ativa' | 'cancelada' | 'lotada' | 'aguardando';
};

type GraduacaoFluxoMock = {
  id: string;
  faixaAnterior: string;
  faixaNova: string;
  grauAnterior: number;
  grauNovo: number;
  data: string;
  professorId: string;
  status: 'confirmada' | 'pendente' | 'recusada';
};

export const presencasFluxoMock: PresencaFluxoMock[] = [
  {
    id: 'pf-1',
    alunoId: '1',
    alunoNome: 'João Silva',
    turmaId: 't1',
    horarioInicio: '2025-11-17T19:00:00',
    horarioFim: '2025-11-17T20:30:00',
    status: 'confirmada',
    data: '2025-11-17'
  },
  {
    id: 'pf-2',
    alunoId: '2',
    alunoNome: 'Maria Souza',
    turmaId: 't2',
    horarioInicio: '2025-11-17T07:00:00',
    horarioFim: '2025-11-17T08:30:00',
    status: 'pendente',
    data: '2025-11-17'
  },
  {
    id: 'pf-3',
    alunoId: '5',
    alunoNome: 'Pedro Lima',
    turmaId: 't3',
    horarioInicio: '2025-11-16T18:00:00',
    horarioFim: '2025-11-16T19:30:00',
    status: 'automatico',
    data: '2025-11-16'
  },
  {
    id: 'pf-4',
    alunoId: '8',
    alunoNome: 'Beatriz Ramos',
    turmaId: 't4',
    horarioInicio: '2025-11-16T10:00:00',
    horarioFim: '2025-11-16T11:30:00',
    status: 'falta',
    data: '2025-11-16'
  },
  {
    id: 'pf-5',
    alunoId: '11',
    alunoNome: 'Lucas Araújo',
    turmaId: 't5',
    horarioInicio: '2025-11-15T17:00:00',
    horarioFim: '2025-11-15T18:30:00',
    status: 'aguardando',
    data: '2025-11-15'
  },
  {
    id: 'pf-6',
    alunoId: '14',
    alunoNome: 'Patrícia Mendes',
    turmaId: 't2',
    horarioInicio: '2025-11-15T19:00:00',
    horarioFim: '2025-11-15T20:30:00',
    status: 'atraso',
    data: '2025-11-15'
  },
  {
    id: 'pf-7',
    alunoId: '17',
    alunoNome: 'Marcelo Dias',
    turmaId: 't1',
    horarioInicio: '2025-11-14T07:00:00',
    horarioFim: '2025-11-14T08:30:00',
    status: 'corrigida',
    data: '2025-11-14'
  },
  {
    id: 'pf-8',
    alunoId: '3',
    alunoNome: 'Carlos Pereira',
    turmaId: 't3',
    horarioInicio: '2025-11-14T18:00:00',
    horarioFim: '2025-11-14T19:30:00',
    status: 'cancelada',
    data: '2025-11-14'
  }
];

export const alunosFluxoMock: AlunoFluxoMock[] = [
  {
    id: '1',
    nome: 'João Silva',
    faixa: 'Roxa',
    grau: 2,
    avatar: 'https://images.unsplash.com/photo-1593104547489-e03a09fd1ccb?auto=format&fit=crop&w=320&q=80',
    status: 'ativo'
  },
  {
    id: '2',
    nome: 'Maria Souza',
    faixa: 'Azul',
    grau: 3,
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80',
    status: 'pendente'
  },
  {
    id: '3',
    nome: 'Carlos Pereira',
    faixa: 'Marrom',
    grau: 1,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80',
    status: 'inativo'
  },
  {
    id: '5',
    nome: 'Pedro Lima',
    faixa: 'Branca',
    grau: 0,
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80',
    status: 'graduado'
  },
  {
    id: '8',
    nome: 'Beatriz Ramos',
    faixa: 'Azul',
    grau: 0,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80',
    status: 'ativo'
  },
  {
    id: '11',
    nome: 'Lucas Araújo',
    faixa: 'Roxa',
    grau: 1,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=320&q=80',
    status: 'ativo'
  },
  {
    id: '14',
    nome: 'Patrícia Mendes',
    faixa: 'Azul',
    grau: 1,
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80',
    status: 'ativo'
  },
  {
    id: '17',
    nome: 'Marcelo Dias',
    faixa: 'Azul',
    grau: 4,
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80',
    status: 'ativo'
  }
];

export const turmasFluxoMock: TurmaFluxoMock[] = [
  {
    id: 't1',
    modalidade: 'Manhã · Gi',
    inicio: '2025-11-17T07:00:00',
    fim: '2025-11-17T08:30:00',
    professor: 'Prof. Bruno',
    instrutores: ['Instrutor Diego'],
    alunosConfirmados: 18,
    alunosPendentes: 3,
    alunosFaltaram: 2,
    status: 'lotada'
  },
  {
    id: 't2',
    modalidade: 'Noite · No-Gi',
    inicio: '2025-11-17T19:00:00',
    fim: '2025-11-17T20:30:00',
    professor: 'Prof. Ana',
    instrutores: ['Instrutor Carla', 'Instrutor Lucas'],
    alunosConfirmados: 12,
    alunosPendentes: 5,
    alunosFaltaram: 1
  },
  {
    id: 't3',
    modalidade: 'Kids · Fundamental',
    inicio: '2025-11-16T18:00:00',
    fim: '2025-11-16T19:30:00',
    professor: 'Prof. Rafa',
    instrutores: ['Instrutor Laura'],
    alunosConfirmados: 8,
    alunosPendentes: 2,
    alunosFaltaram: 0,
    status: 'aguardando'
  },
  {
    id: 't4',
    modalidade: 'Open Mat',
    inicio: '2025-11-16T10:00:00',
    fim: '2025-11-16T12:00:00',
    professor: 'Prof. Mauro',
    instrutores: [],
    alunosConfirmados: 6,
    alunosPendentes: 1,
    alunosFaltaram: 3
  },
  {
    id: 't5',
    modalidade: 'Aula especial de raspagens',
    inicio: '2025-11-15T17:00:00',
    fim: '2025-11-15T18:30:00',
    professor: 'Prof. Ana',
    instrutores: ['Instrutor Diego'],
    alunosConfirmados: 15,
    alunosPendentes: 4,
    alunosFaltaram: 2,
    status: 'ativa'
  },
  {
    id: 't6',
    modalidade: 'Treino de competição',
    inicio: '2025-11-14T18:00:00',
    fim: '2025-11-14T19:30:00',
    professor: 'Prof. Bruno',
    instrutores: ['Instrutor Lucas'],
    alunosConfirmados: 9,
    alunosPendentes: 1,
    alunosFaltaram: 1,
    status: 'cancelada'
  }
];

export const graduacoesFluxoMock: GraduacaoFluxoMock[] = [
  {
    id: 'gr-1',
    faixaAnterior: 'Azul',
    faixaNova: 'Roxa',
    grauAnterior: 4,
    grauNovo: 0,
    data: '2025-05-10',
    professorId: 'prof-ana',
    status: 'confirmada'
  },
  {
    id: 'gr-2',
    faixaAnterior: 'Branca',
    faixaNova: 'Branca',
    grauAnterior: 0,
    grauNovo: 1,
    data: '2025-02-20',
    professorId: 'prof-bruno',
    status: 'pendente'
  },
  {
    id: 'gr-3',
    faixaAnterior: 'Roxa',
    faixaNova: 'Marrom',
    grauAnterior: 2,
    grauNovo: 0,
    data: '2024-12-18',
    professorId: 'prof-mauro',
    status: 'confirmada'
  },
  {
    id: 'gr-4',
    faixaAnterior: 'Azul',
    faixaNova: 'Azul',
    grauAnterior: 1,
    grauNovo: 2,
    data: '2025-01-30',
    professorId: 'prof-ana',
    status: 'recusada'
  },
  {
    id: 'gr-5',
    faixaAnterior: 'Preta',
    faixaNova: 'Preta',
    grauAnterior: 1,
    grauNovo: 2,
    data: '2025-03-12',
    professorId: 'prof-mauro',
    status: 'pendente'
  }
];

export const dashboardMock = {
  professor: {
    presencasHoje: 26,
    pendenciasAprovacao: presencasFluxoMock.filter((p) => p.status === 'pendente').length,
    checkinsAguardando: presencasFluxoMock.filter((p) => p.status === 'aguardando').length,
    alunosAtivos: alunosFluxoMock.filter((a) => a.status === 'ativo').length,
    alunosInativos: alunosFluxoMock.filter((a) => a.status === 'inativo').length,
    alunosGraduados: alunosFluxoMock.filter((a) => a.status === 'graduado').length,
    faixasEmProgresso: graduacoesFluxoMock.filter((g) => g.status !== 'confirmada').length,
    graficoSemanal: [18, 22, 24, 20, 26, 19, 15],
    graficoMensal: Array.from({ length: 30 }, (_, idx) => 12 + Math.round(Math.sin(idx / 4) * 6))
  },
  instrutor: {
    turmasDoDia: turmasFluxoMock.slice(0, 3),
    alunosConfirmadosPendentes: turmasFluxoMock.map((turma) => ({
      turmaId: turma.id,
      confirmados: turma.alunosConfirmados,
      pendentes: turma.alunosPendentes
    })),
    presencasPorHorario: [
      { hora: '07:00', presencas: 14 },
      { hora: '10:00', presencas: 9 },
      { hora: '18:00', presencas: 16 },
      { hora: '19:00', presencas: 21 }
    ],
    historicoRecente: presencasFluxoMock.slice(0, 5),
    acoesRapidas: ['Liberar check-in automático', 'Confirmar ausências', 'Reabrir turma cancelada'],
    pendenciasDoDia: presencasFluxoMock.filter((p) => p.status === 'pendente' || p.status === 'aguardando')
  },
  aluno: {
    minhaPresencaHoje: presencasFluxoMock.find((p) => p.alunoId === '1'),
    faltasNaSemana: presencasFluxoMock.filter((p) => p.status === 'falta').length,
    progressoFaixa: { faixa: 'Roxa', percent: 62 },
    proximaGraduacao: graduacoesFluxoMock.find((g) => g.status === 'pendente'),
    historicoMensal: presencasFluxoMock,
    aulasRecomendadas: turmasFluxoMock.filter((turma) => turma.status !== 'cancelada').slice(0, 3)
  }
};
