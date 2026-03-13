import { Card } from "@/components/ui/card";

export default function WarehouseLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header skeleton */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-lg bg-[var(--muted)]" />
            <div>
              <div className="h-5 w-52 animate-pulse rounded bg-[var(--muted)]" />
              <div className="mt-1 h-3 w-36 animate-pulse rounded bg-[var(--muted)]" />
            </div>
          </div>
          <div className="h-8 w-28 animate-pulse rounded-lg bg-[var(--muted)]" />
        </div>
      </header>

      <div className="space-y-6 p-8">
        {/* Quick action buttons */}
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-32 animate-pulse rounded-md bg-[var(--muted)]" />
          ))}
        </div>

        {/* Stats strip */}
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 w-36 animate-pulse rounded-lg border border-[var(--border)] bg-[var(--muted)]" />
          ))}
        </div>

        {/* Tab bar */}
        <div className="h-9 w-64 animate-pulse rounded-lg bg-[var(--muted)]" />

        {/* Filter pills */}
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-6 w-20 animate-pulse rounded-full bg-[var(--muted)]" />
          ))}
        </div>

        {/* Table skeleton */}
        <Card>
          <div className="p-4 space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-5 w-16 animate-pulse rounded-md bg-[var(--muted)]" />
                <div className="h-4 w-40 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-4 w-28 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-4 w-12 animate-pulse rounded bg-[var(--muted)] ml-auto" />
                <div className="h-4 w-20 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
