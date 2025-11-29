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
import { STAFF_ROUTE_SECTIONS, getVisibleStaffRoutes } from '@/config/staffRoutes';

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

  const groupedRoutes = useMemo(() => {
    const baseGroups = Object.keys(STAFF_ROUTE_SECTIONS).reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});

    return getVisibleStaffRoutes(effectiveRoles).reduce((groups, route) => {
      const key = route.section;
      if (!groups[key]) groups[key] = [];
      groups[key].push(route);
      return groups;
    }, baseGroups);
  }, [effectiveRoles]);

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
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-bjj-gray-800/70 bg-bjj-gray-950/85 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/80 text-bjj-gray-100 transition hover:border-bjj-red/70 hover:text-bjj-white"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] uppercase tracking-[0.26em] text-bjj-gray-400">Área staff</span>
            <span className="text-base font-semibold text-white">BJJ Academy</span>
          </div>
        </div>
        <div className="shrink-0">
          <UserMenu inline />
        </div>
      </header>

      {mobileOpen ? (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-40 bg-bjj-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 flex h-full w-80 max-w-[85vw] flex-col gap-4 border-r border-bjj-gray-800/70 bg-bjj-gray-950 px-5 py-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] uppercase tracking-[0.24em] text-bjj-gray-400">Menu</span>
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

            <nav className="flex flex-1 flex-col gap-5 overflow-y-auto pb-2">
              {Object.entries(STAFF_ROUTE_SECTIONS).map(([key, label]) => {
                const routes = groupedRoutes[key] || [];
                if (!routes.length) return null;

                return (
                  <div key={key} className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-bjj-gray-400">{label}</p>
                    <div className="flex flex-col gap-2">{routes.map(renderNavLink)}</div>
                  </div>
                );
              })}
            </nav>

            <div className="pt-1">
              <UserMenu inline />
            </div>
          </aside>
        </div>
      ) : null}

      <div className="flex min-h-screen">
        <aside className="hidden h-full w-72 shrink-0 flex-col border-r border-bjj-gray-900/80 bg-gradient-to-b from-bjj-gray-950 via-bjj-black to-bjj-black px-5 pb-8 pt-10 lg:flex">
          <div className="rounded-3xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.65)]">
            <span className="text-[11px] uppercase tracking-[0.24em] text-bjj-red/80">Zenko Focus</span>
            <h1 className="mt-3 text-2xl font-semibold">BJJ Academy</h1>
            <p className="mt-2 text-[12px] leading-relaxed text-bjj-gray-200/70">
              Gerencie alunos, presenças e graduações em um único comando visual.
            </p>
          </div>

          <nav className="mt-6 flex-1 space-y-4 text-sm">
            {Object.entries(STAFF_ROUTE_SECTIONS).map(([key, label]) => {
              const routes = groupedRoutes[key] || [];
              if (!routes.length) return null;

              return (
                <div key={key} className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-bjj-gray-500">{label}</p>
                  <div className="flex flex-col gap-2">{routes.map(renderNavLink)}</div>
                </div>
              );
            })}
          </nav>

          <div className="mt-auto">
            <UserMenu />
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <div className="hidden border-b border-bjj-gray-900/70 bg-bjj-gray-950/60 px-8 py-4 lg:flex lg:items-center lg:justify-end">
            <UserMenu />
          </div>
          <main className="flex-1 px-4 pb-12 pt-6 sm:px-6 xl:px-10">{children}</main>
          <footer className="footer footer-center mt-auto w-full border-t border-bjj-gray-900 bg-bjj-gray-950/80 px-4 py-6 text-sm text-bjj-gray-300">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm">
              <span className="font-semibold text-white">BJJ Academy</span>
              <span className="text-bjj-gray-400">PWA pronto para instalar</span>
              <span className="text-bjj-gray-400">Built with Next.js 14 + Tailwind + DaisyUI</span>
              <span className="text-bjj-gray-400">Suporte: suporte@bjj.academy</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
