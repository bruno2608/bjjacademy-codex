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
import useUserStore from '../../store/userStore';
import UserMenu from './UserMenu';

export default function TabletNav() {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
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
      className="hidden border-b border-bjj-gray-800/70 bg-bjj-black/95 backdrop-blur xl:block"
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-6 py-3">
        <div className="flex flex-1 items-center gap-2 overflow-x-auto">
          {navigationItems.map((item) => {
            const active = pathname === item.path || pathname.startsWith(`${item.path}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                  active
                    ? 'border-bjj-red/80 bg-bjj-red/20 text-bjj-white shadow-[0_12px_35px_rgba(225,6,0,0.18)]'
                    : 'border-bjj-gray-800/80 text-bjj-gray-200/80 hover:border-bjj-gray-700 hover:bg-bjj-gray-900/70 hover:text-bjj-white'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                    active
                      ? 'border-bjj-red bg-bjj-red text-bjj-white'
                      : 'border-bjj-gray-800 bg-bjj-gray-900/60 text-bjj-gray-200/80 group-hover:border-bjj-gray-700 group-hover:bg-bjj-gray-800'
                  }`}
                >
                  {Icon ? <Icon size={16} /> : null}
                </span>
                <span className="font-medium leading-none">{item.title}</span>
              </Link>
            );
          })}
        </div>
        <div className="hidden shrink-0 items-center md:flex">
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
