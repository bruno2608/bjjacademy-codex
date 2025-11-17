export type StripeRule = {
  numero: number;
  tempoMinimoMeses: number;
  aulasMinimas: number;
};

export type GraduationRule = {
  categoria: 'Infantil' | 'Adulto';
  metodoGraus: 'manual' | 'mensal';
  proximaFaixa: string | null;
  tempoFaixaMeses: number;
  tempoMinimoMeses: number;
  idadeMinima: number;
  aulasMinimasFaixa: number;
  graus: StripeRule[];
  descricao?: string;
  corFaixa: string;
  corBarra: string;
  corPonteira: string;
  infantil?: boolean;
};

export type GraduationRules = Record<string, GraduationRule>;

const cloneStripes = (template: StripeRule[]): StripeRule[] =>
  template.map((stripe) => ({ ...stripe }));

const STRIPES_48: StripeRule[] = [
  { numero: 1, tempoMinimoMeses: 3, aulasMinimas: 12 },
  { numero: 2, tempoMinimoMeses: 6, aulasMinimas: 24 },
  { numero: 3, tempoMinimoMeses: 9, aulasMinimas: 36 },
  { numero: 4, tempoMinimoMeses: 12, aulasMinimas: 48 }
];

const STRIPES_60: StripeRule[] = [
  { numero: 1, tempoMinimoMeses: 3, aulasMinimas: 15 },
  { numero: 2, tempoMinimoMeses: 6, aulasMinimas: 30 },
  { numero: 3, tempoMinimoMeses: 9, aulasMinimas: 45 },
  { numero: 4, tempoMinimoMeses: 12, aulasMinimas: 60 }
];

const STRIPES_72: StripeRule[] = [
  { numero: 1, tempoMinimoMeses: 4, aulasMinimas: 18 },
  { numero: 2, tempoMinimoMeses: 8, aulasMinimas: 36 },
  { numero: 3, tempoMinimoMeses: 12, aulasMinimas: 54 },
  { numero: 4, tempoMinimoMeses: 18, aulasMinimas: 72 }
];

const STRIPES_84: StripeRule[] = [
  { numero: 1, tempoMinimoMeses: 6, aulasMinimas: 21 },
  { numero: 2, tempoMinimoMeses: 12, aulasMinimas: 42 },
  { numero: 3, tempoMinimoMeses: 18, aulasMinimas: 63 },
  { numero: 4, tempoMinimoMeses: 24, aulasMinimas: 84 }
];

/**
 * Matriz de regras de graduação baseada em referências públicas da IBJJF e
 * ajustes internos da BJJ Academy. Cada faixa contém requisitos de tempo,
 * idade mínima e uma estimativa de aulas necessárias para evolução.
 */
export const GRADUATION_RULES: GraduationRules = {
  'Branca Infantil': {
    categoria: 'Infantil',
    metodoGraus: 'manual',
    proximaFaixa: 'Cinza e Branca',
    tempoFaixaMeses: 12,
    tempoMinimoMeses: 12,
    idadeMinima: 4,
    aulasMinimasFaixa: 48,
    descricao: 'Iniciação infantil com foco em disciplina e coordenação motora.',
    corFaixa: '#FFFFFF',
    corBarra: '#FFFFFF',
    corPonteira: '#000000',
    infantil: true,
    graus: cloneStripes(STRIPES_48)
  },
  'Cinza e Branca': {
    categoria: 'Infantil',
    metodoGraus: 'manual',
    proximaFaixa: 'Cinza',
    tempoFaixaMeses: 12,
    tempoMinimoMeses: 12,
    idadeMinima: 5,
    aulasMinimasFaixa: 48,
    descricao: 'Transição entre a faixa branca infantil e o primeiro ciclo cinza.',
    corFaixa: '#BDBDBD',
    corBarra: '#FFFFFF',
    corPonteira: '#000000',
    infantil: true,
    graus: cloneStripes(STRIPES_48)
  },
  Cinza: {
    categoria: 'Infantil',
    metodoGraus: 'manual',
    proximaFaixa: 'Cinza e Preta',
    tempoFaixaMeses: 12,
    tempoMinimoMeses: 12,
    idadeMinima: 6,
    aulasMinimasFaixa: 48,
    descricao: 'Faixa infantil de entrada com foco em disciplina básica e coordenação motora.',
    corFaixa: '#BFBFBF',
    corBarra: '#BFBFBF',
    corPonteira: '#000000',
    infantil: true,
    graus: cloneStripes(STRIPES_48)
  },
  'Cinza e Preta': {
    categoria: 'Infantil',
    metodoGraus: 'manual',
    proximaFaixa: 'Amarela e Branca',
    tempoFaixaMeses: 12,
    tempoMinimoMeses: 12,
    idadeMinima: 6,
    aulasMinimasFaixa: 48,
    descricao: 'Consolidação infantil com foco em atenção e postura em aula.',
    corFaixa: '#BDBDBD',
    corBarra: '#000000',
    corPonteira: '#000000',
    infantil: true,
    graus: cloneStripes(STRIPES_48)
  },
  'Amarela e Branca': {
    categoria: 'Infantil',
    metodoGraus: 'manual',
    proximaFaixa: 'Amarela',
    tempoFaixaMeses: 12,
    tempoMinimoMeses: 12,
    idadeMinima: 7,
    aulasMinimasFaixa: 60,
    descricao: 'Preparação para o ciclo amarelo com foco em agilidade.',
    corFaixa: '#FFEB3B',
    corBarra: '#FFFFFF',
    corPonteira: '#000000',
    infantil: true,
    graus: cloneStripes(STRIPES_60)
  },
  Amarela: {
    categoria: 'Infantil',
    metodoGraus: 'manual',
    proximaFaixa: 'Amarela e Preta',
    tempoFaixaMeses: 12,
    tempoMinimoMeses: 12,
    idadeMinima: 7,
    aulasMinimasFaixa: 60,
    descricao: 'Fase de consolidação de fundamentos com foco em agilidade e disciplina.',
    corFaixa: '#FFD900',
    corBarra: '#FFD900',
    corPonteira: '#000000',
    infantil: true,
    graus: cloneStripes(STRIPES_60)
  },
  'Amarela e Preta': {
    categoria: 'Infantil',
    metodoGraus: 'manual',
    proximaFaixa: 'Laranja e Branca',
    tempoFaixaMeses: 12,
    tempoMinimoMeses: 12,
    idadeMinima: 8,
    aulasMinimasFaixa: 60,
    descricao: 'Encerramento do ciclo amarelo com ênfase em reação e foco.',
    corFaixa: '#FFEB3B',
    corBarra: '#000000',
    corPonteira: '#000000',
    infantil: true,
    graus: cloneStripes(STRIPES_60)
  },
  'Laranja e Branca': {
    categoria: 'Infantil',
    metodoGraus: 'manual',
    proximaFaixa: 'Laranja',
    tempoFaixaMeses: 18,
    tempoMinimoMeses: 18,
    idadeMinima: 9,
    aulasMinimasFaixa: 72,
    descricao: 'Introdução ao ciclo laranja com foco em transições.',
    corFaixa: '#FF9800',
    corBarra: '#FFFFFF',
    corPonteira: '#000000',
    infantil: true,
    graus: cloneStripes(STRIPES_72)
  },
  Laranja: {
    categoria: 'Infantil',
    metodoGraus: 'manual',
    proximaFaixa: 'Laranja e Preta',
    tempoFaixaMeses: 18,
    tempoMinimoMeses: 18,
    idadeMinima: 10,
    aulasMinimasFaixa: 72,
    descricao: 'Estágio intermediário infantil com foco em transições e defesa.',
    corFaixa: '#FF7A00',
    corBarra: '#FF7A00',
    corPonteira: '#000000',
    infantil: true,
    graus: cloneStripes(STRIPES_72)
  },
  'Laranja e Preta': {
    categoria: 'Infantil',
    metodoGraus: 'manual',
    proximaFaixa: 'Verde e Branca',
    tempoFaixaMeses: 18,
    tempoMinimoMeses: 18,
    idadeMinima: 11,
    aulasMinimasFaixa: 72,
    descricao: 'Fechamento do ciclo laranja com foco em ritmo e controle.',
    corFaixa: '#FF9800',
    corBarra: '#000000',
    corPonteira: '#000000',
    infantil: true,
    graus: cloneStripes(STRIPES_72)
  },
  'Verde e Branca': {
    categoria: 'Infantil',
    metodoGraus: 'manual',
    proximaFaixa: 'Verde',
    tempoFaixaMeses: 24,
    tempoMinimoMeses: 24,
    idadeMinima: 12,
    aulasMinimasFaixa: 84,
    descricao: 'Preparação para a transição ao sistema adulto com foco em estratégia.',
    corFaixa: '#0FA958',
    corBarra: '#FFFFFF',
    corPonteira: '#000000',
    infantil: true,
    graus: cloneStripes(STRIPES_84)
  },
  Verde: {
    categoria: 'Infantil',
    metodoGraus: 'manual',
    proximaFaixa: 'Verde e Preta',
    tempoFaixaMeses: 24,
    tempoMinimoMeses: 24,
    idadeMinima: 13,
    aulasMinimasFaixa: 84,
    descricao: 'Preparação para a transição ao sistema adulto com foco em estratégia.',
    corFaixa: '#0FA958',
    corBarra: '#0FA958',
    corPonteira: '#000000',
    infantil: true,
    graus: cloneStripes(STRIPES_84)
  },
  'Verde e Preta': {
    categoria: 'Infantil',
    metodoGraus: 'manual',
    proximaFaixa: 'Branca',
    tempoFaixaMeses: 24,
    tempoMinimoMeses: 24,
    idadeMinima: 13,
    aulasMinimasFaixa: 84,
    descricao: 'Faixa final infantil antes da migração para o sistema adulto.',
    corFaixa: '#0FA958',
    corBarra: '#000000',
    corPonteira: '#000000',
    infantil: true,
    graus: cloneStripes(STRIPES_84)
  },
  Branca: {
    categoria: 'Adulto',
    metodoGraus: 'manual',
    proximaFaixa: 'Azul',
    tempoFaixaMeses: 24,
    tempoMinimoMeses: 24,
    idadeMinima: 16,
    aulasMinimasFaixa: 96,
    descricao: 'Entrada no sistema adulto com construção de base e disciplina diária.',
    corFaixa: '#FFFFFF',
    corBarra: '#000000',
    corPonteira: '#E10600',
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
    descricao: 'Consolidação de fundamentos ofensivos e defesas em situações reais.',
    corFaixa: '#0D47A1',
    corBarra: '#000000',
    corPonteira: '#E10600',
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
    descricao: 'Fase avançada com foco em refinamento técnico e domínio de ritmo.',
    corFaixa: '#673AB7',
    corBarra: '#000000',
    corPonteira: '#E10600',
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
    descricao: 'Transição para a faixa preta com foco em estratégia e liderança.',
    corFaixa: '#5D4037',
    corBarra: '#000000',
    corPonteira: '#E10600',
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
    proximaFaixa: null,
    tempoFaixaMeses: 36,
    tempoMinimoMeses: 36,
    idadeMinima: 21,
    aulasMinimasFaixa: 180,
    descricao: 'Excelência técnica com foco em ensino e representatividade da equipe.',
    corFaixa: '#000000',
    corBarra: '#000000',
    corPonteira: '#E10600',
    graus: [
      { numero: 1, tempoMinimoMeses: 36, aulasMinimas: 60 },
      { numero: 2, tempoMinimoMeses: 72, aulasMinimas: 120 },
      { numero: 3, tempoMinimoMeses: 96, aulasMinimas: 160 },
      { numero: 4, tempoMinimoMeses: 120, aulasMinimas: 200 },
      { numero: 5, tempoMinimoMeses: 144, aulasMinimas: 240 },
      { numero: 6, tempoMinimoMeses: 168, aulasMinimas: 280 }
    ]
  }
};

export const BELT_ORDER = [
  'Branca Infantil',
  'Cinza e Branca',
  'Cinza',
  'Cinza e Preta',
  'Amarela e Branca',
  'Amarela',
  'Amarela e Preta',
  'Laranja e Branca',
  'Laranja',
  'Laranja e Preta',
  'Verde e Branca',
  'Verde',
  'Verde e Preta',
  'Branca',
  'Azul',
  'Roxa',
  'Marrom',
  'Preta'
] as const;
