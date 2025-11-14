'use client';

/**
 * Table responsiva com ações de edição e exclusão usando ícones Lucide.
 * O layout foi atualizado para replicar a estética gamificada com cantos
 * arredondados, divisórias suaves e estados destacados.
 */
import { Pencil, Trash2 } from 'lucide-react';

export default function Table({ headers, data, onEdit, onDelete }) {
  const tableHeaders = headers || ['Aluno', 'Graduação', 'Plano', 'Status', 'Contato', 'Ações'];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-bjj-gray-800/70 bg-bjj-gray-900/70 shadow-[0_25px_50px_-20px_rgba(0,0,0,0.45)]">
      <div className="absolute right-[-20%] top-[-20%] h-32 w-32 rounded-full bg-bjj-red/10 blur-3xl" aria-hidden />
      <div className="hidden md:grid grid-cols-6 bg-bjj-gray-900/60 text-sm uppercase tracking-[0.15em] text-bjj-gray-200/60">
        {tableHeaders.map((header) => (
          <div key={header} className="px-5 py-4">
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
            <div key={row.id} className="grid grid-cols-1 bg-gradient-to-br from-bjj-gray-900/40 via-bjj-black/40 to-bjj-black/60 md:grid-cols-6">
              <div className="px-5 py-4 border-b border-bjj-gray-800/60 md:border-none">
                <p className="font-semibold text-bjj-white">{row.nome}</p>
                <p className="text-xs text-bjj-gray-200/60 md:hidden">
                  {faixa} · {graus} grau(s)
                </p>
                <p className="text-xs text-bjj-gray-200/60 md:hidden">Plano: {row.plano}</p>
                <p className="text-xs text-bjj-gray-200/60 md:hidden">Status: {row.status}</p>
                <p className="text-xs text-bjj-gray-200/60 md:hidden">Contato: {row.telefone}</p>
              </div>
              <div className="hidden md:flex flex-col justify-center px-5 py-4 text-sm">
                <span className="font-medium text-bjj-white/90">{faixa}</span>
                <span className="text-xs text-bjj-gray-200/70">{graus} grau(s)</span>
                {typeof mesesNaFaixa === 'number' && (
                  <span className="text-xs text-bjj-gray-200/50">{mesesNaFaixa} meses na faixa</span>
                )}
              </div>
              <div className="hidden md:flex items-center px-5 py-4 text-sm text-bjj-gray-200/80">{row.plano}</div>
              <div className="hidden md:flex items-center px-5 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    row.status === 'Ativo'
                      ? 'bg-bjj-red/20 text-bjj-red'
                      : 'bg-bjj-gray-800/80 text-bjj-gray-200'
                  }`}
                >
                  {row.status}
                </span>
              </div>
              <div className="hidden md:flex items-center px-5 py-4 text-sm text-bjj-gray-200/80">{row.telefone}</div>
              <div className="px-5 py-4 flex items-center gap-3">
                <button
                  className="inline-flex items-center gap-2 rounded-lg border border-bjj-gray-700 px-3 py-2 text-xs text-bjj-gray-200 transition hover:border-bjj-red hover:text-bjj-red"
                  onClick={() => onEdit?.(row)}
                >
                  <Pencil size={16} /> Editar
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-lg border border-bjj-gray-700 px-3 py-2 text-xs text-bjj-gray-200 transition hover:border-bjj-red hover:text-bjj-red"
                  onClick={() => onDelete?.(row)}
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
