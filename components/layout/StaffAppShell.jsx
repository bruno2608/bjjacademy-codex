'use client';

import StaffHeader from './StaffHeader';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';

export default function StaffAppShell({ children }) {
  return (
    <div className="min-h-screen bg-bjj-black text-bjj-white lg:flex">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col bg-bjj-black/80">
        <div className="lg:hidden">
          <Header />
        </div>
        <StaffHeader />
        <main className="flex-1 min-w-0 px-4 py-4 lg:px-6 lg:py-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
