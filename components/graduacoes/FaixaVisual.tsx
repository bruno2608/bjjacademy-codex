import type { FC } from 'react';

export type FaixaVisualProps = {
  corFaixa: string;
  corLinha: string;
  corPonteira: string;
  nomeFaixa: string;
  graus: number;
  className?: string;
  mostrarRodape?: boolean;
};

const MAX_GRAUS = 6;

/**
 * Renderiza o visual tradicional das faixas IBJJF (3 listras horizontais
 * com ponteira à direita), exibindo os graus como listras brancas dentro da ponteira.
 */
const FaixaVisual: FC<FaixaVisualProps> = ({
  corFaixa,
  corLinha,
  corPonteira,
  nomeFaixa,
  graus,
  className = '',
  mostrarRodape = false
}) => {
  const normalizedGraus = Math.max(0, Math.min(MAX_GRAUS, graus ?? 0));
  const linhas = [corFaixa, corLinha || corFaixa, corFaixa];

  const containerClasses = [
    'flex w-full max-w-sm flex-col gap-1 rounded-lg border border-bjj-gray-800/70 bg-gradient-to-r from-bjj-gray-900 via-bjj-gray-800 to-bjj-gray-900 p-3 shadow-lg',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const ponteira = (index: number) => (
    <div key={`ponteira-${index}`} className="relative flex-[1]" style={{ backgroundColor: corPonteira }}>
      {normalizedGraus > 0 && (
        <div className="absolute inset-0 flex items-center justify-center gap-[1px] px-[2px]">
          {Array.from({ length: normalizedGraus * 2 }).map((_, stripeIndex) => (
            <span
              key={`grau-${index}-${stripeIndex}`}
              className="h-full"
              style={{
                width: '8px',
                backgroundColor: stripeIndex % 2 === 0 ? '#FFFFFF' : corPonteira
              }}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={containerClasses} aria-label={`Visual da faixa ${nomeFaixa}`}>
      {linhas.map((corSegmento, index) => (
        <div key={`${corSegmento}-${index}`} className="flex h-3 w-full overflow-hidden rounded-sm">
          <div className="flex-[2]" style={{ backgroundColor: corSegmento }} />
          {ponteira(index)}
          <div className="flex-[0.5]" style={{ backgroundColor: corSegmento }} />
        </div>
      ))}

      {mostrarRodape && (
        <div className="mt-3 flex items-center justify-center gap-3 text-[0.7rem] text-bjj-gray-200/80">
          <span className="flex items-center gap-1">
            <span
              className="h-3 w-3 rounded-sm border border-bjj-gray-700"
              style={{ backgroundColor: corFaixa }}
            />
            Faixa: {nomeFaixa}
          </span>
          <span className="text-bjj-gray-500">|</span>
          <span className="flex items-center gap-1">
            <span role="img" aria-label="Medalha">
              🎖️
            </span>
            Graus: {normalizedGraus}
          </span>
        </div>
      )}
    </div>
  );
};

export default FaixaVisual;
