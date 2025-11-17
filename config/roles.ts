export const ROLE_KEYS = {
  aluno: 'aluno',
  instrutor: 'instrutor',
  professor: 'professor',
  admin: 'admin',
  ti: 'ti'
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
  ti: ROLE_KEYS.ti,
  technology: ROLE_KEYS.ti
};

export const STUDENT_ROLES: UserRole[] = [ROLE_KEYS.aluno];
export const INSTRUCTOR_ROLES: UserRole[] = [ROLE_KEYS.instrutor];
export const TEACHER_ROLES: UserRole[] = [ROLE_KEYS.professor];
export const STAFF_ROLES: UserRole[] = [
  ROLE_KEYS.instrutor,
  ROLE_KEYS.professor,
  ROLE_KEYS.admin,
  ROLE_KEYS.ti
];
export const ADMIN_ROLES: UserRole[] = [ROLE_KEYS.admin, ROLE_KEYS.ti];

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
  [ROLE_KEYS.ti]: {
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

  return Array.from(unique);
}

export function hasAnyRole(current: UserRole[], allowed: UserRole[]): boolean {
  if (!allowed?.length) return false;
  return allowed.some((role) => current.includes(role));
}
