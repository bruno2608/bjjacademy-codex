import type { UserRole } from '../config/userRoles';

export type AuthUser = {
  name: string;
  email: string;
  roles: UserRole[];
  avatarUrl: string;
};

export type LoginPayload = {
  email: string;
  roles?: UserRole[];
};
