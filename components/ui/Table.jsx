'use client';

/**
 * Table responsiva com ações de edição e exclusão usando ícones Lucide.
 * O layout alterna entre cartões no mobile e grid no desktop, mantendo
 * coerência com a linguagem gamificada do painel.
 */
import { Loader2, Pencil, Trash2 } from 'lucide-react';

export default function Table({ headers, data, onEdit, onDelete, isLoading = false }) {
  const tableHeaders = headers || ['Ações', 'Aluno', 'Graduação', 'Plano', 'Status', 'Contato'];

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 shadow-[0_18px_35px_-18px_rgba(0,0,0,0.45)]"
      aria-busy={isLoading}
    >
      <div className="absolute right-[-20%] top-[-20%] h-28 w-28 rounded-full bg-bjj-red/10 blur-3xl" aria-hidden />
      <div className="hidden md:grid md:grid-cols-[minmax(0,0.55fr)_minmax(0,1.6fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.85fr)_minmax(0,1.1fr)] bg-bjj-gray-900/60 text-[11px] uppercase tracking-[0.14em] text-bjj-gray-200/60">
        {tableHeaders.map((header) => (
          <div key={header} className="px-3.5 py-3">
            {header}
          </div>
        ))}
      </div>
      <div className="relative divide-y divide-bjj-gray-800/80">
        {data.map((row) => {
          const faixa = row.faixa || 'Sem faixa';
          const graus = Number.isFinite(Number(row.graus)) ? Number(row.graus) : 0;
          const mesesNaFaixa = Number.isFinite(Number(row.mesesNaFaixa)) ? Number(row.mesesNaFaixa) : undefined;
          return (
            <div key={row.id} className="bg-gradient-to-br from-bjj-gray-900/40 via-bjj-black/40 to-bjj-black/60">
              <div className="flex flex-col gap-2.5 border-b border-bjj-gray-800/60 p-4 md:hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-bjj-white">{row.nome}</p>
                    <p className="text-[11px] text-bjj-gray-200/70">
                      {faixa} · {graus}º grau
                    </p>
                    {typeof mesesNaFaixa === 'number' && (
                      <p className="text-[11px] text-bjj-gray-200/60">{mesesNaFaixa} meses na faixa</p>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      row.status === 'Ativo'
                        ? 'bg-bjj-red/20 text-bjj-red'
                        : 'bg-bjj-gray-800/80 text-bjj-gray-200'
                    }`}
                  >
                    {row.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 text-[11px] text-bjj-gray-200/70">
                  <div>
                    <p className="font-semibold text-bjj-gray-200/90">Plano</p>
                    <p>{row.plano}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-bjj-gray-200/90">Contato</p>
                    <p>{row.telefone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-bjj-gray-700 text-bjj-gray-200 transition hover:border-bjj-red hover:text-bjj-red"
                    onClick={() => onEdit?.(row)}
                  >
                    <Pencil size={15} />
                    <span className="sr-only">Editar dados do aluno</span>
                  </button>
                  <button
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-bjj-gray-700 text-bjj-gray-200 transition hover:border-bjj-red hover:text-bjj-red"
                    onClick={() => onDelete?.(row)}
                  >
                    <Trash2 size={15} />
                    <span className="sr-only">Remover aluno</span>
                  </button>
                </div>
              </div>
              <div className="hidden md:grid md:grid-cols-[minmax(0,0.55fr)_minmax(0,1.6fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.85fr)_minmax(0,1.1fr)]">
                <div className="flex items-center gap-2 border-b border-bjj-gray-800/60 px-3.5 py-3">
                  <button
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-bjj-gray-700 text-bjj-gray-200 transition hover:border-bjj-red hover:text-bjj-red"
                    onClick={() => onEdit?.(row)}
                  >
                    <Pencil size={14} />
                    <span className="sr-only">Editar dados do aluno</span>
                  </button>
                  <button
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-bjj-gray-700 text-bjj-gray-200 transition hover:border-bjj-red hover:text-bjj-red"
                    onClick={() => onDelete?.(row)}
                  >
                    <Trash2 size={14} />
                    <span className="sr-only">Remover aluno</span>
                  </button>
                </div>
                <div className="border-b border-bjj-gray-800/60 px-3.5 py-3">
                  <p className="text-sm font-semibold text-bjj-white">{row.nome}</p>
                </div>
                <div className="border-b border-bjj-gray-800/60 px-3.5 py-3 text-[11px]">
                  <span className="font-medium text-bjj-white/90">{faixa}</span>
                  <span className="block text-[11px] text-bjj-gray-200/70">{graus} grau(s)</span>
                  {typeof mesesNaFaixa === 'number' && (
                    <span className="block text-[11px] text-bjj-gray-200/55">{mesesNaFaixa} meses na faixa</span>
                  )}
                </div>
                <div className="border-b border-bjj-gray-800/60 px-3.5 py-3 text-[11px] text-bjj-gray-200/80">{row.plano}</div>
                <div className="border-b border-bjj-gray-800/60 px-3.5 py-3 text-[11px]">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      row.status === 'Ativo'
                        ? 'bg-bjj-red/20 text-bjj-red'
                        : 'bg-bjj-gray-800/80 text-bjj-gray-200'
                    }`}
                  >
                    {row.status}
                  </span>
                </div>
                <div className="border-b border-bjj-gray-800/60 px-3.5 py-3 text-[11px] text-bjj-gray-200/80">{row.telefone}</div>
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
