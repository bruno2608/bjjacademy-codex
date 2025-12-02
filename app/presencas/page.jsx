'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CalendarDays, CheckCircle2, Clock, PieChart } from 'lucide-react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import MinimalTabs from '@/components/ui/Tabs';
import { useAcademiasStore } from '@/store/academiasStore';
import { useAlunosStore } from '@/store/alunosStore';
import { useAulasStore } from '@/store/aulasStore';
import { useMatriculasStore } from '@/store/matriculasStore';
import { usePresencasStore } from '@/store/presencasStore';
import { useTurmasStore } from '@/store/turmasStore';
import { useUserStore } from '@/store/userStore';
import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils';

const STATUS_LABELS = {
  PENDENTE: { label: 'Pendente', tone: 'text-yellow-200' },
  PRESENTE: { label: 'Presente', tone: 'text-green-300' },
  FALTA: { label: 'Falta', tone: 'text-red-300' },
  JUSTIFICADA: { label: 'Justificada', tone: 'text-indigo-200' },
};

const hoje = () => new Date().toISOString().split('T')[0];
const formatRangeDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const formatDateBr = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const StatusBadge = ({ status }) => {
  const statusInfo = STATUS_LABELS[status];
  if (!statusInfo) return null;

  const icon = (() => {
    switch (status) {
      case 'PENDENTE':
        return <Clock size={14} />;
      case 'PRESENTE':
        return <CheckCircle2 size={14} />;
      case 'FALTA':
        return <AlertCircle size={14} />;
      case 'JUSTIFICADA':
        return <CalendarDays size={14} />;
      default:
        return null;
    }
  })();

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${statusInfo.tone}`}>
      {icon}
      {statusInfo.label}
    </span>
  );
};

export default function PresencasPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(hoje());
  const [selectedTurmaId, setSelectedTurmaId] = useState('');
  const [currentAulaId, setCurrentAulaId] = useState('');
  const [pendenciasInicio, setPendenciasInicio] = useState(formatRangeDate(-7));
  const [pendenciasFim, setPendenciasFim] = useState(hoje());
  const [abaAtiva, setAbaAtiva] = useState('chamada');

  const user = useUserStore((state) => state.user);
  const turmas = useTurmasStore((state) => state.turmas);
  const carregarTurmas = useTurmasStore((state) => state.carregarTurmas);
  const listarTurmasDaAcademia = useTurmasStore((state) => state.listarTurmasDaAcademia);
  const aulas = useAulasStore((state) => state.aulas);
  const carregarAulas = useAulasStore((state) => state.carregarAulas);
  const getAulaByTurmaAndDate = useAulasStore((state) => state.getAulaByTurmaAndDate);
  const presencas = usePresencasStore((state) => state.presencas);
  const carregarPresencas = usePresencasStore((state) => state.carregarTodas);
  const carregarPorAula = usePresencasStore((state) => state.carregarPorAula);
  const registrarPresencaEmAula = usePresencasStore((state) => state.registrarPresencaEmAula);
  const atualizarStatus = usePresencasStore((state) => state.atualizarStatus);
  const fecharAulaStore = usePresencasStore((state) => state.fecharAula);
  const alunos = useAlunosStore((state) => state.alunos);
  const getAlunoById = useAlunosStore((state) => state.getAlunoById);
  const academias = useAcademiasStore((state) => state.academias);
  const carregarAcademias = useAcademiasStore((state) => state.carregarAcademias);
  const carregarMatriculas = useMatriculasStore((state) => state.carregarMatriculas);
  const matriculasAtivasDaAcademia = useMatriculasStore((state) => state.listarAtivasDaAcademia);

  useEffect(() => {
    let active = true;
    const load = async () => {
      await Promise.all([
        carregarPresencas(),
        carregarTurmas(),
        carregarAulas(),
        carregarAcademias(),
        carregarMatriculas(),
      ]);
      if (active) setIsLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, [carregarAulas, carregarAcademias, carregarMatriculas, carregarPresencas, carregarTurmas]);

  const currentAcademiaId = useMemo(
    () => user?.academiaId || academias[0]?.id || 'academia_bjj_central',
    [academias, user?.academiaId]
  );

  const turmasDaAcademia = useMemo(
    () => listarTurmasDaAcademia(currentAcademiaId),
    [currentAcademiaId, listarTurmasDaAcademia]
  );

  useEffect(() => {
    if (!selectedTurmaId && turmasDaAcademia.length > 0) {
      setSelectedTurmaId(turmasDaAcademia[0].id);
    }
  }, [selectedTurmaId, turmasDaAcademia]);

  useEffect(() => {
    if (!selectedTurmaId || !selectedDate) return;
    const turma = turmasDaAcademia.find((item) => item.id === selectedTurmaId);
    if (!turma) return;

    (async () => {
      const aula = await getAulaByTurmaAndDate(selectedTurmaId, selectedDate, {
        horaInicio: turma.horaInicio,
        horaFim: turma.horaFim,
      });
      if (!aula) {
        setCurrentAulaId('');
        return;
      }

      setCurrentAulaId(aula.id);
      await carregarPorAula(aula.id);
    })();
  }, [selectedDate, selectedTurmaId, turmasDaAcademia, getAulaByTurmaAndDate, carregarPorAula]);

  const alunosDaAcademia = useMemo(
    () =>
      matriculasAtivasDaAcademia(currentAcademiaId)
        .map((matricula) => ({
          matricula,
          aluno: getAlunoById(matricula.alunoId),
        }))
        .filter((item) => Boolean(item.aluno)),
    [currentAcademiaId, getAlunoById, matriculasAtivasDaAcademia]
  );

  const presencasDaAulaAtual = useMemo(
    () => presencas.filter((registro) => registro.aulaId === currentAulaId),
    [currentAulaId, presencas]
  );

  const resumoAula = useMemo(() => {
    const total = presencasDaAulaAtual.length;
    const presentes = presencasDaAulaAtual.filter((item) => item.status === 'PRESENTE').length;
    const faltas = presencasDaAulaAtual.filter((item) => item.status === 'FALTA').length;
    const justificadas = presencasDaAulaAtual.filter((item) => item.status === 'JUSTIFICADA').length;
    const pendentes = presencasDaAulaAtual.filter((item) => item.status === 'PENDENTE').length;
    return { total, presentes, faltas, justificadas, pendentes };
  }, [presencasDaAulaAtual]);

  const alunosDaChamada = useMemo(() => {
    const matriculasTurma = alunosDaAcademia.filter((entry) => entry.matricula.turmaId === selectedTurmaId);
    return matriculasTurma.map((entry) => {
      const presenca = presencas.find(
        (registro) => registro.aulaId === currentAulaId && registro.alunoId === entry.matricula.alunoId
      );
      return {
        aluno: entry.aluno,
        matricula: entry.matricula,
        presenca,
      };
    });
  }, [alunosDaAcademia, currentAulaId, presencas, selectedTurmaId]);

  const pendencias = useMemo(() => {
    const inicio = new Date(pendenciasInicio);
    const fim = new Date(pendenciasFim);

    return presencas
      .filter((presenca) => presenca.status === 'PENDENTE')
      .filter((presenca) => {
        const data = presenca.data ? new Date(presenca.data) : null;
        if (!data) return false;
        return data >= inicio && data <= fim;
      })
      .map((presenca) => {
        const turma = turmas.find((item) => item.id === (presenca.turmaId || presenca.treinoId));
        if (!turma || turma.academiaId !== currentAcademiaId) return null;
        const aula = presenca.aulaId ? aulas.find((item) => item.id === presenca.aulaId) : null;
        const aluno = alunos.find((item) => item.id === presenca.alunoId);
        if (!aluno) return null;
        return { presenca, turma, aula, aluno };
      })
      .filter(Boolean);
  }, [aulas, alunos, currentAcademiaId, pendenciasFim, pendenciasInicio, presencas, turmas]);

  const aulaAtual = currentAulaId ? aulas.find((aula) => aula.id === currentAulaId) : null;
  const turmaAtual = turmasDaAcademia.find((turma) => turma.id === selectedTurmaId);

  const abasDisponiveis = useMemo(
    () => [
      {
        id: 'chamada',
        titulo: 'Chamada do dia',
        descricao:
          turmaAtual && selectedDate
            ? `${turmaAtual.nome} • ${formatDateBr(selectedDate)}`
            : 'Selecione turma e data para registrar presença',
        badge: `${resumoAula.total || alunosDaChamada.length} alunos`
      },
      {
        id: 'pendencias',
        titulo: 'Pendências',
        descricao:
          pendencias.length > 0
            ? 'Reveja e aprove rapidamente as presenças pendentes'
            : 'Sem pendências no período filtrado',
        badge: `${pendencias.length} itens`
      }
    ],
    [alunosDaChamada.length, pendencias.length, resumoAula.total, selectedDate, turmaAtual]
  );

  const handleStatusChange = async (alunoId, status) => {
    if (!currentAulaId) return;
    await registrarPresencaEmAula({
      alunoId,
      turmaId: selectedTurmaId,
      treinoId: selectedTurmaId,
      aulaId: currentAulaId,
      status,
      data: selectedDate,
      origem: 'PROFESSOR',
    });
  };

  const handlePendenciaStatus = async (presencaId, status) => {
    await atualizarStatus(presencaId, status);
  };

  const handleFecharAula = async () => {
    if (!currentAulaId) return;
    await fecharAulaStore(currentAulaId, selectedTurmaId);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-bjj-gray-800 text-bjj-gray-100">
        Carregando presenças...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-bjj-gray-200">Painel do professor</p>
          <h1 className="text-3xl font-bold text-white">Presenças</h1>
          <p className="text-bjj-gray-100">Chamada em tempo real e revisão de pendências</p>
        </div>
        <div className="flex flex-col items-start gap-2 rounded-2xl bg-bjj-gray-800/70 px-4 py-3 text-bjj-blue-200 ring-1 ring-bjj-gray-700 md:flex-row md:items-center">
          <div className="flex items-center gap-2 text-bjj-blue-100">
            <PieChart size={20} />
            <span className="text-sm uppercase tracking-wide">Visão professor</span>
          </div>
          <span className="rounded-full bg-bjj-gray-900/80 px-3 py-1 text-xs font-semibold text-white">
            {turmaAtual ? turmaAtual.nome : 'Selecione uma turma'}
          </span>
        </div>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-r from-bjj-gray-900 to-bjj-gray-800 p-4 ring-1 ring-bjj-gray-700">
          <p className="text-xs uppercase tracking-wide text-bjj-gray-300">Academia</p>
          <p className="text-lg font-semibold text-white">
            {academias.find((a) => a.id === currentAcademiaId)?.nome || 'Academia não definida'}
          </p>
          <p className="text-xs text-bjj-gray-200">Contexto filtrado automaticamente</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-bjj-blue-900/60 via-bjj-blue-800/40 to-bjj-gray-800 p-4 ring-1 ring-bjj-gray-700">
          <div className="flex items-center justify-between text-bjj-gray-100">
            <p className="text-xs uppercase tracking-wide">Aula atual</p>
            {aulaAtual && <StatusBadge status={aulaAtual.status === 'encerrada' ? 'PRESENTE' : 'PENDENTE'} />}
          </div>
          <p className="text-lg font-semibold text-white">{turmaAtual ? turmaAtual.nome : 'Escolha uma turma'}</p>
          <p className="text-xs text-bjj-gray-200">{formatDateBr(selectedDate)}</p>
        </div>
        <div className="rounded-2xl bg-bjj-gray-900/80 p-4 ring-1 ring-bjj-gray-700">
          <p className="text-xs uppercase tracking-wide text-bjj-gray-300">Resumo da chamada</p>
          <div className="mt-2 grid grid-cols-4 gap-2 text-center text-white">
            <div className="rounded-xl bg-bjj-gray-800 py-2">
              <p className="text-lg font-bold">{resumoAula.presentes}</p>
              <p className="text-xs text-bjj-gray-200">Presentes</p>
            </div>
            <div className="rounded-xl bg-bjj-gray-800 py-2">
              <p className="text-lg font-bold">{resumoAula.pendentes}</p>
              <p className="text-xs text-bjj-gray-200">Pendentes</p>
            </div>
            <div className="rounded-xl bg-bjj-gray-800 py-2">
              <p className="text-lg font-bold">{resumoAula.faltas}</p>
              <p className="text-xs text-bjj-gray-200">Faltas</p>
            </div>
            <div className="rounded-xl bg-bjj-gray-800 py-2">
              <p className="text-lg font-bold">{resumoAula.justificadas}</p>
              <p className="text-xs text-bjj-gray-200">Justificadas</p>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-3 rounded-2xl bg-bjj-gray-900/60 p-4 ring-1 ring-bjj-gray-800">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.18em] text-bjj-gray-200/70">Fluxos de presença</p>
            <h2 className="text-lg font-semibold text-white">Chamada e pendências</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-bjj-gray-800 bg-bjj-gray-900 px-3 py-1.5 text-[11px] font-semibold text-bjj-gray-100">
            <PieChart size={14} />
            {turmaAtual ? turmaAtual.nome : 'Turma não selecionada'}
          </div>
        </div>

        <MinimalTabs
          items={abasDisponiveis.map((aba) => ({ id: aba.id, label: aba.titulo, badge: aba.badge }))}
          activeId={abaAtiva}
          onChange={setAbaAtiva}
        />
      </section>

      {abaAtiva === 'chamada' ? (
        <section className="rounded-2xl bg-bjj-gray-800/70 p-5 shadow-lg ring-1 ring-bjj-gray-700">
          <div className="flex flex-col gap-3 border-b border-bjj-gray-700 pb-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-bjj-gray-200">Operação em tempo real</p>
              <h2 className="text-xl font-semibold text-white">Chamada do dia</h2>
              <p className="text-sm text-bjj-gray-200">
                Defina a turma e a data para registrar presenças imediatamente.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto"
              />
              <Select
                value={selectedTurmaId}
                onChange={(e) => setSelectedTurmaId(e.target.value)}
                className="w-full sm:w-auto"
              >
                {turmasDaAcademia.map((turma) => (
                  <option key={turma.id} value={turma.id}>
                    {turma.nome}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {turmasDaAcademia.length === 0 ? (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-bjj-gray-700 bg-bjj-gray-900/60 p-4 text-bjj-gray-100">
              <AlertCircle size={20} className="text-yellow-300" />
              <div>
                <p className="font-semibold text-white">Nenhuma turma encontrada</p>
                <p className="text-sm text-bjj-gray-200">Cadastre turmas na academia para iniciar a chamada.</p>
              </div>
            </div>
            ) : (
              <>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-bjj-gray-900/70 px-4 py-3 text-sm text-bjj-gray-200 ring-1 ring-bjj-gray-700">
                  <div className="flex items-center gap-2 text-white">
                    <Clock size={16} />
                    <span>
                      {turmaAtual ? turmaAtual.nome : 'Turma não selecionada'} • {formatDateBr(selectedDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <StatusBadge status={aulaAtual?.status === 'encerrada' ? 'PRESENTE' : 'PENDENTE'} />
                    <span className="rounded-full bg-bjj-gray-800 px-2 py-1 text-bjj-gray-100">
                      {resumoAula.total || alunosDaChamada.length} alunos na chamada
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {alunosDaChamada.length === 0 && (
                    <p className="text-bjj-gray-100">Nenhum aluno ativo vinculado a esta turma.</p>
                  )}
                  {alunosDaChamada.map(({ aluno, matricula, presenca }) => {
                    const faixa = aluno?.faixaSlug ? getFaixaConfigBySlug(aluno.faixaSlug) : null;
                    const status = presenca ? presenca.status : 'PENDENTE';
                    return (
                      <div
                        key={matricula.id}
                        className="flex flex-col gap-3 rounded-xl border border-bjj-gray-700 bg-bjj-gray-900/60 p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="space-y-1">
                          <p className="text-lg font-semibold text-white">{aluno?.nome}</p>
                          <p className="text-sm text-bjj-gray-200">Matrícula #{matricula.numero}</p>
                          {faixa && <p className={`inline-flex rounded-full bg-bjj-gray-800 px-2 py-1 text-xs ${faixa.textColor}`}>{faixa.nome}</p>}
                        </div>
                        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
                          <StatusBadge status={status} />
                          <div className="flex flex-wrap gap-1">
                            <Button size="sm" variant="success" onClick={() => handleStatusChange(aluno.id, 'PRESENTE')}>
                              Presente
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => handleStatusChange(aluno.id, 'FALTA')}>
                              Falta
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleStatusChange(aluno.id, 'JUSTIFICADA')}>
                              Justificar
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-col gap-2 rounded-xl bg-bjj-gray-900/60 p-4 ring-1 ring-bjj-gray-700 md:flex-row md:items-center md:justify-between">
                  <div className="text-sm text-bjj-gray-200">
                    <p className="font-semibold text-white">Fechar treino</p>
                    <p>Marca pendentes como presentes e encerra a aula instância.</p>
                  </div>
                  <Button variant="primary" onClick={handleFecharAula} disabled={!currentAulaId}>
                    Fechar treino
                  </Button>
                </div>
              </>
            )}
          </section>
        ) : (
        <section className="rounded-2xl bg-bjj-gray-800/70 p-5 shadow-lg ring-1 ring-bjj-gray-700">
          <div className="flex flex-col gap-3 border-b border-bjj-gray-700 pb-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-bjj-gray-200">Operação pós-aula</p>
              <h2 className="text-xl font-semibold text-white">Pendências de aprovação</h2>
              <p className="text-sm text-bjj-gray-200">Revisão rápida de presenças pendentes no período.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Input
                type="date"
                value={pendenciasInicio}
                onChange={(e) => setPendenciasInicio(e.target.value)}
                className="w-full sm:w-auto"
              />
              <Input
                type="date"
                value={pendenciasFim}
                onChange={(e) => setPendenciasFim(e.target.value)}
                className="w-full sm:w-auto"
              />
              <div className="flex flex-wrap gap-1 text-xs">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setPendenciasInicio(formatRangeDate(-7));
                    setPendenciasFim(hoje());
                  }}
                >
                  Últimos 7 dias
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setPendenciasInicio(formatRangeDate(-30));
                    setPendenciasFim(hoje());
                  }}
                >
                  Últimos 30 dias
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const hojeData = hoje();
                    setPendenciasInicio(hojeData);
                    setPendenciasFim(hojeData);
                  }}
                >
                  Hoje
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 rounded-xl bg-bjj-gray-900/70 px-4 py-3 text-sm text-bjj-gray-200 ring-1 ring-bjj-gray-700 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-white">
              <AlertCircle size={16} className="text-yellow-300" />
              <span>Presenças pendentes: {pendencias.length}</span>
            </div>
            <span className="inline-flex items-center justify-center rounded-full bg-bjj-gray-800 px-3 py-1 text-xs text-bjj-gray-100">
              {formatDateBr(pendenciasInicio)} → {formatDateBr(pendenciasFim)}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {pendencias.length === 0 && (
              <p className="rounded-xl border border-dashed border-bjj-gray-700 bg-bjj-gray-900/60 px-4 py-3 text-bjj-gray-100">
                Nenhuma pendência no período selecionado.
              </p>
            )}
            {pendencias.map((item) => {
              const { presenca, turma, aula, aluno } = item;
              return (
                <div
                  key={presenca.id}
                  className="flex flex-col gap-3 rounded-xl border border-bjj-gray-700 bg-bjj-gray-900/60 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-white">{aluno.nome}</p>
                    <p className="text-sm text-bjj-gray-200">
                      {turma.nome} • {formatDateBr(presenca.data)} {aula ? `• ${aula.horaInicio}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
                    <StatusBadge status={presenca.status} />
                    <div className="flex flex-wrap gap-1">
                      <Button size="sm" variant="success" onClick={() => handlePendenciaStatus(presenca.id, 'PRESENTE')}>
                        Presente
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handlePendenciaStatus(presenca.id, 'FALTA')}>
                        Falta
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handlePendenciaStatus(presenca.id, 'JUSTIFICADA')}>
                        Justificar
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
