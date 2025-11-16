import { create } from 'zustand';

import { MOCK_PRESENCAS } from '../data/mockPresencas';
import type { Presenca } from '../types/presenca';
import { useAlunosStore } from './alunosStore';

const getCurrentTime = () =>
  new Date()
    .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    .padStart(5, '0');

const syncAlunos = (presencas: Presenca[]) => {
  useAlunosStore.getState().recalculateFromPresencas(presencas);
};

type PresencasState = {
  presencas: Presenca[];
  setPresencas: (presencas: Presenca[]) => void;
  addPresenca: (presenca: Presenca) => void;
  updatePresenca: (id: string, payload: Partial<Presenca>) => void;
  togglePresencaStatus: (id: string) => Presenca | null;
  removePresenca: (id: string) => void;
};

export const usePresencasStore = create<PresencasState>((set) => ({
  presencas: MOCK_PRESENCAS,
  setPresencas: (presencas) => {
    set({ presencas });
    syncAlunos(presencas);
  },
  addPresenca: (presenca) => {
    set((state) => {
      const lista = Array.isArray(state.presencas) ? state.presencas : [];
      const existenteIndex = lista.findIndex(
        (item) =>
          item.alunoId === presenca.alunoId &&
          item.data === presenca.data &&
          item.treinoId === presenca.treinoId
      );
      const payload = { ...presenca, hora: presenca.hora ?? getCurrentTime() };
      const atualizadas =
        existenteIndex >= 0
          ? lista.map((item, index) => (index === existenteIndex ? { ...item, ...payload } : item))
          : [...lista, payload];
      syncAlunos(atualizadas);
      return { presencas: atualizadas };
    });
  },
  updatePresenca: (id, payload) => {
    set((state) => {
      const atualizadas = state.presencas.map((item) => (item.id === id ? { ...item, ...payload } : item));
      syncAlunos(atualizadas);
      return { presencas: atualizadas };
    });
  },
  togglePresencaStatus: (id) => {
    let atualizada: Presenca | null = null;
    set((state) => {
      const atualizadas = state.presencas.map((item) => {
        if (item.id !== id) return item;
        const novoStatus = item.status === 'Presente' ? 'Ausente' : 'Presente';
        atualizada = {
          ...item,
          status: novoStatus,
          hora: novoStatus === 'Presente' ? getCurrentTime() : null
        };
        return atualizada;
      });
      syncAlunos(atualizadas);
      return { presencas: atualizadas };
    });
    return atualizada;
  },
  removePresenca: (id) => {
    set((state) => {
      const atualizadas = state.presencas.filter((item) => item.id !== id);
      syncAlunos(atualizadas);
      return { presencas: atualizadas };
    });
  }
}));
