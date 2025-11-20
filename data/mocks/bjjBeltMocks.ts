import type { BjjBeltVisualConfig } from "../../types/bjjBelt" // Assumindo o path correto para tipos

export const MOCK_FAIXAS: BjjBeltVisualConfig[] = [
  // ============================================================================
  // FAIXAS ADULTAS (Graus 4 a 7º Dan)
  // ============================================================================
  
  // 1. BRANCA (White)
  {
    id: 1,
    nome: "Branca",
    slug: "branca",
    categoria: "ADULTO",
    grausMaximos: 4,
    beltColorClass: "bg-white",
    stitchingColorClass: "bg-bjj-gray-200", 
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bjj-black/80",
    progressBarClass: "bg-zinc-400"
  },
  
  // 2. AZUL (Blue)
  {
    id: 2,
    nome: "Azul",
    slug: "azul",
    categoria: "ADULTO",
    grausMaximos: 4,
    beltColorClass: "bg-blue-600",
    stitchingColorClass: "bg-bjj-white/30",
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bjj-white/80",
    progressBarClass: "bg-blue-500"
  },
  
  // 3. ROXA (Purple)
  {
    id: 3,
    nome: "Roxa",
    slug: "roxa",
    categoria: "ADULTO",
    grausMaximos: 4,
    beltColorClass: "bg-purple-600",
    stitchingColorClass: "bg-bjj-white/30",
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bjj-white/80",
    progressBarClass: "bg-purple-500"
  },
  
  // 4. MARROM (Brown)
  {
    id: 4,
    nome: "Marrom",
    slug: "marrom",
    categoria: "ADULTO",
    grausMaximos: 4,
    beltColorClass: "bg-amber-700",
    stitchingColorClass: "bg-bjj-white/30",
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bjj-white/80",
    progressBarClass: "bg-amber-700"
  },

  // 5. PRETA (Black - Padrão/IBJJF - 4º ao 6º Dan)
  {
    id: 5,
    nome: "Preta",
    slug: "preta-padrao",
    categoria: "ADULTO",
    grausMaximos: 6,
    beltColorClass: "bg-bjj-black",
    stitchingColorClass: "bg-bjj-gray-500",
    tipColorClass: "bg-bjj-red/80", // Ponteira Vermelha Lisa
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-red/60",
    tipoPreta: "padrao",
    textColorClass: "text-bjj-white/80",
    progressBarClass: "bg-bjj-red/80"
  },

  // 6. PRETA (Competidor - Ponteira Branca)
  {
    id: 6,
    nome: "Preta",
    slug: "preta-competidor",
    categoria: "ADULTO",
    grausMaximos: 6,
    beltColorClass: "bg-bjj-black",
    stitchingColorClass: "bg-bjj-gray-500",
    tipColorClass: "bg-bjj-white", // Ponteira Branca
    stripeColorClass: "bg-bjj-black", // Graus Pretos 
    stripeInactiveClass: "bg-bjj-gray-700",
    tipoPreta: "competidor",
    textColorClass: "text-bjj-white/80",
    progressBarClass: "bg-bjj-white"
  },
  
  // 7. PRETA (Professor - Ponteira Vermelha com Bordas - 4º ao 6º Dan)
  {
    id: 7,
    nome: "Preta",
    slug: "preta-professor",
    categoria: "ADULTO",
    grausMaximos: 6,
    beltColorClass: "bg-bjj-black",
    stitchingColorClass: "bg-bjj-gray-500",
    tipColorClass: "bg-bjj-red/80", // Ponteira Vermelha com bordas brancas
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-red/80",
    tipoPreta: "professor", // CHAVE para as bordas brancas no componente Strip
    textColorClass: "text-bjj-white/80",
    progressBarClass: "bg-bjj-red/80"
  },
  
  // ============================================================================
  // FAIXAS MASTER/HONORÍFICAS (8º, 9º e 10º Dan)
  // ============================================================================

  // 8. CORAL (Red/Black - 7º/8º Dan)
  {
    id: 8,
    nome: "Coral",
    slug: "coral",
    categoria: "ADULTO",
    grausMaximos: 9, 
    beltColorClass: "bg-gradient-to-r from-bjj-red/80 to-bjj-black/80",
    stitchingColorClass: "bg-bjj-white/80",
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bjj-white/80",
    progressBarClass: "bg-bjj-red/80"
  },

  // 9. VERMELHA (Red - 9º/10º Dan)
  {
    id: 9,
    nome: "Vermelha",
    slug: "vermelha",
    categoria: "ADULTO",
    grausMaximos: 10, 
    beltColorClass: "bg-bjj-red/80",
    stitchingColorClass: "bg-bjj-white/80",
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bjj-white/80",
    progressBarClass: "bg-bjj-red/80"
  },


  // ============================================================================
  // FAIXAS INFANTIS (10 ao 22)
  // ============================================================================

  // 10. BRANCA INFANTIL (White)
  {
    id: 10,
    nome: "Branca Infantil",
    slug: "branca-infantil",
    categoria: "INFANTIL",
    grausMaximos: 4,
    beltColorClass: "bg-white",
    stitchingColorClass: "bg-bjj-gray-200",
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bjj-black/80",
    progressBarClass: "bg-white"
  },
  
  // 11. CINZA E BRANCA (Grey/White)
  {
    id: 11,
    nome: "Cinza e Branca",
    slug: "cinza-branca",
    categoria: "INFANTIL",
    grausMaximos: 4,
    beltColorClass: "bg-gray-500",
    horizontalStripeClass: "bg-white", // Listra branca sobre o cinza
    stitchingColorClass: "bg-bjj-black/10",
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bjj-black/80",
    progressBarClass: "bg-gray-500"
  },
  
  // 12. CINZA (Grey)
  {
    id: 12,
    nome: "Cinza",
    slug: "cinza",
    categoria: "INFANTIL",
    grausMaximos: 4,
    beltColorClass: "bg-gray-500",
    stitchingColorClass: "bg-bjj-black/10",
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bg-bjj-white",
    progressBarClass: "bg-gray-500"
  },
  
  // 13. CINZA E PRETA (Grey/Black)
  {
    id: 13,
    nome: "Cinza e Preta",
    slug: "cinza-preta",
    categoria: "INFANTIL",
    grausMaximos: 4,
    beltColorClass: "bg-gray-500",
    horizontalStripeClass: "bg-bjj-black", // Listra preta
    stitchingColorClass: "bg-bjj-black/10",
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bg-bjj-white",
    progressBarClass: "bg-gray-500"
  },
  
  // 14. AMARELA E BRANCA (Yellow/White)
  {
    id: 14,
    nome: "Amarela e Branca",
    slug: "amarela-branca",
    categoria: "INFANTIL",
    grausMaximos: 4,
    beltColorClass: "bg-yellow-500",
    horizontalStripeClass: "bg-white", // Listra branca
    stitchingColorClass: "bg-bjj-black/10",
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bjj-black/80",
    progressBarClass: "bg-yellow-500"
  },
  
  // 15. AMARELA (Yellow)
  {
    id: 15,
    nome: "Amarela",
    slug: "amarela",
    categoria: "INFANTIL",
    grausMaximos: 4,
    beltColorClass: "bg-yellow-500",
    stitchingColorClass: "bg-bjj-black/10",
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bjj-black/80",
    progressBarClass: "bg-yellow-500"
  },
  
  // 16. AMARELA E PRETA (Yellow/Black)
  {
    id: 16,
    nome: "Amarela e Preta",
    slug: "amarela-preta-infantil",
    categoria: "INFANTIL",
    grausMaximos: 4,
    beltColorClass: "bg-yellow-500",
    horizontalStripeClass: "bg-bjj-black", // Listra preta
    stitchingColorClass: "bg-bjj-black/10",
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bg-bjj-white",
    progressBarClass: "bg-yellow-500"
  },
  
  // 17. LARANJA E BRANCA (Orange/White)
  {
    id: 17,
    nome: "Laranja e Branca",
    slug: "laranja-branca",
    categoria: "INFANTIL",
    grausMaximos: 4,
    beltColorClass: "bg-orange-500",
    horizontalStripeClass: "bg-white",
    stitchingColorClass: "bg-bjj-black/10",
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bjj-black/80",
    progressBarClass: "bg-orange-500"
  },

  // 18. LARANJA (Orange)
  {
    id: 18,
    nome: "Laranja",
    slug: "laranja",
    categoria: "INFANTIL",
    grausMaximos: 4,
    beltColorClass: "bg-orange-500",
    stitchingColorClass: "bg-bjj-black/10",
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bjj-black",
    progressBarClass: "bg-orange-500"
  },
  
  // 19. LARANJA E PRETA (Orange/Black)
  {
    id: 19,
    nome: "Laranja e Preta",
    slug: "laranja-preta",
    categoria: "INFANTIL",
    grausMaximos: 4,
    beltColorClass: "bg-orange-500",
    horizontalStripeClass: "bg-bjj-black",
    stitchingColorClass: "bg-bjj-black/10",
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bg-bjj-white",
    progressBarClass: "bg-orange-500"
  },

  // 20. VERDE E BRANCA (Green/White)
  {
    id: 20,
    nome: "Verde e Branca",
    slug: "verde-branca",
    categoria: "INFANTIL",
    grausMaximos: 4,
    beltColorClass: "bg-green-700",
    horizontalStripeClass: "bg-white",
    stitchingColorClass: "bg-bjj-black/10",
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bjj-black",
    progressBarClass: "bg-green-700"
  },
  
  // 21. VERDE (Green)
  {
    id: 21,
    nome: "Verde",
    slug: "verde",
    categoria: "INFANTIL",
    grausMaximos: 4,
    beltColorClass: "bg-green-700",
    stitchingColorClass: "bg-bjj-black/10",
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bg-bjj-white",
    progressBarClass: "bg-green-600"
  },
  
  // 22. VERDE E PRETA (Green/Black)
  {
    id: 22,
    nome: "Verde e Preta",
    slug: "verde-preta",
    categoria: "INFANTIL",
    grausMaximos: 4,
    beltColorClass: "bg-green-700",
    horizontalStripeClass: "bg-bjj-black",
    stitchingColorClass: "bg-bjj-black/10",
    tipColorClass: "bg-bjj-black",
    stripeColorClass: "bg-bjj-white",
    stripeInactiveClass: "bg-bjj-gray-700",
    textColorClass: "text-bjj-white/80",
    progressBarClass: "bg-green-700"
  },
];