import { create } from 'zustand';

import { listarAcademias } from '@/services/academiasService';
import type { Academia } from '@/types';

type AcademiasState = {
  academias: Academia[];
  carregarAcademias: () => Promise<void>;
  getAcademiaById: (id: string) => Academia | null;
};

export const useAcademiasStore = create<AcademiasState>((set, get) => ({
  academias: [],
  carregarAcademias: async () => {
    const data = await listarAcademias();
    set({ academias: data });
  },
  getAcademiaById: (id) => get().academias.find((item) => item.id === id) ?? null
}));
