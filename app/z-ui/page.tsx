"use client";

import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, Palette, SlidersHorizontal, Moon, SunMedium } from "lucide-react";

import { ZkContainer } from "@/components/zekai-ui/ZkContainer";
import { cn } from "@/lib/utils";

const paletteTokens = {
  base: [
    { label: "base-100", className: "bg-base-100 text-base-content", value: "oklch(25.33% 0.016 252.42)" },
    { label: "base-200", className: "bg-base-200 text-base-content", value: "oklch(23.26% 0.014 253.1)" },
    { label: "base-300", className: "bg-base-300 text-base-content", value: "oklch(21.15% 0.012 254.09)" }
  ],
  brand: [
    { label: "primary", className: "bg-primary text-primary-content", value: "oklch(98% 0.003 247.858)" },
    { label: "secondary", className: "bg-secondary text-secondary-content", value: "oklch(64% 0.246 16.439)" },
    { label: "accent", className: "bg-accent text-accent-content", value: "oklch(0% 0 0)" },
    { label: "neutral", className: "bg-neutral text-neutral-content", value: "oklch(37% 0.034 259.733)" }
  ],
  states: [
    { label: "info", className: "bg-info text-info-content", value: "oklch(74% 0.16 232.661)" },
    { label: "success", className: "bg-success text-success-content", value: "oklch(76% 0.177 163.223)" },
    { label: "warning", className: "bg-warning text-warning-content", value: "oklch(85% 0.199 91.936)" },
    { label: "error", className: "bg-error text-error-content", value: "oklch(70% 0.191 22.216)" }
  ]
};

const buttonVariants = [
  { label: "Default", className: "btn" },
  { label: "Primary", className: "btn btn-primary" },
  { label: "Secondary", className: "btn btn-secondary" },
  { label: "Accent", className: "btn btn-accent" },
  { label: "Ghost", className: "btn btn-ghost" },
  { label: "Outline", className: "btn btn-outline" },
  { label: "Link", className: "btn btn-link" },
  { label: "Disabled", className: "btn", disabled: true },
  { label: "Primary sm", className: "btn btn-primary btn-sm" },
  { label: "Secondary lg", className: "btn btn-secondary btn-lg" },
  { label: "Block", className: "btn btn-primary btn-block" }
];

const badges = [
  "badge", "badge-primary", "badge-secondary", "badge-accent", "badge-info", "badge-success", "badge-warning", "badge-error"
];

export default function ZUiPlaygroundPage() {
  const [activeTab, setActiveTab] = useState<"demo" | "variants" | "palette">("demo");
  const [theme, setTheme] = useState<"Z-Dark" | "Z-Light">("Z-Dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const tabIconClasses = useMemo(() => "h-4 w-4", []);

  return (
    <main className="min-h-screen bg-base-100 text-base-content" data-theme={theme}>
      <ZkContainer className="space-y-8 py-10">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="badge badge-outline border-base-300 uppercase tracking-[0.18em]">Playground interno</p>
            <h1 className="text-3xl font-semibold lg:text-4xl">ZEKAI UI · Theme Playground</h1>
            <p className="max-w-3xl text-sm text-base-content/70 lg:text-base">
              Página interna para validar rapidamente o ZEKAI UI (Z-Dark / Z-Light) com os componentes DaisyUI. Use para checar
              contrastes, espaçamentos e tokens antes de levar ajustes para telas reais.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-base-content/70">
              <span>Tema</span>
              <div className="join">
                <button
                  type="button"
                  className={cn("btn btn-xs join-item", theme === "Z-Dark" && "btn-active btn-primary")}
                  onClick={() => setTheme("Z-Dark")}
                  aria-pressed={theme === "Z-Dark"}
                >
                  <Moon className="h-4 w-4" />
                  <span className="hidden md:inline">Z-Dark</span>
                </button>
                <button
                  type="button"
                  className={cn("btn btn-xs join-item", theme === "Z-Light" && "btn-active btn-secondary")}
                  onClick={() => setTheme("Z-Light")}
                  aria-pressed={theme === "Z-Light"}
                >
                  <SunMedium className="h-4 w-4" />
                  <span className="hidden md:inline">Z-Light</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-3">
          <div className="tabs tabs-boxed tabs-sm bg-base-200">
            <button
              className={cn("tab gap-2", activeTab === "demo" && "tab-active")}
              onClick={() => setActiveTab("demo")}
              title="Components Demo"
            >
              <LayoutGrid className={tabIconClasses} />
              <span className="hidden md:inline">Components Demo</span>
            </button>
            <button
              className={cn("tab gap-2", activeTab === "variants" && "tab-active")}
              onClick={() => setActiveTab("variants")}
              title="Component Variants"
            >
              <SlidersHorizontal className={tabIconClasses} />
              <span className="hidden md:inline">Component Variants</span>
            </button>
            <button
              className={cn("tab gap-2", activeTab === "palette" && "tab-active")}
              onClick={() => setActiveTab("palette")}
              title="Color Palette"
            >
              <Palette className={tabIconClasses} />
              <span className="hidden md:inline">Color Palette</span>
            </button>
          </div>
        </div>

        {activeTab === "demo" && <ComponentsDemo />}        
        {activeTab === "variants" && <ComponentVariants />}        
        {activeTab === "palette" && <ColorPalette />}      
      </ZkContainer>
    </main>
  );
}

function ComponentsDemo() {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_320px] xl:grid-cols-[320px_minmax(0,1fr)_360px]">
      <aside className="card border border-base-300/70 bg-base-100/95 shadow-xl">
        <div className="card-body space-y-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">Filtros rápidos</p>
            <h2 className="text-lg font-semibold">Visão geral</h2>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-between gap-3">
              <span className="label-text">Somente alunos ativos</span>
              <input type="checkbox" className="toggle toggle-primary" defaultChecked />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-between gap-3">
              <span className="label-text">Destacar presenças</span>
              <input type="checkbox" className="toggle toggle-secondary" />
            </label>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60">Modalidades</p>
            <label className="label cursor-pointer gap-2">
              <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
              <span className="label-text">Jiu-Jitsu</span>
            </label>
            <label className="label cursor-pointer gap-2">
              <input type="checkbox" className="checkbox checkbox-secondary" defaultChecked />
              <span className="label-text">No-Gi</span>
            </label>
            <label className="label cursor-pointer gap-2">
              <input type="checkbox" className="checkbox checkbox-accent" />
              <span className="label-text">MMA</span>
            </label>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60">Ações</p>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-primary btn-sm">Atualizar</button>
              <button className="btn btn-outline btn-sm">Exportar</button>
              <button className="btn btn-ghost btn-sm">Limpar</button>
            </div>
          </div>
        </div>
      </aside>

      <section className="card border border-base-300/70 bg-base-100/95 shadow-2xl">
        <div className="card-body space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="badge badge-outline border-base-300">Dashboard</div>
            <div className="tabs tabs-bordered tabs-sm">
              <a className="tab tab-active">Presenças</a>
              <a className="tab">Turmas</a>
              <a className="tab">Financeiro</a>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Resumo de presenças no mês</h2>
            <p className="text-sm text-base-content/70">
              Acompanhe check-ins, evolução das turmas e engajamento semanal com a paleta do ZEKAI UI aplicada.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="stat rounded-2xl border border-base-300/70 bg-base-200/70">
              <div className="stat-title">Check-ins no período</div>
              <div className="stat-value">482</div>
              <div className="stat-desc">+12% vs. mês anterior</div>
            </div>
            <div className="stat rounded-2xl border border-base-300/70 bg-base-200/70">
              <div className="stat-title">Alunos ativos</div>
              <div className="stat-value">126</div>
              <div className="stat-desc">80% com presença semanal</div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="card border border-base-300/60 bg-base-200/60">
              <div className="card-body space-y-3">
                <h3 className="card-title text-base">Turmas de destaque</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-base-100/80 px-3 py-2">
                    <span className="font-medium">Fundamentos</span>
                    <span className="badge badge-success">Lotada</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-base-100/80 px-3 py-2">
                    <span className="font-medium">No-Gi Intermediário</span>
                    <span className="badge badge-warning">3 vagas</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-base-100/80 px-3 py-2">
                    <span className="font-medium">Avançado</span>
                    <span className="badge badge-info">Aberta</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-secondary btn-sm">Nova turma</button>
                  <button className="btn btn-outline btn-sm">Ver calendário</button>
                </div>
              </div>
            </div>

            <div className="card border border-base-300/60 bg-base-200/60">
              <div className="card-body space-y-3">
                <h3 className="card-title text-base">Equipe técnica</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3 rounded-lg bg-base-100/80 px-3 py-2">
                    <div className="avatar placeholder">
                      <div className="w-10 rounded-full bg-secondary text-secondary-content">RJ</div>
                    </div>
                    <div>
                      <p className="font-medium">Renato J.</p>
                      <p className="text-xs text-base-content/60">Faixa preta · Head Coach</p>
                    </div>
                    <span className="badge badge-primary ml-auto">Em aula</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-base-100/80 px-3 py-2">
                    <div className="avatar placeholder">
                      <div className="w-10 rounded-full bg-primary text-primary-content">AM</div>
                    </div>
                    <div>
                      <p className="font-medium">Ana M.</p>
                      <p className="text-xs text-base-content/60">Faixa marrom · Instrutora</p>
                    </div>
                    <span className="badge badge-success ml-auto">Disponível</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-base-100/80 px-3 py-2">
                    <div className="avatar placeholder">
                      <div className="w-10 rounded-full bg-neutral text-neutral-content">LP</div>
                    </div>
                    <div>
                      <p className="font-medium">Lucas P.</p>
                      <p className="text-xs text-base-content/60">Faixa roxa · Assistente</p>
                    </div>
                    <span className="badge badge-warning ml-auto">Treino</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-info text-sm">
            <div>
              <span className="font-semibold">Observação:</span> Toda a UI acima usa apenas tokens DaisyUI do tema ativo (Z-Dark ou Z-Light). Use este bloco para validar contraste e hierarquia.
            </div>
          </div>
        </div>
      </section>

      <section className="card border border-base-300/70 bg-base-100/95 shadow-xl">
        <div className="card-body space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">Resumo rápido</p>
              <h2 className="text-lg font-semibold">KPIs gerais</h2>
            </div>
            <button className="btn btn-ghost btn-sm">Ver detalhes</button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-base-300/60 bg-base-200/60 px-3 py-2">
              <div>
                <p className="text-sm font-semibold">Check-ins hoje</p>
                <p className="text-xs text-base-content/60">Inclui presença em aulas experimentais</p>
              </div>
              <span className="text-lg font-bold">42</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-base-300/60 bg-base-200/60 px-3 py-2">
              <div>
                <p className="text-sm font-semibold">Novos cadastros</p>
                <p className="text-xs text-base-content/60">Últimas 24h</p>
              </div>
              <span className="text-lg font-bold">7</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-base-300/60 bg-base-200/60 px-3 py-2">
              <div>
                <p className="text-sm font-semibold">Planos a vencer</p>
                <p className="text-xs text-base-content/60">Próximos 7 dias</p>
              </div>
              <span className="text-lg font-bold">14</span>
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="alert alert-success text-xs">
              <span>✅ Taxa de presença acima do esperado esta semana.</span>
            </div>
            <div className="alert alert-warning text-xs">
              <span>⚠️ Lembrete: renovar planos dos alunos com recorrência manual.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ComponentVariants() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card border border-base-300/70 bg-base-100/95 shadow-lg">
          <div className="card-body space-y-3">
            <h3 className="card-title text-base">Buttons</h3>
            <div className="flex flex-wrap gap-2">
              {buttonVariants.map((button) => (
                <button key={button.label} className={button.className} disabled={button.disabled}>
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card border border-base-300/70 bg-base-100/95 shadow-lg">
          <div className="card-body space-y-3">
            <h3 className="card-title text-base">Inputs</h3>
            <div className="space-y-3">
              <input type="text" placeholder="input" className="input input-bordered w-full" />
              <input type="text" placeholder="input-primary" className="input input-bordered input-primary w-full" />
              <input type="text" placeholder="input-secondary" className="input input-bordered input-secondary w-full" />
              <div className="space-y-1">
                <input type="text" placeholder="input-error" className="input input-bordered input-error w-full" />
                <p className="text-xs text-error">Texto de erro em input-error</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <input type="text" placeholder="input-sm" className="input input-bordered input-sm" />
                <input type="text" placeholder="input-md" className="input input-bordered input-md" />
                <input type="text" placeholder="input-lg" className="input input-bordered input-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card border border-base-300/70 bg-base-100/95 shadow-lg">
            <div className="card-body space-y-3">
              <h3 className="card-title text-base">Badges</h3>
              <div className="flex flex-wrap gap-2 text-sm">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className={cn(badge, "badge-outline capitalize border-base-300/60")}
                  >
                    {badge.replace("badge-", "")}
                  </span>
                ))}
              </div>
            </div>
          </div>

        <div className="card border border-base-300/70 bg-base-100/95 shadow-lg">
          <div className="card-body space-y-3">
            <h3 className="card-title text-base">Checkbox / Radio / Toggle</h3>
            <div className="space-y-2 text-sm">
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
                  primary
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="checkbox checkbox-secondary" />
                  secondary
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="checkbox checkbox-accent" />
                  accent
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2">
                  <input type="radio" name="variant-radio" className="radio radio-primary" defaultChecked />
                  primary
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="variant-radio" className="radio radio-secondary" />
                  secondary
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="variant-radio" className="radio radio-accent" />
                  accent
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                  primary
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="toggle toggle-secondary" />
                  secondary
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="toggle toggle-accent" />
                  accent
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorPalette() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <PaletteCard title="Base" tokens={paletteTokens.base} />
        <PaletteCard title="Brand" tokens={paletteTokens.brand} />
        <PaletteCard title="States" tokens={paletteTokens.states} />
      </div>
      <div className="alert alert-info text-sm">
        <span>
          Esta paleta reflete os valores OKLCH oficiais do tema ativo (Z-Dark ou Z-Light). Alterne o tema no topo para validar contraste.
        </span>
      </div>
    </div>
  );
}

function PaletteCard({ title, tokens }: { title: string; tokens: { label: string; className: string; value: string }[] }) {
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
