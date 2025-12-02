import { iconColors, iconSizes } from '@/styles/iconTokens';

/**
 * Card componente reutilizável para métricas rápidas.
 * Utiliza a classe utilitária `.card` para manter consistência visual.
 */
export default function Card({ title, value, icon: Icon, description, className = '' }) {
  const classes = className ? `card ${className}` : 'card';

  return (
    <article className={classes}>
      <div className="absolute right-0 top-0 h-20 w-20 -translate-y-8 translate-x-8 rounded-full bg-bjj-red/10 blur-2xl" aria-hidden />
      <header className="relative flex items-start justify-between">
        <div className="space-y-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-bjj-gray-200/60">{title}</span>
          <p className="text-2xl font-semibold text-bjj-white">{value}</p>
        </div>
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-bjj-red/10 text-bjj-red">
            <Icon size={16} className={`${iconSizes.sm} ${iconColors.default}`} />
          </span>
        )}
      </header>
      {description && <p className="relative mt-2 text-xs text-bjj-gray-200/70">{description}</p>}
    </article>
  );
}
