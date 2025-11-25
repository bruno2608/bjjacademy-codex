'use client';

import { useMemo, useState } from 'react';
import { CheckCircle, Clock3 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAlunosStore } from '../../store/alunosStore';
import { usePresencasStore } from '../../store/presencasStore';
import { useTreinosStore } from '../../store/treinosStore';
import useUserStore from '../../store/userStore';
import Modal from '../../components/ui/Modal';

const normalizeWeekday = (date) =>
  new Date(date).toLocaleDateString('pt-BR', { weekday: 'long' }).replace('-feira', '').toLowerCase();

const formatDate = (date) =>
  new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');

export default function CheckinPage() {
  const { user } = useUserStore();
  const alunoId = user?.alunoId;
  const getAlunoById = useAlunosStore((state) => state.getAlunoById);
  const hoje = new Date().toISOString().split('T')[0];
  const today = useMemo(() => new Date(), []);
  const treinos = useTreinosStore((state) => state.treinos.filter((treino) => treino.ativo));
  const registerCheckin = usePresencasStore((state) => state.registerCheckin);
  const presencas = usePresencasStore((state) => state.presencas);
  const isTreinoFechado = usePresencasStore((state) => state.isTreinoFechado);
  const [feedbackModal, setFeedbackModal] = useState({ open: false, title: '', message: '' });

  const diaSemana = normalizeWeekday(hoje);
  const treinosDoDia = useMemo(
    () => treinos.filter((treino) => treino.diaSemana === diaSemana),
    [diaSemana, treinos]
  );

  const checkinsDoAluno = useMemo(
    () => presencas.filter((p) => p.alunoId === alunoId && p.data === hoje),
    [alunoId, hoje, presencas]
  );

  const presenceByDay = useMemo(() => {
    const map = new Map();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    presencas.forEach((item) => {
      if (item.alunoId !== alunoId) return;
      const [ano, mes] = (item.data || '').split('-').map(Number);
      if (ano === year && mes === month) {
        const status = item.status;
        if (status === 'PRESENTE') {
          map.set(item.data, 'PRESENTE');
        } else if (status === 'PENDENTE') {
          if (!map.has(item.data)) {
            map.set(item.data, 'PENDENTE');
          }
        }
      }
    });
    return map;
  }, [alunoId, presencas, today]);

  const calendarDays = useMemo(() => {
    const month = today.getMonth();
    const year = today.getFullYear();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const firstWeekday = new Date(year, month, 1).getDay();
    const days = Array.from({ length: firstWeekday }, () => null);

    for (let day = 1; day <= totalDays; day += 1) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        day,
        status: presenceByDay.get(dateKey) || null
      });
    }
    return days;
  }, [presenceByDay, today]);

  const handleCheckin = (treino) => {
    const aluno = alunoId ? getAlunoById(alunoId) : null;
    const resultado = registerCheckin({
      alunoId,
      data: hoje,
      treinoId: treino.id,
      horaInicio: treino.hora,
      origem: aluno ? 'ALUNO' : undefined
    });

    if (resultado.status === 'fechado') {
      setFeedbackModal({ open: true, title: 'Check-in indisponível', message: 'Este treino já foi fechado pelo professor.' });
    } else if (resultado.status === 'duplicado') {
      setFeedbackModal({ open: true, title: 'Check-in já registrado', message: 'Você já enviou presença para este treino.' });
    } else if (resultado.status === 'checkin') {
      setFeedbackModal({
        open: true,
        title: 'Deu certo! Check-in enviado',
        message: 'Seu check-in foi enviado para análise do professor. Você será notificado após a aprovação.'
      });
    } else {
      setFeedbackModal({
        open: true,
        title: 'Deu certo! Enviado para análise',
        message: 'Seu check-in foi enviado para análise do professor.'
      });
    }
  };

  const pendentesHoje = useMemo(
    () => checkinsDoAluno.filter((item) => item.status === 'PENDENTE'),
    [checkinsDoAluno]
  );

  const horarioDoTreino = (treinoId) => treinos.find((treino) => treino.id === treinoId)?.hora || '--:--';

  const statusLabel = (status) => {
    switch (status) {
      case 'PENDENTE':
        return { label: 'EM ANÁLISE PELO PROFESSOR', tone: 'bg-yellow-500/20 text-yellow-200' };
      case 'PRESENTE':
        return { label: 'PRESENÇA CONFIRMADA', tone: 'bg-green-600/20 text-green-300' };
      case 'FALTA':
        return { label: 'AUSENTE', tone: 'bg-red-600/10 text-red-300' };
      default:
        return { label: 'NÃO REGISTRADO', tone: 'bg-bjj-gray-800 text-bjj-gray-200' };
    }
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-400">Check-in</p>
          <h1 className="text-2xl font-semibold">Treinos de hoje</h1>
          <p className="text-sm text-bjj-gray-300/80">Registre sua presença até 30 minutos após o início.</p>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-3">
          {treinosDoDia.map((treino) => {
            const registro = checkinsDoAluno.find((item) => item.treinoId === treino.id);
            const fechado = isTreinoFechado(hoje, treino.id);
            const statusInfo = statusLabel(registro?.status);
            return (
              <div
                key={treino.id}
                className="flex flex-col gap-3 rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{treino.nome}</p>
                  <p className="text-xs text-bjj-gray-300/80">
                    {treino.tipo} · {treino.hora}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusInfo.tone}`}
                  >
                    {statusInfo.label}
                  </span>
                  <Button
                    onClick={() => handleCheckin(treino)}
                    className="btn-sm"
                    type="button"
                    disabled={Boolean(registro) || fechado}
                  >
                    {registro ? 'Aguardando' : fechado ? 'Treino fechado' : 'Registrar check-in'}
                  </Button>
                </div>
              </div>
            );
          })}
          {pendentesHoje.length > 0 && (
            <div className="rounded-2xl border border-bjj-gray-800 bg-gradient-to-br from-bjj-gray-900 to-bjj-black p-4 text-sm text-bjj-gray-200 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">Pendências</p>
                  <h3 className="text-lg font-semibold text-white">Check-ins em análise</h3>
                </div>
                <span className="badge badge-warning badge-sm text-[10px] font-semibold uppercase tracking-wide text-bjj-gray-950 shadow">
                  {pendentesHoje.length} aguardando
                </span>
              </div>
              <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {pendentesHoje.map((item) => {
                  const treino = treinos.find((t) => t.id === item.treinoId);
                  const treinoNome = treino?.nome || 'Treino';
                  const treinoModalidade = treino?.tipo || 'Sessão';
                  const horario = treino?.hora || horarioDoTreino(item.treinoId);

                  return (
                    <li
                      key={item.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-white leading-tight">{treinoNome}</p>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">{treinoModalidade}</p>
                        <p className="text-[11px] text-bjj-gray-300">{`${formatDate(item.data)} · ${horario}`}</p>
                      </div>
                      <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-yellow-200">
                        Aguardando
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="calendar w-full rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/80 text-bjj-gray-100 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">Calendário</p>
                <p className="text-sm font-semibold capitalize">{today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="flex gap-1 text-[10px]">
                <span className="badge badge-outline border-green-500/40 text-green-300">Presente</span>
                <span className="badge badge-outline border-yellow-400/40 text-yellow-300">Pendente</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 px-3 pb-2 text-center text-[11px] uppercase text-bjj-gray-300">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((dia) => (
                <span key={dia}>{dia}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 px-3 pb-4">
              {calendarDays.map((entry, index) => {
                if (!entry) return <div key={`empty-${index}`} className="h-10" />;
                const statusStyle =
                  entry.status === 'PRESENTE'
                    ? 'border-green-500/50 bg-green-600/10 text-green-200'
                    : entry.status === 'PENDENTE'
                    ? 'border-yellow-400/50 bg-yellow-500/10 text-yellow-200'
                    : 'border-bjj-gray-800 bg-bjj-black/40 text-bjj-gray-200';
                return (
                  <div
                    key={entry.day}
                    className={`flex h-10 items-center justify-center rounded-lg border text-sm font-semibold ${statusStyle}`}
                  >
                    {entry.day}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-black/60 p-4 text-sm text-bjj-gray-200/80">
            <h3 className="mb-2 text-sm font-semibold text-white">Regras do check-in</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Você pode registrar o check-in até 30 minutos após o início do treino.</li>
              <li>Todo check-in é enviado para análise do professor.</li>
              <li>Um registro por treino. Você pode participar de mais de um treino por dia.</li>
            </ul>
          </div>
        </div>
      </div>

      <Modal
        isOpen={feedbackModal.open}
        title={feedbackModal.title}
        onClose={() => setFeedbackModal({ open: false, title: '', message: '' })}
      >
        <div className="flex items-start gap-3 text-sm text-bjj-gray-100">
          <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-bjj-red/10 text-bjj-red">
            <CheckCircle size={16} />
          </span>
          <p className="leading-relaxed">{feedbackModal.message}</p>
        </div>
      </Modal>

    </div>
  );
}
