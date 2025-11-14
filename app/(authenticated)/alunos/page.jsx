'use client';

/**
 * Página de listagem de alunos com tabela responsiva.
 */
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Table from '../../../components/ui/Table';
import Modal from '../../../components/ui/Modal';
import AlunoForm from '../../../components/ui/AlunoForm';
import { getAlunos, deleteAluno, createAluno } from '../../../services/alunosService';

export default function AlunosPage() {
  const router = useRouter();
  const [alunos, setAlunos] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const carregarAlunos = useCallback(async () => {
    const lista = await getAlunos();
    setAlunos(lista);
  }, []);

  useEffect(() => {
    carregarAlunos();
  }, [carregarAlunos]);

  const handleDelete = async (aluno) => {
    await deleteAluno(aluno.id);
    await carregarAlunos();
  };

  const handleEdit = (aluno) => {
    router.push(`/alunos/${aluno.id}`);
  };

  const handleCreate = async (data) => {
    setIsSaving(true);
    await createAluno(data);
    await carregarAlunos();
    setIsSaving(false);
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Lista de alunos</h2>
          <p className="text-bjj-gray-200/70 text-sm">Gerencie matrículas e status rapidamente.</p>
        </div>
        <button
          type="button"
          className="btn-primary inline-flex items-center justify-center"
          onClick={() => setIsCreateOpen(true)}
        >
          Adicionar aluno
        </button>
      </div>
      <Table
        headers={['Aluno', 'Graduação', 'Plano', 'Status', 'Contato', 'Ações']}
        data={alunos}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal isOpen={isCreateOpen} title="Cadastrar novo aluno" onClose={() => setIsCreateOpen(false)}>
        <AlunoForm onSubmit={handleCreate} isSubmitting={isSaving} submitLabel="Salvar cadastro" />
        {isSaving && <p className="text-xs text-bjj-gray-200/70 mt-3">Armazenando aluno na base...</p>}
      </Modal>
    </div>
  );
}
