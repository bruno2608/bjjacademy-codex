import type { Role, UserRole } from './roles';
import { ROLE_KEYS } from './roles';

export const siteMap = {
  [ROLE_KEYS.aluno]: [
    '/dashboard',
    '/checkin',
    '/aluno/checkin',
    '/aluno/checkin/manual',
    '/aluno/checkin/qrcode',
    '/treinos',
    '/evolucao',
    '/historico-presencas',
    '/belt-demo',
    '/perfil'
  ],
  [ROLE_KEYS.instrutor]: [
    '/dashboard',
    '/checkin',
    '/aluno/checkin',
    '/aluno/checkin/manual',
    '/aluno/checkin/qrcode',
    '/treinos',
    '/evolucao',
    '/graduacoes',
    '/graduacoes/proximas',
    '/graduacoes/historico',
    '/historico-presencas',
    '/belt-demo',
    '/perfil',
    '/relatorios',
    '/alunos',
    '/presencas',
    '/presencas/check-in',
    '/presencas/pendencias',
    '/presencas/revisao'
  ],
  [ROLE_KEYS.professor]: [
    '/dashboard',
    '/checkin',
    '/aluno/checkin',
    '/aluno/checkin/manual',
    '/aluno/checkin/qrcode',
    '/treinos',
    '/evolucao',
    '/graduacoes',
    '/graduacoes/proximas',
    '/graduacoes/historico',
    '/historico-presencas',
    '/perfil',
    '/belt-demo',
    '/configuracoes',
    '/presencas',
    '/presencas/check-in',
    '/presencas/pendencias',
    '/presencas/revisao',
    '/qrcode',
    '/qrcode/validar',
    '/qrcode/historico',
    '/alunos',
    '/relatorios',
    '/configuracoes/graduacao',
    '/configuracoes/treinos',
    '/configuracoes/tipos-treino'
  ],
  [ROLE_KEYS.admin]: 'acesso total',
  [ROLE_KEYS.ti]: 'acesso total'
} as const;

const ROUTE_KEYS = Object.keys(siteMap) as UserRole[];

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
