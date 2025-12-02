'use client';

/**
 * Navegação superior inspirada no layout oficial, agora com versão hamburger
 * para telas menores e com os atalhos do perfil professor visíveis.
 */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { getTopNavigationItemsForRoles } from '../../lib/navigation';
import useRole from '../../hooks/useRole';
import UserMenu from './UserMenu';

export default function TabletNav({ items }) {
  const pathname = usePathname();
  const { roles } = useRole();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationItems = useMemo(
    () => (items?.length ? items : getTopNavigationItemsForRoles(roles)),
    [items, roles]
  );

  const renderNavLink = (item, { condensed = false } = {}) => {
    const active = pathname === item.path || pathname.startsWith(`${item.path}/`);
    const Icon = item.icon;

    return (
      <Link
        key={item.path}
        href={item.path}
        className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
          active
            ? 'border-bjj-red/80 bg-gradient-to-r from-bjj-red/20 via-bjj-red/15 to-bjj-red/10 text-bjj-white shadow-[0_12px_35px_rgba(225,6,0,0.18)]'
            : 'border-bjj-gray-800/70 bg-bjj-gray-900/70 text-bjj-gray-200/85 hover:border-bjj-red/60 hover:bg-bjj-red/10 hover:text-bjj-white'
        } ${condensed ? 'w-full justify-start' : ''}`}
        aria-current={active ? 'page' : undefined}
        onClick={() => setMobileOpen(false)}
      >
        {Icon ? <Icon size={16} className="text-bjj-gray-200/90" /> : null}
        <span className="leading-none">{item.title}</span>
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
