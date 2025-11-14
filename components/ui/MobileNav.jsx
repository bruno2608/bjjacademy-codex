'use client';

/**
 * MobileNav replica a experiência do app mobile com uma barra inferior
 * fixa contendo as rotas principais da área autenticada.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import navigationItems from '../../lib/navigation';

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-bjj-gray-800/80 bg-bjj-black/95 backdrop-blur-md md:hidden"
      role="navigation"
    >
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex flex-1 flex-col items-center gap-1 text-[11px] font-medium transition ${
                active ? 'text-bjj-white' : 'text-bjj-gray-200/70 hover:text-bjj-white'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-2xl border text-[12px] transition ${
                  active
                    ? 'border-bjj-red bg-bjj-red/20 text-bjj-white shadow-[0_12px_28px_rgba(225,6,0,0.22)]'
                    : 'border-bjj-gray-800 bg-bjj-gray-900/60 text-bjj-gray-200/80 group-hover:border-bjj-gray-700 group-hover:bg-bjj-gray-800'
                }`}
              >
                <Icon size={18} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
