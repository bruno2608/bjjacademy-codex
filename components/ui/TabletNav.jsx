'use client';

/**
 * Navegação superior inspirada no Zenko Focus para telas grandes,
 * filtrando opções conforme os papéis do usuário atual.
 */
import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getNavigationItemsForRoles } from '../../lib/navigation';
import useRole from '../../hooks/useRole';
import UserMenu from './UserMenu';

export default function TabletNav() {
  const pathname = usePathname();
  const { roles } = useRole();

  const navigationItems = useMemo(
    () => getNavigationItemsForRoles(roles),
    [roles]
  );

  if (!navigationItems.length) {
    return null;
  }

  return (
    <nav
      className="sticky top-0 z-40 border-b border-bjj-gray-800/70 bg-bjj-black/95 backdrop-blur"
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-3 md:px-6 xl:px-8">
        <div className="hidden whitespace-nowrap rounded-full bg-bjj-red/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-bjj-red sm:block">
          BJJ Academy
        </div>
        <div className="flex flex-1 items-center gap-2 overflow-x-auto">
          {navigationItems.map((item) => {
            const active = pathname === item.path || pathname.startsWith(`${item.path}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`group inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition ${
                  active
                    ? 'border-bjj-red/80 bg-bjj-red/15 text-bjj-white shadow-[0_12px_35px_rgba(225,6,0,0.18)]'
                    : 'border-bjj-gray-800/80 text-bjj-gray-200/80 hover:border-bjj-red/60 hover:bg-bjj-red/10 hover:text-bjj-white'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                    active
                      ? 'border-bjj-red bg-bjj-red text-bjj-white'
                      : 'border-bjj-gray-800 bg-bjj-gray-900/60 text-bjj-gray-200/80 group-hover:border-bjj-red/70 group-hover:bg-bjj-gray-900/70'
                  }`}
                >
                  {Icon ? <Icon size={16} /> : null}
                </span>
                <span className="font-semibold leading-none">{item.title}</span>
              </Link>
            );
          })}
        </div>
        <div className="shrink-0">
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
