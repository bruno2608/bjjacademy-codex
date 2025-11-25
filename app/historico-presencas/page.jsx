'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarRange, Check, Clock3, History, Search, UserRound, X } from 'lucide-react';
import MultiSelectDropdown from '../../components/ui/MultiSelectDropdown';
import { usePresencasStore } from '../../store/presencasStore';
import { useAlunosStore } from '../../store/alunosStore';
import { useTreinosStore } from '../../store/treinosStore';
import { BjjBeltStrip } from '@/components/bjj/BjjBeltStrip';
import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils';
import { useCurrentStaff } from '@/hooks/useCurrentStaff';
import { normalizeAlunoStatus, normalizeFaixaSlug } from '@/lib/alunoStats';
import { calcularResumoPresencas } from '@/lib/presencasResumo';

const STATUS_OPTIONS = [
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'PRESENTE', label: 'Presente' },
  { value: 'FALTA', label: 'Falta' },
  { value: 'JUSTIFICADA', label: 'Justificada' },
];

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
  const { staff } = useCurrentStaff();
  const alunos = useAlunosStore((state) => state.alunos);
  const getAlunoById = useAlunosStore((state) => state.getAlunoById);
  const treinos = useTreinosStore((state) => state.treinos);
  const presencas = usePresencasStore((state) => state.presencas);
  const carregarTodas = usePresencasStore((state) => state.carregarTodas);
  const [meses, setMeses] = useState(buildMonthOptions().slice(0, 1).map((item) => item.value));
  const [search, setSearch] = useState('');
  const [faixasSelecionadas, setFaixasSelecionadas] = useState([]);
  const [statusesSelecionados, setStatusesSelecionados] = useState([]);
  const [treinosSelecionados, setTreinosSelecionados] = useState([]);

  useEffect(() => {
    carregarTodas();
  }, [carregarTodas]);

  const registros = useMemo(() => {
    const selecionados = meses.length ? meses : [];
    const termo = search.trim().toLowerCase();
    const faixasAtivas = faixasSelecionadas.includes('all') ? [] : faixasSelecionadas;
    const statusAtivos = statusesSelecionados.includes('all')
      ? []
      : statusesSelecionados.map((item) => normalizeAlunoStatus(item));
    const treinosAtivos = treinosSelecionados.includes('all') ? [] : treinosSelecionados;

    return presencas
      .map((item) => {
        const aluno = getAlunoById(item.alunoId);
        const faixaSlug = normalizeFaixaSlug(aluno?.faixaSlug || aluno?.faixa || '');
        const faixaConfig = getFaixaConfigBySlug(faixaSlug);
        const treino = treinos.find((treinoItem) => treinoItem.id === item.treinoId);
        return {
          ...item,
          alunoNome: aluno?.nome || 'Aluno(a)',
          faixaSlug,
          graus: aluno?.graus ?? faixaConfig?.grausMaximos ?? 0,
          treinoNome: treino?.nome || 'Sessão principal',
          treinoTipo: treino?.tipo || 'Treino',
          horario: treino?.hora || 'Horário a confirmar',
        };
      })
      .filter((item) => {
        if (!selecionados.length) return true;
        const data = item.data || '';
        const [ano, mes] = data.split('-');
        if (!ano || !mes) return false;
        const chave = `${ano}-${mes}`;
        return selecionados.includes(chave);
      })
      .filter((item) => {
        if (termo && !item.alunoNome.toLowerCase().includes(termo)) return false;
        if (faixasAtivas.length && !faixasAtivas.includes(item.faixaSlug)) return false;
        if (statusAtivos.length && !statusAtivos.includes(normalizeAlunoStatus(item.status))) return false;
        if (treinosAtivos.length && !treinosAtivos.includes(item.treinoId || '')) return false;
        return true;
      })
      .sort((a, b) => {
        const dataB = new Date(b.data || 0).getTime();
        const dataA = new Date(a.data || 0).getTime();
        return dataB - dataA;
      })
      .slice(0, 80);
  }, [faixasSelecionadas, getAlunoById, meses, presencas, search, statusesSelecionados, treinos, treinosSelecionados]);

  const statusTone = (status) => {
    switch (status) {
      case 'PRESENTE':
        return {
          label: 'Presente',
          tone: 'bg-green-600/15 text-green-200 ring-1 ring-inset ring-green-500/40',
          marker: 'bg-gradient-to-br from-green-400 to-emerald-500 text-bjj-gray-950',
          icon: Check,
        };
      case 'PENDENTE':
        return {
          label: 'Pendente',
          tone: 'bg-amber-500/15 text-amber-100 ring-1 ring-inset ring-amber-400/40',
          marker: 'bg-gradient-to-br from-amber-300 to-orange-400 text-bjj-gray-950',
          icon: Clock3,
        };
      case 'FALTA':
        return {
          label: 'Ausente',
          tone: 'bg-bjj-red/15 text-bjj-red ring-1 ring-inset ring-bjj-red/50',
          marker: 'bg-gradient-to-br from-bjj-red to-rose-500 text-white',
          icon: X,
        };
      case 'JUSTIFICADA':
        return {
          label: 'Justificada',
          tone: 'bg-indigo-500/20 text-indigo-100 ring-1 ring-inset ring-indigo-300/50',
          marker: 'bg-gradient-to-br from-indigo-400 to-violet-500 text-bjj-gray-950',
          icon: Clock3,
        };
      default:
        return {
          label: 'Sem registro',
          tone: 'bg-bjj-gray-800 text-bjj-gray-100 ring-1 ring-inset ring-bjj-gray-700',
          marker: 'bg-gradient-to-br from-bjj-gray-600 to-bjj-gray-500 text-white',
          icon: Clock3,
        };
    }
  };

  const faixaOptions = useMemo(() => {
    if (!alunos?.length) return [];
    const mapa = new Map();
    alunos.forEach((item) => {
      const slug = normalizeFaixaSlug(item.faixaSlug || item.faixa || '');
      if (slug && !mapa.has(slug)) {
        const config = getFaixaConfigBySlug(slug);
        mapa.set(slug, config?.nome || item.faixa || slug);
      }
    });
    return Array.from(mapa.entries()).map(([value, label]) => ({ value, label }));
  }, [alunos]);

  const treinoOptions = useMemo(() => {
    if (!treinos?.length) return [];
    return treinos.map((treino) => ({ value: treino.id, label: treino.nome || treino.tipo || 'Treino' }));
  }, [treinos]);

  const totais = useMemo(() => {
    const resumo = calcularResumoPresencas(registros);
    return {
      presentes: resumo.presentes,
      pendentes: resumo.pendentes,
      ausencias: resumo.faltas,
      total: registros.length,
    };
  }, [registros]);

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-200/80">Histórico</p>
        <h1 className="text-2xl font-semibold text-white">Presenças</h1>
        <p className="text-sm text-bjj-gray-50/90">
          {`Controle central para ${staff?.nome || 'instrutores'} acompanharem presenças confirmadas, pendentes e ausências.`}
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
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-bjj-gray-200/90">
              <span className="flex items-center gap-2"><UserRound size={16} /> Buscar aluno</span>
              <div className="flex items-center gap-2 rounded-xl border border-bjj-gray-800/80 bg-bjj-gray-900/70 px-3 py-2 text-sm text-bjj-gray-100">
                <Search size={14} className="text-bjj-gray-300" />
                <input
                  className="w-full bg-transparent text-sm text-white placeholder:text-bjj-gray-200/60 focus:outline-none"
                  placeholder="Nome ou e-mail"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </label>
            <MultiSelectDropdown
              label="Faixas"
              options={faixaOptions}
              values={faixasSelecionadas}
              onChange={setFaixasSelecionadas}
              placeholder="Todas as faixas"
            />
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <MultiSelectDropdown
              label="Status"
              options={STATUS_OPTIONS}
              values={statusesSelecionados}
              onChange={setStatusesSelecionados}
              placeholder="Todos os status"
            />
            <MultiSelectDropdown
              label="Treinos"
              options={treinoOptions}
              values={treinosSelecionados}
              onChange={setTreinosSelecionados}
              placeholder="Todos os treinos"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            {
              label: 'Presenças',
              value: totais.presentes,
              tone: 'from-green-500/35 via-emerald-500/20 to-green-400/10 text-green-50 border-green-500/40',
            },
            {
              label: 'Pendentes',
              value: totais.pendentes,
              tone: 'from-amber-400/35 via-orange-400/20 to-amber-300/10 text-amber-50 border-amber-400/50',
            },
            {
              label: 'Ausências',
              value: totais.ausencias,
              tone: 'from-bjj-red/35 via-rose-500/20 to-bjj-red/10 text-rose-50 border-bjj-red/50',
            },
          ].map((item) => (
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
            <div className="absolute left-9 top-6 h-[calc(100%-3rem)] w-[2px] bg-gradient-to-b from-emerald-400 via-amber-400 to-bjj-red/80 opacity-80" />
            <ul className="space-y-6">
              {registros.map((item) => {
                const tone = statusTone(item.status);
                const Icon = tone.icon;
                const faixaConfig = getFaixaConfigBySlug(item.faixaSlug || 'branca-adulto');
                const grauAtual = Number.isFinite(Number(item.graus))
                  ? Number(item.graus)
                  : faixaConfig?.grausMaximos ?? 0;
                return (
                  <li key={item.id} className="relative pl-16">
                    <div
                      className={`absolute left-9 top-1 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full text-white shadow-[0_12px_30px_rgba(0,0,0,0.45)] ${tone.marker}`}
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
                          <p className="text-base font-semibold text-white">{item.treinoNome}</p>
                          <p className="text-xs text-bjj-gray-100/85">{item.treinoTipo}</p>
                        </div>
                        <div className="flex flex-col items-end text-right text-xs text-bjj-gray-100/85">
                          <span className="font-semibold text-white">{item.horario}</span>
                          {item.origem && <span className="text-[11px] uppercase tracking-[0.18em] text-bjj-gray-200/80">{item.origem}</span>}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-col gap-2 text-xs text-bjj-gray-50">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full border border-bjj-gray-800 bg-bjj-gray-900/70 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-bjj-gray-100/85">{item.alunoNome}</span>
                          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-emerald-100">{item.turmaId ? `Turma ${item.turmaId}` : 'Sem turma'}</span>
                        </div>
                        {faixaConfig ? (
                          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-bjj-gray-800/80 bg-bjj-gray-900/70 px-3 py-1">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-bjj-gray-100/80">Faixa</span>
                            <span className="text-[11px] uppercase tracking-[0.18em] text-bjj-gray-100/90">{faixaConfig.nome}</span>
                            <div className="w-[108px] md:w-[128px]">
                              <BjjBeltStrip
                                config={faixaConfig}
                                grauAtual={grauAtual}
                                className="scale-[0.55] md:scale-[0.68] origin-left"
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-bjj-gray-300">Sem dados de faixa</span>
                        )}
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
