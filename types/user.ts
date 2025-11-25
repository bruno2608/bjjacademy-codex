import type { UserRole } from '../config/roles';
import type { CurrentUser } from './session';

export type AuthUser = CurrentUser & {
  name?: string;
  telefone?: string | null;
};

export type StaffRole = 'PROFESSOR' | 'INSTRUTOR' | 'ADMIN' | 'TI';

export interface StaffProfile {
  id: string;
  nome: string;
  email: string | null;
  avatarUrl?: string | null;
  roles: StaffRole[];
  faixaSlug?: string | null;
  grauAtual?: number | null;
  status?: 'ATIVO' | 'INATIVO';
  alunosAtivos?: number;
  totalAlunos?: number;
  graduacoesPendentes?: number;
  checkinsRegistradosSemana?: number;
  presencasHoje?: number;
  faltasHoje?: number;
  pendentesHoje?: number;
}

export type LoginPayload = {
  email: string;
  roles?: UserRole[];
};
