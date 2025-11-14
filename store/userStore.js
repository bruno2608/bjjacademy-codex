/**
 * Zustand store centraliza informações do usuário logado
 * e fornece utilitários para mock de autenticação, alunos,
 * presenças e graduações simulando o comportamento do backend.
 */
import { create } from 'zustand';
import { calculateNextStep, getMaxStripes, getNextBelt } from '../lib/graduationRules';

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
  })
];

// Presenças simuladas com status mutável para demonstrar as interações do painel.
const mockPresencas = [
  {
    id: 'p1',
    alunoId: '1',
    alunoNome: 'João Silva',
    faixa: 'Roxa',
    graus: 2,
    data: '2024-05-02',
    status: 'Presente'
  },
  {
    id: 'p2',
    alunoId: '2',
    alunoNome: 'Maria Souza',
    faixa: 'Azul',
    graus: 3,
    data: '2024-05-02',
    status: 'Ausente'
  },
  {
    id: 'p3',
    alunoId: '3',
    alunoNome: 'Carlos Pereira',
    faixa: 'Marrom',
    graus: 1,
    data: '2024-05-01',
    status: 'Presente'
  }
];

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
  }
];

const useUserStore = create((set) => ({
  user: null,
  token: null,
  alunos: mockAlunos,
  presencas: mockPresencas,
  graduacoes: mockGraduacoes,
  login: ({ email }) => {
    const fakeToken = 'bjj-token-' + Date.now();
    localStorage.setItem('bjj_token', fakeToken);
    set({
      user: { name: email.split('@')[0] || 'Instrutor' },
      token: fakeToken
    });
  },
  logout: () => {
    localStorage.removeItem('bjj_token');
    set({ user: null, token: null });
  },
  setAlunos: (alunos) => set({ alunos: alunos.map(normalizeAluno) }),
  setPresencas: (presencas) => set({ presencas }),
  setGraduacoes: (graduacoes) => set({ graduacoes }),
  syncAlunoReferencias: (alunoAtualizado) =>
    set((state) => ({
      presencas: state.presencas.map((item) =>
        item.alunoId === alunoAtualizado.id
          ? { ...item, alunoNome: alunoAtualizado.nome, faixa: alunoAtualizado.faixa, graus: alunoAtualizado.graus }
          : item
      ),
      graduacoes: state.graduacoes.map((item) =>
        item.alunoId === alunoAtualizado.id
          ? {
              ...item,
              alunoNome: alunoAtualizado.nome,
              faixaAtual: alunoAtualizado.faixa,
              grauAtual: alunoAtualizado.graus
            }
          : item
      )
    })),
  addPresenca: (novaPresenca) =>
    set((state) => ({ presencas: [...state.presencas, novaPresenca] })),
  removePresenca: (id) =>
    set((state) => ({ presencas: state.presencas.filter((item) => item.id !== id) })),
  togglePresencaStatus: (id) =>
    set((state) => ({
      presencas: state.presencas.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'Presente' ? 'Ausente' : 'Presente' }
          : item
      )
    })),
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
          const recomendacao = calculateNextStep({ ...aluno, faixa: proximaFaixa, graus: 0, mesesNaFaixa: 0 });
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
      return { alunos: alunosAtualizados };
    })
}));

export default useUserStore;
