// Resolvedor canonico das configs de faixa.
// Mantem 1:1 com os mocks (sem sobrescrever cores); fallbacks sao aplicados no componente BjjBeltStrip.
import { MOCK_FAIXAS } from "@/data/mocks/bjjBeltMocks"
import type { BjjBeltVisualConfig } from "@/types/bjjBelt"

const beltConfigBySlug: Record<string, BjjBeltVisualConfig> = Object.fromEntries(
  MOCK_FAIXAS.map((f) => [f.slug, f]),
)

const slugAliases: Record<string, string> = {
  branca: "branca-adulto",
  "adulto-branca": "branca-adulto",
  preta: "preta-padrao",
  "adulto-preta": "preta-padrao",
}

Object.entries(slugAliases).forEach(([alias, canonical]) => {
  const config = beltConfigBySlug[canonical]
  if (config) {
    beltConfigBySlug[alias] = config
  }
})

export { beltConfigBySlug }

export function getFaixaConfigBySlug(slug: string): BjjBeltVisualConfig | undefined {
  return beltConfigBySlug[slug]
}
