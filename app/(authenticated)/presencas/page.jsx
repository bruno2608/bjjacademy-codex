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
  const [selectedRecord, setSelectedRecord] = useState(null);
  const alunos = useUserStore((state) => state.alunos);
  const hoje = useMemo(() => new Date().toISOString().split('T')[0], []);

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
    const mapa = new Map();
    presencas
      .filter((item) => item.data === hoje)
      .forEach((item) => {
        mapa.set(item.alunoId, { ...item, isPlaceholder: false });
      });

    const placeholders = alunosAtivos.map((aluno) => {
      const existente = mapa.get(aluno.id);
      if (existente) {
        return existente;
      }
      return {
        id: null,
        alunoId: aluno.id,
        alunoNome: aluno.nome,
        faixa: aluno.faixa,
        graus: aluno.graus,
        data: hoje,
        status: 'Ausente',
        hora: null,
        isPlaceholder: true
      };
    });

    return placeholders
      .slice()
      .sort((a, b) => a.alunoNome.localeCompare(b.alunoNome, 'pt-BR'));
  }, [alunosAtivos, hoje, presencas]);

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

  const handleCreate = async (payload) => {
    const novoRegistro = await createPresenca(payload);
    setPresencas((prev) => [...prev, novoRegistro]);
  };

  const handleToggle = async (registro) => {
    if (!registro?.id) {
      const novoRegistro = await createPresenca({
        alunoId: registro.alunoId,
        alunoNome: registro.alunoNome,
        faixa: registro.faixa,
        graus: registro.graus,
        data: hoje,
        status: 'Presente',
        hora: formatTime()
      });
      setPresencas((prev) => [...prev, novoRegistro]);
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
          <h2 className="text-base font-semibold text-bjj-white">Registrar presença manual</h2>
          <p className="text-sm text-bjj-gray-200/70">
            Use o formulário para ajustar registros específicos ou incluir treinos anteriores.
          </p>
        </header>
        <PresenceForm onSubmit={handleCreate} />
      </article>

      <AttendanceTable
        records={registrosDoDia}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={abrirEdicao}
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
                  key={item.alunoId}
                  className="flex items-center justify-between rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-bjj-white">{item.alunoNome}</p>
                    <p className="text-[11px] text-bjj-gray-200/60">
                      {item.status === 'Presente'
                        ? `Confirmado às ${item.hora || '—'}`
                        : 'Ainda não marcado'}
                    </p>
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
    </div>
  );
}
