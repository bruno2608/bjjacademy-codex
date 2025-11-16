export type PresencaStatus = 'Presente' | 'Ausente';

export type Presenca = {
  id: string;
  alunoId: string;
  alunoNome: string;
  faixa: string;
  graus: number;
  data: string;
  hora: string | null;
  status: PresencaStatus;
  treinoId: string | null;
  tipoTreino: string;
  treinoModalidade?: string;
};
