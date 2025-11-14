'use client';

/**
 * Table responsiva com ações de edição e exclusão usando ícones Lucide.
 */
import { Pencil, Trash2 } from 'lucide-react';

export default function Table({ headers, data, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-xl border border-bjj-gray-800 bg-bjj-gray-900">
      <div className="hidden md:grid grid-cols-5 bg-bjj-gray-800 text-sm uppercase tracking-wide text-bjj-gray-200/80">
        {headers.map((header) => (
          <div key={header} className="px-4 py-3">
            {header}
          </div>
        ))}
      </div>
      <div className="divide-y divide-bjj-gray-800">
        {data.map((row) => (
          <div key={row.id} className="grid grid-cols-1 md:grid-cols-5">
            <div className="px-4 py-3 border-b border-bjj-gray-800 md:border-none">
              <p className="font-semibold">{row.nome}</p>
              <p className="text-sm text-bjj-gray-200/70 md:hidden">Telefone: {row.telefone}</p>
              <p className="text-sm text-bjj-gray-200/70 md:hidden">Plano: {row.plano}</p>
              <p className="text-sm text-bjj-gray-200/70 md:hidden">Status: {row.status}</p>
            </div>
            <div className="hidden md:block px-4 py-3">{row.telefone}</div>
            <div className="hidden md:block px-4 py-3">{row.plano}</div>
            <div className="hidden md:block px-4 py-3">{row.status}</div>
            <div className="px-4 py-3 flex items-center gap-3">
              <button className="text-bjj-red" onClick={() => onEdit?.(row)}>
                <Pencil size={18} />
              </button>
              <button className="text-bjj-gray-200" onClick={() => onDelete?.(row)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
