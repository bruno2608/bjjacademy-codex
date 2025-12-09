'use client';

import { AlertTriangle, EyeOff } from 'lucide-react';

import useUserStore from '@/store/userStore';
import { normalizeRoles } from '@/config/roles';

export default function ImpersonationBanner() {
  const impersonation = useUserStore((state) => state.impersonation);
  const stopImpersonation = useUserStore((state) => state.stopImpersonation);

  if (!impersonation?.isActive || !impersonation.targetUser) return null;

  const target = impersonation.targetUser;
  const roleLabel = normalizeRoles(target.roles).join(' / ');

  return (
    <div className="mx-auto mt-20 w-full max-w-6xl px-4 md:px-6 xl:px-8">
      <div className="flex flex-col gap-3 rounded-2xl border border-amber-400/50 bg-amber-500/15 px-4 py-3 text-amber-50 shadow-[0_16px_40px_rgba(245,158,11,0.22)] md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3 text-sm md:items-center">
          <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/30 text-amber-100">
            <AlertTriangle size={16} />
          </span>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-amber-50">
              Voce esta visualizando o sistema como {target.nomeCompleto || target.name}
            </p>
            <p className="text-xs text-amber-100/90">
              Perfil em teste: {roleLabel || 'Usuario piloto'}. Clique em &quot;Voltar para meu usuario&quot; para sair do modo teste.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={stopImpersonation}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-300/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-50 transition hover:bg-amber-400/20"
        >
          <EyeOff size={14} /> Voltar para meu usuario
        </button>
      </div>
    </div>
  );
}
