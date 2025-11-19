import React from "react";
import {
  BjjBeltStrip,
  BjjBeltProgressCard,
} from "@/components/bjj/BjjBelt";
import { MOCK_FAIXAS } from "@/mocks/bjjBeltMocks";

const BjjBeltDemoPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-8 flex flex-col items-center gap-12 font-sans">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Cards de Dashboard</h2>
          <p className="text-zinc-500 text-sm">
            Teste de componentes refatorados.
          </p>
        </div>

        {/* Uso com dados mockados */}
        <BjjBeltProgressCard
          config={MOCK_FAIXAS[0]}
          grauAtual={3}
          aulasFeitasNoGrau={30}
          aulasMetaNoGrau={60}
        />

        <BjjBeltProgressCard
          config={MOCK_FAIXAS[1]} // Preta Competidor
          grauAtual={2}
          aulasFeitasNoGrau={10}
          aulasMetaNoGrau={0} // Teste de meta não definida
        />

        <BjjBeltProgressCard
          config={MOCK_FAIXAS[3]} // Preta Professor
          grauAtual={99} // Teste de Clamp (deve travar no máximo visual)
          aulasFeitasNoGrau={145}
          aulasMetaNoGrau={150}
        />
      </div>

      <div className="w-full h-px bg-zinc-800"></div>

      <div className="w-full max-w-2xl space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-white">BjjBeltStrip (Isolado)</h2>
          <p className="text-zinc-500 text-sm">
            Apenas a representação visual da faixa, ideal para listas ou perfis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-red-900/40 bg-gradient-to-br from-red-950 via-red-900/60 to-red-950 shadow-lg space-y-3">
            <p className="text-xs font-semibold text-red-200/80 uppercase tracking-wide">
              Perfil Compacto
            </p>
            <BjjBeltStrip config={MOCK_FAIXAS[2]} grauAtual={4} />
            <p className="text-sm text-red-100/80">Mestre Hélio (Praticante)</p>
          </div>

          <div className="p-4 rounded-xl border border-yellow-500/40 bg-gradient-to-br from-black via-yellow-500/10 to-yellow-600/30 shadow-lg space-y-3">
            <p className="text-xs font-semibold text-yellow-100/80 uppercase tracking-wide">
              Lista de Presença
            </p>
            <BjjBeltStrip config={MOCK_FAIXAS[0]} grauAtual={1} />
            <p className="text-sm text-yellow-100/80">Enzo (Infantil)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BjjBeltDemoPage;
