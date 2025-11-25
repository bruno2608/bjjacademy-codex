import { create } from 'zustand';

import type { Treino } from '../types/treino';

/**
 * Store responsável por orquestrar a grade de treinos da academia.
 * É utilizado na tela de presenças e na área de configurações para cadastrar sessões mockadas.
 */

const STORAGE_KEY = 'bjjacademy_treinos';
const BASE_DATE = new Date().toISOString().split('T')[0];

export const DEFAULT_TREINOS: Treino[] = [
  {
    id: 't1',
    academiaId: 'academia_default',
    data: BASE_DATE,
    horaInicio: '07:30',
    nome: 'Manhã · Gi',
    tipo: 'Gi',
    diaSemana: 'segunda',
    hora: '07:30',
    titulo: 'Manhã · Gi',
    ativo: true
  },
  {
    id: 't2',
    academiaId: 'academia_default',
    data: BASE_DATE,
    horaInicio: '19:30',
    nome: 'Noite · No-Gi',
    tipo: 'No-Gi',
    diaSemana: 'segunda',
    hora: '19:30',
    titulo: 'Noite · No-Gi',
    ativo: true
  },
  {
    id: 't3',
    academiaId: 'academia_default',
    data: BASE_DATE,
    horaInicio: '20:00',
    nome: 'Competição',
    tipo: 'Competição',
    diaSemana: 'quarta',
    hora: '20:00',
    titulo: 'Competição',
    ativo: true
  },
  {
    id: 't4',
    academiaId: 'academia_default',
    data: BASE_DATE,
    horaInicio: '18:00',
    nome: 'Kids · Fundamental',
    tipo: 'Kids',
    diaSemana: 'terça',
    hora: '18:00',
    titulo: 'Kids · Fundamental',
    ativo: true
  },
  {
    id: 't5',
    academiaId: 'academia_default',
    data: BASE_DATE,
    horaInicio: '10:00',
    nome: 'Open Mat',
    tipo: 'Livre',
    diaSemana: 'sábado',
    hora: '10:00',
    titulo: 'Open Mat',
    ativo: true
  },
  {
    id: 't6',
    academiaId: 'academia_default',
    data: BASE_DATE,
    horaInicio: '16:00',
    nome: 'Tarde · Gi',
    tipo: 'Gi',
    diaSemana: 'quinta',
    hora: '16:00',
    titulo: 'Tarde · Gi',
    ativo: true
  }
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
  addTreino: (payload: Partial<Omit<Treino, 'id'>>) => Treino;
  updateTreino: (id: string, payload: Partial<Omit<Treino, 'id'>>) => void;
  toggleTreinoStatus: (id: string) => void;
  removeTreino: (id: string) => void;
  resetTreinos: () => void;
};

export const useTreinosStore = create<TreinosStore>((set, get) => ({
  treinos: readStorage(),
  addTreino: (payload) => {
    const novo: Treino = {
      id: `treino-${Date.now()}`,
      academiaId: payload.academiaId ?? 'academia_default',
      data: payload.data ?? BASE_DATE,
      horaInicio: payload.horaInicio ?? payload.hora ?? '00:00',
      titulo: payload.titulo ?? payload.nome ?? payload.tipo ?? 'Treino',
      ativo: payload.ativo ?? true,
      nome: payload.nome ?? payload.titulo ?? payload.tipo ?? 'Treino',
      diaSemana: payload.diaSemana ?? 'segunda',
      hora: payload.hora ?? payload.horaInicio ?? '00:00',
      tipo: payload.tipo ?? 'Livre',
    };
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
