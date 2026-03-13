export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="sticky top-0 z-30 h-16 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md" />
      <div className="p-8 max-w-3xl mx-auto space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-[var(--muted)]" />
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
          <div className="h-9 w-full animate-pulse rounded-lg bg-[var(--muted)]" />
          <div className="h-4 w-64 animate-pulse rounded bg-[var(--muted)]" />
        </div>
      </div>
    </div>
  );
}
