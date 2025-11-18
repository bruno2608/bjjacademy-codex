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
  ArrowRight,
  LineChart,
  Target,
  MapPin,
  Zap
} from 'lucide-react';

import FaixaVisual from '../../components/graduacoes/FaixaVisual';
import useRole from '../../hooks/useRole';
import { usePresencasStore } from '../../store/presencasStore';
import { useAlunosStore } from '../../store/alunosStore';
import useUserStore from '../../store/userStore';
import { ROLE_KEYS } from '../../config/roles';

const cardBase = 'rounded-3xl border border-bjj-gray-800 bg-bjj-gray-900/70 shadow-[0_25px_60px_rgba(0,0,0,0.35)]';
const badge = 'text-xs uppercase tracking-[0.2em] text-bjj-gray-300/80';
const defaultAvatar = 'https://ui-avatars.com/api/?background=1b1b1b&color=fff&name=BJJ+Academy';

const ensureAvatar = (name, avatarUrl) =>
  avatarUrl || `https://ui-avatars.com/api/?background=111111&color=fff&bold=true&name=${encodeURIComponent(name || 'BJJ')}`;

function HelperDropdown({ title, items }) {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-sm rounded-full border border-bjj-gray-800 text-xs text-bjj-gray-100">
        {title}
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu menu-sm z-20 w-72 rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900 p-3 text-xs text-bjj-gray-200 shadow-xl"
      >
        {items.map((item) => (
          <li key={item.label} className="py-1">
            <div className="flex items-start gap-3 rounded-xl bg-bjj-black/60 p-3">
              <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-bjj-red" />
              <div>
                <p className="font-semibold text-white">{item.label}</p>
                <p className="text-[11px] text-bjj-gray-300/80">{item.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

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

function ProfileBadge({ name, faixa, grau, aulas, avatarUrl }) {
  const label = grau ? `${faixa} · ${grau}º grau` : faixa;
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
          <div className="h-full rounded-full bg-gradient-to-r from-bjj-red to-red-500" style={{ width: '65%' }} />
        </div>
      </div>
    </div>
  );
}

function Sparkline({ points }) {
  if (!points?.length) return null;
  const maxY = Math.max(...points.map((p) => p.y));
  const minY = Math.min(...points.map((p) => p.y));
  const height = 80;
  const width = 320;
  const scaled = points.map((p, idx) => ({
    x: (idx / Math.max(points.length - 1, 1)) * width,
    y: height - ((p.y - minY) / Math.max(maxY - minY || 1, 1)) * height
  }));
  const d = scaled
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ');
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-20 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path
        d={`${d} V ${height} H 0 Z`}
        fill="url(#spark)"
        className="opacity-70"
      />
      <path d={d} stroke="#fca5a5" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function WorldMapCard({ stats }) {
  const markers = [
    { label: 'Academia', top: '46%', left: '38%', tone: 'bg-bjj-red' },
    { label: 'Filial', top: '55%', left: '52%', tone: 'bg-green-400' },
    { label: 'Equipe', top: '35%', left: '60%', tone: 'bg-yellow-300' }
  ];

  return (
    <div className={`${cardBase} relative overflow-hidden border-bjj-gray-800/80 bg-gradient-to-br from-bjj-gray-900 via-bjj-black to-bjj-gray-900 p-5`}>
      <div className="absolute inset-0 opacity-70" style={{
        background:
          'radial-gradient(circle at 20% 30%, rgba(239,68,68,0.18), transparent 35%), radial-gradient(circle at 70% 40%, rgba(252,211,77,0.12), transparent 32%), radial-gradient(circle at 55% 70%, rgba(52,211,153,0.12), transparent 30%)'
      }} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className={badge}>Academia ativa</p>
          <h3 className="text-lg font-semibold text-white">Distribuição</h3>
        </div>
        <div className="badge badge-outline border-bjj-red/60 bg-bjj-red/10 text-xs text-white">Atualizado agora</div>
      </div>

      <div className="relative mt-5 h-52 rounded-3xl border border-bjj-gray-800/80 bg-gradient-to-br from-bjj-gray-900/70 to-bjj-black/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06),transparent_45%)]" />
        <div className="absolute inset-[18%] rounded-2xl border border-bjj-gray-800/60" />
        {markers.map((marker) => (
          <div
            key={marker.label}
            className={`absolute flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-xl ${marker.tone}`}
            style={{ top: marker.top, left: marker.left, transform: 'translate(-50%, -50%)' }}
          >
            <MapPin size={14} />
            {marker.label}
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm text-bjj-gray-200/90">
        {[
          { label: 'Alunos ativos', value: stats.ativos, tone: 'text-green-300' },
          { label: 'Pendentes', value: stats.pendentes, tone: 'text-yellow-300' },
          { label: 'Graduações', value: stats.graduados, tone: 'text-bjj-red' }
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-bjj-gray-800/70 bg-bjj-black/50 p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">{item.label}</p>
            <p className={`text-2xl font-bold text-white ${item.tone}`}>{item.value}</p>
          </div>
        ))}
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
              <HelperDropdown
                title="Ajuda"
                items={[
                  { label: 'Check-in', description: 'Registre antes de iniciar a aula para liberar o histórico automaticamente.' },
                  { label: 'Faixa e grau', description: 'Campos bloqueados: apenas o instrutor pode alterá-los.' },
                  { label: 'Evolução', description: 'Complete as aulas mínimas para avançar para o próximo grau.' }
                ]}
              />
            </div>
            <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
              <ProfileBadge
                name={aluno?.nome || 'Aluno'}
                faixa={faixaAtual}
                grau={graus}
                aulas={aluno?.aulasNoGrauAtual || 0}
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
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="badge badge-outline border-bjj-gray-700 bg-bjj-black/40 text-bjj-gray-200">Faixa: {faixaAtual}</span>
            <span className="badge badge-outline border-bjj-gray-700 bg-bjj-black/40 text-bjj-gray-200">Grau: {graus}º</span>
            <span className="badge badge-outline border-bjj-gray-700 bg-bjj-black/40 text-bjj-gray-200">
              {progressoProximoGrau.aulasNoGrau} aulas no grau
            </span>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
            <div className="shrink-0 rounded-2xl border border-bjj-gray-800/80 bg-bjj-black/60 p-3">
              <FaixaVisual faixa={faixaAtual} graus={graus} tamanho="xl" />
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm text-bjj-gray-200/90">{progressoProximoGrau.percent}% do próximo grau</p>
              <ProgressBar percent={progressoProximoGrau.percent} />
              <p className="text-xs text-bjj-gray-300/80">
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

  const weeklySeries = useMemo(() => {
    const byDay = new Map();
    presencas.forEach((p) => {
      const key = p.data || '2024-01-01';
      const current = byDay.get(key) || { confirmed: 0, pending: 0, absent: 0 };
      if (p.status === 'CONFIRMADO') current.confirmed += 1;
      else if (p.status === 'CHECKIN' || p.status === 'PENDENTE') current.pending += 1;
      else current.absent += 1;
      byDay.set(key, current);
    });
    const entries = Array.from(byDay.entries()).slice(-7);
    return entries.map(([key, value], idx) => ({
      x: idx,
      y: value.confirmed + value.pending * 0.6,
      label: key,
      pending: value.pending,
      confirmed: value.confirmed,
      absent: value.absent
    }));
  }, [presencas]);

  const pendingCheckins = useMemo(
    () =>
      presencas
        .filter((p) => p.status === 'PENDENTE' || p.status === 'CHECKIN')
        .slice(0, 5),
    [presencas]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.6fr,1fr]">
        <div className={`${cardBase} space-y-4 bg-gradient-to-br from-bjj-gray-900 via-bjj-gray-900/60 to-bjj-black p-5`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-12 rounded-full ring ring-bjj-red/70 ring-offset-2 ring-offset-bjj-gray-950">
                  <img src={ensureAvatar(instructorName, instructorAvatar)} alt={`Avatar de ${instructorName}`} loading="lazy" />
                </div>
              </div>
              <div>
                <p className={badge}>Painel do professor</p>
                <h1 className="text-xl font-semibold text-white leading-tight">{instructorName}</h1>
              </div>
            </div>
            <HelperDropdown
              title="Ajuda"
              items={[
                { label: 'Pendentes', description: 'Aprove os check-ins fora da janela antes de fechar o treino.' },
                { label: 'Relatórios', description: 'Conferir evolução e presença por equipe.' }
              ]}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              { title: 'Pendentes', value: metrics.pendentes, icon: Clock3, tone: 'from-bjj-gray-900/90 to-bjj-black/80' },
              { title: 'Confirmados', value: metrics.presentesSemana, icon: CalendarCheck, tone: 'from-green-900/30 to-green-700/30' },
              { title: 'Alunos ativos', value: metrics.ativos, icon: Users, tone: 'from-bjj-gray-900/90 to-bjj-black/70' },
              { title: 'Faixas avançadas', value: metrics.graduados, icon: Medal, tone: 'from-bjj-gray-900/90 to-bjj-black/70' },
              { title: 'Próximos treinos', value: 4, icon: Zap, tone: 'from-bjj-gray-900/90 to-bjj-black/70' }
            ].map((item) => (
              <div
                key={item.title}
                className={`${cardBase} group flex items-center justify-between gap-3 border-bjj-gray-800/80 bg-gradient-to-br ${item.tone} p-4`}
              >
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-300/80">{item.title}</p>
                  <p className="text-3xl font-bold text-white">{item.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-bjj-black/50 text-white">
                  <item.icon size={18} className="text-bjj-red" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-bjj-gray-300/85">
            {[
              { label: 'Presenças', href: '/presencas' },
              { label: 'Alunos', href: '/alunos' },
              { label: 'Relatórios', href: '/relatorios' },
              { label: 'Histórico', href: '/historico-presencas' }
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full border border-bjj-gray-800/80 bg-bjj-black/50 px-4 py-2 font-semibold text-white shadow-inner transition hover:-translate-y-0.5 hover:border-bjj-red/60"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <WorldMapCard stats={metrics} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
        <div className={`${cardBase} border-bjj-gray-800/80 bg-bjj-black/55 p-5`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className={badge}>Evolução semanal</p>
              <h3 className="text-xl font-semibold text-white">Aguardando x aprovações</h3>
            </div>
            <LineChart size={18} className="text-bjj-red" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[{ label: 'Aguardando', value: metrics.pendentes, tone: 'text-yellow-300' }, { label: 'Confirmados', value: metrics.presentesSemana, tone: 'text-green-300' }].map((item) => (
              <div key={item.label} className="rounded-2xl border border-bjj-gray-800/80 bg-bjj-gray-900/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">{item.label}</p>
                <p className={`text-2xl font-bold text-white ${item.tone}`}>{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-3xl border border-bjj-gray-800/70 bg-gradient-to-r from-bjj-gray-900/85 via-bjj-black to-bjj-gray-900/70 p-5">
            <Sparkline points={weeklySeries} />
            <div className="mt-3 flex items-center justify-between text-xs text-bjj-gray-300/80">
              <span>Trend 7d</span>
              <span className="flex items-center gap-1 text-green-300">
                <Target size={14} /> {metrics.presentesSemana} confirmações
              </span>
            </div>
          </div>
        </div>

        <div className={`${cardBase} border-bjj-gray-800/80 bg-bjj-black/50 p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={badge}>Pendências</p>
              <h3 className="text-xl font-semibold text-white">Check-ins aguardando</h3>
            </div>
            <Clock3 size={18} className="text-yellow-300" />
          </div>
          <div className="mt-4 space-y-3 text-sm text-bjj-gray-200/90">
            {pendingCheckins.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-2xl border border-bjj-gray-800/80 bg-bjj-gray-900/40 p-3"
              >
                <div>
                  <p className="font-semibold text-white">{p.alunoNome}</p>
                  <p className="text-xs text-bjj-gray-300/80">{p.data} · {p.tipoTreino}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-yellow-500/25 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-yellow-200">
                    {p.status === 'CHECKIN' ? 'Check-in' : 'Pendente'}
                  </span>
                  <Link
                    href="/presencas"
                    className="btn btn-sm rounded-full border border-bjj-red/60 bg-bjj-red/10 text-xs font-semibold text-white"
                  >
                    Abrir
                  </Link>
                </div>
              </div>
            ))}
            {!pendingCheckins.length && <p className="text-xs text-bjj-gray-400">Nenhum check-in pendente.</p>}
          </div>
        </div>
      </div>

      <div className={`${cardBase} border-bjj-gray-800/80 bg-bjj-black/60 p-5`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className={badge}>Visões principais</p>
            <h3 className="text-xl font-semibold text-white">{activeTab === 'graduacoes' ? 'Graduações' : activeTab === 'presencas' ? 'Presenças' : activeTab === 'alunos' ? 'Alunos' : 'Visão geral'}</h3>
          </div>
          <HelperDropdown
            title="Visões"
            items={[
              { label: 'Visão geral', description: 'Resumo de matrículas, presenças e graduações.' },
              { label: 'Alunos', description: 'Acesso direto ao cadastro e evolução.' },
              { label: 'Presenças', description: 'Gerencie aprovações e fechamentos.' }
            ]}
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tabCards[activeTab].map((item) => (
            <div
              key={item.title}
              className={`${cardBase} group flex flex-col gap-3 border-bjj-gray-800/80 bg-bjj-gray-900/60 p-4 transition hover:-translate-y-1 hover:border-bjj-red/60 hover:shadow-[0_18px_45px_rgba(225,6,0,0.18)]`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">{item.title}</p>
                  <p className="text-3xl font-bold text-white">{item.value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-bjj-black/50 text-white">
                  <item.icon size={18} className={item.tone} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-bjj-gray-300/80">
                <span>Atualizado agora</span>
                <ArrowRight size={14} className="opacity-50" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr,1fr]">
        <div className={`${cardBase} border-bjj-gray-800/80 bg-bjj-black/50 p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={badge}>Distribuição</p>
              <h3 className="text-xl font-semibold text-white">Academia em números</h3>
            </div>
            <BarChart3 size={18} className="text-bjj-red" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <StatPill icon={Activity} title="Ativos" value={metrics.ativos} accent="text-green-300" />
            <StatPill icon={Users} title="Total" value={metrics.totalAlunos} accent="text-white" />
            <StatPill icon={BarChart2} title="Inativos" value={metrics.inativos} accent="text-yellow-300" />
            <StatPill icon={Medal} title="Graduados" value={metrics.graduados} accent="text-bjj-red" />
          </div>
        </div>

        <div className={`${cardBase} border-bjj-gray-800/80 bg-bjj-black/50 p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={badge}>Pendências</p>
              <h3 className="text-xl font-semibold text-white">Check-ins aguardando</h3>
            </div>
            <Clock3 size={18} className="text-yellow-300" />
          </div>
          <div className="mt-4 space-y-3 text-sm text-bjj-gray-200/90">
            {pendingCheckins.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-2xl border border-bjj-gray-800/80 bg-bjj-gray-900/40 p-3"
              >
                <div>
                  <p className="font-semibold text-white">{p.alunoNome}</p>
                  <p className="text-xs text-bjj-gray-300/80">{p.data} · {p.tipoTreino}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-yellow-500/25 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-yellow-200">
                    {p.status === 'CHECKIN' ? 'Check-in' : 'Pendente'}
                  </span>
                  <Link
                    href="/presencas"
                    className="btn btn-sm rounded-full border border-bjj-red/60 bg-bjj-red/10 text-xs font-semibold text-white"
                  >
                    Abrir
                  </Link>
                </div>
              </div>
            ))}
            {!pendingCheckins.length && <p className="text-xs text-bjj-gray-400">Nenhum check-in pendente.</p>}
          </div>
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
