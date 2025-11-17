'use client';

import { useMemo, useState } from 'react';
import { CheckCircle, Clock3, Timer } from 'lucide-react';
import Button from '../../components/ui/Button';
import { usePresencasStore } from '../../store/presencasStore';
import { useTreinosStore } from '../../store/treinosStore';
import useUserStore from '../../store/userStore';

const normalizeWeekday = (date) =>
  new Date(date).toLocaleDateString('pt-BR', { weekday: 'long' }).replace('-feira', '').toLowerCase();

export default function CheckinPage() {
  const { user } = useUserStore();
  const alunoId = user?.alunoId;
  const hoje = new Date().toISOString().split('T')[0];
  const treinos = useTreinosStore((state) => state.treinos.filter((treino) => treino.ativo));
  const registerCheckin = usePresencasStore((state) => state.registerCheckin);
  const presencas = usePresencasStore((state) => state.presencas);
  const [feedback, setFeedback] = useState('');

  const diaSemana = normalizeWeekday(hoje);
  const treinosDoDia = useMemo(
    () => treinos.filter((treino) => treino.diaSemana === diaSemana),
    [diaSemana, treinos]
  );

  const checkinsDoAluno = useMemo(
    () => presencas.filter((p) => p.alunoId === alunoId && p.data === hoje),
    [alunoId, hoje, presencas]
  );

  const handleCheckin = (treino) => {
    const resultado = registerCheckin({
      alunoId,
      alunoNome: user?.name || 'Aluno',
      faixa: 'Branca',
      graus: 0,
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
      setFeedback('Registro enviado para aprovação por ter ocorrido após o horário de início.');
    } else if (resultado.status === 'fora_do_horario') {
      setFeedback('Fora do horário permitido. Tente novamente no horário do treino.');
    } else {
      setFeedback('Você já registrou presença para este treino.');
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
        <div className="rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/70 px-4 py-3 text-sm text-bjj-gray-200">
          <div className="flex items-center gap-2">
            <Timer size={16} className="text-bjj-red" />
            {hoje}
          </div>
        </div>
      </header>

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
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/70 px-3 py-2 text-sm text-bjj-gray-200">
          <CheckCircle size={16} className="text-bjj-red" /> {feedback}
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
    </div>
  );
}
