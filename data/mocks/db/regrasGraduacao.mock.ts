type RegraGraduacao = {
  id: string
  faixaSlug: string
  grau: number
  aulasMinimas: number
  tempoMinimoMeses: number
  metaAulasNoGrau: number
  observacoes?: string | null
}

const regra = (
  faixaSlug: string,
  grau: number,
  aulasMinimas: number,
  tempoMinimoMeses: number,
  metaAulasNoGrau: number,
  observacoes?: string,
): RegraGraduacao => ({
  id: `${faixaSlug}-g${grau}`,
  faixaSlug,
  grau,
  aulasMinimas,
  tempoMinimoMeses,
  metaAulasNoGrau,
  observacoes: observacoes ?? null,
})

export const regrasGraduacao: RegraGraduacao[] = [
  regra("branca-adulto", 1, 30, 6, 60),
  regra("branca-adulto", 2, 30, 6, 60),
  regra("branca-adulto", 3, 30, 6, 60),
  regra("branca-adulto", 4, 30, 6, 60),
  regra("azul", 1, 50, 6, 110),
  regra("azul", 2, 50, 6, 110),
  regra("azul", 3, 50, 6, 110),
  regra("azul", 4, 50, 6, 110),
  regra("roxa", 1, 60, 6, 120),
  regra("roxa", 2, 60, 6, 120),
  regra("roxa", 3, 60, 6, 120),
  regra("roxa", 4, 60, 6, 120),
  regra("marrom", 1, 70, 6, 140),
  regra("marrom", 2, 70, 6, 140),
  regra("marrom", 3, 70, 6, 140),
  regra("marrom", 4, 70, 6, 140),
  regra("preta-padrao", 0, 0, 0, 0, "Faixa preta sem graus básicos"),
  regra("preta-professor", 0, 0, 0, 0, "Professor"),
]
