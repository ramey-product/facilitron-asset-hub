export default function ToolroomLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80">
        <div className="flex h-16 items-center gap-3 px-8">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-[var(--muted)]" />
          <div className="space-y-1.5">
            <div className="h-5 w-52 animate-pulse rounded bg-[var(--muted)]" />
            <div className="h-3.5 w-72 animate-pulse rounded bg-[var(--muted)]" />
          </div>
        </div>
      </div>

      <div className="space-y-6 p-8">
        {/* KPI cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--muted)]" />
          ))}
        </div>

        {/* Available tools card */}
        <div className="animate-pulse rounded-xl border border-[var(--border)] bg-[var(--muted)] h-64" />

        {/* Checked out grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg border border-[var(--border)] bg-[var(--muted)]" />
          ))}
        </div>

        {/* Chart */}
        <div className="h-72 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--muted)]" />
      </div>
    </div>
  );
}
