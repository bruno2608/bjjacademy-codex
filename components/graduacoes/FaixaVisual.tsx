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
    'flex w-36 flex-col overflow-hidden rounded border border-bjj-gray-800 bg-bjj-gray-900/40 shadow-sm',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const renderLinha = (corSegmento: string, index: number) => (
    <div key={`${corSegmento}-${index}`} className="flex h-3 w-full">
      <div className="flex-[6]" style={{ backgroundColor: corSegmento }} />
      <div className="relative flex-[4]" style={{ backgroundColor: corPonteira }}>
        {exibirGraus && grauCount > 0 && (
          <div className="absolute inset-0 flex items-center justify-center gap-[3px] px-[2px]">
            {Array.from({ length: grauCount }).map((_, idx) => (
              <span key={idx} className="h-[70%] w-[3px] rounded-full bg-white/95" />
            ))}
          </div>
        )}
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
