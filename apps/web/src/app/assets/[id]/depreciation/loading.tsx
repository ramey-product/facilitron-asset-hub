export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-8"><div className="h-6 w-48 animate-pulse rounded bg-[var(--muted)]" /></div>
      </div>
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => (<div key={i} className="h-24 animate-pulse rounded-xl bg-[var(--muted)]" />))}</div>
        <div className="h-64 animate-pulse rounded-xl bg-[var(--muted)]" />
        <div className="h-64 animate-pulse rounded-xl bg-[var(--muted)]" />
      </div>
    </div>
  );
}
