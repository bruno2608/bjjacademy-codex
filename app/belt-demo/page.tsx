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

      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">
            Componente Visual Isolado
          </h2>
          <p className="text-zinc-500 text-sm">
            Apenas <code>BjjBeltStrip</code>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-500 mb-2">
              Perfil Compacto (Preta Padrão)
            </p>
            <BjjBeltStrip config={MOCK_FAIXAS[2]} grauAtual={4} />
          </div>

          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-500 mb-2">
              Lista de Presença (Infantil)
            </p>
            <BjjBeltStrip config={MOCK_FAIXAS[0]} grauAtual={1} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BjjBeltDemoPage;
