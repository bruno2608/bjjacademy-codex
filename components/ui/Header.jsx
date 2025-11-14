'use client';

/**
 * Header mobile mantém branding enxuto; navegação maior incorpora ações de usuário.
 */
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useUserStore from '../../store/userStore';

export default function Header() {
  const router = useRouter();
  const { logout } = useUserStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-bjj-gray-800 bg-bjj-gray-900/80 px-4 py-3 backdrop-blur md:hidden">
      <span className="text-sm font-semibold uppercase tracking-wide text-bjj-gray-200">BJJ Academy</span>
      <button onClick={handleLogout} className="inline-flex items-center gap-1.5 rounded-full border border-bjj-gray-800 px-3 py-1.5 text-xs font-medium text-bjj-gray-200 transition hover:border-bjj-red/70 hover:bg-bjj-red/20 hover:text-bjj-white">
        <LogOut size={14} />
        Sair
      </button>
    </header>
  );
}
