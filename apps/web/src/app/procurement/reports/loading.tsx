export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="sticky top-0 z-30 h-16 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md" />
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-2">
              <div className="h-4 w-28 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-8 w-36 animate-pulse rounded bg-[var(--muted)]" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
              <div className="h-5 w-36 animate-pulse rounded bg-[var(--muted)] mb-4" />
              <div className="h-64 w-full animate-pulse rounded bg-[var(--muted)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
