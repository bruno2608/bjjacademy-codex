'use client';

import { useMemo } from 'react';
import { Clock3, Medal, TrendingUp } from 'lucide-react';

import { BjjBeltProgressCard } from '@/components/bjj/BjjBeltProgressCard';
import { BjjBeltStrip } from '@/components/bjj/BjjBeltStrip';
import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils';
import { useAlunoDashboard } from '@/hooks/useAlunoDashboard';
import { useCurrentAluno } from '@/hooks/useCurrentAluno';
import { normalizeFaixaSlug } from '@/lib/alunoStats';
import { useGraduacoesStore } from '@/store/graduacoesStore';
import { iconColors, iconSizes } from '@/styles/iconTokens';

export default function EvolucaoPage() {
  const { aluno: alunoFromUser } = useCurrentAluno();
  const graduacoesPlanejadas = useGraduacoesStore((state) => state.graduacoes);

  const alunoId = alunoFromUser?.id;
  const {
    aluno,
    faixaConfig,
    grauAtual,
    aulasNoGrau,
    aulasMetaNoGrau,
    percentualProgresso,
    proximaGraduacaoLabel,
    proximaGraduacaoEstimativa,
    proximaGraduacaoPercentual,
    proximaGraduacaoAulasMinimas,
    proximaGraduacaoAulasRealizadas
  } = useAlunoDashboard(alunoId);

  const graduacoesDoAluno = useMemo(
    () => graduacoesPlanejadas.filter((item) => item.alunoId === (aluno?.id || alunoId)),
    [aluno?.id, alunoId, graduacoesPlanejadas]
  );

  const historicoGraduacoes = useMemo(() => {
    const historicoPlanos = graduacoesDoAluno.map((item) => ({
      id: item.id,
      tipo: item.tipo,
      faixa: item.tipo === 'Grau' ? item.faixaAtual : item.proximaFaixa || item.faixaAtual,
      faixaSlug: normalizeFaixaSlug(item.tipo === 'Grau' ? item.faixaAtual : item.proximaFaixa),
      grau: item.grauAlvo,
      data: item.previsao,
      instrutor: item.instrutor,
      descricao:
        item.tipo === 'Grau'
          ? `${item.grauAlvo}º grau em ${item.faixaAtual}`
          : `${item.faixaAtual} → ${item.proximaFaixa || 'próxima faixa'}`
    }));

    const historicoAluno = aluno?.historicoGraduacoes ?? alunoFromUser?.historicoGraduacoes ?? [];

    return [...historicoAluno, ...historicoPlanos].sort(
      (a, b) => (new Date(b.data || '').getTime() || 0) - (new Date(a.data || '').getTime() || 0)
    );
  }, [aluno?.historicoGraduacoes, alunoFromUser?.historicoGraduacoes, graduacoesDoAluno]);

  const faixaConfigAtual =
    faixaConfig || getFaixaConfigBySlug(aluno?.faixaSlug || alunoFromUser?.faixaSlug || 'branca-adulto');
  const grauAtualSafeguarded = grauAtual ?? faixaConfigAtual?.grausMaximos ?? 0;

  const resolverConfigFaixa = (valor) => {
    if (!valor) return undefined;
    const slug = normalizeFaixaSlug(valor);
    return getFaixaConfigBySlug(slug);
  };

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
          {faixaConfigAtual && (
            <div className="flex items-center gap-4 rounded-2xl border border-bjj-gray-800 bg-bjj-black/60 p-4">
              <div className="w-full max-w-2xl">
                <BjjBeltProgressCard
                  config={faixaConfigAtual}
                  grauAtual={grauAtualSafeguarded}
                  aulasFeitasNoGrau={aulasNoGrau ?? 0}
                  aulasMetaNoGrau={aulasMetaNoGrau}
                  className="scale-[0.95] md:scale-100 origin-center bg-bjj-gray-900/80 border-bjj-gray-800"
                />
              </div>
            </div>
          )}
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
              <Medal className={`${iconSizes.sm} ${iconColors.default}`} />
            </header>

            {historicoGraduacoes.length ? (
              <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical text-bjj-gray-100">
                {historicoGraduacoes.map((item, idx) => {
                  const isGrau = item.tipo === 'Grau';
                  const indicadorClasse = isGrau
                    ? 'border-bjj-red bg-bjj-red/15 text-bjj-red'
                    : 'border-amber-300 bg-amber-200/10 text-amber-200';
                  const faixaConfigItem =
                    resolverConfigFaixa(item.faixaSlug || item.faixa) || faixaConfigAtual;
                  const grauEvento = isGrau ? item.grau ?? 0 : grauAtualSafeguarded;
                  const faixaLabel = faixaConfigItem?.nome ?? item.faixa ?? 'Faixa não informada';
                  return (
                    <li key={item.id || idx}>
                      <div className="timeline-middle">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full border bg-bjj-black/60 ${indicadorClasse}`}
                        >
                          <Medal className={`${iconSizes.sm} ${iconColors.default}`} />
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
                                <span className="text-[10px] text-bjj-gray-300/90">{faixaLabel}</span>
                              </span>
                              {faixaConfigItem ? (
                                <div className="w-[160px]">
                                  <BjjBeltStrip
                                    config={faixaConfigItem}
                                    grauAtual={grauEvento}
                                    className="scale-[0.7] origin-left"
                                  />
                                </div>
                              ) : (
                                <span className="text-[11px] text-bjj-gray-300">Sem dados de faixa</span>
                              )}
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
                <TrendingUp className={`${iconSizes.sm} ${iconColors.default}`} />
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
                      width: `${Math.min(100, proximaGraduacaoPercentual ?? percentualProgresso ?? 0)}%`
                    }}
                  />
                </div>
                <p className="text-xs text-bjj-gray-300/80">
                  {proximaGraduacaoAulasRealizadas ?? aulasNoGrau}{' '}
                  aulas registradas
                  {proximaGraduacaoAulasMinimas ? ` de ${proximaGraduacaoAulasMinimas}` : ''}
                  {proximaGraduacaoEstimativa
                    ? ` · estimativa ${new Date(proximaGraduacaoEstimativa).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}`
                    : ''}
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
                  {proximaGraduacaoAulasRealizadas ?? aulasNoGrau}/
                  {proximaGraduacaoAulasMinimas ?? aulasMetaNoGrau}
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
