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
    <aside className="hidden min-h-screen w-60 flex-col border-r border-bjj-gray-800 bg-bjj-gray-900 text-bjj-white lg:flex">
      <div className="px-5 py-5 text-xl font-bold tracking-wide">BJJ Academy</div>
      <nav className="flex-1 space-y-1.5 px-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 transition ${
                active ? 'bg-bjj-red text-bjj-white' : 'text-bjj-gray-200 hover:bg-bjj-gray-800'
              }`}
            >
              <Icon size={16} />
              <span className="text-[13px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
