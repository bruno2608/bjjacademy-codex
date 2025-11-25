'use client';

/**
 * Tela de presenças com identidade visual alinhada à experiência gamificada
 * do restante do painel. Registro e listagem permanecem em uma única página.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PieChart } from 'lucide-react';
import AttendanceTable from '../../components/presencas/AttendanceTable';
import PresenceForm from '../../components/presencas/PresenceForm';
import LoadingState from '../../components/ui/LoadingState';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import MultiSelectDropdown from '../../components/ui/MultiSelectDropdown';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { usePresencasStore } from '@/store/presencasStore';
import { useAlunosStore } from '../../store/alunosStore';
import { useTreinosStore } from '../../store/treinosStore';

const TODOS_TREINOS = 'all';
const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos os status' },
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'PRESENTE', label: 'Presente' },
  { value: 'FALTA', label: 'Falta' },
  { value: 'JUSTIFICADA', label: 'Justificada' }
];
const STATUS_FILTER_VALUES = STATUS_OPTIONS.filter((option) => option.value !== 'all');

const formatPercent = (value) => `${Math.round(value)}%`;
const formatTime = () =>
  new Date()
    .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    .padStart(5, '0');

export default function PresencasPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [sessionRecord, setSessionRecord] = useState(null);
  const [sessionTreinoId, setSessionTreinoId] = useState('');
  const [sessionTakenTreinos, setSessionTakenTreinos] = useState([]);
  const [sessionContext, setSessionContext] = useState('placeholder');
  const [treinoParaFechar, setTreinoParaFechar] = useState('');
  const [treinoEmAnalise, setTreinoEmAnalise] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFaixas, setFilterFaixas] = useState([]);
  const [filterStatuses, setFilterStatuses] = useState([]);
  const [filterTreinos, setFilterTreinos] = useState([]);
  const presencas = usePresencasStore((state) => state.presencas);
  const carregarPresencas = usePresencasStore((state) => state.carregarTodas);
  const salvarPresenca = usePresencasStore((state) => state.salvarPresenca);
  const atualizarStatus = usePresencasStore((state) => state.atualizarStatus);
  const excluirPresenca = usePresencasStore((state) => state.excluirPresenca);
  const fecharTreino = usePresencasStore((state) => state.fecharTreino);
  const marcarTreinoFechado = usePresencasStore((state) => state.marcarTreinoFechado);
  const alunos = useAlunosStore((state) => state.alunos);
  const getAlunoById = useAlunosStore((state) => state.getAlunoById);
  const resolveAlunoNome = useCallback(
    (alunoId) => getAlunoById(alunoId)?.nome || 'Aluno não encontrado',
    [getAlunoById]
  );
  // Treinos ativos são carregados do store dedicado para alimentar dropdowns e sugestões.
  const treinos = useTreinosStore((state) => state.treinos.filter((treino) => treino.ativo));
  const hoje = useMemo(() => new Date().toISOString().split('T')[0], []);
  const normalizarDiaSemana = useCallback((valor) => {
    const referencia = valor ? new Date(valor) : new Date();
    if (Number.isNaN(referencia.getTime())) return null;
    const nome = referencia.toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase();
    return nome.replace('-feira', '').trim();
  }, []);
  const sugerirTreino = useCallback(
    (dataReferencia, preferenciaId) => {
      const dia = normalizarDiaSemana(dataReferencia) || normalizarDiaSemana(hoje);
      const preferenciaValida = preferenciaId && preferenciaId !== TODOS_TREINOS ? preferenciaId : null;
      if (preferenciaValida) {
        const preferido = treinos.find((treino) => treino.id === preferenciaValida);
        if (preferido) return preferido;
      }
      const candidatos = treinos.filter((treino) => treino.diaSemana === dia);
      return candidatos[0] || treinos[0] || null;
    },
    [hoje, normalizarDiaSemana, treinos]
  );

  useEffect(() => {
    if (!treinos.length) {
      setFilterTreinos([]);
      return;
    }

    if (filterTreinos.includes(TODOS_TREINOS) || filterTreinos.length === 0) {
      return;
    }

    const idsValidos = treinos.map((treino) => treino.id);
    const filtrados = filterTreinos.filter((id) => idsValidos.includes(id));

    if (!filtrados.length) {
      const dia = normalizarDiaSemana(hoje);
      const candidatos = treinos.filter((treino) => treino.diaSemana === dia);
      const sugestao = (candidatos[0] || treinos[0])?.id || TODOS_TREINOS;
      setFilterTreinos(sugestao ? [sugestao] : []);
      return;
    }

    if (filtrados.length === idsValidos.length) {
      setFilterTreinos([TODOS_TREINOS]);
      return;
    }

    if (filtrados.length !== filterTreinos.length) {
      setFilterTreinos(filtrados);
    }
  }, [filterTreinos, hoje, normalizarDiaSemana, treinos]);

  useEffect(() => {
    let active = true;
    async function carregar() {
      try {
        await carregarPresencas();
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }
    carregar();
    return () => {
      active = false;
    };
  }, [carregarPresencas]);

  const atualizarLista = useCallback(async () => {
    setIsRefreshing(true);
    await carregarPresencas();
    setIsRefreshing(false);
  }, [carregarPresencas]);

  // Lista reativa de alunos ativos para preencher a visão diária.
  const alunosAtivos = useMemo(
    () => alunos.filter((aluno) => aluno.status === 'Ativo'),
    [alunos]
  );

  // Para o dia atual, combinamos registros reais com placeholders ausentes.
  const registrosDoDia = useMemo(() => {
    const registros = presencas
      .filter((item) => item.data === hoje)
      .map((item) => ({ ...item, isPlaceholder: false }));
    const alunosComRegistro = new Set(registros.map((item) => item.alunoId));
    const placeholders = alunosAtivos
      .filter((aluno) => !alunosComRegistro.has(aluno.id))
      .map((aluno) => {
        const preferencia =
          filterTreinos.includes(TODOS_TREINOS) || filterTreinos.length === 0 ? null : filterTreinos[0];
        const treinoSugestao = sugerirTreino(hoje, preferencia);
        return {
          id: `placeholder-${aluno.id}-${treinoSugestao?.id || 'principal'}`,
          alunoId: aluno.id,
          data: hoje,
          status: 'FALTA',
          treinoId: treinoSugestao?.id || null,
          isPlaceholder: true
        };
      });

    const combinados = [...registros, ...placeholders].map((item) => {
      const aluno = getAlunoById(item.alunoId);
      const alunoNome = aluno?.nome || 'Aluno não encontrado';
      const faixaSlug = aluno?.faixaSlug || aluno?.faixa || 'Sem faixa';
      const graus = Number.isFinite(Number(aluno?.graus)) ? Number(aluno?.graus) : 0;
      return { ...item, alunoNome, faixaSlug, graus };
    });
    return combinados.sort((a, b) => a.alunoNome.localeCompare(b.alunoNome, 'pt-BR'));
  }, [alunosAtivos, filterTreinos, getAlunoById, hoje, presencas, sugerirTreino]);

  const limparSelecao = useCallback((lista, valorTodos = 'all') => {
    if (!Array.isArray(lista) || lista.length === 0 || lista.includes(valorTodos)) {
      return [];
    }
    return lista;
  }, []);

  const registrosFiltrados = useMemo(() => {
    const termo = searchTerm.trim().toLowerCase();
    const faixasAtivas = limparSelecao(filterFaixas);
    const statusAtivos = limparSelecao(filterStatuses);
    const treinosAtivos = limparSelecao(filterTreinos, TODOS_TREINOS);

    return registrosDoDia.filter((item) => {
      if (termo.length >= 3 && !item.alunoNome.toLowerCase().includes(termo)) {
        return false;
      }
      if (faixasAtivas.length && !faixasAtivas.includes(item.faixaSlug)) {
        return false;
      }
      if (statusAtivos.length && !statusAtivos.includes(item.status)) {
        return false;
      }
      if (treinosAtivos.length) {
        const valorTreino = item.treinoId || 'sem-treino';
        if (!treinosAtivos.includes(valorTreino)) {
          return false;
        }
      }
      return true;
    });
  }, [filterFaixas, filterStatuses, filterTreinos, limparSelecao, registrosDoDia, searchTerm]);

  const statusOrder = {
    PENDENTE: 0,
    PRESENTE: 1,
    FALTA: 2,
    JUSTIFICADA: 2
  };

  const statusLabel = (status) => {
    switch (status) {
      case 'PENDENTE':
        return { label: 'PENDENTE', tone: 'text-yellow-200' };
      case 'PRESENTE':
        return { label: 'PRESENTE', tone: 'text-green-300' };
      case 'FALTA':
        return { label: 'FALTA', tone: 'text-red-300' };
      case 'JUSTIFICADA':
        return { label: 'JUSTIFICADA', tone: 'text-indigo-200' };
      default:
        return { label: status || '—', tone: 'text-bjj-gray-200' };
    }
  };

  const registrosFiltradosOrdenados = useMemo(
    () =>
      [...registrosFiltrados].sort((a, b) => {
        const ordemA = statusOrder[a.status] ?? 5;
        const ordemB = statusOrder[b.status] ?? 5;
        if (ordemA !== ordemB) return ordemA - ordemB;
        return a.alunoNome.localeCompare(b.alunoNome, 'pt-BR');
      }),
    [registrosFiltrados]
  );

  const totalFiltrado = registrosFiltrados.length;

  const presentesDia = registrosDoDia.filter((item) => item.status === 'PRESENTE').length;
  const faltasDia = registrosDoDia.filter((item) => item.status === 'FALTA' || item.status === 'JUSTIFICADA').length;
  const pendentesDia = registrosDoDia.filter((item) => item.status === 'PENDENTE').length;
  const totalDia = registrosDoDia.length || 1;
  const taxaPresencaDia = (presentesDia / totalDia) * 100;

  const diasAtivos = useMemo(() => {
    const conjunto = new Set(presencas.map((item) => item.data));
    return conjunto.size;
  }, [presencas]);

  const treinosDoDiaPadrao = useMemo(() => {
    const dia = normalizarDiaSemana(hoje);
    const candidatos = treinos.filter((treino) => treino.diaSemana === dia);
    return candidatos.length ? candidatos : treinos;
  }, [hoje, normalizarDiaSemana, treinos]);

  const faixasDisponiveis = useMemo(() => {
    const conjunto = new Set(
      alunosAtivos
        .map((aluno) => aluno.faixaSlug || aluno.faixa)
        .filter((faixa) => typeof faixa === 'string' && faixa.trim().length > 0)
    );
    return Array.from(conjunto).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [alunosAtivos]);

  const opcoesFaixa = useMemo(
    () => faixasDisponiveis.map((faixa) => ({ value: faixa, label: faixa })),
    [faixasDisponiveis]
  );
  const opcoesStatus = useMemo(
    () => STATUS_FILTER_VALUES.map((option) => ({ value: option.value, label: option.label })),
    []
  );
  const opcoesTreinos = useMemo(
    () =>
      treinosDoDiaPadrao.map((treino) => ({
        value: treino.id,
        label: `${treino.nome} · ${treino.hora}`
      })),
    [treinosDoDiaPadrao]
  );

  const treinoAnaliseLabel = useMemo(
    () => opcoesTreinos.find((item) => item.value === treinoEmAnalise)?.label || 'Treino selecionado',
    [opcoesTreinos, treinoEmAnalise]
  );

  useEffect(() => {
    if (!treinoParaFechar && opcoesTreinos.length) {
      setTreinoParaFechar(opcoesTreinos[0].value);
    }
  }, [opcoesTreinos, treinoParaFechar]);

  const treinosDisponiveisModal = useMemo(() => {
    if (!sessionRecord) {
      return treinosDoDiaPadrao;
    }
    const diaSessao = normalizarDiaSemana(sessionRecord.data);
    const candidatos = treinos.filter((treino) => treino.diaSemana === diaSessao);
    return candidatos.length ? candidatos : treinosDoDiaPadrao;
  }, [normalizarDiaSemana, sessionRecord, treinos, treinosDoDiaPadrao]);

  const handleConfirm = async (registro) => {
    if (!registro?.id) {
      abrirSelecaoSessao(registro);
      return;
    }
    await atualizarStatus(registro.id, 'PRESENTE');
  };

  const handleMarkAbsent = async (registro, justificativa = false) => {
    if (!registro?.id) return;
    await atualizarStatus(registro.id, justificativa ? 'JUSTIFICADA' : 'FALTA');
  };

  const abrirFechamento = () => {
    const sugestao = filterTreinos.includes(TODOS_TREINOS) ? treinosDoDiaPadrao[0]?.id : filterTreinos[0];
    setTreinoParaFechar(sugestao || treinosDoDiaPadrao[0]?.id || '');
    setIsCloseModalOpen(true);
  };

  const fecharModalFechamento = () => setIsCloseModalOpen(false);

  const fecharTreinoAutomatico = async () => {
    const alvo = treinoParaFechar || treinosDoDiaPadrao[0]?.id || null;
    if (alvo) {
      await fecharTreino(alvo);
    }
    setIsCloseModalOpen(false);
  };

  const direcionarParaAnalise = () => {
    const alvo = treinoParaFechar || treinosDoDiaPadrao[0]?.id || '';
    if (alvo) {
      setFilterTreinos([alvo]);
    }
    setTreinoEmAnalise(alvo);
    setIsCloseModalOpen(false);
  };

  const salvarFechamentoManual = async () => {
    const alvo = treinoEmAnalise || treinosDoDiaPadrao[0]?.id || null;
    marcarTreinoFechado(hoje, alvo);
    setTreinoEmAnalise('');
  };

  const handleDelete = (registro) => {
    if (!registro?.id) return;
    setDeleteTarget(registro);
  };

  const confirmarExclusao = async () => {
    if (!deleteTarget) return;
    await excluirPresenca(deleteTarget.id);
    setDeleteTarget(null);
  };

  const abrirResumo = () => setIsSummaryOpen(true);
  const fecharResumo = () => setIsSummaryOpen(false);

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

  const abrirEdicao = (registro) => {
    setSelectedRecord(registro);
    setIsEditOpen(true);
  };

  const fecharEdicao = () => {
    setSelectedRecord(null);
    setIsEditOpen(false);
  };

  const obterTreinosUtilizados = useCallback(
    (alunoId, data, ignorarId) =>
      presencas
        .filter((item) => item.alunoId === alunoId && item.data === data && item.id !== ignorarId)
        .map((item) => item.treinoId)
        .filter(Boolean),
    [presencas]
  );

  const obterSugestaoTreino = useCallback(
    (alunoId, data, utilizados = []) => {
      const dia = normalizarDiaSemana(data) || normalizarDiaSemana(hoje);
      const preferencia =
        filterTreinos.includes(TODOS_TREINOS) || filterTreinos.length === 0 ? null : filterTreinos[0];
      if (preferencia && !utilizados.includes(preferencia)) {
        const preferido = treinos.find((treino) => treino.id === preferencia);
        if (preferido) return preferido;
      }
      const porDiaDisponivel = treinos.find(
        (treino) => treino.diaSemana === dia && !utilizados.includes(treino.id)
      );
      if (porDiaDisponivel) return porDiaDisponivel;

      const qualquerDisponivel = treinos.find((treino) => !utilizados.includes(treino.id));
      if (qualquerDisponivel) return qualquerDisponivel;

      const porDia = treinos.find((treino) => treino.diaSemana === dia);
      if (porDia) return porDia;

      return treinos[0] || null;
    },
    [filterTreinos, hoje, normalizarDiaSemana, treinos]
  );

  const abrirSelecaoSessao = (registro, contexto = 'placeholder') => {
    const dataRegistro = registro.data || hoje;
    const utilizados = obterTreinosUtilizados(registro.alunoId, dataRegistro, registro.id);
    const sugestaoDireta =
      registro.treinoId && !utilizados.includes(registro.treinoId)
        ? treinos.find((treino) => treino.id === registro.treinoId)
        : null;
    const sugestao = sugestaoDireta || obterSugestaoTreino(registro.alunoId, dataRegistro, utilizados);
    const aluno = getAlunoById(registro.alunoId);

    setSessionContext(contexto);
    setSessionTakenTreinos(utilizados);
    setSessionTreinoId(sugestao?.id || registro.treinoId || '');
    setSessionRecord({
      alunoId: registro.alunoId,
      alunoNome: aluno?.nome || 'Aluno não encontrado',
      faixaSlug: aluno?.faixaSlug || aluno?.faixa,
      graus: aluno?.graus,
      data: dataRegistro,
      status: 'PRESENTE',
      tipoTreino: sugestao?.nome || registro.tipoTreino || 'Sessão principal'
    });
    setIsSessionOpen(true);
  };

  const fecharSelecaoSessao = () => {
    setIsSessionOpen(false);
    setSessionRecord(null);
    setSessionContext('placeholder');
    setSessionTreinoId('');
    setSessionTakenTreinos([]);
  };

  useEffect(() => {
    if (!sessionRecord) return;
    const opcaoExiste = treinosDisponiveisModal.some((treino) => treino.id === sessionTreinoId);
    if (!opcaoExiste) {
      setSessionTreinoId(treinosDisponiveisModal[0]?.id || '');
    }
  }, [sessionRecord, sessionTreinoId, treinosDisponiveisModal]);

  const handleSessionSubmit = async () => {
    if (!sessionRecord) return;
    const treinoSelecionado =
      treinos.find((treino) => treino.id === sessionTreinoId) ||
      obterSugestaoTreino(sessionRecord.alunoId, sessionRecord.data, sessionTakenTreinos);
    const novaPresenca = await salvarPresenca({
      id: sessionRecord.id || `presenca-${Date.now()}`,
      alunoId: sessionRecord.alunoId,
      data: sessionRecord.data,
      status: 'PRESENTE',
      treinoId: treinoSelecionado?.id || '',
      origem: 'PROFESSOR',
      observacao: sessionRecord.observacao || null,
      createdAt: `${sessionRecord.data || hoje}T00:00:00.000Z`,
      updatedAt: new Date().toISOString(),
    });
    if (
      novaPresenca.treinoId &&
      !(filterTreinos.includes(TODOS_TREINOS) || filterTreinos.length === 0) &&
      !filterTreinos.includes(novaPresenca.treinoId)
    ) {
      setFilterTreinos([TODOS_TREINOS]);
    }
    fecharSelecaoSessao();
    await atualizarLista();
  };

  const abrirSessaoExtra = (registro) => {
    abrirSelecaoSessao(
      {
        alunoId: registro.alunoId,
        data: registro.data || hoje,
        treinoId: null,
        tipoTreino: registro.tipoTreino
      },
      'extra'
    );
  };

  const handleEditSubmit = async (dados) => {
    if (!selectedRecord?.id) return;
    const atualizado = await salvarPresenca({
      id: selectedRecord.id,
      alunoId: dados.alunoId || selectedRecord.alunoId,
      treinoId: dados.treinoId || selectedRecord.treinoId,
      status: dados.status || selectedRecord.status,
      data: dados.data || selectedRecord.data,
      origem: dados.origem || 'PROFESSOR',
      observacao: dados.observacao || null,
      createdAt: selectedRecord.createdAt || `${dados.data || selectedRecord.data || hoje}T00:00:00.000Z`,
      updatedAt: new Date().toISOString(),
    });
    if (!atualizado) return;
    fecharEdicao();
  };

  if (isLoading) {
    return <LoadingState title="Sincronizando presenças" message="Carregando histórico recente de treinos." />;
  }

  return (
    <div className="space-y-5">
      <header className="space-y-3 rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-base font-semibold text-bjj-white">Check-in do treino</h1>
            <p className="text-sm text-bjj-gray-200/70">
              Visualize todos os alunos ativos de hoje e registre presença com apenas um clique.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={abrirResumo}>
              <PieChart size={16} /> Resumo do dia
            </Button>
            <Button type="button" className="w-full sm:w-auto" onClick={abrirFechamento}>
              Fechar treino
            </Button>
          </div>
        </div>
        {!treinos.length && (
          <p className="rounded-xl border border-dashed border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3 text-xs text-bjj-gray-200/70">
            Nenhum horário de treino cadastrado para hoje. Cadastre sessões na aba Configurações para agilizar o check-in.
          </p>
        )}
      </header>

      <section className="grid grid-cols-1 gap-2 text-sm text-bjj-gray-200/80 md:grid-cols-3">
        <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3">
          <p className="text-xs uppercase tracking-wide text-bjj-gray-200/60">Presenças</p>
          <p className="mt-1 text-xl font-semibold text-bjj-white">{presentesDia}</p>
          <p className="text-xs text-bjj-gray-200/60">{formatPercent(taxaPresencaDia)} dos registros do dia</p>
        </div>
        <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3">
          <p className="text-xs uppercase tracking-wide text-bjj-gray-200/60">Faltas</p>
          <p className="mt-1 text-xl font-semibold text-bjj-white">{faltasDia}</p>
          <p className="text-xs text-bjj-gray-200/60">Ausências e justificativas registradas</p>
        </div>
        <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3">
          <p className="text-xs uppercase tracking-wide text-bjj-gray-200/60">Pendentes</p>
          <p className="mt-1 text-xl font-semibold text-bjj-white">{pendentesDia}</p>
          <p className="text-xs text-bjj-gray-200/60">Check-ins aguardando confirmação</p>
        </div>
      </section>

      <article className="card space-y-4 overflow-visible">
        <header className="space-y-1">
          <h2 className="text-base font-semibold text-bjj-white">Filtros inteligentes</h2>
          <p className="text-sm text-bjj-gray-200/70">
            Combine os filtros abaixo para focar em faixas, status ou treinos específicos. A busca por nome é habilitada a partir de
            três letras.
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
          </div>
          <MultiSelectDropdown
            label="Faixa"
            options={opcoesFaixa}
            value={filterFaixas}
            onChange={(lista) => setFilterFaixas(normalizarSelecao(lista, faixasDisponiveis.length))}
            allLabel="Todas as faixas"
            placeholder="Selecionar faixas"
            className="h-full"
          />
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
            allLabel="Todos do dia"
            placeholder={opcoesTreinos.length ? 'Selecionar treinos' : 'Nenhum treino cadastrado'}
            disabled={!opcoesTreinos.length}
            className="h-full"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-bjj-gray-200/60">
            Exibindo {totalFiltrado} de {registrosDoDia.length} aluno(s) ativos hoje.
          </p>
          <button
            type="button"
            onClick={limparFiltros}
            className="text-xs font-semibold uppercase tracking-wide text-bjj-gray-200/70 transition hover:text-bjj-red"
          >
            Limpar filtros
          </button>
        </div>
      </article>

      {treinoEmAnalise && (
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-bjj-gray-800/70 bg-bjj-gray-900/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-bjj-gray-200/60">Fechamento em análise</p>
            <p className="text-sm font-semibold text-bjj-white">{treinoAnaliseLabel}</p>
            <p className="text-xs text-bjj-gray-200/70">Revise check-ins pendentes antes de encerrar o treino.</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setTreinoEmAnalise('')} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="button" onClick={salvarFechamentoManual} className="w-full sm:w-auto">
              Salvar & Fechar treino
            </Button>
          </div>
        </div>
      )}

      <AttendanceTable
        records={registrosFiltradosOrdenados}
        onConfirm={handleConfirm}
        onMarkAbsent={(registro) => handleMarkAbsent(registro, false)}
        onDelete={handleDelete}
        onEdit={abrirEdicao}
        onAddSession={abrirSessaoExtra}
        onRequestSession={abrirSelecaoSessao}
        isLoading={isRefreshing}
      />

      <Modal isOpen={isCloseModalOpen} onClose={fecharModalFechamento} title="Fechar treino">
        <div className="space-y-4 text-sm text-bjj-gray-200/80">
          <p>Fechar treino e registrar faltas para quem não confirmou presença?</p>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-bjj-gray-200/60">Treino</p>
            <Select value={treinoParaFechar} onChange={(event) => setTreinoParaFechar(event.target.value)}>
              {opcoesTreinos.map((treino) => (
                <option key={treino.value} value={treino.value}>
                  {treino.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <Button type="button" variant="ghost" onClick={fecharModalFechamento} className="w-full">
              Não
            </Button>
            <Button type="button" variant="secondary" onClick={direcionarParaAnalise} className="w-full">
              Analisar
            </Button>
            <Button type="button" onClick={fecharTreinoAutomatico} className="w-full">
              Sim, fechar agora
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isSummaryOpen} onClose={fecharResumo} title="Resumo do treino">
        <div className="space-y-4 text-sm text-bjj-gray-200/80">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/70 p-4">
              <p className="text-xs uppercase tracking-wide text-bjj-gray-200/60">Total de alunos</p>
              <p className="mt-1 text-2xl font-semibold text-bjj-white">{registrosDoDia.length}</p>
            </div>
            <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/70 p-4">
              <p className="text-xs uppercase tracking-wide text-bjj-gray-200/60">Pendentes</p>
              <p className="mt-1 text-2xl font-semibold text-bjj-white">{pendentesDia}</p>
            </div>
          </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide text-bjj-gray-200/60">Distribuição do dia</p>
              <div className="space-y-2">
                {[{ rotulo: 'Presenças', valor: presentesDia, cor: 'bg-bjj-red' }, { rotulo: 'Faltas', valor: faltasDia, cor: 'bg-bjj-gray-800' }].map((item) => {
                  const percentual = Math.round((item.valor / totalDia) * 100);
                  return (
                    <div key={item.rotulo}>
                      <div className="flex items-center justify-between text-xs">
                        <span>{item.rotulo}</span>
                        <span>{item.valor} · {percentual}%</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-bjj-gray-800/60">
                        <div className={`h-full rounded-full ${item.cor}`} style={{ width: `${percentual}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-bjj-gray-200/60">Lista rápida</p>
            <ul className="space-y-2.5">
              {registrosDoDia.map((item) => {
                const treino = treinos.find((treino) => treino.id === item.treinoId);
                const treinoLabel = treino?.nome || 'Sessão principal';
                const statusInfo = statusLabel(item.status);
                const statusMessage =
                  item.status === 'PRESENTE'
                    ? 'Presença confirmada'
                    : item.status === 'PENDENTE'
                    ? 'Aguardando confirmação'
                    : 'Falta registrada';

                return (
                  <li
                    key={item.id || `${item.alunoId}-${item.treinoId || item.data}`}
                    className="flex items-center justify-between rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-bjj-white">{resolveAlunoNome(item.alunoId)}</p>
                      <p className="text-[11px] text-bjj-gray-200/60">{statusMessage}</p>
                      <p className="text-[11px] text-bjj-gray-200/50">{treinoLabel}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold ${statusInfo.tone}`}
                    >
                      {statusInfo.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditOpen}
        onClose={fecharEdicao}
        title={
          selectedRecord ? `Corrigir presença de ${resolveAlunoNome(selectedRecord.alunoId)}` : 'Corrigir presença'
        }
      >
        {selectedRecord && (
          <PresenceForm
            initialData={selectedRecord}
            onSubmit={handleEditSubmit}
            onCancel={fecharEdicao}
            submitLabel="Salvar ajustes"
          />
        )}
      </Modal>

      <Modal
        isOpen={isSessionOpen}
        onClose={fecharSelecaoSessao}
        title={
          sessionRecord
              ? sessionContext === 'extra'
                ? `Adicionar nova sessão para ${resolveAlunoNome(sessionRecord.alunoId)}`
                : `Selecionar sessão para ${resolveAlunoNome(sessionRecord.alunoId)}`
              : 'Selecionar sessão'
        }
      >
        <div className="space-y-4 text-sm text-bjj-gray-200/80">
          <p>
            Escolha o treino correspondente para registrar a presença de
            <strong className="text-bjj-white"> {sessionRecord ? resolveAlunoNome(sessionRecord.alunoId) : ''}</strong> no dia{' '}
            {sessionRecord
              ? new Date(sessionRecord.data).toLocaleDateString('pt-BR')
              : new Date().toLocaleDateString('pt-BR')}. Você pode adicionar mais de uma sessão no mesmo dia,
            como treinos de Gi e No-Gi.
          </p>
          <label className="block text-sm font-medium text-bjj-white">Treino / sessão</label>
          <Select value={sessionTreinoId} onChange={(event) => setSessionTreinoId(event.target.value)}>
            {treinosDisponiveisModal.map((treino) => (
              <option key={treino.id} value={treino.id}>
                {treino.nome} · {treino.hora}
                {sessionContext === 'extra' && sessionTakenTreinos.includes(treino.id) ? ' (já registrado)' : ''}
              </option>
            ))}
            {!treinosDisponiveisModal.length && <option value="">Sessão principal</option>}
          </Select>
          <div className="flex flex-col gap-2 md:flex-row md:justify-end">
            <Button type="button" variant="secondary" className="md:w-auto" onClick={fecharSelecaoSessao}>
              Cancelar
            </Button>
            <Button type="button" className="md:w-auto" onClick={handleSessionSubmit}>
              Confirmar presença
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Confirmar exclusão"
        message={
          deleteTarget
            ? `Deseja remover o registro de ${resolveAlunoNome(deleteTarget.alunoId)} em ${new Date(deleteTarget.data).toLocaleDateString(
                'pt-BR'
              )}?`
            : ''
        }
        confirmLabel="Remover registro"
        onConfirm={confirmarExclusao}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
