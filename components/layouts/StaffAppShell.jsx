'use client';

import Sidebar from '../ui/Sidebar';
import TabletNav from '../ui/TabletNav';
import ShellFooter from './ShellFooter';

export default function StaffAppShell({ children }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-bjj-black text-bjj-white lg:flex">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <div className="lg:hidden">
          <TabletNav />
        </div>

        <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 md:px-6 xl:px-8">{children}</main>

        <ShellFooter />
      </div>
    </div>
  );
}
