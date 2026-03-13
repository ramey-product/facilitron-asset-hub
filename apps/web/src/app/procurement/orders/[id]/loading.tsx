export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="sticky top-0 z-30 h-16 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md" />
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-[var(--muted)]" />
          <div className="space-y-1.5">
            <div className="h-7 w-48 animate-pulse rounded bg-[var(--muted)]" />
            <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-20 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-5 w-28 animate-pulse rounded bg-[var(--muted)]" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-48 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-16 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-20 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-20 animate-pulse rounded bg-[var(--muted)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
