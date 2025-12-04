import type { CSSProperties } from "react";
import { Icon } from "@iconify/react";

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
      <div className="card-body gap-3 p-4 text-sm">{children}</div>
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
        <span className="badge badge-neutral badge-sm">Shoes</span>
        <span className="badge badge-neutral badge-sm">Bags</span>
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
    </DemoCard>
  );
}

function CalendarCard() {
  return (
    <DemoCard>
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <button className="btn btn-xs btn-ghost">
          <Icon icon="mdi:chevron-left" className="h-4 w-4" />
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
          <Icon icon="mdi:chevron-right" className="h-4 w-4" />
        </button>
      </div>

      <input type="text" className="input input-bordered input-sm w-full" placeholder="Search for events" />

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
    <div className="card rounded-2xl border border-base-300/40 bg-base-200/80 shadow-sm">
      <div className="card-body gap-3 p-4 text-sm">
        <div role="tablist" className="tabs tabs-lifted tabs-sm">
          <a role="tab" className="tab">
            Tab 1
          </a>
          <a role="tab" className="tab tab-active">
            Tab 2
          </a>
          <a role="tab" className="tab">
            Tab 3
          </a>
        </div>
        <div className="mt-4 text-sm text-base-content/80">Tab content 2</div>
      </div>
    </div>
  );
}

function PriceRangeCard() {
  return (
    <DemoCard>
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="badge badge-ghost">$</span>
        <span>Price range</span>
      </div>
      <div className="text-center text-3xl font-semibold">50</div>
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
      <img
        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
        alt="Nike Shoes"
        className="h-64 w-full rounded-2xl object-cover"
      />
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Nike Shoes</h3>
        <span className="badge badge-success">SALE</span>
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
    </DemoCard>
  );
}

function SearchFindCard() {
  return (
    <DemoCard>
      <div className="join w-full">
        <label className="input input-bordered input-sm join-item flex items-center gap-2 text-sm">
          <Icon icon="mdi:magnify" className="h-4 w-4 text-base-content/60" />
          <input type="text" placeholder="Search" className="grow bg-transparent outline-none" />
        </label>
        <button className="btn btn-primary btn-sm join-item">Find</button>
      </div>
    </DemoCard>
  );
}

function CreateAccountCard() {
  return (
    <DemoCard>
      <h3 className="text-sm font-semibold text-base-content/80">Create new account</h3>
      <p className="text-xs text-base-content/60">Registration is free and only takes a minute.</p>

      <label className="input input-bordered input-sm flex items-center gap-2">
        <Icon icon="mdi:account-outline" className="h-4 w-4 text-base-content/60" />
        <input type="text" placeholder="Username" className="grow" />
      </label>

      <label className="input input-bordered input-sm flex items-center gap-2">
        <Icon icon="mdi:key-variant" className="h-4 w-4 text-base-content/60" />
        <input type="password" placeholder="password" className="grow" />
      </label>

      <p className="mt-1 flex items-center gap-1 text-xs text-error">
        <span className="inline-block h-1 w-1 rounded-full bg-error" />
        Password must be 8+ characters.
      </p>

      <label className="label cursor-pointer justify-start gap-2 p-0 text-sm">
        <input type="checkbox" className="toggle toggle-sm" defaultChecked />
        <span className="label-text">Accept terms without reading</span>
      </label>
      <label className="label cursor-pointer justify-start gap-2 p-0 text-sm">
        <input type="checkbox" className="toggle toggle-sm" />
        <span className="label-text">Subscribe to spam emails</span>
      </label>

      <button className="btn btn-primary w-full">Register</button>
      <div className="text-center text-xs">
        <button className="btn btn-link btn-xs px-0" type="button">
          Or login
        </button>
      </div>
    </DemoCard>
  );
}

function SalesVolumeCard() {
  const heights = ["h-4", "h-6", "h-3", "h-8", "h-10", "h-7", "h-9", "h-12", "h-14", "h-16"];
  return (
    <DemoCard>
      <div className="space-y-3">
        <div className="flex h-24 items-end gap-1">
          {heights.map((h, idx) => (
            <div key={idx} className={cn("w-2 rounded-full bg-base-content/90", h)} />
          ))}
        </div>
        <p className="text-sm text-base-content/80">
          Sales volume reached $12,450 this week, showing a 15% increase from the previous period.
        </p>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm flex-1">Charts</button>
          <button className="btn btn-primary btn-sm flex-1">Details</button>
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
          <p className="text-xs font-semibold text-base-content/60">Page Score</p>
          <div className="text-3xl font-bold">91/100</div>
          <div className="inline-flex items-center gap-1 text-xs text-success">
            <Icon icon="mdi:shield-check" className="h-4 w-4" />
            <span>All good</span>
          </div>
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
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-base-content/70">
        <Icon icon="mdi:trending-up" className="h-4 w-4 text-base-content/60" />
        <span>Recent orders</span>
      </div>
      <div className="space-y-2 text-sm">
        {orders.map((order) => (
          <div key={order.name} className="flex items-center justify-between rounded-lg bg-base-200/70 px-3 py-2">
            <span>{order.name}</span>
            <span
              className={cn(
                "badge badge-outline badge-sm",
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
      <p className="text-xs text-base-content/60">December Revenue</p>
      <p className="text-3xl font-semibold">$32,400</p>
      <div className="mt-1 flex items-center gap-2">
        <Icon icon="mdi:trending-up" className="h-4 w-4 text-success" />
        <span className="text-xs text-base-content/70">21% more than last month</span>
      </div>
    </DemoCard>
  );
}

function WritePostCard() {
  return (
    <DemoCard>
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-base-content/80">
        <Icon icon="mdi:pencil-outline" className="h-4 w-4 text-base-content/60" />
        <span>Write a new post</span>
      </div>

      <div className="mb-3 flex items-center gap-3 text-xs text-base-content/70">
        <button className="btn btn-xs btn-ghost font-bold">B</button>
        <button className="btn btn-xs btn-ghost italic">I</button>
        <button className="btn btn-xs btn-ghost underline">U</button>
        <button className="ml-auto btn btn-xs btn-ghost">Add files</button>
      </div>

      <textarea
        className="textarea textarea-bordered w-full min-h-[140px]"
        placeholder="What's happening?"
      />

      <div className="mt-2 flex items-center justify-between text-xs text-base-content/60">
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
      <div className="space-y-3 text-sm">
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-8 rounded-full">
              <img src="https://img.daisyui.com/images/profile/demo/yellingwoman@94.webp" alt="Obi-Wan" />
            </div>
          </div>
          <div className="chat-header text-xs">
            Obi-Wan Kenobi
            <time className="ml-1 opacity-70">12:45</time>
          </div>
          <div className="chat-bubble bg-base-200 text-base-content">It's over Anakin</div>
        </div>
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-8 rounded-full">
              <img src="https://img.daisyui.com/images/profile/demo/yellingwoman@94.webp" alt="Obi-Wan" />
            </div>
          </div>
          <div className="chat-bubble bg-base-200 text-base-content">I have the high ground</div>
          <div className="chat-footer text-[10px] text-base-content/60">Delivered</div>
        </div>
        <div className="chat chat-end">
          <div className="chat-image avatar">
            <div className="w-8 rounded-full">
              <img src="https://img.daisyui.com/images/profile/demo/yellingcat@94.webp" alt="Anakin" />
            </div>
          </div>
          <div className="chat-bubble bg-primary text-primary-content">You underestimate my power</div>
          <div className="chat-footer text-[10px] text-base-content/60">Seen at 12:46</div>
        </div>
      </div>
      <div className="mt-3 border-t border-base-300/50 pt-3 text-base-content/70">
        <div className="flex items-center justify-around">
          <button className="btn btn-ghost btn-sm" type="button">
            <Icon icon="mdi:phone-outline" className="h-4 w-4" />
          </button>
          <button className="btn btn-ghost btn-sm" type="button">
            <Icon icon="mdi:microphone-outline" className="h-4 w-4" />
          </button>
          <button className="btn btn-ghost btn-sm" type="button">
            <Icon icon="mdi:cog-outline" className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex justify-center">
          <div className="h-0.5 w-12 rounded-full bg-base-300" />
        </div>
      </div>
    </DemoCard>
  );
}

function AdminPanelCard() {
  const items = [
    { label: "Databases", badge: "7", icon: "mdi:database-outline" },
    { label: "Products", icon: "mdi:cube-outline" },
    { label: "Messages", badge: "29", icon: "mdi:email-outline" },
    { label: "Access tokens", icon: "mdi:key-variant" },
    { label: "Users", dot: true, icon: "mdi:account-multiple-outline" },
    { label: "Settings", icon: "mdi:cog-outline" },
  ];
  return (
    <DemoCard>
      <p className="text-xs font-semibold text-base-content/60">Admin panel</p>
      <ul className="menu menu-compact rounded-box bg-base-200/70 p-2 text-sm">
        {items.map((item) => (
          <li key={item.label}>
            <a>
              <span className="flex items-center gap-2">
                <Icon icon={item.icon} className="h-4 w-4 text-base-content/70" />
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
      <div className="flex items-center justify-center gap-2 text-base">
        <button className="btn btn-square btn-neutral btn-sm">
          <Icon icon="mdi:chevron-left" className="h-4 w-4" />
        </button>
        <button className="btn btn-square btn-primary btn-sm">
          <Icon icon="mdi:play" className="h-4 w-4" />
        </button>
        <button className="btn btn-square btn-neutral btn-sm">
          <Icon icon="mdi:chevron-right" className="h-4 w-4" />
        </button>
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold">PM Zoomcall ASMR</h3>
        <p className="text-xs text-base-content/70">Project Manager talking for 2 hours.</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-base-content/70">
        <span className="badge badge-outline">13:39</span>
        <input type="range" min={0} max={120} defaultValue={45} className="range range-primary w-full" />
        <span>120:00</span>
      </div>
      <div className="flex items-center justify-around text-base-content/70">
        <button className="btn btn-square btn-ghost btn-sm">
          <Icon icon="mdi:volume-high" className="h-4 w-4" />
        </button>
        <button className="btn btn-square btn-ghost btn-sm">
          <Icon icon="mdi:shuffle-variant" className="h-4 w-4" />
        </button>
        <button className="btn btn-square btn-ghost btn-sm">
          <Icon icon="mdi:repeat" className="h-4 w-4" />
        </button>
        <button className="btn btn-square btn-ghost btn-sm">
          <Icon icon="mdi:headphones" className="h-4 w-4" />
        </button>
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
          <Icon icon="mdi:check-bold" className="h-4 w-4" /> 20 Tokens per day
        </li>
        <li className="flex items-center gap-2 text-success">
          <Icon icon="mdi:check-bold" className="h-4 w-4" /> 10 Projects
        </li>
        <li className="flex items-center gap-2 text-success">
          <Icon icon="mdi:check-bold" className="h-4 w-4" /> API Access
        </li>
        <li className="flex items-center gap-2 text-error">
          <span className="font-semibold">×</span> Priority Support
        </li>
      </ul>
      <button className="btn btn-success w-full">Buy Now</button>
    </DemoCard>
  );
}
