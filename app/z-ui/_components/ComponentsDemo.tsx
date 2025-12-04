import type { CSSProperties } from "react";
import { Check, ChevronLeft, ChevronRight, Menu, Mic, Phone, Play, Settings, Volume2 } from "lucide-react";

import { cn } from "@/lib/utils";

const categories = [
  { label: "Hoodies", count: 25, tone: "neutral" as const },
  { label: "Bags", count: 3, tone: "neutral" as const },
  { label: "Shoes", count: 0, tone: "warning" as const },
  { label: "Accessories", count: 4, tone: "neutral" as const },
];

const calendarDays = [
  { day: "12", label: "M" },
  { day: "13", label: "T" },
  { day: "14", label: "W", active: true },
  { day: "15", label: "T" },
  { day: "16", label: "F" },
  { day: "17", label: "S" },
  { day: "18", label: "S" },
];

const orders = [
  { name: "Charlie Chapman", status: "Send", tone: "info" as const },
  { name: "Howard Hudson", status: "Failed", tone: "error" as const },
  { name: "Fiona Fisher", status: "In progress", tone: "warning" as const },
  { name: "Nick Nelson", status: "Completed", tone: "success" as const },
  { name: "Amanda Anderson", status: "Completed", tone: "success" as const },
];

const books = [
  "Harry Potter and Sorcerer's Stack",
  "Harry Potter and Chamber of Servers",
  "Harry Potter and Prisoner of Azure",
  "Harry Potter and Goblet of Firebase",
  "Harry Potter and Elixir of Phoenix",
  "Harry Potter and Half-Deployed App",
  "Harry Potter and Deathly Frameworks",
];

export function ComponentsDemo() {
  return (
    <section className="mt-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        <div className="flex flex-col gap-6">
          <PreviewCard />
          <CalendarCard />
          <SimpleTabsCard />
          <PriceRangeCard />
          <NikeShoesCard />
          <SearchFindCard />
          <CreateAccountCard />
        </div>

        <div className="flex flex-col gap-6">
          <SalesVolumeCard />
          <PageScoreCard />
          <RecentOrdersCard />
          <DecemberRevenueCard />
          <WritePostCard />
          <ChatCard />
          <AdminPanelCard />
        </div>

        <div className="flex flex-col gap-6">
          <AudioCard />
          <TerminalCard />
          <NotificationsBlock />
          <HarryPotterTimeline />
          <StarterPlanCard />
        </div>
      </div>
    </section>
  );
}

function DemoCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("card rounded-2xl border border-base-300/40 bg-base-200/80 shadow-sm", className)}>
      <div className="card-body gap-4 p-4 sm:p-5">{children}</div>
    </div>
  );
}

function PreviewCard() {
  return (
    <DemoCard>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold">Preview more</h3>
        <button className="btn btn-link btn-xs px-0">more</button>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="badge badge-neutral">Shoes</span>
        <span className="badge badge-neutral">Bags</span>
      </div>

      <div className="space-y-2 text-sm">
        {categories.map((category) => (
          <label
            key={category.label}
            className="flex items-center justify-between gap-3 rounded-lg bg-base-200/80 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <input type="checkbox" className="checkbox checkbox-xs" defaultChecked={category.label === "Hoodies"} />
              <span>{category.label}</span>
            </div>
            <span
              className={cn(
                "badge badge-sm",
                category.tone === "warning" ? "badge-warning" : "badge-outline border-base-300"
              )}
            >
              {category.count}
            </span>
          </label>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs">
        {calendarDays.map((item) => (
          <div
            key={`${item.day}-${item.label}`}
            className={cn(
              "flex h-12 flex-col items-center justify-center rounded-lg border border-base-300/70 bg-base-200/70",
              item.active && "border-primary/80 bg-primary/20 text-primary"
            )}
          >
            <span className="text-[0.7rem] text-base-content/60">{item.label}</span>
            <span className="font-semibold">{item.day}</span>
          </div>
        ))}
      </div>

      <label className="label cursor-pointer justify-start gap-2 p-0 text-xs text-base-content/70">
        <input type="checkbox" className="toggle toggle-sm toggle-primary" defaultChecked />
        <span>Show all day events</span>
      </label>

      <div className="space-y-1 rounded-xl border border-base-300/70 bg-base-100/80 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold">Team Sync Meeting</p>
            <p className="text-xs text-base-content/60">Weekly product review with design and development teams</p>
          </div>
          <span className="badge badge-neutral badge-sm">1h</span>
        </div>
      </div>

      <div className="tabs tabs-bordered text-sm">
        <a className="tab">Tab 1</a>
        <a className="tab tab-active">Tab 2</a>
        <a className="tab">Tab 3</a>
      </div>
      <p className="text-sm text-base-content/80">Tab content 2</p>
    </DemoCard>
  );
}

function CalendarCard() {
  return (
    <DemoCard>
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <button className="btn btn-xs btn-ghost">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="join">
          {calendarDays.map((item) => (
            <button
              key={`${item.day}-${item.label}-mini`}
              className={cn("btn btn-xs join-item", item.active && "btn-primary")}
              type="button"
            >
              {item.day} {item.label}
            </button>
          ))}
        </div>
        <button className="btn btn-xs btn-ghost">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <input type="text" className="input input-bordered w-full" placeholder="Search for events" />

      <label className="label cursor-pointer justify-start gap-2 p-0 text-sm">
        <input type="checkbox" className="toggle toggle-primary" defaultChecked />
        <span className="label-text">Show all day events</span>
      </label>

      <div className="rounded-xl border border-base-300/70 bg-base-100/80 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold">Team Sync Meeting</p>
            <p className="text-xs text-base-content/60">Weekly product review with design and development teams</p>
          </div>
          <span className="badge badge-outline badge-sm">1h</span>
        </div>
      </div>
    </DemoCard>
  );
}

function SimpleTabsCard() {
  return (
    <DemoCard>
      <div className="tabs tabs-bordered">
        <a className="tab">Tab 1</a>
        <a className="tab tab-active">Tab 2</a>
        <a className="tab">Tab 3</a>
      </div>
      <p className="text-sm text-base-content/80">Tab content 2</p>
    </DemoCard>
  );
}

function PriceRangeCard() {
  return (
    <DemoCard>
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="badge badge-ghost">$</span>
        <span>Price range</span>
      </div>
      <div className="text-center text-4xl font-semibold">50</div>
      <input type="range" min={0} max={200} defaultValue={50} className="range range-primary w-full" />
      <div className="flex justify-between text-xs text-base-content/60">
        <span>0</span>
        <span>200</span>
      </div>
    </DemoCard>
  );
}

function NikeShoesCard() {
  return (
    <DemoCard>
      <div className="rounded-xl bg-gradient-to-tr from-primary/30 via-base-200 to-secondary/30 p-6">
        <div className="aspect-[4/3] w-full rounded-lg bg-base-100/60" />
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Nike Shoes SALE</h3>
        <span className="badge badge-accent">SALE</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-base-content/70">
        <div className="rating rating-sm">
          {Array.from({ length: 5 }).map((_, idx) => (
            <input
              key={idx}
              type="radio"
              name="rating-shoes"
              className="mask mask-star-2 bg-warning"
              defaultChecked={idx < 4}
              aria-label={`rating ${idx + 1}`}
            />
          ))}
        </div>
        <span>420 reviews</span>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-xl font-semibold">$120</span>
        <span className="text-sm text-base-content/60 line-through">$150</span>
      </div>
      <button className="btn btn-primary w-full">Find</button>
    </DemoCard>
  );
}

function SearchFindCard() {
  return (
    <DemoCard>
      <div className="flex items-center gap-2">
        <input type="text" className="input input-bordered w-full" placeholder="Search" />
        <button className="btn btn-neutral">Find</button>
      </div>
    </DemoCard>
  );
}

function CreateAccountCard() {
  return (
    <DemoCard>
      <h3 className="text-base font-semibold">Create new account</h3>
      <p className="text-sm text-base-content/70">Registration is free and only takes a minute.</p>
      <label className="form-control w-full">
        <div className="label p-0">
          <span className="label-text">Email</span>
        </div>
        <input className="input input-bordered" placeholder="name@email.com" />
      </label>
      <label className="form-control w-full">
        <div className="label p-0">
          <span className="label-text">Password</span>
        </div>
        <input type="password" className="input input-bordered" />
        <span className="label-text-alt text-xs text-error">Password must be 8+ characters.</span>
      </label>
      <label className="label cursor-pointer justify-start gap-2 p-0 text-sm">
        <input type="checkbox" className="toggle toggle-sm" defaultChecked />
        <span className="label-text">Accept terms without reading</span>
      </label>
      <label className="label cursor-pointer justify-start gap-2 p-0 text-sm">
        <input type="checkbox" className="toggle toggle-sm" />
        <span className="label-text">Subscribe to spam emails</span>
      </label>
      <button className="btn btn-primary w-full">Register</button>
      <button className="btn btn-link btn-sm px-0">Or login</button>
    </DemoCard>
  );
}

function SalesVolumeCard() {
  const bars = [60, 32, 72, 96, 54, 68, 82, 70];
  return (
    <DemoCard>
      <div className="space-y-4">
        <div className="flex h-24 items-end gap-1">
          {bars.map((height, idx) => (
            <div key={idx} className="flex-1 rounded-t-lg bg-primary/80" style={{ height }} />
          ))}
        </div>
        <p className="text-sm text-base-content/80">
          Sales volume reached $12,450 this week, showing a 15% increase from the previous period.
        </p>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm flex-1">Charts</button>
          <button className="btn btn-neutral btn-sm flex-1">Details</button>
        </div>
      </div>
    </DemoCard>
  );
}

function PageScoreCard() {
  return (
    <DemoCard>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">Page Score</p>
          <div className="text-3xl font-semibold">91/100</div>
          <span className="badge badge-success">All good</span>
        </div>
        <div
          className="radial-progress text-primary"
          style={{ "--value": 91, "--size": "5.5rem", "--thickness": "8px" } as CSSProperties}
        >
          91%
        </div>
      </div>
    </DemoCard>
  );
}

function RecentOrdersCard() {
  return (
    <DemoCard>
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="badge badge-ghost">≡</span>
        <span>Recent orders</span>
      </div>
      <div className="space-y-2 text-sm">
        {orders.map((order) => (
          <div key={order.name} className="flex items-center justify-between rounded-lg bg-base-200/70 px-3 py-2">
            <span>{order.name}</span>
            <span
              className={cn(
                "badge",
                order.tone === "info" && "badge-info",
                order.tone === "error" && "badge-error",
                order.tone === "warning" && "badge-warning",
                order.tone === "success" && "badge-success"
              )}
            >
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </DemoCard>
  );
}

function DecemberRevenueCard() {
  return (
    <DemoCard>
      <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">Summary</p>
      <h3 className="text-base font-semibold">December Revenue</h3>
      <div className="text-3xl font-bold">$32,400</div>
      <p className="text-sm text-base-content/70">21% more than last month.</p>
    </DemoCard>
  );
}

function WritePostCard() {
  return (
    <DemoCard>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="badge badge-ghost">✏️</span>
          <span>Write a new post</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <button className="btn btn-ghost btn-xs">B</button>
          <button className="btn btn-ghost btn-xs">I</button>
          <button className="btn btn-ghost btn-xs">U</button>
          <button className="btn btn-ghost btn-xs">Add files</button>
        </div>
      </div>
      <textarea className="textarea textarea-bordered w-full min-h-[120px]" placeholder="What's happening?" />
      <div className="flex items-center justify-between text-xs text-base-content/70">
        <span>1200 characters remaining</span>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm">Draft</button>
          <button className="btn btn-primary btn-sm">Publish</button>
        </div>
      </div>
    </DemoCard>
  );
}

function ChatCard() {
  return (
    <DemoCard>
      <div className="space-y-3">
        <div className="chat chat-start">
          <div className="chat-header">Obi-Wan Kenobi</div>
          <div className="chat-bubble">It's over Anakin</div>
          <div className="chat-footer text-xs">12:45</div>
        </div>
        <div className="chat chat-end">
          <div className="chat-header">Anakin</div>
          <div className="chat-bubble chat-bubble-primary">I have the high ground</div>
          <div className="chat-footer text-xs">Delivered</div>
        </div>
        <div className="chat chat-start">
          <div className="chat-header">Obi-Wan Kenobi</div>
          <div className="chat-bubble">You underestimate my power</div>
          <div className="chat-footer text-xs">Seen at 12:46</div>
        </div>
      </div>
      <div className="flex items-center justify-around border-t border-base-300 pt-3 text-base-content/70">
        <button className="btn btn-ghost btn-sm">
          <Phone className="h-4 w-4" />
        </button>
        <button className="btn btn-ghost btn-sm">
          <Mic className="h-4 w-4" />
        </button>
        <button className="btn btn-ghost btn-sm">
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </DemoCard>
  );
}

function AdminPanelCard() {
  const items = [
    { label: "Databases", badge: "7" },
    { label: "Products" },
    { label: "Messages", badge: "29" },
    { label: "Access tokens" },
    { label: "Users", dot: true },
    { label: "Settings" },
  ];
  return (
    <DemoCard>
      <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">Admin panel</p>
      <ul className="menu menu-compact rounded-box bg-base-200/70 p-2 text-sm">
        {items.map((item) => (
          <li key={item.label}>
            <a>
              <span className="flex items-center gap-2">
                <Menu className="h-3.5 w-3.5" />
                {item.label}
              </span>
              {item.badge && <span className="badge badge-sm">{item.badge}</span>}
              {item.dot && <span className="badge badge-info badge-xs" />}
            </a>
          </li>
        ))}
      </ul>
    </DemoCard>
  );
}

function AudioCard() {
  return (
    <DemoCard>
      <div className="flex items-center justify-center gap-2 text-lg">
        <button className="btn btn-square btn-neutral btn-sm">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button className="btn btn-square btn-primary btn-sm">
          <Play className="h-4 w-4" />
        </button>
        <button className="btn btn-square btn-neutral btn-sm">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="text-center">
        <h3 className="text-base font-semibold">PM Zoomcall ASMR</h3>
        <p className="text-sm text-base-content/70">Project Manager talking for 2 hours.</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-base-content/70">
        <span className="badge badge-outline">13:39</span>
        <input type="range" min={0} max={120} defaultValue={45} className="range range-primary w-full" />
        <span>120:00</span>
      </div>
      <div className="flex items-center justify-around text-base-content/70">
        <button className="btn btn-square btn-ghost btn-sm">
          <Volume2 className="h-4 w-4" />
        </button>
        <button className="btn btn-square btn-ghost btn-sm">🔀</button>
        <button className="btn btn-square btn-ghost btn-sm">🔁</button>
        <button className="btn btn-square btn-ghost btn-sm">🎧</button>
      </div>
    </DemoCard>
  );
}

function TerminalCard() {
  return (
    <DemoCard>
      <div className="mockup-code text-sm">
        <pre data-prefix="$">
          <code>npm i daisyui</code>
        </pre>
        <pre data-prefix=">">
          <code>installing...</code>
        </pre>
        <pre data-prefix="✓">
          <code>Done!</code>
        </pre>
      </div>
    </DemoCard>
  );
}

function NotificationsBlock() {
  return (
    <div className="space-y-3">
      <div className="alert alert-info">There are 9 new messages</div>
      <div className="alert alert-success">Verification process completed</div>
      <div className="alert alert-warning">Click to verify your email</div>
      <div className="alert alert-error justify-between">
        <span>Access denied</span>
        <a className="link link-hover">Support</a>
      </div>
    </div>
  );
}

function HarryPotterTimeline() {
  return (
    <DemoCard>
      <h3 className="text-base font-semibold">Harry Potter and...</h3>
      <ul className="steps steps-vertical">
        {books.map((book, idx) => (
          <li key={book} className={cn("step", idx < 4 && "step-primary")}> 
            <div className="flex items-center justify-between gap-2 w-full text-left">
              <span className="text-sm">{book}</span>
              <div className="rating rating-xs">
                {Array.from({ length: 5 }).map((_, starIdx) => (
                  <input
                    key={starIdx}
                    type="radio"
                    name={`rating-${idx}`}
                    className="mask mask-star-2 bg-warning"
                    defaultChecked={starIdx < Math.max(3, 2 + (idx % 3))}
                    aria-label="rating"
                  />
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </DemoCard>
  );
}

function StarterPlanCard() {
  return (
    <DemoCard>
      <div className="flex items-center justify-between text-xs font-semibold">
        <div className="join"> 
          <button className="btn btn-xs join-item">Monthly</button>
          <button className="btn btn-xs join-item btn-primary">Yearly</button>
        </div>
        <span className="badge badge-warning">SALE</span>
      </div>
      <h3 className="text-lg font-semibold">Starter Plan</h3>
      <div className="text-4xl font-bold">$200</div>
      <p className="text-sm text-base-content/70">/month</p>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-2 text-success">
          <Check className="h-4 w-4" /> 20 Tokens per day
        </li>
        <li className="flex items-center gap-2 text-success">
          <Check className="h-4 w-4" /> 10 Projects
        </li>
        <li className="flex items-center gap-2 text-success">
          <Check className="h-4 w-4" /> API Access
        </li>
        <li className="flex items-center gap-2 text-error">
          <span className="font-semibold">×</span> Priority Support
        </li>
      </ul>
      <button className="btn btn-success w-full">Buy Now</button>
    </DemoCard>
  );
}
