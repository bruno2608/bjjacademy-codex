'use client';

/**
 * GraduationList exibe as graduações planejadas em um layout gamificado,
 * destacando progresso, próxima meta e facilitando a alteração de status.
 */
import { ArrowRight, CalendarClock, Award, Timer } from 'lucide-react';
import { iconColors, iconSizes } from '@/styles/iconTokens';

const statusStyles = {
  'Em progresso': 'bg-bjj-red/20 text-bjj-red border border-bjj-red/40',
  Planejado: 'bg-bjj-gray-900/80 text-bjj-gray-200 border border-bjj-gray-800/70',
  Concluído: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
};

const formatDate = (value) => {
  if (!value) return 'Sem data';
  const data = new Date(value);
  if (Number.isNaN(data.getTime())) return 'Definir data';
  return data.toLocaleDateString('pt-BR');
};

const parseTempoNecessario = (criterioTempo) => {
  if (!criterioTempo) return null;
  const match = criterioTempo.match(/(\d+)/);
  return match ? Number(match[1]) : null;
};

const calcularProgresso = (graduacao, alunoLookup) => {
  if (graduacao.status === 'Concluído') return 100;
  const aluno = alunoLookup?.[graduacao.alunoId];
  const mesesRestantes = Number(graduacao.mesesRestantes ?? 0);
  const tempoNecessario = parseTempoNecessario(graduacao.criterioTempo);
  if (!tempoNecessario || tempoNecessario <= 0) {
    return mesesRestantes === 0 ? 100 : 0;
  }
  const mesesCumpridos = Math.max(tempoNecessario - mesesRestantes, 0);
  if (Number.isFinite(aluno?.mesesNaFaixa) && graduacao.tipo === 'Grau') {
    // Para graus usamos o tempo efetivo dedicado na faixa.
    return Math.min(Math.round((aluno.mesesNaFaixa / tempoNecessario) * 100), 100);
  }
  return Math.min(Math.round((mesesCumpridos / tempoNecessario) * 100), 100);
};

const formatTempoRestante = (meses) => {
  if (!Number.isFinite(meses)) return null;
  if (meses <= 0) return 'Pronto para graduar';
  if (meses === 1) return '1 mês restante';
  const anos = Math.floor(meses / 12);
  const restante = meses % 12;
  const partes = [];
  if (anos > 0) partes.push(`${anos} ano${anos > 1 ? 's' : ''}`);
  if (restante > 0) partes.push(`${restante} mês${restante > 1 ? 'es' : ''}`);
  return `${partes.join(' e ')} restante`; // e.g. "1 ano e 2 meses restante"
};

export default function GraduationList({ graduacoes, onStatusChange, alunoLookup }) {
  if (!graduacoes?.length) {
    return (
      <div className="card">
        <p className="text-sm text-bjj-gray-200/70">
          Nenhuma graduação planejada para o aluno selecionado. Utilize o formulário ao lado
          para agendar o próximo passo da jornada.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {graduacoes.map((graduacao) => {
        const progresso = calcularProgresso(graduacao, alunoLookup);
        const tempoRestanteLabel = formatTempoRestante(Number(graduacao.mesesRestantes));
        const alvoLabel =
          graduacao.tipo === 'Grau'
            ? `${graduacao.grauAlvo}º grau`
            : graduacao.proximaFaixa || graduacao.faixaAtual;
        return (
          <article
            key={graduacao.id}
            className="relative overflow-hidden rounded-2xl border border-bjj-gray-800/70 bg-gradient-to-br from-bjj-gray-900 via-bjj-black to-bjj-black p-5 shadow-[0_18px_35px_-18px_rgba(0,0,0,0.55)]"
          >
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-bjj-red/10 blur-2xl" />
            <header className="relative flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bjj-gray-200/60">
                Próxima conquista
              </span>
              <h3 className="text-lg font-semibold text-bjj-white">{graduacao.alunoNome}</h3>
              <div className="flex flex-wrap items-center gap-3 text-sm text-bjj-gray-200/80">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-bjj-gray-700 px-2.5 py-1 text-xs">
                  <Award className={`${iconSizes.xs} ${iconColors.default}`} /> {graduacao.tipo}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-bjj-gray-200/70">
                  <ArrowRight className={`${iconSizes.xs} ${iconColors.default}`} /> {alvoLabel}
                </span>
              </div>
            </header>

            <div className="relative mt-5 space-y-3.5">
              <div>
                <div className="flex items-center justify-between text-xs text-bjj-gray-200/70">
                  <span>Progresso até a cerimônia</span>
                  <span>{progresso}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-bjj-gray-800">
                  <div
                    className="h-full rounded-full bg-bjj-red transition-all"
                    style={{ width: `${progresso}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs text-bjj-gray-200/70">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock className={`${iconSizes.xs} ${iconColors.default}`} />
                  {formatDate(graduacao.previsao)}
                </span>
                {tempoRestanteLabel && (
                  <span className="inline-flex items-center gap-1.5">
                    <Timer className={`${iconSizes.xs} ${iconColors.default}`} />
                    {tempoRestanteLabel}
                  </span>
                )}
              </div>
            </div>

            <footer className="relative mt-5 flex flex-wrap items-center justify-between gap-2.5">
              <span
                className={`inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold ${
                  statusStyles[graduacao.status] || 'bg-bjj-gray-800 text-bjj-gray-200 border border-bjj-gray-700'
                }`}
              >
                {graduacao.status}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Planejado', 'Em progresso', 'Concluído'].map((status) => (
                  <button
                    key={status}
                    onClick={() => onStatusChange?.(graduacao, status)}
                    className={`rounded-lg border px-2.5 py-1 text-xs transition ${
                      graduacao.status === status
                        ? 'border-bjj-red bg-bjj-red text-bjj-white'
                        : 'border-bjj-gray-700 text-bjj-gray-200 hover:border-bjj-red hover:text-bjj-red'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </footer>
          </article>
        );
      })}
    </div>
  );
}
