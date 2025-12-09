import { ROLE_KEYS, normalizeRoles } from '../config/roles';
import { mockDb } from '@/data/mocks/db';
import type { PapelCodigo, UserRole } from '@/types/auth';
import { ROLE_BY_PAPEL_CODIGO } from '@/types/auth';
import type { AuthUser, Usuario } from '@/types';

export type AuthMockLoginInput = {
  identifier: string;
  senha: string;
};

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80';
const PILOT_PASSWORD = 'BJJ@pilot2025';

const papelCodigoById = new Map<string, PapelCodigo>(
  mockDb.papeis.map((papel) => [
    papel.id,
    papel.codigo.toString().toLowerCase() as PapelCodigo,
  ]),
);

function buildRolesFromMocks(
  usuarioId: string,
  extraRoles: UserRole[] = [],
): UserRole[] {
  const papeisDoUsuario = mockDb.usuariosPapeis
    .filter((rel) => rel.usuarioId === usuarioId)
    .map((rel) => papelCodigoById.get(rel.papelId))
    .filter((codigo): codigo is PapelCodigo => Boolean(codigo));

  const rolesFromMocks = papeisDoUsuario.map((codigo) => ROLE_BY_PAPEL_CODIGO[codigo]);
  const merged = [...rolesFromMocks, ...extraRoles];

  return Array.from(new Set(normalizeRoles(merged)));
}

const mapUsuarioToAuthUser = (usuario: Usuario): AuthUser => {
  const roles = buildRolesFromMocks(
    usuario.id,
    (usuario.roles as UserRole[] | undefined) || [],
  );
  return {
    id: usuario.id,
    email: usuario.email.toLowerCase(),
    username: usuario.username,
    nomeCompleto: usuario.nomeCompleto,
    name: usuario.nomeCompleto,
    avatarUrl: usuario.avatarUrl || usuario.fotoUrl || DEFAULT_AVATAR,
    roles,
    alunoId: usuario.alunoId ?? null,
    staffId: usuario.staffId ?? null,
    instrutorId: usuario.roles?.includes(ROLE_KEYS.instrutor) ? usuario.staffId ?? null : null,
    professorId: usuario.roles?.includes(ROLE_KEYS.professor) ? usuario.staffId ?? usuario.id : null,
    academiaId: usuario.academiaId ?? null,
    status: usuario.status ?? 'active',
    faixaAtualSlug: usuario.faixaAtualSlug ?? null,
    grauAtual: usuario.grauAtual ?? null,
    telefone: usuario.telefone ?? null
  };
};

export const allowedPilotUsers: AuthUser[] = mockDb.usuarios.map(mapUsuarioToAuthUser);

export async function authMockLogin({ identifier, senha }: AuthMockLoginInput): Promise<AuthUser> {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const isEmail = normalizedIdentifier.includes('@');

  const userPilot = allowedPilotUsers.find((u) =>
    isEmail ? u.email === normalizedIdentifier : u.username?.toLowerCase() === normalizedIdentifier
  );

  if (!userPilot) {
    throw new Error('USUARIO_NAO_HABILITADO_PILOTO');
  }

  if (userPilot.status && userPilot.status !== 'active') {
    if (userPilot.status === 'invited') {
      throw new Error('USUARIO_CONVITE_PENDENTE');
    }
    throw new Error('USUARIO_INATIVO');
  }

  if (senha !== PILOT_PASSWORD) {
    throw new Error('CREDENCIAIS_INVALIDAS');
  }

  return userPilot;
}

export async function authMockLogout(): Promise<void> {
  return Promise.resolve();
}
