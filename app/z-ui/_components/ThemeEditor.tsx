import { cn } from "@/lib/utils";

const colorTokens = [
  { label: "Base", className: "bg-base-200", code: "--b1" },
  { label: "Primary", className: "bg-primary text-primary-content", code: "--p" },
  { label: "Secondary", className: "bg-secondary text-secondary-content", code: "--s" },
  { label: "Accent", className: "bg-accent text-accent-content", code: "--a" },
  { label: "Neutral", className: "bg-neutral text-neutral-content", code: "--n" },
  { label: "Info", className: "bg-info text-info-content", code: "--in" },
  { label: "Success", className: "bg-success text-success-content", code: "--su" },
  { label: "Warning", className: "bg-warning text-warning-content", code: "--wa" },
  { label: "Error", className: "bg-error text-error-content", code: "--er" },
];

const fieldSizes = ["xs", "sm", "md", "lg", "xl"] as const;

export function ThemeEditor() {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Theme Editor</h2>
          <p className="text-sm text-base-content/70">Layout estático inspirado no Theme Generator da DaisyUI.</p>
        </div>
        <span className="badge badge-outline border-base-300">Preview only</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,2fr)]">
        <aside className="card border border-base-300/70 bg-base-100/95 shadow-xl">
          <div className="card-body space-y-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">Themes</p>
              <h3 className="text-lg font-semibold">Theme actions</h3>
            </div>
            <div className="menu rounded-box bg-base-200/70 p-2 text-sm">
              <button className="btn btn-ghost btn-sm justify-start">Options</button>
              <button className="btn btn-ghost btn-sm justify-start">Remove my themes</button>
              <button className="btn btn-ghost btn-sm justify-start">Reset daisyUI themes</button>
              <div className="divider my-2">Hold to add theme</div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60">My themes</p>
                <div className="rounded-lg border border-base-300/60 bg-base-100/80 p-3 text-xs text-base-content/70">
                  Nenhum tema custom ainda.
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60">daisyUI themes</p>
                <ul className="menu menu-sm rounded-box bg-base-100/80 p-2">
                  {["light", "dark", "cupcake", "bumblebee", "emerald", "corporate"].map((item) => (
                    <li key={item}>
                      <a className="capitalize">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </aside>

        <div className="card border border-base-300/70 bg-base-100/95 shadow-2xl">
          <div className="card-body space-y-6">
            <div className="space-y-3">
              <h3 className="card-title text-base">Change Colors</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {colorTokens.map((token) => (
                  <div key={token.label} className="flex items-center gap-3 rounded-xl border border-base-300/60 bg-base-200/60 p-3">
                    <div className={cn("h-10 w-10 rounded-lg border border-base-300/70", token.className)} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{token.label}</p>
                      <p className="text-[0.75rem] text-base-content/60">{token.code}</p>
                    </div>
                    <input className="input input-bordered input-sm max-w-[120px]" value={token.code} readOnly />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-2xl border border-base-300/70 bg-base-200/60 p-4">
                <h3 className="text-sm font-semibold">Radius</h3>
                {["Boxes card, modal, alert", "Fields button, input, select, tab", "Selectors checkbox, toggle, badge"].map(
                  (label, idx) => (
                    <label key={label} className="form-control gap-2">
                      <div className="label p-0">
                        <span className="label-text">{label}</span>
                        <span className="label-text-alt text-xs text-base-content/60">{idx === 0 ? "16px" : idx === 1 ? "12px" : "10px"}</span>
                      </div>
                      <input type="range" min={0} max={100} defaultValue={idx === 0 ? 60 : idx === 1 ? 50 : 40} className="range range-primary range-xs" />
                    </label>
                  )
                )}
              </div>

              <div className="space-y-3 rounded-2xl border border-base-300/70 bg-base-200/60 p-4">
                <h3 className="text-sm font-semibold">Effects</h3>
                {[{
                  title: "Depth Effect",
                  desc: "3D depth on fields & selectors",
                },
                  {
                    title: "Noise Effect",
                    desc: "Noise pattern on fields & selectors",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-base-300/60 bg-base-100/80 p-3">
                    <label className="label cursor-pointer justify-between gap-3 p-0">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-base-content/60">{item.desc}</p>
                      </div>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-3 rounded-2xl border border-base-300/70 bg-base-200/60 p-4">
                <h3 className="text-sm font-semibold">Fields button, input, select, tab</h3>
                <div className="flex flex-wrap gap-2">
                  {fieldSizes.map((size, idx) => (
                    <button key={size} className={cn("btn btn-xs", idx === 2 && "btn-primary")}>{size}</button>
                  ))}
                </div>
                <label className="form-control gap-2">
                  <div className="label p-0">
                    <span className="label-text">Fields base size</span>
                    <span className="label-text-alt text-xs text-base-content/60">Pixels</span>
                  </div>
                  <input type="range" min={0} max={100} defaultValue={55} className="range range-secondary range-xs" />
                </label>
              </div>

              <div className="space-y-3 rounded-2xl border border-base-300/70 bg-base-200/60 p-4">
                <h3 className="text-sm font-semibold">Selectors checkbox, toggle, badge</h3>
                <div className="flex flex-wrap gap-2">
                  {fieldSizes.map((size, idx) => (
                    <button key={size} className={cn("btn btn-xs", idx === 1 && "btn-secondary")}>{size}</button>
                  ))}
                </div>
                <label className="form-control gap-2">
                  <div className="label p-0">
                    <span className="label-text">Selectors base size</span>
                    <span className="label-text-alt text-xs text-base-content/60">Pixels</span>
                  </div>
                  <input type="range" min={0} max={100} defaultValue={45} className="range range-accent range-xs" />
                </label>
              </div>

              <div className="space-y-3 rounded-2xl border border-base-300/70 bg-base-200/60 p-4">
                <h3 className="text-sm font-semibold">Border Width</h3>
                <label className="form-control gap-2">
                  <div className="label p-0">
                    <span className="label-text">Border Width · All components</span>
                    <span className="label-text-alt text-xs text-base-content/60">0.5px</span>
                  </div>
                  <input type="range" min={0} max={100} defaultValue={35} className="range range-info range-xs" />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-base-300/70 bg-base-200/60 p-4 space-y-3">
              <h3 className="text-sm font-semibold">Options</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">Default theme</span>
                  </div>
                  <select className="select select-bordered select-sm">
                    <option>Z-Dark</option>
                    <option>Z-Light</option>
                    <option>dark</option>
                  </select>
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label p-0">
                    <span className="label-text">Default dark theme</span>
                  </div>
                  <select className="select select-bordered select-sm">
                    <option>Z-Dark</option>
                    <option>dark</option>
                  </select>
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="label cursor-pointer gap-2 rounded-lg border border-base-300/60 bg-base-100/80 px-3 py-2">
                  <span className="label-text">Dark color scheme</span>
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </label>
                <button className="btn btn-outline btn-sm">Remove theme</button>
              </div>
            </div>

            <div className="card border border-base-300/70 bg-base-100/90 shadow-lg">
              <div className="card-body space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="card-title text-base">Themes Editor Preview</h3>
                    <p className="text-sm text-base-content/70">Add theme to your CSS file.</p>
                  </div>
                  <button className="btn btn-ghost btn-sm">Copy to clipboard</button>
                </div>
                <p className="text-xs text-base-content/60">Add it after @plugin "daisyui";</p>
                <pre className="mockup-code text-left text-sm">
                  <code>{`"Z-Dark": {
  "base-100": "oklch(25.33% 0.016 252.42)",
  "primary": "oklch(98% 0.003 247.858)",
  "secondary": "oklch(64% 0.246 16.439)",
  "accent": "oklch(0% 0 0)"
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
