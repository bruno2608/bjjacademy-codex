import type { UserRole } from '../config/roles';
import type { CurrentUser } from './session';

export type AuthUser = CurrentUser & {
  name?: string;
  telefone?: string | null;
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
  email: string;
  senha: string;
};

export type Genero = 'Masculino' | 'Feminino' | 'Outro' | null;

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  telefone?: string | null;
  genero?: Genero;
  dataNascimento?: string | null;
  fotoUrl?: string | null;
  alunoId?: string | null;
}

export interface UsuarioPapel {
  id: string;
  usuarioId: string;
  papelId: number;
  dataConcessao: string;
  concedidoPor?: string | null;
}
