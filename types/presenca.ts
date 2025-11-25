export type Presenca = {
  id: string;
  alunoId: string;
  treinoId: string;
  data: string;
  status: 'PRESENTE' | 'FALTA' | 'PENDENTE';
  origem?: 'ALUNO' | 'PROFESSOR';
};
