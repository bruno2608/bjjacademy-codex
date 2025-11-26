import { create } from 'zustand';

import { listarAulas } from '@/services/aulasService';
import type { AulaInstancia } from '@/types';

type AulasState = {
  aulas: AulaInstancia[];
  carregarAulas: () => Promise<void>;
  listarAulasDaTurma: (turmaId: string) => AulaInstancia[];
};

export const useAulasStore = create<AulasState>((set, get) => ({
  aulas: [],
  carregarAulas: async () => {
    const data = await listarAulas();
    set({ aulas: data });
  },
  listarAulasDaTurma: (turmaId) => get().aulas.filter((aula) => aula.turmaId === turmaId)
}));
