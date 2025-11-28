'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import useUserStore from '../../store/userStore';
import { useCurrentAluno } from '@/hooks/useCurrentAluno';
import { useCurrentStaff } from '@/hooks/useCurrentStaff';
import UserMenu from './UserMenu';
import useRole from '@/hooks/useRole';
import { ROLE_KEYS } from '@/config/roles';
import { STAFF_ROUTES, STAFF_ROUTE_SECTIONS } from '@/config/staffRoutes';

const BARE_PATHS = ['/login', '/unauthorized'];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const { roles } = useRole();
  const { hydrateFromStorage, hydrated, updateUser } = useUserStore();
  const { user, aluno } = useCurrentAluno();
  const { staff } = useCurrentStaff();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      hydrateFromStorage();
    }
  }, [hydrateFromStorage, hydrated]);

  useEffect(() => {
    const nextAvatar = aluno?.avatarUrl || staff?.avatarUrl || user?.avatarUrl;
    const nextName = aluno?.nome || staff?.nome;
    if (user && nextAvatar && nextAvatar !== user.avatarUrl && updateUser) {
      updateUser({ avatarUrl: nextAvatar, name: nextName || user.name });
    }
  }, [aluno, staff, updateUser, user]);

  const effectiveRoles = useMemo(
    () => (roles?.length ? roles : [ROLE_KEYS.professor]),
    [roles]
  );

  const filteredRoutes = useMemo(
    () =>
      STAFF_ROUTES.filter((route) => route.visible !== false).filter((route) => {
        if (!route.roles || route.roles.length === 0) return true;
        return route.roles.some((role) => effectiveRoles.includes(role));
      }),
    [effectiveRoles]
  );

  const groupedRoutes = useMemo(() => {
    return filteredRoutes.reduce((groups, route) => {
      const key = route.section;
      if (!groups[key]) groups[key] = [];
      groups[key].push(route);
      return groups;
    }, {});
  }, [filteredRoutes]);

  const isBareLayout = useMemo(
    () => BARE_PATHS.some((publicPath) => pathname?.startsWith(publicPath)),
    [pathname]
  );

  const renderNavLink = (route) => {
    const active = pathname === route.path || pathname.startsWith(`${route.path}/`);
    const Icon = route.icon;

    return (
      <Link
        key={route.path}
        href={route.path}
        className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-bjj-red/60 focus:ring-offset-2 focus:ring-offset-bjj-black ${
          active
            ? 'bg-bjj-red/15 text-white shadow-[0_18px_45px_-18px_rgba(225,6,0,0.35)] border border-bjj-red/60'
            : 'border border-transparent text-bjj-gray-200 hover:border-bjj-red/50 hover:bg-bjj-red/10 hover:text-white'
        }`}
        aria-current={active ? 'page' : undefined}
        onClick={() => setMobileOpen(false)}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-bjj-gray-900/70 text-bjj-gray-200">
          {Icon ? <Icon size={16} /> : null}
        </span>
        <span className="font-semibold leading-tight">{route.label}</span>
      </Link>
    );
  };

  if (isBareLayout) {
    return children;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-bjj-black text-bjj-white">
      <header className="flex items-center justify-between gap-3 border-b border-bjj-gray-800/70 bg-bjj-gray-950/80 px-4 py-3 md:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/80 text-bjj-gray-100 transition hover:border-bjj-red/70 hover:text-bjj-white"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.3em] text-bjj-gray-300">Área staff</span>
            <span className="text-base font-semibold text-white">BJJ Academy</span>
          </div>
        </div>
        <UserMenu inline />
      </header>

      {mobileOpen ? (
        <div className="md:hidden">
          <div className="fixed inset-0 z-40 bg-bjj-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col gap-4 border-r border-bjj-gray-800/70 bg-bjj-gray-950 px-4 py-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.28em] text-bjj-gray-400">Menu</span>
                <span className="text-sm font-semibold text-white">Professor / Instrutor</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/80 text-bjj-gray-100 transition hover:border-bjj-red/70 hover:text-bjj-white"
                aria-label="Fechar menu"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-6 overflow-y-auto">
              {Object.entries(STAFF_ROUTE_SECTIONS).map(([key, label]) => {
                const routes = groupedRoutes[key] || [];
                if (!routes.length) return null;
                return (
                  <div key={key} className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-bjj-gray-400">{label}</p>
                    <div className="flex flex-col gap-2">{routes.map(renderNavLink)}</div>
                  </div>
                );
              })}
            </nav>
          </aside>
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 pb-12 pt-6 md:px-6 xl:px-8">
        <aside className="sticky top-0 hidden h-[calc(100vh-2rem)] w-64 shrink-0 flex-col gap-6 overflow-y-auto rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-950/70 p-4 md:flex">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.28em] text-bjj-gray-400">Área staff</span>
            <span className="text-lg font-semibold text-white">BJJ Academy</span>
          </div>
          <nav className="flex flex-col gap-6 text-sm">
            {Object.entries(STAFF_ROUTE_SECTIONS).map(([key, label]) => {
              const routes = groupedRoutes[key] || [];
              if (!routes.length) return null;
              return (
                <div key={key} className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-bjj-gray-500">{label}</p>
                  <div className="flex flex-col gap-1.5">{routes.map(renderNavLink)}</div>
                </div>
              );
            })}
          </nav>
          <div className="mt-auto hidden md:block">
            <UserMenu />
          </div>
        </aside>

        <main className="flex-1">{children}</main>
      </div>

      <footer className="footer footer-center mt-auto w-full border-t border-bjj-gray-900 bg-bjj-gray-950/80 px-4 py-6 text-sm text-bjj-gray-300">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm">
          <span className="font-semibold text-white">BJJ Academy</span>
          <span className="text-bjj-gray-400">PWA pronto para instalar</span>
          <span className="text-bjj-gray-400">Built with Next.js 14 + Tailwind + DaisyUI</span>
          <span className="text-bjj-gray-400">Suporte: suporte@bjj.academy</span>
        </div>
      </footer>
    </div>
  );
}
