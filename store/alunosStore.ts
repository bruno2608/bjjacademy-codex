import { create } from 'zustand';

import { MOCK_ALUNOS } from '@/data/mocks/mockAlunos';
import { applyAttendanceStats, normalizeAluno, normalizeFaixaSlug } from '../lib/alunoStats';
import { calculateNextStep, getMaxStripes, getNextBelt } from '../lib/graduationRules';
import type { Aluno, NovoAlunoPayload } from '../types/aluno';
import type { GraduacaoPlanejada, GraduationHistoryEntry } from '../types/graduacao';
import type { PresencaRegistro } from '../types/presenca';

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
  presencasCache: PresencaRegistro[];
  setAlunos: (alunos: Aluno[], presencas?: PresencaRegistro[]) => void;
  addAluno: (payload: NovoAlunoPayload, presencas?: PresencaRegistro[]) => Aluno;
  updateAluno: (id: string, payload: Partial<NovoAlunoPayload>, presencas?: PresencaRegistro[]) => Aluno | null;
  removeAluno: (id: string, presencas?: PresencaRegistro[]) => void;
  recalculateFromPresencas: (presencas: PresencaRegistro[]) => void;
  applyGraduacaoConclusao: (graduacao: GraduacaoPlanejada, presencas?: PresencaRegistro[]) => void;
};

const ALUNOS_KEY = 'bjj_alunos';

const loadAlunosFromStorage = (): Aluno[] | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(ALUNOS_KEY);
    return raw ? (JSON.parse(raw) as Aluno[]) : null;
  } catch (error) {
    console.warn('Não foi possível carregar alunos salvos, usando mocks.', error);
    return null;
  }
};

const persistAlunos = (alunos: Aluno[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ALUNOS_KEY, JSON.stringify(alunos));
  } catch (error) {
    console.warn('Não foi possível salvar alunos localmente.', error);
  }
};

const initialAlunos = loadAlunosFromStorage() ?? MOCK_ALUNOS;

export const useAlunosStore = create<AlunosState>((set, get) => ({
  alunos: initialAlunos,
  getAlunoById: (id) => get().alunos.find((a) => a.id === id) ?? null,
  presencasCache: [],
  setAlunos: (alunos, presencas) => {
    const presencasAtuais = presencas ?? get().presencasCache;
    const normalizados = alunos.map((aluno) => normalizeAluno(aluno));
    const comStats = applyAttendanceStats(normalizados, presencasAtuais);
    persistAlunos(comStats);
    set({
      alunos: comStats,
      presencasCache: presencasAtuais
    });
  },
  addAluno: (payload, presencas) => {
    const presencasAtuais = presencas ?? get().presencasCache;
    const aluno = normalizeAluno({ ...payload, id: payload.id ?? `aluno-${Date.now()}` });
    const proximoEstado = applyAttendanceStats([...get().alunos, aluno], presencasAtuais);
    persistAlunos(proximoEstado);
    set((state) => ({
      alunos: proximoEstado,
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
      persistAlunos(atualizados);
      return {
        alunos: applyAttendanceStats(atualizados, presencasAtuais),
        presencasCache: presencasAtuais
      };
    });
    return alunoAtualizado;
  },
  removeAluno: (id, presencas) => {
    const presencasAtuais = presencas ?? get().presencasCache;
    set((state) => {
      const filtrados = state.alunos.filter((aluno) => aluno.id !== id);
      persistAlunos(filtrados);
      return {
        alunos: applyAttendanceStats(filtrados, presencasAtuais),
        presencasCache: presencasAtuais
      };
    });
  },
  recalculateFromPresencas: (presencas) => {
    set((state) => {
      const atualizados = applyAttendanceStats(state.alunos, presencas);
      persistAlunos(atualizados);
      return {
        alunos: atualizados,
        presencasCache: presencas
      };
    });
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

      const alunosComStats = applyAttendanceStats(alunosAtualizados, presencasAtuais);
      persistAlunos(alunosComStats);
      return {
        alunos: alunosComStats,
        presencasCache: presencasAtuais
      };
    });
  }
}));

