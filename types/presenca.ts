export type StatusPresenca =
  | 'CHECKIN'
  | 'PENDENTE'
  | 'CONFIRMADO'
  | 'AUSENTE'
  | 'AUSENTE_JUSTIFICADA'
  | 'CANCELADO';

export type Presenca = {
  id: string;
  alunoId: string;
  alunoNome: string;
  faixa: string;
  graus: number;
  data: string;
  hora: string | null;
  status: StatusPresenca;
  treinoId: string | null;
  tipoTreino: string;
  treinoModalidade?: string;
  origem?: 'ALUNO' | 'PROFESSOR';
};
