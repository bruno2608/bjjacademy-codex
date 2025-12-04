export const ROLE_KEYS = {
  aluno: 'ALUNO',
  instrutor: 'INSTRUTOR',
  professor: 'PROFESSOR',
  admin: 'ADMIN',
  adminTi: 'ADMIN_TI',
  // Compatibilidade: manter a chave `ti`, mas agora mapeando para ADMIN_TI.
  ti: 'ADMIN_TI'
} as const;

export type UserRole = (typeof ROLE_KEYS)[keyof typeof ROLE_KEYS];
export type Role = UserRole;

export const ROLE_ALIASES: Record<string, UserRole> = {
  aluno: ROLE_KEYS.aluno,
  student: ROLE_KEYS.aluno,
  instrutor: ROLE_KEYS.instrutor,
  instructor: ROLE_KEYS.instrutor,
  professor: ROLE_KEYS.professor,
  teacher: ROLE_KEYS.professor,
  admin: ROLE_KEYS.admin,
  administrador: ROLE_KEYS.admin,
  ti: ROLE_KEYS.adminTi,
  admin_ti: ROLE_KEYS.adminTi,
  'admin-ti': ROLE_KEYS.adminTi,
  adminti: ROLE_KEYS.adminTi,
  technology: ROLE_KEYS.adminTi
};

export const STUDENT_ROLES: UserRole[] = [ROLE_KEYS.aluno];
export const INSTRUCTOR_ROLES: UserRole[] = [ROLE_KEYS.instrutor];
export const TEACHER_ROLES: UserRole[] = [ROLE_KEYS.professor];
export const STAFF_ROLES: UserRole[] = [
  ROLE_KEYS.instrutor,
  ROLE_KEYS.professor,
  ROLE_KEYS.admin,
  ROLE_KEYS.adminTi
];
export const ADMIN_ROLES: UserRole[] = [ROLE_KEYS.admin, ROLE_KEYS.adminTi];

export const ROLE_PERMISSIONS = {
  [ROLE_KEYS.aluno]: {
    canEditSelf: true,
    canEditGraduation: false,
    canSeeAdmin: false
  },
  [ROLE_KEYS.instrutor]: {
    canEditSelf: true,
    canEditGraduation: true,
    canSeeAdmin: false
  },
  [ROLE_KEYS.professor]: {
    canEditSelf: true,
    canEditGraduation: true,
    canSeeAdmin: false
  },
  [ROLE_KEYS.admin]: {
    canEditSelf: true,
    canEditGraduation: true,
    canSeeAdmin: true
  },
  [ROLE_KEYS.adminTi]: {
    canEditSelf: true,
    canEditGraduation: true,
    canSeeAdmin: true
  }
} as const;

export function normalizeRoles(values: unknown): UserRole[] {
  if (!Array.isArray(values)) return [];
  const unique = new Set<UserRole>();

  values.forEach((value) => {
    if (!value) return;
    const raw = String(value).trim();
    const normalized = raw.toLowerCase();
    const mapped = ROLE_ALIASES[normalized];
    if (mapped) {
      unique.add(mapped);
    }
  });

  if (unique.has(ROLE_KEYS.adminTi) || unique.has(ROLE_KEYS.admin)) {
    unique.add(ROLE_KEYS.professor);
    unique.add(ROLE_KEYS.instrutor);
    unique.add(ROLE_KEYS.aluno);
  } else if (unique.has(ROLE_KEYS.professor)) {
    unique.add(ROLE_KEYS.instrutor);
    unique.add(ROLE_KEYS.aluno);
  } else if (unique.has(ROLE_KEYS.instrutor)) {
    unique.add(ROLE_KEYS.aluno);
  }

  return Array.from(unique);
}

export function hasAnyRole(current: UserRole[], allowed: UserRole[]): boolean {
  if (!allowed?.length) return false;
  return allowed.some((role) => current.includes(role));
}
