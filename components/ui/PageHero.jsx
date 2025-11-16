'use client';

/**
 * PageHero replica a identidade gamificada introduzida na tela de graduações
 * para outras páginas do painel. Ele combina badge, título, descrição e
 * métricas rápidas em um único cartão com gradiente e layers de brilho.
 *
 * Após o feedback da equipe, removemos o slot de "ações" para impedir que
 * atalhos herdados (como o antigo botão “Nova tarefa”) reapareçam neste bloco.
 */
export default function PageHero({ title, subtitle, badge, stats = [] }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-bjj-gray-800/60 bg-gradient-to-br from-bjj-gray-900 via-bjj-black to-bjj-black p-6 shadow-[0_18px_35px_-18px_rgba(0,0,0,0.55)]">
      <div className="absolute right-[-30%] top-[-40%] h-56 w-56 rounded-full bg-bjj-red/10 blur-3xl" aria-hidden />
      <div className="absolute left-[-20%] bottom-[-40%] h-56 w-56 rounded-full bg-bjj-gray-800/40 blur-3xl" aria-hidden />
      <div className="relative flex flex-col gap-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl space-y-3">
            {badge && (
              <span className="inline-flex items-center justify-center rounded-full border border-bjj-gray-700 bg-bjj-gray-900/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-bjj-gray-200/70">
                {badge}
              </span>
            )}
            <div className="space-y-2.5">
              <h1 className="text-2xl font-semibold text-bjj-white md:text-3xl">{title}</h1>
              {subtitle && <p className="text-sm text-bjj-gray-200/80 md:text-base">{subtitle}</p>}
            </div>
          </div>
        </header>
        {stats.length > 0 && (
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ label, value, helper }) => (
              <div
                key={label}
                className="relative overflow-hidden rounded-xl border border-bjj-gray-800/80 bg-bjj-gray-900/70 px-4 py-3"
              >
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-bjj-gray-200/60">{label}</span>
                <p className="mt-1.5 text-xl font-semibold text-bjj-white">{value}</p>
                {helper && <p className="mt-1 text-xs text-bjj-gray-200/70">{helper}</p>}
                <div className="absolute right-0 top-0 h-16 w-16 translate-x-8 -translate-y-8 rounded-full bg-bjj-red/10 blur-2xl" aria-hidden />
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
