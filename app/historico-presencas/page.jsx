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
        return { label: 'Presente', tone: 'bg-green-600/20 text-green-300' };
      case 'CHECKIN':
      case 'PENDENTE':
        return { label: 'Pendente', tone: 'bg-yellow-500/20 text-yellow-300' };
      case 'AUSENTE':
      case 'AUSENTE_JUSTIFICADA':
        return { label: 'Ausente', tone: 'bg-bjj-red/20 text-bjj-red' };
      default:
        return { label: 'Sem registro', tone: 'bg-bjj-gray-700 text-bjj-gray-200' };
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
        <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-400">Histórico</p>
        <h1 className="text-2xl font-semibold">Presenças</h1>
        <p className="text-sm text-bjj-gray-300/80">Visualize presenças confirmadas, pendentes e ausências com filtros por mês.</p>
      </header>

      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-4 text-sm text-bjj-gray-200">
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
            tone: 'from-green-600/20 to-green-500/10 text-green-200'
          }, {
            label: 'Pendentes',
            value: totais.pendentes,
            tone: 'from-amber-500/25 to-amber-500/10 text-amber-100'
          }, {
            label: 'Ausências',
            value: totais.ausencias,
            tone: 'from-bjj-red/25 to-bjj-red/10 text-bjj-red'
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

      <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70">
        <div className="flex items-center justify-between border-b border-bjj-gray-800 px-4 py-3 text-sm font-semibold text-white">
          <div className="flex items-center gap-2">
            <History size={16} className="text-bjj-red" />
            Histórico recente
          </div>
          <span className="text-xs text-bjj-gray-300/80">Exibe os 80 registros mais recentes</span>
        </div>

        {registros.length === 0 ? (
          <div className="p-6 text-sm text-bjj-gray-300">Nenhum registro encontrado para os filtros atuais.</div>
        ) : (
          <ul className="timeline timeline-vertical px-6 py-4 text-sm">
            {registros.map((item, idx) => {
              const tone = statusTone(item.status);
              return (
                <li key={item.id}>
                  <div className="timeline-middle">
                    <span
                      className={`badge badge-sm border-0 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide ${tone.tone}`}
                    >
                      {tone.label}
                    </span>
                  </div>
                  <div className={`timeline-${idx % 2 === 0 ? 'start' : 'end'} mb-6 flex flex-col gap-1 rounded-2xl border border-bjj-gray-800/80 bg-bjj-gray-950/70 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.3)]`}>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-bjj-gray-400">{item.data}</p>
                    <p className="text-base font-semibold text-white">{item.tipoTreino}</p>
                    <p className="text-xs text-bjj-gray-300/80">{item.hora || 'Horário a confirmar'}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-bjj-gray-300/80">
                      {item.treinoModalidade && <span className="badge badge-ghost border-bjj-gray-800 bg-bjj-gray-900/80">{item.treinoModalidade}</span>}
                      {item.origem && <span className="badge badge-ghost border-bjj-gray-800 bg-bjj-gray-900/80">Origem: {item.origem}</span>}
                    </div>
                  </div>
                  <hr className="border-bjj-gray-800" />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
