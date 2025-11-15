'use client';

/**
 * Header compacto para telas menores.
 * Usa menu hamburguer para abrir as rotas permitidas e mantém ação de logout.
 */
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu, X, Settings2, ChevronRight, BarChart3, UserCircle2 } from 'lucide-react';
import { getNavigationItemsForRoles, flattenNavigation } from '../../lib/navigation';
import useUserStore from '../../store/userStore';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, logout } = useUserStore();
  const roles = user?.roles || [];

  const navigationItems = useMemo(() => getNavigationItemsForRoles(roles), [roles]);
  const flattenedItems = useMemo(() => flattenNavigation(navigationItems), [navigationItems]);
  const configItem = useMemo(
    () => navigationItems.find((item) => item.path === '/configuracoes'),
    [navigationItems]
  );
  const configChildren = configItem?.children ?? [];

  const initials = useMemo(() => {
    const source = user?.name || user?.email || 'Instrutor';
    const parts = source.split(/[\s@._-]+/).filter(Boolean);
    if (!parts.length) return 'IN';
    const first = parts[0][0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return `${first}${last}`.toUpperCase();
  }, [user?.name, user?.email]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const canAccess = (path) => flattenedItems.some((item) => item.path === path);

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
      <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-bjj-red/80 to-bjj-red text-xs font-semibold text-bjj-white shadow-[0_0_0_1px_rgba(225,6,0,0.4)]">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={`Avatar de ${user?.name || 'Instrutor'}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          initials
        )}
      </span>

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
            <div className="rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-4 text-sm text-bjj-gray-200/80">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-bjj-red/80 to-bjj-red text-sm font-semibold text-bjj-white shadow-[0_0_0_1px_rgba(225,6,0,0.4)]">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={`Avatar de ${user?.name || 'Instrutor'}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    initials
                  )}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-bjj-white">{user?.name || 'Instrutor'}</span>
                  <span className="text-[11px] text-bjj-gray-200/60">{user?.email || 'instrutor@bjj.academy'}</span>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                {canAccess('/perfil') && (
                  <Link
                    href="/perfil"
                    className="flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 transition hover:border-bjj-gray-700 hover:bg-bjj-gray-900/70 hover:text-bjj-white"
                    onClick={() => setOpen(false)}
                  >
                    <UserCircle2 size={16} /> Meu perfil
                  </Link>
                )}

                {canAccess('/relatorios') && (
                  <Link
                    href="/relatorios"
                    className="flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 transition hover:border-bjj-gray-700 hover:bg-bjj-gray-900/70 hover:text-bjj-white"
                    onClick={() => setOpen(false)}
                  >
                    <BarChart3 size={16} /> Relatórios
                  </Link>
                )}

                {configChildren.length > 0 && (
                  <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/50 px-3 py-2">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-300/70">
                      <Settings2 size={14} /> Configurações
                    </div>
                    <ul className="mt-2 space-y-1 text-sm">
                      {configChildren.map((child) => (
                        <li key={child.path}>
                          <Link
                            href={child.path}
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-bjj-gray-200/80 transition hover:bg-bjj-gray-900/70 hover:text-bjj-white"
                            onClick={() => setOpen(false)}
                          >
                            <ChevronRight size={14} className="text-bjj-gray-500" /> {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-bjj-gray-800 px-3 py-2 text-sm font-semibold text-bjj-gray-200 transition hover:border-bjj-red/70 hover:bg-bjj-red/20 hover:text-bjj-white"
              >
                <LogOut size={16} /> Sair
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
