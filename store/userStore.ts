import { create } from 'zustand';

import { normalizeRoles, type UserRole } from '../config/roles';
import type { AuthUser, LoginPayload } from '../types/user';
import { authMockLogin } from '../services/authMockService';

type ImpersonationState = {
  isActive: boolean;
  targetUser: AuthUser | null;
};

type UserState = {
  user: AuthUser | null;
  effectiveUser: AuthUser | null;
  impersonation: ImpersonationState;
  token: string | null;
  hydrated: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser | null>;
  updateUser?: (payload: Partial<AuthUser>) => void;
  logout: () => void;
  hydrate: (payload: Partial<{ user: AuthUser | null; token: string | null }>) => void;
  hydrateFromStorage: () => void;
  startImpersonation: (targetUser: AuthUser) => void;
  stopImpersonation: () => void;
};

const TOKEN_KEY = 'bjj_token';
const ROLES_KEY = 'bjj_roles';
const IMPERSONATION_KEY = 'bjj_impersonation';
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80';

const DEFAULT_IMPERSONATION_STATE: ImpersonationState = { isActive: false, targetUser: null };

const persistRoles = (roles: UserRole[]) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
  }
  if (typeof document !== 'undefined') {
    document.cookie = `${ROLES_KEY}=${roles.join(',')}; path=/; max-age=${60 * 60 * 24 * 30}`;
  }
};

const persistUser = (user: AuthUser) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem('bjj_user', JSON.stringify(user));
  } catch (error) {
    console.warn('Não foi possível salvar o usuário localmente', error);
  }
};

const clearPersistedRoles = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(ROLES_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem('bjj_user');
    window.localStorage.removeItem(IMPERSONATION_KEY);
  }
  if (typeof document !== 'undefined') {
    document.cookie = `${ROLES_KEY}=; path=/; max-age=0`;
  }
};
const persistImpersonation = (impersonation: ImpersonationState) => {
  if (typeof window === 'undefined') return;

  if (!impersonation.isActive) {
    window.localStorage.removeItem(IMPERSONATION_KEY);
    return;
  }

  try {
    window.localStorage.setItem(IMPERSONATION_KEY, JSON.stringify(impersonation));
  } catch (error) {
    console.warn('Não foi possível salvar o modo teste', error);
  }
};

const resolveEffectiveUser = (user: AuthUser | null, impersonation: ImpersonationState) =>
  impersonation.isActive && impersonation.targetUser ? impersonation.targetUser : user;

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  effectiveUser: null,
  impersonation: DEFAULT_IMPERSONATION_STATE,
  token: null,
  hydrated: false,
  isAuthenticated: false,
  login: async ({ identifier, senha }) => {
    if (typeof window === 'undefined') return null;

    const authenticatedUser = await authMockLogin({ identifier, senha });
    const fakeToken = `bjj-token-${Date.now()}`;
    const normalizedRoles = normalizeRoles(authenticatedUser.roles);
    const normalizedUser: AuthUser = {
      ...authenticatedUser,
      name: authenticatedUser.name || authenticatedUser.nomeCompleto,
      avatarUrl: authenticatedUser.avatarUrl ?? DEFAULT_AVATAR,
      roles: normalizedRoles
    };

    window.localStorage.setItem(TOKEN_KEY, fakeToken);
    persistRoles(normalizedRoles);
    persistUser(normalizedUser);
    persistImpersonation(DEFAULT_IMPERSONATION_STATE);

    set({
      user: normalizedUser,
      effectiveUser: normalizedUser,
      impersonation: DEFAULT_IMPERSONATION_STATE,
      token: fakeToken,
      hydrated: true,
      isAuthenticated: true
    });
    return normalizedUser;
  },
  updateUser: (payload) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, ...payload } : state.user;
      const effectiveUser = resolveEffectiveUser(updatedUser, state.impersonation);

      if (updatedUser) {
        persistUser(updatedUser);
      }

      return {
        user: updatedUser,
        effectiveUser
      };
    }),
  logout: () => {
    clearPersistedRoles();
    set({
      user: null,
      effectiveUser: null,
      impersonation: DEFAULT_IMPERSONATION_STATE,
      token: null,
      isAuthenticated: false,
      hydrated: true
    });
  },
  hydrate: (payload) => {
    set((state) => {
      const nextUser = payload.user ?? state.user;
      const impersonation = state.impersonation ?? DEFAULT_IMPERSONATION_STATE;
      return {
        user: nextUser,
        effectiveUser: resolveEffectiveUser(nextUser, impersonation),
        token: payload.token ?? state.token,
        isAuthenticated: Boolean(payload.user ?? state.user ?? null)
      };
    });
  },
  hydrateFromStorage: () => {
    if (typeof window === 'undefined') return;

    const storedToken = window.localStorage.getItem(TOKEN_KEY);
    const rawUser = window.localStorage.getItem('bjj_user');
    const rawRoles = window.localStorage.getItem(ROLES_KEY);
    const rawImpersonation = window.localStorage.getItem(IMPERSONATION_KEY);
    const cookieRoles = typeof document !== 'undefined'
      ? document.cookie
          .split(';')
          .map((entry) => entry.trim())
          .find((entry) => entry.startsWith(`${ROLES_KEY}=`))
          ?.replace(`${ROLES_KEY}=`, '')
      : undefined;

    let parsedUser: AuthUser | null = null;
    if (rawUser) {
      try {
        parsedUser = JSON.parse(rawUser);
      } catch (error) {
        parsedUser = null;
      }
    }

    let storedRoles: UserRole[] = [];
    if (rawRoles) {
      try {
        const parsedRoles = JSON.parse(rawRoles);
        storedRoles = normalizeRoles(parsedRoles);
      } catch (error) {
        storedRoles = normalizeRoles(rawRoles.split(','));
      }
    } else if (cookieRoles) {
      storedRoles = normalizeRoles(cookieRoles.split(','));
    }

    const finalRoles = storedRoles.length
      ? storedRoles
      : normalizeRoles(parsedUser?.roles ?? []);

    let impersonationState: ImpersonationState = DEFAULT_IMPERSONATION_STATE;
    if (rawImpersonation) {
      try {
        const parsed = JSON.parse(rawImpersonation) as ImpersonationState;
        if (parsed?.isActive && parsed.targetUser) {
          impersonationState = {
            isActive: true,
            targetUser: {
              ...parsed.targetUser,
              roles: normalizeRoles(parsed.targetUser.roles)
            }
          };
        }
      } catch (error) {
        impersonationState = DEFAULT_IMPERSONATION_STATE;
      }
    }

    if (!parsedUser && !storedToken) {
      set({
        user: null,
        effectiveUser: null,
        impersonation: DEFAULT_IMPERSONATION_STATE,
        token: null,
        hydrated: true,
        isAuthenticated: false
      });
      return;
    }

    const hydratedUser = parsedUser
      ? {
          ...parsedUser,
          name: parsedUser.name || parsedUser.nomeCompleto || parsedUser.email?.split('@')[0] || 'Usuário',
          avatarUrl: parsedUser.avatarUrl ?? DEFAULT_AVATAR,
          roles: finalRoles
        }
      : null;

    const effectiveUser = resolveEffectiveUser(hydratedUser, impersonationState);

    set({
      user: hydratedUser,
      effectiveUser,
      impersonation: impersonationState,
      token: storedToken ?? null,
      hydrated: true,
      isAuthenticated: Boolean(hydratedUser)
    });
  },
  startImpersonation: (targetUser) => {
    const impersonation: ImpersonationState = {
      isActive: true,
      targetUser: { ...targetUser, roles: normalizeRoles(targetUser.roles) }
    };
    persistImpersonation(impersonation);
    set({ impersonation, effectiveUser: impersonation.targetUser });
  },
  stopImpersonation: () => {
    const user = get().user;
    persistImpersonation(DEFAULT_IMPERSONATION_STATE);
    set({ impersonation: DEFAULT_IMPERSONATION_STATE, effectiveUser: user });
  }
}));

export default useUserStore;
