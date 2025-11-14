/**
 * Zustand store centraliza informações do usuário logado
 * e fornece utilitários para mock de autenticação, alunos,
 * presenças e graduações simulando o comportamento do backend.
 */
import { create } from 'zustand';

// Dados iniciais de alunos para alimentar as telas de listagem e formulários.
const mockAlunos = [
  { id: '1', nome: 'João Silva', telefone: '(11) 98888-7766', plano: 'Mensal', status: 'Ativo' },
  { id: '2', nome: 'Maria Souza', telefone: '(21) 97777-6655', plano: 'Anual', status: 'Ativo' },
  { id: '3', nome: 'Carlos Pereira', telefone: '(31) 96666-5544', plano: 'Trimestral', status: 'Inativo' }
];

// Presenças simuladas com status mutável para demonstrar as interações do painel.
const mockPresencas = [
  { id: 'p1', alunoId: '1', alunoNome: 'João Silva', data: '2024-05-02', status: 'Presente' },
  { id: 'p2', alunoId: '2', alunoNome: 'Maria Souza', data: '2024-05-02', status: 'Ausente' },
  { id: 'p3', alunoId: '3', alunoNome: 'Carlos Pereira', data: '2024-05-01', status: 'Presente' }
];

// Graduações mock seguem a lógica de acompanhamento das próximas faixas.
const mockGraduacoes = [
  {
    id: 'g1',
    alunoId: '1',
    alunoNome: 'João Silva',
    faixaAtual: 'Roxa',
    proximaFaixa: 'Marrom',
    previsao: '2024-10-15',
    status: 'Em progresso'
  },
  {
    id: 'g2',
    alunoId: '2',
    alunoNome: 'Maria Souza',
    faixaAtual: 'Azul',
    proximaFaixa: 'Roxa',
    previsao: '2025-01-20',
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
  setAlunos: (alunos) => set({ alunos }),
  setPresencas: (presencas) => set({ presencas }),
  setGraduacoes: (graduacoes) => set({ graduacoes }),
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
    }))
}));

export default useUserStore;
