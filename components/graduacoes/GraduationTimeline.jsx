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
    <div className="relative pl-5">
      <span className="absolute left-2.5 top-0 bottom-0 w-px bg-bjj-gray-800" aria-hidden />
      <div className="space-y-6">
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
                className="absolute left-[-10px] top-1 h-[18px] w-[18px] rounded-full border-2 border-bjj-red bg-bjj-black"
                aria-hidden
              />
              <div className="rounded-xl border border-bjj-gray-800/60 bg-bjj-gray-900/75 p-4 shadow-[0_18px_35px_-18px_rgba(0,0,0,0.45)]">
                <header className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        badgeColors[tipo] || 'bg-bjj-gray-800 text-bjj-gray-200'
                      }`}
                    >
                      <Medal size={13} /> {tipo === 'Grau' ? 'Conquista de grau' : 'Troca de faixa'}
                    </span>
                    {grauLabel && <span className="text-sm text-bjj-gray-200/80">{grauLabel}</span>}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-bjj-gray-200/70">
                    <CalendarDays size={13} />
                    {formatDate(item.data)}
                  </div>
                </header>
                <div className="mt-3 space-y-1.5 text-sm text-bjj-gray-200/80">
                  <p className="text-[15px] font-semibold text-bjj-white">
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
                {!isLast && <span className="absolute left-[-1px] bottom-[-26px] h-5 w-px bg-bjj-gray-800" aria-hidden />}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
