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
    'w-full max-w-[15rem] flex-col overflow-hidden rounded-md border border-bjj-gray-800 bg-bjj-gray-900/60 p-2 shadow-inner',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const renderGraus = () => {
    if (!exibirGraus || grauCount <= 0) return null;

    const stripes = Array.from({ length: grauCount * 2 - 1 }).map((_, idx) => {
      const isGrau = idx % 2 === 0;
      return (
        <span
          key={`stripe-${idx}`}
          className={
            isGrau
              ? 'h-[85%] w-[6px] rounded-[1px] bg-white shadow-[0_0_4px_rgba(255,255,255,0.65)]'
              : 'h-[60%] w-[3px] rounded-[1px]'
          }
          style={{ backgroundColor: isGrau ? undefined : corPonteira }}
        />
      );
    });

    return (
      <div className="absolute inset-0 flex items-center justify-center gap-[2px] px-[3px]">
        {stripes}
      </div>
    );
  };

  const renderLinha = (corSegmento: string, index: number) => (
    <div key={`${corSegmento}-${index}`} className="flex h-3.5 w-full overflow-hidden rounded-sm">
      <div className="flex-[8]" style={{ backgroundColor: corSegmento }} />
      <div className="relative flex-[4]" style={{ backgroundColor: corPonteira }}>
        {renderGraus()}
      </div>
      <div className="flex-[3]" style={{ backgroundColor: corSegmento }} />
    </div>
  );

  return (
    <div className={containerClasses} aria-label="Visual da faixa">
      <div className="flex flex-col gap-1.5">
        {linhas.map((cor, index) => renderLinha(cor, index))}
      </div>
    </div>
  );
};

export default FaixaVisual;
