import { useMemo } from 'react';

import { useAlunosStore } from '@/store/alunosStore';
import { useCurrentUser } from './useCurrentUser';

export function useCurrentAluno() {
  const { user } = useCurrentUser();
  const getAlunoById = useAlunosStore((s) => s.getAlunoById);

  const aluno = useMemo(() => (user?.alunoId ? getAlunoById(user.alunoId) : null), [getAlunoById, user?.alunoId]);

  return { user, aluno };
}
