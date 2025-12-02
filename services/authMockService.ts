import { ROLE_KEYS } from '../config/roles';
import type { AuthUser } from '../types/user';

type AuthMockLoginInput = {
  email: string;
  senha: string;
};

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80';
const DEFAULT_ACADEMIA_ID = 'academia_piloto_bjj';
const PILOT_PASSWORD = 'BJJ@pilot2025';

const allowedPilotUsers: AuthUser[] = [
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
    nomeCompleto: 'Aluno Piloto 1',
    name: 'Aluno Piloto 1',
    roles: [ROLE_KEYS.aluno],
    alunoId: 'aluno-001',
    instrutorId: null,
    professorId: null,
    academiaId: DEFAULT_ACADEMIA_ID,
    avatarUrl: null,
    telefone: null
  },
  {
    id: 'aluno-002',
    email: 'aluno2@bjjacademy.com',
    nomeCompleto: 'Aluno Piloto 2',
    name: 'Aluno Piloto 2',
    roles: [ROLE_KEYS.aluno],
    alunoId: 'aluno-002',
    instrutorId: null,
    professorId: null,
    academiaId: DEFAULT_ACADEMIA_ID,
    avatarUrl: null,
    telefone: null
  },
  {
    id: 'aluno-003',
    email: 'aluno3@bjjacademy.com',
    nomeCompleto: 'Aluno Piloto 3',
    name: 'Aluno Piloto 3',
    roles: [ROLE_KEYS.aluno],
    alunoId: 'aluno-003',
    instrutorId: null,
    professorId: null,
    academiaId: DEFAULT_ACADEMIA_ID,
    avatarUrl: null,
    telefone: null
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
