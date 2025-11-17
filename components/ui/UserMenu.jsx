'use client';

/**
 * Menu de usuário inspirado no ChatGPT.
 * Exibe avatar com iniciais, opções rápidas (perfil, relatórios)
 * e atalhos para as subseções de configurações permitidas
 * com base nos papéis do usuário.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, LogOut, Settings2, UserCircle2, BarChart3 } from 'lucide-react';
import useUserStore from '../../store/userStore';
import { getNavigationItemsForRoles, flattenNavigation } from '../../lib/navigation';

const buildInitials = (name = '', email = '') => {
  const source = name || email || 'Instrutor';
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  if (parts.length === 0) return 'IN';
  const first = parts[0][0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
};

export default function UserMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useUserStore();
  const roles = user?.roles || [];
  const [open, setOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const menuRef = useRef(null);

  const navigationItems = useMemo(
    () => getNavigationItemsForRoles(roles, { includeHidden: true }),
    [roles]
  );
  const flattenedItems = useMemo(() => flattenNavigation(navigationItems), [navigationItems]);

  const configItem = useMemo(
    () => navigationItems.find((item) => item.path === '/configuracoes'),
    [navigationItems]
  );
  const configChildren = configItem?.children ?? [];
  const isConfigPath = useMemo(
    () => Boolean(pathname && pathname.startsWith('/configuracoes')),
    [pathname]
  );

  const profilePath = useMemo(
    () => flattenedItems.find((item) => item.path === '/perfil')?.path,
    [flattenedItems]
  );

  const historyPath = useMemo(
    () => flattenedItems.find((item) => item.path === '/historico-presencas')?.path,
    [flattenedItems]
  );

  const reportsPath = useMemo(
    () => flattenedItems.find((item) => item.path === '/relatorios')?.path,
    [flattenedItems]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (isConfigPath) {
      setConfigOpen(true);
    }
  }, [isConfigPath]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const initials = buildInitials(user?.name, user?.email);
  const avatarUrl = user?.avatarUrl;

  const AvatarBadge = (
    <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-bjj-red/80 to-bjj-red text-xs font-semibold text-bjj-white shadow-[0_0_0_1px_rgba(225,6,0,0.4)]">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`Avatar de ${user?.name || 'Instrutor'}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        initials
      )}
    </span>
  );

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        className="group inline-flex items-center gap-2 rounded-full border border-bjj-gray-800 bg-bjj-gray-900/70 px-2 py-1.5 text-sm font-medium text-bjj-gray-200 transition hover:border-bjj-red/70 hover:text-bjj-white"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {AvatarBadge}
        <span className="hidden text-xs uppercase tracking-wide text-bjj-gray-300/80 md:inline">{user?.name || 'Instrutor'}</span>
        <ChevronDown size={14} className={`transition ${open ? 'rotate-180 text-bjj-white' : 'text-bjj-gray-400 group-hover:text-bjj-white'}`} />
      </button>

      {open ? (
        <div className="absolute right-0 z-40 mt-3 w-64 rounded-2xl border border-bjj-gray-800/80 bg-bjj-gray-900/95 p-4 shadow-[0_25px_65px_rgba(0,0,0,0.5)]">
          <header className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-bjj-red/80 to-bjj-red text-sm font-semibold text-bjj-white shadow-[0_0_0_1px_rgba(225,6,0,0.4)]">
              {avatarUrl ? (
                <img src={avatarUrl} alt={`Avatar de ${user?.name || 'Instrutor'}`} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                initials
              )}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-bjj-white">{user?.name || 'Instrutor'}</span>
              <span className="text-[11px] text-bjj-gray-200/60">{user?.email || 'instrutor@bjj.academy'}</span>
            </div>
          </header>

          <nav className="mt-4 space-y-1 text-sm text-bjj-gray-200/80">
            {profilePath && (
              <Link
                href={profilePath}
                className="flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 transition hover:border-bjj-gray-700 hover:bg-bjj-gray-900/70 hover:text-bjj-white"
                onClick={() => setOpen(false)}
              >
                <UserCircle2 size={16} /> Meu perfil
              </Link>
            )}

            {historyPath && (
              <Link
                href={historyPath}
                className="flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 transition hover:border-bjj-gray-700 hover:bg-bjj-gray-900/70 hover:text-bjj-white"
                onClick={() => setOpen(false)}
              >
                <ChevronRight size={14} className="text-bjj-gray-500" /> Histórico de presenças
              </Link>
            )}

            {reportsPath && (
              <Link
                href={reportsPath}
                className="flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 transition hover:border-bjj-gray-700 hover:bg-bjj-gray-900/70 hover:text-bjj-white"
                onClick={() => setOpen(false)}
              >
                <BarChart3 size={16} /> Relatórios
              </Link>
            )}

            {configChildren.length > 0 && (
              <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/60">
                <button
                  type="button"
                  onClick={() => setConfigOpen((state) => !state)}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-300/70 transition hover:text-bjj-white"
                  aria-expanded={configOpen}
                >
                  <span className="inline-flex items-center gap-2">
                    <Settings2 size={14} /> Configurações
                  </span>
                  <ChevronDown
                    size={14}
                    className={`transition ${configOpen ? 'rotate-180 text-bjj-white' : 'text-bjj-gray-500'}`}
                  />
                </button>
                {configOpen && (
                  <ul className="border-t border-bjj-gray-800/70 px-3 py-2 text-sm">
                    {configChildren.map((child) => (
                      <li key={child.path}>
                        <Link
                          href={child.path}
                          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-bjj-gray-200/80 transition hover:bg-bjj-gray-900/70 hover:text-bjj-white"
                          onClick={() => {
                            setOpen(false);
                            setConfigOpen(false);
                          }}
                        >
                          <ChevronRight size={14} className="text-bjj-gray-500" /> {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-bjj-gray-800 px-3 py-2 text-sm font-semibold text-bjj-gray-200 transition hover:border-bjj-red/70 hover:bg-bjj-red/20 hover:text-bjj-white"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      ) : null}
    </div>
  );
}
