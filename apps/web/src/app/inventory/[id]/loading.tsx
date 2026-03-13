import { Card } from "@/components/ui/card";

export default function PartDetailLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-8 gap-4">
          <div className="h-8 w-16 animate-pulse rounded-lg bg-[var(--muted)]" />
          <div>
            <div className="h-6 w-48 animate-pulse rounded bg-[var(--muted)]" />
            <div className="mt-1 h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
          </div>
        </div>
        <div className="flex px-8 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-24 animate-pulse rounded bg-[var(--muted)]" />
          ))}
        </div>
      </header>
      <div className="p-8">
        <Card>
          <div className="p-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded bg-[var(--muted)]" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
