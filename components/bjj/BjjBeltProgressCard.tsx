import { BjjBeltStrip } from "./BjjBeltStrip"
import type { BjjBeltProgressCardProps } from "@/types/bjjBelt"

export function BjjBeltProgressCard({
  config,
  grauAtual,
  aulasFeitasNoGrau,
  aulasMetaNoGrau,
  className = "",
}: BjjBeltProgressCardProps) {
  const safeGrau = Math.max(0, Math.min(grauAtual, config.grausMaximos))

  const hasMeta = typeof aulasMetaNoGrau === "number" && aulasMetaNoGrau > 0
  const safeMeta = hasMeta ? aulasMetaNoGrau : 0

  const rawPercent = hasMeta ? (aulasFeitasNoGrau / safeMeta) * 100 : 0
  const percentage = Math.min(100, Math.max(0, rawPercent))

  const progressBarColor = config.progressBarClass || config.beltColorClass
  const isProfessor = config.tipoPreta === "professor"

  return (
    <div className={`w-full p-5 bg-zinc-900 rounded-xl border border-zinc-800/60 shadow-sm font-sans ${className}`}>
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
            Grau <span className="text-white font-bold text-lg">{safeGrau}</span>
            <span className="text-zinc-600 text-xs mx-1">/</span>
            <span className="text-zinc-600 text-xs">{config.grausMaximos}</span>
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
                <span className="text-emerald-400 font-bold">{Math.round(percentage)}%</span>
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
  )
}
