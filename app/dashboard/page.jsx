'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  BarChart2,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  LineChart,
  Medal,
  Users,
  MapPin,
  Target,
  Zap
} from 'lucide-react';

import FaixaVisual from '../../components/graduacoes/FaixaVisual';
import WeeklyEvolutionChart from '../../components/charts/WeeklyEvolutionChart';
import useRole from '../../hooks/useRole';
import { usePresencasStore } from '../../store/presencasStore';
import { useAlunosStore } from '../../store/alunosStore';
import useUserStore from '../../store/userStore';
import { ROLE_KEYS } from '../../config/roles';

const defaultAvatar = 'https://ui-avatars.com/api/?background=111111&color=fff&bold=true&name=BJJ+Academy';

const ensureAvatar = (name, avatarUrl) =>
  avatarUrl || `https://ui-avatars.com/api/?background=111111&color=fff&bold=true&name=${encodeURIComponent(name || 'BJJ')}`;

const badgeTone = {
  confirmed: 'badge-success',
  pending: 'badge-warning',
  absent: 'badge-error'
};

function StatCard({ icon: Icon, title, value, tone }) {
  return (
    <div className="stats shadow-xl rounded-2xl bg-base-200">
      <div className="stat">
        <div className="stat-figure text-primary">
          <div className="btn btn-circle btn-sm border-none bg-gradient-to-br from-primary/80 to-primary/40 text-white">
            <Icon size={16} />
          </div>
        </div>
        <div className="stat-title text-sm opacity-80">{title}</div>
        <div className="stat-value text-3xl font-bold text-white">{value}</div>
        <div className="stat-desc opacity-60">Atualizado agora</div>
      </div>
    </div>
  );
}

function DistributionCard({ label, value, icon: Icon }) {
  return (
    <div className="card bg-base-200 shadow-md rounded-xl p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-white">{label}</p>
        <div className="btn btn-circle btn-ghost btn-xs text-primary">
          <Icon size={16} />
        </div>
      </div>
      <p className="mt-3 text-3xl font-extrabold text-white">{value}</p>
    </div>
  );
}

function PendingCard({ title, items }) {
  return (
    <div className="card bg-base-200 shadow-xl rounded-2xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <p className="badge badge-warning badge-outline">Pendentes</p>
            <h3 className="card-title text-white mt-2">{title}</h3>
          </div>
          <Clock3 size={18} className="text-warning" />
        </div>
        <div className="mt-4 space-y-3">
          {items.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-base-300/60 bg-base-300/30 px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold text-white">{p.alunoNome}</p>
                <p className="text-xs opacity-70">{p.data} · {p.tipoTreino}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${badgeTone[p.status === 'CHECKIN' ? 'pending' : 'pending']}`}>Aguardando</span>
                <Link href="/presencas" className="btn btn-xs btn-outline border-primary/70 text-primary">
                  Abrir
                </Link>
              </div>
            </div>
          ))}
          {!items.length && <p className="text-sm opacity-70">Nenhum check-in pendente.</p>}
        </div>
      </div>
    </div>
  );
}

function HeaderCard({ title, subtitle, avatarUrl, helper, children }) {
  return (
    <div className="card bg-gradient-to-br from-base-200 via-base-300 to-base-200 shadow-xl rounded-2xl">
      <div className="card-body gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-14 rounded-full ring ring-primary/50 ring-offset-2 ring-offset-base-300">
                <img src={avatarUrl || defaultAvatar} alt={title} loading="lazy" />
              </div>
            </div>
            <div>
              <p className="text-sm opacity-70">{subtitle}</p>
              <h1 className="text-xl font-bold text-white">{title}</h1>
            </div>
          </div>
          {helper}
        </div>
        {children}
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

  const weeklySeries = useMemo(() => {
    const byDay = new Map();
    presencas
      .filter((item) => item.alunoId === aluno?.id)
      .forEach((p) => {
        const key = p.data || '2024-01-01';
        const current = byDay.get(key) || { confirmed: 0, pending: 0 };
        if (p.status === 'CONFIRMADO') current.confirmed += 1;
        else if (p.status === 'CHECKIN' || p.status === 'PENDENTE') current.pending += 1;
        byDay.set(key, current);
      });
    const entries = Array.from(byDay.entries()).slice(-7);
    return entries.map(([key, value]) => ({
      label: key,
      confirmed: value.confirmed,
      pending: value.pending
    }));
  }, [aluno?.id, presencas]);

  return (
    <div className="space-y-6">
      <HeaderCard
        title={aluno?.nome || 'Aluno'}
        subtitle="Dashboard do aluno"
        avatarUrl={avatarUrl}
        helper={
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-sm rounded-full border border-base-300 text-xs">
              Ajuda
            </label>
            <ul tabIndex={0} className="dropdown-content menu w-72 rounded-2xl bg-base-200 p-3 shadow-xl">
              {[{ label: 'Check-in', description: 'Registre antes de iniciar a aula ou até 30 minutos após.' },
                { label: 'Faixa e grau', description: 'Campos bloqueados para edição pelo aluno.' },
                { label: 'Evolução', description: 'Complete as aulas mínimas para avançar.' }].map((item) => (
                <li key={item.label} className="py-1">
                  <div className="rounded-xl bg-base-300/60 p-3">
                    <p className="font-semibold text-white">{item.label}</p>
                    <p className="text-xs opacity-70">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <div className="grid gap-4 lg:grid-cols-[1.2fr,1fr]">
          <div className="card bg-base-200 rounded-2xl shadow-xl">
            <div className="card-body gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-70">Sua faixa</p>
                  <h3 className="card-title text-white">Progresso do próximo grau</h3>
                </div>
                <Medal className="text-primary" size={20} />
              </div>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                <div className="rounded-2xl border border-base-300/70 bg-base-300/40 p-3">
                  <FaixaVisual faixa={faixaAtual} graus={graus} tamanho="xl" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="badge badge-outline border-base-300 bg-base-300/30">Faixa: {faixaAtual}</span>
                    <span className="badge badge-outline border-base-300 bg-base-300/30">Grau: {graus}º</span>
                    <span className="badge badge-outline border-base-300 bg-base-300/30">
                      {progressoProximoGrau.aulasNoGrau} aulas no grau
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-base-300">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                      style={{ width: `${Math.max(6, Math.min(100, progressoProximoGrau.percent || 0))}%` }}
                    />
                  </div>
                  <p className="text-sm opacity-70">
                    {progressoProximoGrau.aulasNoGrau} de {progressoProximoGrau.alvo} aulas concluídas
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 rounded-2xl shadow-xl">
            <div className="card-body gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-70">Resumo rápido</p>
                  <h3 className="card-title text-white">Sua atividade</h3>
                </div>
                <Target className="text-primary" size={20} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <StatCard icon={Activity} title="Presenças" value={stats.presentes} />
                <StatCard icon={Clock3} title="Pendentes" value={stats.pendentes} />
                <StatCard icon={BarChart2} title="Faltas" value={stats.faltas} />
                <StatCard icon={Medal} title="Progresso" value={`${progressoProximoGrau.percent}%`} />
              </div>
            </div>
          </div>
        </div>
      </HeaderCard>

      <div className="grid gap-4 lg:grid-cols-[1.3fr,1fr]">
        <div className="card bg-base-200 rounded-2xl shadow-xl">
          <div className="card-body gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Evolução semanal</p>
                <h3 className="card-title text-white">Check-ins e confirmações</h3>
              </div>
              <LineChart className="text-primary" size={20} />
            </div>
            <div className="h-64 lg:h-80">
              <WeeklyEvolutionChart data={weeklySeries} />
            </div>
          </div>
        </div>

        <div className="card bg-base-200 rounded-2xl shadow-xl">
          <div className="card-body gap-4">
            <div className="flex items-center justify-between">
              <h3 className="card-title text-white">Últimas presenças</h3>
              <CalendarCheck className="text-success" size={18} />
            </div>
            <div className="space-y-3">
              {ultimasPresencas.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-base-300/70 bg-base-300/40 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{item.tipoTreino}</p>
                    <p className="text-xs opacity-70">{item.data} · {item.hora || '—'}</p>
                  </div>
                  <span
                    className={`badge ${
                      item.status === 'CONFIRMADO'
                        ? 'badge-success'
                        : item.status === 'CHECKIN' || item.status === 'PENDENTE'
                          ? 'badge-warning'
                          : 'badge-error'
                    }`}
                  >
                    {item.status === 'CONFIRMADO'
                      ? 'Presente'
                      : item.status === 'PENDENTE' || item.status === 'CHECKIN'
                        ? 'Pendente'
                        : 'Ausente'}
                  </span>
                </div>
              ))}
              {!ultimasPresencas.length && <p className="text-sm opacity-70">Nenhuma presença registrada.</p>}
            </div>
          </div>
        </div>
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
    const presentesHoje = presencas.filter((p) => p.status === 'CONFIRMADO').length;
    return { totalAlunos, ativos, inativos, graduados, pendentes, presentesHoje };
  }, [alunos, presencas]);

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
    return entries.map(([key, value]) => ({
      label: key,
      confirmed: value.confirmed,
      pending: value.pending,
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

  const tabCards = useMemo(
    () => ({
      visao: [
        { title: 'Presenças Hoje', value: metrics.presentesHoje, icon: CalendarCheck },
        { title: 'Registros Pendentes', value: metrics.pendentes, icon: Clock3 },
        { title: 'Faixas em Progresso', value: metrics.graduados, icon: Medal },
        { title: 'Alunos Ativos', value: metrics.ativos, icon: Users }
      ],
      alunos: [
        { title: 'Total de alunos', value: metrics.totalAlunos, icon: Users },
        { title: 'Alunos ativos', value: metrics.ativos, icon: Activity },
        { title: 'Inativos', value: metrics.inativos, icon: BarChart2 },
        { title: 'Últimas matrículas', value: 4, icon: Zap }
      ],
      presencas: [
        { title: 'Pendentes de aprovação', value: metrics.pendentes, icon: Clock3 },
        { title: 'Confirmados', value: metrics.presentesHoje, icon: CheckCircle2 },
        { title: 'Ausências', value: presencas.filter((p) => p.status === 'AUSENTE' || p.status === 'AUSENTE_JUSTIFICADA').length, icon: BarChart2 },
        { title: 'Check-ins registrados', value: presencas.length, icon: Activity }
      ],
      graduacoes: [
        { title: 'Próximas graduações', value: alunos.filter((a) => a.proximaMeta).length || 6, icon: Medal },
        { title: 'Faixas avançadas', value: metrics.graduados, icon: Medal },
        { title: 'Tempo médio na faixa', value: '14 meses', icon: Clock3 },
        { title: 'Relatórios emitidos', value: 12, icon: BarChart2 }
      ]
    }),
    [alunos, metrics, presencas]
  );

  return (
    <div className="space-y-6">
      <HeaderCard
        title={instructorName}
        subtitle="Dashboard do professor"
        avatarUrl={ensureAvatar(instructorName, instructorAvatar)}
        helper={
          <div className="flex items-center gap-3">
            <div className="tabs tabs-boxed bg-base-300/60 rounded-full p-1 text-sm">
              {['visao', 'alunos', 'presencas', 'graduacoes'].map((tab) => (
                <a
                  key={tab}
                  className={`tab px-4 ${activeTab === tab ? 'tab-active bg-primary text-white' : 'text-sm'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'visao'
                    ? 'Visão Geral'
                    : tab === 'alunos'
                      ? 'Alunos'
                      : tab === 'presencas'
                        ? 'Presenças'
                        : 'Graduações'}
                </a>
              ))}
            </div>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tabCards[activeTab].map((item) => (
            <StatCard key={item.title} icon={item.icon} title={item.title} value={item.value} />
          ))}
        </div>
      </HeaderCard>

      <div className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
        <div className="card bg-base-200 rounded-2xl shadow-xl">
          <div className="card-body gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Evolução semanal</p>
                <h3 className="card-title text-white">Check-ins e aprovações</h3>
              </div>
              <LineChart className="text-primary" size={20} />
            </div>
            <div className="h-64 lg:h-80">
              <WeeklyEvolutionChart data={weeklySeries} />
            </div>
          </div>
        </div>

        <PendingCard title="Check-ins aguardando" items={pendingCheckins} />
      </div>

      <div className="card bg-base-200 rounded-2xl shadow-xl">
        <div className="card-body gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-70">Distribuição da academia</p>
              <h3 className="card-title text-white">Visão geral</h3>
            </div>
            <MapPin className="text-primary" size={18} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DistributionCard label="Ativos" value={metrics.ativos} icon={Users} />
            <DistributionCard label="Pendentes" value={metrics.pendentes} icon={Clock3} />
            <DistributionCard label="Graduados" value={metrics.graduados} icon={Medal} />
            <DistributionCard label="Inativos" value={metrics.inativos} icon={BarChart2} />
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
