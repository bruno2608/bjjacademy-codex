import { ZAlert } from "./ZAlert";
import { cn } from "@/lib/utils";

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

export function ComponentVariants() {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Component Variants</h2>
          <p className="text-sm text-base-content/70">Variações de componentes DaisyUI usando o tema ZEKAI.</p>
        </div>
        <span className="badge badge-outline border-base-300">Catalog</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="card border border-base-300/70 bg-base-200 shadow-lg">
          <div className="card-body space-y-3">
            <h3 className="card-title text-base">Buttons</h3>
            <div className="flex flex-wrap gap-2">
              {buttonVariants.map((btn) => (
                <button key={btn.label} className={btn.className} disabled={btn.disabled}>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card border border-base-300/70 bg-base-200 shadow-lg">
          <div className="card-body space-y-3">
            <h3 className="card-title text-base">Inputs & Forms</h3>
            <label className="form-control w-full">
              <div className="label p-0">
                <span className="label-text">Email</span>
                <span className="label-text-alt">Helper text</span>
              </div>
              <input className="input input-bordered" placeholder="demo@example.com" />
            </label>
            <select className="select select-bordered w-full">
              <option>Choose option</option>
              <option>Option A</option>
            </select>
            <label className="label cursor-pointer gap-2">
              <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" defaultChecked />
              <span className="label-text">Checkbox primary</span>
            </label>
            <label className="label cursor-pointer gap-2">
              <input type="checkbox" className="toggle toggle-secondary" defaultChecked />
              <span className="label-text">Toggle secondary</span>
            </label>
          </div>
        </div>

        <div className="card border border-base-300/70 bg-base-200 shadow-lg">
          <div className="card-body space-y-3">
            <h3 className="card-title text-base">Badges & Chips</h3>
            <div className="flex flex-wrap gap-2">
              {badgeVariants.map((badge) => (
                <span key={badge} className={cn("badge", badge)}>
                  {badge.replace("badge-", "")}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="card border border-base-300/70 bg-base-200 shadow-lg">
          <div className="card-body space-y-3">
            <h3 className="card-title text-base">Alerts & Feedback</h3>
            <div className="space-y-2 text-sm">
              <ZAlert variant="info">Info message</ZAlert>
              <ZAlert variant="success">Success state</ZAlert>
              <ZAlert variant="warning">Warning notice</ZAlert>
              <ZAlert variant="error">Error message</ZAlert>
            </div>
          </div>
        </div>

        <div className="card border border-base-300/70 bg-base-200 shadow-lg">
          <div className="card-body space-y-3">
            <h3 className="card-title text-base">Tabs & Navigation</h3>
            <div className="tabs tabs-bordered">
              <a className="tab tab-active">Overview</a>
              <a className="tab">Details</a>
              <a className="tab">Settings</a>
            </div>
            <div className="breadcrumbs text-sm">
              <ul>
                <li>Home</li>
                <li>UI</li>
                <li>Tabs</li>
              </ul>
            </div>
            <div className="join">
              <button className="btn join-item">Prev</button>
              <button className="btn join-item">1</button>
              <button className="btn join-item">Next</button>
            </div>
          </div>
        </div>

        <div className="card border border-base-300/70 bg-base-200 shadow-lg">
          <div className="card-body space-y-3">
            <h3 className="card-title text-base">Cards & Stats</h3>
            <div className="card border border-base-300/60 bg-base-200/60">
              <div className="card-body p-4">
                <h4 className="text-sm font-semibold">Mini card</h4>
                <p className="text-xs text-base-content/70">Card dentro de card para hierarquia.</p>
              </div>
            </div>
            <div className="stat rounded-2xl border border-base-300/70 bg-base-200/70">
              <div className="stat-title">Conversion</div>
              <div className="stat-value">4.2%</div>
              <div className="stat-desc">Steady</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
