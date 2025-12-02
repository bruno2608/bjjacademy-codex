'use client';

export function MinimalTabs({ items, activeId, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-bjj-gray-800/80 bg-bjj-gray-900/70 p-1 text-sm font-semibold">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-bjj-red/60 focus-visible:ring-offset-0 ${
            activeId === item.id
              ? 'bg-bjj-red text-bjj-white shadow-[0_0_0_1px_rgba(248,113,113,0.25)]'
              : 'text-bjj-gray-200 hover:text-bjj-white'
          }`}
        >
          <span className="tracking-[0.08em] uppercase">{item.label}</span>
          {item.badge ? (
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                activeId === item.id ? 'bg-bjj-white/20 text-white' : 'bg-bjj-gray-800 text-bjj-gray-100'
              }`}
            >
              {item.badge}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

export default MinimalTabs;
