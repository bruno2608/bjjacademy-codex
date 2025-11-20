import React from "react";

// ============================================================================
// 1. DEFINIÇÃO DE TIPOS E MODELOS
// ============================================================================

export type CategoriaFaixa = "INFANTIL" | "ADULTO";

/**
 * Configuração visual da faixa.
 * Estrutura pensada para ser montada a partir de dados do backend (tabela de faixas).
 */
export type BjjBeltVisualConfig = {
  id?: string | number;
  nome: string;
  slug: string;
  categoria: CategoriaFaixa;

  // Configuração de Regra (Vinda do Backend)
  grausMaximos: number;

  // Cores da Faixa (Visual)
  beltColorClass: string;
  horizontalStripeClass?: string;
  stitchingColorClass?: string;
  textColorClass?: string;

  // Cores da Ponteira e Graus
  tipColorClass: string;
  stripeColorClass: string;
  stripeInactiveClass: string;

  // Variações Especiais (Preta) - Define apenas bordas/layouts específicos
  tipoPreta?: "competidor" | "professor" | "padrao";

  // Cor da Barra de Progresso (para não depender de lógica de slug no front)
  progressBarClass?: string;
};

export type BjjBeltStripProps = {
  config: BjjBeltVisualConfig;
  grauAtual: number;
};

export type BjjBeltProgressCardProps = {
  config: BjjBeltVisualConfig;
  grauAtual: number;
  aulasFeitasNoGrau: number;
  aulasMetaNoGrau?: number | null; // Aceita null/undefined para tratar como sem meta
};

// ============================================================================
// 2. COMPONENTES VISUAIS
// ============================================================================

/**
 * BjjBeltStrip: Componente visual puro.
 * Responsável apenas por desenhar a faixa, costuras, ponteira e graus.
 */
export const BjjBeltStrip: React.FC<BjjBeltStripProps> = ({
  config,
  grauAtual,
}) => {
  // Proteção contra crash se config for undefined
  if (!config) return null;

  // Clamp de grauAtual: garante que nunca seja < 0 ou > grausMaximos
  const safeGrau = Math.max(0, Math.min(grauAtual, config.grausMaximos));

  const isProfessor = config.tipoPreta === "professor";
  const textColor = config.textColorClass || "text-white";
  const stitchingClass = config.stitchingColorClass || "bg-black/10";

  return (
    <div className="relative w-full h-14 rounded-md shadow-lg flex overflow-hidden group transition-transform hover:scale-[1.005] duration-500 border border-white/10 select-none">
      {/* Textura de tecido (Overlay global) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/10 pointer-events-none z-10 mix-blend-overlay opacity-50"></div>

      {/* Corpo da Faixa */}
      <div
        className={`flex-grow ${config.beltColorClass} relative flex items-center pl-4 transition-colors duration-300 overflow-hidden`}
      >
        {/* Listra Horizontal Central (se houver) */}
        {config.horizontalStripeClass && (
          <div
            className={`absolute w-full h-1/3 ${config.horizontalStripeClass} top-1/2 -translate-y-1/2 z-0 shadow-sm`}
          ></div>
        )}

        {/* Costuras */}
        <div
          className={`w-full h-[1px] ${stitchingClass} absolute top-2 z-10`}
        ></div>
        <div
          className={`w-full h-[1px] ${stitchingClass} absolute bottom-2 z-10`}
        ></div>

        {/* Texto "JIU-JITSU" */}
        <span
          className={`text-[10px] font-black tracking-[0.2em] opacity-50 uppercase ${textColor} relative z-10`}
        >
          Jiu-Jitsu
        </span>
      </div>

      {/* Ponteira */}
      <div
        className={`
        relative h-full flex items-center justify-evenly z-20 
        shadow-[-2px_0_8px_rgba(0,0,0,0.25)]
        ${config.tipColorClass}
        min-w-[6rem] md:min-w-[8rem] px-1
      `}
      >
        {/* Bordas de Professor (apenas se config.tipoPreta === 'professor') */}
        {isProfessor && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white z-30 shadow-sm"></div>
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white z-30 shadow-sm"></div>
          </>
        )}

        {/* Graus (Stripes) */}
        {Array.from({ length: config.grausMaximos }).map((_, i) => {
          const isActive = i < safeGrau;
          return (
            <div
              key={i}
              className={`
                w-2.5 h-3/5 rounded-[1px] shadow-sm transition-all duration-500 z-20
                ${
                  isActive
                    ? `${config.stripeColorClass} opacity-100 scale-100 shadow-[0_0_4px_rgba(255,255,255,0.4)]`
                    : `${config.stripeInactiveClass} scale-95`
                }
              `}
            />
          );
        })}
      </div>
    </div>
  );
};

/**
 * BjjBeltProgressCard: Card completo para Dashboard.
 * Inclui título, faixa e barra de progresso.
 */
export const BjjBeltProgressCard: React.FC<BjjBeltProgressCardProps> = ({
  config,
  grauAtual,
  aulasFeitasNoGrau,
  aulasMetaNoGrau,
}) => {
  if (!config) {
    return (
      <div className="p-4 text-red-500 text-xs border border-red-800 rounded bg-red-900/20">
        Erro: Configuração da faixa ausente.
      </div>
    );
  }

  // Clamp de grauAtual para exibição numérica
  const safeGrau = Math.max(0, Math.min(grauAtual, config.grausMaximos));

  // Validação da Meta de Aulas
  const hasMeta = typeof aulasMetaNoGrau === "number" && aulasMetaNoGrau > 0;
  const safeMeta = hasMeta ? aulasMetaNoGrau : 0;

  // Cálculo de Porcentagem (0 se não houver meta)
  const rawPercent = hasMeta ? (aulasFeitasNoGrau / safeMeta!) * 100 : 0;
  const percentage = Math.min(100, Math.max(0, rawPercent));

  // Cor da barra de progresso (fallback para cor da faixa)
  const progressBarColor = config.progressBarClass || config.beltColorClass;
  const isProfessor = config.tipoPreta === "professor";
  const isCompetitor = config.tipoPreta === "competidor";

  return (
    <div className="w-full p-5 bg-zinc-900 rounded-xl border border-zinc-800/60 shadow-sm font-sans">
      {/* Header do Card */}
      <div className="flex justify-between items-end mb-3">
        <div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
            Categoria {config.categoria}
          </p>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Faixa {config.nome}
            {/* Badges Identificadores */}
            {isProfessor && (
              <span className="text-[10px] py-0.5 px-1.5 rounded border border-red-500/40 text-red-400 bg-red-500/10 uppercase tracking-wide font-bold">
                Professor
              </span>
            )}
            {isCompetitor && (
              <span className="text-[10px] py-0.5 px-1.5 rounded border border-zinc-500/40 text-zinc-400 bg-zinc-500/10 uppercase tracking-wide font-bold">
                Competidor
              </span>
            )}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-sm text-zinc-400">
            Grau <span className="text-white font-bold text-lg">{safeGrau}</span>
            <span className="text-zinc-600 text-xs mx-1">/</span>
            <span className="text-zinc-600 text-xs">{config.grausMaximos}</span>
          </div>
        </div>
      </div>

      {/* Faixa Visual (Reutilizando o BjjBeltStrip) */}
      <div className="mb-5">
        <BjjBeltStrip config={config} grauAtual={safeGrau} />
      </div>

      {/* Barra de Progresso */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-zinc-400">
          <span>Progresso para o próximo nível</span>
          <span className="text-zinc-200">
            {hasMeta ? (
              <>
                <span className="text-emerald-400 font-bold">
                  {Math.round(percentage)}%
                </span>
                <span className="mx-1.5 text-zinc-600">|</span>
                {aulasFeitasNoGrau} de {safeMeta} aulas
              </>
            ) : (
              <span className="text-zinc-500 italic">Meta de aulas não definida</span>
            )}
          </span>
        </div>

        <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/50 relative">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${progressBarColor}`}
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
