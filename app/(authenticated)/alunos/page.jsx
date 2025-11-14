'use client';

/**
 * Página de listagem de alunos com tabela responsiva.
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Table from '../../../components/ui/Table';
import { getAlunos, deleteAluno } from '../../../services/alunosService';

export default function AlunosPage() {
  const router = useRouter();
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    getAlunos().then(setAlunos);
  }, []);

  const handleDelete = async (aluno) => {
    await deleteAluno(aluno.id);
    const listagem = await getAlunos();
    setAlunos(listagem);
  };

  const handleEdit = (aluno) => {
    router.push(`/alunos/${aluno.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Lista de alunos</h2>
          <p className="text-bjj-gray-200/70 text-sm">Gerencie matrículas e status rapidamente.</p>
        </div>
        <Link href="/alunos/novo" className="btn-primary inline-flex items-center justify-center">
          Adicionar aluno
        </Link>
      </div>
      <Table
        headers={['Aluno', 'Graduação', 'Plano', 'Status', 'Contato', 'Ações']}
        data={alunos}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
