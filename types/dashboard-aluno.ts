export interface DashboardAlunoHeroAlunoDTO {
  id: string
  nome: string
  avatarUrl: string | null

  statusMatricula: "ATIVO" | "INATIVO" | "TRANCADO"

  academiaNome: string
  academiaCidade?: string | null
  desde: string // ISO date string, ex: "2023-02-01"
}

export interface DashboardAlunoHeroFaixaDTO {
  slug: string // "azul", "roxa", "preta-professor", etc.
  nome: string // "Faixa Azul"
  categoria: "ADULTO" | "INFANTIL" | "HONORIFICA"

  grauAtual: number
  grausMaximos: number

  aulasNoGrau: number // ex: 85
  aulasMetaNoGrau: number // ex: 110
}

export interface DashboardAlunoHeroMetricasDTO {
  treinosMesAtual: number

  ultimoTreino:
    | {
        dataHora: string // ISO datetime ex: "2025-12-07T19:30:00-03:00"
        turmaNome?: string // ex: "Fundamental No-Gi"
      }
    | null
}

export interface DashboardAlunoHeroDTO {
  aluno: DashboardAlunoHeroAlunoDTO
  faixa: DashboardAlunoHeroFaixaDTO
  metricas: DashboardAlunoHeroMetricasDTO
}
