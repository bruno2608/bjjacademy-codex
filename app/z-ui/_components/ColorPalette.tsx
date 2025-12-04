import { cn } from "@/lib/utils";

type PaletteToken = {
  label: string;
  className: string;
  value: string;
};

const baseTokens: PaletteToken[] = [
  { label: "base-100", className: "bg-base-100 text-base-content", value: "oklch(25.33% 0.016 252.42)" },
  { label: "base-200", className: "bg-base-200 text-base-content", value: "oklch(23.26% 0.014 253.1)" },
  { label: "base-300", className: "bg-base-300 text-base-content", value: "oklch(21.15% 0.012 254.09)" },
  { label: "base-content", className: "bg-base-content text-base-100", value: "oklch(97.807% 0.029 256.847)" },
];

const brandTokens: PaletteToken[] = [
  { label: "primary", className: "bg-primary text-primary-content", value: "oklch(98% 0.003 247.858)" },
  { label: "secondary", className: "bg-secondary text-secondary-content", value: "oklch(64% 0.246 16.439)" },
  { label: "accent", className: "bg-accent text-accent-content", value: "oklch(0% 0 0)" },
  { label: "neutral", className: "bg-neutral text-neutral-content", value: "oklch(37% 0.034 259.733)" },
];

const stateTokens: PaletteToken[] = [
  { label: "info", className: "bg-info text-info-content", value: "oklch(74% 0.16 232.661)" },
  { label: "success", className: "bg-success text-success-content", value: "oklch(76% 0.177 163.223)" },
  { label: "warning", className: "bg-warning text-warning-content", value: "oklch(85% 0.199 91.936)" },
  { label: "error", className: "bg-error text-error-content", value: "oklch(70% 0.191 22.216)" },
];

export function ColorPalette() {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Color Palette</h2>
          <p className="text-sm text-base-content/70">Paleta dos temas Z-Dark/Z-Light usando tokens DaisyUI.</p>
        </div>
        <span className="badge badge-outline border-base-300">Read-only</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <PaletteCard title="Base / Surface" tokens={baseTokens} />
        <PaletteCard title="Brand colors" tokens={brandTokens} />
        <PaletteCard title="Feedback" tokens={stateTokens} />
      </div>

      <div className="alert alert-info text-sm">
        Alternar o tema no topo da página para validar contraste e legibilidade em Z-Dark e Z-Light.
      </div>
    </section>
  );
}

function PaletteCard({ title, tokens }: { title: string; tokens: PaletteToken[] }) {
  return (
    <div className="card border border-base-300/70 bg-base-100/95 shadow-lg">
      <div className="card-body space-y-3">
        <h3 className="card-title text-base">{title}</h3>
        <div className="space-y-2">
          {tokens.map((token) => (
            <div
              key={token.label}
              className={cn(
                "flex items-center justify-between rounded-lg border border-base-300/60 px-3 py-3 text-sm",
                token.className
              )}
            >
              <div>
                <p className="font-semibold uppercase tracking-wide">{token.label}</p>
                <p className="text-[0.75rem] opacity-80">{token.value}</p>
              </div>
              <span className="text-[0.7rem] uppercase opacity-80">{token.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
