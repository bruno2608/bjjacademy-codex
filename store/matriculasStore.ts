import { create } from 'zustand';

import { listarMatriculas } from '@/services/matriculasService';
import type { Matricula } from '@/types';

type MatriculasState = {
  matriculas: Matricula[];
  carregarMatriculas: () => Promise<void>;
  listarAtivasDaAcademia: (academiaId: string) => Matricula[];
};

export const useMatriculasStore = create<MatriculasState>((set, get) => ({
  matriculas: [],
  carregarMatriculas: async () => {
    const data = await listarMatriculas();
    set({ matriculas: data });
  },
  listarAtivasDaAcademia: (academiaId) =>
    get().matriculas.filter((matricula) => matricula.academiaId === academiaId && matricula.status === 'ativo')
}));
