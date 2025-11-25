import { useMemo } from 'react';

import useUserStore from '@/store/userStore';
import type { CurrentUser } from '@/types/session';

export function useCurrentUser() {
  const rawUser = useUserStore((s) => s.user);
  const updateUser = useUserStore((s) => s.updateUser);

  const user: CurrentUser | null = useMemo(
    () =>
      rawUser
        ? {
            id: rawUser.id || 'user_fallback',
            nomeCompleto: rawUser.nomeCompleto || rawUser.name || 'Usuário',
            email: rawUser.email,
            avatarUrl: rawUser.avatarUrl ?? null,
            roles: rawUser.roles || [],
            alunoId: rawUser.alunoId ?? null,
            instrutorId: rawUser.instrutorId ?? null,
            professorId: rawUser.professorId ?? null,
            academiaId: rawUser.academiaId ?? null
          }
        : null,
    [rawUser]
  );

  return { user, updateUser };
}
