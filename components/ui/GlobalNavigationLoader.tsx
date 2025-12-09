'use client';

type GlobalNavigationLoaderProps = {
  active: boolean;
};

/**
 * Thin top-bar loader to signal route transitions without blocking interactions.
 */
export default function GlobalNavigationLoader({ active }: GlobalNavigationLoaderProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-[55] h-1 transition-opacity duration-200 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative h-full overflow-hidden bg-primary/15">
        <div className="absolute inset-y-0 left-0 w-1/3 animate-nav-progress bg-gradient-to-r from-primary via-primary/70 to-primary/30" />
      </div>
    </div>
  );
}
