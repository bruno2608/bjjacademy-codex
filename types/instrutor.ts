import type { UserRole } from './session'

export interface InstrutorProfile {
  id: string
  nome: string
  nomeCompleto?: string
  email?: string | null
  faixaSlug: string
  graus?: number
  status?: string
  avatarUrl?: string | null
  alunoId?: string | null
  instrutorId?: string | null
  professorId?: string | null
  academiaId?: string | null
  roles?: UserRole[]
}
