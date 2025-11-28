export type CategoriaFaixa = "INFANTIL" | "ADULTO"

export interface BjjBeltVisualConfig {
  id?: string | number
  nome: string
  slug: string
  categoria: CategoriaFaixa
  grausMaximos: number

  // Cores da faixa
  beltColorClass: string
  horizontalStripeClass?: string
  stitchingColorClass?: string
  textColorClass?: string

  // Ponteira e graus
  tipColorClass: string
  stripeColorClass: string
  stripeInactiveClass: string

  tipoPreta?: "competidor" | "professor" | "padrao"
  progressBarClass?: string
}

export interface BjjBeltStripProps {
  config?: BjjBeltVisualConfig
  grauAtual: number
  className?: string
}

export interface BjjBeltProgressCardProps {
  config?: BjjBeltVisualConfig
  grauAtual: number
  aulasFeitasNoGrau: number
  aulasMetaNoGrau?: number | null
  className?: string
}
