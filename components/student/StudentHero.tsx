import { BjjBeltStrip } from '@/components/bjj/BjjBeltStrip';
import { useCurrentAluno } from '@/hooks/useCurrentAluno';
import { getFaixaConfigBySlug } from '@/data/mocks/bjjBeltUtils';
import { normalizeFaixaSlug } from '@/lib/alunoStats';
import { getUserAvatarData } from '@/lib/userAvatar';

interface StudentHeroProps {
  name?: string;
  initials?: string;
  faixaSlug?: string;
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
  initials,
  faixaSlug,
  faixa,
  graus,
  statusLabel,
  avatarUrl,
  subtitle,
  className
}: StudentHeroProps) {
  const { aluno } = useCurrentAluno();

  const faixaSlugNormalizada = normalizeFaixaSlug(
    faixaSlug ?? faixa ?? aluno?.faixaSlug ?? aluno?.faixa ?? 'branca-adulto'
  );
  const faixaConfig =
    getFaixaConfigBySlug(faixaSlugNormalizada) ||
    (faixaSlugNormalizada?.startsWith('preta') ? getFaixaConfigBySlug('preta-padrao') : undefined) ||
    getFaixaConfigBySlug('branca-adulto');

  const grauAtual =
    typeof graus === 'number'
      ? graus
      : typeof aluno?.graus === 'number'
      ? aluno.graus
      : faixaConfig?.grausMaximos ?? 0;
  const faixaDescricao = faixaConfig
    ? `${faixaConfig.nome}${grauAtual ? ` · ${grauAtual}\u00ba grau` : ''}`
    : faixa || 'Faixa não informada';

  const avatarData = getUserAvatarData({
    nome: name ?? aluno?.nome,
    avatarUrl: avatarUrl ?? aluno?.avatarUrl,
    email: aluno?.email ?? undefined
  });

  const resolvedName = avatarData.nome || 'Aluno';
  const resolvedInitials = initials || avatarData.initials;
  const resolvedAvatarUrl = avatarData.avatarUrl;
  const resolvedStatus =
    statusLabel ||
    (typeof aluno?.status === 'string'
      ? `${aluno.status.charAt(0).toUpperCase()}${aluno.status.slice(1).toLowerCase()}`
      : undefined) ||
    'Ativo';

  const isLoading = !aluno && !name;

  return (
    <div
      className={`hero w-full rounded-3xl border border-bjj-gray-800/70 bg-gradient-to-br from-bjj-gray-900/90 via-bjj-gray-900/60 to-bjj-black shadow-[0_25px_60px_rgba(0,0,0,0.35)] ${
        className || ''
      }`}
    >
      <div className="hero-content w-full flex-col gap-6 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
        <figure className="avatar">
          <div className="w-28 rounded-full ring ring-bjj-red/70 ring-offset-2 ring-offset-bjj-gray-950 lg:w-32">
            {resolvedAvatarUrl ? (
              <img src={resolvedAvatarUrl} alt={`Avatar de ${resolvedName}`} loading="lazy" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-bjj-gray-800 text-xl font-semibold text-white">
                {resolvedInitials}
              </div>
            )}
          </div>
        </figure>

        <div className="flex w-full flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:pl-4">
          <div className="flex flex-col gap-3">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-bjj-gray-300/80">
                {subtitle || 'Dashboard do aluno'}
              </p>
              <h1 className="text-2xl font-semibold leading-tight text-white sm:text-3xl">
                {isLoading ? 'Carregando dados do seu perfil…' : resolvedName || 'Aluno'}
              </h1>
              <p className="text-sm text-bjj-gray-200/80">{faixaDescricao}</p>
            </div>

            <span className="badge badge-outline w-fit border-green-500/70 bg-green-600/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-green-200 shadow-[0_0_0_1px_rgba(74,222,128,0.25)]">
              {resolvedStatus}
            </span>
          </div>

          <div className="flex w-full justify-center lg:max-w-md">
            {faixaConfig && (
              <div className="w-full max-w-md">
                <BjjBeltStrip
                  config={faixaConfig}
                  grauAtual={grauAtual}
                  className="scale-[0.9] md:scale-100 origin-center"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
