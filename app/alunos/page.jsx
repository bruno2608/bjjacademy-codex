'use client';

/**
 * Página de listagem de alunos atualizada com o mesmo visual gamificado
 * da seção de graduações. Todas as ações permanecem na mesma tela via modal.
 */
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, UserPlus2 } from 'lucide-react';
import { BjjBeltStrip } from '@/components/bjj/BjjBeltStrip';
import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils';
import { normalizeAlunoStatus, normalizeFaixaSlug } from '@/lib/alunoStats';
import { useCurrentStaff } from '@/hooks/useCurrentStaff';
import { useStaffDashboard } from '@/services/dashboard/useStaffDashboard';
import MultiSelectDropdown from '../../components/ui/MultiSelectDropdown';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import AlunoForm from '../../components/alunos/AlunoForm';
import PageHero from '../../components/ui/PageHero';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { usePresencasStore } from '../../store/presencasStore';
import { useTreinosStore } from '../../store/treinosStore';
import { useAlunosStore } from '../../store/alunosStore';

const TODOS_TREINOS = 'all';
const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos os status' },
  { value: 'ATIVO', label: 'Ativo' },
  { value: 'INATIVO', label: 'Inativo' }
];
const STATUS_FILTER_VALUES = STATUS_OPTIONS.filter((option) => option.value !== 'all');

export default function AlunosPage() {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFaixas, setFilterFaixas] = useState([]);
  const [filterStatuses, setFilterStatuses] = useState([]);
  const [filterTreinos, setFilterTreinos] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const presencas = usePresencasStore((state) => state.presencas);
  const treinos = useTreinosStore((state) => state.treinos.filter((treino) => treino.ativo));
  const { staff } = useCurrentStaff();
  const { alunosAtivos, totalAlunos, checkinsRegistradosSemana, graduacoesPendentes } = useStaffDashboard();
  const alunos = useAlunosStore((state) => state.alunos);
  const addAluno = useAlunosStore((state) => state.addAluno);
  const removeAluno = useAlunosStore((state) => state.removeAluno);

  const faixasDisponiveis = useMemo(() => {
    const slugs = new Set(
      alunos.map((aluno) => normalizeFaixaSlug(aluno.faixaSlug ?? aluno.faixa))
    );
    return Array.from(slugs).filter(Boolean);
  }, [alunos]);

  const opcoesFaixa = useMemo(
    () =>
      faixasDisponiveis.map((faixaSlug) => {
        const faixaConfig = getFaixaConfigBySlug(faixaSlug);
        return { value: faixaSlug, label: faixaConfig?.nome ?? faixaSlug };
      }),
    [faixasDisponiveis]
  );
  const opcoesStatus = useMemo(
    () => STATUS_FILTER_VALUES.map((option) => ({ value: option.value, label: option.label })),
    []
  );
  const opcoesTreinos = useMemo(
    () =>
      treinos.map((treino) => ({
        value: treino.id,
        label: `${treino.nome} · ${treino.hora}`
      })),
    [treinos]
  );

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

  const limparSelecao = useCallback((lista, valorTodos = 'all') => {
    if (!Array.isArray(lista) || lista.length === 0 || lista.includes(valorTodos)) {
      return [];
    }
    return lista;
  }, []);

  const alunosFiltrados = useMemo(() => {
    const termo = searchTerm.trim().toLowerCase();
    const faixasAtivas = limparSelecao(filterFaixas);
    const statusAtivos = limparSelecao(filterStatuses).map((status) => normalizeAlunoStatus(status));
    const treinosAtivos = limparSelecao(filterTreinos, TODOS_TREINOS);

    return alunos.filter((aluno) => {
      const faixaSlug = normalizeFaixaSlug(aluno.faixaSlug ?? aluno.faixa);
      const statusNormalizado = normalizeAlunoStatus(aluno.status);
      const nomeBusca = (aluno.nomeCompleto ?? aluno.nome ?? '').toLowerCase();

      if (termo.length >= 3 && !nomeBusca.includes(termo)) {
        return false;
      }
      if (faixasAtivas.length && !faixasAtivas.includes(faixaSlug)) {
        return false;
      }
      if (statusAtivos.length && !statusAtivos.includes(statusNormalizado)) {
        return false;
      }
      if (treinosAtivos.length) {
        const conjunto = treinosPorAluno.get(aluno.id);
        if (!conjunto || !treinosAtivos.some((id) => conjunto.has(id))) {
          return false;
        }
      }
      return true;
    });
  }, [alunos, filterFaixas, filterStatuses, filterTreinos, limparSelecao, searchTerm, treinosPorAluno]);

  const alunosComFaixa = useMemo(
    () =>
      alunosFiltrados.map((aluno) => {
        const faixaSlug = normalizeFaixaSlug(aluno.faixaSlug ?? aluno.faixa);
        const faixaConfig = getFaixaConfigBySlug(faixaSlug) || getFaixaConfigBySlug('branca-adulto');
        const grauAtual = Number.isFinite(Number(aluno.graus))
          ? Number(aluno.graus)
          : faixaConfig?.grausMaximos ?? 0;
        const statusNormalizado = normalizeAlunoStatus(aluno.status);
        const statusLabel =
          statusNormalizado === 'ATIVO'
            ? 'Ativo'
            : statusNormalizado === 'INATIVO'
            ? 'Inativo'
            : aluno.status;
        const faixaVisual =
          faixaConfig && (
            <div className="w-full max-w-[180px]">
              <BjjBeltStrip
                config={faixaConfig}
                grauAtual={grauAtual}
                className="scale-[0.75] md:scale-[0.85] origin-left"
              />
            </div>
          );

        return {
          ...aluno,
          faixa: faixaConfig?.nome ?? aluno.faixa ?? faixaSlug,
          faixaSlug,
          status: statusLabel,
          faixaVisual,
          telefone: aluno.telefone || aluno.phone || '—'
        };
      }),
    [alunosFiltrados]
  );

  const totalFiltrado = alunosFiltrados.length;

  const limparFiltros = () => {
    setSearchTerm('');
    setFilterFaixas([]);
    setFilterStatuses([]);
    setFilterTreinos([]);
  };

  const normalizarSelecao = useCallback((lista, totalDisponivel, valorTodos = 'all') => {
    if (!Array.isArray(lista) || !lista.length) {
      return [];
    }
    if (lista.includes(valorTodos)) {
      return [valorTodos];
    }
    const valoresLimpos = lista.filter(Boolean);
    if (totalDisponivel > 0 && valoresLimpos.length >= totalDisponivel) {
      return [valorTodos];
    }
    return valoresLimpos;
  }, []);

  const handleDelete = async (aluno) => {
    setDeleteTarget(aluno);
  };

  const confirmarExclusao = async () => {
    if (!deleteTarget) return;
    setIsRefreshing(true);
    removeAluno(deleteTarget.id, presencas);
    setIsRefreshing(false);
    setDeleteTarget(null);
  };

  const handleEdit = (aluno) => {
    router.push(`/alunos/${aluno.id}`);
  };

  const handleCreate = async (data) => {
    setIsSaving(true);
    addAluno(data, presencas);
    setIsSaving(false);
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHero
        badge="Gestão de alunos"
        title={
          staff?.nome
            ? `Olá, ${staff.nome.split(' ')[0]}! Cadastre, filtre e mantenha os dados em dia`
            : 'Cadastre, filtre e mantenha os dados dos praticantes em dia'
        }
        subtitle="Use os filtros inteligentes para localizar alunos, abrir o cadastro e acompanhar graduações em poucos cliques."
      />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[{
          label: 'Alunos ativos',
          value: alunosAtivos,
        }, {
          label: 'Total de alunos',
          value: totalAlunos,
        }, {
          label: 'Check-ins na semana',
          value: checkinsRegistradosSemana,
        }, {
          label: 'Graduações pendentes',
          value: graduacoesPendentes,
        }].map((item) => (
          <article
            key={item.label}
            className="card flex flex-col gap-1 border-bjj-gray-800/70 bg-bjj-gray-925/80"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-200/70">{item.label}</p>
            <p className="text-3xl font-bold text-white">{item.value ?? 0}</p>
          </article>
        ))}
      </section>

      <section className="space-y-3">
        <article className="card space-y-4 overflow-visible">
          <header className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-bjj-white">Filtros inteligentes</h2>
            <p className="text-sm text-bjj-gray-200/70">
              Combine os filtros abaixo para localizar alunos por faixa, status ou treinos frequentes. A busca por nome é
              habilitada a partir de três letras.
            </p>
          </header>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-bjj-gray-200/60">Nome</label>
              <Input
                type="search"
                placeholder="Buscar por nome do aluno"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              {searchTerm.trim().length > 0 && searchTerm.trim().length < 3 && (
                <span className="text-[10px] text-bjj-gray-200/60">Digite pelo menos 3 letras para aplicar a busca.</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <MultiSelectDropdown
                label="Faixa"
                options={opcoesFaixa}
                value={filterFaixas}
                onChange={(lista) => setFilterFaixas(normalizarSelecao(lista, faixasDisponiveis.length))}
                allLabel="Todas as faixas"
                placeholder={opcoesFaixa.length ? 'Selecionar faixas' : 'Cadastre faixas nas Regras'}
                disabled={!opcoesFaixa.length}
                className="h-full"
              />
              {!opcoesFaixa.length && (
                <p className="text-[11px] text-bjj-gray-200/60">
                  Cadastre faixas na aba Configurações → Regras para habilitar este filtro.
                </p>
              )}
            </div>
            <MultiSelectDropdown
              label="Status"
              options={opcoesStatus}
              value={filterStatuses}
              onChange={(lista) => setFilterStatuses(normalizarSelecao(lista, STATUS_FILTER_VALUES.length))}
              allLabel="Todos os status"
              placeholder="Selecionar status"
              className="h-full"
            />
            <MultiSelectDropdown
              label="Treino"
              options={opcoesTreinos}
              value={filterTreinos}
              onChange={(lista) => setFilterTreinos(normalizarSelecao(lista, opcoesTreinos.length, TODOS_TREINOS))}
              allValue={TODOS_TREINOS}
              allLabel="Todos"
              placeholder={opcoesTreinos.length ? 'Selecionar treinos' : 'Nenhum treino cadastrado'}
              disabled={!opcoesTreinos.length}
              className="h-full"
            />
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
          <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-bjj-white">Lista de alunos</h2>
              <p className="text-sm text-bjj-gray-200/70">Monitore faixa atual, tempo dedicado e status de cada membro da academia.</p>
            </div>
            <Button type="button" onClick={() => setIsCreateOpen(true)} className="self-start sm:self-auto">
              <UserPlus2 size={16} /> Novo aluno
            </Button>
          </header>
          <Table
            headers={['Ações', 'Aluno', 'Graduação', 'Plano', 'Status', 'Contato']}
            data={alunosComFaixa}
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

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Confirmar exclusão"
        message={deleteTarget ? `Deseja remover o aluno ${deleteTarget.nome}?` : ''}
        confirmLabel="Remover aluno"
        onConfirm={confirmarExclusao}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
