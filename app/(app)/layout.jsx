'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/ui/Header';
import TabletNav from '../../components/ui/TabletNav';
import useUserStore from '../../store/userStore';
import { normalizeRoles } from '../../config/roles';

export default function AppLayout({ children }) {
  const router = useRouter();
  const token = useUserStore((state) => state.token);
  const login = useUserStore((state) => state.login);
  const hydrateFromStorage = useUserStore((state) => state.hydrateFromStorage);
  const hydrated = useUserStore((state) => state.hydrated);

  useEffect(() => {
    if (!hydrated) {
      hydrateFromStorage();
      return;
    }

    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('bjj_token') : null;
    if (!storedToken && !token) {
      router.replace('/login');
    }
    if (storedToken && !token) {
      let roles = [];
      if (typeof window !== 'undefined') {
        try {
          const storedRoles = window.localStorage.getItem('bjj_roles');
          if (storedRoles) {
            const parsed = normalizeRoles(JSON.parse(storedRoles));
            if (Array.isArray(parsed)) {
              roles = parsed;
            }
          }
        } catch (error) {
          console.warn('Não foi possível carregar os papéis salvos.', error);
        }
      }
      login({ email: 'instrutor@bjj.academy', roles });
    }
  }, [hydrateFromStorage, hydrated, login, router, token]);

  return (
    <div className="flex min-h-screen flex-col bg-bjj-black">
      <div className="sticky top-0 z-40 flex flex-col bg-bjj-black/95 backdrop-blur">
        <Header />
        <TabletNav />
      </div>
      <main className="flex-1 bg-bjj-gray-900/40">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 pb-10 pt-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
