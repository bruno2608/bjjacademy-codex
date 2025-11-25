'use client';

import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  BarChart2,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Medal,
  PieChart,
  ShieldCheck,
  TrendingUp,
  Users,
  XCircle
} from 'lucide-react';

import useRole from '../../hooks/useRole';
import { ROLE_KEYS } from '../../config/roles';
import { useCurrentAluno } from '@/hooks/useCurrentAluno';
import { useAlunoDashboard } from '@/services/dashboard/useAlunoDashboard';
import { useProfessorDashboard } from '@/services/dashboard/useProfessorDashboard';
import { BjjBeltProgressCard } from '@/components/bjj/BjjBeltProgressCard';

const cardBase = 'rounded-3xl border border-bjj-gray-800 bg-bjj-gray-900/70 shadow-[0_25px_60px_rgba(0,0,0,0.35)]';
const badge = 'text-xs uppercase tracking-[0.2em] text-bjj-gray-300/80';
const defaultAvatar = 'https://ui-avatars.com/api/?background=1b1b1b&color=fff&name=BJJ+Academy';

const ensureAvatar = (name, avatarUrl) =>
  avatarUrl || `https://ui-avatars.com/api/?background=111111&color=fff&bold=true&name=${encodeURIComponent(name || 'BJJ')}`;

function DashboardHero({
  name,
  subtitle,
  statusLabel,
  avatarUrl,
  faixaConfig,
  graus,
  aulasFeitasNoGrau,
  aulasMetaNoGrau,
  className
}) {
  const grauAtual = graus ?? faixaConfig?.grausMaximos ?? 0;

  return (
    <div
      className={`hero w-full rounded-3xl border border-bjj-gray-800/70 bg-gradient-to-br from-bjj-gray-900/90 via-bjj-gray-900/60 to-bjj-black shadow-[0_25px_60px_rgba(0,0,0,0.35)] ${
        className || ''
      }`}
    >
      <div className="hero-content w-full flex-col gap-6 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
        <figure className="avatar">
          <div className="w-28 rounded-full ring ring-bjj-red/70 ring-offset-2 ring-offset-bjj-gray-950 lg:w-32">
            <img src={avatarUrl} alt={`Avatar de ${name || 'Aluno'}`} loading="lazy" />
          </div>
        </figure>

        <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:pl-4">
          <div className="flex flex-col gap-3">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-300/80">{subtitle || 'Dashboard'}</p>
              <h1 className="text-2xl font-semibold leading-tight text-white sm:text-3xl">{name || 'Aluno'}</h1>
            </div>

            <span className="badge badge-outline w-fit border-green-500/70 bg-green-600/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-green-200 shadow-[0_0_0_1px_rgba(74,222,128,0.25)]">
              {statusLabel || 'Ativo'}
            </span>
          </div>

          <div className="flex w-full flex-col gap-3 lg:max-w-md">
            {faixaConfig && (
              <div className="w-full max-w-2xl">
                <BjjBeltProgressCard
                  config={faixaConfig}
                  grauAtual={grauAtual}
                  aulasFeitasNoGrau={aulasFeitasNoGrau ?? 0}
                  aulasMetaNoGrau={aulasMetaNoGrau}
                  className="scale-[0.95] md:scale-100 origin-center bg-bjj-gray-900/80 border-bjj-gray-800"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentDashboard() {
  const { user } = useCurrentAluno();

  const data = useAlunoDashboard();
  const {
    aluno,
    faixaConfig,
    grauAtual,
    aulasNoGrau,
    aulasMetaNoGrau,
    percentualProgresso,
    totalPresencasConfirmadas,
    totalFaltas,
    totalPendentes,
    ultimasPresencas,
    treinoPorId
  } = data;

  const avatarUrl = ensureAvatar(aluno?.nome, aluno?.avatarUrl || user?.avatarUrl || defaultAvatar);

  const formatStatus = (status) => {
    switch (status) {
      case 'PRESENTE':
        return { label: 'Presente', tone: 'bg-green-600/20 text-green-300' };
      case 'PENDENTE':
        return { label: 'Pendente', tone: 'bg-yellow-500/20 text-yellow-300' };
      case 'FALTA':
        return { label: 'Ausente', tone: 'bg-bjj-red/20 text-bjj-red' };
      default:
        return { label: 'Sem registro', tone: 'bg-bjj-gray-700 text-bjj-gray-200' };
    }
  };

  const formatStatusLabel = (status) => {
    const raw = status || 'ativo';
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  };

  return (
    <div className="space-y-6">
      <DashboardHero
        name={aluno?.nome || 'Aluno'}
        faixaConfig={faixaConfig}
        graus={grauAtual}
        aulasFeitasNoGrau={aulasNoGrau}
        aulasMetaNoGrau={aulasMetaNoGrau}
        statusLabel={formatStatusLabel(aluno?.status)}
        avatarUrl={avatarUrl}
        subtitle="Dashboard do aluno"
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: 'Aulas no grau',
            value: aulasNoGrau,
            helper: `meta de ${aulasMetaNoGrau} aulas`,
            href: '/evolucao',
            tone: 'from-bjj-gray-900/80 to-bjj-black/90',
            badgeTone: 'text-bjj-gray-300',
            icon: Activity
          },
          {
            title: 'Presenças',
            value: totalPresencasConfirmadas,
            helper: 'últimos registros confirmados',
            href: '/historico-presencas',
            tone: 'from-bjj-gray-900/85 to-bjj-black/80',
            badgeTone: 'text-green-300',
            icon: CheckCircle2
          },
          {
            title: 'Faltas registradas',
            value: totalFaltas,
            helper: 'inclui ausências justificadas',
            href: '/historico-presencas',
            tone: 'from-bjj-gray-900/80 to-bjj-black/85',
            badgeTone: 'text-bjj-red',
            icon: BarChart2
          },
          {
            title: 'Check-ins pendentes',
            value: totalPendentes,
            helper: 'aguardando aprovação',
            href: '/checkin',
            tone: 'from-bjj-gray-900/80 to-bjj-black/90',
            badgeTone: 'text-yellow-300',
            icon: Clock3
          }
        ].map((item) => {
          const Icon = item.icon || ArrowRight;
          return (
            <Link
              key={item.title}
              href={item.href}
              className={`${cardBase} group flex items-center justify-between gap-4 border-bjj-gray-800/80 bg-gradient-to-br ${item.tone} p-4 transition hover:-translate-y-0.5 hover:border-bjj-red/60 hover:shadow-[0_18px_45px_rgba(225,6,0,0.18)]`}
            >
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-semibold text-bjj-gray-200/90">{item.title}</p>
                <p className="text-3xl font-bold leading-none text-white">{item.value}</p>
                <p className={`text-xs ${item.badgeTone}`}>{item.helper}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-bjj-gray-800/80 text-white group-hover:bg-bjj-red group-hover:text-white">
                <Icon size={16} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className={`${cardBase} p-6`}>
        <header className="mb-4 flex items-center justify-between">
          <div>
            <p className={badge}>Últimas presenças</p>
            <h3 className="text-xl font-semibold">Últimos registros</h3>
            <p className="text-xs text-bjj-gray-300/80">
              {`Progresso atual: ${percentualProgresso}% (${aulasNoGrau}/${aulasMetaNoGrau} aulas)`}
            </p>
          </div>
          <Activity size={18} className="text-green-400" />
        </header>
        <ul className="divide-y divide-bjj-gray-800/70 text-sm">
          {ultimasPresencas.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-3 text-bjj-gray-100">
              <div>
                <p className="font-semibold text-white">{treinoPorId.get(item.treinoId)?.nome || 'Treino'}</p>
                <p className="text-xs text-bjj-gray-300/80">
                  {item.data} · {treinoPorId.get(item.treinoId)?.hora || '—'}
                </p>
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
  const {
    instructorName,
    faixaConfig,
    graus: instructorGraus,
    avatarUrl: instructorAvatar,
    statusLabel,
    overviewCards,
    semanaCards,
    tabCards,
    analytics,
    pendencias,
    pendentesTotal,
    activeTab,
    setActiveTab,
    handleStatusChange,
    updatingId
  } = useProfessorDashboard();

  return (
    <div className="space-y-6">
      <DashboardHero
        name={instructorName}
        faixaConfig={faixaConfig}
        graus={instructorGraus}
        statusLabel={statusLabel || 'Professor'}
        avatarUrl={ensureAvatar(instructorName, instructorAvatar)}
        subtitle="Dashboard do professor"
        className="border-bjj-gray-800/90"
      />

      <div className="grid gap-4 lg:grid-cols-[1.15fr,1fr]">
        <div className={`${cardBase} border-bjj-gray-800/80 bg-gradient-to-br from-bjj-gray-950/80 via-bjj-gray-900/60 to-bjj-black p-5`}>
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <p className={badge}>Visão geral</p>
              <h1 className="text-xl font-semibold leading-tight text-white">{instructorName}</h1>
              <p className="text-xs text-bjj-gray-300/90">Painel compacto com atalhos para aprovar presenças e gerenciar alunos.</p>
            </div>
            <span className="badge badge-outline border-green-500/70 bg-green-600/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-green-200 shadow-[0_0_0_1px_rgba(74,222,128,0.25)]">
              {statusLabel || 'Ativo'}
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {overviewCards.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 px-4 py-3 transition hover:-translate-y-0.5 hover:border-bjj-red/60 hover:shadow-[0_14px_32px_rgba(0,0,0,0.35)]"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">{item.label}</p>
                  <p className="text-2xl font-bold leading-tight text-white">{item.value}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-bjj-black/60 text-bjj-gray-100 group-hover:text-bjj-red">
                  <item.icon size={18} />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className={`${cardBase} border-bjj-gray-800/80 bg-bjj-gray-900/60 p-5`}>
          <div className="grid gap-3 sm:grid-cols-2">
            {semanaCards.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-4 transition hover:-translate-y-0.5 hover:border-bjj-red/60 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">{item.label}</p>
                    <p className="mt-2 text-3xl font-bold leading-none text-white">{item.value}</p>
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
                  {[{ label: 'Confirmados', value: analytics.checkinsPorStatus.confirmados, tone: 'bg-green-500' },
                    { label: 'Pendentes', value: analytics.checkinsPorStatus.pendentes, tone: 'bg-yellow-400' },
                    { label: 'Ausentes', value: analytics.checkinsPorStatus.faltas, tone: 'bg-bjj-red' }
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
                  {analytics.presencasNaSemana.map((dia, idx) => (
                    <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                      <div className="w-full rounded-t-xl bg-gradient-to-t from-bjj-red to-red-400" style={{ height: `${dia.total * 6}px` }} />
                      <span className="text-[11px] text-bjj-gray-300">{dia.dia}</span>
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
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className={badge}>Pendências</p>
              <h3 className="text-lg font-semibold text-white">Check-ins em análise</h3>
            </div>
            <span className="badge badge-warning badge-sm text-[10px] font-semibold uppercase tracking-wide text-bjj-gray-950 shadow">
              {pendentesTotal} aguardando
            </span>
          </div>
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {pendencias.map((item) => {
              const badgeTone = 'bg-amber-500/20 text-amber-200';

              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white leading-tight">{item.alunoNome}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">{item.treinoNome}</p>
                    <p className="text-[11px] text-bjj-gray-400">
                      {item.dataLabel} · {item.treinoHora || '--:--'}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-green-500/30 bg-green-600/15 text-green-100 transition hover:border-green-400/60 hover:text-green-50 disabled:opacity-50"
                        onClick={() => handleStatusChange(item.id, 'approve')}
                        disabled={updatingId === item.id}
                        aria-label="Confirmar presença"
                        title="Confirmar presença"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-bjj-red/40 bg-bjj-red/15 text-red-100 transition hover:border-bjj-red hover:text-white disabled:opacity-50"
                        onClick={() => handleStatusChange(item.id, 'reject')}
                        disabled={updatingId === item.id}
                        aria-label="Marcar falta"
                        title="Marcar falta"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${badgeTone}`}>
                    Pendente
                  </span>
                </div>
              );
            })}
            {pendencias.length === 0 && (
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
