
import React from 'react';

type FaixaVisualProps = {
  corBase: string;
  corLinha: string;
  corPonteira: string;
  graus: number;
};

const FaixaVisual: React.FC<FaixaVisualProps> = ({
  corBase,
  corLinha,
  corPonteira,
  graus,
}) => {
  const ponteiras = [];

  for (let i = 0; i < graus * 2; i++) {
    ponteiras.push(
      <div
        key={i}
        className={`w-[8px] h-full ${i % 2 === 0 ? "bg-white" : "bg-black"}`}
      />
    );
  }

  return (
    <div className="flex flex-col w-full overflow-hidden bg-transparent">
      {[0, 1, 2].map((_, idx) => (
        <div key={idx} className="flex h-3 w-full">
          <div className="flex-[2]" style={{ backgroundColor: corBase }}></div>
          <div className="flex-[1.2] relative" style={{ backgroundColor: corPonteira }}>
            <div className="absolute inset-0 flex items-center justify-center gap-[1px] px-[2px]">
              {ponteiras}
            </div>
          </div>
          <div className="flex-[0.5]" style={{ backgroundColor: corBase }}></div>
        </div>
      ))}
    </div>
  );
};

export default FaixaVisual;
