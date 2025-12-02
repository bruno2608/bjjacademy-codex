import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { AlertCircle } from 'lucide-react';

// Visão dedicada para revisão de pendências de presença
export default function PresencasPendenciasView({
  pendencias,
  pendenciasInicio,
  pendenciasFim,
  onChangeInicio,
  onChangeFim,
  onQuickRange,
  formatDateBr,
  StatusBadge,
  handlePendenciaStatus
}) {
  return (
    <section className="rounded-2xl bg-bjj-gray-800/70 p-5 shadow-lg ring-1 ring-bjj-gray-700">
      <div className="flex flex-col gap-3 border-b border-bjj-gray-700 pb-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-bjj-gray-200">Operação pós-aula</p>
          <h2 className="text-xl font-semibold text-white">Pendências de aprovação</h2>
          <p className="text-sm text-bjj-gray-200">Revisão rápida de presenças pendentes no período.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Input type="date" value={pendenciasInicio} onChange={(e) => onChangeInicio(e.target.value)} className="w-full sm:w-auto" />
          <Input type="date" value={pendenciasFim} onChange={(e) => onChangeFim(e.target.value)} className="w-full sm:w-auto" />
          <div className="flex flex-wrap gap-1 text-xs">
            <Button size="sm" variant="ghost" onClick={() => onQuickRange(-7)}>
              Últimos 7 dias
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onQuickRange(-30)}>
              Últimos 30 dias
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onQuickRange(0)}>
              Hoje
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-xl bg-bjj-gray-900/70 px-4 py-3 text-sm text-bjj-gray-200 ring-1 ring-bjj-gray-700 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-white">
          <AlertCircle size={16} className="text-yellow-300" />
          <span>Presenças pendentes: {pendencias.length}</span>
        </div>
        <span className="inline-flex items-center justify-center rounded-full bg-bjj-gray-800 px-3 py-1 text-xs text-bjj-gray-100">
          {formatDateBr(pendenciasInicio)} → {formatDateBr(pendenciasFim)}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {pendencias.length === 0 && (
          <p className="rounded-xl border border-dashed border-bjj-gray-700 bg-bjj-gray-900/60 px-4 py-3 text-bjj-gray-100">
            Nenhuma pendência no período selecionado.
          </p>
        )}
        {pendencias.map((item) => {
          const { presenca, turma, aula, aluno } = item;
          return (
            <div
              key={presenca.id}
              className="flex flex-col gap-3 rounded-xl border border-bjj-gray-700 bg-bjj-gray-900/60 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="space-y-1">
                <p className="text-lg font-semibold text-white">{aluno.nome}</p>
                <p className="text-sm text-bjj-gray-200">
                  {turma.nome} • {formatDateBr(presenca.data)} {aula ? `• ${aula.horaInicio}` : ''}
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
                <StatusBadge status={presenca.status} />
                <div className="flex flex-wrap gap-1">
                  <Button size="sm" variant="success" onClick={() => handlePendenciaStatus(presenca.id, 'PRESENTE')}>
                    Presente
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handlePendenciaStatus(presenca.id, 'FALTA')}>
                    Falta
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handlePendenciaStatus(presenca.id, 'JUSTIFICADA')}>
                    Justificar
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
