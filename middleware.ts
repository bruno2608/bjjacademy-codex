import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ROLE_KEYS, normalizeRoles, type UserRole } from './config/roles';
import { allowedRoutesForRoles, canAccessPath } from './config/siteMap';

const PUBLIC_ROUTES = ['/login', '/unauthorized', '/manifest.json'];
const STATIC_PREFIXES = ['/_next', '/icons', '/service-worker.js', '/sw.js'];

const parseRoles = (raw: string | undefined): UserRole[] => {
  if (!raw) return [] as UserRole[];

  try {
    const parts = raw.includes('[') ? JSON.parse(raw) : raw.split(',');
    return normalizeRoles(parts);
  } catch (error) {
    console.warn('Invalid bjj_roles cookie, falling back to empty list.', error);
    return [] as UserRole[];
  }
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.includes(pathname) || STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const cookieRoles = request.cookies.get('bjj_roles')?.value;
  const roles = parseRoles(cookieRoles);

  if (!roles.length) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const normalizedPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const hasAccess = roles.some((role) => [ROLE_KEYS.admin, ROLE_KEYS.ti].includes(role))
    ? true
    : canAccessPath(roles, normalizedPath);

  if (!hasAccess) {
    const allowedRoutes = allowedRoutesForRoles(roles);
    const fallback = allowedRoutes.includes('/dashboard') ? '/dashboard' : allowedRoutes[0] || '/unauthorized';
    const redirectUrl = new URL(fallback, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
