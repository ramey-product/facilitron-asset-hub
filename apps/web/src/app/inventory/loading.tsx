import { Card } from "@/components/ui/card";

export default function InventoryLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <div className="h-6 w-32 animate-pulse rounded bg-[var(--muted)]" />
            <div className="mt-1 h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
          </div>
          <div className="h-8 w-24 animate-pulse rounded-lg bg-[var(--muted)]" />
        </div>
      </header>
      <div className="flex">
        <aside className="hidden lg:block w-56 shrink-0 border-r border-[var(--border)] p-4">
          <div className="h-4 w-20 animate-pulse rounded bg-[var(--muted)] mb-3" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-full animate-pulse rounded bg-[var(--muted)] mb-1" />
          ))}
        </aside>
        <div className="flex-1 p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-80 animate-pulse rounded-lg bg-[var(--muted)]" />
          </div>
          <Card>
            <div className="p-4 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-4 w-16 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-48 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-20 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-5 w-16 animate-pulse rounded-md bg-[var(--muted)]" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
