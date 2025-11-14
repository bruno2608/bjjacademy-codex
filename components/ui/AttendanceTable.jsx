'use client';

/**
 * AttendanceTable organiza presenças por aluno/data e exibe botões para
 * alternar status rapidamente, mantendo o novo visual gamificado.
 */
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';

export default function AttendanceTable({ records, onToggle, onDelete }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-bjj-gray-800/70 bg-bjj-gray-900/70 shadow-[0_25px_50px_-20px_rgba(0,0,0,0.45)]">
      <div className="absolute right-[-20%] top-[-20%] h-32 w-32 rounded-full bg-bjj-red/10 blur-3xl" aria-hidden />
      <div className="hidden md:grid grid-cols-5 bg-bjj-gray-900/60 text-sm uppercase tracking-[0.15em] text-bjj-gray-200/60">
        {['Aluno', 'Graduação', 'Data', 'Status', 'Ações'].map((header) => (
          <div key={header} className="px-5 py-4">
            {header}
          </div>
        ))}
      </div>
      <div className="relative divide-y divide-bjj-gray-800/80">
        {records.map((record) => {
          const formattedDate = new Date(record.data).toLocaleDateString('pt-BR');
          const faixa = record.faixa || 'Sem faixa';
          const graus = Number.isFinite(Number(record.graus)) ? Number(record.graus) : 0;
          return (
            <div key={record.id} className="grid grid-cols-1 bg-gradient-to-br from-bjj-gray-900/40 via-bjj-black/40 to-bjj-black/60 md:grid-cols-5">
              <div className="px-5 py-4 border-b border-bjj-gray-800/60 md:border-none">
                <p className="font-semibold text-bjj-white">{record.alunoNome}</p>
                <p className="text-xs text-bjj-gray-200/60 md:hidden">
                  {faixa} · {graus}º grau
                </p>
                <p className="text-xs text-bjj-gray-200/60 md:hidden">{formattedDate}</p>
                <p className="text-xs text-bjj-gray-200/60 md:hidden">Status: {record.status}</p>
              </div>
              <div className="hidden md:flex flex-col justify-center px-5 py-4 text-sm">
                <span className="font-medium text-bjj-white/90">{faixa}</span>
                <span className="text-xs text-bjj-gray-200/70">{graus}º grau</span>
              </div>
              <div className="hidden md:flex items-center px-5 py-4 text-sm text-bjj-gray-200/80">{formattedDate}</div>
              <div className="hidden md:flex items-center px-5 py-4 text-sm">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    record.status === 'Presente'
                      ? 'bg-bjj-red/20 text-bjj-red'
                      : 'bg-bjj-gray-800/80 text-bjj-gray-200'
                  }`}
                >
                  {record.status === 'Presente' ? <CheckCircle2 size={14} /> : <Circle size={14} />} {record.status}
                </span>
              </div>
              <div className="px-5 py-4 flex items-center gap-3">
                <button
                  className="inline-flex items-center gap-2 rounded-lg border border-bjj-gray-700 px-3 py-2 text-xs text-bjj-gray-200 transition hover:border-bjj-red hover:text-bjj-red"
                  onClick={() => onToggle?.(record)}
                >
                  {record.status === 'Presente' ? 'Marcar falta' : 'Confirmar presença'}
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-lg border border-bjj-gray-700 px-3 py-2 text-xs text-bjj-gray-200 transition hover:border-bjj-red hover:text-bjj-red"
                  onClick={() => onDelete?.(record)}
                >
                  <Trash2 size={16} /> Remover
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
