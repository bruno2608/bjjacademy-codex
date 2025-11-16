import type { FC } from 'react';

export type FaixaVisualProps = {
  corFaixa: string;
  corBarra: string;
  corPonteira: string;
  quantidadeGraus?: number;
  exibirGraus?: boolean;
  className?: string;
};

/**
 * Renderiza a faixa no mesmo padrão visual usado pelo sistema antigo (IBJJF),
 * com três listras horizontais e ponteira à direita. Os graus são exibidos como
 * pequenas listras verticais dentro da ponteira.
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
  const grauCount = Math.min(4, Math.max(0, quantidadeGraus));

  const containerClasses = [
    'w-full max-w-[22rem] flex flex-col gap-1 overflow-hidden rounded-lg border border-zinc-700 bg-gradient-to-r from-bjj-gray-900 via-bjj-gray-800 to-bjj-gray-900 p-2 shadow-lg',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const renderGraus = () => {
    if (!exibirGraus || grauCount <= 0) return null;

    const stripes = Array.from({ length: grauCount * 2 }).map((_, idx) => {
      const isGrau = idx % 2 === 0;
      return (
        <span
          key={`stripe-${idx}`}
          className={`h-[90%] w-[6px] ${isGrau ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.7)]' : ''}`}
          style={{ backgroundColor: isGrau ? undefined : corPonteira }}
        />
      );
    });

    return (
      <div className="absolute inset-0 flex items-center justify-center gap-[2px] px-[2px]">
        {stripes}
      </div>
    );
  };

  const renderLinha = (corSegmento: string, index: number) => (
    <div key={`${corSegmento}-${index}`} className="flex h-3.5 w-full overflow-hidden">
      <div className="flex-[9]" style={{ backgroundColor: corSegmento }} />
      <div className="relative flex-[5]" style={{ backgroundColor: corPonteira }}>
        {renderGraus()}
      </div>
      <div className="flex-[3]" style={{ backgroundColor: corSegmento }} />
    </div>
  );

  return (
    <div className={containerClasses} aria-label="Visual da faixa">
      {linhas.map((cor, index) => renderLinha(cor, index))}
    </div>
  );
};

export default FaixaVisual;
