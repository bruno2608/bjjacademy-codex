import { BJJ_BELT_COLORS } from "@/tokens/bjjBeltTokens"

const TEXT_LIGHT = "text-bjj-white/80"
const TEXT_DARK = "text-bjj-black/80"
const STRIPE_ACTIVE = "bg-bjj-white"
const STRIPE_INACTIVE = "bg-bjj-gray-700"
const STITCH_LIGHT = "bg-bjj-white/30"
const STITCH_DARK = "bg-bjj-black/15"
const STITCH_GRAY = "bg-bjj-gray-500"
const TIP_BLACK = "bg-bjj-black"

export type BjjBeltPaletteEntry = {
  beltColorClass: string
  tipColorClass: string
  stripeColorClass: string
  stripeInactiveClass: string
  textColorClass: string
  progressBarClass?: string
  stitchingColorClass?: string
  horizontalStripeClass?: string
  tipoPreta?: "competidor" | "professor" | "padrao"
}

// Canonical visual tokens for every belt (adulto, infantil, honorificas).
export const BJJ_BELT_VISUALS = {
  // Adulto
  "adulto-branca": {
    beltColorClass: BJJ_BELT_COLORS.white,
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: STRIPE_INACTIVE,
    textColorClass: TEXT_DARK,
    progressBarClass: BJJ_BELT_COLORS.white,
    stitchingColorClass: "bg-bjj-gray-200",
  },
  "adulto-azul": {
    beltColorClass: BJJ_BELT_COLORS.blue,
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: STRIPE_INACTIVE,
    textColorClass: TEXT_LIGHT,
    progressBarClass: BJJ_BELT_COLORS.blue,
    stitchingColorClass: STITCH_LIGHT,
  },
  "adulto-roxa": {
    beltColorClass: BJJ_BELT_COLORS.purple,
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: STRIPE_INACTIVE,
    textColorClass: TEXT_LIGHT,
    progressBarClass: BJJ_BELT_COLORS.purple,
    stitchingColorClass: STITCH_LIGHT,
  },
  "adulto-marrom": {
    beltColorClass: BJJ_BELT_COLORS.brown,
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: STRIPE_INACTIVE,
    textColorClass: TEXT_LIGHT,
    progressBarClass: BJJ_BELT_COLORS.brown,
    stitchingColorClass: STITCH_LIGHT,
  },
  "adulto-preta": {
    beltColorClass: BJJ_BELT_COLORS.black,
    tipColorClass: "bg-bjj-belt-red/80",
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: "bg-bjj-belt-black/60",
    textColorClass: TEXT_LIGHT,
    progressBarClass: "bg-bjj-belt-red/80",
    stitchingColorClass: STITCH_GRAY,
    tipoPreta: "padrao",
  },
  "adulto-preta-competidor": {
    beltColorClass: BJJ_BELT_COLORS.black,
    tipColorClass: "bg-bjj-white",
    stripeColorClass: "bg-bjj-black",
    stripeInactiveClass: STRIPE_INACTIVE,
    textColorClass: TEXT_LIGHT,
    progressBarClass: BJJ_BELT_COLORS.black,
    stitchingColorClass: STITCH_GRAY,
    tipoPreta: "competidor",
  },
  "adulto-preta-professor": {
    beltColorClass: BJJ_BELT_COLORS.black,
    tipColorClass: "bg-bjj-belt-red/80",
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: "bg-bjj-black/40",
    textColorClass: TEXT_LIGHT,
    progressBarClass: "bg-bjj-belt-red/80",
    stitchingColorClass: STITCH_GRAY,
    tipoPreta: "professor",
  },
  "adulto-coral": {
    beltColorClass: "bg-gradient-to-r from-bjj-belt-red/80 to-bjj-belt-black/80",
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: "bg-bjj-belt-black/60",
    textColorClass: TEXT_LIGHT,
    progressBarClass: "bg-bjj-belt-red/80",
    stitchingColorClass: "bg-bjj-white/70",
  },
  "adulto-vermelha": {
    beltColorClass: "bg-bjj-belt-red/80",
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: "bg-bjj-belt-black/60",
    textColorClass: TEXT_LIGHT,
    progressBarClass: "bg-bjj-belt-red/80",
    stitchingColorClass: "bg-bjj-white/70",
  },

  // Infantil
  "infantil-branca": {
    beltColorClass: BJJ_BELT_COLORS.white,
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: STRIPE_INACTIVE,
    textColorClass: TEXT_DARK,
    progressBarClass: BJJ_BELT_COLORS.white,
    stitchingColorClass: "bg-bjj-gray-200",
  },
  "infantil-cinza-branca": {
    beltColorClass: BJJ_BELT_COLORS.gray,
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: STRIPE_INACTIVE,
    textColorClass: TEXT_LIGHT,
    progressBarClass: BJJ_BELT_COLORS.gray,
    stitchingColorClass: STITCH_DARK,
    horizontalStripeClass: "bg-bjj-white",
  },
  "infantil-cinza": {
    beltColorClass: BJJ_BELT_COLORS.gray,
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: STRIPE_INACTIVE,
    textColorClass: TEXT_LIGHT,
    progressBarClass: BJJ_BELT_COLORS.gray,
    stitchingColorClass: STITCH_DARK,
  },
  "infantil-cinza-preta": {
    beltColorClass: BJJ_BELT_COLORS.gray,
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: STRIPE_INACTIVE,
    textColorClass: TEXT_LIGHT,
    progressBarClass: BJJ_BELT_COLORS.gray,
    stitchingColorClass: STITCH_DARK,
    horizontalStripeClass: "bg-bjj-black",
  },
  "infantil-amarela-branca": {
    beltColorClass: BJJ_BELT_COLORS.yellow,
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: STRIPE_INACTIVE,
    textColorClass: TEXT_DARK,
    progressBarClass: BJJ_BELT_COLORS.yellow,
    stitchingColorClass: STITCH_DARK,
    horizontalStripeClass: "bg-bjj-white",
  },
  "infantil-amarela": {
    beltColorClass: BJJ_BELT_COLORS.yellow,
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: STRIPE_INACTIVE,
    textColorClass: TEXT_DARK,
    progressBarClass: BJJ_BELT_COLORS.yellow,
    stitchingColorClass: STITCH_DARK,
  },
  "infantil-amarela-preta": {
    beltColorClass: BJJ_BELT_COLORS.yellow,
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: STRIPE_INACTIVE,
    textColorClass: TEXT_DARK,
    progressBarClass: BJJ_BELT_COLORS.yellow,
    stitchingColorClass: STITCH_DARK,
    horizontalStripeClass: "bg-bjj-black",
  },
  "infantil-laranja-branca": {
    beltColorClass: BJJ_BELT_COLORS.orange,
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: STRIPE_INACTIVE,
    textColorClass: TEXT_DARK,
    progressBarClass: BJJ_BELT_COLORS.orange,
    stitchingColorClass: STITCH_DARK,
    horizontalStripeClass: "bg-bjj-white",
  },
  "infantil-laranja": {
    beltColorClass: BJJ_BELT_COLORS.orange,
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: STRIPE_INACTIVE,
    textColorClass: TEXT_DARK,
    progressBarClass: BJJ_BELT_COLORS.orange,
    stitchingColorClass: STITCH_DARK,
  },
  "infantil-laranja-preta": {
    beltColorClass: BJJ_BELT_COLORS.orange,
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: STRIPE_INACTIVE,
    textColorClass: TEXT_DARK,
    progressBarClass: BJJ_BELT_COLORS.orange,
    stitchingColorClass: STITCH_DARK,
    horizontalStripeClass: "bg-bjj-black",
  },
  "infantil-verde-branca": {
    beltColorClass: BJJ_BELT_COLORS.green,
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: STRIPE_INACTIVE,
    textColorClass: TEXT_LIGHT,
    progressBarClass: BJJ_BELT_COLORS.green,
    stitchingColorClass: STITCH_LIGHT,
    horizontalStripeClass: "bg-bjj-white",
  },
  "infantil-verde": {
    beltColorClass: BJJ_BELT_COLORS.green,
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: STRIPE_INACTIVE,
    textColorClass: TEXT_LIGHT,
    progressBarClass: BJJ_BELT_COLORS.green,
    stitchingColorClass: STITCH_LIGHT,
  },
  "infantil-verde-preta": {
    beltColorClass: BJJ_BELT_COLORS.green,
    tipColorClass: TIP_BLACK,
    stripeColorClass: STRIPE_ACTIVE,
    stripeInactiveClass: STRIPE_INACTIVE,
    textColorClass: TEXT_LIGHT,
    progressBarClass: BJJ_BELT_COLORS.green,
    stitchingColorClass: STITCH_LIGHT,
    horizontalStripeClass: "bg-bjj-black",
  },
} satisfies Record<string, BjjBeltPaletteEntry>
