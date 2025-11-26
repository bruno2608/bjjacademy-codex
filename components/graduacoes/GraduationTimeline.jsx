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
    <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical text-bjj-gray-100">
      {ordenados.map((item, index) => {
        const tipo = item.tipo === 'Grau' ? 'Grau' : 'Faixa';
        const grauLabel = tipo === 'Grau' && Number.isFinite(Number(item.grau)) ? `${item.grau}º grau` : null;
        const isEven = index % 2 === 0;

        const detail = (
          <div className="timeline-box w-full max-w-[22rem] border border-bjj-gray-800/60 bg-bjj-gray-900/80 text-left shadow-[0_18px_35px_-18px_rgba(0,0,0,0.45)] md:w-auto">
            <div className="flex items-center gap-2.5 pb-2 text-xs text-bjj-gray-200/70">
              <CalendarDays size={13} /> {formatDate(item.data)}
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  badgeColors[tipo] || 'bg-bjj-gray-800 text-bjj-gray-200'
                }`}
              >
                <Medal size={13} /> {tipo === 'Grau' ? 'Conquista de grau' : 'Troca de faixa'}
              </span>
              {grauLabel && <span className="text-sm text-bjj-gray-200/80">{grauLabel}</span>}
            </div>
            <div className="mt-3 space-y-1.5 text-sm text-bjj-gray-200/80">
              <p className="text-[15px] font-semibold text-bjj-white">
                {item.descricao ||
                  (tipo === 'Faixa' ? `Promoção para ${item.faixa}` : `Reconhecimento na faixa ${item.faixa}`)}
              </p>
              {item.instrutor && (
                <p className="text-xs text-bjj-gray-200/60">
                  Responsável: <span className="font-medium">{item.instrutor}</span>
                </p>
              )}
            </div>
          </div>
        );

        const summary = (
          <div className="timeline-start md:text-right md:pr-6 md:[min-width:10rem] md:[max-width:13rem]">
            <p className="text-sm font-semibold text-white">{tipo === 'Grau' ? `${item.grau}º grau` : item.faixa}</p>
            <p className="text-xs text-bjj-gray-300/80">{formatDate(item.data)}</p>
          </div>
        );

        return (
          <li key={item.id || index} className="py-3 md:py-4">
            {isEven ? summary : <div className="timeline-start hidden md:block">{summary}</div>}
            <div className="timeline-middle">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-bjj-red bg-bjj-black text-bjj-red">
                <Medal size={18} />
              </span>
            </div>
            {isEven ? (
              <div className="timeline-end md:timeline-start md:pl-6 md:[max-width:26rem]">{detail}</div>
            ) : (
              <div className="timeline-end md:pl-6 md:[max-width:26rem]">{detail}</div>
            )}
            {index < ordenados.length - 1 && <hr className="border-bjj-gray-800" />}
          </li>
        );
      })}
    </ul>
  );
}
