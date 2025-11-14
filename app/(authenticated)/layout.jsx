'use client';

/**
 * Layout protegido engloba as rotas autenticadas (dashboard, alunos, presenças e graduações).
 * Verifica token no localStorage e garante navegação segura.
 */
import { useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from '../../components/ui/Header';
import TabletNav from '../../components/ui/TabletNav';
import MobileNav from '../../components/ui/MobileNav';
import useUserStore from '../../store/userStore';

export default function AuthenticatedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useUserStore((state) => state.token);
  const login = useUserStore((state) => state.login);

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('bjj_token') : null;
    if (!storedToken && !token) {
      router.replace('/login');
    }
    if (storedToken && !token) {
      login({ email: 'instrutor@bjj.academy' });
    }
  }, [login, router, token]);

  const pageTitle = useMemo(() => {
    if (pathname.startsWith('/alunos/')) return 'Editar aluno';
    if (pathname.startsWith('/alunos')) return 'Alunos';
    if (pathname.startsWith('/presencas')) return 'Presenças';
    if (pathname.startsWith('/graduacoes')) return 'Graduações';
    return 'Dashboard';
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-bjj-black">
      <div className="sticky top-0 z-40 flex flex-col bg-bjj-black/95 backdrop-blur">
        <Header title={pageTitle} />
        <TabletNav />
      </div>
      <main className="flex-1 bg-bjj-gray-900/40 pb-24 md:pb-0">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 pb-10 pt-6 sm:px-6 lg:px-8">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
