/**
 * Zustand store centraliza informações do usuário logado
 * e fornece utilitários para mock de autenticação e dados de alunos.
 */
import { create } from 'zustand';

const mockAlunos = [
  { id: '1', nome: 'João Silva', telefone: '(11) 98888-7766', plano: 'Mensal', status: 'Ativo' },
  { id: '2', nome: 'Maria Souza', telefone: '(21) 97777-6655', plano: 'Anual', status: 'Ativo' },
  { id: '3', nome: 'Carlos Pereira', telefone: '(31) 96666-5544', plano: 'Trimestral', status: 'Inativo' }
];

const useUserStore = create((set) => ({
  user: null,
  token: null,
  alunos: mockAlunos,
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
  setAlunos: (alunos) => set({ alunos })
}));

export default useUserStore;
