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
  const pathname = usePathname();
  const router = useRouter();
  const { hydrateFromStorage, hydrated, updateUser } = useUserStore();
  const { user, aluno } = useCurrentAluno();
  const { staff } = useCurrentStaff();

  const isBareLayout = useMemo(
    () => BARE_PATHS.some((publicPath) => pathname?.startsWith(publicPath)),
    [pathname]
  );

  useEffect(() => {
    if (!hydrated) {
      hydrateFromStorage();
    }
  }, [hydrateFromStorage, hydrated]);

  useEffect(() => {
    if (!hydrated || isBareLayout) return;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname || '/')}`);
    }
  }, [hydrated, isBareLayout, pathname, router, user]);

  useEffect(() => {
    const nextAvatar = aluno?.avatarUrl || staff?.avatarUrl || user?.avatarUrl;
    const nextName = aluno?.nome || staff?.nome;
    if (user && nextAvatar && nextAvatar !== user.avatarUrl && updateUser) {
      updateUser({ avatarUrl: nextAvatar, name: nextName || user.name });
    }
  }, [aluno, staff, updateUser, user]);

  if (isBareLayout) {
    return children;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-bjj-black text-bjj-white">
      <TabletNav />

      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 md:px-6 xl:px-8">{children}</main>

      <ShellFooter />
    </div>
  );
}
