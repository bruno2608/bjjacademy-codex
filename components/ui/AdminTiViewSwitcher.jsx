'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Eye, EyeOff, UserRound } from 'lucide-react';

import { allowedPilotUsers } from '@/services/authMockService';
import { ROLE_KEYS, normalizeRoles } from '@/config/roles';
import useUserStore from '@/store/userStore';

function getRoleLabel(roles = []) {
  const normalized = normalizeRoles(roles);
  if (normalized.includes(ROLE_KEYS.professor)) return 'Staff';
  if (normalized.includes(ROLE_KEYS.instrutor)) return 'Instrutor';
  return 'Aluno';
}

export default function AdminTiViewSwitcher() {
  const ownerUser = useUserStore((state) => state.user);
  const effectiveUser = useUserStore((state) => state.effectiveUser ?? state.user);
  const impersonation = useUserStore((state) => state.impersonation);
  const startImpersonation = useUserStore((state) => state.startImpersonation);
  const stopImpersonation = useUserStore((state) => state.stopImpersonation);

  const [open, setOpen] = useState(false);
  const adminRoles = useMemo(() => normalizeRoles(ownerUser?.roles ?? []), [ownerUser?.roles]);
  const isAdminTi = adminRoles.includes(ROLE_KEYS.adminTi);

  const pilotOptions = useMemo(
    () =>
      allowedPilotUsers.filter((pilot) => {
        const pilotRoles = normalizeRoles(pilot.roles);
        return !pilotRoles.includes(ROLE_KEYS.adminTi) && !pilotRoles.includes(ROLE_KEYS.admin);
      }),
    []
  );

  const [selectedPilotId, setSelectedPilotId] = useState(() => impersonation.targetUser?.id || null);

  useEffect(() => {
    if (impersonation?.targetUser?.id) {
      setSelectedPilotId(impersonation.targetUser.id);
    }
  }, [impersonation?.targetUser?.id]);

  if (!isAdminTi || !ownerUser) return null;

  const activeTarget = impersonation.targetUser;

  const handleActivate = () => {
    const target = pilotOptions.find((option) => option.id === selectedPilotId);
    if (!target) return;
    startImpersonation(target);
    setOpen(false);
  };

  const handleStop = () => {
    stopImpersonation();
    setOpen(false);
  };

  const triggerLabel = impersonation.isActive && activeTarget ? `Testando: ${activeTarget.nomeCompleto || activeTarget.name}` : 'Modo teste';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((state) => !state)}
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
          impersonation.isActive
            ? 'bg-bjj-red/15 text-bjj-white shadow-[0_12px_32px_rgba(225,6,0,0.18)]'
            : 'text-bjj-gray-100 hover:bg-bjj-gray-900/70'
        }`}
      >
        {impersonation.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
        <span className="hidden sm:inline">{triggerLabel}</span>
        <span className="sm:hidden">Ver como…</span>
      </button>

      {open ? (
        <div className="absolute right-0 z-40 mt-3 w-80 rounded-2xl border border-bjj-gray-800 bg-bjj-gray-950 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
          <div className="mb-3 flex items-start gap-3 text-sm text-bjj-gray-200/90">
            <AlertTriangle size={16} className="mt-0.5 text-amber-300" />
            <p className="leading-relaxed">
              Você está em modo de testes de TI. Aqui é possível ver o sistema como usuários piloto sem afetar a autenticação real.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bjj-gray-400">Escolha um usuário piloto</p>
            <div className="space-y-2">
              {pilotOptions.map((option) => {
                const label = getRoleLabel(option.roles);
                const isSelected = selectedPilotId === option.id;
                return (
                  <label
                    key={option.id}
                    onClick={() => setSelectedPilotId(option.id)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                      isSelected
                        ? 'border-bjj-red/70 bg-bjj-red/10 text-bjj-white shadow-[0_12px_28px_rgba(225,6,0,0.18)]'
                        : 'border-bjj-gray-800/70 text-bjj-gray-100 hover:border-bjj-red/60 hover:bg-bjj-gray-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="pilot-user"
                        value={option.id}
                        checked={isSelected}
                        onChange={() => setSelectedPilotId(option.id)}
                        className="h-4 w-4 cursor-pointer text-bjj-red focus:ring-bjj-red"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold">{option.nomeCompleto || option.name}</span>
                        <span className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-400">{label}</span>
                      </div>
                    </div>
                    <UserRound size={16} className="text-bjj-gray-400" />
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 text-sm">
            <button
              type="button"
              onClick={handleActivate}
              disabled={!selectedPilotId}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 font-semibold transition ${
                selectedPilotId
                  ? 'border-bjj-red/70 bg-bjj-red/10 text-bjj-white hover:bg-bjj-red/20'
                  : 'cursor-not-allowed border-bjj-gray-800 bg-bjj-gray-900/60 text-bjj-gray-500'
              }`}
            >
              <Eye size={16} /> Ativar modo teste
            </button>
            <button
              type="button"
              onClick={handleStop}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 font-semibold transition ${
                impersonation.isActive
                  ? 'border-bjj-gray-800 text-bjj-gray-200 hover:border-bjj-red/60 hover:text-bjj-white'
                  : 'cursor-not-allowed border-bjj-gray-800/60 text-bjj-gray-500'
              }`}
              disabled={!impersonation.isActive}
            >
              <EyeOff size={16} /> Voltar para meu usuário
            </button>
            <p className="text-[11px] leading-relaxed text-bjj-gray-400">
              Sessão real: {ownerUser?.nomeCompleto || ownerUser?.name} ({adminRoles.join(', ') || 'ADMIN_TI'})<br />
              Visão atual: {effectiveUser?.nomeCompleto || effectiveUser?.name}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
