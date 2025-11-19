import type { Role } from './roles';
import { ROLE_KEYS } from './roles';

export const siteMap = {
  aluno: [
    '/dashboard',
    '/checkin',
    '/treinos',
    '/evolucao',
    '/historico-presencas',
    '/perfil',
    '/relatorios'
  ],
  instrutor: [
    '/dashboard',
    '/checkin',
    '/treinos',
    '/evolucao',
    '/historico-presencas',
    '/perfil',
    '/relatorios',
    '/alunos'
  ],
  professor: [
    '/dashboard',
    '/checkin',
    '/treinos',
    '/evolucao',
    '/historico-presencas',
    '/perfil',
    '/configuracoes',
    '/presencas',
    '/alunos',
    '/relatorios',
    '/configuracoes/graduacao',
    '/configuracoes/treinos',
    '/configuracoes/tipos-treino'
  ],
  admin: 'acesso total',
  ti: 'acesso total'
} as const;

const ROUTE_KEYS = Object.keys(siteMap) as Role[];

export function routesForRole(role: Role): string[] {
  if ([ROLE_KEYS.admin, ROLE_KEYS.ti].includes(role)) {
    return ['*'];
  }
  const paths = siteMap[role];
  return Array.isArray(paths) ? paths : [];
}

export function flattenRoutes(): string[] {
  return ROUTE_KEYS.flatMap((role) => {
    const entries = siteMap[role];
    if (entries === 'acesso total') return [];
    return entries;
  });
}

export function canAccessPath(roles: Role[], pathname: string): boolean {
  if (!roles?.length) return false;
  if (roles.some((role) => [ROLE_KEYS.admin, ROLE_KEYS.ti].includes(role))) return true;

  const normalizedPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return roles.some((role) => routesForRole(role).some((route) => route === normalizedPath || normalizedPath.startsWith(`${route}/`)));
}

export function allowedRoutesForRoles(roles: Role[]): string[] {
  if (!roles?.length) return [];
  if (roles.some((role) => [ROLE_KEYS.admin, ROLE_KEYS.ti].includes(role))) {
    return ['*'];
  }
  const unique = new Set<string>();
  roles.forEach((role) => routesForRole(role).forEach((route) => unique.add(route)));
  return Array.from(unique);
}
