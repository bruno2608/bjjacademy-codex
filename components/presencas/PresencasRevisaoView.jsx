import { ClipboardList } from 'lucide-react';
import Button from '@/components/ui/Button';

// Visão focada em revisão/histórico recente de presenças
export default function PresencasRevisaoView({ revisoes, formatDateBr, StatusBadge, onQuickFilter }) {
  return (
    <section className="rounded-2xl bg-bjj-gray-800/70 p-5 shadow-lg ring-1 ring-bjj-gray-700">
      <div className="flex flex-col gap-3 border-b border-bjj-gray-700 pb-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-bjj-gray-200">Revisão rápida</p>
          <h2 className="text-xl font-semibold text-white">Revisão / últimos envios</h2>
          <p className="text-sm text-bjj-gray-200">Histórico recente de presenças para auditoria.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Button size="sm" variant="ghost" onClick={() => onQuickFilter(10)}>
            Últimos 10
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onQuickFilter(20)}>
            Últimos 20
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-bjj-gray-200/70">
        <ClipboardList size={14} /> Revisões recentes
      </div>

      <div className="mt-3 space-y-3">
        {revisoes.length === 0 && (
          <p className="rounded-xl border border-dashed border-bjj-gray-700 bg-bjj-gray-900/60 px-4 py-3 text-bjj-gray-100">
            Nenhum registro recente encontrado.
          </p>
        )}
        {revisoes.map((item) => (
          <div
            key={`${item.presenca.id}-${item.aluno.id}`}
            className="flex flex-col gap-3 rounded-xl border border-bjj-gray-700 bg-bjj-gray-900/60 p-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-1">
              <p className="text-lg font-semibold text-white">{item.aluno.nome}</p>
              <p className="text-sm text-bjj-gray-200">
                {item.turma?.nome || 'Turma'} • {formatDateBr(item.presenca.data)}
              </p>
              <p className="text-xs text-bjj-gray-300">Origem: {item.presenca.origem || '—'}</p>
            </div>
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
              <StatusBadge status={item.presenca.status} />
              <span className="rounded-full bg-bjj-gray-800 px-2 py-1 text-xs text-bjj-gray-100">{item.presenca.id}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
