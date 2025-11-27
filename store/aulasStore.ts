import { create } from 'zustand';

import { atualizarStatusAula, buscarAulaPorTurmaEData, listarAulas } from '@/services/aulasService';
import type { AulaInstancia } from '@/types';

type AulasState = {
  aulas: AulaInstancia[];
  carregarAulas: () => Promise<void>;
  listarAulasDaTurma: (turmaId: string) => AulaInstancia[];
  getAulaById: (id: string) => AulaInstancia | null;
  getAulaByTurmaAndDate: (
    turmaId: string,
    data: string,
    fallbackHorario?: { horaInicio: string; horaFim: string }
  ) => Promise<AulaInstancia>;
  atualizarStatusLocal: (aulaId: string, status: AulaInstancia['status']) => void;
};

export const useAulasStore = create<AulasState>((set, get) => ({
  aulas: [],
  carregarAulas: async () => {
    const data = await listarAulas();
    set({ aulas: data });
  },
  listarAulasDaTurma: (turmaId) => get().aulas.filter((aula) => aula.turmaId === turmaId),
  getAulaById: (id) => get().aulas.find((aula) => aula.id === id) ?? null,
  getAulaByTurmaAndDate: async (turmaId, data, fallbackHorario) => {
    const local = get().aulas.find((aula) => aula.turmaId === turmaId && aula.data === data);
    if (local) return local;

    const criada = await buscarAulaPorTurmaEData(turmaId, data, fallbackHorario);
    set((state) => ({ aulas: [...state.aulas.filter((aula) => aula.id !== criada.id), criada] }));
    return criada;
  },
  atualizarStatusLocal: (aulaId, status) => {
    set((state) => ({ aulas: state.aulas.map((aula) => (aula.id === aulaId ? { ...aula, status } : aula)) }));
    atualizarStatusAula(aulaId, status);
  }
}));
