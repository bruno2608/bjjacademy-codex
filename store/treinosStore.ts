import { create } from 'zustand';

/**
 * Store responsável por orquestrar a grade de treinos da academia.
 * É utilizado na tela de presenças e na área de configurações para cadastrar sessões mockadas.
 */

export type Treino = {
  id: string;
  nome: string;
  diaSemana: string;
  hora: string;
  tipo: string;
  ativo: boolean;
};

const STORAGE_KEY = 'bjjacademy_treinos';

export const DEFAULT_TREINOS: Treino[] = [
  { id: 't1', nome: 'Manhã · Gi', tipo: 'Gi', diaSemana: 'segunda', hora: '07:30', ativo: true },
  { id: 't2', nome: 'Noite · No-Gi', tipo: 'No-Gi', diaSemana: 'segunda', hora: '19:30', ativo: true },
  { id: 't3', nome: 'Competição', tipo: 'Competição', diaSemana: 'quarta', hora: '20:00', ativo: true },
  { id: 't4', nome: 'Kids · Fundamental', tipo: 'Kids', diaSemana: 'terça', hora: '18:00', ativo: true },
  { id: 't5', nome: 'Open Mat', tipo: 'Livre', diaSemana: 'sábado', hora: '10:00', ativo: true },
  { id: 't6', nome: 'Tarde · Gi', tipo: 'Gi', diaSemana: 'quinta', hora: '16:00', ativo: true }
];

const readStorage = (): Treino[] => {
  if (typeof window === 'undefined') {
    return DEFAULT_TREINOS;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_TREINOS;
    }
    const parsed = JSON.parse(stored) as Treino[];
    if (!Array.isArray(parsed) || !parsed.length) {
      return DEFAULT_TREINOS;
    }
    return parsed.map((item) => ({ ...item, ativo: item.ativo ?? true }));
  } catch (error) {
    console.warn('Não foi possível carregar os treinos salvos.', error);
    return DEFAULT_TREINOS;
  }
};

const persistTreinos = (treinos: Treino[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(treinos));
};

export type TreinosStore = {
  treinos: Treino[];
  addTreino: (payload: Omit<Treino, 'id'>) => Treino;
  updateTreino: (id: string, payload: Partial<Omit<Treino, 'id'>>) => void;
  toggleTreinoStatus: (id: string) => void;
  removeTreino: (id: string) => void;
  resetTreinos: () => void;
};

export const useTreinosStore = create<TreinosStore>((set, get) => ({
  treinos: readStorage(),
  addTreino: (payload) => {
    const novo: Treino = { ...payload, id: `treino-${Date.now()}` };
    set((state) => {
      const atualizados = [...state.treinos, novo];
      persistTreinos(atualizados);
      return { treinos: atualizados };
    });
    return novo;
  },
  updateTreino: (id, payload) => {
    set((state) => {
      const atualizados = state.treinos.map((treino) =>
        treino.id === id ? { ...treino, ...payload } : treino
      );
      persistTreinos(atualizados);
      return { treinos: atualizados };
    });
  },
  toggleTreinoStatus: (id) => {
    set((state) => {
      const atualizados = state.treinos.map((treino) =>
        treino.id === id ? { ...treino, ativo: !treino.ativo } : treino
      );
      persistTreinos(atualizados);
      return { treinos: atualizados };
    });
  },
  removeTreino: (id) => {
    set((state) => {
      const atualizados = state.treinos.filter((treino) => treino.id !== id);
      persistTreinos(atualizados);
      return { treinos: atualizados };
    });
  },
  resetTreinos: () => {
    persistTreinos(DEFAULT_TREINOS);
    set({ treinos: DEFAULT_TREINOS });
  }
}));
