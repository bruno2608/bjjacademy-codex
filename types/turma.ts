export type DiaSemana = 'SEG' | 'TER' | 'QUA' | 'QUI' | 'SEX' | 'SAB';

export type TurmaTipo = 'Kids' | 'Adulto' | 'Competição' | 'No-Gi' | 'Mista';

export interface Turma {
  id: string;
  academiaId: string;
  nome: string;
  slug: string;
  tipo: TurmaTipo;
  diasSemana: DiaSemana[];
  horaInicio: string;
  horaFim: string;
  faixaMinSlug?: string;
  faixaMaxSlug?: string;
  responsavelUsuarioId?: string;
  ativa: boolean;
}
