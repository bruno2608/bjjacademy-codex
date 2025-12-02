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
    const alunoBase = getAlunoById(alunoId) ?? alunos.find((entry) => entry.id === alunoId) ?? null;

    if (!alunoBase) return null;

    return {
      ...alunoBase,
      nome: alunoBase.nome ?? user?.nomeCompleto ?? user?.name ?? 'Aluno',
      email: alunoBase.email ?? user?.email ?? null,
      telefone: alunoBase.telefone ?? user?.telefone ?? null,
      avatarUrl: alunoBase.avatarUrl ?? user?.avatarUrl ?? null,
      status: alunoBase.status ?? 'ATIVO'
    };
  }, [alunoId, alunos, getAlunoById, user?.avatarUrl, user?.email, user?.name, user?.nomeCompleto, user?.telefone]);

  return { user, aluno, alunoId };
}
