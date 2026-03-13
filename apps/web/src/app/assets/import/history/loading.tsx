export default function ImportHistoryLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-8">
          <div>
            <div className="h-5 w-28 animate-pulse rounded bg-[var(--muted)]" />
            <div className="mt-1 h-3 w-36 animate-pulse rounded bg-[var(--muted)]" />
          </div>
        </div>
      </header>

      <div className="p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-[var(--muted)]" />
          <div className="h-8 w-28 animate-pulse rounded-lg bg-[var(--muted)]" />
        </div>
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="bg-[var(--muted)] p-3">
            <div className="flex items-center gap-8">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-3 w-16 animate-pulse rounded bg-[var(--muted-foreground)]/20" />
              ))}
            </div>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8 border-t border-[var(--border)] p-3">
              <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-20 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-16 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-12 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-12 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-12 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-5 w-16 animate-pulse rounded-md bg-[var(--muted)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
