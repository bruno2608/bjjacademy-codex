export type GraduationHistoryEntry = {
  id: string;
  tipo: 'Faixa' | 'Grau';
  faixa: string;
  faixaSlug?: string | null;
  grau: number | null;
  data: string;
  instrutor: string;
  descricao?: string;
};

export type GraduacaoStatus =
  | 'Planejado'
  | 'Em progresso'
  | 'Em avaliação'
  | 'Pronto para avaliar'
  | 'Concluído';

export type GraduacaoPlanejada = {
  id: string;
  alunoId: string;
  alunoNome: string;
  faixaAtual: string;
  proximaFaixa: string | null;
  tipo: 'Faixa' | 'Grau';
  grauAlvo: number | null;
  criterioTempo: string;
  mesesRestantes: number;
  previsao: string;
  instrutor: string;
  status: GraduacaoStatus;
};

export type GraduationRecommendationBase = {
  tipo: 'Faixa' | 'Grau';
  faixaAtual: string;
  tempoNecessario: number;
  mesesRestantes: number;
  descricao: string;
  aulasMinimasRequeridas: number | null;
  aulasRealizadasNaFaixa: number | null;
  aulasRestantesFaixa: number | null;
  aulasTotais: number | null;
  progressoAulasFaixa: number | null;
  idadeMinima: number | null;
  metodoGraus: string;
};

export type GraduationRecommendationGrau = GraduationRecommendationBase & {
  tipo: 'Grau';
  grauAtual: number;
  grauAlvo: number;
  aulasRealizadasNoGrau: number | null;
  aulasRestantesGrau: number | null;
  progressoAulasGrau: number | null;
};

export type GraduationRecommendationFaixa = GraduationRecommendationBase & {
  tipo: 'Faixa';
  proximaFaixa: string;
};

export type GraduationRecommendation =
  | GraduationRecommendationGrau
  | GraduationRecommendationFaixa;
