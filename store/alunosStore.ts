import { create } from 'zustand';

import { MOCK_ALUNOS } from '@/data/mocks/mockAlunos';
import { MOCK_PRESENCAS } from '../data/mockPresencas';
import { applyAttendanceStats, normalizeAluno, normalizeFaixaSlug } from '../lib/alunoStats';
import { calculateNextStep, getMaxStripes, getNextBelt } from '../lib/graduationRules';
import type { Aluno, NovoAlunoPayload } from '../types/aluno';
import type { GraduacaoPlanejada, GraduationHistoryEntry } from '../types/graduacao';
import type { Presenca } from '../types/presenca';

const buildHistoricoRegistro = (
  graduacao: GraduacaoPlanejada,
  descricao: string
): GraduationHistoryEntry => ({
  id: `history-${Date.now()}`,
  tipo: graduacao.tipo,
  faixa: graduacao.tipo === 'Faixa' ? graduacao.proximaFaixa ?? graduacao.faixaAtual : graduacao.faixaAtual,
  faixaSlug: normalizeFaixaSlug(
    graduacao.tipo === 'Faixa'
      ? graduacao.proximaFaixa ?? graduacao.faixaAtual
      : graduacao.faixaAtual
  ),
  grau: graduacao.tipo === 'Grau' ? graduacao.grauAlvo : null,
  data: graduacao.previsao,
  instrutor: graduacao.instrutor || 'Equipe BJJ Academy',
  descricao
});

type AlunosState = {
  alunos: Aluno[];
  getAlunoById: (id: string) => Aluno | null;
  presencasCache: Presenca[];
  setAlunos: (alunos: Aluno[], presencas?: Presenca[]) => void;
  addAluno: (payload: NovoAlunoPayload, presencas?: Presenca[]) => Aluno;
  updateAluno: (id: string, payload: Partial<NovoAlunoPayload>, presencas?: Presenca[]) => Aluno | null;
  removeAluno: (id: string, presencas?: Presenca[]) => void;
  recalculateFromPresencas: (presencas: Presenca[]) => void;
  applyGraduacaoConclusao: (graduacao: GraduacaoPlanejada, presencas?: Presenca[]) => void;
};

const initialAlunos = MOCK_ALUNOS;

export const useAlunosStore = create<AlunosState>((set, get) => ({
  alunos: initialAlunos,
  getAlunoById: (id) => get().alunos.find((a) => a.id === id) ?? null,
  presencasCache: [],
  setAlunos: (alunos, presencas) => {
    const presencasAtuais = presencas ?? get().presencasCache;
    const normalizados = alunos.map((aluno) => normalizeAluno(aluno));
    set({
      alunos: applyAttendanceStats(normalizados, presencasAtuais),
      presencasCache: presencasAtuais
    });
  },
  addAluno: (payload, presencas) => {
    const presencasAtuais = presencas ?? get().presencasCache;
    const aluno = normalizeAluno({ ...payload, id: payload.id ?? `aluno-${Date.now()}` });
    set((state) => ({
      alunos: applyAttendanceStats([...state.alunos, aluno], presencasAtuais),
      presencasCache: presencasAtuais
    }));
    return aluno;
  },
  updateAluno: (id, payload, presencas) => {
    const presencasAtuais = presencas ?? get().presencasCache;
    let alunoAtualizado: Aluno | null = null;
    set((state) => {
      const atualizados = state.alunos.map((aluno) => {
        if (aluno.id !== id) return aluno;
        alunoAtualizado = normalizeAluno({ ...aluno, ...payload, id });
        return alunoAtualizado;
      });
      return {
        alunos: applyAttendanceStats(atualizados, presencasAtuais),
        presencasCache: presencasAtuais
      };
    });
    return alunoAtualizado;
  },
  removeAluno: (id, presencas) => {
    const presencasAtuais = presencas ?? get().presencasCache;
    set((state) => ({
      alunos: applyAttendanceStats(
        state.alunos.filter((aluno) => aluno.id !== id),
        presencasAtuais
      ),
      presencasCache: presencasAtuais
    }));
  },
  recalculateFromPresencas: (presencas) => {
    set((state) => ({
      alunos: applyAttendanceStats(state.alunos, presencas),
      presencasCache: presencas
    }));
  },
  applyGraduacaoConclusao: (graduacao, presencas) => {
    const presencasAtuais = presencas ?? get().presencasCache;
    set((state) => {
      const alunosAtualizados = state.alunos.map((aluno) => {
        if (aluno.id !== graduacao.alunoId) return aluno;

        const historicoAtual = Array.isArray(aluno.historicoGraduacoes)
          ? aluno.historicoGraduacoes
          : [];

        if (graduacao.tipo === 'Grau') {
          const limite = getMaxStripes(aluno.faixa);
          const novoGrau = Math.min((aluno.graus ?? 0) + 1, limite || (aluno.graus ?? 0) + 1);
          const registro = buildHistoricoRegistro(
            graduacao,
            `${graduacao.grauAlvo}º grau em ${graduacao.faixaAtual}`
          );
          return {
            ...aluno,
            graus: novoGrau,
            mesesNaFaixa: 0,
            dataUltimaGraduacao: graduacao.previsao,
            historicoGraduacoes: [...historicoAtual, registro]
          };
        }

        if (graduacao.tipo === 'Faixa') {
          const proximaFaixa = graduacao.proximaFaixa || getNextBelt(aluno.faixa) || aluno.faixa;
          const registro = buildHistoricoRegistro(
            graduacao,
            `${graduacao.faixaAtual} → ${proximaFaixa}`
          );
          const recomendacao = calculateNextStep(
            { ...aluno, faixa: proximaFaixa, graus: 0, mesesNaFaixa: 0 },
            { presencas: presencasAtuais }
          );
          return {
            ...aluno,
            faixa: proximaFaixa,
            graus: 0,
            mesesNaFaixa: 0,
            dataUltimaGraduacao: graduacao.previsao,
            historicoGraduacoes: [...historicoAtual, registro],
            proximaMeta: recomendacao
          };
        }

        return aluno;
      });

      return {
        alunos: applyAttendanceStats(alunosAtualizados, presencasAtuais),
        presencasCache: presencasAtuais
      };
    });
  }
}));

useAlunosStore.getState().recalculateFromPresencas(MOCK_PRESENCAS);
