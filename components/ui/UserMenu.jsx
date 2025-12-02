'use client';

/**
 * Menu de usuário inspirado no ChatGPT.
 * Exibe avatar com iniciais, opções rápidas (perfil, relatórios)
 * e atalhos para as subseções de configurações permitidas
 * com base nos papéis do usuário.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, UserCircle2 } from 'lucide-react';
import useUserStore from '../../store/userStore';
import { getNavigationConfigForRoles } from '../../lib/navigation';
import useRole from '../../hooks/useRole';
import { useAlunosStore } from '@/store/alunosStore';
import { useCurrentStaff } from '@/hooks/useCurrentStaff';
import { getUserAvatarData } from '@/lib/userAvatar';

export default function UserMenu({ inline = false }) {
  const router = useRouter();
  const { user, logout, hydrateFromStorage, hydrated } = useUserStore();
  const aluno = useAlunosStore((state) =>
    user?.alunoId ? state.getAlunoById(user.alunoId) : null
  );
  const { staff } = useCurrentStaff();
  const { roles } = useRole();
  const [open, setOpen] = useState(inline);
  const menuRef = useRef(null);

  const navigationConfig = useMemo(() => getNavigationConfigForRoles(roles), [roles]);
  const avatarItems = navigationConfig.avatarMenu;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open && !inline) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open, inline]);

  useEffect(() => {
    if (!hydrated) {
      hydrateFromStorage();
    }
  }, [hydrateFromStorage, hydrated]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const avatarEntity = staff || aluno || user;
  const displayEmail = staff?.email || aluno?.email || user?.email || 'instrutor@bjj.academy';

  const { nome: displayName, avatarUrl, initials } = getUserAvatarData({ ...avatarEntity, email: displayEmail });

  const AvatarBadge = (
    <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-bjj-red/80 to-bjj-red text-xs font-semibold text-bjj-white shadow-[0_0_0_1px_rgba(225,6,0,0.4)]">
      {avatarUrl ? (
        <img src={avatarUrl} alt={`Avatar de ${displayName}`} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        initials
      )}
    </span>
  );

  const menuContent = (
    <div
      className={`${
        inline
          ? 'relative w-full rounded-2xl border border-bjj-gray-800/80 bg-bjj-gray-900/95 p-4'
          : 'absolute right-0 z-40 mt-3 w-64 rounded-2xl border border-bjj-gray-800/80 bg-bjj-gray-900/95 p-4 shadow-[0_25px_65px_rgba(0,0,0,0.5)]'
      }`}
    >
      <header className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-bjj-red/80 to-bjj-red text-sm font-semibold text-bjj-white shadow-[0_0_0_1px_rgba(225,6,0,0.4)]">
            {avatarUrl ? (
              <img src={avatarUrl} alt={`Avatar de ${displayName}`} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              initials
            )}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-bjj-white">{displayName}</span>
            <span className="text-[11px] text-bjj-gray-200/60">{displayEmail}</span>
          </div>
      </header>

      <nav className="mt-4 space-y-1 text-sm text-bjj-gray-200/80">
        {avatarItems.map((item) => {
          if (item.action === 'logout') {
            return null;
          }

          const Icon = item.icon || UserCircle2;

          return (
            <Link
              key={item.key}
              href={item.href || item.path}
              className="flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 transition hover:border-bjj-gray-700 hover:bg-bjj-gray-900/70 hover:text-bjj-white"
              onClick={() => setOpen(false)}
            >
              <Icon size={16} /> {item.title}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-bjj-gray-800 px-3 py-2 text-sm font-semibold text-bjj-gray-200 transition hover:border-bjj-red/70 hover:bg-bjj-red/20 hover:text-bjj-white"
      >
        <LogOut size={16} /> Sair
      </button>
    </div>
  );

  if (inline) {
    return <div ref={menuRef}>{menuContent}</div>;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        className="group inline-flex items-center gap-2 rounded-full border border-bjj-gray-800 bg-bjj-gray-900/70 px-2 py-1.5 text-sm font-medium text-bjj-gray-200 transition hover:border-bjj-red/70 hover:text-bjj-white"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {AvatarBadge}
        <span className="hidden text-xs uppercase tracking-wide text-bjj-gray-300/80 md:inline">{displayName}</span>
        <ChevronDown size={14} className={`transition ${open ? 'rotate-180 text-bjj-white' : 'text-bjj-gray-400 group-hover:text-bjj-white'}`} />
      </button>

      {open ? menuContent : null}
    </div>
  );
}
