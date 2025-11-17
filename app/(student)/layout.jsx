'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CalendarCheck, FileText, Home, LogOut, ShieldCheck, User, ClipboardList } from 'lucide-react';
import useUserStore from '../../store/userStore';

const NAV_ITEMS = [
  { href: '/dashboard-aluno', label: 'Dashboard', icon: Home },
  { href: '/checkin', label: 'Check-in', icon: ShieldCheck },
  { href: '/agenda', label: 'Agenda semanal', icon: CalendarCheck },
  { href: '/historico-presencas', label: 'Histórico', icon: ClipboardList },
  { href: '/documentos', label: 'Documentos', icon: FileText },
  { href: '/relatorios-aluno', label: 'Relatórios', icon: FileText },
  { href: '/perfil-aluno', label: 'Meu perfil', icon: User }
];

export default function StudentLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useUserStore();
  const roles = user?.roles || [];

  useEffect(() => {
    if (!roles.includes('ALUNO')) {
      router.replace('/dashboard');
    }
  }, [roles, router]);

  const initials = (user?.name || user?.email || 'Aluno')
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-bjj-black text-bjj-white">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-bjj-gray-800 bg-bjj-gray-900/80 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bjj-red text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(225,6,0,0.4)]">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" className="h-full w-full rounded-full object-cover" /> : initials}
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">{user?.name || 'Aluno'}</p>
            <p className="text-xs text-bjj-gray-300/80">Acesso aluno</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-bjj-gray-800 bg-bjj-gray-900/80 px-3 py-2 text-sm text-bjj-gray-200 transition hover:border-bjj-red/60 hover:text-white"
        >
          <LogOut size={16} /> Sair
        </button>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 md:flex-row">
        <aside className="sticky top-20 flex w-full flex-wrap gap-2 rounded-2xl border border-bjj-gray-800 bg-bjj-gray-900/50 p-3 md:w-64 md:flex-col md:space-y-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 items-center gap-3 rounded-xl px-3 py-2 text-sm transition md:w-full ${
                  active
                    ? 'border border-bjj-red/60 bg-bjj-red/10 text-white shadow-[0_18px_45px_rgba(225,6,0,0.18)]'
                    : 'border border-bjj-gray-800 text-bjj-gray-200 hover:border-bjj-red/60 hover:bg-bjj-red/5'
                }`}
              >
                <Icon size={16} /> {item.label}
              </Link>
            );
          })}
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
