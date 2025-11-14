'use client';

/**
 * Navegação horizontal pensada para tablets e telas médias.
 * Reproduz o mesmo catálogo de rotas com um layout compacto e responsivo.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import navigationItems from '../../lib/navigation';

export default function TabletNav() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden border-b border-bjj-gray-800/70 bg-bjj-black/95 backdrop-blur md:block lg:hidden"
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex w-full max-w-5xl gap-3 overflow-x-auto px-4 py-3 sm:px-6">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex min-w-[180px] flex-1 items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                active
                  ? 'border-bjj-red/80 bg-bjj-red/15 text-bjj-white shadow-[0_12px_28px_rgba(225,6,0,0.2)]'
                  : 'border-bjj-gray-800/80 text-bjj-gray-200/80 hover:border-bjj-gray-700 hover:bg-bjj-gray-900/60 hover:text-bjj-white'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl border text-bjj-white transition ${
                  active
                    ? 'border-bjj-red bg-bjj-red'
                    : 'border-bjj-gray-800 bg-bjj-gray-900/70 text-bjj-gray-200/80 group-hover:border-bjj-gray-700 group-hover:bg-bjj-gray-800'
                }`}
              >
                <Icon size={18} />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-tight">{item.label}</span>
                {item.description && (
                  <span className="text-[11px] leading-tight text-bjj-gray-200/70">{item.description}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
