'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getNavigationItemsForRoles } from '../../lib/navigation';
import useRole from '../../hooks/useRole';

export default function SidebarNav() {
  const pathname = usePathname();
  const { roles } = useRole();
  const items = getNavigationItemsForRoles(roles);

  if (!items.length) return null;

  return (
    <aside className="sticky top-[90px] hidden h-[calc(100vh-130px)] w-64 shrink-0 flex-col gap-4 overflow-hidden rounded-3xl bg-gradient-to-b from-bjj-gray-900 via-bjj-gray-900/85 to-bjj-black/70 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)] lg:flex">
      <div className="rounded-2xl border border-bjj-red/30 bg-bjj-red/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-bjj-red">
        Painel BJJ Academy
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-bjj-gray-800/80">
        {items.map((item) => {
          const active = pathname === item.path || pathname.startsWith(`${item.path}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`group flex items-center gap-3 rounded-2xl border px-3 py-2 text-sm transition ${
                active
                  ? 'border-bjj-red bg-bjj-red/15 text-white shadow-[0_18px_45px_rgba(225,6,0,0.25)]'
                  : 'border-transparent text-bjj-gray-200 hover:border-bjj-red/50 hover:bg-bjj-gray-900'
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                  active
                    ? 'border-bjj-red bg-bjj-red text-white'
                    : 'border-bjj-gray-800 bg-bjj-gray-900 text-bjj-gray-200 group-hover:border-bjj-red/60'
                }`}
              >
                {Icon ? <Icon size={16} /> : null}
              </span>
              <div className="flex flex-1 items-center justify-between gap-2">
                <span className="font-semibold leading-none">{item.title}</span>
                <span className={`h-2 w-2 rounded-full ${active ? 'bg-bjj-red' : 'bg-bjj-gray-700 group-hover:bg-bjj-red/70'}`} />
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
