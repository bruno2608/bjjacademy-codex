'use client';

import { useMemo, useState } from 'react';
import { CalendarRange, History } from 'lucide-react';
import MultiSelectDropdown from '../../components/ui/MultiSelectDropdown';
import { usePresencasStore } from '../../store/presencasStore';
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
  const alunoId = user?.alunoId;
  const presencas = usePresencasStore((state) => state.presencas);
  const isAluno = user?.roles?.includes(ROLE_KEYS.aluno);
  const [meses, setMeses] = useState(buildMonthOptions().slice(0, 1).map((item) => item.value));

  const registros = useMemo(() => {
    const filtrados = isAluno && alunoId ? presencas.filter((item) => item.alunoId === alunoId) : presencas;
    const selecionados = meses.length ? meses : [];
    return filtrados
      .filter((item) => {
        if (!selecionados.length) return true;
        const [ano, mes] = item.data.split('-');
        const chave = `${ano}-${mes}`;
        return selecionados.includes(chave);
      })
      .slice(-60)
      .reverse();
  }, [alunoId, isAluno, meses, presencas]);

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

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-400">Histórico</p>
        <h1 className="text-2xl font-semibold">Presenças</h1>
        <p className="text-sm text-bjj-gray-300/80">Últimos registros com filtro por mês (até 1 ano atrás).</p>
      </header>

      <div className="flex flex-wrap gap-3 rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-4 text-sm text-bjj-gray-200">
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
              {(() => {
                const tone = statusTone(item.status);
                return (
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${tone.tone}`}
              >
                {tone.label}
              </span>
                );
              })()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
