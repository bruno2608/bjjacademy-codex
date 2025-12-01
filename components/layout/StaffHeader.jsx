'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

import { STAFF_ROUTE_SECTIONS, getStaffRouteByPath } from '@/config/staffRoutes';

const MOCK_USER = {
  name: 'Professor Piloto',
  academy: 'Academia Demo',
  avatarUrl: 'https://ui-avatars.com/api/?background=111111&color=fff&bold=true&name=Professor+Piloto'
};

export default function StaffHeader() {
  const pathname = usePathname();

  const activeRoute = useMemo(
    () => getStaffRouteByPath(pathname || ''),
    [pathname]
  );

  const sectionLabel = activeRoute ? STAFF_ROUTE_SECTIONS[activeRoute.section] : 'Área do Staff';
  const title = activeRoute?.label || 'Visão do Staff';

  return (
    <header className="border-b border-bjj-gray-800/70 bg-bjj-black/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6 xl:px-8">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">
            <span className="rounded-full bg-bjj-gray-900 px-3 py-1 text-[10px] text-bjj-gray-300">Staff</span>
            <span className="text-bjj-gray-400/80">/</span>
            <span>{sectionLabel}</span>
          </div>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold leading-tight text-white lg:text-3xl">{title}</h1>
              <p className="text-sm text-bjj-gray-300">Layout compartilhado para a visão do professor/instrutor.</p>
            </div>
            <div className="flex items-center gap-3 self-start rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/60 px-3 py-2 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
              <div className="text-right text-sm leading-tight">
                <p className="font-semibold text-white">{MOCK_USER.name}</p>
                <p className="text-bjj-gray-300">{MOCK_USER.academy}</p>
              </div>
              <div className="h-10 w-10 overflow-hidden rounded-xl border border-bjj-gray-800 bg-bjj-gray-900">
                <img src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 lg:self-start">
          <div className="rounded-xl border border-dashed border-bjj-gray-800/70 bg-bjj-gray-900/50 px-4 py-2 text-xs text-bjj-gray-300">
            Espaço para ações rápidas do staff
          </div>
        </div>
      </div>
    </header>
  );
}
