'use client';

/**
 * Table responsiva com ações de edição e exclusão usando ícones Lucide.
 */
import { Pencil, Trash2 } from 'lucide-react';

export default function Table({ headers, data, onEdit, onDelete }) {
  const tableHeaders =
    headers || ['Aluno', 'Graduação', 'Plano', 'Status', 'Contato', 'Ações'];

  return (
    <div className="overflow-hidden rounded-xl border border-bjj-gray-800 bg-bjj-gray-900">
      <div className="hidden md:grid grid-cols-6 bg-bjj-gray-800 text-sm uppercase tracking-wide text-bjj-gray-200/80">
        {tableHeaders.map((header) => (
          <div key={header} className="px-4 py-3">
            {header}
          </div>
        ))}
      </div>
      <div className="divide-y divide-bjj-gray-800">
        {data.map((row) => {
          const faixa = row.faixa || 'Sem faixa';
          const graus = Number.isFinite(Number(row.graus)) ? Number(row.graus) : 0;
          const mesesNaFaixa = Number.isFinite(Number(row.mesesNaFaixa))
            ? Number(row.mesesNaFaixa)
            : undefined;
          return (
            <div key={row.id} className="grid grid-cols-1 md:grid-cols-6">
              <div className="px-4 py-3 border-b border-bjj-gray-800 md:border-none">
                <p className="font-semibold">{row.nome}</p>
                <p className="text-xs text-bjj-gray-200/60 md:hidden">
                  {faixa} · {graus} grau(s)
                </p>
                <p className="text-xs text-bjj-gray-200/60 md:hidden">Plano: {row.plano}</p>
                <p className="text-xs text-bjj-gray-200/60 md:hidden">Status: {row.status}</p>
                <p className="text-xs text-bjj-gray-200/60 md:hidden">Contato: {row.telefone}</p>
              </div>
              <div className="hidden md:flex flex-col justify-center px-4 py-3 text-sm">
                <span className="font-medium">{faixa}</span>
                <span className="text-xs text-bjj-gray-200/70">{graus} grau(s)</span>
                {typeof mesesNaFaixa === 'number' && (
                  <span className="text-xs text-bjj-gray-200/50">{mesesNaFaixa} meses na faixa</span>
                )}
              </div>
            <div className="hidden md:flex items-center px-4 py-3 text-sm">{row.plano}</div>
            <div className="hidden md:flex items-center px-4 py-3 text-sm">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  row.status === 'Ativo'
                    ? 'bg-bjj-red/20 text-bjj-red'
                    : 'bg-bjj-gray-800 text-bjj-gray-200'
                }`}
              >
                {row.status}
              </span>
            </div>
            <div className="hidden md:flex items-center px-4 py-3 text-sm">{row.telefone}</div>
            <div className="px-4 py-3 flex items-center gap-3">
              <button className="text-bjj-red" onClick={() => onEdit?.(row)}>
                <Pencil size={18} />
              </button>
              <button className="text-bjj-gray-200" onClick={() => onDelete?.(row)}>
                <Trash2 size={18} />
              </button>
            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
