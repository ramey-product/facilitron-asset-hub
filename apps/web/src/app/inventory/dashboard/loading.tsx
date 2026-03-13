export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 h-16 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md" />

      <div className="space-y-6 p-8">
        {/* Quick Actions skeleton */}
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-36 animate-pulse rounded-md bg-[var(--muted)]" />
          ))}
        </div>

        {/* KPI Cards skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="h-3 w-24 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-8 w-8 animate-pulse rounded-lg bg-[var(--muted)]" />
              </div>
              <div className="h-7 w-28 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-3 w-36 animate-pulse rounded bg-[var(--muted)]" />
            </div>
          ))}
        </div>

        {/* Charts row skeleton */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4"
            >
              <div className="h-4 w-40 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-56 w-full animate-pulse rounded bg-[var(--muted)]" />
            </div>
          ))}
        </div>

        {/* Cost trends skeleton */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
          <div className="h-4 w-48 animate-pulse rounded bg-[var(--muted)]" />
          <div className="h-64 w-full animate-pulse rounded bg-[var(--muted)]" />
        </div>

        {/* Activity feed skeleton */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
            <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
            <div className="h-3 w-14 animate-pulse rounded bg-[var(--muted)]" />
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex items-start gap-3 px-5 py-3">
                <div className="mt-0.5 h-5 w-20 animate-pulse rounded-full bg-[var(--muted)]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-40 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-3 w-56 animate-pulse rounded bg-[var(--muted)]" />
                </div>
                <div className="h-3 w-10 animate-pulse rounded bg-[var(--muted)]" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
