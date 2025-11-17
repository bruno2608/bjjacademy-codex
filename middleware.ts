import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { normalizeRoles, ROLE_KEYS } from './config/roles';
import { isRouteAllowed } from './config/sitemap';

const PUBLIC_ROUTES = ['/login', '/cadastro', '/recuperar-senha', '/confirmar-email', '/manifest.json'];
const STATIC_PREFIXES = ['/_next', '/icons', '/service-worker.js', '/sw.js'];

const parseRoles = (raw: string | undefined) => {
  if (!raw) return [] as ROLE_KEYS[];
  const parts = raw.includes('[') ? JSON.parse(raw) : raw.split(',');
  return normalizeRoles(parts);
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.includes(pathname) || STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const cookieRoles = request.cookies.get('bjj_roles')?.value;
  const token = request.cookies.get('bjj_token')?.value;
  const roles = parseRoles(cookieRoles);

  if (!roles.length || !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const allowed = isRouteAllowed(pathname, roles);
  if (!allowed) {
    const redirectUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
