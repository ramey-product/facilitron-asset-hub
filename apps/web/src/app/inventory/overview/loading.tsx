export default function InventoryOverviewLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center gap-4 px-8">
          <div className="h-5 w-5 animate-pulse rounded bg-[var(--muted)]" />
          <div className="space-y-1.5">
            <div className="h-5 w-44 animate-pulse rounded bg-[var(--muted)]" />
            <div className="h-3.5 w-56 animate-pulse rounded bg-[var(--muted)]" />
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Section label */}
        <div className="h-3 w-32 animate-pulse rounded bg-[var(--muted)]" />

        {/* KPI cards row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-[var(--muted)]" />
          ))}
        </div>

        {/* Section label */}
        <div className="h-3 w-40 animate-pulse rounded bg-[var(--muted)]" />

        {/* Health + charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Health card */}
          <div className="h-96 animate-pulse rounded-xl bg-[var(--muted)]" />

          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-72 animate-pulse rounded-xl bg-[var(--muted)]" />
            <div className="h-72 animate-pulse rounded-xl bg-[var(--muted)]" />
          </div>
        </div>

        {/* Search skeleton */}
        <div className="h-40 animate-pulse rounded-xl bg-[var(--muted)]" />

        {/* Quick nav skeleton */}
        <div>
          <div className="mb-3 h-3 w-32 animate-pulse rounded bg-[var(--muted)]" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-[var(--muted)]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
