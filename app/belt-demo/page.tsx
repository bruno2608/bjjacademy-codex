"use client"

import { BjjBeltStrip } from "../../components/bjj/BjjBeltStrip"
import { BjjBeltProgressCard } from "../../components/bjj/BjjBeltProgressCard"
import { MOCK_FAIXAS } from "../..//data/mocks/bjjBeltMocks"

export default function BeltDemoPage() {
  console.log("[v0] BeltDemoPage rendering, MOCK_FAIXAS[0]:", MOCK_FAIXAS[0])

  return (
    <main className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* TEST: Ultra simples - sem wrappers */}
        <div className="bg-red-600 p-8 border-4 border-yellow-400">
          <p className="text-white text-lg font-bold mb-4">🔴 TEST RENDER AQUI EMBAIXO:</p>
          <BjjBeltStrip config={MOCK_FAIXAS[0]} grauAtual={3} />
        </div>

        {/* TEST: BjjBeltStrip simples */}
        <div className="bg-red-900 p-8 rounded border-2 border-red-500">
          <p className="text-white mb-4">TEST: BjjBeltStrip simples</p>
          <div className="bg-blue-900 p-4">
            <BjjBeltStrip config={MOCK_FAIXAS[0]} grauAtual={3} />
          </div>
        </div>

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Cards de Dashboard</h1>
          <p className="text-zinc-400">Teste de componentes refatorados.</p>
        </div>

        {/* Cards com progressão */}
        <div className="space-y-4">
          <BjjBeltProgressCard config={MOCK_FAIXAS[0]} grauAtual={3} aulasFeitasNoGrau={30} aulasMetaNoGrau={60} />
          <BjjBeltProgressCard config={MOCK_FAIXAS[1]} grauAtual={2} aulasFeitasNoGrau={150} aulasMetaNoGrau={150} />
          <BjjBeltProgressCard config={MOCK_FAIXAS[3]} grauAtual={6} aulasFeitasNoGrau={145} aulasMetaNoGrau={150} />
        </div>

        {/* Separador */}
        <div className="h-px bg-zinc-800 my-8" />

        {/* Seção de Componente Visual Isolado */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-2">Componente Visual Isolado</h2>
          <p className="text-zinc-500 text-sm mb-8">Apenas BjjBeltStrip em diferentes contextos</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amarela e Preta */}
            <div className="p-6 bg-zinc-900 rounded-lg border border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-4">Amarela-Preta</p>
              <div className="w-full">
                <BjjBeltStrip config={MOCK_FAIXAS[0]} grauAtual={6} />
              </div>
            </div>

            {/* Preta Competidor */}
            <div className="p-6 bg-zinc-900 rounded-lg border border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-4">Preta-Competidor</p>
              <div className="w-full">
                <BjjBeltStrip config={MOCK_FAIXAS[1]} grauAtual={6} />
              </div>
            </div>

            {/* Preta Padrão */}
            <div className="p-6 bg-zinc-900 rounded-lg border border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-4">Preta-Padrão</p>
              <div className="w-full">
                <BjjBeltStrip config={MOCK_FAIXAS[2]} grauAtual={6} />
              </div>
            </div>

            {/* Preta Professor */}
            <div className="p-6 bg-zinc-900 rounded-lg border border-zinc-800">
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-4">Preta-Professor</p>
              <div className="w-full">
                <BjjBeltStrip config={MOCK_FAIXAS[3]} grauAtual={6} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
