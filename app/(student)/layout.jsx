'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/ui/Header';
import TabletNav from '../../components/ui/TabletNav';
import useUserStore from '../../store/userStore';

export default function StudentLayout({ children }) {
  const router = useRouter();
  const { user } = useUserStore();
  const roles = user?.roles || [];

  useEffect(() => {
    if (roles.length && !roles.includes('ALUNO')) {
      router.replace('/dashboard');
    }
  }, [roles, router]);

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
