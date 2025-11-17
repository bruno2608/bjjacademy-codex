'use client';

/**
 * Página de criação de aluno usando o AlunoForm e serviços mockados.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AlunoForm from '../../../../components/ui/AlunoForm';
import { createAluno } from '../../../../services/alunosService';

export default function NovoAlunoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    await createAluno(data);
    setLoading(false);
    router.push('/alunos');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Novo aluno</h2>
        <p className="text-sm text-bjj-gray-200/70">Cadastre rapidamente um novo membro da equipe.</p>
      </div>
      <AlunoForm onSubmit={handleSubmit} />
      {loading && <p className="text-sm text-bjj-red">Salvando dados...</p>}
    </div>
  );
}
