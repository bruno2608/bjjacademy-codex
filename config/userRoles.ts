import {
  ROLE_KEYS,
  STAFF_ROLES as BASE_STAFF_ROLES,
  ADMIN_ROLES as BASE_ADMIN_ROLES,
  STUDENT_ROLES,
  type UserRole
} from './roles';

export type { UserRole };

export const ALL_ROLES: UserRole[] = Object.values(ROLE_KEYS);
export const STAFF_ROLES: UserRole[] = BASE_STAFF_ROLES;
export const ADMIN_ROLES: UserRole[] = BASE_ADMIN_ROLES;
export const STUDENT_ONLY_ROLES: UserRole[] = STUDENT_ROLES;
export const ROLE_KEYS_MAP = ROLE_KEYS;
