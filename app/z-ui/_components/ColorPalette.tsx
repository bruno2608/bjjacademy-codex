"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type PaletteToken = {
  label: string;
  className: string;
  varName: string;
  fallback: string;
};

type ColorPaletteProps = {
  theme: "zdark" | "zlight";
};

const baseTokens: PaletteToken[] = [
  { label: "base-100", className: "bg-base-100 text-base-content", varName: "--b1", fallback: "oklch(25.33% 0.016 252.42)" },
  { label: "base-200", className: "bg-base-200 text-base-content", varName: "--b2", fallback: "oklch(23.26% 0.014 253.1)" },
  { label: "base-300", className: "bg-base-300 text-base-content", varName: "--b3", fallback: "oklch(55% 0.027 264.364)" },
  { label: "base-content", className: "bg-base-content text-base-100", varName: "--bc", fallback: "oklch(100.0% 0.000 360.000)" },
];

const brandTokens: PaletteToken[] = [
  { label: "primary", className: "bg-primary text-primary-content", varName: "--p", fallback: "oklch(98% 0.003 247.858)" },
  { label: "secondary", className: "bg-secondary text-secondary-content", varName: "--s", fallback: "oklch(44% 0.017 285.786)" },
  { label: "accent", className: "bg-accent text-accent-content", varName: "--a", fallback: "oklch(58% 0.253 17.585)" },
  { label: "neutral", className: "bg-neutral text-neutral-content", varName: "--n", fallback: "oklch(37% 0.034 259.733)" },
];

const stateTokens: PaletteToken[] = [
  { label: "info", className: "bg-info text-info-content", varName: "--in", fallback: "oklch(74% 0.16 232.661)" },
  { label: "success", className: "bg-success text-success-content", varName: "--su", fallback: "oklch(79% 0.209 151.711)" },
  { label: "warning", className: "bg-warning text-warning-content", varName: "--wa", fallback: "oklch(85% 0.199 91.936)" },
  { label: "error", className: "bg-error text-error-content", varName: "--er", fallback: "oklch(64% 0.246 16.439)" },
];

export function ColorPalette({ theme }: ColorPaletteProps) {
  const initialValues = useMemo(
    () =>
      [...baseTokens, ...brandTokens, ...stateTokens].reduce<Record<string, string>>((acc, token) => {
        acc[token.label] = token.fallback;
        return acc;
      }, {}),
    []
  );

  const [values, setValues] = useState<Record<string, string>>(initialValues);

  useEffect(() => {
    const root = document.documentElement;
    const computed = getComputedStyle(root);

    setValues((prev) => {
      const next = { ...prev };
      [...baseTokens, ...brandTokens, ...stateTokens].forEach((token) => {
        const resolved = computed.getPropertyValue(token.varName)?.trim();
        next[token.label] = resolved || token.fallback;
      });
      return next;
    });
  }, [theme]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Color Palette</h2>
          <p className="text-sm text-base-content/70">
            Paleta dos temas zdark/zlight lida diretamente das CSS vars DaisyUI.
          </p>
        </div>
        <span className="badge badge-outline border-base-300">Read-only</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <PaletteCard title="Base / Surface" tokens={baseTokens} values={values} />
        <PaletteCard title="Brand colors" tokens={brandTokens} values={values} />
        <PaletteCard title="Feedback" tokens={stateTokens} values={values} />
      </div>

      <div className="alert alert-info text-sm">
        Alternar o tema no topo da página para validar contraste e legibilidade em zdark e zlight.
      </div>
    </section>
  );
}

function PaletteCard({
  title,
  tokens,
  values,
}: {
  title: string;
  tokens: PaletteToken[];
  values: Record<string, string>;
}) {
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
                <p className="text-[0.75rem] opacity-80">{values[token.label] ?? token.fallback}</p>
              </div>
              <span className="text-[0.7rem] uppercase opacity-80">{token.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
