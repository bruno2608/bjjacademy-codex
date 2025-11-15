'use client';

/**
 * Sidebar component controla navegação principal para telas grandes,
 * agora respeitando o mapa de rotas central e as permissões de papéis.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getNavigationItemsForRoles } from '../../lib/navigation';
import useUserStore from '../../store/userStore';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const roles = useUserStore((state) => state.user?.roles || []);

  // Exibe apenas itens realmente relevantes na navegação principal,
  // mas garante que "Configurações" permaneça disponível para perfis autorizados.
  const allowedItems = useMemo(() => {
    const items = getNavigationItemsForRoles(roles, { includeHidden: true });
    return items.filter((item) => item.showInMainNav !== false || item.path === '/configuracoes');
  }, [roles]);

  const [openSections, setOpenSections] = useState({});

  // Mantém seções com submenus abertas quando a rota atual pertence a elas
  // e cria estado padrão somente quando necessário (evitando sobrescrever preferências).
  useEffect(() => {
    setOpenSections((previous) => {
      const nextState = { ...previous };
      allowedItems.forEach((item) => {
        if (item.children?.length) {
          if (typeof nextState[item.path] === 'undefined') {
            nextState[item.path] = pathname.startsWith(item.path);
          } else if (pathname.startsWith(item.path)) {
            nextState[item.path] = true;
          }
        }
      });
      return nextState;
    });
  }, [allowedItems, pathname]);

  const toggleSection = (path) => {
    setOpenSections((previous) => ({
      ...previous,
      [path]: !previous[path]
    }));
  };

  return (
    <aside className="hidden min-h-screen w-72 flex-col border-r border-bjj-gray-800 bg-gradient-to-b from-bjj-gray-900 via-bjj-black to-bjj-black text-bjj-white lg:flex">
      <div className="px-6 pb-6 pt-8">
        <div className="rounded-3xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.65)]">
          <span className="text-[11px] uppercase tracking-[0.22em] text-bjj-red/80">Zenko Focus</span>
          <h1 className="mt-3 text-2xl font-semibold">BJJ Academy</h1>
          <p className="mt-2 text-[12px] leading-relaxed text-bjj-gray-200/70">
            Gerencie alunos, presenças e graduações em um único comando visual.
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-3 px-6">
        {allowedItems.map((item) => {
          const active = pathname === item.path || pathname.startsWith(`${item.path}/`);
          const Icon = item.icon;
          const hasChildren = Boolean(item.children?.length);
          const isOpen = hasChildren ? Boolean(openSections[item.path]) : false;

          if (!hasChildren) {
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`group relative flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${
                  active
                    ? 'border-bjj-red/70 bg-bjj-red/10 text-bjj-white shadow-[0_18px_45px_rgba(225,6,0,0.18)]'
                    : 'border-transparent text-bjj-gray-200 hover:border-bjj-gray-700/70 hover:bg-bjj-gray-900/60 hover:text-bjj-white'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                    active
                      ? 'bg-bjj-red text-bjj-white'
                      : 'bg-bjj-gray-900/70 text-bjj-gray-200/80 group-hover:bg-bjj-gray-800 group-hover:text-bjj-white'
                  }`}
                >
                  {Icon ? <Icon size={18} /> : null}
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1/2 h-8 -translate-y-1/2 rounded-r-full transition-all ${
                    active ? 'w-1 bg-bjj-red' : 'w-0 bg-transparent group-hover:w-1 group-hover:bg-bjj-gray-700/80'
                  }`}
                />
              </Link>
            );
          }

          const childLinks = [
            {
              ...item,
              title: 'Visão geral',
              isParentLink: true
            },
            ...item.children
          ];

          return (
            <div key={item.path}>
              <button
                type="button"
                onClick={() => toggleSection(item.path)}
                className={`group relative flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                  active
                    ? 'border-bjj-red/70 bg-bjj-red/10 text-bjj-white shadow-[0_18px_45px_rgba(225,6,0,0.18)]'
                    : 'border-transparent text-bjj-gray-200 hover:border-bjj-gray-700/70 hover:bg-bjj-gray-900/60 hover:text-bjj-white'
                }`}
                aria-expanded={isOpen}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                    active || isOpen
                      ? 'bg-bjj-red text-bjj-white'
                      : 'bg-bjj-gray-900/70 text-bjj-gray-200/80 group-hover:bg-bjj-gray-800 group-hover:text-bjj-white'
                  }`}
                >
                  {Icon ? <Icon size={18} /> : null}
                </span>
                <div className="flex flex-1 flex-col leading-tight">
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="text-[11px] text-bjj-gray-200/60">{item.children.length} seção(ões)</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isOpen ? 'rotate-180 text-bjj-white' : 'text-bjj-gray-400 group-hover:text-bjj-white'
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1/2 h-8 -translate-y-1/2 rounded-r-full transition-all ${
                    active || isOpen
                      ? 'w-1 bg-bjj-red'
                      : 'w-0 bg-transparent group-hover:w-1 group-hover:bg-bjj-gray-700/80'
                  }`}
                />
              </button>
              {isOpen ? (
                <ul className="mt-2 space-y-1 pl-4 text-[12px] text-bjj-gray-200/70">
                  {childLinks.map((child) => {
                    const childActive = pathname === child.path || pathname.startsWith(`${child.path}/`);
                    const ChildIcon = child.icon;
                    return (
                      <li key={`${child.path}-${child.isParentLink ? 'overview' : 'child'}`}>
                        <Link
                          href={child.path}
                          className={`flex items-center gap-2 rounded-xl px-3 py-2 transition ${
                            childActive
                              ? 'bg-bjj-red/20 text-bjj-white'
                              : 'hover:bg-bjj-gray-900/60 hover:text-bjj-white'
                          }`}
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-bjj-gray-900/70 text-bjj-gray-200/80">
                            {child.isParentLink ? <ExternalLink size={12} /> : ChildIcon ? <ChildIcon size={12} /> : null}
                          </span>
                          {child.isParentLink ? 'Visão geral' : child.title}
                          {child.isParentLink ? (
                            <ChevronRight size={12} className="ml-auto text-bjj-gray-400" />
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        })}
      </nav>
      <div className="px-6 pb-8 pt-4">
        <div className="rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/40 p-4 text-[11px] leading-relaxed text-bjj-gray-200/70">
          <p className="font-semibold text-bjj-white">Dica rápida</p>
          <p className="mt-2">
            Revise as presenças antes das 22h para manter os indicadores em tempo real e alinhar a equipe.
          </p>
        </div>
      </div>
    </aside>
  );
}
