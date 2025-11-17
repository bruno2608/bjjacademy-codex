'use client';

import { useMemo, useState } from 'react';
import { CheckCircle, Timer, Users } from 'lucide-react';
import Button from '../../../components/ui/Button';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import { usePresencasStore } from '../../../store/presencasStore';
import { useTreinosStore } from '../../../store/treinosStore';
import { useAlunosStore } from '../../../store/alunosStore';
import useUserStore from '../../../store/userStore';
import useRole from '../../../hooks/useRole';

const normalizeWeekday = (date) =>
  new Date(date).toLocaleDateString('pt-BR', { weekday: 'long' }).replace('-feira', '').toLowerCase();

export default function CheckinPage() {
  const hoje = new Date().toISOString().split('T')[0];
  const { user } = useUserStore();
  const { isStudent } = useRole();
  const alunoId = user?.alunoId;

  const treinos = useTreinosStore((state) => state.treinos.filter((treino) => treino.ativo));
  const presencas = usePresencasStore((state) => state.presencas);
  const registerCheckin = usePresencasStore((state) => state.registerCheckin);
  const approveCheckin = usePresencasStore((state) => state.approveCheckin);
  const rejectCheckin = usePresencasStore((state) => state.rejectCheckin);
  const cancelarTreinoDoDia = usePresencasStore((state) => state.cancelarTreinoDoDia);
  const alunos = useAlunosStore((state) => state.alunos);

  const [feedback, setFeedback] = useState('');
  const [cancelTarget, setCancelTarget] = useState(null);

  const alunoAtual = alunos.find((item) => item.id === alunoId);
  const diaSemana = normalizeWeekday(hoje);

  const treinosDoDia = useMemo(
    () => treinos.filter((treino) => treino.diaSemana === diaSemana),
    [diaSemana, treinos]
  );

  const checkinsDoDia = useMemo(
    () => presencas.filter((p) => p.data === hoje),
    [hoje, presencas]
  );

  const checkinsDoAluno = useMemo(
    () => checkinsDoDia.filter((p) => p.alunoId === alunoId),
    [alunoId, checkinsDoDia]
  );

  const handleCheckin = (treino) => {
    const resultado = registerCheckin({
      alunoId,
      alunoNome: alunoAtual?.nome || user?.name || 'Aluno',
      faixa: alunoAtual?.faixa || 'Branca',
      graus: alunoAtual?.graus || 0,
      data: hoje,
      hora: null,
      treinoId: treino.id,
      tipoTreino: treino.nome,
      treinoModalidade: treino.tipo,
      horaInicio: treino.hora
    });

    if (resultado.status === 'registrado') {
      setFeedback('Check-in confirmado automaticamente. Boa aula!');
    } else if (resultado.status === 'pendente') {
      setFeedback('Fora do horário. Check-in enviado para aprovação do professor.');
    } else {
      setFeedback('Você já registrou presença para este treino.');
    }
  };

  const pendentes = useMemo(
    () => checkinsDoDia.filter((item) => item.status === 'Pendente'),
    [checkinsDoDia]
  );

  const handleCancel = () => {
    if (!cancelTarget) return;
    cancelarTreinoDoDia(hoje, cancelTarget.id);
    setCancelTarget(null);
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-400">Check-in</p>
          <h1 className="text-2xl font-semibold">Treinos de hoje</h1>
          <p className="text-sm text-bjj-gray-300/80">
            Registre presenças até 30 minutos após o início. Fora do horário, ficará pendente para aprovação.
          </p>
        </div>
        <div className="rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/70 px-4 py-3 text-sm text-bjj-gray-200">
          <div className="flex items-center gap-2">
            <Timer size={16} className="text-bjj-red" />
            {hoje}
          </div>
        </div>
      </header>

      {isStudent ? (
        <div className="space-y-3">
          {treinosDoDia.map((treino) => {
            const registro = checkinsDoAluno.find((item) => item.treinoId === treino.id);
            const status = registro?.status || 'Não registrado';
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
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                      status === 'Presente'
                        ? 'bg-green-600/20 text-green-300'
                        : status === 'Pendente'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-bjj-gray-800 text-bjj-gray-200'
                    }`}
                  >
                    {status}
                  </span>
                  <Button
                    onClick={() => handleCheckin(treino)}
                    className="btn-sm"
                    type="button"
                    disabled={status === 'Presente' || status === 'Pendente'}
                  >
                    {status === 'Presente' ? 'Confirmado' : status === 'Pendente' ? 'Aguardando' : 'Registrar check-in'}
                  </Button>
                </div>
              </div>
            );
          })}

          {feedback && (
            <div className="flex items-center gap-2 rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/70 px-3 py-2 text-sm text-bjj-gray-200">
              <CheckCircle size={16} className="text-bjj-red" /> {feedback}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-4 text-sm text-bjj-gray-200">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bjj-gray-400">
                <Users size={16} />
                Check-ins pendentes ({pendentes.length})
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">Somente hoje</span>
            </div>

            <div className="mt-3 space-y-3">
              {pendentes.length === 0 && (
                <p className="text-sm text-bjj-gray-300/80">Nenhum pedido aguardando aprovação.</p>
              )}

              {pendentes.map((registro) => (
                <div
                  key={registro.id}
                  className="flex flex-col gap-2 rounded-xl border border-bjj-gray-800/80 bg-bjj-gray-900/80 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{registro.alunoNome}</p>
                    <p className="text-xs text-bjj-gray-300/80">
                      {registro.tipoTreino} · {registro.horaInicio || registro.hora || '—'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button onClick={() => approveCheckin(registro.id)} className="btn-sm" variant="primary" type="button">
                      Aprovar
                    </Button>
                    <Button
                      onClick={() => rejectCheckin(registro.id)}
                      className="btn-sm"
                      variant="ghost"
                      type="button"
                    >
                      Negar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {treinosDoDia.map((treino) => {
              const registrosTreino = checkinsDoDia.filter((item) => item.treinoId === treino.id);
              const resumo = {
                presentes: registrosTreino.filter((item) => item.status === 'Presente').length,
                pendentes: registrosTreino.filter((item) => item.status === 'Pendente').length,
                cancelados: registrosTreino.filter((item) => item.status === 'Cancelado').length
              };

              return (
                <div
                  key={treino.id}
                  className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-4 text-sm text-bjj-gray-200"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{treino.nome}</p>
                      <p className="text-xs text-bjj-gray-300/80">
                        {treino.tipo} · {treino.hora}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-green-600/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-green-300">
                        {resumo.presentes} presentes
                      </span>
                      <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-yellow-300">
                        {resumo.pendentes} pendentes
                      </span>
                      <span className="rounded-full bg-bjj-gray-800 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-bjj-gray-200">
                        {resumo.cancelados} cancelados
                      </span>
                      <Button
                        className="btn-sm"
                        variant="ghost"
                        type="button"
                        onClick={() => setCancelTarget(treino)}
                      >
                        Cancelar treino
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-black/60 p-4 text-sm text-bjj-gray-200/80">
        <h3 className="mb-2 text-sm font-semibold text-white">Regras do check-in</h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>Check-in automático até 30 minutos após o início do treino.</li>
          <li>Fora do horário, o pedido vai para aprovação do professor.</li>
          <li>Um registro por treino. Você pode marcar mais de um treino no mesmo dia.</li>
        </ul>
      </div>

      {cancelTarget ? (
        <ConfirmDialog
          open={Boolean(cancelTarget)}
          title="Cancelar treino do dia"
          description={`Ao cancelar, nenhum aluno receberá falta para ${cancelTarget.nome}.`}
          onCancel={() => setCancelTarget(null)}
          onConfirm={handleCancel}
          confirmText="Cancelar treino"
        />
      ) : null}
    </div>
  );
}
