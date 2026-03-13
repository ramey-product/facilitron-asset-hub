import { Card } from "@/components/ui/card";

export default function StockMatrixLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-8">
          <div>
            <div className="h-6 w-32 animate-pulse rounded bg-[var(--muted)]" />
            <div className="mt-1 h-4 w-48 animate-pulse rounded bg-[var(--muted)]" />
          </div>
        </div>
      </header>
      <div className="p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-80 animate-pulse rounded-lg bg-[var(--muted)]" />
          <div className="h-9 w-36 animate-pulse rounded-lg bg-[var(--muted)]" />
        </div>
        <Card>
          <div className="p-4 space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-16 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-4 w-40 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-8 w-12 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-8 w-12 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-8 w-12 animate-pulse rounded bg-[var(--muted)]" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
