export const ROLE_KEYS = {
  student: 'student',
  instructor: 'instructor',
  teacher: 'teacher',
  admin: 'admin',
  ti: 'ti'
} as const;

export type UserRole = (typeof ROLE_KEYS)[keyof typeof ROLE_KEYS];

export const ROLE_ALIASES: Record<string, UserRole> = {
  aluno: ROLE_KEYS.student,
  student: ROLE_KEYS.student,
  instrutor: ROLE_KEYS.instructor,
  instructor: ROLE_KEYS.instructor,
  professor: ROLE_KEYS.teacher,
  teacher: ROLE_KEYS.teacher,
  admin: ROLE_KEYS.admin,
  administrador: ROLE_KEYS.admin,
  ti: ROLE_KEYS.ti,
  technology: ROLE_KEYS.ti
};

export const STUDENT_ROLES: UserRole[] = [ROLE_KEYS.student];
export const INSTRUCTOR_ROLES: UserRole[] = [ROLE_KEYS.instructor, ROLE_KEYS.teacher];
export const STAFF_ROLES: UserRole[] = [...INSTRUCTOR_ROLES, ROLE_KEYS.admin, ROLE_KEYS.ti];
export const ADMIN_ROLES: UserRole[] = [ROLE_KEYS.admin, ROLE_KEYS.ti];

export const ROLE_PERMISSIONS = {
  [ROLE_KEYS.student]: {
    canEditSelf: true,
    canEditGraduation: false,
    canSeeAdmin: false
  },
  [ROLE_KEYS.instructor]: {
    canEditSelf: true,
    canEditGraduation: true,
    canSeeAdmin: false
  },
  [ROLE_KEYS.teacher]: {
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
