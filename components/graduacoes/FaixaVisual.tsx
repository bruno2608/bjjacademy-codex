
import React from "react";

interface FaixaVisualProps {
  corBase: string;
  corLinha: string;
  corPonteira: string;
  graus: number;
}

export default function FaixaVisual({
  corBase = "#FFEB3B",
  corLinha = "#FFFFFF",
  corPonteira = "#000000",
  graus = 0,
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
    <div className="max-w-sm w-full p-4 bg-zinc-800 text-white rounded-lg shadow-md">
      <div className="flex flex-col w-full overflow-hidden rounded">
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
