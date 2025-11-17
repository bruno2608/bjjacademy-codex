import type { UserRole } from '../config/roles';

export type AuthUser = {
  name: string;
  email: string;
  roles: UserRole[];
  avatarUrl?: string | null;
  telefone?: string | null;
  alunoId?: string | null;
};

export type LoginPayload = {
  email: string;
  roles?: UserRole[];
};
