export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-8">
          <div className="h-6 w-40 animate-pulse rounded bg-[var(--muted)]" />
        </div>
      </div>
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-64 border-r border-[var(--border)] p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded bg-[var(--muted)]" />
          ))}
        </div>
        <div className="flex-1 p-6">
          <div className="h-full animate-pulse rounded-xl bg-[var(--muted)]" />
        </div>
      </div>
    </div>
  );
}
