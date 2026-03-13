export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 h-16 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md" />

      <div className="space-y-6 p-8">
        {/* Report Configuration card skeleton */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-6">
          <div className="h-4 w-44 animate-pulse rounded bg-[var(--muted)]" />

          {/* Report type cards */}
          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-[var(--muted)]" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--muted)]"
                />
              ))}
            </div>
          </div>

          {/* Date range presets */}
          <div className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-[var(--muted)]" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-28 animate-pulse rounded-lg bg-[var(--muted)]"
                />
              ))}
            </div>
          </div>

          {/* Group by */}
          <div className="space-y-2">
            <div className="h-3 w-16 animate-pulse rounded bg-[var(--muted)]" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-24 animate-pulse rounded-lg bg-[var(--muted)]"
                />
              ))}
            </div>
          </div>

          {/* Generate button */}
          <div className="h-9 w-40 animate-pulse rounded-lg bg-[var(--muted)]" />
        </div>

        {/* Templates row skeleton */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4"
            >
              <div className="h-4 w-36 animate-pulse rounded bg-[var(--muted)]" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-14 animate-pulse rounded-lg bg-[var(--muted)]"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
