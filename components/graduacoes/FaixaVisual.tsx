import type { FC } from 'react';

export type FaixaVisualProps = {
  corFaixa: string;
  corBarra: string;
  corPonteira: string;
  className?: string;
};

/**
 * Renderiza uma faixa no padrão tradicional IBJJF com três listras horizontais.
 * Cada linha é composta por três segmentos, simulando a faixa, a barra central
 * e a ponteira posicionada à direita.
 */
const FaixaVisual: FC<FaixaVisualProps> = ({ corFaixa, corBarra, corPonteira, className = '' }) => {
  const containerClasses = [
    'flex w-28 flex-col overflow-hidden rounded-sm border border-bjj-gray-800 bg-bjj-gray-900/50 shadow-sm',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const renderLinha = (corSegmento: string) => (
    <div className="flex h-2 w-full">
      <div className="flex-[2]" style={{ backgroundColor: corSegmento }} />
      <div className="flex-[1]" style={{ backgroundColor: corPonteira }} />
      <div className="flex-[1]" style={{ backgroundColor: corSegmento }} />
    </div>
  );

  return (
    <div className={containerClasses} aria-label="Visual da faixa">
      {renderLinha(corFaixa)}
      {renderLinha(corBarra || corFaixa)}
      {renderLinha(corFaixa)}
    </div>
  );
};

export default FaixaVisual;
