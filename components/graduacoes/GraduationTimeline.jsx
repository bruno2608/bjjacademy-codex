'use client';

/**
 * GraduationTimeline desenha uma linha do tempo gamificada com os marcos
 * de evolução do aluno (graduações concluídas ou planejadas), destacando
 * faixas, graus e responsáveis pela cerimônia.
 */
import { ArrowRight, CalendarDays, Medal, UserRound } from 'lucide-react';

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

function GraduationTimelineItem({ item, isLast }) {
  const tipo = item.tipo === 'Grau' ? 'Grau' : 'Faixa';
  const grauLabel = tipo === 'Grau' && Number.isFinite(Number(item.grau)) ? `${item.grau}º grau` : null;
  const faixaLabel = item.faixa || item.faixaSlug || 'Faixa indefinida';
  const descricao =
    item.descricao || (tipo === 'Faixa' ? `Promoção para ${faixaLabel}` : `Reconhecimento na faixa ${faixaLabel}`);

  return (
    <li className="grid grid-cols-[auto,1fr] gap-4 sm:gap-5">
      <div className="flex flex-col items-center pt-1">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-bjj-red bg-bjj-black text-bjj-red shadow-[0_8px_18px_-10px_rgba(248,113,113,0.6)]">
          <Medal size={18} />
        </span>
        {!isLast && <span className="mt-2 h-full w-px flex-1 bg-bjj-gray-800/80" />}
      </div>

      <article className="w-full space-y-3 rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/80 p-4 shadow-[0_18px_35px_-18px_rgba(0,0,0,0.45)]">
        <header className="flex flex-wrap items-center gap-2 justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                badgeColors[tipo] || 'bg-bjj-gray-800 text-bjj-gray-200'
              }`}
            >
              <Medal size={13} /> {tipo === 'Grau' ? 'Conquista de grau' : 'Troca de faixa'}
            </span>
            {grauLabel && <span className="text-xs text-bjj-gray-200/80">{grauLabel}</span>}
          </div>
          <div className="flex items-center gap-2 text-xs text-bjj-gray-200/70">
            <CalendarDays size={13} /> {formatDate(item.data)}
          </div>
        </header>

        <div className="space-y-2 text-sm text-bjj-gray-200/80 leading-relaxed">
          <p className="text-base font-semibold leading-snug text-bjj-white">{descricao}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-bjj-gray-200/70">
            <span className="inline-flex items-center gap-1 rounded-full bg-bjj-gray-900/70 px-2.5 py-1">
              {tipo === 'Faixa' ? 'Faixa' : 'Faixa base'}: <span className="font-semibold text-bjj-white">{faixaLabel}</span>
            </span>
            {tipo === 'Faixa' && item.proximaFaixa ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-bjj-gray-900/70 px-2.5 py-1 text-bjj-white">
                {faixaLabel}
                <ArrowRight size={14} />
                {item.proximaFaixa}
              </span>
            ) : null}
          </div>
          {item.alunoNome && (
            <p className="flex items-center gap-2 text-xs text-bjj-gray-200/70">
              <UserRound size={14} /> Aluno: <span className="font-semibold text-bjj-white">{item.alunoNome}</span>
            </p>
          )}
          {item.instrutor && (
            <p className="text-xs text-bjj-gray-200/70">
              Responsável: <span className="font-semibold text-bjj-white">{item.instrutor}</span>
            </p>
          )}
        </div>
      </article>
    </li>
  );
}

export default function GraduationTimeline({ itens = [] }) {
  if (!itens.length) {
    return (
      <div className="card">
        <p className="text-sm text-bjj-gray-200/70">
          Nenhum histórico cadastrado ainda. Conclua ou importe graduações para começar a contar a jornada do atleta.
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
    <div className="relative">
      <span className="absolute left-[18px] top-2 bottom-2 w-px bg-bjj-gray-800/70 sm:left-[20px]" aria-hidden="true" />
      <ul className="space-y-6 pl-6 sm:space-y-8 sm:pl-10">
        {ordenados.map((item, index) => (
          <GraduationTimelineItem key={item.id || index} item={item} isLast={index === ordenados.length - 1} />
        ))}
      </ul>
    </div>
  );
}
