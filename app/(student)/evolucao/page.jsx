'use client';

import { useMemo } from 'react';
import { Medal, TrendingUp, Clock3 } from 'lucide-react';
import FaixaVisual from '../../../components/graduacoes/FaixaVisual';
import { calculateNextStep, estimateGraduationDate } from '../../../lib/graduationRules';
import { useAlunosStore } from '../../../store/alunosStore';
import { usePresencasStore } from '../../../store/presencasStore';
import useUserStore from '../../../store/userStore';

export default function EvolucaoPage() {
  const { user } = useUserStore();
  const alunoId = user?.alunoId;
  const alunos = useAlunosStore((state) => state.alunos);
  const presencas = usePresencasStore((state) => state.presencas);

  const aluno = useMemo(() => alunos.find((item) => item.id === alunoId) || alunos[0], [alunoId, alunos]);
  const historicoGraduacoes = useMemo(
    () =>
      [...(aluno?.historicoGraduacoes || [])].sort(
        (a, b) => (new Date(b.data || '').getTime() || 0) - (new Date(a.data || '').getTime() || 0)
      ),
    [aluno?.historicoGraduacoes]
  );

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
            <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-300/80">Evolução do aluno</p>
            <h1 className="text-2xl font-semibold">Progresso na graduação</h1>
            <p className="text-sm text-bjj-gray-200/80">Visualize seu histórico e projeções para os próximos passos.</p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-bjj-gray-800 bg-bjj-black/60 p-4">
            <FaixaVisual faixa={aluno?.faixa} graus={aluno?.graus} tamanho="lg" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">Faixa atual</p>
              <p className="text-sm font-semibold">{aluno?.faixa || '—'}</p>
              <p className="text-xs text-bjj-gray-300/80">{aluno?.graus || 0} grau(s)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">Linha do tempo</p>
                <h3 className="text-lg font-semibold">Histórico de graduações</h3>
              </div>
              <Medal size={18} className="text-bjj-red" />
            </header>

            {historicoGraduacoes.length ? (
              <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical text-bjj-gray-100">
                {historicoGraduacoes.map((item, idx) => {
                  const isGrau = item.tipo === 'Grau';
                  const indicadorClasse = isGrau
                    ? 'border-bjj-red bg-bjj-red/15 text-bjj-red'
                    : 'border-amber-300 bg-amber-200/10 text-amber-200';
                  return (
                    <li key={item.id || idx}>
                      <div className="timeline-middle">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full border bg-bjj-black/60 ${indicadorClasse}`}
                        >
                          <Medal size={18} />
                        </span>
                      </div>
                      <div className="timeline-end mb-6 w-full">
                        <div className="flex flex-col gap-1 rounded-xl bg-bjj-black/30 px-4 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.25)]">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white">
                              <span
                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${
                                  isGrau ? 'bg-bjj-red/15 text-bjj-red' : 'bg-bjj-gray-800/70 text-bjj-gray-100'
                                }`}
                              >
                                {isGrau ? `${item.grau}º grau` : 'Faixa'}
                                <span className="text-[10px] text-bjj-gray-300/90">{item.faixa}</span>
                              </span>
                              <span className="text-xs text-bjj-gray-200/80">Instrutor: {item.instrutor || 'Equipe BJJ Academy'}</span>
                            </div>
                            <span className="text-[12px] text-bjj-gray-300/80">{formatarData(item.data)}</span>
                          </div>
                          <p className="text-sm text-bjj-gray-100">{item.descricao || 'Atualização registrada'}</p>
                        </div>
                      </div>
                      {idx < historicoGraduacoes.length - 1 && <hr className="border-bjj-gray-800" />}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="rounded-xl border border-dashed border-bjj-gray-800/70 bg-bjj-black/30 px-4 py-5 text-sm text-bjj-gray-300/80">
                Ainda não há graduações registradas. Continue frequentando as aulas para liberar este histórico.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
            <header className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">Próxima meta</p>
                <h3 className="text-lg font-semibold">Projeção</h3>
              </div>
              <TrendingUp size={18} className="text-bjj-red" />
            </header>
            <div className="space-y-2 text-sm text-bjj-gray-100">
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
                      proximaMeta?.progressoAulasGrau ?? proximaMeta?.progressoAulasFaixa ?? progressoProximoGrau.percent
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
              <div className="flex items-center gap-2 rounded-lg bg-bjj-black/30 px-3 py-2 text-xs text-bjj-gray-200/80">
                <Clock3 size={14} className="text-bjj-red" />
                Check-ins fora do horário ficam pendentes até aprovação do professor.
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
            <header className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-400">Tempo na jornada</p>
                <h3 className="text-lg font-semibold">Resumo rápido</h3>
              </div>
              <Medal size={18} className="text-bjj-red" />
            </header>
            <div className="space-y-2 text-sm text-bjj-gray-100">
              <div className="flex items-center justify-between">
                <span>Início na academia</span>
                <span className="font-semibold text-white">{formatarData(aluno?.dataInicio)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Aulas concluídas no grau</span>
                <span className="font-semibold text-white">
                  {progressoProximoGrau.aulasNoGrau}/{proximaMeta?.aulasMinimasRequeridas || progressoProximoGrau.alvo}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Aulas desde a faixa atual</span>
                <span className="font-semibold text-white">{aluno?.aulasDesdeUltimaFaixa || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Última atualização</span>
                <span className="font-semibold text-white">
                  {historicoGraduacoes?.[0]?.descricao || 'Aguardando primeiro registro'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
