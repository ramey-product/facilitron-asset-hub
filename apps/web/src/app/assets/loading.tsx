import { Card } from "@/components/ui/card";

export default function AssetsLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header skeleton */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <div className="h-6 w-32 animate-pulse rounded bg-[var(--muted)]" />
            <div className="mt-1 h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-20 animate-pulse rounded-lg bg-[var(--muted)]" />
            <div className="h-8 w-20 animate-pulse rounded-lg bg-[var(--muted)]" />
            <div className="h-8 w-24 animate-pulse rounded-lg bg-[var(--muted)]" />
          </div>
        </div>
      </header>

      <div className="p-8 space-y-4">
        {/* Filters skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-80 animate-pulse rounded-lg bg-[var(--muted)]" />
          <div className="h-9 w-36 animate-pulse rounded-lg bg-[var(--muted)]" />
          <div className="h-9 w-36 animate-pulse rounded-lg bg-[var(--muted)]" />
          <div className="h-9 w-36 animate-pulse rounded-lg bg-[var(--muted)]" />
        </div>

        {/* Table skeleton */}
        <Card>
          <div className="p-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-20 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-4 w-48 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-5 w-16 animate-pulse rounded-md bg-[var(--muted)]" />
                <div className="h-4 w-20 animate-pulse rounded bg-[var(--muted)]" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
