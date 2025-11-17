'use client';

import { useMemo } from 'react';
import { ROLE_PERMISSIONS, ROLE_KEYS, normalizeRoles, hasAnyRole, type UserRole } from '../config/roles';
import useUserStore from '../store/userStore';

export function useRole() {
  const { user } = useUserStore();

  const roles = useMemo<UserRole[]>(() => normalizeRoles(user?.roles ?? []), [user?.roles]);

  const isStudent = roles.includes(ROLE_KEYS.aluno);
  const isInstructor = hasAnyRole(roles, [ROLE_KEYS.instrutor, ROLE_KEYS.professor]);
  const isAdmin = hasAnyRole(roles, [ROLE_KEYS.admin, ROLE_KEYS.ti]);
  const isStaff = isInstructor || isAdmin;

  const canAccess = (allowed: UserRole[]) => hasAnyRole(roles, allowed);

  return {
    roles,
    isStudent,
    isInstructor,
    isAdmin,
    isStaff,
    permissions: ROLE_PERMISSIONS,
    canAccess
  };
}

export default useRole;
