'use client';

/**
 * Sidebar component controla navegação principal para telas grandes.
 * Em dispositivos móveis a navegação é suprida pelo MobileNav.
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import navigationItems from '../../lib/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 flex-col border-r border-bjj-gray-800 bg-bjj-gray-900 text-bjj-white lg:flex">
      <div className="px-6 py-6 text-2xl font-bold tracking-wide">BJJ Academy</div>
      <nav className="flex-1 space-y-2 px-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                active ? 'bg-bjj-red text-bjj-white' : 'text-bjj-gray-200 hover:bg-bjj-gray-800'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
