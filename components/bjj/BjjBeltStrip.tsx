// Canonical BJJ belt strip. Trusts the mock colors; fallbacks only apply when a field is missing.
// Migration bug note: Tailwind overrides forcing bg-white/bg-white/10 were masking stripeColorClass/stripeInactiveClass
// (ex.: preta competidor perdeu listras pretas na ponteira branca). Keep stripes driven by config.
import type { BjjBeltStripProps } from "@/types/bjjBelt"

export function BjjBeltStrip({ config, grauAtual, className = "" }: BjjBeltStripProps) {
  if (!config) {
    return (
      <div
        className={`rounded-md border border-bjj-gray-800 bg-bjj-gray-900 px-3 py-2 text-xs text-bjj-gray-200 ${className}`}
      >
        Faixa nao encontrada
      </div>
    )
  }

  const safeGrau = Math.max(0, Math.min(grauAtual, config?.grausMaximos ?? 0))
  const isProfessor = config.tipoPreta === "professor"

  const textColor = config.textColorClass ?? "text-white"
  const stitchingClass = config.stitchingColorClass ?? "bg-black/20"
  const activeStripeClass = config.stripeColorClass ?? "bg-white"
  const inactiveStripeClass = config.stripeInactiveClass ?? "bg-white/10"
  const beltColorClass = config.beltColorClass ?? "bg-neutral-800"
  const tipColorClass = config.tipColorClass ?? "bg-black"

  return (
    <div
      className={`relative w-full h-16 rounded-md shadow-lg flex overflow-hidden group transition-transform hover:scale-[1.005] duration-500 border border-white/10 ${className}`}
    >
      {/* textura geral */}
      <div className="absolute inset-0 z-10 opacity-50 pointer-events-none bg-gradient-to-b from-white/10 to-black/10 mix-blend-overlay" />

      {/* Corpo da faixa */}
      <div
        className={`flex-grow ${beltColorClass} relative flex items-center pl-4 transition-colors duration-300 overflow-hidden`}
      >
        {/* listra horizontal (para faixas infantis etc.) */}
        {config.horizontalStripeClass && (
          <div
            className={`absolute w-full h-1/3 ${config.horizontalStripeClass} top-1/2 -translate-y-1/2 z-10 shadow-sm`}
          />
        )}

        {/* costuras */}
        <div className={`w-full h-[1px] ${stitchingClass} absolute top-2 z-20`} />
        <div className={`w-full h-[1px] ${stitchingClass} absolute bottom-2 z-20`} />

        {/* texto JIU-JITSU */}
        <span
          className={`text-[10px] font-black tracking-[0.2em] opacity-85 uppercase ${textColor} relative z-30`}
        >
          JIU-JITSU
        </span>
      </div>

      {/* Ponteira */}
      <div
        className={`relative h-full flex items-center justify-evenly z-20 shadow-[-2px_0_8px_rgba(0,0,0,0.25)] ${tipColorClass} min-w-[7.5rem] md:min-w-[9rem] px-2`}
      >
        {/* laterais de professor (faixa preta professor) */}
        {isProfessor && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white z-30 shadow-sm" />
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white z-30 shadow-sm" />
          </>
        )}

        {/* Graus / listras */}
        {Array.from({ length: config.grausMaximos }).map((_, i) => {
          const isActive = i < safeGrau

          return (
            <div
              key={i}
              className={`w-2.5 h-3/5 rounded-[1px] shadow-sm transition-all duration-300 z-30 ${
                isActive
                  ? `${activeStripeClass} opacity-100 scale-100 shadow-[0_0_4px_rgba(255,255,255,0.5)]`
                  : `${inactiveStripeClass} opacity-40 scale-95`
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
