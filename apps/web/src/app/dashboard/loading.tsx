export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-[var(--muted)]" />
            <div className="h-5 w-48 animate-pulse rounded bg-[var(--muted)]" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-32 animate-pulse rounded bg-[var(--muted)]" />
            <div className="h-8 w-8 animate-pulse rounded bg-[var(--muted)]" />
          </div>
        </div>
      </div>

      <div className="space-y-6 p-8">
        {/* Quick actions skeleton */}
        <div className="h-16 animate-pulse rounded-xl bg-[var(--muted)]" />

        {/* KPI cards skeleton */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-[var(--muted)]" />
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-[var(--muted)]" />
          ))}
        </div>

        {/* Alerts + activity skeleton */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-xl bg-[var(--muted)]" />
          <div className="h-80 animate-pulse rounded-xl bg-[var(--muted)]" />
        </div>
      </div>
    </div>
  );
}
