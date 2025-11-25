import type { UserRole } from '../config/roles';
import type { CurrentUser } from './session';

export type AuthUser = CurrentUser & {
  name?: string;
  telefone?: string | null;
};

export type LoginPayload = {
  email: string;
  roles?: UserRole[];
};
