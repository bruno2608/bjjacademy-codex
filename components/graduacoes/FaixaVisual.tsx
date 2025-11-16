
import React from "react";

interface FaixaVisualProps {
  corBase: string;
  corLinha: string;
  corPonteira: string;
  graus: number;
  categoria?: 'Infantil' | 'Adulto';
  className?: string;
}

export default function FaixaVisual({
  corBase = '#FFEB3B',
  corLinha = '#FFFFFF',
  corPonteira = '#000000',
  graus = 0,
  categoria,
  className
}: FaixaVisualProps) {
  const isInfantil = categoria === 'Infantil';
  const bodyLayers = isInfantil
    ? [corBase, corLinha, corBase]
    : [corBase, corBase, corBase];

  const stripeAreaColor = corPonteira;
  const ponteiraWidth = isInfantil ? 0 : 52;
  const tailWidth = isInfantil ? 0 : 12;
  const stripeAreaWidth = isInfantil ? 52 : ponteiraWidth;

  const renderGraus = (backgroundColor: string) => {
    if (graus <= 0) return null;
    const stripes = [];

    for (let i = 0; i < graus; i++) {
      stripes.push(
        <React.Fragment key={`grau-${i}`}>
          <div className="h-full w-[6px] rounded-[1px] bg-white" />
          {i < graus - 1 && (
            <div className="h-full w-[4px]" style={{ backgroundColor }} />
          )}
        </React.Fragment>
      );
    }

    return <div className="flex h-full items-center justify-center px-[4px] py-[2px]">{stripes}</div>;
  };

  const containerClasses = ['relative flex flex-col w-full overflow-hidden rounded-sm'];
  if (className) containerClasses.push(className);

  return (
    <div className={containerClasses.join(' ')}>
      {bodyLayers.map((cor, idx) => (
        <div key={`${cor}-${idx}`} className="flex h-3 w-full overflow-hidden">
          <div className="flex-1" style={{ backgroundColor: cor }} />
          {isInfantil ? (
            <div
              className="flex-shrink-0"
              style={{ backgroundColor: stripeAreaColor, width: stripeAreaWidth }}
            />
          ) : (
            <>
              <div
                className="flex-shrink-0"
                style={{ backgroundColor: corPonteira, width: ponteiraWidth }}
              />
              <div className="flex-shrink-0" style={{ backgroundColor: cor, width: tailWidth }} />
            </>
          )}
        </div>
      ))}
      {graus > 0 && (
        <div
          className="pointer-events-none absolute inset-y-0"
          style={{ right: tailWidth, width: stripeAreaWidth }}
        >
          {renderGraus(stripeAreaColor)}
        </div>
      )}
    </div>
  );
}
