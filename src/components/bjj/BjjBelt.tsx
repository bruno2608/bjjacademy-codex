import React from "react";

// ============================================================================
// 1. TIPOS E MODELO DE DADOS
// ============================================================================

export type CategoriaFaixa = "INFANTIL" | "ADULTO";

/**
 * Configuração visual da faixa.
 * A ideia é que isso venha 100% do backend (tabela de faixas),
 * e o front só "desenhe" com base nesses dados.
 */
export type BjjBeltVisualConfig = {
  id?: string | number;
  nome: string;                 // Ex: "Branca", "Amarela e Preta", "Preta"
  slug: string;                 // Ex: "branca", "amarela-preta", "preta"
  categoria: CategoriaFaixa;    // "INFANTIL" | "ADULTO"

  // Regra de graus – configurável no backend
  grausMaximos: number;

  // Cores da faixa
  beltColorClass: string;         // Ex: "bg-purple-700"
  horizontalStripeClass?: string; // Listra central (infantil, ex: "bg-black")
  stitchingColorClass?: string;   // Cor da costura (ex: "bg-white/10")
  textColorClass?: string;        // Cor do texto "JIU-JITSU"

  // Ponteira e graus
  tipColorClass: string;          // Ex: "bg-black", "bg-red-600", "bg-white"
  stripeColorClass: string;       // Grau ativo
  stripeInactiveClass: string;    // Grau inativo

  /**
   * Variações específicas para faixa preta.
   * - "competidor": ponteira branca, graus pretos, etc.
   * - "professor": ponteira vermelha com bordas brancas.
   * - "padrao": ponteira vermelha lisa (praticante/preto comum).
   */
  tipoPreta?: "competidor" | "professor" | "padrao";

  /**
   * Cor da barra de progresso, para não depender de "slug" no front.
   * Ex: "bg-emerald-500", "bg-purple-500".
   */
  progressBarClass?: string;
};

// ============================================================================
// 2. PROPS DOS COMPONENTES
// ============================================================================

export type BjjBeltStripProps = {
  config: BjjBeltVisualConfig;
  grauAtual: number;
  className?: string;
};

export type BjjBeltProgressCardProps = {
  config: BjjBeltVisualConfig;
  grauAtual: number;
  aulasFeitasNoGrau: number;
  /**
   * Meta de aulas no grau:
   * - number > 0 → calcula % normalmente
   * - 0 | null | undefined → trata como "sem meta definida"
   */
  aulasMetaNoGrau?: number | null;
  className?: string;
};

// ============================================================================
// 3. COMPONENTE VISUAL PURO: BjjBeltStrip
// ============================================================================

/**
 * BjjBeltStrip
 * - Desenha apenas a faixa (tecido + ponteira + graus).
 * - Não sabe nada de aulas ou progresso, é 100% visual.
 * - Usado em header de dashboard, listas de presença, chips de perfil, etc.
 */
export const BjjBeltStrip: React.FC<BjjBeltStripProps> = ({
  config,
  grauAtual,
  className,
}) => {
  if (!config) return null;

  // Clamp do grau: nunca menor que 0 nem maior que o máximo definido para a faixa.
  const safeGrau = Math.max(0, Math.min(grauAtual, config.grausMaximos));

  const isProfessor = config.tipoPreta === "professor";
  const textColor = config.textColorClass || "text-white";
  const stitchingClass = config.stitchingColorClass || "bg-black/10";

  const containerBase =
    "relative w-full h-14 rounded-md shadow-lg flex overflow-hidden " +
    "group transition-transform hover:scale-[1.005] duration-500 border border-white/10";

  return (
    <div className={`${containerBase} ${className ?? ""}`}>
      {/* Textura de tecido */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/10 pointer-events-none z-10 mix-blend-overlay opacity-50" />

      {/* Corpo da faixa */}
      <div
        className={`flex-grow ${config.beltColorClass} relative flex items-center pl-4 transition-colors duration-300 overflow-hidden`}
      >
        {/* Listra central (faixas infantis compostas) */}
        {config.horizontalStripeClass && (
          <div
            className={`absolute w-full h-1/3 ${config.horizontalStripeClass} top-1/2 -translate-y-1/2 z-0 shadow-sm`}
          />
        )}

        {/* Costuras */}
        <div
          className={`w-full h-[1px] ${stitchingClass} absolute top-2 z-10`}
        />
        <div
          className={`w-full h-[1px] ${stitchingClass} absolute bottom-2 z-10`}
        />

        {/* Marca textual da faixa */}
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
        {/* Bordas brancas para faixa preta de professor */}
        {isProfessor && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white z-30 shadow-sm" />
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white z-30 shadow-sm" />
          </>
        )}

        {/* Graus / listras */}
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

// ============================================================================
// 4. CARD COMPLETO: BjjBeltProgressCard
// ============================================================================

/**
 * BjjBeltProgressCard
 * - Card “completo” para dashboards.
 * - Mostra título, faixa visual e barra de progresso baseada em aulas.
 * - Pode ser usado na home do aluno, evolução, etc.
 */
export const BjjBeltProgressCard: React.FC<BjjBeltProgressCardProps> = ({
  config,
  grauAtual,
  aulasFeitasNoGrau,
  aulasMetaNoGrau,
  className,
}) => {
  if (!config) {
    return (
      <div className="w-full p-4 bg-red-900/20 border border-red-900/50 rounded-xl text-red-400 text-xs">
        Erro: configuração de faixa ausente.
      </div>
    );
  }

  // Clamp de grau para exibição
  const safeGrau = Math.max(0, Math.min(grauAtual, config.grausMaximos));

  // Meta de aulas: se não vier número > 0, tratamos como "sem meta"
  const hasMeta =
    typeof aulasMetaNoGrau === "number" && aulasMetaNoGrau > 0;
  const safeMeta = hasMeta ? aulasMetaNoGrau : 0;

  // Porcentagem de progresso
  const rawPercent = hasMeta ? (aulasFeitasNoGrau / safeMeta) * 100 : 0;
  const percentage = Math.min(100, Math.max(0, rawPercent));

  const progressBarColor = config.progressBarClass || config.beltColorClass;
  const isProfessor = config.tipoPreta === "professor";

  const cardBase =
    "w-full p-5 bg-zinc-900 rounded-xl border border-zinc-800/60 shadow-sm font-sans";

  return (
    <div className={`${cardBase} ${className ?? ""}`}>
      {/* Cabeçalho */}
      <div className="flex justify-between items-end mb-3">
        <div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-0.5">
            Categoria {config.categoria}
          </p>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            Faixa {config.nome}
            {isProfessor && (
              <span className="text-[10px] py-0.5 px-1.5 rounded border border-red-500/40 text-red-400 bg-red-500/10 uppercase tracking-wide font-bold">
                Professor
              </span>
            )}
            {config.tipoPreta === "competidor" && (
              <span className="text-[10px] py-0.5 px-1.5 rounded border border-zinc-500/40 text-zinc-400 bg-zinc-500/10 uppercase tracking-wide font-bold">
                Competidor
              </span>
            )}
          </h3>
        </div>

        <div className="text-right">
          <div className="text-sm text-zinc-400">
            Grau{" "}
            <span className="text-white font-bold text-lg">{safeGrau}</span>
            <span className="text-zinc-600 text-xs mx-1">/</span>
            <span className="text-zinc-600 text-xs">
              {config.grausMaximos}
            </span>
          </div>
        </div>
      </div>

      {/* Faixa visual */}
      <div className="mb-5">
        <BjjBeltStrip config={config} grauAtual={safeGrau} />
      </div>

      {/* Barra de progresso */}
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
              <span className="text-zinc-500 italic">
                Meta de aulas não definida
              </span>
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
