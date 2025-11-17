import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { UserRole } from './config/roles';
import { hasAnyRole, normalizeRoles, ROLE_KEYS, STAFF_ROLES } from './config/roles';
import { flattenSiteMap, siteMap } from './config/siteMap';

/**
 * Middleware responsável por validar permissões de acesso em tempo real.
 * Baseia-se no site map central e nos papéis salvos em cookie/localStorage.
 */

const PUBLIC_ROUTES = ['/login', '/unauthorized', '/manifest.json'];
const STATIC_PREFIXES = ['/_next', '/icons', '/service-worker.js', '/sw.js'];

const siteMapFlat = flattenSiteMap(siteMap);

const matchSiteMap = (pathname: string) =>
  siteMapFlat.find((item) => pathname === item.path || pathname.startsWith(`${item.path}/`));

const parseRoles = (raw: string | undefined): UserRole[] => {
  if (!raw) return [] as UserRole[];
  const parts = raw.includes('[') ? JSON.parse(raw) : raw.split(',');
  return normalizeRoles(parts);
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.includes(pathname) || STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const matchedRoute = matchSiteMap(pathname);
  if (!matchedRoute) {
    return NextResponse.next();
  }

  const cookieRoles = request.cookies.get('bjj_roles')?.value;
  const roles = parseRoles(cookieRoles);

  if (!roles.length) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const hasPermission = hasAnyRole(roles, matchedRoute.roles);
  if (!hasPermission) {
    if (roles.length === 1 && roles.includes(ROLE_KEYS.student)) {
      const studentUrl = new URL('/dashboard-aluno', request.url);
      return NextResponse.redirect(studentUrl);
    }

    if (hasAnyRole(roles, STAFF_ROLES)) {
      const staffUrl = new URL('/dashboard-instrutor', request.url);
      return NextResponse.redirect(staffUrl);
    }

    const unauthorizedUrl = new URL('/unauthorized', request.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
