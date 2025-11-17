'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Activity, BarChart2, Medal, Clock3 } from 'lucide-react';
import FaixaVisual from '../../../components/graduacoes/FaixaVisual';
import { usePresencasStore } from '../../../store/presencasStore';
import { useAlunosStore } from '../../../store/alunosStore';
import useUserStore from '../../../store/userStore';
import { calculateNextStep, estimateGraduationDate } from '../../../lib/graduationRules';

export default function DashboardAlunoPage() {
  const { user } = useUserStore();
  const alunoId = user?.alunoId;
  const presencas = usePresencasStore((state) => state.presencas);
  const alunos = useAlunosStore((state) => state.alunos);

  const aluno = useMemo(() => alunos.find((item) => item.id === alunoId) || alunos[0], [alunoId, alunos]);
  const faixaAtual = aluno?.faixa || 'Branca';
  const graus = aluno?.graus || 0;
  const historicoGraduacoes = useMemo(
    () =>
      [...(aluno?.historicoGraduacoes || [])].sort(
        (a, b) => (new Date(b.data || '').getTime() || 0) - (new Date(a.data || '').getTime() || 0)
      ),
    [aluno?.historicoGraduacoes]
  );

  const stats = useMemo(() => {
    const registrosAluno = presencas.filter((item) => item.alunoId === aluno?.id);
    const presentes = registrosAluno.filter((item) => item.status === 'Presente').length;
    const faltas = registrosAluno.filter((item) => item.status === 'Ausente').length;
    const pendentes = registrosAluno.filter((item) => item.status === 'Pendente').length;
    return { presentes, faltas, pendentes };
  }, [aluno?.id, presencas]);

  const proximaMeta = useMemo(
    () => calculateNextStep(aluno || null, { presencas }),
    [aluno, presencas]
  );

  const progressoProximoGrau = useMemo(() => {
    const aulasNoGrau = aluno?.aulasNoGrauAtual || 0;
    const alvo = 20;
    const percent = Math.min(100, Math.round((aulasNoGrau / alvo) * 100));
    return { aulasNoGrau, alvo, percent };
  }, [aluno?.aulasNoGrauAtual]);

  const proximaGraduacaoLabel = useMemo(() => {
    if (!proximaMeta) return 'Em avaliação pela equipe';
    if (proximaMeta.tipo === 'Grau') {
      return `${proximaMeta.grauAlvo}º grau em ${proximaMeta.faixaAtual}`;
    }
    return `${proximaMeta.faixaAtual} → ${proximaMeta.proximaFaixa}`;
  }, [proximaMeta]);

  const proximaDataEstimada = useMemo(() => {
    if (!aluno || !proximaMeta || proximaMeta.mesesRestantes == null) return null;
    const estimada = estimateGraduationDate(aluno, proximaMeta.mesesRestantes);
    const parsed = new Date(estimada);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }, [aluno, proximaMeta]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-bjj-gray-800 bg-bjj-gray-900/60 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-300/80">Dashboard do aluno</p>
            <h1 className="text-2xl font-semibold">Bem-vindo, {aluno?.nome || 'Aluno'}!</h1>
            <p className="text-sm text-bjj-gray-200/80">Acompanhe sua jornada e próximas metas.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-bjj-gray-800 bg-bjj-black/60 p-3">
            <FaixaVisual faixa={faixaAtual} graus={graus} tamanho="lg" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">Sua faixa</p>
              <p className="text-sm font-semibold">{faixaAtual}</p>
              <p className="text-xs text-bjj-gray-300/80">{graus} grau(s)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[{
          title: 'Presenças recentes',
          value: stats.presentes,
          icon: Activity,
          color: 'text-green-400'
        },
        {
          title: 'Faltas registradas',
          value: stats.faltas,
          icon: BarChart2,
          color: 'text-bjj-red'
        },
        {
          title: 'Check-ins pendentes',
          value: stats.pendentes,
          icon: Clock3,
          color: 'text-yellow-300'
        },
        {
          title: 'Progresso do próximo grau',
          value: `${progressoProximoGrau.percent}%`,
          icon: Medal,
          color: 'text-bjj-white'
        }].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.35)]"
            >
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>{card.title}</span>
                <Icon size={18} className={card.color} />
              </div>
              <p className="mt-3 text-2xl font-bold">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)] lg:col-span-2">
          <header className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">Últimas presenças</p>
              <h3 className="text-lg font-semibold">Últimos registros</h3>
            </div>
            <Activity size={18} className="text-green-400" />
          </header>
          <ul className="divide-y divide-bjj-gray-800/70 text-sm">
            {presencas
              .filter((item) => item.alunoId === aluno?.id)
              .slice(-5)
              .reverse()
              .map((item) => (
                <li key={item.id} className="flex items-center justify-between py-2 text-bjj-gray-100">
                  <div>
                    <p className="font-semibold text-white">{item.tipoTreino}</p>
                    <p className="text-xs text-bjj-gray-300/80">
                      {item.data} · {item.hora || '—'}
                    </p>
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

        <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
          <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">Evolução</p>
          <h3 className="text-lg font-semibold">Acompanhe sua timeline</h3>
          <p className="mt-1 text-sm text-bjj-gray-300/80">
            Veja o histórico completo e as projeções de graduação na página dedicada de Evolução.
          </p>

          <div className="mt-4 space-y-3 rounded-xl border border-bjj-gray-800/70 bg-bjj-black/30 p-4 text-sm text-bjj-gray-100">
            <div className="flex items-center gap-3">
              <FaixaVisual faixa={faixaAtual} graus={graus} tamanho="md" />
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-bjj-gray-400">Próxima graduação</p>
                <p className="text-sm font-semibold text-white">{proximaGraduacaoLabel}</p>
                <p className="text-xs text-bjj-gray-300/80">
                  {proximaMeta?.aulasMinimasRequeridas
                    ? `${proximaMeta?.aulasRealizadasNoGrau || proximaMeta?.aulasRealizadasNaFaixa || 0}/${
                        proximaMeta?.aulasMinimasRequeridas
                      } aulas registradas`
                    : 'Aulas contabilizadas automaticamente pelo check-in'}
                  {proximaDataEstimada ? ` · estimativa ${proximaDataEstimada}` : ''}
                </p>
              </div>
            </div>
            <Link
              href="/evolucao"
              className="btn btn-sm w-full rounded-full border border-bjj-gray-700 bg-bjj-black text-xs font-semibold uppercase tracking-[0.15em] text-white"
            >
              Abrir linha do tempo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
