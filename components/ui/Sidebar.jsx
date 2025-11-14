'use client';

/**
 * Sidebar component controla navegação principal, com ícones Lucide e responsividade.
 */
import { useState } from 'react';
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarCheck,
  Medal
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/alunos', label: 'Alunos', icon: Users },
  { href: '/alunos/novo', label: 'Novo aluno', icon: UserPlus },
  { href: '/presencas', label: 'Presenças', icon: CalendarCheck },
  { href: '/graduacoes', label: 'Graduações', icon: Medal }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const Navigation = () => (
    <nav className="flex-1 space-y-2 px-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              active ? 'bg-bjj-red text-bjj-white' : 'text-bjj-gray-200 hover:bg-bjj-gray-800'
            }`}
          >
            <Icon size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="bg-bjj-gray-900 text-bjj-white min-h-screen w-72 hidden lg:flex flex-col border-r border-bjj-gray-800">
        <div className="px-6 py-6 text-2xl font-bold tracking-wide">BJJ Academy</div>
        <Navigation />
      </aside>

      {/* Botão hamburger visível apenas no mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-bjj-red text-bjj-white p-2 rounded-full shadow-focus"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 bg-bjj-black/80 backdrop-blur flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-bjj-gray-800">
            <span className="text-lg font-semibold">BJJ Academy</span>
            <button className="p-2" onClick={() => setOpen(false)} aria-label="Fechar menu">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-6 space-y-4">
            <Navigation />
          </div>
        </div>
      )}
    </>
  );
}
