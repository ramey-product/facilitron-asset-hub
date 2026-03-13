export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] p-8 space-y-4">
      <div className="h-8 w-56 animate-pulse rounded bg-[var(--muted)]" />
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-[var(--border)]/50">
            <div className="h-4 w-40 animate-pulse rounded bg-[var(--muted)]" />
            <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
            <div className="h-5 w-20 animate-pulse rounded bg-[var(--muted)]" />
            <div className="ml-auto h-4 w-20 animate-pulse rounded bg-[var(--muted)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
