'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  BarChart2,
  BarChart3,
  CalendarCheck,
  Clock3,
  Medal,
  PieChart,
  ShieldCheck,
  TrendingUp,
  Users
} from 'lucide-react';

import FaixaVisual from '../../components/graduacoes/FaixaVisual';
import useRole from '../../hooks/useRole';
import { usePresencasStore } from '../../store/presencasStore';
import { useAlunosStore } from '../../store/alunosStore';
import useUserStore from '../../store/userStore';
import { ROLE_KEYS } from '../../config/roles';

const cardBase = 'rounded-3xl border border-bjj-gray-800 bg-bjj-gray-900/70 shadow-[0_25px_60px_rgba(0,0,0,0.35)]';
const badge = 'text-xs uppercase tracking-[0.2em] text-bjj-gray-300/80';

function StatPill({ icon: Icon, title, value, accent }) {
  return (
    <div className={`${cardBase} flex items-center gap-4 border-bjj-gray-800/80 p-4`}>
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-bjj-gray-900/90 ${accent}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-bjj-gray-200/90">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function ProgressBar({ percent }) {
  return (
    <div className="mt-3 h-2 rounded-full bg-bjj-gray-800">
      <div className="h-full rounded-full bg-gradient-to-r from-bjj-red to-red-500" style={{ width: `${percent}%` }} />
    </div>
  );
}

function StudentDashboard() {
  const { user } = useUserStore();
  const alunoId = user?.alunoId;
  const presencas = usePresencasStore((state) => state.presencas);
  const alunos = useAlunosStore((state) => state.alunos);

  const aluno = useMemo(() => alunos.find((item) => item.id === alunoId) || alunos[0], [alunoId, alunos]);
  const faixaAtual = aluno?.faixa || 'Branca';
  const graus = aluno?.graus || 0;

  const stats = useMemo(() => {
    const registrosAluno = presencas.filter((item) => item.alunoId === aluno?.id);
    const presentes = registrosAluno.filter((item) => item.status === 'Presente').length;
    const faltas = registrosAluno.filter((item) => item.status === 'Ausente').length;
    const pendentes = registrosAluno.filter((item) => item.status === 'Pendente').length;
    return { presentes, faltas, pendentes };
  }, [aluno?.id, presencas]);

  const progressoProximoGrau = useMemo(() => {
    const aulasNoGrau = aluno?.aulasNoGrauAtual || 0;
    const alvo = 20;
    const percent = Math.min(100, Math.round((aulasNoGrau / alvo) * 100));
    return { aulasNoGrau, alvo, percent };
  }, [aluno?.aulasNoGrauAtual]);

  const ultimasPresencas = useMemo(
    () =>
      presencas
        .filter((item) => item.alunoId === aluno?.id)
        .slice(-5)
        .reverse(),
    [aluno?.id, presencas]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.7fr,1.1fr]">
        <div className={`${cardBase} bg-gradient-to-br from-bjj-gray-900 via-bjj-gray-900/60 to-bjj-black p-6`}>
          <p className={badge}>Dashboard do aluno</p>
          <div className="mt-3 flex flex-col gap-3 text-left">
            <h1 className="text-3xl font-semibold text-white">Bem-vindo, {aluno?.nome || 'Aluno'}!</h1>
            <p className="text-bjj-gray-200/85">Acompanhe sua jornada, evolua suas graduações e visualize suas últimas presenças.</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-bjj-gray-800/80 bg-bjj-black/60 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">Faixa</p>
              <p className="mt-1 text-lg font-semibold">{faixaAtual}</p>
            </div>
            <div className="rounded-2xl border border-bjj-gray-800/80 bg-bjj-black/60 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">Grau atual</p>
              <p className="mt-1 text-lg font-semibold">{graus}º grau</p>
            </div>
            <div className="rounded-2xl border border-bjj-gray-800/80 bg-bjj-black/60 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">Aulas</p>
              <p className="mt-1 text-lg font-semibold">{aluno?.aulasNoGrauAtual || 0} aulas</p>
            </div>
          </div>
        </div>

        <div className={`${cardBase} flex flex-col gap-4 bg-gradient-to-br from-bjj-gray-900 to-bjj-black p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-300/80">Sua faixa</p>
              <p className="text-lg font-semibold">Progresso do próximo grau</p>
            </div>
            <ShieldCheck className="text-bjj-red" size={18} />
          </div>
          <div className="flex items-center gap-4">
            <div className="shrink-0 rounded-2xl border border-bjj-gray-800/80 bg-bjj-black/60 p-3">
              <FaixaVisual faixa={faixaAtual} graus={graus} tamanho="xl" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-bjj-gray-200/90">{progressoProximoGrau.percent}% do próximo grau</p>
              <ProgressBar percent={progressoProximoGrau.percent} />
              <p className="mt-2 text-xs text-bjj-gray-300/80">
                {progressoProximoGrau.aulasNoGrau} de {progressoProximoGrau.alvo} aulas concluídas
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatPill icon={Activity} title="Presenças recentes" value={stats.presentes} accent="text-green-400" />
        <StatPill icon={BarChart2} title="Faltas registradas" value={stats.faltas} accent="text-bjj-red" />
        <StatPill icon={Clock3} title="Check-ins pendentes" value={stats.pendentes} accent="text-yellow-300" />
        <div className={`${cardBase} border-bjj-gray-800/80 p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-bjj-gray-200/90">Progresso do próximo grau</p>
              <p className="text-2xl font-bold text-white">{progressoProximoGrau.percent}%</p>
            </div>
            <Medal className="text-bjj-white" size={20} />
          </div>
          <ProgressBar percent={progressoProximoGrau.percent} />
        </div>
      </div>

      <div className={`${cardBase} p-6`}>
        <header className="mb-4 flex items-center justify-between">
          <div>
            <p className={badge}>Últimas presenças</p>
            <h3 className="text-xl font-semibold">Últimos registros</h3>
          </div>
          <Activity size={18} className="text-green-400" />
        </header>
        <ul className="divide-y divide-bjj-gray-800/70 text-sm">
          {ultimasPresencas.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-3 text-bjj-gray-100">
              <div>
                <p className="font-semibold text-white">{item.tipoTreino}</p>
                <p className="text-xs text-bjj-gray-300/80">{item.data} · {item.hora || '—'}</p>
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

function ProfessorDashboard() {
  const presencas = usePresencasStore((state) => state.presencas);
  const alunos = useAlunosStore((state) => state.alunos);
  const [activeTab, setActiveTab] = useState('visao');

  const metrics = useMemo(() => {
    const totalAlunos = alunos.length;
    const ativos = alunos.filter((a) => a.status === 'Ativo').length;
    const inativos = totalAlunos - ativos;
    const graduados = alunos.filter((a) => (a.faixa || '').toLowerCase() !== 'branca').length;
    const pendentes = presencas.filter((p) => p.status === 'Pendente').length;
    const presentesSemana = presencas.filter((p) => p.status === 'Presente').length;
    return { totalAlunos, ativos, inativos, graduados, pendentes, presentesSemana };
  }, [alunos, presencas]);

  const tabCards = useMemo(
    () => ({
      visao: [
        { title: 'Presenças hoje', value: metrics.presentesSemana, icon: CalendarCheck, tone: 'text-green-300' },
        { title: 'Registros pendentes', value: metrics.pendentes, icon: Clock3, tone: 'text-yellow-300' },
        { title: 'Faixas em progresso', value: metrics.graduados, icon: Medal, tone: 'text-white' },
        { title: 'Alunos ativos', value: metrics.ativos, icon: Users, tone: 'text-bjj-red' }
      ],
      alunos: [
        { title: 'Total de alunos', value: metrics.totalAlunos, icon: Users, tone: 'text-white' },
        { title: 'Alunos ativos', value: metrics.ativos, icon: Activity, tone: 'text-green-300' },
        { title: 'Inativos', value: metrics.inativos, icon: BarChart2, tone: 'text-yellow-300' },
        { title: 'Últimas matrículas', value: 4, icon: TrendingUp, tone: 'text-bjj-red' }
      ],
      presencas: [
        { title: 'Presenças na semana', value: metrics.presentesSemana, icon: CalendarCheck, tone: 'text-green-300' },
        { title: 'Pendentes de aprovação', value: metrics.pendentes, icon: Clock3, tone: 'text-yellow-300' },
        { title: 'Ausências', value: presencas.filter((p) => p.status === 'Ausente').length, icon: BarChart3, tone: 'text-bjj-red' },
        { title: 'Check-ins registrados', value: presencas.length, icon: Activity, tone: 'text-white' }
      ],
      graduacoes: [
        { title: 'Próximas graduações', value: alunos.filter((a) => a.proximaMeta).length || 6, icon: Medal, tone: 'text-white' },
        { title: 'Faixas avançadas', value: metrics.graduados, icon: ShieldCheck, tone: 'text-bjj-red' },
        { title: 'Tempo médio na faixa', value: '14 meses', icon: Clock3, tone: 'text-yellow-300' },
        { title: 'Relatórios emitidos', value: 12, icon: PieChart, tone: 'text-green-300' }
      ]
    }),
    [alunos, metrics, presencas]
  );

  return (
    <div className="space-y-6">
      <div className={`${cardBase} bg-gradient-to-br from-bjj-gray-900 via-bjj-gray-900/60 to-bjj-black p-6`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className={badge}>Visão geral</p>
            <h1 className="text-3xl font-semibold text-white">Painel principal da BJJ Academy</h1>
            <p className="text-sm text-bjj-gray-200/85">Monitore os módulos críticos e escolha a visão detalhada desejada.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:w-[360px]">
            <StatPill icon={CalendarCheck} title="Aulas na semana" value={metrics.presentesSemana} accent="text-green-300" />
            <StatPill icon={BarChart3} title="Histórico na semana" value={presencas.length} accent="text-yellow-300" />
            <StatPill icon={Users} title="Total de alunos" value={metrics.totalAlunos} accent="text-white" />
            <StatPill icon={Medal} title="Graduados" value={metrics.graduados} accent="text-bjj-red" />
          </div>
        </div>
      </div>

      <div className={`${cardBase} p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className={badge}>Painel da academia</p>
            <h3 className="text-xl font-semibold text-white">Resumo detalhado</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-full border border-bjj-gray-800 bg-bjj-gray-900/70 p-1">
            {[
              { key: 'visao', label: 'Visão Geral' },
              { key: 'alunos', label: 'Alunos' },
              { key: 'presencas', label: 'Presenças' },
              { key: 'graduacoes', label: 'Graduações' }
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? 'bg-bjj-red text-white shadow-[0_12px_30px_rgba(225,6,0,0.25)]'
                    : 'text-bjj-gray-200 hover:bg-bjj-gray-800'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {tabCards[activeTab].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-2xl border border-bjj-gray-800/80 bg-gradient-to-br from-bjj-gray-900 to-bjj-black p-4 shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-bjj-gray-200/90">{card.title}</p>
                    <p className="mt-1 text-3xl font-bold text-white">{card.value}</p>
                  </div>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-bjj-gray-900/80 ${card.tone}`}>
                    <Icon size={18} />
                  </span>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-bjj-gray-800">
                  <div className="h-full rounded-full bg-bjj-red/70" style={{ width: '75%' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isInstructor, isAdmin, roles } = useRole();
  const isProfessorLayout = isInstructor || isAdmin || roles.includes(ROLE_KEYS.professor) || roles.includes(ROLE_KEYS.instrutor);

  if (isProfessorLayout) {
    return <ProfessorDashboard />;
  }

  return <StudentDashboard />;
}
