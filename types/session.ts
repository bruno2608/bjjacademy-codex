export type UserRole = 'ALUNO' | 'INSTRUTOR' | 'PROFESSOR' | 'ADMIN' | 'ADMIN_TI'

export interface CurrentUser {
  id: string
  nomeCompleto: string
  email: string
  avatarUrl: string | null
  roles: UserRole[]
  alunoId: string | null
  instrutorId: string | null
  professorId: string | null
  academiaId: string | null
}
