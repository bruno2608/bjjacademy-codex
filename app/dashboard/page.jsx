'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowRight, BarChart2, CalendarCheck, CheckCircle2, Clock3, Medal } from 'lucide-react';

import useRole from '../../hooks/useRole';
import { ROLE_KEYS } from '../../config/roles';
import { useCurrentAluno } from '@/hooks/useCurrentAluno';
import { useAlunoDashboard } from '@/services/dashboard/useAlunoDashboard';
import { BjjBeltStrip } from '@/components/bjj/BjjBeltStrip';
import { BjjBeltProgressCard } from '@/components/bjj/BjjBeltProgressCard';
import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils';
import { normalizeFaixaSlug } from '@/lib/alunoStats';
import { useAcademiasStore } from '@/store/academiasStore';
import { useAlunosStore } from '@/store/alunosStore';
import { useAulasStore } from '@/store/aulasStore';
import { useGraduacoesStore } from '@/store/graduacoesStore';
import { useMatriculasStore } from '@/store/matriculasStore';
import { usePresencasStore } from '@/store/presencasStore';
import { useTurmasStore } from '@/store/turmasStore';
import { useUserStore } from '@/store/userStore';

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
  const user = useUserStore((state) => state.user);
  const academias = useAcademiasStore((state) => state.academias) || [];
  const carregarAcademias = useAcademiasStore((state) => state.carregarAcademias);
  const turmas = useTurmasStore((state) => state.turmas) || [];
  const carregarTurmas = useTurmasStore((state) => state.carregarTurmas);
  const aulas = useAulasStore((state) => state.aulas) || [];
  const carregarAulas = useAulasStore((state) => state.carregarAulas);
  const presencas = usePresencasStore((state) => state.presencas) || [];
  const carregarPresencas = usePresencasStore((state) => state.carregarTodas);
  const matriculasAtivasDaAcademia = useMatriculasStore((state) => state.listarAtivasDaAcademia);
  const carregarMatriculas = useMatriculasStore((state) => state.carregarMatriculas);
  const alunos = useAlunosStore((state) => state.alunos) || [];
  const graduacoes = useGraduacoesStore((state) => state.graduacoes) || [];

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        await Promise.all([
          carregarAcademias?.(),
          carregarTurmas?.(),
          carregarAulas?.(),
          carregarPresencas?.(),
          carregarMatriculas?.()
        ]);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard do professor', error);
        if (active) setLoadError('Não foi possível carregar os dados. Tente novamente.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [carregarAcademias, carregarAulas, carregarMatriculas, carregarPresencas, carregarTurmas]);

  const currentAcademiaId = useMemo(
    () => user?.academiaId || academias[0]?.id || 'academia_bjj_central',
    [academias, user?.academiaId]
  );

  const academiaAtual = useMemo(
    () => academias.find((item) => item.id === currentAcademiaId) || null,
    [academias, currentAcademiaId]
  );

  const matriculasAtivas = useMemo(
    () => matriculasAtivasDaAcademia(currentAcademiaId),
    [currentAcademiaId, matriculasAtivasDaAcademia]
  );

  const turmaPorId = useMemo(() => {
    const map = new Map();
    turmas.forEach((turma) => map.set(turma.id, turma));
    return map;
  }, [turmas]);

  const hoje = useMemo(() => new Date().toISOString().split('T')[0], []);

  const aulasDeHoje = useMemo(() => {
    return aulas
      .filter((aula) => aula.data === hoje)
      .filter((aula) => turmaPorId.get(aula.turmaId)?.academiaId === currentAcademiaId)
      .map((aula) => {
        const turma = turmaPorId.get(aula.turmaId);
        const presencasDaAula = presencas.filter((p) => p.aulaId === aula.id);
        const esperados = matriculasAtivas.filter(
          (matricula) => !matricula.turmaId || matricula.turmaId === aula.turmaId
        ).length;
        const presentes = presencasDaAula.filter((item) => item.status === 'PRESENTE').length;
        const pendentes = presencasDaAula.filter((item) => item.status === 'PENDENTE').length;
        return {
          aula,
          turma,
          esperados: Math.max(esperados, presencasDaAula.length),
          presentes,
          pendentes,
        };
      })
      .sort((a, b) => a.aula.horaInicio.localeCompare(b.aula.horaInicio));
  }, [aulas, currentAcademiaId, hoje, matriculasAtivas, presencas, turmaPorId]);

  const pendenciasRecentes = useMemo(() => {
    const hojeData = new Date(hoje);
    const limiteInferior = new Date(hojeData);
    limiteInferior.setDate(limiteInferior.getDate() - 7);

    return presencas
      .filter((presenca) => presenca.status === 'PENDENTE' && presenca.data)
      .map((presenca) => {
        const turma = turmaPorId.get(presenca.turmaId || presenca.treinoId);
        if (!turma || turma.academiaId !== currentAcademiaId) return null;
        const dataRegistro = new Date(presenca.data);
        if (Number.isNaN(dataRegistro.getTime())) return null;
        if (dataRegistro < limiteInferior || dataRegistro > hojeData) return null;
        const aula = presenca.aulaId ? aulas.find((item) => item.id === presenca.aulaId) : null;
        const aluno = alunos.find((item) => item.id === presenca.alunoId);
        return {
          id: presenca.id,
          turma,
          aula,
          aluno,
          data: presenca.data,
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.data) - new Date(a.data));
  }, [aulas, alunos, currentAcademiaId, hoje, presencas, turmaPorId]);

  const proximasGraduacoes = useMemo(() => {
    return graduacoes
      .filter((item) => item.status !== 'Concluído')
      .sort((a, b) => a.mesesRestantes - b.mesesRestantes)
      .slice(0, 3)
      .map((graduacao) => {
        const aluno = alunos.find((item) => item.id === graduacao.alunoId);
        const faixaSlug = normalizeFaixaSlug(graduacao.faixaAtual) || 'branca-adulto';
        const faixaConfig = getFaixaConfigBySlug(faixaSlug);
        return { graduacao, aluno, faixaConfig };
      });
  }, [alunos, graduacoes]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-6 text-bjj-gray-200">
        Carregando painel...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="space-y-3 rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/80 p-6 text-bjj-gray-200">
        <p className="text-sm font-semibold text-white">Erro ao carregar dashboard</p>
        <p className="text-sm text-bjj-gray-300">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className={`${cardBase} flex flex-col gap-4 border-bjj-gray-800/80 bg-gradient-to-br from-bjj-gray-950/90 to-bjj-black p-5`}>
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-300/80">Painel do professor</p>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h1 className="text-2xl font-semibold text-white">{user?.name || 'Instrutor'}</h1>
            <span className="rounded-full bg-bjj-gray-800/80 px-3 py-1 text-xs font-semibold text-bjj-gray-100">
              {academiaAtual?.nome || 'Academia'}
            </span>
          </div>
          <p className="text-sm text-bjj-gray-200">
            Hub diário de turmas, presenças pendentes e destaques dos alunos.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[{ label: 'Abrir chamada', href: '/presencas' }, { label: 'Ver alunos', href: '/alunos' }, { label: 'Ver graduações', href: '/graduacoes' }].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="rounded-full bg-bjj-red px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-red-600"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className={`${cardBase} space-y-4 border-bjj-gray-800/80 bg-bjj-gray-900/70 p-5 lg:col-span-2`}>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className={badge}>Treinos de hoje</p>
              <h3 className="text-xl font-semibold text-white">Presenças por turma</h3>
              <p className="text-sm text-bjj-gray-300">Filtrado automaticamente pela sua academia e data atual.</p>
            </div>
            <span className="rounded-full bg-bjj-gray-800/80 px-3 py-1 text-xs font-semibold text-bjj-gray-100">
              {hoje.split('-').reverse().join('/')}
            </span>
          </div>

          {aulasDeHoje.length === 0 && (
            <p className="rounded-2xl border border-dashed border-bjj-gray-800/70 bg-bjj-gray-900/60 p-4 text-sm text-bjj-gray-300">
              Nenhuma aula instância programada para hoje na sua academia.
            </p>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            {aulasDeHoje.map(({ aula, turma, esperados, presentes, pendentes }) => (
              <div
                key={aula.id}
                className="flex flex-col gap-3 rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/70 p-4 shadow-inner"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">{turma?.nome || 'Turma'}</p>
                    <p className="text-xs text-bjj-gray-300">{`${aula.horaInicio} - ${aula.horaFim}`}</p>
                  </div>
                  <span className="rounded-full bg-bjj-gray-800 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-bjj-gray-100">
                    {esperados} esperados
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-bjj-gray-800/80 py-2">
                    <p className="text-lg font-bold text-white">{presentes}</p>
                    <p className="text-[11px] uppercase tracking-wide text-green-300">Presentes</p>
                  </div>
                  <div className="rounded-xl bg-bjj-gray-800/80 py-2">
                    <p className="text-lg font-bold text-white">{pendentes}</p>
                    <p className="text-[11px] uppercase tracking-wide text-yellow-200">Pendentes</p>
                  </div>
                  <div className="rounded-xl bg-bjj-gray-800/80 py-2">
                    <p className="text-lg font-bold text-white">{Math.max(esperados - presentes - pendentes, 0)}</p>
                    <p className="text-[11px] uppercase tracking-wide text-bjj-gray-200">Restantes</p>
                  </div>
                </div>

                <Link
                  href={`/presencas?turmaId=${aula.turmaId}&data=${aula.data}`}
                  className="inline-flex items-center justify-center rounded-xl bg-bjj-red px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-red-600"
                >
                  Abrir chamada
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className={`${cardBase} space-y-4 border-bjj-gray-800/80 bg-gradient-to-b from-bjj-gray-900 to-bjj-black p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={badge}>Presenças pendentes</p>
              <h3 className="text-xl font-semibold text-white">Revisar últimos envios</h3>
            </div>
            <span className="rounded-full bg-bjj-gray-800 px-3 py-1 text-sm font-semibold text-white">
              {pendenciasRecentes.length}
            </span>
          </div>

          <div className="space-y-3">
            {pendenciasRecentes.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-1 rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/70 p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{item.aluno?.nome || 'Aluno'}</p>
                  <span className="text-[11px] uppercase tracking-wide text-bjj-gray-300">
                    {new Date(item.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')}
                  </span>
                </div>
                <p className="text-xs text-bjj-gray-300">{item.turma?.nome || 'Turma'} · {item.aula?.horaInicio || '--:--'}</p>
              </div>
            ))}

            {pendenciasRecentes.length === 0 && (
              <p className="rounded-2xl border border-dashed border-bjj-gray-800/70 bg-bjj-gray-900/60 p-4 text-sm text-bjj-gray-300">
                Nenhuma presença pendente nos últimos 7 dias.
              </p>
            )}
          </div>

          <Link
            href="/presencas?tab=pendencias"
            className="inline-flex items-center justify-center rounded-xl bg-bjj-red px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-red-600"
          >
            Ver pendências
          </Link>
        </div>
      </div>

      <div className={`${cardBase} space-y-4 border-bjj-gray-800/80 bg-bjj-gray-900/70 p-5`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={badge}>Destaques de alunos</p>
            <h3 className="text-xl font-semibold text-white">Próximas graduações</h3>
            <p className="text-sm text-bjj-gray-300">3 alunos mais próximos da próxima faixa ou grau.</p>
          </div>
          <Medal size={20} className="text-bjj-red" />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {proximasGraduacoes.map(({ graduacao, aluno, faixaConfig }) => (
            <div
              key={graduacao.id}
              className="flex flex-col gap-2 rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/70 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{graduacao.alunoNome || aluno?.nome}</p>
                  <p className="text-xs text-bjj-gray-300">{graduacao.faixaAtual}</p>
                </div>
                {faixaConfig && (
                  <BjjBeltStrip
                    className="scale-90"
                    faixaConfig={faixaConfig}
                    faixaSlug={faixaConfig.slug}
                    grauAtual={aluno?.graus ?? 0}
                  />
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-bjj-gray-200">
                <span className="rounded-full bg-bjj-gray-800 px-2 py-1 font-semibold text-white">
                  {graduacao.tipo === 'Grau' ? `${graduacao.grauAlvo}º grau` : graduacao.proximaFaixa}
                </span>
                <span className="text-bjj-gray-300">{graduacao.mesesRestantes} meses</span>
              </div>

              <p className="text-xs text-bjj-gray-300">
                Previsão: {new Date(graduacao.previsao).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}

          {proximasGraduacoes.length === 0 && (
            <p className="rounded-2xl border border-dashed border-bjj-gray-800/70 bg-bjj-gray-900/60 p-4 text-sm text-bjj-gray-300">
              Sem graduações previstas. Acompanhe os alunos em /graduacoes.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/graduacoes"
            className="rounded-full bg-bjj-red px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-red-600"
          >
            Ver todos em /graduacoes
          </Link>
          <Link
            href="/alunos"
            className="rounded-full bg-bjj-gray-800 px-4 py-2 text-sm font-semibold text-white ring-1 ring-bjj-gray-700 hover:-translate-y-0.5"
          >
            Ver alunos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isInstructor, isAdmin, roles } = useRole();
  const normalizedRoles = Array.isArray(roles) ? roles : [];
  const user = useUserStore((state) => state.user);
  const isProfessorLayout =
    isInstructor ||
    isAdmin ||
    normalizedRoles.includes(ROLE_KEYS.professor) ||
    normalizedRoles.includes(ROLE_KEYS.instrutor) ||
    Boolean(user?.instrutorId || user?.professorId);

  if (isProfessorLayout) {
    return <ProfessorDashboard />;
  }

  return <StudentDashboard />;
}
