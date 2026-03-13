export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 h-16 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md" />

      <div className="mx-auto max-w-3xl space-y-6 p-8">
        {/* Search box skeleton */}
        <div className="h-12 w-full animate-pulse rounded-xl bg-[var(--muted)]" />

        {/* Filter toggles skeleton */}
        <div className="h-12 w-full animate-pulse rounded-xl bg-[var(--muted)]" />

        {/* Empty prompt skeleton */}
        <div className="flex flex-col items-center gap-3 py-16">
          <div className="h-14 w-14 animate-pulse rounded-full bg-[var(--muted)]" />
          <div className="h-4 w-72 animate-pulse rounded bg-[var(--muted)]" />
        </div>
      </div>
    </div>
  );
}
