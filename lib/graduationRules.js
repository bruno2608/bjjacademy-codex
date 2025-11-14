/**
 * Matriz de regras de graduação baseada em referências públicas da IBJJF.
 * Cada faixa possui a próxima faixa alvo, tempo mínimo recomendado e
 * prazos médios para concessão de cada grau. Os valores podem ser ajustados
 * posteriormente para refletir regras oficiais específicas da academia.
 */
export const GRADUATION_RULES = {
  Branca: {
    proximaFaixa: 'Azul',
    tempoFaixaMeses: 24,
    graus: [
      { numero: 1, tempoMinimoMeses: 3 },
      { numero: 2, tempoMinimoMeses: 6 },
      { numero: 3, tempoMinimoMeses: 9 },
      { numero: 4, tempoMinimoMeses: 12 }
    ]
  },
  Azul: {
    proximaFaixa: 'Roxa',
    tempoFaixaMeses: 24,
    graus: [
      { numero: 1, tempoMinimoMeses: 6 },
      { numero: 2, tempoMinimoMeses: 12 },
      { numero: 3, tempoMinimoMeses: 18 },
      { numero: 4, tempoMinimoMeses: 24 }
    ]
  },
  Roxa: {
    proximaFaixa: 'Marrom',
    tempoFaixaMeses: 18,
    graus: [
      { numero: 1, tempoMinimoMeses: 6 },
      { numero: 2, tempoMinimoMeses: 12 },
      { numero: 3, tempoMinimoMeses: 18 },
      { numero: 4, tempoMinimoMeses: 24 }
    ]
  },
  Marrom: {
    proximaFaixa: 'Preta',
    tempoFaixaMeses: 18,
    graus: [
      { numero: 1, tempoMinimoMeses: 6 },
      { numero: 2, tempoMinimoMeses: 12 },
      { numero: 3, tempoMinimoMeses: 18 },
      { numero: 4, tempoMinimoMeses: 24 }
    ]
  },
  Preta: {
    proximaFaixa: 'Coral',
    tempoFaixaMeses: 36,
    graus: [
      { numero: 1, tempoMinimoMeses: 36 },
      { numero: 2, tempoMinimoMeses: 72 },
      { numero: 3, tempoMinimoMeses: 96 },
      { numero: 4, tempoMinimoMeses: 120 },
      { numero: 5, tempoMinimoMeses: 144 },
      { numero: 6, tempoMinimoMeses: 168 }
    ]
  },
  Coral: {
    proximaFaixa: 'Vermelha',
    tempoFaixaMeses: 120,
    graus: []
  },
  Vermelha: {
    proximaFaixa: null,
    tempoFaixaMeses: 0,
    graus: []
  }
};

export const BELT_ORDER = ['Branca', 'Azul', 'Roxa', 'Marrom', 'Preta', 'Coral', 'Vermelha'];

export function getRuleForBelt(faixa) {
  return GRADUATION_RULES[faixa] || null;
}

export function getNextBelt(faixa) {
  const ordemAtual = BELT_ORDER.indexOf(faixa);
  if (ordemAtual === -1) return null;
  return BELT_ORDER[ordemAtual + 1] || null;
}

export function getMaxStripes(faixa) {
  const regra = getRuleForBelt(faixa);
  return regra?.graus?.length || 0;
}

function clampNumber(value, min = 0) {
  return value < min ? min : value;
}

/**
 * Calcula a próxima etapa de evolução (grau ou faixa) para um aluno
 * com base na faixa atual, quantidade de graus e tempo dedicado.
 */
export function calculateNextStep(aluno) {
  if (!aluno) return null;
  const regra = getRuleForBelt(aluno.faixa);
  if (!regra) return null;

  const maxGraus = getMaxStripes(aluno.faixa);
  const grausAtuais = Number(aluno.graus || 0);
  const mesesNaFaixa = Number(aluno.mesesNaFaixa || 0);

  if (maxGraus > 0 && grausAtuais < maxGraus) {
    const proximoGrauRegra = regra.graus[grausAtuais];
    const tempoNecessario = proximoGrauRegra?.tempoMinimoMeses || 0;
    const mesesRestantes = clampNumber(tempoNecessario - mesesNaFaixa);
    return {
      tipo: 'Grau',
      faixaAtual: aluno.faixa,
      grauAtual: grausAtuais,
      grauAlvo: proximoGrauRegra?.numero || grausAtuais + 1,
      tempoNecessario,
      mesesRestantes,
      descricao: `${proximoGrauRegra?.numero || grausAtuais + 1}º grau em ${aluno.faixa}`
    };
  }

  if (regra.proximaFaixa) {
    const tempoNecessario = regra.tempoFaixaMeses || 0;
    const mesesRestantes = clampNumber(tempoNecessario - mesesNaFaixa);
    return {
      tipo: 'Faixa',
      faixaAtual: aluno.faixa,
      proximaFaixa: regra.proximaFaixa,
      tempoNecessario,
      mesesRestantes,
      descricao: `${aluno.faixa} → ${regra.proximaFaixa}`
    };
  }

  return null;
}

export function addMonthsToDate(baseDate, months) {
  const reference = baseDate ? new Date(baseDate) : new Date();
  const resultado = new Date(reference.getTime());
  resultado.setMonth(resultado.getMonth() + months);
  return resultado;
}

export function estimateGraduationDate(aluno, mesesRestantes) {
  const months = clampNumber(mesesRestantes);
  const ultimaData = aluno?.dataUltimaGraduacao ? new Date(aluno.dataUltimaGraduacao) : null;
  const referencia = ultimaData && !Number.isNaN(ultimaData.getTime()) ? ultimaData : new Date();
  return addMonthsToDate(referencia, months).toISOString().split('T')[0];
}
