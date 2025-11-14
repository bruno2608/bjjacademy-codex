'use client';

/**
 * AttendanceTable organiza presenças por aluno/data e expõe botões
 * para alternar status rapidamente no fluxo do instrutor.
 */
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';

export default function AttendanceTable({ records, onToggle, onDelete }) {
  return (
    <div className="overflow-hidden rounded-xl border border-bjj-gray-800 bg-bjj-gray-900">
      <div className="hidden md:grid grid-cols-5 bg-bjj-gray-800 text-sm uppercase tracking-wide text-bjj-gray-200/80">
        {['Aluno', 'Graduação', 'Data', 'Status', 'Ações'].map((header) => (
          <div key={header} className="px-4 py-3">
            {header}
          </div>
        ))}
      </div>
      <div className="divide-y divide-bjj-gray-800">
        {records.map((record) => {
          const formattedDate = new Date(record.data).toLocaleDateString('pt-BR');
          const faixa = record.faixa || 'Sem faixa';
          const graus = Number.isFinite(Number(record.graus)) ? Number(record.graus) : 0;
          return (
            <div key={record.id} className="grid grid-cols-1 md:grid-cols-5">
              <div className="px-4 py-3">
                <p className="font-semibold">{record.alunoNome}</p>
                <p className="text-xs text-bjj-gray-200/60 md:hidden">
                  {faixa} · {graus}º grau
                </p>
                <p className="text-xs text-bjj-gray-200/60 md:hidden">{formattedDate}</p>
                <p className="text-xs text-bjj-gray-200/60 md:hidden">Status: {record.status}</p>
              </div>
              <div className="hidden md:flex flex-col justify-center px-4 py-3 text-sm">
                <span className="font-medium">{faixa}</span>
                <span className="text-xs text-bjj-gray-200/70">{graus}º grau</span>
              </div>
              <div className="hidden md:flex items-center px-4 py-3 text-sm text-bjj-gray-200/80">
                {formattedDate}
              </div>
              <div className="hidden md:flex items-center px-4 py-3 text-sm">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                    record.status === 'Presente'
                      ? 'bg-bjj-red/20 text-bjj-red'
                      : 'bg-bjj-gray-800 text-bjj-gray-200'
                  }`}
                >
                  {record.status === 'Presente' ? <CheckCircle2 size={14} /> : <Circle size={14} />} {record.status}
                </span>
              </div>
              <div className="px-4 py-3 flex items-center gap-3">
                <button
                  className="btn-primary flex items-center gap-2 text-xs"
                  onClick={() => onToggle?.(record)}
                >
                  {record.status === 'Presente' ? 'Marcar falta' : 'Confirmar presença'}
                </button>
                <button
                  className="text-bjj-gray-200 hover:text-bjj-red"
                  onClick={() => onDelete?.(record)}
                >
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
