import { MOCK_FAIXAS } from "@/data/mocks/bjjBeltMocks"
import type { BjjBeltVisualConfig } from "@/types/bjjBelt"

export const beltConfigBySlug: Record<string, BjjBeltVisualConfig> =
  Object.fromEntries(MOCK_FAIXAS.map((f) => [f.slug, f]))

export function getFaixaConfigBySlug(slug: string): BjjBeltVisualConfig | undefined {
  return beltConfigBySlug[slug]
}
