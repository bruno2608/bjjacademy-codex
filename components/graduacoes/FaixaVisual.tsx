
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
  const ponteiraBodyWidth = 50;
  const ponteiraTipWidth = 16;
  const grauThickness = 5;
  const grauGap = 3;
  const beltHeight = isInfantil ? 'h-[14px] md:h-[16px]' : 'h-[14px] md:h-[16px]';

  const infantilLayers = [corBase, corLinha, corBase];

  const beltShellClasses = [
    'relative',
    'flex',
    'h-full',
    beltHeight,
    'min-w-[7rem]',
    'max-w-[12rem]',
    'overflow-hidden',
    'rounded-sm'
  ];

  const renderGraus = (backgroundColor: string) => {
    if (graus <= 0) return null;
    const stripes = [];

    for (let i = 0; i < graus; i++) {
      stripes.push(
        <React.Fragment key={`grau-${i}`}>
          <div
            className="h-full bg-white"
            style={{ width: grauThickness }}
          />
          {i < graus - 1 && (
            <div className="h-full" style={{ width: grauGap, backgroundColor }} />
          )}
        </React.Fragment>
      );
    }

    return <div className="flex h-full items-center justify-center px-[4px]">{stripes}</div>;
  };

  if (className) beltShellClasses.push(className);

  if (isInfantil) {
    return (
      <div className={beltShellClasses.join(' ')}>
        <div className="flex h-full w-full flex-col">
          {infantilLayers.map((cor, idx) => (
            <div key={`${cor}-${idx}`} className="flex h-1/3 w-full overflow-hidden">
              <div className="flex-1" style={{ backgroundColor: cor }} />
              <div
                className="relative flex-shrink-0"
                style={{ width: ponteiraBodyWidth, backgroundColor: corLinha }}
              >
                {graus > 0 && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    {renderGraus(corLinha)}
                  </div>
                )}
              </div>
              <div
                className="flex-shrink-0"
                style={{ width: ponteiraTipWidth, backgroundColor: corPonteira }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={beltShellClasses.join(' ')}>
      <div className="flex h-full w-full">
        <div className="flex-1" style={{ backgroundColor: corBase }} />
        <div
          className="relative flex-shrink-0"
          style={{ width: ponteiraBodyWidth, backgroundColor: corLinha }}
        >
          <div
            className="absolute inset-y-[1px] left-[3px] right-[3px]"
            style={{ backgroundColor: corLinha }}
          >
            {graus > 0 && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                {renderGraus(corLinha)}
              </div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0" style={{ width: ponteiraTipWidth, backgroundColor: corPonteira }} />
      </div>
    </div>
  );
}
