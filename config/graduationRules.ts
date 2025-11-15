/**
 * Matriz de regras de graduação baseada em referências públicas da IBJJF e
 * ajustes internos da BJJ Academy. Cada faixa contém requisitos de tempo,
 * idade mínima e uma estimativa de aulas necessárias para evolução.
 */
export const GRADUATION_RULES = {
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
} as const;

export type GraduationRules = typeof GRADUATION_RULES;

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
] as const;
