import { type CSSProperties } from "react";

import { Check, Play, Volume2 } from "lucide-react";

import { cn } from "@/lib/utils";

const chipStats = [
  { label: "Hoodies", value: 25 },
  { label: "Bags", value: 3 },
  { label: "Shoes", value: 0 },
  { label: "Accessories", value: 4 },
];

const calendarDays = [
  { day: "12", label: "M" },
  { day: "13", label: "T" },
  { day: "14", label: "W" },
  { day: "15", label: "T" },
  { day: "16", label: "F" },
  { day: "17", label: "S" },
  { day: "18", label: "S" },
];

const orders = [
  { name: "Charlie Chapman", status: "Send", tone: "info" },
  { name: "Howard Hudson", status: "Failed", tone: "error" },
  { name: "Fiona Fisher", status: "In progress", tone: "warning" },
  { name: "Nick Nelson", status: "Completed", tone: "success" },
  { name: "Amanda Anderson", status: "Completed", tone: "success" },
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
    <section className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Components Demo</h2>
          <p className="text-sm text-base-content/70">Vitrine estática inspirada no Theme Generator do DaisyUI.</p>
        </div>
        <span className="badge badge-outline border-base-300">Static</span>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <PreviewMoreCard />
        <PriceRangeCard />
        <NikeShoesCard />
        <CreateAccountCard />
        <SalesVolumeCard />
        <PageScoreCard />
        <RecentOrdersCard />
        <DecemberRevenueCard />
        <WritePostCard />
        <ChatCard />
        <AdminPanelCard />
        <AudioCard />
        <TerminalCard />
        <NotificationsCard />
        <HarryPotterCard />
        <StarterPlanCard />
      </div>
    </section>
  );
}

function PreviewMoreCard() {
  return (
    <div className="card h-full border border-base-300/70 bg-base-100/95 shadow-xl">
      <div className="card-body space-y-4">
        <h3 className="card-title text-base">Preview more</h3>
        <div className="join join-horizontal">
          <button className="btn btn-sm join-item btn-primary">Shoes</button>
          <button className="btn btn-sm join-item">Bags</button>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {chipStats.map((chip) => (
            <span key={chip.label} className="badge badge-outline border-base-300">
              {chip.label} {chip.value}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 text-xs">
          {calendarDays.map(({ day, label }) => (
            <div
              key={day}
              className={cn(
                "flex h-12 flex-col items-center justify-center rounded-lg border border-base-300/70 bg-base-200/60",
                day === "15" && "border-primary/70 bg-primary/20 text-primary-content"
              )}
            >
              <span className="text-[0.7rem] text-base-content/60">{label}</span>
              <span className="font-semibold">{day}</span>
            </div>
          ))}
        </div>

        <div className="text-xs font-semibold text-base-content/70">Show all day events</div>
        <div className="rounded-xl border border-base-300/70 bg-base-200/70 p-3 space-y-1">
          <p className="font-semibold">Team Sync Meeting</p>
          <p className="text-xs text-base-content/60">Weekly product review with design and development teams</p>
          <span className="badge badge-outline badge-sm">1h</span>
        </div>

        <div className="tabs tabs-bordered tabs-sm">
          <a className="tab tab-active">Tab 1</a>
          <a className="tab">Tab 2</a>
          <a className="tab">Tab 3</a>
        </div>
        <div className="text-sm text-base-content/70 space-y-1">
          <p>Tab content 1</p>
          <p>Tab content 2</p>
          <p>Tab content 3</p>
        </div>
      </div>
    </div>
  );
}

function PriceRangeCard() {
  return (
    <div className="card h-full border border-base-300/70 bg-base-100/95 shadow-xl">
      <div className="card-body space-y-4">
        <h3 className="card-title text-base">Price range</h3>
        <div className="flex items-center justify-between text-sm">
          <span>$0</span>
          <span className="font-semibold">$50</span>
          <span>$200</span>
        </div>
        <input type="range" min={0} max={200} defaultValue={50} className="range range-primary" />
        <div className="flex justify-between text-[0.7rem] text-base-content/60">
          <span>Min</span>
          <span>Max</span>
        </div>
      </div>
    </div>
  );
}

function NikeShoesCard() {
  return (
    <div className="card h-full border border-base-300/70 bg-base-100/95 shadow-xl">
      <div className="card-body space-y-3">
        <figure className="rounded-lg bg-base-200 p-6">
          <div className="h-32 w-full rounded-lg bg-gradient-to-br from-base-300 to-base-100" />
        </figure>
        <div className="flex items-center justify-between">
          <h3 className="card-title text-base">Nike Shoes SALE</h3>
          <span className="badge badge-secondary">SALE</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-base-content/70">
          <div className="rating rating-sm">
            {Array.from({ length: 5 }).map((_, idx) => (
              <input key={idx} type="radio" name="rating-1" className="mask mask-star-2 bg-primary" defaultChecked={idx < 4} />
            ))}
          </div>
          <span>420 reviews</span>
        </div>
        <div className="flex items-center gap-3 text-lg font-semibold">
          <span>$120</span>
          <span className="text-sm text-base-content/60 line-through">$150</span>
        </div>
        <button className="btn btn-primary w-full">Find</button>
      </div>
    </div>
  );
}

function CreateAccountCard() {
  return (
    <div className="card h-full border border-base-300/70 bg-base-100/95 shadow-xl">
      <div className="card-body space-y-4">
        <h3 className="card-title text-base">Create new account</h3>
        <p className="text-sm text-base-content/70">Registration is free and only takes a minute.</p>
        <label className="form-control w-full">
          <div className="label p-0">
            <span className="label-text">Email</span>
          </div>
          <input className="input input-bordered" placeholder="you@example.com" />
        </label>
        <label className="form-control w-full">
          <div className="label p-0">
            <span className="label-text">Password</span>
          </div>
          <input type="password" className="input input-bordered" />
          <span className="label-text-alt text-xs text-base-content/60">Password must be 8+ characters.</span>
        </label>
        <label className="label cursor-pointer gap-2">
          <input type="checkbox" className="checkbox" />
          <span className="label-text">Accept terms without reading</span>
        </label>
        <label className="label cursor-pointer gap-2">
          <input type="checkbox" className="checkbox" />
          <span className="label-text">Subscribe to spam emails</span>
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn btn-primary">Register</button>
          <button className="btn btn-link">Or login</button>
        </div>
      </div>
    </div>
  );
}

function SalesVolumeCard() {
  return (
    <div className="card h-full border border-base-300/70 bg-base-100/95 shadow-xl">
      <div className="card-body space-y-4">
        <p className="text-sm text-base-content/80">
          Sales volume reached $12,450 this week, showing a 15% increase from the previous period.
        </p>
        <div className="rounded-xl border border-base-300/60 bg-base-200/60 p-3">
          <div className="grid grid-cols-8 gap-1 h-24 items-end">
            {[60, 40, 70, 90, 55, 68, 80, 72].map((height, idx) => (
              <div key={idx} className="w-full rounded-t-lg bg-primary/80" style={{ height }} />
            ))}
          </div>
        </div>
        <div className="join">
          <button className="btn btn-sm join-item btn-primary">Charts</button>
          <button className="btn btn-sm join-item">Details</button>
        </div>
      </div>
    </div>
  );
}

function PageScoreCard() {
  return (
    <div className="card h-full border border-base-300/70 bg-base-100/95 shadow-xl">
      <div className="card-body space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">Page Score</p>
        <div className="radial-progress mx-auto text-primary" style={{ "--value": 91 } as CSSProperties}>
          91
        </div>
        <p className="text-sm">91/100</p>
        <span className="badge badge-success">All good</span>
      </div>
    </div>
  );
}

function RecentOrdersCard() {
  return (
    <div className="card h-full border border-base-300/70 bg-base-100/95 shadow-lg">
      <div className="card-body space-y-3">
        <h3 className="card-title text-base">Recent orders</h3>
        <div className="space-y-2 text-sm">
          {orders.map((order) => (
            <div key={order.name} className="flex items-center justify-between rounded-lg bg-base-200/60 px-3 py-2">
              <span className="font-medium">{order.name}</span>
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
      </div>
    </div>
  );
}

function DecemberRevenueCard() {
  return (
    <div className="card h-full border border-base-300/70 bg-base-100/95 shadow-lg">
      <div className="card-body space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">Summary</p>
        <h3 className="card-title text-base">December Revenue</h3>
        <div className="text-3xl font-bold">$32,400</div>
        <p className="text-sm text-base-content/70">21% more than last month.</p>
      </div>
    </div>
  );
}

function WritePostCard() {
  return (
    <div className="card h-full border border-base-300/70 bg-base-100/95 shadow-lg">
      <div className="card-body space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">Content</p>
        <h3 className="card-title text-base">Write a new post</h3>
        <textarea className="textarea textarea-bordered h-28 bg-base-200/70" placeholder="Tell your story..." />
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-base-content/60">
          <button className="btn btn-ghost btn-sm">Add files</button>
          <span>1200 characters remaining</span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button className="btn btn-ghost btn-sm">Draft</button>
          <button className="btn btn-primary btn-sm">Publish</button>
        </div>
      </div>
    </div>
  );
}

function ChatCard() {
  return (
    <div className="card h-full border border-base-300/70 bg-base-100/95 shadow-lg">
      <div className="card-body space-y-4">
        <h3 className="card-title text-base">Chat</h3>
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
      </div>
    </div>
  );
}

function AdminPanelCard() {
  const menuItems = [
    { label: "Databases", badge: "7" },
    { label: "Products" },
    { label: "Messages", badge: "29" },
    { label: "Access tokens" },
    { label: "Users" },
    { label: "Settings" },
  ];
  return (
    <div className="card h-full border border-base-300/70 bg-base-100/95 shadow-lg">
      <div className="card-body space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-base-content/60">Admin panel</p>
        <ul className="menu menu-compact rounded-box bg-base-200/70 p-2 text-sm">
          {menuItems.map((item) => (
            <li key={item.label}>
              <a>
                {item.label}
                {item.badge && <span className="badge badge-sm">{item.badge}</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AudioCard() {
  return (
    <div className="card h-full border border-base-300/70 bg-base-100/95 shadow-lg">
      <div className="card-body space-y-3">
        <h3 className="card-title text-base">PM Zoomcall ASMR</h3>
        <p className="text-sm text-base-content/70">Project Manager talking for 2 hours.</p>
        <div className="flex items-center gap-2 text-xs">
          <span>13:39</span>
          <div className="range range-xs w-full">
            <div className="h-2 w-full rounded bg-primary/40" />
          </div>
          <span>120:00</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-circle btn-primary btn-sm">
            <Play className="h-4 w-4" />
          </button>
          <button className="btn btn-circle btn-ghost btn-sm">
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function TerminalCard() {
  return (
    <div className="card h-full border border-base-300/70 bg-base-100/95 shadow-lg">
      <div className="card-body">
        <div className="mockup-code text-sm">
          <pre data-prefix="$">
            <code>npm i daisyui</code>
          </pre>
          <pre data-prefix=">">
            <code>installing...</code>
          </pre>
          <pre data-prefix="√">
            <code>Done!</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

function NotificationsCard() {
  return (
    <div className="card h-full border border-base-300/70 bg-base-100/95 shadow-lg">
      <div className="card-body space-y-3 text-sm">
        <div className="alert alert-info">There are 9 new messages</div>
        <div className="alert alert-success">Verification process completed</div>
        <div className="alert alert-warning">Click to verify your email</div>
        <div className="alert alert-error justify-between">
          <span>Access denied</span>
          <a className="link link-hover">Support</a>
        </div>
      </div>
    </div>
  );
}

function HarryPotterCard() {
  return (
    <div className="card h-full border border-base-300/70 bg-base-100/95 shadow-lg">
      <div className="card-body space-y-3">
        <h3 className="card-title text-base">Harry Potter and...</h3>
        <div className="space-y-2 text-sm">
          {books.map((book) => (
            <div key={book} className="flex items-center justify-between rounded-lg bg-base-200/60 px-3 py-2">
              <span>{book}</span>
              <div className="rating rating-xs">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <input key={idx} type="radio" name={`rating-${book}`} className="mask mask-star-2 bg-warning" defaultChecked={idx < 3} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StarterPlanCard() {
  return (
    <div className="card h-full border border-base-300/70 bg-base-100/95 shadow-xl">
      <div className="card-body space-y-3 text-center">
        <div className="badge badge-secondary">SALE</div>
        <h3 className="card-title text-base">Starter Plan</h3>
        <div className="text-3xl font-bold">$200/month</div>
        <ul className="space-y-1 text-sm">
          <li className="flex items-center justify-center gap-2">
            <Check className="h-4 w-4 text-success" /> 20 Tokens per day
          </li>
          <li className="flex items-center justify-center gap-2">
            <Check className="h-4 w-4 text-success" /> 10 Projects
          </li>
          <li className="flex items-center justify-center gap-2">
            <Check className="h-4 w-4 text-success" /> API Access
          </li>
          <li className="flex items-center justify-center gap-2">
            <Check className="h-4 w-4 text-success" /> Priority Support
          </li>
        </ul>
        <button className="btn btn-primary w-full">Buy Now</button>
      </div>
    </div>
  );
}
