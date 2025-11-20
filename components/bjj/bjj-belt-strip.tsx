import type { BjjBeltStripProps } from "../../types/bjjBelt"

export function BjjBeltStrip({ config, grauAtual, className = "" }: BjjBeltStripProps) {
  const safeGrau = Math.max(0, Math.min(grauAtual, config.grausMaximos))
  const isProfessor = config.tipoPreta === "professor"
  const textColor = config.textColorClass || "text-white"
  const stitchingClass = config.stitchingColorClass || "bg-black/10"

  return (
    <div
      className={`relative w-full h-14 rounded-md shadow-lg flex overflow-hidden group transition-transform hover:scale-[1.005] duration-500 border border-white/10 ${className}`}
    >
      {/* Textura de tecido */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/10 pointer-events-none z-10 mix-blend-overlay opacity-50" />

      {/* Corpo da faixa */}
      <div
        className={`flex-grow ${config.beltColorClass} relative flex items-center pl-4 transition-colors duration-300 overflow-hidden`}
      >
        {config.horizontalStripeClass && (
          <div
            className={`absolute w-full h-1/3 ${config.horizontalStripeClass} top-1/2 -translate-y-1/2 z-0 shadow-sm`}
          />
        )}

        {/* Costuras */}
        <div className={`w-full h-[1px] ${stitchingClass} absolute top-2 z-10`} />
        <div className={`w-full h-[1px] ${stitchingClass} absolute bottom-2 z-10`} />

        {/* Marca textual - improved contrast */}
        <span className="text-[10px] font-black tracking-[0.2em] opacity-70 uppercase text-white relative z-10">
          Jiu-Jitsu
        </span>
      </div>

      {/* Ponteira */}
      <div
        className={`relative h-full flex items-center justify-evenly z-20 shadow-[-2px_0_8px_rgba(0,0,0,0.25)] ${config.tipColorClass} min-w-[6rem] md:min-w-[8rem] px-1`}
      >
        {isProfessor && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white z-30 shadow-sm" />
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white z-30 shadow-sm" />
          </>
        )}

        {/* Graus / Listras */}
        {Array.from({ length: config.grausMaximos }).map((_, i) => {
          const isActive = i < safeGrau
          return (
            <div
              key={i}
              className={`w-2.5 h-3/5 rounded-[1px] shadow-sm transition-all duration-500 z-20 ${
                isActive
                  ? `${config.stripeColorClass} opacity-100 scale-100 shadow-[0_0_4px_rgba(255,255,255,0.4)]`
                  : `${config.stripeInactiveClass} scale-95`
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
