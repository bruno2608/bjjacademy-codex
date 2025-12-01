'use client';

import { useMemo } from 'react';

import StaffHeader from './StaffHeader';
import Sidebar from '@/components/ui/Sidebar';
import TabletNav from '@/components/ui/TabletNav';
import { STAFF_ROUTES } from '@/config/staffRoutes';

export default function StaffAppShell({ children }) {
  const navigationItems = useMemo(
    () =>
      STAFF_ROUTES.filter((route) => route.visible !== false).map((route) => ({
        path: route.path,
        title: route.label,
        icon: route.icon
      })),
    []
  );

  return (
    <div className="min-h-screen bg-bjj-black text-bjj-white lg:flex">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col bg-bjj-black/80">
        <div className="lg:hidden">
          <TabletNav items={navigationItems} />
        </div>
        <StaffHeader />
        <main className="flex-1 min-w-0 px-4 py-4 lg:px-6 lg:py-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
