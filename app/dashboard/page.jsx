'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
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
  Users,
  ArrowRight
} from 'lucide-react';

import useRole from '../../hooks/useRole';
import { usePresencasStore } from '../../store/presencasStore';
import { useAlunosStore } from '../../store/alunosStore';
import useUserStore from '../../store/userStore';
import { ROLE_KEYS } from '../../config/roles';
import FaixaVisual from '../../components/graduacoes/FaixaVisual';

const cardBase = 'rounded-3xl border border-bjj-gray-800 bg-bjj-gray-900/70 shadow-[0_25px_60px_rgba(0,0,0,0.35)]';
const badge = 'text-xs uppercase tracking-[0.2em] text-bjj-gray-300/80';
const defaultAvatar = 'https://ui-avatars.com/api/?background=1b1b1b&color=fff&name=BJJ+Academy';

const ensureAvatar = (name, avatarUrl) =>
  avatarUrl || `https://ui-avatars.com/api/?background=111111&color=fff&bold=true&name=${encodeURIComponent(name || 'BJJ')}`;

const getFaixaPalette = (faixa) => {
  const palette = {
    Branca: { from: '#e5e7eb', to: '#d1d5db', stripe: '#f3f4f6' },
    Azul: { from: '#3b82f6', to: '#1d4ed8', stripe: '#dbeafe' },
    Roxa: { from: '#8b5cf6', to: '#6d28d9', stripe: '#ede9fe' },
    Marrom: { from: '#d97706', to: '#92400e', stripe: '#fef3c7' },
    Preta: { from: '#737373', to: '#171717', stripe: '#e5e5e5' }
  };
  return palette[faixa] || { from: '#f31212', to: '#b91c1c', stripe: '#fee2e2' };
};

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

function ProfileBadge({ name, faixa, grau, aulas, alvo = 20, avatarUrl }) {
  const label = grau ? `${faixa} · ${grau}º grau` : faixa;
  const percent = Math.min(100, Math.round(((aulas || 0) / alvo) * 100));
  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-bjj-gray-800/80 bg-bjj-black/40 p-4 shadow-inner sm:max-w-sm">
      <div className="flex items-center gap-4">
        <div className="avatar">
          <div className="w-16 rounded-full ring ring-bjj-red/70 ring-offset-2 ring-offset-bjj-gray-950">
            <img src={avatarUrl || defaultAvatar} alt={`Avatar de ${name}`} loading="lazy" />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-tight">{name}</p>
          <p className="text-xs text-bjj-gray-300/80">{label}</p>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">
          <span>Progresso</span>
          <span>{aulas} aulas</span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-bjj-gray-800">
          <div className="h-full rounded-full bg-gradient-to-r from-bjj-red to-red-500" style={{ width: `${percent}%` }} />
        </div>
      </div>
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
  const avatarUrl = ensureAvatar(aluno?.nome, aluno?.avatarUrl || user?.avatarUrl || defaultAvatar);

  const stats = useMemo(() => {
    const registrosAluno = presencas.filter((item) => item.alunoId === aluno?.id);
    const presentes = registrosAluno.filter((item) => item.status === 'CONFIRMADO').length;
    const faltas = registrosAluno.filter((item) => item.status === 'AUSENTE' || item.status === 'AUSENTE_JUSTIFICADA').length;
    const pendentes = registrosAluno.filter((item) => item.status === 'CHECKIN' || item.status === 'PENDENTE').length;
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

  const formatStatus = (status) => {
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
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.6fr,1fr]">
        <div className={`${cardBase} relative overflow-hidden bg-gradient-to-br from-bjj-gray-900/90 via-bjj-gray-900/70 to-bjj-black p-0`}>
          <div className="absolute inset-0 bg-gradient-to-r from-bjj-black/80 via-bjj-black/35 to-transparent" />
          <div className="relative flex w-full flex-col gap-4 px-6 py-6">
            <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <p className={badge}>Dashboard do aluno</p>
                <h1 className="text-xl font-semibold text-white leading-tight">{aluno?.nome || 'Aluno'}</h1>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
              <ProfileBadge
                name={aluno?.nome || 'Aluno'}
                faixa={faixaAtual}
                grau={graus}
                aulas={aluno?.aulasNoGrauAtual || 0}
                alvo={progressoProximoGrau.alvo}
                avatarUrl={avatarUrl}
              />
            </div>
          </div>
        </div>

        <div className={`${cardBase} flex flex-col gap-4 bg-gradient-to-br from-bjj-gray-900 to-bjj-black p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-300/80">Sua faixa</p>
              <p className="text-lg font-semibold">Progresso do próximo grau</p>
            </div>
            <ShieldCheck className="text-bjj-red" size={18} />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">
            <span className="rounded-full bg-bjj-gray-900/60 px-3 py-1 font-semibold text-white">Faixa: {faixaAtual}</span>
            <span className="rounded-full bg-bjj-gray-900/60 px-3 py-1 font-semibold text-white">Grau: {graus}º</span>
            <span className="rounded-full bg-bjj-gray-900/60 px-3 py-1 font-semibold text-white">
              {progressoProximoGrau.aulasNoGrau} aulas no grau
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="shrink-0 rounded-2xl border border-bjj-gray-800/80 bg-bjj-black/60 p-3 shadow-inner">
              <FaixaVisual faixa={faixaAtual} graus={graus} tamanho="lg" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col gap-1 text-bjj-gray-200/90 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold">{progressoProximoGrau.percent}% do próximo grau</p>
                <p className="text-xs text-bjj-gray-300/80">
                  {progressoProximoGrau.aulasNoGrau} de {progressoProximoGrau.alvo} aulas concluídas
                </p>
              </div>
              <div className="relative h-6 overflow-hidden rounded-full bg-bjj-gray-900/70 ring-1 ring-inset ring-bjj-gray-800/80">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background:
                      'repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 10px, transparent 10px, transparent 20px)'
                  }}
                />
                <div
                  className="absolute inset-y-0 left-0 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.45)]"
                  style={{
                    width: `${Math.max(progressoProximoGrau.percent, 12)}%`,
                    background: `linear-gradient(to right, ${getFaixaPalette(faixaAtual).from}, ${getFaixaPalette(faixaAtual).to})`
                  }}
                />
                {Array.from({ length: Math.min(graus || 0, 4) }).map((_, index) => (
                  <span
                    key={index}
                    className="absolute top-1 bottom-1 w-2 rounded-sm shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
                    style={{
                      left: `calc(${Math.min(Math.max(progressoProximoGrau.percent, 12), 96)}% - ${(index + 1) * 12}px)`,
                      background: `linear-gradient(to bottom, ${getFaixaPalette(faixaAtual).stripe}, #d1d5db)`
                    }}
                  />
                ))}
              </div>
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

      <div className="grid gap-3 md:grid-cols-3">
        {[
          {
            title: 'Aulas no grau',
            value: progressoProximoGrau.aulasNoGrau,
            helper: `meta de ${progressoProximoGrau.alvo} aulas`,
            href: '/evolucao',
            tone: 'from-bjj-gray-900/80 to-bjj-black/90',
            badgeTone: 'text-bjj-gray-300'
          },
          {
            title: 'Presenças',
            value: stats.presentes,
            helper: 'últimos registros confirmados',
            href: '/historico-presencas',
            tone: 'from-bjj-gray-900/85 to-bjj-black/80',
            badgeTone: 'text-green-300'
          },
          {
            title: 'Pendências',
            value: stats.pendentes,
            helper: 'aguardando aprovação',
            href: '/presencas',
            tone: 'from-bjj-gray-900/80 to-bjj-black/85',
            badgeTone: 'text-yellow-300'
          }
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={`${cardBase} group flex items-center justify-between gap-4 border-bjj-gray-800/80 bg-gradient-to-br ${item.tone} p-4 transition hover:-translate-y-0.5 hover:border-bjj-red/60 hover:shadow-[0_18px_45px_rgba(225,6,0,0.18)]`}
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-bjj-gray-200/90">{item.title}</p>
              <p className="text-3xl font-bold text-white">{item.value}</p>
              <p className={`text-xs ${item.badgeTone}`}>{item.helper}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-bjj-gray-800/80 text-white group-hover:bg-bjj-red group-hover:text-white">
              <ArrowRight size={16} />
            </div>
          </Link>
        ))}
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
              {(() => {
                const tone = formatStatus(item.status);
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

function ProfessorDashboard() {
  const { user } = useUserStore();
  const presencas = usePresencasStore((state) => state.presencas);
  const alunos = useAlunosStore((state) => state.alunos);
  const [activeTab, setActiveTab] = useState('visao');
  const instructorName = user?.name || 'Instrutor';
  const instructorAvatar = user?.avatarUrl || defaultAvatar;

  const metrics = useMemo(() => {
    const totalAlunos = alunos.length;
    const ativos = alunos.filter((a) => a.status === 'Ativo').length;
    const inativos = totalAlunos - ativos;
    const graduados = alunos.filter((a) => (a.faixa || '').toLowerCase() !== 'branca').length;
    const pendentes = presencas.filter((p) => p.status === 'PENDENTE' || p.status === 'CHECKIN').length;
    const presentesSemana = presencas.filter((p) => p.status === 'CONFIRMADO').length;
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
      <div className={`${cardBase} bg-gradient-to-br from-bjj-gray-900 via-bjj-gray-900/60 to-bjj-black p-0`}>
        <div className="grid gap-6 px-5 py-5 lg:grid-cols-[1.15fr,1fr]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <p className={badge}>Visão geral</p>
                <h1 className="text-xl font-semibold text-white leading-tight">{instructorName}</h1>
                <p className="text-xs text-bjj-gray-300/90">Painel compacto com atalhos para aprovar presenças e gerenciar alunos.</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-bjj-gray-800/80 bg-bjj-black/40 px-3 py-2">
                <div className="avatar">
                  <div className="w-12 rounded-full ring ring-bjj-red/70 ring-offset-2 ring-offset-bjj-gray-950">
                    <img src={ensureAvatar(instructorName, instructorAvatar)} alt={`Avatar de ${instructorName}`} loading="lazy" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white leading-tight">{instructorName}</p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">Professor</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[{ label: 'Pendentes de aprovação', value: metrics.pendentes, icon: Clock3, href: '/presencas' },
                { label: 'Alunos ativos', value: metrics.ativos, icon: Activity, href: '/alunos' },
                { label: 'Graduações', value: metrics.graduados, icon: Medal, href: '/configuracoes/graduacao' }
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 px-4 py-3 transition hover:-translate-y-0.5 hover:border-bjj-red/60 hover:shadow-[0_14px_32px_rgba(0,0,0,0.35)]"
                >
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">{item.label}</p>
                    <p className="text-2xl font-bold text-white leading-tight">{item.value}</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-bjj-black/60 text-bjj-gray-100 group-hover:text-bjj-red">
                    <item.icon size={18} />
                  </span>
                </Link>
              ))}
            </div>

          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[{ label: 'Aulas na semana', value: metrics.presentesSemana, icon: CalendarCheck, href: '/presencas' },
              { label: 'Histórico na semana', value: presencas.length, icon: BarChart3, href: '/historico-presencas' },
              { label: 'Total de alunos', value: metrics.totalAlunos, icon: Users, href: '/alunos' },
              { label: 'Check-ins registrados', value: presencas.length, icon: Activity, href: '/presencas' }
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-4 transition hover:-translate-y-0.5 hover:border-bjj-red/60 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">{item.label}</p>
                    <p className="mt-2 text-3xl font-bold text-white leading-none">{item.value}</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-bjj-black/60 text-bjj-gray-100 group-hover:text-bjj-red">
                    <item.icon size={18} />
                  </span>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-bjj-gray-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-bjj-red to-red-500" style={{ width: `${Math.min(100, Number(item.value) || 0)}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
            <div className={`${cardBase} p-5`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Visão analítica</h3>
                <span className="rounded-full bg-bjj-gray-800/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-white shadow-inner">
                  Atualizado
                </span>
              </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-bjj-gray-800/80 bg-bjj-gray-900/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-bjj-gray-200/90">Check-ins por status</p>
                  <Clock3 size={16} className="text-bjj-gray-200" />
                </div>
                <div className="mt-4 space-y-3">
                  {[{ label: 'Confirmados', value: presencas.filter((p) => p.status === 'CONFIRMADO').length, tone: 'bg-green-500' },
                    { label: 'Pendentes', value: metrics.pendentes, tone: 'bg-yellow-400' },
                    { label: 'Ausentes', value: presencas.filter((p) => p.status === 'AUSENTE' || p.status === 'AUSENTE_JUSTIFICADA').length, tone: 'bg-bjj-red' }
                  ].map((row) => (
                    <div key={row.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-bjj-gray-200">
                        <span>{row.label}</span>
                        <span className="font-semibold text-white">{row.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-bjj-gray-800">
                        <div className={`h-full rounded-full ${row.tone}`} style={{ width: `${Math.min(100, row.value * 10)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-bjj-gray-800/80 bg-bjj-gray-900/70 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-bjj-gray-200/90">Presenças na semana</p>
                  <BarChart2 size={16} className="text-bjj-gray-200" />
                </div>
                <div className="mt-4 flex items-end gap-3">
                  {[5, 8, 6, 9, 7, 10, 4].map((value, idx) => (
                    <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                      <div className="w-full rounded-t-xl bg-gradient-to-t from-bjj-red to-red-400" style={{ height: `${value * 6}px` }} />
                      <span className="text-[11px] text-bjj-gray-300">D{idx + 1}</span>
                    </div>
                  ))}
                </div>
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
                {[{ key: 'visao', label: 'Visão Geral' }, { key: 'alunos', label: 'Alunos' }, { key: 'presencas', label: 'Presenças' }, { key: 'graduacoes', label: 'Graduações' }].map((tab) => (
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

        <div className={`${cardBase} flex flex-col gap-4 bg-gradient-to-b from-bjj-gray-900 to-bjj-black p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={badge}>Pendências</p>
              <h3 className="text-lg font-semibold text-white">Check-ins em análise</h3>
            </div>
            <span className="badge badge-warning badge-sm text-[10px] font-semibold uppercase tracking-wide text-bjj-gray-950 shadow">
              {metrics.pendentes} aguardando
            </span>
          </div>
          <div className="space-y-3">
            {presencas
              .filter((p) => p.status === 'PENDENTE' || p.status === 'CHECKIN')
              .slice(0, 5)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">{item.alunoNome || 'Aluno'}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">{item.tipoTreino}</p>
                  </div>
                  <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-yellow-200">
                    Aguardando
                  </span>
                </div>
              ))}
            {metrics.pendentes === 0 && (
              <p className="rounded-2xl border border-dashed border-bjj-gray-800/70 bg-bjj-gray-900/50 p-4 text-sm text-bjj-gray-300">
                Nenhum check-in pendente no momento. Acompanhe novos envios em tempo real.
              </p>
            )}
          </div>
          <Link
            href="/presencas"
            className="btn btn-sm rounded-full border-none bg-bjj-red text-white shadow-lg hover:bg-red-600"
          >
            Ir para presenças
          </Link>
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
