'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Activity, BarChart2, Medal, Clock3, TrendingUp } from 'lucide-react';
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

  const tempoNaFaixaTexto = useMemo(() => {
    const meses = aluno?.mesesNaFaixa ?? 0;
    if (meses <= 0) return 'menos de 1 mês';
    const anos = Math.floor(meses / 12);
    const mesesRestantes = meses % 12;
    const partes = [];
    if (anos > 0) partes.push(`${anos} ${anos === 1 ? 'ano' : 'anos'}`);
    if (mesesRestantes > 0) partes.push(`${mesesRestantes} ${mesesRestantes === 1 ? 'mês' : 'meses'}`);
    return partes.join(' e ');
  }, [aluno?.mesesNaFaixa]);

  const mediaGraduacoesMeses = useMemo(() => {
    if (!historicoGraduacoes.length) return null;
    const registrosDatados = historicoGraduacoes.filter((item) => item.data);
    if (registrosDatados.length < 2) return null;
    let somaDiferencas = 0;
    let contagem = 0;
    for (let i = 0; i < registrosDatados.length - 1; i++) {
      const atual = new Date(registrosDatados[i].data);
      const prox = new Date(registrosDatados[i + 1].data);
      if (Number.isNaN(atual.getTime()) || Number.isNaN(prox.getTime())) continue;
      const diffMs = Math.abs(atual.getTime() - prox.getTime());
      somaDiferencas += diffMs;
      contagem += 1;
    }
    if (!contagem) return null;
    const mediaMeses = Math.round(somaDiferencas / contagem / (1000 * 60 * 60 * 24 * 30));
    return mediaMeses;
  }, [historicoGraduacoes]);

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

  const formatarData = (valor) => {
    if (!valor) return '—';
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return valor;
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

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
          <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">Evolução e histórico</p>
              <h3 className="text-lg font-semibold">Acompanhe sua jornada</h3>
            </div>
            <Link href="/evolucao" className="btn btn-sm rounded-full border border-bjj-gray-700 bg-bjj-black text-xs font-semibold uppercase tracking-[0.15em] text-white">
              Ver timeline completa
            </Link>
          </header>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-black/30 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <div className="w-full max-w-xs">
                  <FaixaVisual faixa={faixaAtual} graus={graus} tamanho="lg" />
                </div>
                <div className="space-y-1 text-sm text-bjj-gray-100">
                  <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">Faixa</p>
                  <p className="text-lg font-semibold text-white">{faixaAtual}</p>
                  <p className="text-xs text-bjj-gray-300/80">{graus} grau(s) · Treinando desde {formatarData(aluno?.dataInicio)}</p>
                </div>
              </div>

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between text-bjj-gray-200/80">
                  <span>Próxima graduação</span>
                  <span className="font-semibold text-white">{proximaGraduacaoLabel}</span>
                </div>
                <div className="h-2 rounded-full bg-bjj-gray-800">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-bjj-red to-red-500"
                    style={{
                      width: `${Math.min(
                        100,
                        proximaMeta?.progressoAulasGrau ??
                          proximaMeta?.progressoAulasFaixa ??
                          progressoProximoGrau.percent
                      )}%`
                    }}
                  />
                </div>
                <p className="text-xs text-bjj-gray-300/80">
                  {proximaMeta?.aulasRealizadasNoGrau || proximaMeta?.aulasRealizadasNaFaixa || progressoProximoGrau.aulasNoGrau}
                  {' '}
                  aulas registradas {proximaMeta?.aulasMinimasRequeridas ? `de ${proximaMeta?.aulasMinimasRequeridas}` : ''}
                  {proximaDataEstimada ? ` · estimativa ${proximaDataEstimada}` : ''}
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs text-bjj-gray-300/90">
                  <div className="rounded-lg border border-bjj-gray-800/70 bg-bjj-gray-900/40 p-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">Tempo na faixa</p>
                    <p className="text-sm font-semibold text-white">{tempoNaFaixaTexto}</p>
                  </div>
                  <div className="rounded-lg border border-bjj-gray-800/70 bg-bjj-gray-900/40 p-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">Média entre graduações</p>
                    <p className="text-sm font-semibold text-white">
                      {mediaGraduacoesMeses ? `${mediaGraduacoesMeses} mês(es)` : 'Aguardando histórico'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-black/30 p-4">
              <div className="mb-3 flex items-center justify-between text-sm text-bjj-gray-300/90">
                <span className="font-semibold text-white">Histórico rápido</span>
                <TrendingUp size={16} className="text-bjj-red" />
              </div>
              {historicoGraduacoes.length ? (
                <div className="relative space-y-3 border-l border-bjj-gray-800/80 pl-5">
                  {historicoGraduacoes.slice(0, 3).map((item, idx) => (
                    <div key={item.id || idx} className="relative text-sm">
                      <span className="absolute -left-[8px] top-1 h-2.5 w-2.5 rounded-full bg-bjj-red shadow-[0_0_0_3px_rgba(255,255,255,0.06)]" />
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${
                                item.tipo === 'Grau'
                                  ? 'bg-bjj-red/15 text-bjj-red'
                                  : 'bg-bjj-gray-800/70 text-bjj-gray-100'
                              }`}
                            >
                              {item.tipo === 'Grau' ? `${item.grau}º grau` : 'Faixa'}
                              <span className="text-[10px] text-bjj-gray-300/90">{item.faixa}</span>
                            </span>
                            <span className="text-[12px] text-bjj-gray-300/80">{formatarData(item.data)}</span>
                          </div>
                          <p className="text-bjj-gray-100">{item.descricao || 'Atualização registrada'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-bjj-gray-300/80">
                  Ainda não há graduações registradas. Acesse a timeline completa quando os registros forem liberados.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-5">
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
      </div>
    </div>
  );
}
