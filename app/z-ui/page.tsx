"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { BadgeCheck, CheckCircle2, Flame, LayoutGrid, Layers, MessageSquare, Palette, Wand2 } from "lucide-react";

import { ZkContainer } from "@/components/zekai-ui/ZkContainer";
import { cn } from "@/lib/utils";

const THEME_KEY = "zekai-ui-theme";

type TabKey = "demo" | "variants" | "palette" | "editor";
type ThemeKey = "Z-Dark" | "Z-Light";

type PaletteToken = {
  label: string;
  className: string;
  value: string;
};

const paletteTokens: Record<string, PaletteToken[]> = {
  base: [
    { label: "base-100", className: "bg-base-100 text-base-content", value: "oklch(25.33% 0.016 252.42)" },
    { label: "base-200", className: "bg-base-200 text-base-content", value: "oklch(23.26% 0.014 253.1)" },
    { label: "base-300", className: "bg-base-300 text-base-content", value: "oklch(21.15% 0.012 254.09)" },
    { label: "base-content", className: "bg-base-content text-base-100", value: "oklch(97.807% 0.029 256.847)" },
  ],
  brand: [
    { label: "primary", className: "bg-primary text-primary-content", value: "oklch(98% 0.003 247.858)" },
    { label: "secondary", className: "bg-secondary text-secondary-content", value: "oklch(64% 0.246 16.439)" },
    { label: "accent", className: "bg-accent text-accent-content", value: "oklch(0% 0 0)" },
    { label: "neutral", className: "bg-neutral text-neutral-content", value: "oklch(37% 0.034 259.733)" },
  ],
  states: [
    { label: "info", className: "bg-info text-info-content", value: "oklch(74% 0.16 232.661)" },
    { label: "success", className: "bg-success text-success-content", value: "oklch(76% 0.177 163.223)" },
    { label: "warning", className: "bg-warning text-warning-content", value: "oklch(85% 0.199 91.936)" },
    { label: "error", className: "bg-error text-error-content", value: "oklch(70% 0.191 22.216)" },
  ],
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
  { label: "Small", className: "btn btn-primary btn-sm" },
  { label: "Large", className: "btn btn-secondary btn-lg" },
  { label: "Block", className: "btn btn-primary btn-block" },
];

const badgeVariants = [
  "badge-primary",
  "badge-secondary",
  "badge-accent",
  "badge-info",
  "badge-success",
  "badge-warning",
  "badge-error",
];

export default function ZUiPlaygroundPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("demo");
  const [theme, setTheme] = useState<ThemeKey>("Z-Dark");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "Z-Dark" || stored === "Z-Light") {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const tabIconClasses = useMemo(() => "h-4 w-4", []);

  return (
    <main className="min-h-dvh bg-base-200 text-base-content" data-theme={theme}>
      <ZkContainer className="space-y-8 py-10">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-base-content/60">Playground</p>
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">ZEKAI UI · Theme Playground</h1>
              <p className="max-w-3xl text-sm text-base-content/70 lg:text-base">
                Página neutra para validar o visual da ZEKAI UI com DaisyUI. Alterne temas, navegue pelas abas e compare
                componentes antes de aplicar em produtos reais.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.15em] text-base-content/70">
            <span>Tema</span>
            <div className="join rounded-full border border-base-300/60 bg-base-100/80 shadow-sm">
              <button
                type="button"
                className={cn("btn btn-xs join-item", theme === "Z-Dark" && "btn-active btn-primary")}
                onClick={() => setTheme("Z-Dark")}
                aria-pressed={theme === "Z-Dark"}
              >
                Z-Dark
              </button>
              <button
                type="button"
                className={cn("btn btn-xs join-item", theme === "Z-Light" && "btn-active btn-secondary")}
                onClick={() => setTheme("Z-Light")}
                aria-pressed={theme === "Z-Light"}
              >
                Z-Light
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="tabs tabs-boxed tabs-sm bg-base-200/80">
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
              <Layers className={tabIconClasses} />
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
            <button
              className={cn("tab gap-2", activeTab === "editor" && "tab-active")}
              onClick={() => setActiveTab("editor")}
              title="Theme Editor"
            >
              <Wand2 className={tabIconClasses} />
              <span className="hidden md:inline">Theme Editor</span>
            </button>
          </div>
          <span className="text-xs text-base-content/60">Static showcase</span>
        </div>

        {activeTab === "demo" && <ComponentsDemo />}
        {activeTab === "variants" && <ComponentVariants />}
        {activeTab === "palette" && <ColorPalette />}
        {activeTab === "editor" && <ThemeEditor />}
      </ZkContainer>
    </main>
  );
}

function ComponentsDemo() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Components Demo</h2>
          <p className="text-sm text-base-content/70">Mini dashboard inspirado no Theme Generator da DaisyUI.</p>
        </div>
        <span className="badge badge-outline border-base-300">Static</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_minmax(0,1.2fr)]">
        <div className="space-y-6">
          <FilterPanel />
          <CalendarCard />
        </div>

        <div className="space-y-6">
          <OverviewCard />
          <div className="grid gap-6 md:grid-cols-2">
            <ComposerCard />
            <ChatCard />
          </div>
        </div>

        <div className="space-y-6">
          <ScoreCard />
          <OrdersCard />
          <ProductCard />
          <AlertsCard />
        </div>
      </div>
    </div>
  );
}

function FilterPanel() {
  return (
    <aside className="card border border-base-300/70 bg-base-100/95 shadow-xl">
      <div className="card-body space-y-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">Filters</p>
          <h2 className="text-lg font-semibold">Collections</h2>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer justify-between gap-3">
            <span className="label-text">In stock only</span>
            <input type="checkbox" className="toggle toggle-primary" defaultChecked />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer justify-between gap-3">
            <span className="label-text">Featured</span>
            <input type="checkbox" className="toggle toggle-secondary" />
          </label>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60">Categories</p>
          {["Hoodies", "Bags", "Shoes", "Accessories"].map((item, index) => (
            <label key={item} className="label cursor-pointer gap-2">
              <input
                type="checkbox"
                className={cn(
                  "checkbox",
                  index === 0 && "checkbox-primary",
                  index === 1 && "checkbox-secondary",
                  index === 2 && "checkbox-accent"
                )}
                defaultChecked={index < 2}
              />
              <span className="label-text">{item}</span>
            </label>
          ))}
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60">Quick actions</p>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary btn-sm">Apply</button>
            <button className="btn btn-outline btn-sm">Reset</button>
            <button className="btn btn-ghost btn-sm">Export</button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function CalendarCard() {
  const days = ["12", "13", "14", "15", "16", "17", "18"];
  return (
    <div className="card border border-base-300/70 bg-base-100/95 shadow-xl">
      <div className="card-body space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="card-title text-base">Schedule</h3>
          <span className="badge badge-outline">Week</span>
        </div>
        <div className="grid grid-cols-7 gap-2 text-sm">
          {days.map((day) => (
            <div
              key={day}
              className={cn(
                "flex h-12 flex-col items-center justify-center rounded-lg border border-base-300/70 bg-base-200/60",
                day === "15" && "border-primary/60 bg-primary/20 text-primary-content"
              )}
            >
              <span className="text-xs text-base-content/60">Dec</span>
              <span className="font-semibold">{day}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2 rounded-xl border border-base-300/70 bg-base-200/60 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">Upcoming</p>
          <p className="text-sm font-semibold">Team sync meeting</p>
          <p className="text-xs text-base-content/60">Thu, 15 Dec · 10:00 AM</p>
        </div>
      </div>
    </div>
  );
}

function OverviewCard() {
  return (
    <section className="card border border-base-300/70 bg-base-100/95 shadow-2xl">
      <div className="card-body space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="badge badge-outline border-base-300">Dashboard</div>
          <div className="tabs tabs-bordered tabs-sm">
            <a className="tab tab-active">Overview</a>
            <a className="tab">Conversions</a>
            <a className="tab">Engagement</a>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Components Demo</h2>
          <p className="text-sm text-base-content/70">
            Layout inspirado no Theme Generator da DaisyUI para validar estados, hierarquia e contraste com os temas Z-Dark/Z-Light.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="stat rounded-2xl border border-base-300/70 bg-base-200/70">
            <div className="stat-title">Sessions</div>
            <div className="stat-value">12.4k</div>
            <div className="stat-desc">+8% vs. last week</div>
          </div>
          <div className="stat rounded-2xl border border-base-300/70 bg-base-200/70">
            <div className="stat-title">Conversion</div>
            <div className="stat-value">4.2%</div>
            <div className="stat-desc">Steady · multi-device</div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card border border-base-300/60 bg-base-200/60">
            <div className="card-body space-y-3">
              <h3 className="card-title text-base">Traffic sources</h3>
              <div className="flex items-end gap-2">
                {[60, 80, 40, 55, 72, 48, 66].map((height, idx) => (
                  <div key={idx} className="flex-1 rounded-t-lg bg-primary/80" style={{ height: `${height}px` }} aria-hidden />
                ))}
              </div>
              <p className="text-xs text-base-content/60">Barras estáticas para simular gráfico de tráfego.</p>
            </div>
          </div>

          <div className="card border border-base-300/60 bg-base-200/60">
            <div className="card-body space-y-3">
              <h3 className="card-title text-base">Page score</h3>
              <div className="flex items-center gap-4">
                <div className="radial-progress text-primary" style={{ "--value": 91 } as CSSProperties}>
                  91
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">Excellent UX</p>
                  <p className="text-sm text-base-content/70">Based on mock Lighthouse signals.</p>
                </div>
              </div>
              <div className="divider my-2" />
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span>Performance</span>
                  <span className="badge badge-success badge-sm">98</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Accessibility</span>
                  <span className="badge badge-primary badge-sm">96</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Best practices</span>
                  <span className="badge badge-info badge-sm">93</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComposerCard() {
  return (
    <div className="card border border-base-300/70 bg-base-100/95 shadow-lg">
      <div className="card-body space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">Content</p>
            <h3 className="card-title text-base">Write a new post</h3>
          </div>
          <span className="badge badge-outline border-base-300">Draft</span>
        </div>
        <textarea className="textarea textarea-bordered h-28 w-full bg-base-200/70" placeholder="Share an update..." />
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button className="btn btn-ghost btn-sm">Save draft</button>
          <button className="btn btn-primary btn-sm">Publish</button>
        </div>
      </div>
    </div>
  );
}

function ChatCard() {
  return (
    <div className="card border border-base-300/70 bg-base-100/95 shadow-lg">
      <div className="card-body space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h3 className="card-title text-base">Team chat</h3>
        </div>
        <div className="space-y-3">
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content">OB</div>
            </div>
            <div className="chat-header">Obi-Wan</div>
            <div className="chat-bubble">You were the chosen one!</div>
            <div className="chat-footer text-xs">10:00</div>
          </div>
          <div className="chat chat-end">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full bg-secondary text-secondary-content">AN</div>
            </div>
            <div className="chat-header">Anakin</div>
            <div className="chat-bubble chat-bubble-secondary">I will bring balance to the Force.</div>
            <div className="chat-footer text-xs">10:02</div>
          </div>
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full bg-neutral text-neutral-content">OB</div>
            </div>
            <div className="chat-header">Obi-Wan</div>
            <div className="chat-bubble">Then you are lost...</div>
            <div className="chat-footer text-xs">10:04</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreCard() {
  return (
    <div className="card border border-base-300/70 bg-base-100/95 shadow-xl">
      <div className="card-body space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">Summary</p>
            <h3 className="card-title text-base">December revenue</h3>
          </div>
          <span className="badge badge-success">+12.4%</span>
        </div>
        <div className="text-3xl font-bold">$32,400</div>
        <p className="text-sm text-base-content/70">Mock data for visual testing.</p>
        <div className="flex items-center gap-3">
          <div className="radial-progress text-secondary" style={{ "--value": 72 } as CSSProperties}>
            72%
          </div>
          <div className="space-y-1 text-sm">
            <p>Recurring revenue momentum</p>
            <p className="text-base-content/60">Projected next month: $34,600</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersCard() {
  const orders = [
    { name: "Avery Fields", status: "Paid" },
    { name: "Morgan Lee", status: "Pending" },
    { name: "Taylor Brooks", status: "Refunded" },
    { name: "Charlie Kim", status: "Processing" },
  ];
  return (
    <div className="card border border-base-300/70 bg-base-100/95 shadow-lg">
      <div className="card-body space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="card-title text-base">Recent orders</h3>
          <button className="btn btn-ghost btn-sm">View all</button>
        </div>
        <div className="space-y-2 text-sm">
          {orders.map((order) => (
            <div key={order.name} className="flex items-center justify-between rounded-lg bg-base-200/60 px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="avatar placeholder">
                  <div className="w-8 rounded-full bg-neutral text-neutral-content">{order.name[0]}</div>
                </div>
                <span className="font-medium">{order.name}</span>
              </div>
              <span
                className={cn(
                  "badge",
                  order.status === "Paid" && "badge-success",
                  order.status === "Pending" && "badge-warning",
                  order.status === "Processing" && "badge-info",
                  order.status === "Refunded" && "badge-error"
                )}
              >
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard() {
  return (
    <div className="card border border-base-300/70 bg-base-100/95 shadow-lg">
      <div className="card-body space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            <h3 className="card-title text-base">Product spotlight</h3>
          </div>
          <span className="badge badge-secondary">SALE</span>
        </div>
        <div className="rounded-xl bg-base-200/70 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-base-content/60">Nike Shoes</p>
              <p className="text-lg font-semibold">Air Runner X</p>
            </div>
            <div className="text-right">
              <p className="text-xs line-through text-base-content/50">$220</p>
              <p className="text-xl font-bold text-primary">$180</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-base-content/70">
            <div className="flex items-center gap-1">
              <BadgeCheck className="h-4 w-4" />
              <span>Free returns</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>4.8 (1.2k)</span>
            </div>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <button className="btn btn-primary btn-sm">Add to cart</button>
          <button className="btn btn-outline btn-sm">Wishlist</button>
        </div>
      </div>
    </div>
  );
}

function AlertsCard() {
  return (
    <div className="card border border-base-300/70 bg-base-100/95 shadow-lg">
      <div className="card-body space-y-3">
        <h3 className="card-title text-base">Alerts</h3>
        <p className="text-sm text-base-content/70">Feedback de status com cores do tema.</p>
        <div className="space-y-2">
          <div className="alert alert-info text-sm">There are 9 new messages</div>
          <div className="alert alert-success text-sm">Verification process completed</div>
          <div className="alert alert-warning text-sm">Click to verify your email</div>
          <div className="alert alert-error text-sm">Access denied — contact support</div>
        </div>
      </div>
    </div>
  );
}

function ComponentVariants() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Component Variants</h2>
          <p className="text-sm text-base-content/70">Variações rápidas para comparar estados e tamanhos.</p>
        </div>
        <span className="badge badge-outline border-base-300">Variants</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <CardShell title="Buttons" description="Tamanhos e estilos padrão DaisyUI">
          <div className="flex flex-wrap gap-2">
            {buttonVariants.map((variant) => (
              <button key={variant.label} className={variant.className} disabled={variant.disabled}>
                {variant.label}
              </button>
            ))}
          </div>
        </CardShell>

        <CardShell title="Inputs & Forms" description="Combinação de campos e controles">
          <div className="space-y-3">
            <label className="form-control gap-2">
              <span className="label-text text-sm">Email</span>
              <input type="email" className="input input-bordered" placeholder="name@email.com" />
              <span className="text-xs text-base-content/60">Helper text for guidance.</span>
            </label>
            <label className="form-control gap-2">
              <span className="label-text text-sm">Select</span>
              <select className="select select-bordered">
                <option>Option A</option>
                <option>Option B</option>
                <option>Option C</option>
              </select>
            </label>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
                checkbox
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="toggle toggle-secondary" />
                toggle
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="demo" className="radio radio-accent" defaultChecked />
                radio
              </label>
            </div>
          </div>
        </CardShell>

        <CardShell title="Badges & Chips" description="Indicadores de status">
          <div className="flex flex-wrap gap-2">
            {badgeVariants.map((variant) => (
              <span key={variant} className={cn("badge", variant)}>
                {variant.replace("badge-", "")}
              </span>
            ))}
          </div>
        </CardShell>

        <CardShell title="Alerts & Feedback" description="Alertas com ícones e cores do tema">
          <div className="space-y-2 text-sm">
            <div className="alert alert-info">Informational message</div>
            <div className="alert alert-success">Process completed</div>
            <div className="alert alert-warning">Please double check</div>
            <div className="alert alert-error">Something went wrong</div>
          </div>
        </CardShell>

        <CardShell title="Tabs & Pills" description="Estados de navegação">
          <div className="space-y-3">
            <div className="tabs tabs-boxed">
              <a className="tab tab-active">Active</a>
              <a className="tab">Tab</a>
              <a className="tab">Tab</a>
            </div>
            <div className="join">
              <button className="btn btn-sm join-item">Previous</button>
              <button className="btn btn-sm join-item">Next</button>
            </div>
            <div className="breadcrumbs text-sm">
              <ul>
                <li><a>Home</a></li>
                <li><a>Library</a></li>
                <li>Data</li>
              </ul>
            </div>
          </div>
        </CardShell>
      </div>
    </div>
  );
}

function CardShell({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="card border border-base-300/70 bg-base-100/95 shadow-lg">
      <div className="card-body space-y-3">
        <div className="space-y-1">
          <h3 className="card-title text-base">{title}</h3>
          {description ? <p className="text-sm text-base-content/70">{description}</p> : null}
        </div>
        {children}
      </div>
    </div>
  );
}

function ColorPalette() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Color Palette</h2>
          <p className="text-sm text-base-content/70">Tokens principais do tema ZEKAI UI.</p>
        </div>
        <span className="badge badge-outline border-base-300">Palette</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <PaletteCard title="Base" tokens={paletteTokens.base} />
        <PaletteCard title="Brand" tokens={paletteTokens.brand} />
        <PaletteCard title="States" tokens={paletteTokens.states} />
      </div>
      <div className="alert alert-info text-sm">
        Paleta derivada dos temas oficiais Z-Dark/Z-Light. Alterne o tema no topo para validar contraste e legibilidade.
      </div>
    </div>
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

function ThemeEditor() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Theme Editor</h2>
          <p className="text-sm text-base-content/70">
            Ajuste visual estático inspirado no Theme Generator da DaisyUI. Controles não aplicam mudanças reais.
          </p>
        </div>
        <span className="badge badge-outline border-base-300">Preview</span>
      </div>

      <div className="card border border-base-300/70 bg-base-100/95 shadow-2xl">
        <div className="card-body space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-base-300/70 bg-base-200/60 p-4">
              <h3 className="text-sm font-semibold">Brand colors</h3>
              {["Primary", "Secondary", "Accent", "Neutral"].map((token) => (
                <div key={token} className="flex items-center gap-3">
                  <input type="color" className="input input-bordered h-10 w-16" defaultValue="#ffffff" aria-label={token} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{token}</p>
                    <p className="text-xs text-base-content/60">Preview only</p>
                  </div>
                  <input type="text" className="input input-bordered input-sm max-w-[140px]" defaultValue="#FFFFFF" />
                </div>
              ))}
            </div>

            <div className="space-y-4 rounded-2xl border border-base-300/70 bg-base-200/60 p-4">
              <h3 className="text-sm font-semibold">States</h3>
              {["Info", "Success", "Warning", "Error"].map((token) => (
                <div key={token} className="flex items-center gap-3">
                  <input type="color" className="input input-bordered h-10 w-16" defaultValue="#ffffff" aria-label={token} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{token}</p>
                    <p className="text-xs text-base-content/60">Static view</p>
                  </div>
                  <input type="text" className="input input-bordered input-sm max-w-[140px]" defaultValue="#FFFFFF" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-base-300/70 bg-base-200/60 p-4 space-y-3">
              <h3 className="text-sm font-semibold">Radius & Corners</h3>
              <label className="form-control gap-2">
                <div className="label p-0">
                  <span className="label-text">Border radius</span>
                  <span className="label-text-alt text-xs text-base-content/60">Md</span>
                </div>
                <input type="range" min={0} max={100} defaultValue={45} className="range range-primary range-xs" />
                <div className="flex justify-between text-[0.7rem] text-base-content/60">
                  <span>Sm</span>
                  <span>Md</span>
                  <span>Lg</span>
                  <span>Full</span>
                </div>
              </label>
            </div>

            <div className="rounded-2xl border border-base-300/70 bg-base-200/60 p-4 space-y-3">
              <h3 className="text-sm font-semibold">Density</h3>
              <label className="form-control gap-2">
                <div className="label p-0">
                  <span className="label-text">Spacing</span>
                  <span className="label-text-alt text-xs text-base-content/60">Comfort</span>
                </div>
                <input type="range" min={0} max={100} defaultValue={55} className="range range-secondary range-xs" />
                <div className="flex justify-between text-[0.7rem] text-base-content/60">
                  <span>Compact</span>
                  <span>Balanced</span>
                  <span>Relaxed</span>
                </div>
              </label>
            </div>

            <div className="rounded-2xl border border-base-300/70 bg-base-200/60 p-4 space-y-3">
              <h3 className="text-sm font-semibold">Misc</h3>
              <label className="label cursor-pointer justify-between gap-3 rounded-lg border border-base-300/60 bg-base-100/80 px-3 py-2">
                <span className="label-text">Enable subtle shadows</span>
                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
              </label>
              <label className="label cursor-pointer justify-between gap-3 rounded-lg border border-base-300/60 bg-base-100/80 px-3 py-2">
                <span className="label-text">Use softer borders</span>
                <input type="checkbox" className="toggle toggle-secondary" />
              </label>
              <label className="label cursor-pointer justify-between gap-3 rounded-lg border border-base-300/60 bg-base-100/80 px-3 py-2">
                <span className="label-text">High contrast mode</span>
                <input type="checkbox" className="toggle toggle-accent" />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button className="btn btn-primary">Apply (visual only)</button>
            <button className="btn btn-ghost">Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}
