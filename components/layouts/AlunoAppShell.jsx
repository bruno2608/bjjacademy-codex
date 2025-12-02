'use client';

import TabletNav from '../ui/TabletNav';
import ShellFooter from './ShellFooter';

export default function AlunoAppShell({ children }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-bjj-black text-bjj-white">
      <TabletNav />

      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 md:px-6 xl:px-8">{children}</main>

      <ShellFooter />
    </div>
  );
}
