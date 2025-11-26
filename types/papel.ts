export type PapelCodigo = 'ALUNO' | 'INSTRUTOR' | 'PROFESSOR' | 'ADMIN_TI';

export interface Papel {
  id: number;
  codigo: PapelCodigo;
  nome: string;
  descricao?: string;
  nivelAcesso: number;
}
