'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarRange, History, Users } from 'lucide-react';
import MultiSelectDropdown from '../../../../components/ui/MultiSelectDropdown';
import { usePresencasStore } from '../../../../store/presencasStore';
import { useAlunosStore } from '../../../../store/alunosStore';
import useUserStore from '../../../../store/userStore';

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
  const presencas = usePresencasStore((state) => state.presencas);
  const alunos = useAlunosStore((state) => state.alunos);

  const firstAlunoId = alunos[0]?.id;
  const alunoPadrao = user?.alunoId && alunos.some((item) => item.id === user.alunoId) ? user.alunoId : firstAlunoId;

  const [alunoSelecionado, setAlunoSelecionado] = useState(alunoPadrao || '');
  const [meses, setMeses] = useState(buildMonthOptions().slice(0, 1).map((item) => item.value));

  useEffect(() => {
    if (alunoPadrao) {
      setAlunoSelecionado(alunoPadrao);
    }
  }, [alunoPadrao]);

  const registros = useMemo(() => {
    const selecionados = meses.length ? meses : [];
    return presencas
      .filter((item) => (alunoSelecionado ? item.alunoId === alunoSelecionado : true))
      .filter((item) => {
        if (!selecionados.length) return true;
        const [ano, mes] = item.data.split('-');
        const chave = `${ano}-${mes}`;
        return selecionados.includes(chave);
      })
      .slice(-60)
      .reverse();
  }, [alunoSelecionado, meses, presencas]);

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-400">Histórico</p>
        <h1 className="text-2xl font-semibold">Presenças por aluno</h1>
        <p className="text-sm text-bjj-gray-300/80">Filtre por estudante, mês e acompanhe solicitações pendentes.</p>
      </header>

      <div className="flex flex-wrap gap-3 rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-4 text-sm text-bjj-gray-200">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bjj-gray-400">
          <Users size={16} /> Aluno
        </div>
        <select
          className="select select-bordered select-sm w-full max-w-xs bg-bjj-gray-900 text-bjj-gray-100"
          value={alunoSelecionado}
          onChange={(event) => setAlunoSelecionado(event.target.value)}
        >
          {alunos.map((aluno) => (
            <option key={aluno.id} value={aluno.id}>
              {aluno.nome}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bjj-gray-400">
          <CalendarRange size={16} /> Meses
        </div>
        <MultiSelectDropdown
          options={buildMonthOptions()}
          placeholder="Selecione meses"
          values={meses}
          onChange={setMeses}
        />
      </div>

      <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70">
        <div className="flex items-center justify-between border-b border-bjj-gray-800 px-4 py-3 text-sm font-semibold text-white">
          <div className="flex items-center gap-2">
            <History size={16} className="text-bjj-red" />
            Histórico recente
          </div>
          <span className="text-xs text-bjj-gray-300/80">Limitado para evitar carga excessiva</span>
        </div>
        <ul className="divide-y divide-bjj-gray-800 text-sm">
          {registros.map((item) => (
            <li key={item.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-semibold text-white">{item.tipoTreino}</p>
                <p className="text-xs text-bjj-gray-400">{item.data}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                  item.status === 'Presente'
                    ? 'bg-green-600/20 text-green-300'
                    : item.status === 'Pendente'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : item.status === 'Cancelado'
                    ? 'bg-bjj-gray-700 text-bjj-gray-200'
                    : 'bg-bjj-red/20 text-bjj-red'
                }`}
              >
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
