'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import useUserStore from '../../store/userStore';
import { useCurrentAluno } from '@/hooks/useCurrentAluno';
import { useCurrentStaff } from '@/hooks/useCurrentStaff';
import TabletNav from './TabletNav';
import ShellFooter from '../layouts/ShellFooter';

const BARE_PATHS = ['/login', '/unauthorized'];

export default function AppShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { hydrateFromStorage, hydrated, updateUser, user: storeUser } = useUserStore();
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
    if (storeUser && nextAvatar && nextAvatar !== storeUser.avatarUrl && updateUser) {
      updateUser({ avatarUrl: nextAvatar, name: nextName || storeUser.name });
    }
  }, [aluno, staff, storeUser, updateUser]);

  const isBareLayout = useMemo(
    () => BARE_PATHS.some((publicPath) => pathname?.startsWith(publicPath)),
    [pathname]
  );

  useEffect(() => {
    if (hydrated && !storeUser) {
      router.replace('/login');
    }
  }, [hydrated, router, storeUser]);

  if (isBareLayout) {
    return children;
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bjj-black text-bjj-white">
        <div className="text-sm text-bjj-gray-200">Carregando ambiente...</div>
      </div>
    );
  }

  if (!storeUser) {
    return null;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-bjj-black text-bjj-white">
      <TabletNav />

      {/* Top padding keeps content clear of the fixed header above. */}
      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-24 md:px-6 xl:px-8">{children}</main>

      <ShellFooter />
    </div>
  );
}
