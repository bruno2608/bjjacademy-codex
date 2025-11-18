import type { GraduationHistoryEntry } from './graduacao';
import type { GraduationRecommendation } from '../lib/graduationRules';

export type AlunoStatus = 'Ativo' | 'Inativo';

export type Aluno = {
  id: string;
  nome: string;
  telefone: string;
  plano: string;
  status: AlunoStatus;
  faixa: string;
  graus: number;
  mesesNaFaixa: number;
  avatarUrl?: string | null;
  dataInicio: string;
  dataNascimento?: string | null;
  dataUltimaGraduacao?: string | null;
  historicoGraduacoes: GraduationHistoryEntry[];
  aulasTotais?: number;
  aulasDesdeUltimaFaixa?: number;
  aulasNoGrauAtual?: number;
  proximaMeta?: GraduationRecommendation | null;
};

export type NovoAlunoPayload = Omit<Aluno, 'id' | 'historicoGraduacoes'> & {
  historicoGraduacoes?: GraduationHistoryEntry[];
};
