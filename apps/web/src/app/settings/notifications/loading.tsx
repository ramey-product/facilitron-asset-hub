export default function NotificationsLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80">
        <div className="flex h-16 items-center gap-3 px-8">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-[var(--muted)]" />
          <div className="space-y-1.5">
            <div className="h-5 w-56 animate-pulse rounded bg-[var(--muted)]" />
            <div className="h-3.5 w-64 animate-pulse rounded bg-[var(--muted)]" />
          </div>
        </div>
      </div>

      <div className="space-y-8 p-8">
        {/* Section heading */}
        <div className="h-4 w-48 animate-pulse rounded bg-[var(--muted)]" />

        {/* Preferences card */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          {/* Column header row */}
          <div className="flex items-center gap-4 border-b border-[var(--border)] bg-[var(--muted)]/40 px-4 py-2">
            <div className="h-3 w-9 animate-pulse rounded bg-[var(--muted)]" />
            <div className="h-3 w-32 animate-pulse rounded bg-[var(--muted)]" />
            <div className="ml-auto h-3 w-20 animate-pulse rounded bg-[var(--muted)]" />
          </div>
          {/* Preference rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-[var(--border)]/50 px-4 py-3.5"
            >
              <div className="h-5 w-9 animate-pulse rounded-full bg-[var(--muted)]" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-36 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-3 w-64 animate-pulse rounded bg-[var(--muted)]" />
              </div>
              <div className="h-8 w-28 animate-pulse rounded-md bg-[var(--muted)]" />
            </div>
          ))}
          {/* Footer */}
          <div className="flex justify-end px-4 py-3">
            <div className="h-8 w-32 animate-pulse rounded-md bg-[var(--muted)]" />
          </div>
        </div>

        {/* Email log section heading */}
        <div className="h-4 w-40 animate-pulse rounded bg-[var(--muted)]" />

        {/* Email log card */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-28 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-5 w-24 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-48 animate-pulse rounded bg-[var(--muted)]" />
              <div className="ml-auto h-5 w-16 animate-pulse rounded bg-[var(--muted)]" />
            </div>
          ))}
        </div>

        {/* Templates section heading */}
        <div className="h-4 w-36 animate-pulse rounded bg-[var(--muted)]" />

        {/* Template preview grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--muted)]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
