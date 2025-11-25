import type { GraduationHistoryEntry } from './graduacao';
import type { GraduationRecommendation } from '../lib/graduationRules';

export type AlunoStatus = 'ATIVO' | 'INATIVO' | 'Ativo' | 'Inativo';

export type Aluno = {
  id: string;
  nome: string;
  nomeCompleto?: string;
  faixaSlug: string;
  graus: number;
  plano: string;
  status: AlunoStatus;
  avatarUrl?: string | null;
  telefone?: string | null;
  email?: string | null;
  academiaId?: string | null;
  // Campos legados mantidos para compatibilidade das telas existentes
  faixa?: string;
  mesesNaFaixa?: number;
  dataInicio?: string;
  dataNascimento?: string | null;
  dataUltimaGraduacao?: string | null;
  historicoGraduacoes?: GraduationHistoryEntry[];
  aulasTotais?: number;
  aulasDesdeUltimaFaixa?: number;
  aulasNoGrauAtual?: number;
  proximaMeta?: GraduationRecommendation | null;
};

export type NovoAlunoPayload = Omit<Aluno, 'id' | 'historicoGraduacoes'> & {
  historicoGraduacoes?: GraduationHistoryEntry[];
};
