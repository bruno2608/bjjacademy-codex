'use client';

/**
 * Página de edição de aluno que carrega dados pelo id e reutiliza o AlunoForm.
 */
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AlunoForm from '../../../../components/ui/AlunoForm';
import { getAlunos, updateAluno } from '../../../../services/alunosService';

export default function EditarAlunoPage() {
  const router = useRouter();
  const params = useParams();
  const [aluno, setAluno] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAlunos().then((list) => {
      const encontrado = list.find((item) => item.id === params.id);
      setAluno(encontrado || null);
      setLoading(false);
    });
  }, [params.id]);

  const handleSubmit = async (data) => {
    if (!aluno) return;
    setLoading(true);
    await updateAluno(aluno.id, data);
    setLoading(false);
    router.push('/alunos');
  };

  if (loading) {
    return <p className="text-sm text-bjj-gray-200">Carregando aluno...</p>;
  }

  if (!aluno) {
    return <p className="text-sm text-bjj-red">Aluno não encontrado.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Editar aluno</h2>
        <p className="text-sm text-bjj-gray-200/70">Atualize as informações para manter o histórico em dia.</p>
      </div>
      <AlunoForm initialData={aluno} onSubmit={handleSubmit} />
    </div>
  );
}
