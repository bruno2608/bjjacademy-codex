import type { UserRole } from '../config/roles';
import type { CurrentUser } from './session';

export type AuthUser = CurrentUser & {
  name?: string;
  telefone?: string | null;
  grauAtual?: number | null;
  faixaAtualSlug?: string | null;
};

export interface StaffProfile {
  id: string;
  nome: string;
  email: string | null;
  avatarUrl?: string | null;
  roles: UserRole[];
  alunoId?: string | null;
  faixaSlug?: string | null;
  grauAtual?: number | null;
  status?: 'ATIVO' | 'INATIVO';
  academiaId?: string | null;
  alunosAtivos?: number;
  totalAlunos?: number;
  graduacoesPendentes?: number;
  checkinsRegistradosSemana?: number;
  presencasHoje?: number;
  faltasHoje?: number;
  pendentesHoje?: number;
}

export type LoginPayload = {
  identifier: string;
  senha: string;
  rememberMe?: boolean;
};

export type Genero = 'Masculino' | 'Feminino' | 'Outro' | null;

export interface Usuario {
  id: string;
  nome?: string;
  nomeCompleto: string;
  email: string;
  username?: string;
  ativo?: boolean;
  telefone?: string | null;
  genero?: Genero;
  dataNascimento?: string | null;
  fotoUrl?: string | null;
  avatarUrl?: string | null;
  alunoId?: string | null;
  staffId?: string | null;
  faixaAtualSlug?: string | null;
  grauAtual?: number | null;
  status?: 'invited' | 'active' | 'inactive';
  academiaId?: string | null;
  roles?: UserRole[];
}

export interface UsuarioPapel {
  id: string;
  usuarioId: string;
  papelId: number;
  dataConcessao: string;
  concedidoPor?: string | null;
}
