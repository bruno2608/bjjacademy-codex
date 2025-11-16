
import React from "react";

interface FaixaVisualProps {
  corBase: string;
  corLinha: string;
  corPonteira: string;
  graus: number;
  nomeFaixa: string;
}

export default function FaixaVisual({
  corBase = "#FFEB3B",
  corLinha = "#FFFFFF",
  corPonteira = "#000000",
  graus = 0,
  nomeFaixa = "Amarela e Branca",
}: FaixaVisualProps) {
  const renderGraus = () => {
    const stripes = [];
    for (let i = 0; i < graus; i++) {
      stripes.push(
        <React.Fragment key={i}>
          <div className="w-[8px] h-full bg-white" />
          <div className="w-[8px] h-full" style={{ backgroundColor: corPonteira }} />
        </React.Fragment>
      );
    }
    if (graus > 0) {
      stripes.push(<div key="fim" className="w-[8px] h-full" style={{ backgroundColor: corPonteira }} />);
    }
    return stripes;
  };

  return (
    <div className="max-w-sm w-full p-4 bg-zinc-800 text-white rounded-lg border border-zinc-700 shadow-md">
      <div className="text-sm text-gray-400 uppercase mb-2 text-center">
        Faixa {nomeFaixa} com {graus} grau{graus !== 1 ? "s" : ""}
      </div>
      <div className="flex flex-col w-full overflow-hidden rounded border border-zinc-700">
        {[corBase, corLinha, corBase].map((cor, idx) => (
          <div key={idx} className="flex h-3 w-full">
            <div className="flex-[2]" style={{ backgroundColor: cor }} />
            <div className="flex-[1] relative" style={{ backgroundColor: corPonteira }}>
              <div className="absolute inset-0 flex items-center justify-center gap-[1px] px-[2px]">
                {renderGraus()}
              </div>
            </div>
            <div className="flex-[0.5]" style={{ backgroundColor: cor }} />
          </div>
        ))}
      </div>
    </div>
  );
}
