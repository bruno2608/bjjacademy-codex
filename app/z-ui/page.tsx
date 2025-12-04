"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { LayoutGrid, Palette, SlidersHorizontal, Moon, SunMedium, MessageSquare, ShoppingBag, PanelRightDashed } from "lucide-react";

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
    { label: "base-content", className: "bg-base-content text-base-100", value: "oklch(97.807% 0.029 256.847)" }
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
  { label: "Info", className: "btn btn-info" },
  { label: "Success", className: "btn btn-success" },
  { label: "Warning", className: "btn btn-warning" },
  { label: "Error", className: "btn btn-error" },
  { label: "Ghost", className: "btn btn-ghost" },
  { label: "Outline", className: "btn btn-outline" },
  { label: "Link", className: "btn btn-link" },
  { label: "Disabled", className: "btn", disabled: true },
  { label: "Primary sm", className: "btn btn-primary btn-sm" },
  { label: "Secondary lg", className: "btn btn-secondary btn-lg" },
  { label: "Block", className: "btn btn-primary btn-block" }
];

const badges = [
  "badge",
  "badge-primary",
  "badge-secondary",
  "badge-accent",
  "badge-info",
  "badge-success",
  "badge-warning",
  "badge-error"
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
          <div className="space-y-2">
            <p className="badge badge-outline border-base-300 uppercase tracking-[0.18em]">Playground</p>
            <h1 className="text-3xl font-semibold lg:text-4xl">ZEKAI UI · Theme Playground</h1>
            <p className="max-w-3xl text-sm text-base-content/70 lg:text-base">
              Página neutra para validar o visual do ZEKAI UI com DaisyUI. Alterne temas, navegue pelas abas e compare
              componentes antes de aplicar em produtos reais.
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
            <button
              className={cn("tab gap-2", activeTab === "editor" && "tab-active")}
              onClick={() => setActiveTab("editor")}
              title="Theme Editor"
            >
              <PanelRightDashed className={tabIconClasses} />
              <span className="hidden md:inline">Theme Editor</span>
            </button>
          </div>
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
    <div className="space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Components Demo</h2>
          <p className="text-sm text-base-content/70">Layout de referência inspirado no Theme Generator da DaisyUI.</p>
        </div>
        <span className="badge badge-outline border-base-300">Static showcase</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)_320px] xl:grid-cols-[340px_minmax(0,1fr)_360px]">
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
          {[
            "Hoodies",
            "Bags",
            "Shoes",
            "Accessories",
            "Gadgets"
          ].map((item, index) => (
            <label key={item} className="label cursor-pointer gap-2">
              <input
                type="checkbox"
                className={cn("checkbox", index === 0 && "checkbox-primary", index === 1 && "checkbox-secondary", index === 2 && "checkbox-accent")}
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
            Layout inspirado no Theme Generator da DaisyUI para validar estados, hierarquia e contraste com os temas
            Z-Dark/Z-Light.
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
            <div className="stat-desc">Steady • multi-device</div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card border border-base-300/60 bg-base-200/60">
            <div className="card-body space-y-3">
              <h3 className="card-title text-base">Traffic sources</h3>
              <div className="flex items-end gap-2">
                {[60, 80, 40, 55, 72, 48, 66].map((height, idx) => (
                  <div
                    key={idx}
                    className="flex-1 rounded-t-lg bg-primary/80"
                    style={{ height: `${height}px` }}
                    aria-hidden
                  />
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
        <div className="flex flex-wrap items-center gap-2 justify-end">
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
    { name: "Charlie Kim", status: "Processing" }
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
            <ShoppingBag className="h-5 w-5" />
            <h3 className="card-title text-base">Featured product</h3>
          </div>
          <span className="badge badge-secondary">SALE</span>
        </div>
        <div className="rounded-xl bg-base-200/70 p-4">
          <div className="mb-2 flex items-center justify-between text-sm text-base-content/80">
            <span>Wireless Headphones</span>
            <div className="rating rating-xs">
              {[1, 2, 3, 4, 5].map((star) => (
                <input
                  key={star}
                  type="radio"
                  name="rating-2"
                  className="mask mask-star-2 bg-warning"
                  defaultChecked={star === 4}
                  aria-label={`Rating ${star}`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1 text-sm">
              <p className="text-base-content/60 line-through">$320</p>
              <p className="text-xl font-semibold">$249</p>
            </div>
            <button className="btn btn-primary btn-sm">Add to cart</button>
          </div>
        </div>
        <div className="space-y-1 text-sm text-base-content/70">
          <p>Noise cancellation, 32h battery life, fast pairing.</p>
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-outline">Audio</span>
            <span className="badge badge-outline">Wireless</span>
            <span className="badge badge-outline">New</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertsCard() {
  return (
    <div className="space-y-3">
      <div className="alert alert-info text-sm">
        <span>There are 9 new messages.</span>
      </div>
      <div className="alert alert-success text-sm">
        <span>Verification process completed.</span>
      </div>
      <div className="alert alert-warning text-sm">
        <span>Click to verify your email address.</span>
      </div>
      <div className="alert alert-error text-sm">
        <span>Access denied. Contact support.</span>
      </div>
    </div>
  );
}

function ComponentVariants() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Component Variants</h2>
          <p className="text-sm text-base-content/70">Estados essenciais para validar consistência do tema.</p>
        </div>
        <span className="badge badge-outline border-base-300">Tokens only</span>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card border border-base-300/70 bg-base-100/95 shadow-lg">
          <div className="card-body space-y-3">
            <h3 className="card-title text-base">Buttons</h3>
            <p className="text-sm text-base-content/70">Principais variações do DaisyUI com tamanhos e estados.</p>
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
            <p className="text-sm text-base-content/70">Bordas, estados de cor e variações de tamanho.</p>
            <div className="space-y-3">
              <input type="text" placeholder="input" className="input input-bordered w-full" />
              <input type="text" placeholder="input-primary" className="input input-bordered input-primary w-full" />
              <input type="text" placeholder="input-secondary" className="input input-bordered input-secondary w-full" />
              <div className="space-y-1">
                <input type="text" placeholder="input-error" className="input input-bordered input-error w-full" />
                <p className="text-xs text-error">Helper text em estado de erro.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <input type="text" placeholder="input-sm" className="input input-bordered input-sm" />
                <input type="text" placeholder="input-md" className="input input-bordered input-md" />
                <input type="text" placeholder="input-lg" className="input input-bordered input-lg" />
              </div>
              <select className="select select-bordered w-full">
                <option>select</option>
                <option>option A</option>
                <option>option B</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card border border-base-300/70 bg-base-100/95 shadow-lg">
          <div className="card-body space-y-3">
            <h3 className="card-title text-base">Badges</h3>
            <p className="text-sm text-base-content/70">Todas as cores principais em modo outline.</p>
            <div className="flex flex-wrap gap-2 text-sm">
              {badges.map((badge) => (
                <span key={badge} className={cn(badge, "badge-outline capitalize border-base-300/60")}> 
                  {badge.replace("badge-", "")}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="card border border-base-300/70 bg-base-100/95 shadow-lg">
          <div className="card-body space-y-3">
            <h3 className="card-title text-base">Checkbox / Radio / Toggle</h3>
            <p className="text-sm text-base-content/70">Estados de seleção e foco em diferentes cores.</p>
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

      <div className="card border border-base-300/70 bg-base-100/95 shadow-lg">
        <div className="card-body space-y-3">
          <h3 className="card-title text-base">Alerts</h3>
          <p className="text-sm text-base-content/70">Feedback de status com cores do tema.</p>
          <div className="space-y-2">
            <div className="alert alert-info text-sm">Info alert — neutral guidance.</div>
            <div className="alert alert-success text-sm">Success alert — operation completed.</div>
            <div className="alert alert-warning text-sm">Warning alert — please double check.</div>
            <div className="alert alert-error text-sm">Error alert — something went wrong.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorPalette() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Color Palette</h2>
          <p className="text-sm text-base-content/70">Cores principais do ZEKAI UI derivadas de Z-Dark/Z-Light.</p>
        </div>
        <span className="badge badge-outline border-base-300">Tokens</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <PaletteCard title="Base" tokens={paletteTokens.base} />
        <PaletteCard title="Brand" tokens={paletteTokens.brand} />
        <PaletteCard title="States" tokens={paletteTokens.states} />
      </div>
      <div className="alert alert-info text-sm">
        <span>
          Paleta derivada dos temas oficiais Z-Dark/Z-Light. Alterne o tema no topo para validar contraste e legibilidade.
        </span>
      </div>
    </div>
  );
}

function ThemeEditor() {
  return (
    <div className="space-y-6">
      <div className="card border border-base-300/70 bg-base-100/95 shadow-2xl">
        <div className="card-body space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="card-title text-base">Theme Editor</h2>
              <p className="text-sm text-base-content/70">
                Visual prévio inspirado no DaisyUI Theme Generator. Controles são estáticos para validar spacing, estados e foco
                do ZEKAI UI.
              </p>
            </div>
            <span className="badge badge-outline border-base-300">Preview only</span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-base-300/70 bg-base-200/60 p-4">
              <h3 className="text-sm font-semibold">Tokens visuais</h3>
              <label className="form-control gap-2">
                <div className="label p-0">
                  <span className="label-text">Radius</span>
                  <span className="label-text-alt text-xs text-base-content/60">0.25rem</span>
                </div>
                <input type="range" min={0} max={100} defaultValue={40} className="range range-primary range-xs" />
              </label>
              <label className="form-control gap-2">
                <div className="label p-0">
                  <span className="label-text">Shadow depth</span>
                  <span className="label-text-alt text-xs text-base-content/60">medium</span>
                </div>
                <input type="range" min={0} max={100} defaultValue={55} className="range range-secondary range-xs" />
              </label>
              <label className="form-control gap-2">
                <div className="label p-0">
                  <span className="label-text">Border width</span>
                  <span className="label-text-alt text-xs text-base-content/60">0.5px</span>
                </div>
                <input type="range" min={0} max={100} defaultValue={20} className="range range-accent range-xs" />
              </label>
            </div>

            <div className="space-y-4 rounded-2xl border border-base-300/70 bg-base-200/60 p-4">
              <h3 className="text-sm font-semibold">Estado do tema</h3>
              <div className="flex flex-wrap items-center gap-3">
                <label className="label cursor-pointer gap-3 rounded-lg border border-base-300/60 bg-base-100/80 px-3 py-2">
                  <span className="label-text">Ativar modo dark (Z-Dark)</span>
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </label>
                <label className="label cursor-pointer gap-3 rounded-lg border border-base-300/60 bg-base-100/80 px-3 py-2">
                  <span className="label-text">Ativar modo light (Z-Light)</span>
                  <input type="checkbox" className="toggle toggle-secondary" />
                </label>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {["Primary", "Accent", "Neutral", "Info"].map((token) => (
                  <label key={token} className="form-control gap-2">
                    <div className="label p-0">
                      <span className="label-text">{token} color</span>
                      <span className="label-text-alt text-xs text-base-content/60">preview only</span>
                    </div>
                    <input type="color" className="input input-bordered h-10" defaultValue="#ffffff" aria-label={`${token} color`} />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="card border border-base-300/70 bg-base-100/95 shadow-lg">
              <div className="card-body space-y-3">
                <h4 className="card-title text-sm">Preview · Buttons</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-primary btn-sm">Primary</button>
                  <button className="btn btn-secondary btn-sm">Secondary</button>
                  <button className="btn btn-accent btn-sm">Accent</button>
                  <button className="btn btn-outline btn-sm">Outline</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-success btn-xs">Success</button>
                  <button className="btn btn-warning btn-xs">Warn</button>
                  <button className="btn btn-error btn-xs">Error</button>
                </div>
              </div>
            </div>

            <div className="card border border-base-300/70 bg-base-100/95 shadow-lg">
              <div className="card-body space-y-3">
                <h4 className="card-title text-sm">Preview · Form controls</h4>
                <label className="form-control gap-2">
                  <span className="label-text text-sm">Label</span>
                  <input type="text" className="input input-bordered input-sm" placeholder="Text input" />
                </label>
                <label className="form-control gap-2">
                  <span className="label-text text-sm">Select</span>
                  <select className="select select-bordered select-sm">
                    <option>Option A</option>
                    <option>Option B</option>
                    <option>Option C</option>
                  </select>
                </label>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" defaultChecked />
                    primary
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="checkbox checkbox-accent checkbox-sm" />
                    accent
                  </label>
                </div>
              </div>
            </div>

            <div className="card border border-base-300/70 bg-base-100/95 shadow-lg">
              <div className="card-body space-y-3">
                <h4 className="card-title text-sm">Preview · Alerts</h4>
                <div className="space-y-2 text-sm">
                  <div className="alert alert-info">Info tone sample</div>
                  <div className="alert alert-success">Success tone sample</div>
                  <div className="alert alert-warning">Warning tone sample</div>
                  <div className="alert alert-error">Error tone sample</div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
