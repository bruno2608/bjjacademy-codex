'use client';

/**
 * Layout protegido engloba as rotas autenticadas (dashboard e alunos).
 * Verifica token no localStorage e garante navegação segura.
 */
import { useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import useUserStore from '../../store/userStore';

export default function AuthenticatedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, login } = useUserStore();

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
    if (pathname.startsWith('/alunos/novo')) return 'Novo aluno';
    if (pathname.startsWith('/alunos/')) return 'Editar aluno';
    if (pathname.startsWith('/alunos')) return 'Alunos';
    return 'Dashboard';
  }, [pathname]);

  return (
    <div className="min-h-screen bg-bjj-black flex">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header title={pageTitle} />
        <section className="flex-1 p-6 bg-bjj-gray-900/40">{children}</section>
      </main>
    </div>
  );
}
