import { ROLE_KEYS, normalizeRoles, type UserRole } from '../config/roles';
import type { AuthUser, LoginPayload } from '../types/user';

const PILOT_USERS: Array<{ email: string; name: string; roles: UserRole[]; alunoId?: string | null; instrutorId?: string | null; professorId?: string | null }> = [
  { email: 'instrutor@bjj.academy', name: 'Instrutor Piloto', roles: [ROLE_KEYS.professor, ROLE_KEYS.instrutor], instrutorId: 'instrutor-vilmar', professorId: 'professor-admin' },
  { email: 'aluno@bjj.academy', name: 'Aluno Piloto', roles: [ROLE_KEYS.aluno], alunoId: 'aluno_joao_silva' },
  { email: 'admin@bjj.academy', name: 'Admin Piloto', roles: [ROLE_KEYS.admin, ROLE_KEYS.professor, ROLE_KEYS.instrutor], instrutorId: 'instrutor-vilmar', professorId: 'professor-admin' }
];

const DEFAULT_ACADEMIA_ID = 'academia_bjj_central';

export const authMockService = {
  async login(payload: LoginPayload): Promise<{ user: AuthUser; token: string }> {
    const email = payload.email?.toLowerCase().trim();
    const matched = PILOT_USERS.find((entry) => entry.email === email);
    if (!matched) {
      throw new Error('Usuário não autorizado neste ambiente.');
    }

    const resolvedRoles = normalizeRoles(payload.roles?.length ? payload.roles : matched.roles);
    const token = `mock-token-${Date.now()}`;

    return {
      token,
      user: {
        id: matched.email,
        name: matched.name,
        nomeCompleto: matched.name,
        email: matched.email,
        avatarUrl: '/img/avatar-admin.png',
        roles: resolvedRoles,
        telefone: null,
        alunoId: matched.alunoId ?? (resolvedRoles.includes(ROLE_KEYS.aluno) ? 'aluno_joao_silva' : null),
        instrutorId: matched.instrutorId ?? (resolvedRoles.includes(ROLE_KEYS.instrutor) ? 'instrutor-vilmar' : null),
        professorId: matched.professorId ?? (resolvedRoles.includes(ROLE_KEYS.professor) ? 'professor-admin' : null),
        academiaId: DEFAULT_ACADEMIA_ID
      }
    };
  }
};

export default authMockService;
