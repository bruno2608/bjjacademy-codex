import { create } from 'zustand';

import type { UserRole } from '../config/userRoles';
import { ALL_ROLES } from '../config/userRoles';
import type { AuthUser, LoginPayload } from '../types/user';

type UserState = {
  user: AuthUser | null;
  token: string | null;
  login: (payload: LoginPayload) => void;
  logout: () => void;
  hydrate: (payload: Partial<{ user: AuthUser | null; token: string | null }>) => void;
};

const TOKEN_KEY = 'bjj_token';
const ROLES_KEY = 'bjj_roles';

const ROLE_ORDER: UserRole[] = ['TI', 'ADMIN', 'PROFESSOR', 'INSTRUTOR', 'ALUNO'];

const sanitizeRoles = (roles?: UserRole[]): UserRole[] => {
  if (!Array.isArray(roles)) return [];
  const unique = new Set<UserRole>();
  roles.forEach((role) => {
    if (ROLE_ORDER.includes(role)) {
      unique.add(role);
    }
  });
  return Array.from(unique);
};

const deriveRolesFromEmail = (email: string): UserRole[] => {
  const normalized = email.toLowerCase();
  const baseRoles = new Set<UserRole>(['PROFESSOR', 'INSTRUTOR']);
  if (normalized.includes('admin')) baseRoles.add('ADMIN');
  if (normalized.includes('ti')) baseRoles.add('TI');
  if (normalized.includes('aluno')) baseRoles.add('ALUNO');
  return Array.from(baseRoles);
};

const persistRoles = (roles: UserRole[]) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
  }
  if (typeof document !== 'undefined') {
    document.cookie = `${ROLES_KEY}=${roles.join(',')}; path=/; max-age=${60 * 60 * 24 * 30}`;
  }
};

const clearPersistedRoles = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(ROLES_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
  }
  if (typeof document !== 'undefined') {
    document.cookie = `${ROLES_KEY}=; path=/; max-age=0`;
  }
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  login: ({ email, roles }) => {
    if (typeof window === 'undefined') return;
    const fakeToken = `bjj-token-${Date.now()}`;
    window.localStorage.setItem(TOKEN_KEY, fakeToken);

    const resolvedRoles = sanitizeRoles(roles);
    const finalRoles = resolvedRoles.length ? resolvedRoles : deriveRolesFromEmail(email);
    const finalUser: AuthUser = {
      name: email.split('@')[0] || 'Instrutor',
      email,
      roles: finalRoles.length ? finalRoles : ALL_ROLES,
      avatarUrl: null
    };

    persistRoles(finalUser.roles);
    set({ user: finalUser, token: fakeToken });
  },
  logout: () => {
    clearPersistedRoles();
    set({ user: null, token: null });
  },
  hydrate: (payload) => {
    set((state) => ({
      user: payload.user ?? state.user,
      token: payload.token ?? state.token
    }));
  }
}));

export default useUserStore;
