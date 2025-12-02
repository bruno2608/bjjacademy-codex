import { useMemo } from 'react';

import { useAlunosStore } from '@/store/alunosStore';
import { useUserStore } from '@/store/userStore';

export function useCurrentAluno() {
  const user = useUserStore((state) => state.user);
  const getAlunoById = useAlunosStore((s) => s.getAlunoById);
  const alunos = useAlunosStore((s) => s.alunos);

  const alunoId = user?.alunoId ?? (user as { aluno_id?: string } | null)?.aluno_id ?? null;

  const aluno = useMemo(() => {
    if (!alunoId) return null;
    return getAlunoById(alunoId) ?? alunos.find((entry) => entry.id === alunoId) ?? null;
  }, [alunoId, alunos, getAlunoById]);

  return { user, aluno, alunoId };
}
