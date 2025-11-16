
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
  const ponteiraBodyWidth = 52;
  const ponteiraTipWidth = 14;
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
        <div className="relative flex h-full w-full overflow-hidden rounded-sm">
          <div className="flex h-full w-full flex-col">
            {infantilLayers.map((cor, idx) => (
              <div key={`${cor}-${idx}`} className="h-1/3 w-full" style={{ backgroundColor: cor }} />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex">
            <div className="relative h-full" style={{ width: ponteiraBodyWidth, backgroundColor: corLinha }}>
              {graus > 0 && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  {renderGraus(corLinha)}
                </div>
              )}
            </div>
            <div className="h-full" style={{ width: ponteiraTipWidth, backgroundColor: corPonteira }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={beltShellClasses.join(' ')}>
      <div className="relative flex h-full w-full overflow-hidden rounded-sm">
        <div className="h-full w-full" style={{ backgroundColor: corBase }} />

        <div className="pointer-events-none absolute inset-y-0 right-0 flex">
          <div className="relative h-full" style={{ width: ponteiraBodyWidth, backgroundColor: corLinha }}>
            {graus > 0 && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                {renderGraus(corLinha)}
              </div>
            )}
          </div>
          <div className="h-full" style={{ width: ponteiraTipWidth, backgroundColor: corPonteira }} />
        </div>
      </div>
    </div>
  );
}
