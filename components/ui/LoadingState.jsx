'use client';

/**
 * LoadingState exibe placeholders animados alinhados à linguagem visual
 * gamificada, reforçando feedback durante requisições.
 */
export default function LoadingState({ title = 'Carregando dados', message = 'Aguarde enquanto buscamos as informações.' }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-bjj-gray-800/60 bg-bjj-gray-900/60 p-6 shadow-[0_18px_35px_-18px_rgba(0,0,0,0.55)]">
      <div className="absolute right-[-30%] top-[-40%] h-56 w-56 rounded-full bg-bjj-red/10 blur-3xl" aria-hidden />
      <div className="absolute left-[-20%] bottom-[-40%] h-56 w-56 rounded-full bg-bjj-gray-800/40 blur-3xl" aria-hidden />
      <div className="relative space-y-4">
        <header className="space-y-2">
          <div className="h-2.5 w-28 animate-pulse rounded-full bg-bjj-red/40" />
          <h2 className="text-xl font-semibold text-bjj-white">{title}</h2>
          <p className="text-sm text-bjj-gray-200/70">{message}</p>
        </header>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="space-y-2.5 rounded-xl border border-bjj-gray-800/80 bg-bjj-gray-900/70 p-3.5"
            >
              <div className="h-2.5 w-20 animate-pulse rounded-full bg-bjj-gray-800/70" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-bjj-gray-700/60" />
              <div className="h-2.5 w-full animate-pulse rounded-full bg-bjj-gray-800/70" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
