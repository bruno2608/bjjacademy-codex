export type MatriculaStatus = 'ativo' | 'inativo' | 'trancado';

export interface Matricula {
  id: string;
  numero: number;
  status: MatriculaStatus;
  alunoId: string;
  academiaId: string;
  turmaId?: string | null;
  dataInicio: string;
  dataFim?: string | null;
  observacoes?: string | null;
  matriculadoPor?: string | null;
}
