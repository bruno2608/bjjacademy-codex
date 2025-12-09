import type { CategoriaFaixa } from "@/types/bjjBelt"

type FaixaDominio = {
  id: string
  slug: string
  nome: string
  categoria: CategoriaFaixa | "HONORIFICA"
  grausMaximos: number
  ordem: number
  tipoPreta?: "padrao" | "competidor" | "professor"
  ativa: boolean
}

export const faixas: FaixaDominio[] = [
  { id: "faixa-branca", slug: "branca-adulto", nome: "Faixa Branca", categoria: "ADULTO", grausMaximos: 4, ordem: 1, ativa: true },
  { id: "faixa-azul", slug: "azul", nome: "Faixa Azul", categoria: "ADULTO", grausMaximos: 4, ordem: 2, ativa: true },
  { id: "faixa-roxa", slug: "roxa", nome: "Faixa Roxa", categoria: "ADULTO", grausMaximos: 4, ordem: 3, ativa: true },
  { id: "faixa-marrom", slug: "marrom", nome: "Faixa Marrom", categoria: "ADULTO", grausMaximos: 4, ordem: 4, ativa: true },
  { id: "faixa-preta", slug: "preta-padrao", nome: "Faixa Preta", categoria: "ADULTO", grausMaximos: 6, ordem: 5, tipoPreta: "padrao", ativa: true },
  { id: "faixa-preta-prof", slug: "preta-professor", nome: "Faixa Preta Professor", categoria: "ADULTO", grausMaximos: 6, ordem: 6, tipoPreta: "professor", ativa: true },
]
