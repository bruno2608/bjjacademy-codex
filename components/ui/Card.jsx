/**
 * Card componente reutilizável para métricas rápidas. A aparência foi
 * atualizada para refletir o mesmo visual gamificado das graduações,
 * com gradiente, brilho e destaque para o valor principal.
 */
export default function Card({ title, value, icon: Icon, description }) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-bjj-gray-800/70 bg-gradient-to-br from-bjj-gray-900 via-bjj-black to-bjj-black p-6">
      <div className="absolute right-0 top-0 h-24 w-24 -translate-y-10 translate-x-10 rounded-full bg-bjj-red/10 blur-2xl" aria-hidden />
      <header className="relative flex items-start justify-between">
        <div className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-bjj-gray-200/60">{title}</span>
          <p className="text-3xl font-semibold text-bjj-white">{value}</p>
        </div>
        {Icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-bjj-red/10 text-bjj-red">
            <Icon size={18} />
          </span>
        )}
      </header>
      {description && <p className="relative mt-3 text-xs text-bjj-gray-200/70">{description}</p>}
    </article>
  );
}
