import { mockDb } from "@/data/mocks/db"

export function listarFaixasDominio() {
  return [...mockDb.faixas]
}

export function listarRegrasGraduacao() {
  return [...mockDb.regrasGraduacao]
}

export function listarRegrasPorFaixa(slug: string) {
  return mockDb.regrasGraduacao.filter((regra) => regra.faixaSlug === slug)
}
