export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-8">
          <div className="h-6 w-48 animate-pulse rounded bg-[var(--muted)]" />
        </div>
      </div>
      <div className="p-8 space-y-6">
        <div className="h-10 w-64 animate-pulse rounded bg-[var(--muted)]" />
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-[var(--border)]/50">
              <div className="h-4 w-40 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-5 w-20 animate-pulse rounded bg-[var(--muted)]" />
              <div className="ml-auto h-4 w-28 animate-pulse rounded bg-[var(--muted)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
