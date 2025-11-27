export type AulaInstanciaStatus = 'prevista' | 'em_andamento' | 'encerrada' | 'cancelada';

export interface AulaInstancia {
  id: string;
  turmaId: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  status: AulaInstanciaStatus;
}
