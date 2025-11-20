import FaixaVisual from '../../components/graduacoes/FaixaVisual';
import { BELT_ORDER, GRADUATION_RULES } from '../../config/graduationRules';

export const metadata = {
  title: 'Demonstração de faixas · BJJ Academy'
};

const sectionStyle =
  'rounded-3xl border border-bjj-gray-800 bg-bjj-gray-900/60 shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur';

function BeltCard({ name }) {
  const rule = GRADUATION_RULES[name];
  const stripes = rule?.graus?.length || 0;

  return (
    <div className={`${sectionStyle} flex flex-col gap-4 p-4`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-bjj-gray-300/80">Faixa</p>
          <h3 className="text-lg font-semibold leading-tight text-white">{name}</h3>
          {rule?.descricao ? (
            <p className="text-sm text-bjj-gray-300/80">{rule.descricao}</p>
          ) : null}
        </div>
        <FaixaVisual faixa={name} graus={stripes} tamanho="sm" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-bjj-gray-800/80 bg-bjj-black/40 p-3 text-sm text-bjj-gray-200/90">
          <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-300/70">Tempo mínimo</p>
          <p className="font-semibold">{rule?.tempoMinimoMeses ?? '--'} meses</p>
        </div>
        <div className="rounded-2xl border border-bjj-gray-800/80 bg-bjj-black/40 p-3 text-sm text-bjj-gray-200/90">
          <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-300/70">Aulas mínimas</p>
          <p className="font-semibold">{rule?.aulasMinimasFaixa ?? '--'} aulas</p>
        </div>
        <div className="rounded-2xl border border-bjj-gray-800/80 bg-bjj-black/40 p-3 text-sm text-bjj-gray-200/90">
          <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-300/70">Próxima faixa</p>
          <p className="font-semibold">{rule?.proximaFaixa || '—'}</p>
        </div>
        <div className="rounded-2xl border border-bjj-gray-800/80 bg-bjj-black/40 p-3 text-sm text-bjj-gray-200/90">
          <p className="text-[11px] uppercase tracking-[0.2em] text-bjj-gray-300/70">Método de graus</p>
          <p className="font-semibold">{rule?.metodoGraus === 'mensal' ? 'Automático mensal' : 'Registro manual'}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.25em] text-bjj-gray-300/80">
        <span className="rounded-full border border-bjj-gray-800 bg-bjj-gray-900/70 px-3 py-1 font-semibold text-white">
          {rule?.categoria || 'Adulto'}
        </span>
        <span className="rounded-full border border-bjj-gray-800 bg-bjj-gray-900/70 px-3 py-1 font-semibold text-white">
          {stripes} graus
        </span>
      </div>
    </div>
  );
}

export default function BeltDemoPage() {
  const beltGroups = BELT_ORDER.reduce(
    (acc, name) => {
      const rule = GRADUATION_RULES[name];
      const key = rule?.infantil ? 'infantil' : 'adulto';
      acc[key].push(name);
      return acc;
    },
    { infantil: [], adulto: [] }
  );

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className={`${sectionStyle} space-y-4 p-6`}>
        <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-300/80">Visão geral</p>
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold text-white">Demonstração de faixas</h1>
          <p className="text-sm text-bjj-gray-300/80">
            Explore a sequência completa de faixas utilizada na BJJ Academy e os requisitos mínimos de tempo e aulas para cada transição.
            Essa página é útil para apresentações e alinhamento com alunos e responsáveis.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-300/80">Faixas infantis</p>
            <h2 className="text-xl font-semibold text-white">Ciclo kids</h2>
          </div>
          <span className="rounded-full border border-bjj-gray-800 bg-bjj-gray-900/60 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-bjj-gray-200/80">
            {beltGroups.infantil.length} faixas
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {beltGroups.infantil.map((name) => (
            <BeltCard key={name} name={name} />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-bjj-gray-300/80">Faixas adultas</p>
            <h2 className="text-xl font-semibold text-white">Progressão principal</h2>
          </div>
          <span className="rounded-full border border-bjj-gray-800 bg-bjj-gray-900/60 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-bjj-gray-200/80">
            {beltGroups.adulto.length} faixas
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {beltGroups.adulto.map((name) => (
            <BeltCard key={name} name={name} />
          ))}
        </div>
      </div>
    </div>
  );
}
