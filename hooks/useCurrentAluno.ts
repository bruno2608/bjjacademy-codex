import { useAlunosStore } from '@/store/alunosStore';
import useUserStore from '@/store/userStore';

export function useCurrentAluno() {
  const user = useUserStore((s) => s.user);
  const getAlunoById = useAlunosStore((s) => s.getAlunoById);

  const aluno = user?.alunoId ? getAlunoById(user.alunoId) : null;

  return { user, aluno };
}
