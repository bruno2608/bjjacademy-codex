'use client';

/**
 * Tela de presenças com identidade visual alinhada à experiência gamificada
 * do restante do painel. Registro e listagem permanecem em uma única página.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PieChart } from 'lucide-react';
import AttendanceTable from '../../../components/ui/AttendanceTable';
import PresenceForm from '../../../components/ui/PresenceForm';
import LoadingState from '../../../components/ui/LoadingState';
import Modal from '../../../components/ui/Modal';
import useUserStore from '../../../store/userStore';
import {
  createPresenca,
  deletePresenca,
  getPresencas,
  togglePresenca,
  updatePresenca
} from '../../../services/presencasService';

const formatPercent = (value) => `${Math.round(value)}%`;
const formatTime = () =>
  new Date()
    .toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    .padStart(5, '0');

export default function PresencasPage() {
  const [presencas, setPresencas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [sessionRecord, setSessionRecord] = useState(null);
  const [sessionTreinoId, setSessionTreinoId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const alunos = useUserStore((state) => state.alunos);
  const treinos = useUserStore((state) => state.treinos);
  const hoje = useMemo(() => new Date().toISOString().split('T')[0], []);
  const normalizarDiaSemana = useCallback((valor) => {
    const referencia = valor ? new Date(valor) : new Date();
    if (Number.isNaN(referencia.getTime())) return null;
    return referencia.toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase();
  }, []);
  const sugerirTreino = useCallback(
    (dataReferencia) => {
      const dia = normalizarDiaSemana(dataReferencia) || normalizarDiaSemana(hoje);
      const candidatos = treinos.filter((treino) => treino.diaSemana === dia);
      return candidatos[0] || treinos[0] || null;
    },
    [hoje, normalizarDiaSemana, treinos]
  );

  useEffect(() => {
    let active = true;
    async function carregar() {
      try {
        const lista = await getPresencas();
        if (!active) return;
        setPresencas(lista);
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
  }, []);

  const atualizarLista = useCallback(async () => {
    setIsRefreshing(true);
    const lista = await getPresencas();
    setPresencas(lista);
    setIsRefreshing(false);
  }, []);

  const presentes = presencas.filter((item) => item.status === 'Presente').length;
  const ausentes = presencas.filter((item) => item.status !== 'Presente').length;
  const total = presencas.length || 1;
  const taxaPresenca = (presentes / total) * 100;

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
        const treinoSugestao = sugerirTreino(hoje);
        return {
          id: `placeholder-${aluno.id}-${treinoSugestao?.id || 'principal'}`,
          alunoId: aluno.id,
          alunoNome: aluno.nome,
          faixa: aluno.faixa,
          graus: aluno.graus,
          data: hoje,
          status: 'Ausente',
          hora: null,
          treinoId: treinoSugestao?.id || null,
          tipoTreino: treinoSugestao?.nome || 'Sessão principal',
          isPlaceholder: true
        };
      });

    return [...registros, ...placeholders].sort((a, b) => a.alunoNome.localeCompare(b.alunoNome, 'pt-BR'));
  }, [alunosAtivos, hoje, presencas, sugerirTreino]);

  const registrosFiltrados = useMemo(() => {
    if (searchTerm.trim().length < 3) {
      return registrosDoDia;
    }
    const termo = searchTerm.toLowerCase();
    return registrosDoDia.filter((item) => item.alunoNome.toLowerCase().includes(termo));
  }, [registrosDoDia, searchTerm]);

  const presentesDia = registrosDoDia.filter((item) => item.status === 'Presente').length;
  const ausentesDia = registrosDoDia.length - presentesDia;
  const atrasosDia = registrosDoDia.filter(
    (item) => item.status === 'Presente' && item.hora && item.hora > '10:00'
  ).length;
  const totalDia = registrosDoDia.length || 1;

  const diasAtivos = useMemo(() => {
    const conjunto = new Set(presencas.map((item) => item.data));
    return conjunto.size;
  }, [presencas]);

  const handleToggle = async (registro) => {
    if (!registro?.id) {
      abrirSelecaoSessao(registro);
      return;
    }

    const atualizado = await togglePresenca(registro.id);
    setPresencas((prev) => prev.map((item) => (item.id === atualizado.id ? atualizado : item)));
  };

  const handleDelete = async (registro) => {
    if (!registro?.id) return;
    await deletePresenca(registro.id);
    await atualizarLista();
  };

  const abrirResumo = () => setIsSummaryOpen(true);
  const fecharResumo = () => setIsSummaryOpen(false);

  const abrirEdicao = (registro) => {
    setSelectedRecord(registro);
    setIsEditOpen(true);
  };

  const fecharEdicao = () => {
    setSelectedRecord(null);
    setIsEditOpen(false);
  };

  const abrirSelecaoSessao = (registro) => {
    const sugestao = registro.treinoId || sugerirTreino(registro.data)?.id || treinos[0]?.id || '';
    setSessionTreinoId(sugestao);
    setSessionRecord(registro);
    setIsSessionOpen(true);
  };

  const fecharSelecaoSessao = () => {
    setIsSessionOpen(false);
    setSessionRecord(null);
  };

  const handleSessionSubmit = async () => {
    if (!sessionRecord) return;
    const treinoSelecionado =
      treinos.find((treino) => treino.id === sessionTreinoId) ||
      sugerirTreino(sessionRecord.data);
    await createPresenca({
      alunoId: sessionRecord.alunoId,
      alunoNome: sessionRecord.alunoNome,
      faixa: sessionRecord.faixa,
      graus: sessionRecord.graus,
      data: sessionRecord.data,
      status: 'Presente',
      treinoId: treinoSelecionado?.id || null,
      tipoTreino: treinoSelecionado?.nome || sessionRecord.tipoTreino || 'Sessão principal',
      hora: treinoSelecionado?.hora || formatTime()
    });
    fecharSelecaoSessao();
    await atualizarLista();
  };

  const handleEditSubmit = async (dados) => {
    if (!selectedRecord?.id) return;
    const atualizado = await updatePresenca(selectedRecord.id, dados);
    setPresencas((prev) => prev.map((item) => (item.id === atualizado.id ? atualizado : item)));
    fecharEdicao();
  };

  if (isLoading) {
    return <LoadingState title="Sincronizando presenças" message="Carregando histórico recente de treinos." />;
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-base font-semibold text-bjj-white">Check-in do treino</h1>
          <p className="text-sm text-bjj-gray-200/70">
            Visualize todos os alunos ativos de hoje e registre presença com apenas um clique.
          </p>
        </div>
        <button type="button" className="btn-secondary w-full md:w-auto" onClick={abrirResumo}>
          <PieChart size={16} /> Resumo do dia
        </button>
      </header>

      <section className="grid grid-cols-1 gap-2 text-sm text-bjj-gray-200/80 md:grid-cols-3">
        <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3">
          <p className="text-xs uppercase tracking-wide text-bjj-gray-200/60">Presenças</p>
          <p className="mt-1 text-xl font-semibold text-bjj-white">{presentesDia}</p>
          <p className="text-xs text-bjj-gray-200/60">{formatPercent(taxaPresenca)} dos registros do dia</p>
        </div>
        <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3">
          <p className="text-xs uppercase tracking-wide text-bjj-gray-200/60">Faltas</p>
          <p className="mt-1 text-xl font-semibold text-bjj-white">{ausentesDia}</p>
          <p className="text-xs text-bjj-gray-200/60">Total de alunos aguardando check-in</p>
        </div>
        <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3">
          <p className="text-xs uppercase tracking-wide text-bjj-gray-200/60">Dias monitorados</p>
          <p className="mt-1 text-xl font-semibold text-bjj-white">{diasAtivos}</p>
          <p className="text-xs text-bjj-gray-200/60">Histórico de treinos acompanhados</p>
        </div>
      </section>

      <article className="card space-y-3">
        <header className="space-y-1">
          <h2 className="text-base font-semibold text-bjj-white">Filtrar alunos</h2>
          <p className="text-sm text-bjj-gray-200/70">
            Digite pelo menos três letras para localizar rapidamente um aluno e registrar a presença.
          </p>
        </header>
        <div className="grid gap-3 md:grid-cols-[minmax(0,320px)_auto] md:items-center">
          <input
            type="search"
            className="input-field"
            placeholder="Buscar por nome do aluno"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <p className="text-xs text-bjj-gray-200/60">
            {searchTerm.trim().length >= 3
              ? `${registrosFiltrados.length} aluno(s) encontrados.`
              : 'Mostrando todos os alunos ativos do dia.'}
          </p>
        </div>
      </article>

      <AttendanceTable
        records={registrosFiltrados}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={abrirEdicao}
        onRequestSession={abrirSelecaoSessao}
        isLoading={isRefreshing}
      />

      <Modal isOpen={isSummaryOpen} onClose={fecharResumo} title="Resumo do treino">
        <div className="space-y-4 text-sm text-bjj-gray-200/80">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/70 p-4">
              <p className="text-xs uppercase tracking-wide text-bjj-gray-200/60">Total de alunos</p>
              <p className="mt-1 text-2xl font-semibold text-bjj-white">{registrosDoDia.length}</p>
            </div>
            <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/70 p-4">
              <p className="text-xs uppercase tracking-wide text-bjj-gray-200/60">Atrasos</p>
              <p className="mt-1 text-2xl font-semibold text-bjj-white">{atrasosDia}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-bjj-gray-200/60">Distribuição do dia</p>
            <div className="space-y-2">
              {[{ rotulo: 'Presenças', valor: presentesDia, cor: 'bg-bjj-red' }, { rotulo: 'Faltas', valor: ausentesDia, cor: 'bg-bjj-gray-800' }].map((item) => {
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
                {registrosDoDia.map((item) => (
                  <li
                  key={`${item.alunoId}-${item.treinoId || item.data}`}
                  className="flex items-center justify-between rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-bjj-white">{item.alunoNome}</p>
                    <p className="text-[11px] text-bjj-gray-200/60">
                      {item.status === 'Presente'
                        ? `Confirmado às ${item.hora || '—'}`
                        : 'Ainda não marcado'}
                    </p>
                    <p className="text-[11px] text-bjj-gray-200/50">{item.tipoTreino || 'Sessão principal'}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      item.status === 'Presente' ? 'text-bjj-red' : 'text-bjj-gray-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditOpen}
        onClose={fecharEdicao}
        title={selectedRecord ? `Corrigir presença de ${selectedRecord.alunoNome}` : 'Corrigir presença'}
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
        title={sessionRecord ? `Selecionar sessão para ${sessionRecord.alunoNome}` : 'Selecionar sessão'}
      >
        <div className="space-y-4 text-sm text-bjj-gray-200/80">
          <p>
            Escolha o treino correspondente para registrar a presença de
            <strong className="text-bjj-white"> {sessionRecord?.alunoNome}</strong> no dia{' '}
            {sessionRecord
              ? new Date(sessionRecord.data).toLocaleDateString('pt-BR')
              : new Date().toLocaleDateString('pt-BR')}.
          </p>
          <label className="block text-sm font-medium text-bjj-white">Treino / sessão</label>
          <select
            className="input-field"
            value={sessionTreinoId}
            onChange={(event) => setSessionTreinoId(event.target.value)}
          >
            {treinos.map((treino) => (
              <option key={treino.id} value={treino.id}>
                {treino.nome} · {treino.hora}
              </option>
            ))}
            {!treinos.length && <option value="">Sessão principal</option>}
          </select>
          <div className="flex flex-col gap-2 md:flex-row md:justify-end">
            <button type="button" className="btn-secondary md:w-auto" onClick={fecharSelecaoSessao}>
              Cancelar
            </button>
            <button type="button" className="btn-primary md:w-auto" onClick={handleSessionSubmit}>
              Confirmar presença
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
