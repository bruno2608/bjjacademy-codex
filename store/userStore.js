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
  mesesNaFaixa: Number(aluno.mesesNaFaixa ?? 0)
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
    dataUltimaGraduacao: '2023-03-10'
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
    dataUltimaGraduacao: '2022-12-01'
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
    dataUltimaGraduacao: '2023-11-18'
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
    status: 'Em progresso'
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
    status: 'Planejado'
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
        if (graduacao.tipo === 'Grau') {
          const limite = getMaxStripes(aluno.faixa);
          const novoGrau = Math.min((aluno.graus || 0) + 1, limite || aluno.graus + 1);
          return {
            ...aluno,
            graus: novoGrau,
            mesesNaFaixa: 0,
            dataUltimaGraduacao: graduacao.previsao
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
            proximaMeta: recomendacao
          };
        }
        return aluno;
      });
      return { alunos: alunosAtualizados };
    })
}));

export default useUserStore;
