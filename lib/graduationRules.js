/**
 * Matriz de regras de graduação baseada em referências públicas da IBJJF e
 * ajustes internos da BJJ Academy. Cada faixa contém requisitos de tempo,
 * idade mínima e uma estimativa de aulas necessárias para evolução.
 * Os dados atendem tanto às faixas infantis quanto adultas.
 */
export const GRADUATION_RULES = {
  // Faixas infantis
  Cinza: {
    categoria: 'Infantil',
    metodoGraus: 'manual',
    proximaFaixa: 'Amarela',
    tempoFaixaMeses: 12,
    tempoMinimoMeses: 12,
    idadeMinima: 4,
    aulasMinimasFaixa: 48,
    graus: [
      { numero: 1, tempoMinimoMeses: 3, aulasMinimas: 12 },
      { numero: 2, tempoMinimoMeses: 6, aulasMinimas: 24 },
      { numero: 3, tempoMinimoMeses: 9, aulasMinimas: 36 },
      { numero: 4, tempoMinimoMeses: 12, aulasMinimas: 48 }
    ]
  },
  Amarela: {
    categoria: 'Infantil',
    metodoGraus: 'manual',
    proximaFaixa: 'Laranja',
    tempoFaixaMeses: 12,
    tempoMinimoMeses: 12,
    idadeMinima: 7,
    aulasMinimasFaixa: 60,
    graus: [
      { numero: 1, tempoMinimoMeses: 3, aulasMinimas: 15 },
      { numero: 2, tempoMinimoMeses: 6, aulasMinimas: 30 },
      { numero: 3, tempoMinimoMeses: 9, aulasMinimas: 45 },
      { numero: 4, tempoMinimoMeses: 12, aulasMinimas: 60 }
    ]
  },
  Laranja: {
    categoria: 'Infantil',
    metodoGraus: 'manual',
    proximaFaixa: 'Verde',
    tempoFaixaMeses: 18,
    tempoMinimoMeses: 18,
    idadeMinima: 10,
    aulasMinimasFaixa: 72,
    graus: [
      { numero: 1, tempoMinimoMeses: 4, aulasMinimas: 18 },
      { numero: 2, tempoMinimoMeses: 8, aulasMinimas: 36 },
      { numero: 3, tempoMinimoMeses: 12, aulasMinimas: 54 },
      { numero: 4, tempoMinimoMeses: 18, aulasMinimas: 72 }
    ]
  },
  Verde: {
    categoria: 'Infantil',
    metodoGraus: 'manual',
    proximaFaixa: 'Azul',
    tempoFaixaMeses: 24,
    tempoMinimoMeses: 24,
    idadeMinima: 13,
    aulasMinimasFaixa: 84,
    graus: [
      { numero: 1, tempoMinimoMeses: 6, aulasMinimas: 21 },
      { numero: 2, tempoMinimoMeses: 12, aulasMinimas: 42 },
      { numero: 3, tempoMinimoMeses: 18, aulasMinimas: 63 },
      { numero: 4, tempoMinimoMeses: 24, aulasMinimas: 84 }
    ]
  },
  // Faixas adultas
  Branca: {
    categoria: 'Adulto',
    metodoGraus: 'manual',
    proximaFaixa: 'Azul',
    tempoFaixaMeses: 24,
    tempoMinimoMeses: 24,
    idadeMinima: 16,
    aulasMinimasFaixa: 96,
    graus: [
      { numero: 1, tempoMinimoMeses: 3, aulasMinimas: 24 },
      { numero: 2, tempoMinimoMeses: 6, aulasMinimas: 48 },
      { numero: 3, tempoMinimoMeses: 9, aulasMinimas: 72 },
      { numero: 4, tempoMinimoMeses: 12, aulasMinimas: 96 }
    ]
  },
  Azul: {
    categoria: 'Adulto',
    metodoGraus: 'manual',
    proximaFaixa: 'Roxa',
    tempoFaixaMeses: 24,
    tempoMinimoMeses: 24,
    idadeMinima: 16,
    aulasMinimasFaixa: 110,
    graus: [
      { numero: 1, tempoMinimoMeses: 6, aulasMinimas: 30 },
      { numero: 2, tempoMinimoMeses: 12, aulasMinimas: 60 },
      { numero: 3, tempoMinimoMeses: 18, aulasMinimas: 85 },
      { numero: 4, tempoMinimoMeses: 24, aulasMinimas: 110 }
    ]
  },
  Roxa: {
    categoria: 'Adulto',
    metodoGraus: 'manual',
    proximaFaixa: 'Marrom',
    tempoFaixaMeses: 18,
    tempoMinimoMeses: 18,
    idadeMinima: 18,
    aulasMinimasFaixa: 120,
    graus: [
      { numero: 1, tempoMinimoMeses: 6, aulasMinimas: 35 },
      { numero: 2, tempoMinimoMeses: 12, aulasMinimas: 70 },
      { numero: 3, tempoMinimoMeses: 18, aulasMinimas: 95 },
      { numero: 4, tempoMinimoMeses: 24, aulasMinimas: 120 }
    ]
  },
  Marrom: {
    categoria: 'Adulto',
    metodoGraus: 'manual',
    proximaFaixa: 'Preta',
    tempoFaixaMeses: 18,
    tempoMinimoMeses: 18,
    idadeMinima: 19,
    aulasMinimasFaixa: 140,
    graus: [
      { numero: 1, tempoMinimoMeses: 6, aulasMinimas: 40 },
      { numero: 2, tempoMinimoMeses: 12, aulasMinimas: 80 },
      { numero: 3, tempoMinimoMeses: 18, aulasMinimas: 110 },
      { numero: 4, tempoMinimoMeses: 24, aulasMinimas: 140 }
    ]
  },
  Preta: {
    categoria: 'Adulto',
    metodoGraus: 'manual',
    proximaFaixa: 'Coral',
    tempoFaixaMeses: 36,
    tempoMinimoMeses: 36,
    idadeMinima: 21,
    aulasMinimasFaixa: 180,
    graus: [
      { numero: 1, tempoMinimoMeses: 36, aulasMinimas: 60 },
      { numero: 2, tempoMinimoMeses: 72, aulasMinimas: 120 },
      { numero: 3, tempoMinimoMeses: 96, aulasMinimas: 160 },
      { numero: 4, tempoMinimoMeses: 120, aulasMinimas: 200 },
      { numero: 5, tempoMinimoMeses: 144, aulasMinimas: 240 },
      { numero: 6, tempoMinimoMeses: 168, aulasMinimas: 280 }
    ]
  },
  Coral: {
    categoria: 'Adulto',
    metodoGraus: 'manual',
    proximaFaixa: 'Vermelha',
    tempoFaixaMeses: 120,
    tempoMinimoMeses: 120,
    idadeMinima: 50,
    aulasMinimasFaixa: 0,
    graus: []
  },
  Vermelha: {
    categoria: 'Adulto',
    metodoGraus: 'manual',
    proximaFaixa: null,
    tempoFaixaMeses: 0,
    tempoMinimoMeses: 0,
    idadeMinima: 56,
    aulasMinimasFaixa: 0,
    graus: []
  }
};

export const BELT_ORDER = [
  'Cinza',
  'Amarela',
  'Laranja',
  'Verde',
  'Branca',
  'Azul',
  'Roxa',
  'Marrom',
  'Preta',
  'Coral',
  'Vermelha'
];

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
  const numero = Number.isFinite(Number(value)) ? Number(value) : 0;
  return numero < min ? min : numero;
}

const parseISODate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const countAttendancesFrom = (registros, inicio) => {
  if (!inicio) return registros.length;
  const referencia = inicio.getTime();
  return registros.filter((item) => {
    const data = parseISODate(item.data);
    return data && data.getTime() >= referencia;
  }).length;
};

const getLatestHistoryRecord = (historico, predicate) => {
  if (!Array.isArray(historico)) return null;
  return historico
    .filter((item) => predicate(item) && parseISODate(item.data))
    .sort((a, b) => parseISODate(b.data) - parseISODate(a.data))[0] || null;
};

const buildAttendanceStats = (aluno, presencas = []) => {
  const registrosAluno = presencas.filter(
    (item) => item.alunoId === aluno.id && item.status === 'Presente'
  );
  const totalAulas = registrosAluno.length;

  const historico = Array.isArray(aluno.historicoGraduacoes)
    ? aluno.historicoGraduacoes
    : [];
  const faixaAtual = aluno.faixa;
  const grauAtual = Number(aluno.graus || 0);

  const ultimoRegistroFaixa = getLatestHistoryRecord(
    historico,
    (item) => item.tipo === 'Faixa' && item.faixa === faixaAtual
  );
  const inicioFaixa =
    parseISODate(ultimoRegistroFaixa?.data) ||
    parseISODate(aluno.dataUltimaGraduacao) ||
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

const getAttendanceStats = (aluno, context = {}) => {
  const statsFromAluno = {
    totalAulas: Number(aluno.aulasTotais || aluno.totalAulas || 0),
    aulasDesdeUltimaFaixa: Number(aluno.aulasDesdeUltimaFaixa || aluno.aulasNaFaixa || 0),
    aulasNoGrauAtual: Number(aluno.aulasNoGrauAtual || aluno.aulasNoGrau || 0)
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

/**
 * Calcula a próxima etapa de evolução (grau ou faixa) para um aluno com base nas regras
 * e adiciona o acompanhamento de aulas concluídas até o momento.
 */
export function calculateNextStep(aluno, context = {}) {
  if (!aluno) return null;
  const regra = getRuleForBelt(aluno.faixa);
  if (!regra) return null;

  const stats = getAttendanceStats(aluno, context);
  const maxGraus = getMaxStripes(aluno.faixa);
  const grausAtuais = Number(aluno.graus || 0);
  const mesesNaFaixa = Number(aluno.mesesNaFaixa || 0);
  const aulasMinimasFaixa = Number(regra.aulasMinimasFaixa || 0);
  const aulasRestantesFaixa = clampNumber(aulasMinimasFaixa - stats.aulasDesdeUltimaFaixa);

  if (maxGraus > 0 && grausAtuais < maxGraus) {
    const proximoGrauRegra = regra.graus[grausAtuais];
    const tempoNecessario = Number(proximoGrauRegra?.tempoMinimoMeses || regra.tempoMinimoMeses || 0);
    const mesesRestantes = clampNumber(tempoNecessario - mesesNaFaixa);
    const aulasMinimasGrau = Number(proximoGrauRegra?.aulasMinimas || 0);
    const aulasRestantesGrau = clampNumber(aulasMinimasGrau - stats.aulasNoGrauAtual);

    return {
      tipo: 'Grau',
      faixaAtual: aluno.faixa,
      grauAtual: grausAtuais,
      grauAlvo: proximoGrauRegra?.numero || grausAtuais + 1,
      tempoNecessario,
      mesesRestantes,
      descricao: `${proximoGrauRegra?.numero || grausAtuais + 1}º grau em ${aluno.faixa}`,
      aulasMinimasRequeridas: aulasMinimasGrau,
      aulasRealizadasNoGrau: stats.aulasNoGrauAtual,
      aulasRestantesGrau,
      aulasRealizadasNaFaixa: stats.aulasDesdeUltimaFaixa,
      aulasRestantesFaixa,
      aulasTotais: stats.totalAulas,
      progressoAulasGrau: aulasMinimasGrau
        ? Math.min(Math.round((stats.aulasNoGrauAtual / aulasMinimasGrau) * 100), 100)
        : null,
      progressoAulasFaixa: aulasMinimasFaixa
        ? Math.min(Math.round((stats.aulasDesdeUltimaFaixa / aulasMinimasFaixa) * 100), 100)
        : null,
      idadeMinima: regra.idadeMinima || null,
      metodoGraus: regra.metodoGraus || 'manual'
    };
  }

  if (regra.proximaFaixa) {
    const tempoNecessario = Number(regra.tempoFaixaMeses || regra.tempoMinimoMeses || 0);
    const mesesRestantes = clampNumber(tempoNecessario - mesesNaFaixa);

    return {
      tipo: 'Faixa',
      faixaAtual: aluno.faixa,
      proximaFaixa: regra.proximaFaixa,
      tempoNecessario,
      mesesRestantes,
      descricao: `${aluno.faixa} → ${regra.proximaFaixa}`,
      aulasMinimasRequeridas: aulasMinimasFaixa,
      aulasRealizadasNaFaixa: stats.aulasDesdeUltimaFaixa,
      aulasRestantesFaixa,
      aulasTotais: stats.totalAulas,
      progressoAulasFaixa: aulasMinimasFaixa
        ? Math.min(Math.round((stats.aulasDesdeUltimaFaixa / aulasMinimasFaixa) * 100), 100)
        : null,
      idadeMinima: regra.idadeMinima || null,
      metodoGraus: regra.metodoGraus || 'manual'
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
