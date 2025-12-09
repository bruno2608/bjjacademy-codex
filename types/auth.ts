// Códigos de papel armazenados no mock DB (minúsculo)
export type PapelCodigo = "aluno" | "instrutor" | "professor" | "admin" | "admin_ti"

// Roles normalizados usados na aplicação (maiúsculo)
export type UserRole = "ALUNO" | "INSTRUTOR" | "PROFESSOR" | "ADMIN" | "ADMIN_TI"

// Mapeamento tipado de código (DB) -> role (app)
export const ROLE_BY_PAPEL_CODIGO: Record<PapelCodigo, UserRole> = {
  aluno: "ALUNO",
  instrutor: "INSTRUTOR",
  professor: "PROFESSOR",
  admin: "ADMIN",
  admin_ti: "ADMIN_TI",
} as const
