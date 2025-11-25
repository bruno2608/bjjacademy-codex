'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';

import TabletNav from './TabletNav';
import useUserStore from '../../store/userStore';
import { useCurrentAluno } from '@/hooks/useCurrentAluno';
import { useCurrentStaff } from '@/hooks/useCurrentStaff';

const BARE_PATHS = ['/login', '/unauthorized'];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const { hydrateFromStorage, hydrated, updateUser } = useUserStore();
  const { user, aluno } = useCurrentAluno();
  const { staff } = useCurrentStaff();

  useEffect(() => {
    if (!hydrated) {
      hydrateFromStorage();
    }
  }, [hydrateFromStorage, hydrated]);

  useEffect(() => {
    const nextAvatar = aluno?.avatarUrl || staff?.avatarUrl || user?.avatarUrl;
    const nextName = aluno?.nome || staff?.nome;
    if (user && nextAvatar && nextAvatar !== user.avatarUrl && updateUser) {
      updateUser({ avatarUrl: nextAvatar, name: nextName || user.name });
    }
  }, [aluno, staff, updateUser, user]);

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
      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 md:px-6 xl:px-8">{children}</main>
      <footer className="footer footer-center mt-auto w-full border-t border-bjj-gray-900 bg-bjj-gray-950/80 px-4 py-6 text-sm text-bjj-gray-300">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm">
          <span className="font-semibold text-white">BJJ Academy</span>
          <span className="text-bjj-gray-400">PWA pronto para instalar</span>
          <span className="text-bjj-gray-400">Built with Next.js 14 + Tailwind + DaisyUI</span>
          <span className="text-bjj-gray-400">Suporte: suporte@bjj.academy</span>
        </div>
      </footer>
    </div>
  );
}
