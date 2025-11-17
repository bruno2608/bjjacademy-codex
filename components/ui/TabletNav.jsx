'use client';

/**
 * Navegação superior inspirada no layout oficial, agora com versão hamburger
 * para telas menores e com os atalhos do perfil professor visíveis.
 */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { getNavigationItemsForRoles } from '../../lib/navigation';
import useRole from '../../hooks/useRole';
import UserMenu from './UserMenu';

export default function TabletNav() {
  const pathname = usePathname();
  const { roles } = useRole();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationItems = useMemo(
    () => getNavigationItemsForRoles(roles),
    [roles]
  );

  const renderNavLink = (item, { condensed = false } = {}) => {
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
        } ${condensed ? 'w-full justify-start' : ''}`}
        aria-current={active ? 'page' : undefined}
        onClick={() => setMobileOpen(false)}
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
  };

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
        <div className="flex flex-1 items-center gap-2">
          <div className="hidden min-w-0 flex-1 flex-wrap items-center gap-2 sm:flex">
            {navigationItems.map((item) => renderNavLink(item))}
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/80 text-bjj-gray-100 transition hover:border-bjj-red/70 hover:text-bjj-white sm:hidden"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMobileOpen((state) => !state)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        <div className="hidden sm:block shrink-0">
          <UserMenu />
        </div>
      </div>
      {mobileOpen ? (
        <div className="sm:hidden border-t border-bjj-gray-800/70 bg-bjj-black/95">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-3 md:px-6 xl:px-8">
            {navigationItems.map((item) => renderNavLink(item, { condensed: true }))}
            <div className="mt-1 w-full">
              <UserMenu inline />
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
