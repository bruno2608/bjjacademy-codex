'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';

import TabletNav from './TabletNav';
import SidebarNav from './SidebarNav';
import useUserStore from '../../store/userStore';

const BARE_PATHS = ['/login', '/unauthorized'];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const { hydrateFromStorage, hydrated } = useUserStore();

  useEffect(() => {
    if (!hydrated) {
      hydrateFromStorage();
    }
  }, [hydrateFromStorage, hydrated]);

  const isBareLayout = useMemo(
    () => BARE_PATHS.some((publicPath) => pathname?.startsWith(publicPath)),
    [pathname]
  );

  if (isBareLayout) {
    return children;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-bjj-black text-bjj-white">
      <TabletNav />
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 pb-12 pt-6 md:px-6 xl:px-8">
        <SidebarNav />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
