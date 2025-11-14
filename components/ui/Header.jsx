'use client';

/**
 * Header component exibe título da página e ações secundárias como logout.
 */
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useUserStore from '../../store/userStore';

export default function Header({ title }) {
  const router = useRouter();
  const { user, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-bjj-gray-800 bg-bjj-gray-900/80 px-5 py-3 backdrop-blur">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-bjj-gray-200/80">{user?.name || 'Instrutor'}</span>
        <button onClick={handleLogout} className="flex items-center gap-1.5 btn-primary">
          <LogOut size={15} />
          Sair
        </button>
      </div>
    </header>
  );
}
