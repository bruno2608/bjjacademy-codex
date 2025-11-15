/**
 * Serviço mock de graduações responsável por acompanhar o progresso dos alunos
 * rumo à próxima faixa. Permite atualizar status e agendar novas graduações.
 */
import { mockRequest } from './api';
import { useAlunosStore } from '../store/alunosStore';
import { useGraduacoesStore } from '../store/graduacoesStore';
import { usePresencasStore } from '../store/presencasStore';
import { calculateNextStep, estimateGraduationDate, getRuleForBelt } from '../lib/graduationRules';

const buildGraduacaoPayload = (aluno, input) => {
  const regra = getRuleForBelt(aluno?.faixa);
  const proximaFaixaRegra = regra?.proximaFaixa || null;
  const tipo = input?.tipo || 'Faixa';
  const instrutor = input?.instrutor || 'Equipe BJJ Academy';

  if (tipo === 'Grau') {
    const regraGrau = regra?.graus?.find((item) => item.numero === Number(input.grauAlvo));
    const criterioTempo =
      input.criterioTempo ||
      (regraGrau ? `Tempo mínimo: ${regraGrau.tempoMinimoMeses} meses` : 'Ajuste o tempo manualmente.');
    const mesesRestantes = Number.isFinite(Number(input.mesesRestantes))
      ? Number(input.mesesRestantes)
      : Math.max((regraGrau?.tempoMinimoMeses || 0) - Number(aluno.mesesNaFaixa || 0), 0);
    return {
      alunoId: aluno.id,
      alunoNome: aluno.nome,
      faixaAtual: aluno.faixa,
      proximaFaixa: aluno.faixa,
      tipo: 'Grau',
      grauAlvo: Number(input.grauAlvo),
      criterioTempo,
      mesesRestantes,
      previsao: input.previsao || estimateGraduationDate(aluno, mesesRestantes),
      instrutor,
      status: 'Planejado'
    };
  }

  const criterioTempo =
    input.criterioTempo ||
    (regra?.tempoFaixaMeses ? `Tempo mínimo: ${regra.tempoFaixaMeses} meses` : 'Ajuste o tempo manualmente.');
  const mesesRestantesFaixa = Number.isFinite(Number(input.mesesRestantes))
    ? Number(input.mesesRestantes)
    : Math.max((regra?.tempoFaixaMeses || 0) - Number(aluno.mesesNaFaixa || 0), 0);

  return {
    alunoId: aluno.id,
    alunoNome: aluno.nome,
    faixaAtual: aluno.faixa,
    proximaFaixa: input.proximaFaixa || proximaFaixaRegra || aluno.faixa,
    tipo: 'Faixa',
    grauAlvo: null,
    criterioTempo,
    mesesRestantes: mesesRestantesFaixa,
    previsao: input.previsao || estimateGraduationDate(aluno, mesesRestantesFaixa),
    instrutor,
    status: 'Planejado'
  };
};

export async function getGraduacoes() {
  const { graduacoes } = useGraduacoesStore.getState();
  return mockRequest(graduacoes);
}

export async function scheduleGraduacao(payload) {
  const alunosStore = useAlunosStore.getState();
  const graduacoesStore = useGraduacoesStore.getState();
  const aluno = alunosStore.alunos.find((item) => item.id === payload.alunoId);
  const dadosGraduacao = aluno ? buildGraduacaoPayload(aluno, payload) : payload;
  const novaGraduacao = { ...dadosGraduacao, id: `graduation-${Date.now()}` };
  const atualizadas = [...graduacoesStore.graduacoes, novaGraduacao].sort((a, b) => {
    const dataA = new Date(a.previsao).getTime();
    const dataB = new Date(b.previsao).getTime();
    return dataA - dataB;
  });
  graduacoesStore.setGraduacoes(atualizadas);
  return mockRequest(novaGraduacao);
}

export async function updateGraduacao(id, data) {
  const graduacoesStore = useGraduacoesStore.getState();
  graduacoesStore.updateGraduacaoStatus(id, data);
  const atualizada = graduacoesStore.graduacoes.find((item) => item.id === id);
  if (data.status === 'Concluído' && atualizada) {
    graduacoesStore.applyGraduacaoConclusao(atualizada);
  }
  return mockRequest(atualizada);
}

export function getGraduationRecommendation(aluno) {
  const presencas = usePresencasStore.getState().presencas;
  const recomendacao = calculateNextStep(aluno, { presencas });
  if (!recomendacao) return null;
  const previsao = estimateGraduationDate(aluno, recomendacao.mesesRestantes || 0);
  return { ...recomendacao, previsao };
}
