'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarRange, Check, Clock3, History, UserRound, X } from 'lucide-react';
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
          marker: 'bg-gradient-to-br from-green-400 to-emerald-500 text-bjj-gray-950',
          icon: Check
        };
      case 'CHECKIN':
      case 'PENDENTE':
        return {
          label: 'Pendente',
          tone: 'bg-amber-500/15 text-amber-100 ring-1 ring-inset ring-amber-400/40',
          marker: 'bg-gradient-to-br from-amber-300 to-orange-400 text-bjj-gray-950',
          icon: Clock3
        };
      case 'AUSENTE':
      case 'AUSENTE_JUSTIFICADA':
        return {
          label: 'Ausente',
          tone: 'bg-bjj-red/15 text-bjj-red ring-1 ring-inset ring-bjj-red/50',
          marker: 'bg-gradient-to-br from-bjj-red to-rose-500 text-white',
          icon: X
        };
      default:
        return {
          label: 'Sem registro',
          tone: 'bg-bjj-gray-800 text-bjj-gray-100 ring-1 ring-inset ring-bjj-gray-700',
          marker: 'bg-gradient-to-br from-bjj-gray-600 to-bjj-gray-500 text-white',
          icon: Clock3
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
        <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-200/80">Histórico</p>
        <h1 className="text-2xl font-semibold text-white">Presenças</h1>
        <p className="text-sm text-bjj-gray-50/90">
          Visualize presenças confirmadas, pendentes e ausências com filtros por mês.
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-bjj-gray-800/70 bg-gradient-to-br from-bjj-gray-900 via-bjj-gray-950 to-bjj-gray-900/90 p-4 text-sm text-bjj-gray-50">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-bjj-gray-200/90">
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
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bjj-gray-200/90">
                <UserRound size={16} /> Aluno
              </div>
              <select
                className="select select-bordered mt-2 w-full max-w-md border-bjj-gray-700 bg-bjj-gray-925 text-sm text-white shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
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
            tone: 'from-green-500/35 via-emerald-500/20 to-green-400/10 text-green-50 border-green-500/40'
          }, {
            label: 'Pendentes',
            value: totais.pendentes,
            tone: 'from-amber-400/35 via-orange-400/20 to-amber-300/10 text-amber-50 border-amber-400/50'
          }, {
            label: 'Ausências',
            value: totais.ausencias,
            tone: 'from-bjj-red/35 via-rose-500/20 to-bjj-red/10 text-rose-50 border-bjj-red/50'
          }].map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl border bg-gradient-to-br ${item.tone} p-4 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur`}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-100/90">{item.label}</p>
              <p className="text-3xl font-bold leading-tight text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-950/80 shadow-[0_16px_50px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between border-b border-bjj-gray-800/70 px-4 py-3 text-sm font-semibold text-white">
          <div className="flex items-center gap-2">
            <History size={16} className="text-bjj-red" />
            Histórico recente
          </div>
          <span className="text-xs text-bjj-gray-100/80">Exibe os 80 registros mais recentes</span>
        </div>

        {registros.length === 0 ? (
          <div className="p-6 text-sm text-bjj-gray-100/90">Nenhum registro encontrado para os filtros atuais.</div>
        ) : (
          <div className="relative px-4 pb-6 pt-4 text-sm text-bjj-gray-50">
            <div className="absolute left-[27px] top-6 h-[calc(100%-3rem)] w-[2px] bg-gradient-to-b from-emerald-400 via-amber-400 to-bjj-red/80 opacity-80" />
            <ul className="space-y-6">
              {registros.map((item) => {
                const tone = statusTone(item.status);
                const Icon = tone.icon;
                return (
                  <li key={item.id} className="relative pl-16">
                    <div
                      className={`absolute left-1 top-1 flex h-11 w-11 items-center justify-center rounded-full text-white shadow-[0_12px_30px_rgba(0,0,0,0.45)] ${tone.marker}`}
                    >
                      <Icon size={18} strokeWidth={3} />
                    </div>
                    <div className="rounded-2xl border border-bjj-gray-800/70 bg-gradient-to-br from-bjj-gray-900 via-bjj-gray-950 to-bjj-gray-900/85 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.35)]">
                      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[0.25em] text-bjj-gray-50/80">
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                          {item.data}
                        </div>
                        <span
                          className={`badge border-0 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide ${tone.tone}`}
                        >
                          {tone.label}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-white">{item.tipoTreino}</p>
                          <p className="text-xs text-bjj-gray-100/85">{item.treinoModalidade || 'Treino livre'}</p>
                        </div>
                        <div className="flex flex-col items-end text-right text-xs text-bjj-gray-100/85">
                          <span className="font-semibold text-white">{item.hora || 'Horário a confirmar'}</span>
                          {item.origem && <span className="text-[11px] uppercase tracking-[0.18em] text-bjj-gray-200/80">{item.origem}</span>}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-bjj-gray-50">
                        <span className="rounded-full border border-bjj-gray-800 bg-bjj-gray-900/70 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-bjj-gray-100/85">{item.alunoNome || 'Aluno(a)'}</span>
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-emerald-100">{item.turmaId ? `Turma ${item.turmaId}` : 'Sem turma'}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
