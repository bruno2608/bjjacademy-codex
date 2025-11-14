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
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-bjj-gray-800/80 bg-bjj-gray-900/95 backdrop-blur-sm lg:hidden"
      role="navigation"
    >
      <ul className="grid grid-cols-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition ${
                  active ? 'text-bjj-red' : 'text-bjj-gray-200/70 hover:text-bjj-white'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
                    active
                      ? 'border-bjj-red/60 bg-bjj-red/10 text-bjj-red'
                      : 'border-transparent bg-bjj-gray-900/60 text-bjj-gray-200/80'
                  }`}
                >
                  <Icon size={18} />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
