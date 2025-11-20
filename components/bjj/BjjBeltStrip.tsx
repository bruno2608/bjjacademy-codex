import type { BjjBeltStripProps } from "../../types/bjjBelt"

export function BjjBeltStrip({ config, grauAtual, className = "" }: BjjBeltStripProps) {
  const safeGrau = Math.max(0, Math.min(grauAtual, config.grausMaximos))
  const isProfessor = config.tipoPreta === "professor"
  const textColor = config.textColorClass || "text-white"
  // Mantemos o stitchingClass
  const stitchingClass = config.stitchingColorClass || "bg-black/20"

  return (
    // Componente Externo (NÍVEL 1)
    <div
      className={`relative w-full h-16 rounded-md shadow-lg flex overflow-hidden group transition-transform hover:scale-[1.005] duration-500 border border-white/10 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/10 pointer-events-none z-10 mix-blend-overlay opacity-50" />
      {/* 1. Corpo da Faixa (NÍVEL 2) */}
      <div
        className={`flex-grow ${config.beltColorClass} relative flex items-center pl-4 transition-colors duration-300 overflow-hidden`}
      >
        
        {/* Z-INDEX 10: Listra Horizontal - DEVE APARECER ACIMA DO FUNDO AMARELO */}
        {config.horizontalStripeClass && (
          <div
            className={`absolute w-full h-1/3 ${config.horizontalStripeClass} top-1/2 -translate-y-1/2 z-10 shadow-sm`}
          />
        )}
        
        {/* Z-INDEX 20: Costuras - Devem aparecer acima da listra horizontal */}
        <div className={`w-full h-[1px] ${stitchingClass} absolute top-2 z-20`} />
        <div className={`w-full h-[1px] ${stitchingClass} absolute bottom-2 z-20`} />

        {/* Z-INDEX 30: Marca textual - Para garantir que o texto não fique coberto */}
        <span className={`text-[10px] font-black tracking-[0.2em] opacity-85 uppercase ${textColor} relative z-30`}>
          Jiu-Jitsu
        </span>
      </div>

      {/* 2. Ponteira (NÍVEL 2) */}
      <div
        className={`relative h-full flex items-center justify-evenly z-20 shadow-[-2px_0_8px_rgba(0,0,0,0.25)] ${config.tipColorClass} min-w-[7.5rem] md:min-w-[9rem] px-2`}
      >
        {isProfessor && (
          <>
            {/* Bordas de Professor (Z-30) */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white z-30 shadow-sm" />
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white z-30 shadow-sm" />
          </>
        )}

        {Array.from({ length: config.grausMaximos }).map((_, i) => {
          const isActive = i < safeGrau
          return (
            <div
              key={i}
              className={`w-3 h-2/3 rounded-sm shadow-md transition-all duration-500 z-20 ${
                isActive
                  ? `${config.stripeColorClass} opacity-100 scale-100 shadow-[0_0_4px_rgba(255,255,255,0.4)]`
                  : `${config.stripeInactiveClass} opacity-60 scale-90`
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}