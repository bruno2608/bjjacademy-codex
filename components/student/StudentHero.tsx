import FaixaVisual from '../graduacoes/FaixaVisual';

interface StudentHeroProps {
  name?: string;
  faixa?: string;
  graus?: number;
  statusLabel?: string;
  avatarUrl?: string;
  subtitle?: string;
  className?: string;
}

// Hero dedicado ao aluno para agrupar avatar, faixa/graduacao e status em um layout DaisyUI reutilizável.
export default function StudentHero({
  name,
  faixa,
  graus,
  statusLabel,
  avatarUrl,
  subtitle,
  className
}: StudentHeroProps) {
  const faixaDescricao = graus ? `${faixa} · ${graus}\u00ba grau` : faixa || 'Faixa não informada';

  return (
    <div
      className={`hero w-full rounded-3xl border border-bjj-gray-800/70 bg-gradient-to-br from-bjj-gray-900/90 via-bjj-gray-900/60 to-bjj-black shadow-[0_25px_60px_rgba(0,0,0,0.35)] ${
        className || ''
      }`}
    >
      <div className="hero-content w-full flex-col items-start gap-6 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
        <figure className="avatar">
          <div className="w-28 rounded-full ring ring-bjj-red/70 ring-offset-2 ring-offset-bjj-gray-950 lg:w-32">
            <img src={avatarUrl} alt={`Avatar de ${name || 'Aluno'}`} loading="lazy" />
          </div>
        </figure>

        <div className="flex flex-1 flex-col gap-3 lg:pl-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-300/80">{subtitle || 'Dashboard do aluno'}</p>
            <h1 className="text-2xl font-semibold leading-tight text-white sm:text-3xl">{name || 'Aluno'}</h1>
            <p className="text-sm text-bjj-gray-200/80">{faixaDescricao}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
              <FaixaVisual faixa={faixa} graus={graus} tamanho="lg" />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-bjj-gray-300/80">
              <span className="badge badge-outline border-green-500/70 bg-green-600/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-green-200 shadow-[0_0_0_1px_rgba(74,222,128,0.25)]">
                {statusLabel || 'Ativo'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
