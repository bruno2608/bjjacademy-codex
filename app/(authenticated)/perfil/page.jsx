'use client';

import useUserStore from '../../../store/userStore';

/**
 * Resume dados básicos do usuário logado e evidencia os papéis ativos.
 */

export default function PerfilPage() {
  const user = useUserStore((state) => state.user);
  const initials = (user?.name || user?.email || 'Instrutor')
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase();

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-200/60">Preferências pessoais</p>
        <div className="mt-3 flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-bjj-red/80 to-bjj-red text-lg font-semibold text-bjj-white shadow-[0_0_0_1px_rgba(225,6,0,0.4)]">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={`Avatar de ${user?.name || 'Instrutor'}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              initials
            )}
          </span>
          <div>
            <h1 className="text-xl font-semibold text-bjj-white">Meu Perfil</h1>
            <p className="mt-1 text-sm text-bjj-gray-200/70">
              Ajuste seu perfil e visualize os papéis habilitados para acessar módulos administrativos.
            </p>
          </div>
        </div>
      </header>
      <section className="rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-6 text-sm text-bjj-gray-200/80">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-200/60">Nome</p>
            <p className="mt-1 text-base font-semibold text-bjj-white">{user?.name || 'Instrutor'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-200/60">E-mail</p>
            <p className="mt-1 text-base font-semibold text-bjj-white">{user?.email || 'instrutor@bjj.academy'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-200/60">Papéis ativos</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(user?.roles || ['INSTRUTOR']).map((role) => (
                <span key={role} className="rounded-full border border-bjj-red/50 bg-bjj-red/10 px-3 py-1 text-xs text-bjj-white">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
