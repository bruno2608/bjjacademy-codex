'use client';

/**
 * Página de listagem de alunos atualizada com o mesmo visual gamificado
 * da seção de graduações. Todas as ações permanecem na mesma tela via modal.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, UserPlus2 } from 'lucide-react';
import Table from '../../../components/ui/Table';
import Modal from '../../../components/ui/Modal';
import AlunoForm from '../../../components/ui/AlunoForm';
import PageHero from '../../../components/ui/PageHero';
import LoadingState from '../../../components/ui/LoadingState';
import { getAlunos, deleteAluno, createAluno } from '../../../services/alunosService';
import useUserStore from '../../../store/userStore';
import { useTreinosStore } from '../../../store/treinosStore';

const TODOS_TREINOS = 'all';
const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos os status' },
  { value: 'Ativo', label: 'Ativo' },
  { value: 'Inativo', label: 'Inativo' }
];

export default function AlunosPage() {
  const router = useRouter();
  const [alunos, setAlunos] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFaixa, setFilterFaixa] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTreinoId, setFilterTreinoId] = useState(TODOS_TREINOS);
  const presencas = useUserStore((state) => state.presencas);
  const treinos = useTreinosStore((state) => state.treinos.filter((treino) => treino.ativo));

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

  const faixasDisponiveis = useMemo(() => {
    const conjunto = new Set(
      alunos
        .map((aluno) => aluno.faixa)
        .filter((faixa) => typeof faixa === 'string' && faixa.trim().length > 0)
    );
    return Array.from(conjunto).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [alunos]);

  const treinosPorAluno = useMemo(() => {
    const mapa = new Map();
    presencas.forEach((registro) => {
      if (!registro || !registro.alunoId || !registro.treinoId) {
        return;
      }
      const conjuntoAtual = mapa.get(registro.alunoId) || new Set();
      conjuntoAtual.add(registro.treinoId);
      mapa.set(registro.alunoId, conjuntoAtual);
    });
    return mapa;
  }, [presencas]);

  const alunosFiltrados = useMemo(() => {
    const termo = searchTerm.trim().toLowerCase();
    return alunos.filter((aluno) => {
      if (termo.length >= 3 && !aluno.nome.toLowerCase().includes(termo)) {
        return false;
      }
      if (filterFaixa !== 'all' && aluno.faixa !== filterFaixa) {
        return false;
      }
      if (filterStatus !== 'all' && aluno.status !== filterStatus) {
        return false;
      }
      if (filterTreinoId !== TODOS_TREINOS) {
        const conjunto = treinosPorAluno.get(aluno.id);
        if (!conjunto || !conjunto.has(filterTreinoId)) {
          return false;
        }
      }
      return true;
    });
  }, [alunos, filterFaixa, filterStatus, filterTreinoId, searchTerm, treinosPorAluno]);

  const totalFiltrado = alunosFiltrados.length;

  const limparFiltros = () => {
    setSearchTerm('');
    setFilterFaixa('all');
    setFilterStatus('all');
    setFilterTreinoId(TODOS_TREINOS);
  };

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
        <article className="card space-y-4">
          <header className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-bjj-white">Filtros inteligentes</h2>
            <p className="text-sm text-bjj-gray-200/70">
              Combine os filtros abaixo para localizar alunos por faixa, status ou treinos frequentes. A busca por nome é
              habilitada a partir de três letras.
            </p>
          </header>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-bjj-gray-200/60">Nome</label>
              <input
                type="search"
                className="input-field"
                placeholder="Buscar por nome do aluno"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 && (
                <span className="text-[10px] text-bjj-gray-200/60">Digite pelo menos 3 letras para aplicar a busca.</span>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-bjj-gray-200/60">Faixa</label>
              <select className="input-field" value={filterFaixa} onChange={(event) => setFilterFaixa(event.target.value)}>
                <option value="all">Todas as faixas</option>
                {faixasDisponiveis.map((faixa) => (
                  <option key={faixa} value={faixa}>
                    {faixa}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-bjj-gray-200/60">Status</label>
              <select className="input-field" value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-bjj-gray-200/60">Treino</label>
              <select
                className="input-field"
                value={filterTreinoId}
                onChange={(event) => setFilterTreinoId(event.target.value)}
              >
                <option value={TODOS_TREINOS}>Todos os treinos</option>
                {treinos.map((treino) => (
                  <option key={treino.id} value={treino.id}>
                    {treino.nome} · {treino.hora}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-bjj-gray-200/60">Exibindo {totalFiltrado} de {alunos.length} aluno(s) cadastrados.</p>
            <button
              type="button"
              onClick={limparFiltros}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-bjj-gray-200/70 transition hover:text-bjj-red"
            >
              <Filter size={12} /> Limpar filtros
            </button>
          </div>
        </article>

        <article className="card space-y-3">
          <header className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-bjj-white">Lista de alunos</h2>
            <p className="text-sm text-bjj-gray-200/70">Monitore faixa atual, tempo dedicado e status de cada membro da academia.</p>
          </header>
          <div className="flex justify-end">
            <button type="button" className="btn-primary" onClick={() => setIsCreateOpen(true)}>
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
        </article>
      </section>

      <Modal isOpen={isCreateOpen} title="Cadastrar novo aluno" onClose={() => setIsCreateOpen(false)}>
        <AlunoForm onSubmit={handleCreate} isSubmitting={isSaving} submitLabel="Salvar cadastro" />
        {isSaving && <p className="text-xs text-bjj-gray-200/70 mt-3">Armazenando aluno na base...</p>}
      </Modal>
    </div>
  );
}
