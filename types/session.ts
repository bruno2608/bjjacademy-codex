export type UserRole = 'ALUNO' | 'INSTRUTOR' | 'PROFESSOR' | 'ADMIN' | 'ADMIN_TI'

export interface CurrentUser {
  id: string
  nomeCompleto: string
  email: string
  username?: string
  avatarUrl: string | null
  roles: UserRole[]
  alunoId: string | null
  staffId?: string | null
  instrutorId: string | null
  professorId: string | null
  academiaId: string | null
  status?: 'invited' | 'active' | 'inactive'
  faixaAtualSlug?: string | null
  grauAtual?: number | null
  telefone?: string | null
}
