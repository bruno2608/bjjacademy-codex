'use client';

/**
 * Navegação superior inspirada no Zenko Focus para telas médias e grandes.
 * Exibe pílulas compactas alinhadas ao cabeçalho para evitar altura excessiva.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import navigationItems from '../../lib/navigation';

export default function TabletNav() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden border-b border-bjj-gray-800/70 bg-bjj-black/95 backdrop-blur md:block"
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
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
                <Icon size={16} />
              </span>
              <span className="font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
