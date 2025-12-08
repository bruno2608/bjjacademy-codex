'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import useUserStore from '../../store/userStore';
import { useCurrentAluno } from '@/hooks/useCurrentAluno';
import { useCurrentStaff } from '@/hooks/useCurrentStaff';
import TabletNav from './TabletNav';
import ShellFooter from '../layouts/ShellFooter';
import ImpersonationBanner from './ImpersonationBanner';

const BARE_PATHS = ['/login', '/unauthorized', '/z-ui'];

export default function AppShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { hydrateFromStorage, hydrated, updateUser, user: storeUser, impersonation } = useUserStore();
  const { aluno } = useCurrentAluno();
  const { staff } = useCurrentStaff();

  useEffect(() => {
    if (!hydrated) {
      hydrateFromStorage();
    }
  }, [hydrateFromStorage, hydrated]);

  useEffect(() => {
    const nextAvatar = aluno?.avatarUrl || staff?.avatarUrl || storeUser?.avatarUrl;
    const nextName = aluno?.nome || staff?.nome;
    if (storeUser && nextAvatar && nextAvatar !== storeUser.avatarUrl && updateUser && !impersonation.isActive) {
      updateUser({ avatarUrl: nextAvatar, name: nextName || storeUser.name });
    }
  }, [aluno, staff, storeUser, updateUser, impersonation?.isActive]);

  const isBareLayout = useMemo(
    () => BARE_PATHS.some((publicPath) => pathname?.startsWith(publicPath)),
    [pathname]
  );

  useEffect(() => {
    // Skip auth redirect for bare/public layouts like login, unauthorized, and z-ui.
    if (!isBareLayout && hydrated && !storeUser) {
      router.replace('/login');
    }
  }, [hydrated, router, storeUser, isBareLayout]);

  if (isBareLayout) {
    return children;
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-100 text-base-content">
        <div className="text-sm text-base-content/70">Carregando ambiente...</div>
      </div>
    );
  }

  if (!storeUser) {
    return null;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-base-100 text-base-content">
      <TabletNav />
      <ImpersonationBanner />

      {/* Top padding keeps content clear of the fixed header above. */}
      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-24 md:px-6 xl:px-8">{children}</main>

      <ShellFooter />
    </div>
  );
}
