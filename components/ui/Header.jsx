'use client';

/**
 * Header compacto para telas menores.
 * Usa menu hamburguer para abrir as rotas permitidas e mantém ação de logout.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Menu, X, Settings2, ChevronRight, ChevronDown, BarChart3, UserCircle2 } from 'lucide-react';
import { getNavigationItemsForRoles, flattenNavigation } from '../../lib/navigation';
import useRole from '../../hooks/useRole';
import useUserStore from '../../store/userStore';
import { useAlunosStore } from '@/store/alunosStore';
import { useCurrentStaff } from '@/hooks/useCurrentStaff';
import { iconColors, iconSizes } from '@/styles/iconTokens';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, logout, hydrateFromStorage, hydrated } = useUserStore();
  const alunoSelecionado = useAlunosStore((state) =>
    user?.alunoId ? state.getAlunoById(user.alunoId) : null
  );
  const { staff } = useCurrentStaff();
  const { roles } = useRole();

  const navigationItems = useMemo(() => getNavigationItemsForRoles(roles), [roles]);
  const fullNavigation = useMemo(
    () => getNavigationItemsForRoles(roles, { includeHidden: true }),
    [roles]
  );
  const flattenedItems = useMemo(() => flattenNavigation(fullNavigation), [fullNavigation]);
  const profilePath = useMemo(
    () => flattenedItems.find((item) => item.path === '/perfil')?.path,
    [flattenedItems]
  );
  const reportsPath = useMemo(
    () => flattenedItems.find((item) => item.path === '/relatorios')?.path,
    [flattenedItems]
  );
  const configItem = useMemo(
    () => fullNavigation.find((item) => item.path === '/configuracoes'),
    [fullNavigation]
  );
  const configChildren = configItem?.children ?? [];
  const isConfigPath = useMemo(() => pathname.startsWith('/configuracoes'), [pathname]);
  const [configOpen, setConfigOpen] = useState(isConfigPath);

  useEffect(() => {
    // Mantém o dropdown alinhado à rota atual para evitar que fique sempre aberto.
    setConfigOpen(isConfigPath);
  }, [isConfigPath]);

  useEffect(() => {
    if (!hydrated) {
      hydrateFromStorage();
    }
  }, [hydrateFromStorage, hydrated]);

  const displayName = alunoSelecionado?.nome || staff?.nome || user?.name || 'Instrutor';
  const displayEmail = alunoSelecionado?.email || staff?.email || user?.email || 'instrutor@bjj.academy';

  const initials = useMemo(() => {
    const source = displayName || displayEmail;
    const parts = source.split(/[\s@._-]+/).filter(Boolean);
    if (!parts.length) return 'IN';
    const first = parts[0][0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return `${first}${last}`.toUpperCase();
  }, [displayEmail, displayName]);

  const avatarUrl = alunoSelecionado?.avatarUrl || staff?.avatarUrl || user?.avatarUrl;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-bjj-gray-800 bg-bjj-gray-900/80 px-4 py-3 backdrop-blur xl:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/70 p-2 text-bjj-gray-100 transition hover:border-bjj-red/70 hover:text-bjj-white"
        aria-label="Abrir menu"
      >
        <Menu className={`${iconSizes.md} ${iconColors.default}`} />
      </button>
      <span className="text-sm font-semibold uppercase tracking-wide text-bjj-gray-200">BJJ Academy</span>
      <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-bjj-red/80 to-bjj-red text-xs font-semibold text-bjj-white shadow-[0_0_0_1px_rgba(225,6,0,0.4)]">
        {avatarUrl ? (
          <img src={avatarUrl} alt={`Avatar de ${displayName}`} className="h-full w-full object-cover" loading="lazy" />
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
                <X className={`${iconSizes.sm} ${iconColors.default}`} />
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
                      {Icon ? <Icon className={`${iconSizes.md} ${iconColors.default}`} /> : null}
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
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={`Avatar de ${displayName}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    initials
                  )}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-bjj-white">{displayName}</span>
                  <span className="text-[11px] text-bjj-gray-200/60">{displayEmail}</span>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                {profilePath && (
                  <Link
                    href={profilePath}
                    className="flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 transition hover:border-bjj-gray-700 hover:bg-bjj-gray-900/70 hover:text-bjj-white"
                    onClick={() => setOpen(false)}
                  >
                    <UserCircle2 className={`${iconSizes.sm} ${iconColors.default}`} /> Meu perfil
                  </Link>
                )}

                {reportsPath && (
                  <Link
                    href={reportsPath}
                    className="flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 transition hover:border-bjj-gray-700 hover:bg-bjj-gray-900/70 hover:text-bjj-white"
                    onClick={() => setOpen(false)}
                  >
                    <BarChart3 className={`${iconSizes.sm} ${iconColors.default}`} /> Relatórios
                  </Link>
                )}

                {configChildren.length > 0 && (
                  <div className="rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/50">
                    <button
                      type="button"
                      onClick={() => setConfigOpen((state) => !state)}
                      className="flex w-full items-center justify-between gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-bjj-gray-300/70 transition hover:text-bjj-white"
                      aria-expanded={configOpen}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Settings2 className={`${iconSizes.sm} ${iconColors.default}`} /> Configurações
                      </span>
                      <ChevronDown
                        className={`transition ${iconSizes.xs} ${
                          configOpen ? iconColors.default : iconColors.muted
                        } ${configOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {configOpen && (
                      <ul className="border-t border-bjj-gray-800/70 px-3 py-2 text-sm">
                        {configChildren.map((child) => (
                          <li key={child.path}>
                            <Link
                              href={child.path}
                              className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-bjj-gray-200/80 transition hover:bg-bjj-gray-900/70 hover:text-bjj-white"
                              onClick={() => {
                                setOpen(false);
                                setConfigOpen(false);
                              }}
                            >
                              <ChevronRight
                                className={`${iconSizes.xs} ${iconColors.muted} group-hover:text-bjj-white`}
                              />{' '}
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-bjj-gray-800 px-3 py-2 text-sm font-semibold text-bjj-gray-200 transition hover:border-bjj-red/70 hover:bg-bjj-red/20 hover:text-bjj-white"
              >
                <LogOut className={`${iconSizes.sm} ${iconColors.danger}`} /> Sair
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
