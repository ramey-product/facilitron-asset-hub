export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] p-8 space-y-6">
      <div className="h-8 w-48 animate-pulse rounded bg-[var(--muted)]" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-[var(--muted)]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-36 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-3 w-64 animate-pulse rounded bg-[var(--muted)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
