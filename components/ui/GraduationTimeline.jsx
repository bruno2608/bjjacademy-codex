'use client';

/**
 * GraduationTimeline desenha uma linha do tempo gamificada com os marcos
 * de evolução do aluno (graduações concluídas ou planejadas), destacando
 * faixas, graus e responsáveis pela cerimônia.
 */
import { CalendarDays, Medal } from 'lucide-react';

const badgeColors = {
  Faixa: 'bg-bjj-red/20 text-bjj-red',
  Grau: 'bg-bjj-gray-800 text-bjj-gray-200'
};

const formatDate = (value) => {
  if (!value) return 'Sem data';
  const data = new Date(value);
  if (Number.isNaN(data.getTime())) return value;
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export default function GraduationTimeline({ itens = [] }) {
  if (!itens.length) {
    return (
      <div className="card">
        <p className="text-sm text-bjj-gray-200/70">
          Nenhum histórico cadastrado ainda. Conclua ou importe graduações para
          começar a contar a jornada do atleta.
        </p>
      </div>
    );
  }

  const ordenados = [...itens].sort((a, b) => {
    const dataA = new Date(a.data).getTime();
    const dataB = new Date(b.data).getTime();
    return dataB - dataA;
  });

  return (
    <div className="relative pl-6">
      <span className="absolute left-3 top-0 bottom-0 w-px bg-bjj-gray-800" aria-hidden />
      <div className="space-y-8">
        {ordenados.map((item, index) => {
          const isLast = index === ordenados.length - 1;
          const tipo = item.tipo === 'Grau' ? 'Grau' : 'Faixa';
          const grauLabel =
            tipo === 'Grau' && Number.isFinite(Number(item.grau))
              ? `${item.grau}º grau`
              : null;
          return (
            <article key={item.id || index} className="relative pl-6">
              <span
                className="absolute left-[-11px] top-1 h-5 w-5 rounded-full border-2 border-bjj-red bg-bjj-black"
                aria-hidden
              />
              <div className="rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/80 p-5 shadow-focus/40">
                <header className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                        badgeColors[tipo] || 'bg-bjj-gray-800 text-bjj-gray-200'
                      }`}
                    >
                      <Medal size={14} /> {tipo === 'Grau' ? 'Conquista de grau' : 'Troca de faixa'}
                    </span>
                    {grauLabel && <span className="text-sm text-bjj-gray-200/80">{grauLabel}</span>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-bjj-gray-200/70">
                    <CalendarDays size={14} />
                    {formatDate(item.data)}
                  </div>
                </header>
                <div className="mt-4 space-y-2 text-sm text-bjj-gray-200/80">
                  <p className="text-base font-semibold text-bjj-white">
                    {item.descricao ||
                      (tipo === 'Faixa'
                        ? `Promoção para ${item.faixa}`
                        : `Reconhecimento na faixa ${item.faixa}`)}
                  </p>
                  {item.instrutor && (
                    <p className="text-xs text-bjj-gray-200/60">
                      Responsável: <span className="font-medium">{item.instrutor}</span>
                    </p>
                  )}
                </div>
                {!isLast && <span className="absolute left-[-1px] bottom-[-32px] h-6 w-px bg-bjj-gray-800" aria-hidden />}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
