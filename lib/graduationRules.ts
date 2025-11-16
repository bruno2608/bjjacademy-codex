import {
  BELT_ORDER,
  GRADUATION_RULES,
  type GraduationRule,
  type GraduationRules as GraduationRulesMap
} from '../config/graduationRules';
import type { Aluno } from '../types/aluno';
import type { Presenca } from '../types/presenca';
import type {
  GraduationHistoryEntry,
  GraduationRecommendation,
  GraduationRecommendationFaixa,
  GraduationRecommendationGrau
} from '../types/graduacao';

export { GRADUATION_RULES, BELT_ORDER };

export type BeltKey = keyof GraduationRulesMap;
export type BeltRule = GraduationRule;

export function getRuleForBelt(faixa: string): BeltRule | null {
  return (GRADUATION_RULES as GraduationRulesMap)[faixa] ?? null;
}

export function getNextBelt(faixa: string): string | null {
  const ordemAtual = BELT_ORDER.indexOf(faixa as (typeof BELT_ORDER)[number]);
  if (ordemAtual === -1) return null;
  return BELT_ORDER[ordemAtual + 1] ?? null;
}

export function getMaxStripes(faixa: string): number {
  const regra = getRuleForBelt(faixa);
  return regra?.graus?.length ?? 0;
}

function clampNumber(value: number | string | null | undefined, min = 0): number {
  const numero = Number.isFinite(Number(value)) ? Number(value) : 0;
  return numero < min ? min : numero;
}

const parseISODate = (value: string | null | undefined): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const countAttendancesFrom = (registros: Presenca[], inicio: Date | null): number => {
  if (!inicio) return registros.length;
  const referencia = inicio.getTime();
  return registros.filter((item) => {
    const data = parseISODate(item.data);
    return data !== null && data.getTime() >= referencia;
  }).length;
};

const getLatestHistoryRecord = (
  historico: GraduationHistoryEntry[] | undefined,
  predicate: (entry: GraduationHistoryEntry) => boolean
): GraduationHistoryEntry | null => {
  if (!Array.isArray(historico)) return null;
  return (
    historico
      .filter((item) => predicate(item) && parseISODate(item.data))
      .sort((a, b) => {
        const dataA = parseISODate(a.data)?.getTime() ?? 0;
        const dataB = parseISODate(b.data)?.getTime() ?? 0;
        return dataB - dataA;
      })[0] ?? null
  );
};

const buildAttendanceStats = (aluno: Aluno, presencas: Presenca[] = []) => {
  const registrosAluno = presencas.filter(
    (item) => item.alunoId === aluno.id && item.status === 'Presente'
  );
  const totalAulas = registrosAluno.length;

  const historico = Array.isArray(aluno.historicoGraduacoes)
    ? aluno.historicoGraduacoes
    : [];
  const faixaAtual = aluno.faixa;
  const grauAtual = Number(aluno.graus ?? 0);

  const ultimoRegistroFaixa = getLatestHistoryRecord(
    historico,
    (item) => item.tipo === 'Faixa' && item.faixa === faixaAtual
  );
  const inicioFaixa =
    parseISODate(ultimoRegistroFaixa?.data) ||
    parseISODate(aluno.dataUltimaGraduacao ?? undefined) ||
    parseISODate(aluno.dataInicio);

  const aulasDesdeFaixa = countAttendancesFrom(registrosAluno, inicioFaixa);

  const ultimoRegistroGrau = getLatestHistoryRecord(
    historico,
    (item) => item.tipo === 'Grau' && item.faixa === faixaAtual && Number(item.grau) === grauAtual
  );
  const inicioGrau = grauAtual > 0 ? parseISODate(ultimoRegistroGrau?.data) || inicioFaixa : inicioFaixa;
  const aulasNoGrauAtual = countAttendancesFrom(registrosAluno, inicioGrau);

  return {
    totalAulas,
    aulasDesdeUltimaFaixa: aulasDesdeFaixa,
    aulasNoGrauAtual
  };
};

const getAttendanceStats = (
  aluno: Aluno,
  context: { presencas?: Presenca[] } = {}
): { totalAulas: number; aulasDesdeUltimaFaixa: number; aulasNoGrauAtual: number } => {
  const statsFromAluno = {
    totalAulas: Number(aluno.aulasTotais ?? aluno.totalAulas ?? 0),
    aulasDesdeUltimaFaixa: Number(aluno.aulasDesdeUltimaFaixa ?? aluno.aulasNaFaixa ?? 0),
    aulasNoGrauAtual: Number(aluno.aulasNoGrauAtual ?? aluno.aulasNoGrau ?? 0)
  };

  const presencas = Array.isArray(context.presencas) ? context.presencas : null;
  if (!presencas) {
    return statsFromAluno;
  }

  const calculadas = buildAttendanceStats(aluno, presencas);
  return {
    totalAulas: calculadas.totalAulas || statsFromAluno.totalAulas,
    aulasDesdeUltimaFaixa:
      calculadas.aulasDesdeUltimaFaixa || statsFromAluno.aulasDesdeUltimaFaixa,
    aulasNoGrauAtual: calculadas.aulasNoGrauAtual || statsFromAluno.aulasNoGrauAtual
  };
};

export function calculateNextStep(
  aluno: Aluno | null,
  context: { presencas?: Presenca[] } = {}
): GraduationRecommendation | null {
  if (!aluno) return null;
  const regra = getRuleForBelt(aluno.faixa);
  if (!regra) return null;

  const stats = getAttendanceStats(aluno, context);
  const maxGraus = getMaxStripes(aluno.faixa);
  const grausAtuais = Number(aluno.graus ?? 0);
  const mesesNaFaixa = Number(aluno.mesesNaFaixa ?? 0);
  const aulasMinimasFaixa = Number(regra.aulasMinimasFaixa ?? 0);
  const aulasRestantesFaixa = clampNumber(aulasMinimasFaixa - stats.aulasDesdeUltimaFaixa);

  if (maxGraus > 0 && grausAtuais < maxGraus) {
    const proximoGrauRegra = regra.graus[grausAtuais];
    const tempoNecessario = Number(proximoGrauRegra?.tempoMinimoMeses ?? regra.tempoMinimoMeses ?? 0);
    const mesesRestantes = clampNumber(tempoNecessario - mesesNaFaixa);
    const aulasMinimasGrau = Number(proximoGrauRegra?.aulasMinimas ?? 0);
    const aulasRestantesGrau = clampNumber(aulasMinimasGrau - stats.aulasNoGrauAtual);

    const recomendacao: GraduationRecommendationGrau = {
      tipo: 'Grau',
      faixaAtual: aluno.faixa,
      grauAtual: grausAtuais,
      grauAlvo: proximoGrauRegra?.numero ?? grausAtuais + 1,
      tempoNecessario,
      mesesRestantes,
      descricao: `${proximoGrauRegra?.numero ?? grausAtuais + 1}º grau em ${aluno.faixa}`,
      aulasMinimasRequeridas: aulasMinimasGrau || null,
      aulasRealizadasNoGrau: stats.aulasNoGrauAtual || null,
      aulasRestantesGrau: aulasRestantesGrau || null,
      aulasRealizadasNaFaixa: stats.aulasDesdeUltimaFaixa || null,
      aulasRestantesFaixa: aulasRestantesFaixa || null,
      aulasTotais: stats.totalAulas || null,
      progressoAulasGrau: aulasMinimasGrau
        ? Math.min(Math.round((stats.aulasNoGrauAtual / aulasMinimasGrau) * 100), 100)
        : null,
      progressoAulasFaixa: aulasMinimasFaixa
        ? Math.min(Math.round((stats.aulasDesdeUltimaFaixa / aulasMinimasFaixa) * 100), 100)
        : null,
      idadeMinima: regra.idadeMinima ?? null,
      metodoGraus: regra.metodoGraus ?? 'manual'
    };

    return recomendacao;
  }

  if (regra.proximaFaixa) {
    const tempoNecessario = Number(regra.tempoFaixaMeses ?? regra.tempoMinimoMeses ?? 0);
    const mesesRestantes = clampNumber(tempoNecessario - mesesNaFaixa);

    const recomendacao: GraduationRecommendationFaixa = {
      tipo: 'Faixa',
      faixaAtual: aluno.faixa,
      proximaFaixa: regra.proximaFaixa,
      tempoNecessario,
      mesesRestantes,
      descricao: `${aluno.faixa} → ${regra.proximaFaixa}`,
      aulasMinimasRequeridas: aulasMinimasFaixa || null,
      aulasRealizadasNaFaixa: stats.aulasDesdeUltimaFaixa || null,
      aulasRestantesFaixa: aulasRestantesFaixa || null,
      aulasTotais: stats.totalAulas || null,
      progressoAulasFaixa: aulasMinimasFaixa
        ? Math.min(Math.round((stats.aulasDesdeUltimaFaixa / aulasMinimasFaixa) * 100), 100)
        : null,
      idadeMinima: regra.idadeMinima ?? null,
      metodoGraus: regra.metodoGraus ?? 'manual'
    };

    return recomendacao;
  }

  return null;
}

export function addMonthsToDate(baseDate: string | Date | null | undefined, months: number): Date {
  const reference = baseDate ? new Date(baseDate) : new Date();
  const resultado = new Date(reference.getTime());
  resultado.setMonth(resultado.getMonth() + months);
  return resultado;
}

export function estimateGraduationDate(aluno: Aluno, mesesRestantes: number): string {
  const months = clampNumber(mesesRestantes);
  const ultimaData = aluno?.dataUltimaGraduacao ? new Date(aluno.dataUltimaGraduacao) : null;
  const referencia = ultimaData && !Number.isNaN(ultimaData.getTime()) ? ultimaData : new Date();
  return addMonthsToDate(referencia, months).toISOString().split('T')[0];
}
