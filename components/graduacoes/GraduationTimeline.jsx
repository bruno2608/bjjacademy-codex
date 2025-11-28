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

function GraduationTimelineItem({ item, isLast, index }) {
  const tipo = item.tipo === 'Grau' ? 'Grau' : 'Faixa';
  const grauLabel = tipo === 'Grau' && Number.isFinite(Number(item.grau)) ? `${item.grau}º grau` : null;
  const faixaLabel = item.faixa || item.faixaSlug || 'Faixa indefinida';
  const descricao =
    item.descricao || (tipo === 'Faixa' ? `Promoção para ${faixaLabel}` : `Reconhecimento na faixa ${faixaLabel}`);

  const alinhamento = index % 2 === 0 ? 'esquerda' : 'direita';

  return (
    <li
      className="relative grid grid-cols-[auto,1fr] items-start gap-4 sm:gap-5 md:grid-cols-[1fr,auto,1fr] md:gap-6"
      aria-label={`${tipo} concluída`}
    >
      <div className="flex flex-col items-center md:col-start-2">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-bjj-red bg-bjj-black text-bjj-red shadow-[0_8px_18px_-10px_rgba(248,113,113,0.6)]">
          <Medal size={18} />
        </span>
        {!isLast && <span className="mt-3 h-full w-px flex-1 bg-bjj-gray-800/80" />}
      </div>

      <article
        className={`w-full max-w-2xl space-y-4 rounded-2xl border border-bjj-gray-800/70 bg-bjj-gray-900/80 p-4 leading-relaxed shadow-[0_18px_35px_-18px_rgba(0,0,0,0.45)] md:p-5 ${
          alinhamento === 'esquerda'
            ? 'md:col-start-1 md:justify-self-end md:text-left'
            : 'md:col-start-3 md:justify-self-start md:text-left'
        }`}
      >
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
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

        <div className="space-y-3 text-sm text-bjj-gray-200/80">
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
      <span
        className="absolute left-[22px] top-3 bottom-3 w-px bg-bjj-gray-800/70 sm:left-[24px] md:left-1/2 md:-translate-x-1/2"
        aria-hidden="true"
      />
      <ul className="flex flex-col gap-6 sm:gap-8 md:gap-10">
        {ordenados.map((item, index) => (
          <GraduationTimelineItem
            key={item.id || index}
            item={item}
            index={index}
            isLast={index === ordenados.length - 1}
          />
        ))}
      </ul>
    </div>
  );
}
