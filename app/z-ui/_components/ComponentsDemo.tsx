"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";
import { ZCard } from "./ZCard";

const categories = [
  { label: "Hoodies", count: 25, tone: "badge-neutral" as const },
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
    <section className="max-w-6xl mx-auto mt-8">
      <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-3">
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
    <ZCard className={className}>
      {children}
    </ZCard>
  );
}


function PreviewCard() {
  return (
    <DemoCard>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-base-300 text-base-content/70">
            <Icon icon="mdi:chart-arc" className="w-6 h-6" />
          </span>
          <h3 className="text-sm font-semibold leading-none">Preview</h3>
        </div>
        <button
          type="button"
          className="px-0 text-xs font-medium btn btn-link btn-xs text-base-content/80 underline-offset-2 hover:underline"
        >
          more
        </button>
      </div>

      {/* Tags ativas */}
      <div className="flex flex-wrap gap-2 mt-2 text-xs">
        {["Shoes", "Bags"].map((tag) => (
          <span key={tag} className="zk-tag-pill">
            {tag}
            <Icon icon="mdi:close" className="zk-tag-pill-icon" />
          </span>
        ))}
      </div>

      {/* Lista de categorias */}
      <div className="mt-4 space-y-3 text-sm">
        {categories.map((category, index) => (
          <div
            key={category.label}
            className={cn(
              "flex items-center justify-between gap-3 border-t border-dotted border-base-300 pt-3",
              index === 0 && "border-t-0 pt-0"
            )}
          >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  defaultChecked={
                    category.label === "Hoodies" || category.label === "Bags"
                  }
                />
              <span>{category.label}</span>
            </label>

            <span
              className={cn(
                category.tone === "warning"
                  ? "zk-badge-soft-warning"
                  : "zk-badge-soft"
              )}
            >
              {category.count}
            </span>
          </div>
        ))}
      </div>
    </DemoCard>
  );
}

// Ordem sugerida para refatorar os próximos cards com o mesmo padrão:
// StatsCard -> ScheduleCard -> ScoreCard -> demais cards da página /z-ui



function CalendarCard() {
  return (
    <DemoCard>
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <button className="btn btn-xs btn-ghost">
          <Icon icon="mdi:chevron-left" className="w-4 h-4" />
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
          <Icon icon="mdi:chevron-right" className="w-4 h-4" />
        </button>
      </div>

      <input type="text" className="w-full input input-bordered input-sm" placeholder="Search for events" />

      <label className="justify-start gap-2 p-0 text-sm cursor-pointer label">
        <input type="checkbox" className="toggle toggle-primary" defaultChecked />
        <span className="label-text">Show all day events</span>
      </label>

      <div className="p-4 border rounded-xl border-base-300 bg-base-300">
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
  const [active, setActive] = useState<"1" | "2" | "3">("2");

  return (
    <DemoCard>
      <div className="space-y-3 text-sm">
        <div role="tablist" className="tabs tabs-lifted tabs-sm">
          <button
            type="button"
            role="tab"
            className={cn("tab", active === "1" && "tab-active")}
            onClick={() => setActive("1")}
            aria-selected={active === "1"}
          >
            Tab 1
          </button>
          <button
            type="button"
            role="tab"
            className={cn("tab", active === "2" && "tab-active")}
            onClick={() => setActive("2")}
            aria-selected={active === "2"}
          >
            Tab 2
          </button>
          <button
            type="button"
            role="tab"
            className={cn("tab", active === "3" && "tab-active")}
            onClick={() => setActive("3")}
            aria-selected={active === "3"}
          >
            Tab 3
          </button>
        </div>
        <div className="text-sm text-base-content/80">{`Tab content ${active}`}</div>
      </div>
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
      <div className="text-3xl font-semibold text-center">50</div>
      <input type="range" min={0} max={200} defaultValue={50} className="w-full range range-primary" />
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
        className="object-cover w-full h-64 rounded-2xl"
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
        <span className="text-sm line-through text-base-content/60">$150</span>
      </div>
    </DemoCard>
  );
}

function SearchFindCard() {
  return (
    <DemoCard>
      <div className="w-full join">
        <label className="flex items-center gap-2 text-sm input input-bordered input-sm join-item">
          <Icon icon="mdi:magnify" className="w-4 h-4 text-base-content/60" />
          <input type="text" placeholder="Search" className="bg-transparent outline-none grow" />
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

      <label className="flex items-center gap-2 input input-bordered input-sm">
        <Icon icon="mdi:account-outline" className="w-4 h-4 text-base-content/60" />
        <input type="text" placeholder="Username" className="grow" />
      </label>

      <label className="flex items-center gap-2 input input-bordered input-sm">
        <Icon icon="mdi:key-variant" className="w-4 h-4 text-base-content/60" />
        <input type="password" placeholder="Password" className="grow" />
      </label>

      <p className="flex items-center gap-1 mt-1 text-xs text-error">
        <span className="inline-block w-1 h-1 rounded-full bg-error" />
        Password must be 8+ characters.
      </p>

      <label className="justify-start gap-2 p-0 text-sm cursor-pointer label">
        <input type="checkbox" className="toggle toggle-sm" defaultChecked />
        <span className="label-text">Accept terms without reading</span>
      </label>
      <label className="justify-start gap-2 p-0 text-sm cursor-pointer label">
        <input type="checkbox" className="toggle toggle-sm" />
        <span className="label-text">Subscribe to spam emails</span>
      </label>

      <button className="w-full btn btn-primary">Register</button>
      <div className="text-xs text-center">
        <button className="px-0 btn btn-link btn-xs" type="button">
          Or login
        </button>
      </div>
    </DemoCard>
  );
}

function SalesVolumeCard() {
  const heights = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
  return (
    <DemoCard>
      <div className="space-y-3">
        <div className="flex h-28 items-end gap-1.5">
          {heights.map((h, idx) => (
            <div
              key={idx}
              className="w-2.5 rounded-full bg-base-content/90"
              style={{ height: `${h}px` }}
              aria-hidden
            />
          ))}
        </div>
        <p className="text-sm text-base-content/80">
          Sales volume reached $12,450 this week, showing a 15% increase from the previous period.
        </p>
        <div className="flex gap-2">
          <button className="flex-1 btn btn-sm btn-neutral">Charts</button>
          <button className="flex-1 btn btn-sm btn-primary btn-active">Details</button>
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
            <Icon icon="mdi:shield-check" className="w-4 h-4" />
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
      <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-base-content/70">
        <Icon icon="mdi:trending-up" className="w-4 h-4 text-base-content/60" />
        <span>Recent orders</span>
      </div>
      <div className="space-y-2 text-sm">
        {orders.map((order) => (
          <div key={order.name} className="flex items-center justify-between px-3 py-2 border rounded-lg border-base-300">
            <span>{order.name}</span>
            <span
              className={cn(
                "badge badge-sm",
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
      <div className="flex items-center gap-2 mt-1">
        <Icon icon="mdi:trending-up" className="w-4 h-4 text-success" />
        <span className="text-xs text-base-content/70">21% more than last month</span>
      </div>
    </DemoCard>
  );
}

function WritePostCard() {
  return (
    <DemoCard>
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-base-content/80">
        <Icon icon="mdi:pencil-outline" className="w-4 h-4 text-base-content/60" />
        <span>Write a new post</span>
      </div>

      <div className="flex items-center gap-3 mb-3 text-xs text-base-content/70">
        <div className="join">
          <button className="font-bold btn btn-xs btn-ghost join-item">B</button>
          <button className="italic btn btn-xs btn-ghost join-item">I</button>
          <button className="underline btn btn-xs btn-ghost join-item">U</button>
        </div>
        <button className="ml-auto btn btn-xs btn-ghost">Add files</button>
      </div>

      <textarea
        className="textarea textarea-bordered w-full min-h-[140px]"
        placeholder="What's happening?"
      />

      <div className="flex items-center justify-between mt-2 text-xs text-base-content/60">
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
  const bubbleClass = "chat-bubble bg-primary text-primary-content";

  return (
    <DemoCard>
      <div className="space-y-3 text-sm">
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="rounded-full w-9">
              <img src="https://img.daisyui.com/images/profile/demo/yellingwoman@94.webp" alt="Obi-Wan" />
            </div>
          </div>
          <div className="text-xs chat-header text-base-content/80">
            Obi-Wan Kenobi
            <time className="ml-1 opacity-70">12:45</time>
          </div>
          <div className={bubbleClass}>It&apos;s over Anakin</div>
        </div>
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="rounded-full w-9">
              <img src="https://img.daisyui.com/images/profile/demo/yellingwoman@94.webp" alt="Obi-Wan" />
            </div>
          </div>
          <div className={bubbleClass}>I have the high ground</div>
          <div className="chat-footer text-[10px] text-base-content/60">Delivered</div>
        </div>
        <div className="chat chat-end">
          <div className="chat-image avatar">
            <div className="rounded-full w-9">
              <img src="https://img.daisyui.com/images/profile/demo/yellingcat@94.webp" alt="Anakin" />
            </div>
          </div>
          <div className={bubbleClass}>You underestimate my power</div>
          <div className="chat-footer text-[10px] text-base-content/60">Seen at 12:46</div>
        </div>
      </div>
      <div className="relative px-4 py-3 mt-3 border rounded-[var(--radius-box)] border-base-300 bg-base-300 text-base-content/80">
        <div className="flex items-center justify-around text-base-content/80">
          <Icon icon="mdi:phone-outline" className="w-4 h-4" />
          <Icon icon="mdi:microphone-outline" className="w-4 h-4" />
          <Icon icon="mdi:cog-outline" className="w-4 h-4" />
        </div>
        <div className="pointer-events-none absolute bottom-2 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-base-100/60" />
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
      <div className="overflow-hidden text-sm border divide-y divide-base-300 rounded-[var(--radius-box)] border-base-300 bg-base-300">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <Icon icon={item.icon} className="w-4 h-4 text-base-content/70" />
              <span>{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && <span className="badge badge-sm">{item.badge}</span>}
              {item.dot && <span className="badge badge-info badge-xs" />}
            </div>
          </div>
        ))}
      </div>
    </DemoCard>
  );
}

function AudioCard() {
  return (
    <DemoCard>
      <div className="flex items-center justify-center gap-2 text-base">
        <button className="border btn btn-square btn-ghost btn-sm border-base-300 bg-base-100/80">
          <Icon icon="mdi:chevron-left" className="w-4 h-4" />
        </button>
        <button className="shadow-sm btn btn-square btn-primary btn-sm">
          <Icon icon="mdi:play" className="w-4 h-4" />
        </button>
        <button className="border btn btn-square btn-ghost btn-sm border-base-300 bg-base-100/80">
          <Icon icon="mdi:chevron-right" className="w-4 h-4" />
        </button>
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold">PM Zoomcall ASMR</h3>
        <p className="text-xs text-base-content/70">Project Manager talking for 2 hours.</p>
      </div>
      <div className="flex items-center gap-3 text-xs text-base-content/70">
        <span className="px-3 py-1 rounded-full shadow bg-base-100/90">13:39</span>
        <div className="flex-1 px-3 py-2 rounded-full bg-base-300">
          <input type="range" min={0} max={120} defaultValue={45} className="w-full range range-primary range-sm" />
        </div>
        <span className="text-xs">120:00</span>
      </div>
      <div className="flex items-center justify-around text-base-content/70">
        <button className="btn btn-square btn-ghost btn-sm">
          <Icon icon="mdi:volume-high" className="w-4 h-4" />
        </button>
        <button className="btn btn-square btn-ghost btn-sm">
          <Icon icon="mdi:shuffle-variant" className="w-4 h-4" />
        </button>
        <button className="btn btn-square btn-ghost btn-sm">
          <Icon icon="mdi:repeat" className="w-4 h-4" />
        </button>
        <button className="btn btn-square btn-ghost btn-sm">
          <Icon icon="mdi:headphones" className="w-4 h-4" />
        </button>
      </div>
    </DemoCard>
  );
}

function TerminalCard() {
  return (
    <DemoCard>
      <div className="text-sm mockup-code">
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
    <DemoCard>
      <div className="space-y-2">
        <div className="alert alert-info">
          <Icon icon="mdi:email" className="w-5 h-5" />
          <span>There are 9 new messages</span>
        </div>

        <div className="alert alert-success">
          <Icon icon="mdi:check-circle-outline" className="w-5 h-5" />
          <span>Verification process completed</span>
        </div>

        <div className="alert alert-warning">
          <Icon icon="mdi:shield-alert-outline" className="w-5 h-5" />
          <span>
            <a className="link">Click to verify your email</a>
          </span>
        </div>

        <div className="alert alert-error">
          <Icon icon="mdi:lock-outline" className="w-5 h-5" />
          <div className="flex items-center justify-between flex-1 gap-2">
            <span>Access denied</span>
            <button className="px-0 btn btn-link btn-xs">Support</button>
          </div>
        </div>
      </div>
    </DemoCard>
  );
}


function HarryPotterTimeline() {
  return (
    <DemoCard>
      <h3 className="text-base font-semibold">Harry Potter and...</h3>
      <ul className="steps steps-vertical">
        {books.map((book, idx) => (
          <li key={book} className={cn("step", idx < 4 && "step-primary")}> 
            <div className="flex items-center justify-between w-full gap-2 text-left">
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
          <Icon icon="mdi:check-bold" className="w-4 h-4" /> 20 Tokens per day
        </li>
        <li className="flex items-center gap-2 text-success">
          <Icon icon="mdi:check-bold" className="w-4 h-4" /> 10 Projects
        </li>
        <li className="flex items-center gap-2 text-success">
          <Icon icon="mdi:check-bold" className="w-4 h-4" /> API Access
        </li>
        <li className="flex items-center gap-2 text-error">
          <span className="font-semibold">×</span> Priority Support
        </li>
      </ul>
      <button className="w-full btn btn-success">Buy Now</button>
    </DemoCard>
  );
}
