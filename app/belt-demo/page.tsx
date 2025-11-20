"use client"

import React from "react"

// Caminhos relativos iguais ao seu arquivo atual
import { BjjBeltStrip } from "../../components/bjj/BjjBeltStrip"
import { BjjBeltProgressCard } from "../../components/bjj/BjjBeltProgressCard"
import { MOCK_FAIXAS } from "../../data/mocks/bjjBeltMocks"

// -----------------------------------------------------------------------------
// Tipos locais (não usam BjjBeltVisualConfig nem BjjBeltProgressCardProps)
// -----------------------------------------------------------------------------

// Cada item do MOCK_FAIXAS
type BeltConfig = (typeof MOCK_FAIXAS)[number]

type BeltCardData = {
  config: BeltConfig
  grauAtual: number
  aulasFeitasNoGrau: number
  aulasMetaNoGrau: number
  key: string
}

// -----------------------------------------------------------------------------
// Função auxiliar para simular dados de progresso para cada faixa
// -----------------------------------------------------------------------------

const gerarDadosAluno = (config: BeltConfig, index: number): BeltCardData => {
  const metaBase = config.categoria === "INFANTIL" ? 50 : 120
  const aulasMeta = metaBase + index * 5

  // Simula um progresso crescente ou completo
  const aulasFeitas = Math.min(aulasMeta, index * 10 + 40)

  // Simula um grau dentro do limite
  const grauAtual = index % (config.grausMaximos + 1)

  return {
    config,
    grauAtual,
    aulasFeitasNoGrau: aulasFeitas,
    aulasMetaNoGrau: aulasMeta,
    key: `${config.slug}-${config.id}`,
  }
}

// -----------------------------------------------------------------------------
// Componente principal da página
// -----------------------------------------------------------------------------

export default function BeltDemoPage() {
  const faixasParaExibir: BeltCardData[] = MOCK_FAIXAS.map(gerarDadosAluno)

  return (
    <main className="min-h-screen bg-zinc-950 p-8 md:p-12">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
            Dashboard de Faixas BJJ
          </h1>
          <p className="text-zinc-400">
            Visualização de todas as {MOCK_FAIXAS.length} faixas (Infantil, Adulto e Honoríficas).
          </p>
        </div>

        {/* ================================================================== */}
        {/* SEÇÃO 1: CARDS DE PROGRESSO (BjjBeltProgressCard)                  */}
        {/* ================================================================== */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 border-b border-zinc-700 pb-3">
            Cards de Progresso e Metas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faixasParaExibir.map((item) => (
              <BjjBeltProgressCard
                key={`card-${item.key}`}
                config={item.config}
                grauAtual={item.grauAtual}
                aulasFeitasNoGrau={item.aulasFeitasNoGrau}
                aulasMetaNoGrau={item.aulasMetaNoGrau}
              />
            ))}
          </div>
        </section>

        {/* ================================================================== */}
        {/* SEÇÃO 2: VISUAL ISOLADO (BjjBeltStrip)                             */}
        {/* ================================================================== */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 pt-6 border-t border-zinc-700 pb-3">
            Visual Puro das Faixas (Strips)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faixasParaExibir.map((item) => (
              <div
                key={`strip-${item.key}`}
                className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 transition-colors hover:border-zinc-700"
              >
                <p className="text-xs text-zinc-400 mb-2 uppercase">
                  {item.config.nome} ({item.config.categoria})
                </p>
                <BjjBeltStrip config={item.config} grauAtual={item.grauAtual} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
