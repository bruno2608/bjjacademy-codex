'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';

import TabletNav from './TabletNav';
import { useAlunosStore } from '../../store/alunosStore';
import useUserStore from '../../store/userStore';

const BARE_PATHS = ['/login', '/unauthorized'];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const { hydrateFromStorage, hydrated, user, updateUser } = useUserStore();
  const alunos = useAlunosStore((state) => state.alunos);

  useEffect(() => {
    if (!hydrated) {
      hydrateFromStorage();
    }
  }, [hydrateFromStorage, hydrated]);

  useEffect(() => {
    if (!user?.alunoId) return;
    const aluno = alunos.find((item) => item.id === user.alunoId);
    if (!aluno) return;

    const nextAvatar = aluno.avatarUrl || user.avatarUrl;
    if (nextAvatar && nextAvatar !== user.avatarUrl && updateUser) {
      updateUser({ avatarUrl: nextAvatar, name: aluno.nome });
    }
  }, [alunos, updateUser, user]);

  const isBareLayout = useMemo(
    () => BARE_PATHS.some((publicPath) => pathname?.startsWith(publicPath)),
    [pathname]
  );

  if (isBareLayout) {
    return children;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-base-100 text-base-content">
      <TabletNav />
      <main className="mx-auto w-full max-w-7xl px-4 pb-12 pt-6 md:px-6 xl:px-8">{children}</main>
      <footer className="footer footer-center mt-auto w-full border-t border-base-300/60 bg-base-200/40 px-4 py-6 text-sm text-base-content">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm">
          <span className="font-semibold">BJJ Academy</span>
          <span className="opacity-70">PWA pronto para instalar</span>
          <span className="opacity-70">Built with Next.js 14 + Tailwind + DaisyUI</span>
          <span className="opacity-70">Suporte: suporte@bjj.academy</span>
        </div>
      </footer>
    </div>
  );
}
