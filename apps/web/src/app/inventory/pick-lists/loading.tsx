import { Card } from "@/components/ui/card";

export default function PickListsLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header skeleton */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-lg bg-[var(--muted)]" />
            <div>
              <div className="h-5 w-36 animate-pulse rounded bg-[var(--muted)]" />
              <div className="mt-1 h-3 w-56 animate-pulse rounded bg-[var(--muted)]" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-20 animate-pulse rounded-lg bg-[var(--muted)]" />
            <div className="h-8 w-32 animate-pulse rounded-lg bg-[var(--muted)]" />
          </div>
        </div>
      </header>

      <div className="space-y-8 p-8">
        {/* Active lists section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="h-5 w-28 animate-pulse rounded bg-[var(--muted)]" />
            <div className="h-3 w-12 animate-pulse rounded bg-[var(--muted)]" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--muted)]"
              />
            ))}
          </div>
        </section>

        {/* History section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="h-5 w-36 animate-pulse rounded bg-[var(--muted)]" />
            <div className="h-3 w-12 animate-pulse rounded bg-[var(--muted)]" />
          </div>
          <Card>
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-4 w-48 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-12 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
