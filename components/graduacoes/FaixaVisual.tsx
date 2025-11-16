import type { FC } from 'react';

export type FaixaVisualProps = {
  corFaixa: string;
  corBarra: string;
  corPonteira: string;
  quantidadeGraus?: number;
  exibirGraus?: boolean;
  className?: string;
};

const MAX_GRAUS = 4;

/**
 * Reproduz o visual tradicional das faixas IBJJF usado no sistema antigo,
 * com três listras horizontais e uma ponteira à direita onde os graus são exibidos.
 */
const FaixaVisual: FC<FaixaVisualProps> = ({
  corFaixa,
  corBarra,
  corPonteira,
  quantidadeGraus = 0,
  exibirGraus = true,
  className = ''
}) => {
  const linhas = [corFaixa, corBarra || corFaixa, corFaixa];
  const grauCount = Math.min(MAX_GRAUS, Math.max(0, quantidadeGraus));

  const containerClasses = [
    'w-full max-w-[24rem] flex flex-col gap-1 overflow-hidden rounded-lg bg-gradient-to-r from-bjj-gray-900 via-bjj-gray-800 to-bjj-gray-900 p-2 shadow-lg',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const renderGraus = () => {
    if (!exibirGraus || grauCount === 0) return null;

    const stripes = Array.from({ length: grauCount * 2 }).map((_, index) => {
      const isWhite = index % 2 === 0;
      return (
        <span
          key={`grau-${index}`}
          className={`h-full w-[8px] ${isWhite ? 'bg-white' : ''}`}
          style={{ backgroundColor: isWhite ? undefined : corPonteira }}
        />
      );
    });

    return (
      <div className="absolute inset-0 flex items-center justify-center gap-[1px] px-[2px]">
        {stripes}
      </div>
    );
  };

  const renderLinha = (corSegmento: string, index: number) => (
    <div key={`${corSegmento}-${index}`} className="flex h-3 w-full overflow-hidden">
      <div className="flex-[2]" style={{ backgroundColor: corSegmento }} />
      <div className="relative flex-[1]" style={{ backgroundColor: corPonteira }}>
        {renderGraus()}
      </div>
      <div className="flex-[0.5]" style={{ backgroundColor: corSegmento }} />
    </div>
  );

  return (
    <div className={containerClasses} aria-label="Visual da faixa">
      {linhas.map((cor, index) => renderLinha(cor, index))}
    </div>
  );
};

export default FaixaVisual;
