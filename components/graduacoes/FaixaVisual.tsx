
import React from "react";

import { GRADUATION_RULES } from '../../config/graduationRules';

type TamanhoFaixa = 'sm' | 'md' | 'lg';

interface FaixaVisualProps {
  faixa?: string;
  corBase?: string;
  corLinha?: string;
  corPonteira?: string;
  graus?: number;
  categoria?: 'Infantil' | 'Adulto';
  tamanho?: TamanhoFaixa;
  className?: string;
}

export default function FaixaVisual({
  faixa,
  corBase,
  corLinha,
  corPonteira,
  graus = 0,
  categoria,
  tamanho = 'md',
  className
}: FaixaVisualProps) {
  const regra = faixa ? GRADUATION_RULES[faixa] : null;

  const cores = {
    base: regra?.corFaixa || corBase || '#FFEB3B',
    linha: regra?.corBarra || corLinha || '#FFFFFF',
    ponteira: regra?.corPonteira || corPonteira || '#000000'
  };

  const isInfantil = (regra?.categoria || categoria) === 'Infantil';
  const bodyLayers = isInfantil
    ? [cores.base, cores.linha, cores.base]
    : [cores.base, cores.base, cores.base];

  const sizes: Record<
    TamanhoFaixa,
    { layerHeight: string; ponteira: string; tail: string; stripe: string; minW: string; maxW: string }
  > = {
    sm: {
      layerHeight: 'clamp(11px, 3vw, 14px)',
      ponteira: 'clamp(44px, 13vw, 56px)',
      tail: 'clamp(9px, 3vw, 12px)',
      stripe: 'clamp(42px, 12vw, 56px)',
      minW: 'clamp(9rem, 34vw, 11rem)',
      maxW: 'clamp(12rem, 48vw, 15rem)'
    },
    md: {
      layerHeight: 'clamp(13px, 3.6vw, 16px)',
      ponteira: 'clamp(54px, 14vw, 66px)',
      tail: 'clamp(11px, 3.6vw, 14px)',
      stripe: 'clamp(48px, 13vw, 66px)',
      minW: 'clamp(10rem, 38vw, 13rem)',
      maxW: 'clamp(14rem, 56vw, 18rem)'
    },
    lg: {
      layerHeight: 'clamp(15px, 4.4vw, 20px)',
      ponteira: 'clamp(64px, 16vw, 80px)',
      tail: 'clamp(12px, 4.2vw, 16px)',
      stripe: 'clamp(56px, 15vw, 80px)',
      minW: 'clamp(11rem, 42vw, 15rem)',
      maxW: 'clamp(16rem, 60vw, 22rem)'
    }
  };

  const preset = sizes[tamanho] || sizes.md;

  const stripeAreaColor = cores.ponteira;
  const ponteiraWidth = isInfantil ? 0 : preset.ponteira;
  const tailWidth = preset.tail;
  const stripeAreaWidth = isInfantil ? preset.stripe : ponteiraWidth;

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
    <div
      className={containerClasses.join(' ')}
      style={{ minWidth: preset.minW, maxWidth: preset.maxW }}
    >
      {bodyLayers.map((cor, idx) => (
        <div key={`${cor}-${idx}`} className="flex w-full overflow-hidden" style={{ height: preset.layerHeight }}>
          <div className="flex-1" style={{ backgroundColor: cor }} />
          {isInfantil ? (
            <>
              <div
                className="flex-shrink-0"
                style={{ backgroundColor: stripeAreaColor, width: stripeAreaWidth }}
              />
              <div className="flex-shrink-0" style={{ backgroundColor: cor, width: tailWidth }} />
            </>
          ) : (
            <>
              <div
                className="flex-shrink-0"
                style={{ backgroundColor: cores.ponteira, width: ponteiraWidth }}
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
