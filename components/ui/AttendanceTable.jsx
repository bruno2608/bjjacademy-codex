'use client';

/**
 * AttendanceTable organiza presenças por aluno/data e exibe botões para
 * alternar status rapidamente, mantendo o novo visual gamificado e
 * preparado para mobile-first.
 */
import { CheckCircle2, Circle, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { iconColors, iconSizes } from '@/styles/iconTokens';

export default function AttendanceTable({
  records,
  onToggle,
  onDelete,
  onEdit,
  onAddSession,
  onRequestSession,
  isLoading = false
}) {
  const actionButtonClasses =
    'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-bjj-gray-700 text-bjj-gray-200 transition hover:border-bjj-red hover:text-bjj-red disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-bjj-gray-800/70 bg-bjj-gray-900/70 shadow-[0_12px_28px_-20px_rgba(0,0,0,0.45)]"
      aria-busy={isLoading}
    >
      <div className="absolute right-[-18%] top-[-18%] h-24 w-24 rounded-full bg-bjj-red/10 blur-3xl" aria-hidden />
      <div className="hidden md:grid md:grid-cols-[140px_minmax(0,1.1fr)_minmax(0,0.8fr)_minmax(0,1.4fr)_minmax(0,0.6fr)] bg-bjj-gray-900/60 text-[11px] uppercase tracking-[0.14em] text-bjj-gray-200/60">
        {['Ações', 'Aluno', 'Graduação', 'Data / Treino', 'Status'].map((header, index) => (
          <div key={header} className={`px-3 py-3 ${index === 0 ? 'text-center' : ''}`}>
            {header}
          </div>
        ))}
      </div>
      <div className="relative divide-y divide-bjj-gray-800/80">
        {records.map((record) => {
          const formattedDate = new Date(record.data).toLocaleDateString('pt-BR');
          const faixa = record.faixa || 'Sem faixa';
          const graus = Number.isFinite(Number(record.graus)) ? Number(record.graus) : 0;
          const hora = record.hora || '—';
          const treinoLabel = record.tipoTreino || 'Sessão principal';
          const horarioLabel = hora !== '—' ? `${hora}h` : 'Sem horário';
          const dataTreinoLabel = `${formattedDate} · ${horarioLabel} · ${treinoLabel}`;
          const isPlaceholder = Boolean(record.isPlaceholder);
          const isConfirmed = record.status === 'Presente';
          const handleToggle = () => {
            if (isPlaceholder) {
              onRequestSession?.(record);
            } else if (!isConfirmed) {
              onToggle?.(record);
            }
          };

          return (
            <div
              key={record.id || `${record.alunoId}-${record.treinoId || record.data}`}
              className="bg-gradient-to-br from-bjj-gray-900/40 via-bjj-black/40 to-bjj-black/60"
            >
              <div className="flex flex-col gap-2 border-b border-bjj-gray-800/60 p-3.5 md:hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-bjj-white">{record.alunoNome}</p>
                    <p className="text-[11px] text-bjj-gray-200/70">
                      {faixa} · {graus}º grau
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      record.status === 'Presente'
                        ? 'bg-bjj-red/20 text-bjj-red'
                        : 'bg-bjj-gray-800/80 text-bjj-gray-200'
                    }`}
                  >
                    {record.status === 'Presente' ? (
                      <CheckCircle2 className={`${iconSizes.sm} ${iconColors.primary}`} />
                    ) : (
                      <Circle className={`${iconSizes.sm} ${iconColors.muted}`} />
                    )}{' '}
                    {record.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-bjj-gray-200/70">
                  <div>
                    <p className="font-semibold text-bjj-gray-200/90">Data</p>
                    <p>
                      {formattedDate}
                      <span className="ml-1 text-bjj-gray-200/60">{hora !== '—' ? `· ${hora}` : ''}</span>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-bjj-gray-200/90">Treino</p>
                    <p>{treinoLabel}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-bjj-gray-200/90">Ação rápida</p>
                    <div className="mt-1 inline-flex items-center gap-2">
                      <button
                        className={actionButtonClasses}
                        onClick={handleToggle}
                        disabled={isConfirmed && !isPlaceholder}
                      >
                        <CheckCircle2 className={`${iconSizes.sm} ${iconColors.primary}`} />
                        <span className="sr-only">Marcar presença</span>
                      </button>
                      {!isPlaceholder && (
                        <button className={actionButtonClasses} onClick={() => onAddSession?.(record)}>
                          <Plus className={`${iconSizes.sm} ${iconColors.default}`} />
                          <span className="sr-only">Adicionar outra sessão</span>
                        </button>
                      )}
                      <button className={actionButtonClasses} onClick={() => onDelete?.(record)} disabled={isPlaceholder}>
                        <Trash2 className={`${iconSizes.sm} ${iconColors.danger}`} />
                        <span className="sr-only">Remover registro</span>
                      </button>
                    </div>
                  </div>
                </div>
                {!isPlaceholder && (
                  <button className={actionButtonClasses} onClick={() => onEdit?.(record)}>
                    <Pencil className={`${iconSizes.sm} ${iconColors.default}`} />
                    <span className="sr-only">Corrigir presença</span>
                  </button>
                )}
                </div>
                <div className="hidden md:grid md:grid-cols-[140px_minmax(0,1.1fr)_minmax(0,0.8fr)_minmax(0,1.4fr)_minmax(0,0.6fr)]">
                  <div className="flex items-center justify-center gap-2 border-b border-bjj-gray-800/60 px-3 py-2.5">
                    <button
                      className={actionButtonClasses}
                      onClick={handleToggle}
                      disabled={isConfirmed && !isPlaceholder}
                    >
                      <CheckCircle2 className={`${iconSizes.sm} ${iconColors.primary}`} />
                      <span className="sr-only">Marcar presença</span>
                    </button>
                    {!isPlaceholder && (
                      <button className={actionButtonClasses} onClick={() => onAddSession?.(record)}>
                        <Plus className={`${iconSizes.xs} ${iconColors.default}`} />
                        <span className="sr-only">Adicionar outra sessão</span>
                      </button>
                    )}
                    {!isPlaceholder && (
                      <button className={actionButtonClasses} onClick={() => onEdit?.(record)}>
                        <Pencil className={`${iconSizes.xs} ${iconColors.default}`} />
                        <span className="sr-only">Corrigir presença</span>
                      </button>
                    )}
                    <button
                      className={actionButtonClasses}
                      onClick={() => onDelete?.(record)}
                      disabled={isPlaceholder}
                    >
                      <Trash2 className={`${iconSizes.xs} ${iconColors.danger}`} />
                      <span className="sr-only">Remover registro</span>
                    </button>
                  </div>
                  <div className="border-b border-bjj-gray-800/60 px-3 py-3">
                    <p className="text-sm font-semibold text-bjj-white">{record.alunoNome}</p>
                  </div>
                  <div className="border-b border-bjj-gray-800/60 px-3 py-3 text-[11px]">
                    <span className="font-medium text-bjj-white/90">{faixa}</span>
                    <span className="block text-[11px] text-bjj-gray-200/70">{graus}º grau</span>
                  </div>
                  <div className="border-b border-bjj-gray-800/60 px-3 py-3 text-[11px] text-bjj-gray-200/80">
                    <span className="block whitespace-nowrap text-[11px] text-bjj-gray-200/80" title={dataTreinoLabel}>
                      {dataTreinoLabel}
                    </span>
                  </div>
                  <div className="border-b border-bjj-gray-800/60 px-3 py-3 text-[11px]">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        record.status === 'Presente'
                          ? 'bg-bjj-red/20 text-bjj-red'
                          : 'bg-bjj-gray-800/80 text-bjj-gray-200'
                      }`}
                    >
                      {record.status === 'Presente' ? (
                        <CheckCircle2 className={`${iconSizes.sm} ${iconColors.primary}`} />
                      ) : (
                        <Circle className={`${iconSizes.sm} ${iconColors.muted}`} />
                      )}{' '}
                      {record.status}
                    </span>
                  </div>
                </div>
            </div>
          );
        })}
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-bjj-black/40">
          <Loader2 className="h-5 w-5 animate-spin text-bjj-red" />
        </div>
      )}
    </div>
  );
}
