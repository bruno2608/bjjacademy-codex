import type { FC } from 'react';

export type FaixaVisualProps = {
  corFaixa: string;
  corBarra: string;
  corPonteira: string;
  stripes?: number;
  className?: string;
};

/**
 * Renderiza a faixa no padrão Kenri usando três listras horizontais.
 * A última faixa inclui a ponteira dividida para simular o nó com as listras de grau.
 */
const FaixaVisual: FC<FaixaVisualProps> = ({
  corFaixa,
  corBarra,
  corPonteira,
  stripes = 0,
  className = ''
}) => {
  const normalizedStripes = Math.max(0, stripes);
  const containerClasses = [
    'flex w-28 flex-col overflow-hidden rounded-sm border border-bjj-gray-800 bg-bjj-gray-900/60 shadow-sm',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      <div className="h-3" style={{ backgroundColor: corFaixa }} />
      <div className="h-2 border-y border-black/20" style={{ backgroundColor: corBarra || corFaixa }} />
      <div className="relative flex h-3">
        <div className="flex-1" style={{ backgroundColor: corPonteira }} />
        <div className="flex-[2]" style={{ backgroundColor: corFaixa }} />
        <div className="flex-1" style={{ backgroundColor: corPonteira }} />
        {normalizedStripes > 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1 px-2">
            {Array.from({ length: normalizedStripes }).map((_, index) => (
              <span
                // eslint-disable-next-line react/no-array-index-key
                key={`stripe-${index}`}
                className="h-2 w-0.5 rounded-full bg-white"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FaixaVisual;
