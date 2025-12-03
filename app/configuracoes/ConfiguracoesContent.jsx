'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { getNavigationConfigForRoles } from '../../lib/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCurrentStaff } from '@/hooks/useCurrentStaff';
import { ROLE_KEYS } from '@/config/roles';

/**
 * Página hub das configurações administrativas com links para as subseções.
 */

export default function ConfiguracoesContent() {
  const { user } = useCurrentUser();
  const { staff } = useCurrentStaff();
  const roles = user?.roles || [];

  const sections = useMemo(() => {
    const { configNav } = getNavigationConfigForRoles(roles);
    return configNav?.children ?? [];
  }, [roles]);

  const canManageConfigs = Boolean(
    user?.roles?.some((role) =>
      [ROLE_KEYS.professor, ROLE_KEYS.instrutor, ROLE_KEYS.admin, ROLE_KEYS.ti].includes(role)
    )
  );

  if (!canManageConfigs) {
    return (
      <div className="space-y-4">
        <header className="rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-200/60">Acesso restrito</p>
          <h1 className="mt-2 text-xl font-semibold text-bjj-white">Configurações da academia</h1>
          <p className="mt-2 max-w-2xl text-sm text-bjj-gray-200/70">
            Somente instrutores e administradores podem alterar regras e agenda. Solicite acesso à coordenação.
          </p>
        </header>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-200/60">Painel administrativo</p>
        <h1 className="mt-2 text-xl font-semibold text-bjj-white">Configurações da Academia</h1>
        <p className="mt-2 max-w-2xl text-sm text-bjj-gray-200/70">
          Ajuste regras de graduação, organize a grade de treinos e mantenha os tipos de sessão sempre alinhados à rotina da equipe.
        </p>
        {staff?.nome && (
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-bjj-gray-200/70">
            Responsável: {staff.nome} · {staff.roles?.join(', ') || 'Staff'}
          </p>
        )}
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.path}
              href={section.path}
              className="group rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/60 p-5 transition hover:border-bjj-red/60 hover:bg-bjj-red/10"
            >
              <div className="flex items-center gap-3 text-bjj-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/70 text-bjj-gray-200/80 group-hover:border-bjj-red/50 group-hover:text-bjj-white">
                  {Icon ? <Icon size={18} /> : null}
                </span>
                <div>
                  <h2 className="text-base font-semibold">{section.title}</h2>
                  <p className="text-xs text-bjj-gray-200/70">Gerencie parâmetros essenciais deste módulo.</p>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
