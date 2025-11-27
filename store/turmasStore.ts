import { create } from 'zustand';

import { listarTurmas } from '@/services/turmasService';
import type { Turma } from '@/types';

type TurmasState = {
  turmas: Turma[];
  carregarTurmas: () => Promise<void>;
  getTurmaById: (id: string) => Turma | null;
  listarTurmasDaAcademia: (academiaId: string) => Turma[];
};

export const useTurmasStore = create<TurmasState>((set, get) => ({
  turmas: [],
  carregarTurmas: async () => {
    const data = await listarTurmas();
    set({ turmas: data });
  },
  getTurmaById: (id) => get().turmas.find((turma) => turma.id === id) ?? null,
  listarTurmasDaAcademia: (academiaId) => get().turmas.filter((turma) => turma.academiaId === academiaId)
}));
