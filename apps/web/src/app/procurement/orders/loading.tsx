export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="sticky top-0 z-30 h-16 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md" />
      <div className="p-8 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="h-9 w-64 animate-pulse rounded-lg bg-[var(--muted)]" />
          <div className="h-9 w-36 animate-pulse rounded-lg bg-[var(--muted)]" />
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="p-4 space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-4 w-36 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-5 w-20 animate-pulse rounded-md bg-[var(--muted)]" />
                <div className="h-4 w-16 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
