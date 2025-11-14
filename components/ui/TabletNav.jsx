'use client';

/**
 * Navegação superior inspirada no Zenko Focus para telas médias e grandes.
 * Exibe um card contextual seguido pelos atalhos principais em grade responsiva.
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
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-stretch lg:gap-6">
        <div className="rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] lg:w-[320px]">
          <span className="text-[11px] uppercase tracking-[0.22em] text-bjj-red/80">Zenko Focus</span>
          <h2 className="mt-3 text-xl font-semibold text-bjj-white">BJJ Academy</h2>
          <p className="mt-2 text-[12px] leading-relaxed text-bjj-gray-200/70">
            Navegue pelos módulos e acompanhe a evolução do seu tatame em tempo real.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                  active
                    ? 'border-bjj-red/80 bg-bjj-red/15 text-bjj-white shadow-[0_18px_45px_rgba(225,6,0,0.18)]'
                    : 'border-bjj-gray-800/80 text-bjj-gray-200/80 hover:border-bjj-gray-700 hover:bg-bjj-gray-900/60 hover:text-bjj-white'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                    active
                      ? 'border-bjj-red bg-bjj-red text-bjj-white'
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
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-1/2 right-4 h-6 -translate-y-1/2 rounded-full transition ${
                    active ? 'w-1 bg-bjj-red' : 'w-0 bg-transparent group-hover:w-1 group-hover:bg-bjj-gray-700/80'
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
