'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';

import useUserStore from '../../store/userStore';
import { useCurrentAluno } from '@/hooks/useCurrentAluno';
import { useCurrentStaff } from '@/hooks/useCurrentStaff';
import { useRole } from '@/hooks/useRole';
import StaffAppShell from '../layouts/StaffAppShell';
import AlunoAppShell from '../layouts/AlunoAppShell';

const BARE_PATHS = ['/login', '/unauthorized'];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const { hydrateFromStorage, hydrated, updateUser } = useUserStore();
  const { user, aluno } = useCurrentAluno();
  const { staff } = useCurrentStaff();
  const { isStaff } = useRole();

  useEffect(() => {
    if (!hydrated) {
      hydrateFromStorage();
    }
  }, [hydrateFromStorage, hydrated]);

  useEffect(() => {
    const nextAvatar = aluno?.avatarUrl || staff?.avatarUrl || user?.avatarUrl;
    const nextName = aluno?.nome || staff?.nome;
    if (user && nextAvatar && nextAvatar !== user.avatarUrl && updateUser) {
      updateUser({ avatarUrl: nextAvatar, name: nextName || user.name });
    }
  }, [aluno, staff, updateUser, user]);

  const isBareLayout = useMemo(
    () => BARE_PATHS.some((publicPath) => pathname?.startsWith(publicPath)),
    [pathname]
  );

  if (isBareLayout) {
    return children;
  }

  if (isStaff) {
    return <StaffAppShell>{children}</StaffAppShell>;
  }

  return <AlunoAppShell>{children}</AlunoAppShell>;
}
