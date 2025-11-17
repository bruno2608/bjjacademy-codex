import { create } from 'zustand';

import type { UserRole } from '../config/userRoles';
import { ALL_ROLES } from '../config/userRoles';
import type { AuthUser, LoginPayload } from '../types/user';

type UserState = {
  user: AuthUser | null;
  token: string | null;
  hydrated: boolean;
  login: (payload: LoginPayload) => void;
  updateUser?: (payload: Partial<AuthUser>) => void;
  logout: () => void;
  hydrate: (payload: Partial<{ user: AuthUser | null; token: string | null }>) => void;
  hydrateFromStorage: () => void;
};

const TOKEN_KEY = 'bjj_token';
const ROLES_KEY = 'bjj_roles';
const DEFAULT_ALUNO_ID = '1';

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
    window.localStorage.removeItem('bjj_user');
  }
  if (typeof document !== 'undefined') {
    document.cookie = `${ROLES_KEY}=; path=/; max-age=0`;
  }
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  hydrated: false,
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
      avatarUrl: null,
      telefone: null,
      alunoId: finalRoles.includes('ALUNO') ? DEFAULT_ALUNO_ID : null
    };

    persistRoles(finalUser.roles);
    window.localStorage.setItem(
      'bjj_user',
      JSON.stringify({ ...finalUser, alunoId: finalRoles.includes('ALUNO') ? DEFAULT_ALUNO_ID : null })
    );
    set({ user: finalUser, token: fakeToken, hydrated: true });
  },
  updateUser: (payload) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...payload } : state.user
    })),
  logout: () => {
    clearPersistedRoles();
    set({ user: null, token: null });
  },
  hydrate: (payload) => {
    set((state) => ({
      user: payload.user ?? state.user,
      token: payload.token ?? state.token
    }));
  },
  hydrateFromStorage: () => {
    if (typeof window === 'undefined') return;
    const hasToken = window.localStorage.getItem(TOKEN_KEY);
    const rawUser = window.localStorage.getItem('bjj_user');
    const rawRoles = window.localStorage.getItem(ROLES_KEY);

    const cookieRoles = typeof document !== 'undefined'
      ? document.cookie
          .split(';')
          .map((entry) => entry.trim())
          .find((entry) => entry.startsWith(`${ROLES_KEY}=`))
          ?.replace(`${ROLES_KEY}=`, '')
      : undefined;

    const parsedRoles = sanitizeRoles(
      rawRoles
        ? JSON.parse(rawRoles)
        : cookieRoles
        ? cookieRoles.split(',')
        : []
    );

    if (!hasToken && !parsedRoles.length) {
      set({ hydrated: true });
      return;
    }

    let parsedUser: AuthUser | null = null;
    if (rawUser) {
      try {
        parsedUser = JSON.parse(rawUser);
      } catch (error) {
        parsedUser = null;
      }
    }

    const fallbackUser: AuthUser = {
      name: parsedRoles.includes('ALUNO') ? 'Aluno' : 'Instrutor',
      email: parsedRoles.includes('ALUNO') ? 'aluno@bjj.academy' : 'instrutor@bjj.academy',
      avatarUrl: null,
      telefone: null,
      roles: parsedRoles,
      alunoId: parsedRoles.includes('ALUNO') ? DEFAULT_ALUNO_ID : null
    };

    set({
      user: parsedUser ? { ...fallbackUser, ...parsedUser, roles: parsedRoles } : fallbackUser,
      token: hasToken ?? null,
      hydrated: true
    });
  }
}));

export default useUserStore;
