'use client';

/**
 * Header compacto para telas menores.
 * Usa menu hamburguer para abrir as rotas permitidas e mantém ação de logout.
 */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
import { getNavigationItemsForRoles } from '../../lib/navigation';
import useUserStore from '../../store/userStore';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, logout } = useUserStore();
  const roles = user?.roles || [];

  const navigationItems = useMemo(() => getNavigationItemsForRoles(roles), [roles]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-bjj-gray-800 bg-bjj-gray-900/80 px-4 py-3 backdrop-blur lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-2 text-bjj-gray-100 transition hover:border-bjj-red/70 hover:text-bjj-white"
        aria-label="Abrir menu"
      >
        <Menu size={18} />
      </button>
      <span className="text-sm font-semibold uppercase tracking-wide text-bjj-gray-200">BJJ Academy</span>
      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-1.5 rounded-full border border-bjj-gray-800 px-3 py-1.5 text-xs font-medium text-bjj-gray-200 transition hover:border-bjj-red/70 hover:bg-bjj-red/20 hover:text-bjj-white"
      >
        <LogOut size={14} />
        Sair
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-bjj-black/80 backdrop-blur-sm">
          <div className="absolute inset-x-0 top-0 mx-auto flex w-full max-w-md flex-col gap-4 rounded-b-3xl border-b border-bjj-gray-800 bg-bjj-gray-900/95 p-5 shadow-[0_45px_75px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wide text-bjj-gray-200">Menu principal</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-2 text-bjj-gray-100 transition hover:border-bjj-red/70 hover:text-bjj-white"
                aria-label="Fechar menu"
              >
                <X size={16} />
              </button>
            </div>
            <nav className="flex max-h-[70vh] flex-col gap-2 overflow-y-auto">
              {navigationItems.map((item) => {
                const active = pathname === item.path || pathname.startsWith(`${item.path}/`);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                      active
                        ? 'border-bjj-red/70 bg-bjj-red/10 text-bjj-white shadow-[0_18px_45px_rgba(225,6,0,0.18)]'
                        : 'border-bjj-gray-800/70 text-bjj-gray-200 hover:border-bjj-red/60 hover:bg-bjj-red/10 hover:text-bjj-white'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-bjj-gray-900/70 text-bjj-gray-200">
                      {Icon ? <Icon size={18} /> : null}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold leading-tight">{item.title}</span>
                      {item.children?.length ? (
                        <span className="text-[11px] text-bjj-gray-300/70">{item.children.length} opção(ões) internas</span>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center justify-between rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 px-4 py-3 text-xs text-bjj-gray-200/80">
              <div className="flex flex-col">
                <span className="font-semibold text-bjj-white">{user?.name || 'Instrutor'}</span>
                <span>{roles.join(' • ') || 'Sem papéis'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-full border border-bjj-gray-800 px-3 py-1.5 font-semibold text-bjj-gray-200 transition hover:border-bjj-red/70 hover:bg-bjj-red/20 hover:text-bjj-white"
              >
                <LogOut size={14} />
                Sair
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
