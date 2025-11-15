'use client';

/**
 * Página de listagem de alunos atualizada com o mesmo visual gamificado
 * da seção de graduações. Todas as ações permanecem na mesma tela via modal.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus2 } from 'lucide-react';
import Table from '../../../components/ui/Table';
import Modal from '../../../components/ui/Modal';
import AlunoForm from '../../../components/ui/AlunoForm';
import PageHero from '../../../components/ui/PageHero';
import LoadingState from '../../../components/ui/LoadingState';
import { getAlunos, deleteAluno, createAluno } from '../../../services/alunosService';

export default function AlunosPage() {
  const router = useRouter();
  const [alunos, setAlunos] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let active = true;
    async function inicializar() {
      try {
        const lista = await getAlunos();
        if (!active) return;
        setAlunos(lista);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    inicializar();
    return () => {
      active = false;
    };
  }, []);

  const refreshList = useCallback(async () => {
    setIsRefreshing(true);
    const lista = await getAlunos();
    setAlunos(lista);
    setIsRefreshing(false);
  }, []);

  const alunosFiltrados = useMemo(() => {
    if (searchTerm.trim().length < 3) {
      return alunos;
    }
    const termo = searchTerm.trim().toLowerCase();
    return alunos.filter((aluno) => aluno.nome.toLowerCase().includes(termo));
  }, [alunos, searchTerm]);

  const handleDelete = async (aluno) => {
    await deleteAluno(aluno.id);
    await refreshList();
  };

  const handleEdit = (aluno) => {
    router.push(`/alunos/${aluno.id}`);
  };

  const handleCreate = async (data) => {
    setIsSaving(true);
    await createAluno(data);
    await refreshList();
    setIsSaving(false);
    setIsCreateOpen(false);
  };

  if (isLoading) {
    return <LoadingState title="Preparando cadastro" message="Buscando a lista de alunos cadastrados." />;
  }

  return (
    <div className="space-y-6">
      <PageHero
        badge="Gestão de alunos"
        title="Cadastre, filtre e mantenha os dados dos praticantes em dia"
        subtitle="Use os filtros inteligentes para localizar alunos, abrir o cadastro e acompanhar graduações em poucos cliques."
      />

      <section className="space-y-3">
        <div className="card space-y-3">
          <header>
            <h2 className="text-lg font-semibold text-bjj-white">Lista de alunos</h2>
            <p className="text-sm text-bjj-gray-200/70">
              Monitore faixa atual, tempo dedicado e status de cada membro da academia.
            </p>
          </header>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="relative w-full md:max-w-xs">
              <span className="sr-only">Buscar aluno</span>
              <input
                type="search"
                  className="input-field pr-10 text-sm"
                  placeholder="Buscar aluno (mínimo 3 letras)"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bjj-gray-200/60"
                  aria-hidden
                >
                  <path
                    fill="currentColor"
                    d="m19.53 21.12-4.8-4.79a7.5 7.5 0 1 1 1.59-1.59l4.8 4.79a1.12 1.12 0 0 1-1.59 1.59ZM5.75 10.5a4.75 4.75 0 1 0 4.75-4.75A4.75 4.75 0 0 0 5.75 10.5Z"
                  />
                </svg>
                {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 && (
                  <span className="mt-1 block text-xs text-bjj-gray-200/60">
                    Digite pelo menos 3 letras para filtrar.
                  </span>
                )}
              </label>
            <button type="button" className="btn-primary md:shrink-0" onClick={() => setIsCreateOpen(true)}>
              <UserPlus2 size={16} /> Novo aluno
            </button>
          </div>
          <Table
            headers={['Ações', 'Aluno', 'Graduação', 'Plano', 'Status', 'Contato']}
            data={alunosFiltrados}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isRefreshing}
          />
        </div>
      </section>

      <Modal isOpen={isCreateOpen} title="Cadastrar novo aluno" onClose={() => setIsCreateOpen(false)}>
        <AlunoForm onSubmit={handleCreate} isSubmitting={isSaving} submitLabel="Salvar cadastro" />
        {isSaving && <p className="text-xs text-bjj-gray-200/70 mt-3">Armazenando aluno na base...</p>}
      </Modal>
    </div>
  );
}
