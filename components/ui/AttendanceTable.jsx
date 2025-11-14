'use client';

/**
 * AttendanceTable organiza presenças por aluno/data e exibe botões para
 * alternar status rapidamente, mantendo o novo visual gamificado e
 * preparado para mobile-first.
 */
import { CheckCircle2, Circle, Loader2, Pencil, Trash2 } from 'lucide-react';

export default function AttendanceTable({ records, onToggle, onDelete, onEdit, isLoading = false }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 shadow-[0_18px_35px_-18px_rgba(0,0,0,0.45)]"
      aria-busy={isLoading}
    >
      <div className="absolute right-[-20%] top-[-20%] h-28 w-28 rounded-full bg-bjj-red/10 blur-3xl" aria-hidden />
      <div className="hidden md:grid grid-cols-5 bg-bjj-gray-900/60 text-xs uppercase tracking-[0.14em] text-bjj-gray-200/60">
        {['Aluno', 'Graduação', 'Data/Hora', 'Status', 'Ações'].map((header) => (
          <div key={header} className="px-4 py-3.5">
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
          const isPlaceholder = Boolean(record.isPlaceholder);
          return (
            <div
              key={record.id || record.alunoId}
              className="bg-gradient-to-br from-bjj-gray-900/40 via-bjj-black/40 to-bjj-black/60"
            >
              <div className="flex flex-col gap-2.5 border-b border-bjj-gray-800/60 p-4 md:hidden">
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
                    {record.status === 'Presente' ? <CheckCircle2 size={14} /> : <Circle size={14} />} {record.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 text-[11px] text-bjj-gray-200/70">
                  <div>
                    <p className="font-semibold text-bjj-gray-200/90">Data</p>
                    <p>
                      {formattedDate}
                      <span className="ml-1 text-bjj-gray-200/60">{hora !== '—' ? `· ${hora}` : ''}</span>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-bjj-gray-200/90">Ação rápida</p>
                    <button
                      className="mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-bjj-gray-700 px-3 py-2 text-xs text-bjj-gray-200 transition hover:border-bjj-red hover:text-bjj-red"
                      onClick={() => onToggle?.(record)}
                    >
                      {record.status === 'Presente' ? 'Desfazer presença' : '✔ Presente'}
                    </button>
                  </div>
                </div>
                {!isPlaceholder && (
                  <button
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-bjj-gray-700 px-3 py-2 text-xs text-bjj-gray-200 transition hover:border-bjj-red hover:text-bjj-red"
                    onClick={() => onEdit?.(record)}
                  >
                    <Pencil size={15} /> Corrigir presença
                  </button>
                )}
                <button
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-bjj-gray-700 px-3 py-2 text-xs text-bjj-gray-200 transition hover:border-bjj-red hover:text-bjj-red disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() => onDelete?.(record)}
                  disabled={isPlaceholder}
                >
                  <Trash2 size={15} /> Remover
                </button>
              </div>
              <div className="hidden md:grid md:grid-cols-5">
                <div className="border-b border-bjj-gray-800/60 px-4 py-3.5">
                  <p className="text-sm font-semibold text-bjj-white">{record.alunoNome}</p>
                </div>
                <div className="border-b border-bjj-gray-800/60 px-4 py-3.5 text-xs">
                  <span className="font-medium text-bjj-white/90">{faixa}</span>
                  <span className="block text-[11px] text-bjj-gray-200/70">{graus}º grau</span>
                </div>
                <div className="border-b border-bjj-gray-800/60 px-4 py-3.5 text-xs text-bjj-gray-200/80">
                  <span className="block">{formattedDate}</span>
                  <span className="mt-1 block text-[11px] text-bjj-gray-200/60">
                    {hora !== '—' ? `Horário ${hora}` : 'Sem registro do horário'}
                  </span>
                </div>
                <div className="border-b border-bjj-gray-800/60 px-4 py-3.5 text-xs">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      record.status === 'Presente'
                        ? 'bg-bjj-red/20 text-bjj-red'
                        : 'bg-bjj-gray-800/80 text-bjj-gray-200'
                    }`}
                  >
                    {record.status === 'Presente' ? <CheckCircle2 size={14} /> : <Circle size={14} />} {record.status}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-3.5">
                  <button
                    className="inline-flex items-center gap-1.5 rounded-lg border border-bjj-gray-700 px-3 py-2 text-xs text-bjj-gray-200 transition hover:border-bjj-red hover:text-bjj-red disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => onToggle?.(record)}
                    disabled={isPlaceholder && record.status === 'Presente'}
                  >
                    {record.status === 'Presente' ? 'Desfazer presença' : '✔ Presente'}
                  </button>
                  {!isPlaceholder && (
                    <button
                      className="inline-flex items-center gap-1.5 rounded-lg border border-bjj-gray-700 px-3 py-2 text-xs text-bjj-gray-200 transition hover:border-bjj-red hover:text-bjj-red"
                      onClick={() => onEdit?.(record)}
                    >
                      <Pencil size={15} /> Corrigir
                    </button>
                  )}
                  <button
                    className="inline-flex items-center gap-1.5 rounded-lg border border-bjj-gray-700 px-3 py-2 text-xs text-bjj-gray-200 transition hover:border-bjj-red hover:text-bjj-red disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => onDelete?.(record)}
                    disabled={isPlaceholder}
                  >
                    <Trash2 size={15} /> Remover
                  </button>
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
