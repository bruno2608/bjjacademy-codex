'use client';

import { usePwaUpdate } from '@/hooks/usePwaUpdate';

export default function PwaUpdateBanner() {
  const { hasUpdate, updateNow } = usePwaUpdate();

  if (!hasUpdate) return null;

  return (
    <div className="toast toast-center md:toast-end toast-bottom z-[60]">
      <div className="alert alert-info shadow-lg bg-base-200/90 backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <div>
            <p className="text-sm font-semibold text-base-content">Nova versao disponivel.</p>
            <p className="text-xs text-base-content/70">Clique em atualizar para aplicar as novidades.</p>
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={updateNow}>
            Atualizar agora
          </button>
        </div>
      </div>
    </div>
  );
}
