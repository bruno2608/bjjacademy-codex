'use client';

/**
 * Table responsiva com ações de edição e exclusão usando ícones Lucide.
 * O layout alterna entre cartões no mobile e grid no desktop, mantendo
 * coerência com a linguagem gamificada do painel.
 */
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import Badge from './Badge';

export default function Table({ headers, data, onEdit, onDelete, isLoading = false }) {
  const tableHeaders = headers || ['Ações', 'Aluno', 'Graduação', 'Plano', 'Status', 'Contato'];
  const actionButtonClasses =
    'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-bjj-gray-700 text-bjj-gray-200 transition hover:border-bjj-red hover:text-bjj-red';

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 shadow-[0_18px_35px_-18px_rgba(0,0,0,0.45)]"
      aria-busy={isLoading}
    >
      <div className="absolute right-[-20%] top-[-20%] h-28 w-28 rounded-full bg-bjj-red/10 blur-3xl" aria-hidden />
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <div className="min-w-[1120px] grid grid-cols-[160px_minmax(200px,1.08fr)_minmax(280px,1.28fr)_minmax(180px,1fr)_minmax(140px,0.95fr)_minmax(190px,1fr)] bg-bjj-gray-900/60 text-[11px] uppercase tracking-[0.14em] text-bjj-gray-200/60">
            {tableHeaders.map((header, index) => (
              <div key={header} className={`px-3.5 py-3 ${index === 0 ? 'text-center' : ''}`}>
                {header}
              </div>
            ))}
          </div>
          <div className="divide-y divide-bjj-gray-800/80">
            {data.map((row) => {
              const faixa = row.faixa || row.faixaSlug || 'Sem faixa';
              const faixaVisual = row.faixaVisual;
              const graus = Number.isFinite(Number(row.graus)) ? Number(row.graus) : 0;
              const mesesNaFaixa = Number.isFinite(Number(row.mesesNaFaixa)) ? Number(row.mesesNaFaixa) : undefined;
              return (
                <div key={row.id} className="bg-gradient-to-br from-bjj-gray-900/40 via-bjj-black/40 to-bjj-black/60">
                  <div className="min-w-[1120px] grid grid-cols-[160px_minmax(200px,1.08fr)_minmax(280px,1.28fr)_minmax(180px,1fr)_minmax(140px,0.95fr)_minmax(190px,1fr)]">
                    <div className="flex items-center justify-center gap-2 border-b border-bjj-gray-800/60 px-3.5 py-3">
                      <button className={actionButtonClasses} onClick={() => onEdit?.(row)}>
                        <Pencil size={14} />
                        <span className="sr-only">Editar dados do aluno</span>
                      </button>
                      <button className={actionButtonClasses} onClick={() => onDelete?.(row)}>
                        <Trash2 size={14} />
                        <span className="sr-only">Remover aluno</span>
                      </button>
                    </div>
                    <div className="border-b border-bjj-gray-800/60 px-3.5 py-3">
                      <p className="text-sm font-semibold text-bjj-white break-words leading-tight">{row.nome}</p>
                    </div>
                    <div className="border-b border-bjj-gray-800/60 px-3.5 py-3 text-[11px] overflow-hidden">
                      <div className="flex items-center gap-3">
                        {faixaVisual && <div className="shrink-0">{faixaVisual}</div>}
                        <div className="min-w-[120px]">
                          <span className="block font-medium text-bjj-white/90 leading-tight">{faixa}</span>
                          <span className="block text-[11px] text-bjj-gray-200/70">{graus} grau(s)</span>
                          {typeof mesesNaFaixa === 'number' && (
                            <span className="block text-[11px] text-bjj-gray-200/55">{mesesNaFaixa} meses na faixa</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-bjj-gray-800/60 px-3.5 py-3 text-[11px] text-bjj-gray-200/80">{row.plano}</div>
                    <div className="border-b border-bjj-gray-800/60 px-3.5 py-3 text-[11px]">
                      <Badge variant={row.status === 'Ativo' ? 'success' : 'neutral'}>{row.status}</Badge>
                    </div>
                    <div className="border-b border-bjj-gray-800/60 px-3.5 py-3 text-[11px] text-bjj-gray-200/80">{row.telefone}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="relative divide-y divide-bjj-gray-800/80 md:hidden">
        {data.map((row) => {
          const faixa = row.faixa || row.faixaSlug || 'Sem faixa';
          const faixaVisual = row.faixaVisual;
          const graus = Number.isFinite(Number(row.graus)) ? Number(row.graus) : 0;
          const mesesNaFaixa = Number.isFinite(Number(row.mesesNaFaixa)) ? Number(row.mesesNaFaixa) : undefined;
          return (
            <div key={row.id} className="bg-gradient-to-br from-bjj-gray-900/40 via-bjj-black/40 to-bjj-black/60">
              <div className="flex flex-col gap-2.5 border-b border-bjj-gray-800/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-bjj-white">{row.nome}</p>
                    <div className="mt-1 flex flex-col gap-1">
                      {faixaVisual ? (
                        faixaVisual
                      ) : (
                        <p className="text-[11px] text-bjj-gray-200/70">
                          {faixa} · {graus}º grau
                        </p>
                      )}
                      {typeof mesesNaFaixa === 'number' && (
                        <p className="text-[11px] text-bjj-gray-200/60">{mesesNaFaixa} meses na faixa</p>
                      )}
                    </div>
                  </div>
                  <Badge variant={row.status === 'Ativo' ? 'success' : 'neutral'}>{row.status}</Badge>
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
                  <button className={actionButtonClasses} onClick={() => onEdit?.(row)}>
                    <Pencil size={15} />
                    <span className="sr-only">Editar dados do aluno</span>
                  </button>
                  <button className={actionButtonClasses} onClick={() => onDelete?.(row)}>
                    <Trash2 size={15} />
                    <span className="sr-only">Remover aluno</span>
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
