'use client';

/**
 * PageHero replica a identidade gamificada introduzida na tela de graduações
 * para outras páginas do painel. Ele combina badge, título, descrição e
 * métricas rápidas em um único cartão com gradiente e layers de brilho.
 */
export default function PageHero({ title, subtitle, badge, actions, stats = [] }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-bjj-gray-800/60 bg-gradient-to-br from-bjj-gray-900 via-bjj-black to-bjj-black p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.65)]">
      <div className="absolute right-[-30%] top-[-40%] h-64 w-64 rounded-full bg-bjj-red/10 blur-3xl" aria-hidden />
      <div className="absolute left-[-20%] bottom-[-40%] h-64 w-64 rounded-full bg-bjj-gray-800/40 blur-3xl" aria-hidden />
      <div className="relative flex flex-col gap-8">
        <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl space-y-4">
            {badge && (
              <span className="inline-flex items-center justify-center rounded-full border border-bjj-gray-700 bg-bjj-gray-900/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-bjj-gray-200/70">
                {badge}
              </span>
            )}
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-bjj-white md:text-4xl">{title}</h1>
              {subtitle && <p className="text-base text-bjj-gray-200/80 md:text-lg">{subtitle}</p>}
            </div>
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-3 md:justify-end">{actions}</div> : null}
        </header>
        {stats.length > 0 && (
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ label, value, helper }) => (
              <div
                key={label}
                className="relative overflow-hidden rounded-2xl border border-bjj-gray-800/80 bg-bjj-gray-900/70 px-5 py-4"
              >
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-bjj-gray-200/60">{label}</span>
                <p className="mt-2 text-2xl font-semibold text-bjj-white">{value}</p>
                {helper && <p className="mt-1 text-xs text-bjj-gray-200/70">{helper}</p>}
                <div className="absolute right-0 top-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-bjj-red/10 blur-2xl" aria-hidden />
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
