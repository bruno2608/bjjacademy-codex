import type { PapelCodigo as AuthPapelCodigo, UserRole } from '@/types/auth'

// Reexporta os tipos oficiais para compatibilidade legada
export type PapelCodigo = AuthPapelCodigo
export type PapelRole = UserRole

export interface Papel {
  id: number;
  codigo: PapelCodigo;
  nome: string;
  descricao?: string;
  nivelAcesso: number;
}
