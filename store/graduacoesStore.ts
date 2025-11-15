import { create } from 'zustand';

import { MOCK_GRADUACOES } from '../data/mockGraduacoes';
import type { GraduacaoPlanejada } from '../types/graduacao';
import type { Presenca } from '../types/presenca';
import { useAlunosStore } from './alunosStore';
import { usePresencasStore } from './presencasStore';

const obterPresencasAtuais = (): Presenca[] => usePresencasStore.getState().presencas;

type GraduacoesState = {
  graduacoes: GraduacaoPlanejada[];
  setGraduacoes: (lista: GraduacaoPlanejada[]) => void;
  updateGraduacaoStatus: (id: string, payload: Partial<GraduacaoPlanejada>) => void;
  applyGraduacaoConclusao: (graduacao: GraduacaoPlanejada) => void;
};

export const useGraduacoesStore = create<GraduacoesState>((set) => ({
  graduacoes: MOCK_GRADUACOES,
  setGraduacoes: (lista) => {
    set({ graduacoes: lista });
  },
  updateGraduacaoStatus: (id, payload) => {
    set((state) => ({
      graduacoes: state.graduacoes.map((item) => (item.id === id ? { ...item, ...payload } : item))
    }));
  },
  applyGraduacaoConclusao: (graduacao) => {
    const presencas = obterPresencasAtuais();
    useAlunosStore.getState().applyGraduacaoConclusao(graduacao, presencas);
  }
}));
