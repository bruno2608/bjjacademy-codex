'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarRange, History, UserRound } from 'lucide-react';
import MultiSelectDropdown from '../../components/ui/MultiSelectDropdown';
import { usePresencasStore } from '../../store/presencasStore';
import { useAlunosStore } from '../../store/alunosStore';
import useUserStore from '../../store/userStore';
import { ROLE_KEYS } from '../../config/roles';

const buildMonthOptions = () => {
  const months = [];
  const now = new Date();
  for (let i = 0; i < 12; i += 1) {
    const target = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}`;
    const label = target.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    months.push({ value, label });
  }
  return months;
};

export default function HistoricoPresencasPage() {
  const { user } = useUserStore();
  const { alunos } = useAlunosStore();
  const alunoId = user?.alunoId;
  const presencas = usePresencasStore((state) => state.presencas);
  const isAluno = user?.roles?.includes(ROLE_KEYS.aluno);
  const [meses, setMeses] = useState(buildMonthOptions().slice(0, 1).map((item) => item.value));
  const [alunoSelecionado, setAlunoSelecionado] = useState(alunoId || '');

  useEffect(() => {
    if (isAluno && alunoId) {
      setAlunoSelecionado(alunoId);
    }
  }, [alunoId, isAluno]);

  useEffect(() => {
    if (!isAluno && !alunoSelecionado && alunos?.length) {
      setAlunoSelecionado(alunos[0].id);
    }
  }, [alunos, alunoSelecionado, isAluno]);

  const registros = useMemo(() => {
    const selecionados = meses.length ? meses : [];
    const filtroAluno = alunoSelecionado || (isAluno ? alunoId : undefined);

    const filtrados = presencas.filter((item) => {
      if (isAluno && alunoId) return item.alunoId === alunoId;
      if (filtroAluno) return item.alunoId === filtroAluno;
      return true;
    });

    return filtrados
      .filter((item) => {
        if (!selecionados.length) return true;
        const [ano, mes] = item.data.split('-');
        const chave = `${ano}-${mes}`;
        return selecionados.includes(chave);
      })
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, 80);
  }, [alunoId, alunoSelecionado, isAluno, meses, presencas]);

  const statusTone = (status) => {
    switch (status) {
      case 'CONFIRMADO':
        return {
          label: 'Presente',
          tone: 'bg-green-600/15 text-green-200 ring-1 ring-inset ring-green-500/40',
          marker: 'bg-gradient-to-br from-green-400 to-emerald-500 text-bjj-gray-950'
        };
      case 'CHECKIN':
      case 'PENDENTE':
        return {
          label: 'Pendente',
          tone: 'bg-amber-500/15 text-amber-100 ring-1 ring-inset ring-amber-400/40',
          marker: 'bg-gradient-to-br from-amber-300 to-orange-400 text-bjj-gray-950'
        };
      case 'AUSENTE':
      case 'AUSENTE_JUSTIFICADA':
        return {
          label: 'Ausente',
          tone: 'bg-bjj-red/15 text-bjj-red ring-1 ring-inset ring-bjj-red/50',
          marker: 'bg-gradient-to-br from-bjj-red to-rose-500 text-white'
        };
      default:
        return {
          label: 'Sem registro',
          tone: 'bg-bjj-gray-800 text-bjj-gray-100 ring-1 ring-inset ring-bjj-gray-700',
          marker: 'bg-gradient-to-br from-bjj-gray-600 to-bjj-gray-500 text-white'
        };
    }
  };

  const alunoOptions = useMemo(() => {
    if (!alunos?.length) return [];
    return alunos.map((item) => ({ value: item.id, label: item.nome }));
  }, [alunos]);

  const totais = useMemo(() => {
    return registros.reduce(
      (acc, item) => {
        if (item.status === 'CONFIRMADO') acc.presentes += 1;
        if (item.status === 'PENDENTE' || item.status === 'CHECKIN') acc.pendentes += 1;
        if (item.status === 'AUSENTE' || item.status === 'AUSENTE_JUSTIFICADA') acc.ausencias += 1;
        acc.total += 1;
        return acc;
      },
      { presentes: 0, pendentes: 0, ausencias: 0, total: 0 }
    );
  }, [registros]);

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-300">Histórico</p>
        <h1 className="text-2xl font-semibold text-white">Presenças</h1>
        <p className="text-sm text-bjj-gray-100/90">
          Visualize presenças confirmadas, pendentes e ausências com filtros por mês.
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-4 text-sm text-bjj-gray-100">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-bjj-gray-400">
            <CalendarRange size={16} /> Meses
            <MultiSelectDropdown
              options={buildMonthOptions()}
              placeholder="Selecione meses"
              values={meses}
              onChange={setMeses}
            />
          </div>
          {!isAluno && alunoOptions.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bjj-gray-400">
                <UserRound size={16} /> Aluno
              </div>
              <select
                className="select select-bordered mt-2 w-full max-w-md bg-bjj-gray-950 text-sm text-white"
                value={alunoSelecionado}
                onChange={(event) => setAlunoSelecionado(event.target.value)}
              >
                {alunoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[{
            label: 'Presenças',
            value: totais.presentes,
            tone: 'from-green-600/30 via-green-500/10 to-emerald-400/5 text-green-100'
          }, {
            label: 'Pendentes',
            value: totais.pendentes,
            tone: 'from-amber-500/25 via-orange-400/15 to-amber-500/5 text-amber-50'
          }, {
            label: 'Ausências',
            value: totais.ausencias,
            tone: 'from-bjj-red/25 via-rose-500/15 to-bjj-red/5 text-rose-100'
          }].map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl border border-bjj-gray-800 bg-gradient-to-br ${item.tone} p-4 shadow-inner`}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-200/80">{item.label}</p>
              <p className="text-3xl font-bold leading-tight">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950/80">
        <div className="flex items-center justify-between border-b border-bjj-gray-800 px-4 py-3 text-sm font-semibold text-white">
          <div className="flex items-center gap-2">
            <History size={16} className="text-bjj-red" />
            Histórico recente
          </div>
          <span className="text-xs text-bjj-gray-100/70">Exibe os 80 registros mais recentes</span>
        </div>

        {registros.length === 0 ? (
          <div className="p-6 text-sm text-bjj-gray-100/80">Nenhum registro encontrado para os filtros atuais.</div>
        ) : (
          <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical px-6 py-6 text-sm text-bjj-gray-100">
            {registros.map((item, idx) => {
              const tone = statusTone(item.status);
              return (
                <li key={item.id}>
                  <div className="timeline-middle">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold uppercase tracking-wide shadow-[0_10px_25px_rgba(0,0,0,0.35)] ${tone.marker}`}
                    >
                      {tone.label}
                    </div>
                  </div>
                  <div
                    className={`timeline-${idx % 2 === 0 ? 'start' : 'end'} timeline-box mb-6 flex flex-col gap-2 rounded-2xl border border-bjj-gray-800/90 bg-bjj-gray-950/90 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.3)]`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.25em] text-bjj-gray-200/80">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-bjj-gray-200" />
                        {item.data}
                      </div>
                      <span
                        className={`badge border-0 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide ${tone.tone}`}
                      >
                        {tone.label}
                      </span>
                    </div>
                    <p className="text-base font-semibold text-white">{item.tipoTreino}</p>
                    <p className="text-xs text-bjj-gray-100/80">{item.hora || 'Horário a confirmar'}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-bjj-gray-100/80">
                      {item.treinoModalidade && (
                        <span className="badge badge-ghost border-bjj-gray-800 bg-bjj-gray-900/80 text-bjj-gray-100/90">
                          {item.treinoModalidade}
                        </span>
                      )}
                      {item.origem && (
                        <span className="badge badge-ghost border-bjj-gray-800 bg-bjj-gray-900/80 text-bjj-gray-100/90">
                          Origem: {item.origem}
                        </span>
                      )}
                    </div>
                  </div>
                  <hr className="border-bjj-gray-800/70" />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
