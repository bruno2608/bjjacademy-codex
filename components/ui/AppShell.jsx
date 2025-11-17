'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';

import TabletNav from './TabletNav';
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
    <div className="min-h-screen bg-bjj-black text-bjj-white">
      <TabletNav />
      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-6 md:px-6 xl:px-8">{children}</main>
    </div>
  );
}
