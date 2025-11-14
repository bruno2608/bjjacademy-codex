'use client';

/**
 * GraduationList apresenta cartões com a faixa atual, próxima graduação
 * e status de preparo para cada aluno acompanhado.
 */
import { ArrowRight, CalendarClock, Award, Timer } from 'lucide-react';

const statusStyles = {
  'Em progresso': 'bg-bjj-red/20 text-bjj-red',
  Planejado: 'bg-bjj-gray-800 text-bjj-gray-200',
  Concluído: 'bg-emerald-500/20 text-emerald-300'
};

export default function GraduationList({ graduacoes, onStatusChange }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {graduacoes.map((graduacao) => (
        <article key={graduacao.id} className="card space-y-4">
          <header className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{graduacao.alunoNome}</h3>
              <p className="text-sm text-bjj-gray-200/70">Faixa atual: {graduacao.faixaAtual}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-bjj-gray-800 text-bjj-gray-200">
                {graduacao.tipo}
              </span>
              <Award className="text-bjj-red" size={24} />
            </div>
          </header>
          {graduacao.tipo === 'Grau' ? (
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-bjj-gray-800 text-bjj-gray-200">
                  Próximo grau
                </span>
                <ArrowRight size={16} className="text-bjj-gray-200/70" />
                <span className="text-base font-semibold">{graduacao.grauAlvo}º grau</span>
              </div>
              <p className="text-xs text-bjj-gray-200/70">Critério: {graduacao.criterioTempo}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-bjj-gray-800 text-bjj-gray-200">
                  Próxima faixa
                </span>
                <ArrowRight size={16} className="text-bjj-gray-200/70" />
                <span className="text-base font-semibold">{graduacao.proximaFaixa}</span>
              </div>
              {graduacao.criterioTempo && (
                <p className="text-xs text-bjj-gray-200/70">Critério: {graduacao.criterioTempo}</p>
              )}
            </div>
          )}
          <div className="flex items-center justify-between text-sm text-bjj-gray-200/80">
            <span className="flex items-center gap-2">
              <CalendarClock size={16} />
              Previsão: {new Date(graduacao.previsao).toLocaleDateString('pt-BR')}
            </span>
            {typeof graduacao.mesesRestantes === 'number' && (
              <span className="flex items-center gap-2 text-xs text-bjj-gray-200/70">
                <Timer size={14} /> Restante: {graduacao.mesesRestantes} mês(es)
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                statusStyles[graduacao.status] || 'bg-bjj-gray-800 text-bjj-gray-200'
              }`}
            >
              {graduacao.status}
            </span>
            <div className="flex gap-2">
              {['Planejado', 'Em progresso', 'Concluído'].map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange?.(graduacao, status)}
                  className={`text-xs px-3 py-1 rounded-lg border transition ${
                    graduacao.status === status
                      ? 'bg-bjj-red text-bjj-white border-bjj-red'
                      : 'border-bjj-gray-700 text-bjj-gray-200 hover:bg-bjj-gray-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
