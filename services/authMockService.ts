import { ROLE_KEYS } from '../config/roles';
import type { AuthUser } from '../types/user';

type AuthMockLoginInput = {
  email: string;
  senha: string;
};

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80';
const DEFAULT_ACADEMIA_ID = 'academia_piloto_bjj';
const PILOT_PASSWORD = 'BJJ@pilot2025';

export const allowedPilotUsers: AuthUser[] = [
  {
    id: 'prof-001',
    email: 'professor@bjjacademy.com',
    nomeCompleto: 'Professor Piloto',
    name: 'Professor Piloto',
    roles: [ROLE_KEYS.professor],
    alunoId: null,
    instrutorId: 'instrutor-prof-001',
    professorId: 'prof-001',
    academiaId: DEFAULT_ACADEMIA_ID,
    avatarUrl: DEFAULT_AVATAR,
    telefone: null
  },
  {
    id: 'aluno-001',
    email: 'aluno1@bjjacademy.com',
    nomeCompleto: 'João Silva',
    name: 'João Silva',
    roles: [ROLE_KEYS.aluno],
    alunoId: 'aluno_joao_silva',
    instrutorId: null,
    professorId: null,
    academiaId: DEFAULT_ACADEMIA_ID,
    avatarUrl: 'https://images.unsplash.com/photo-1593104547489-e03a09fd1ccb?auto=format&fit=crop&w=320&q=80',
    telefone: '(11) 98888-7766'
  },
  {
    id: 'aluno-002',
    email: 'aluno2@bjjacademy.com',
    nomeCompleto: 'Maria Souza',
    name: 'Maria Souza',
    roles: [ROLE_KEYS.aluno],
    alunoId: '2',
    instrutorId: null,
    professorId: null,
    academiaId: DEFAULT_ACADEMIA_ID,
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80',
    telefone: '(21) 97777-6655'
  },
  {
    id: 'aluno-003',
    email: 'aluno3@bjjacademy.com',
    nomeCompleto: 'Carlos Pereira',
    name: 'Carlos Pereira',
    roles: [ROLE_KEYS.aluno],
    alunoId: '3',
    instrutorId: null,
    professorId: null,
    academiaId: DEFAULT_ACADEMIA_ID,
    avatarUrl: null,
    telefone: '(31) 96666-5544'
  },
  {
    id: 'admin-001',
    email: 'admin@bjjacademy.com',
    nomeCompleto: 'Admin Piloto',
    name: 'Admin Piloto',
    roles: [ROLE_KEYS.admin, ROLE_KEYS.professor],
    alunoId: null,
    instrutorId: null,
    professorId: 'admin-001',
    academiaId: DEFAULT_ACADEMIA_ID,
    avatarUrl: DEFAULT_AVATAR,
    telefone: null
  },
  {
    id: 'admin-ti-001',
    email: 'camila.duarte@bjjacademy.com',
    nomeCompleto: 'Bruno Alves França',
    name: 'Bruno Alves',
    roles: [ROLE_KEYS.adminTi],
    alunoId: null,
    instrutorId: null,
    professorId: null,
    academiaId: DEFAULT_ACADEMIA_ID,
    avatarUrl:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=320&q=80',
    telefone: '(11) 98888-3344'
  }
];

export async function authMockLogin({ email, senha }: AuthMockLoginInput): Promise<AuthUser> {
  const userPilot = allowedPilotUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!userPilot) {
    throw new Error('USUARIO_NAO_HABILITADO_PILOTO');
  }

  if (senha !== PILOT_PASSWORD) {
    throw new Error('CREDENCIAIS_INVALIDAS');
  }

  return userPilot;
}

export type { AuthMockLoginInput };
