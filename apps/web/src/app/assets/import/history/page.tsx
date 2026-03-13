import { Suspense } from "react";
import { ImportHistoryClient } from "./client";

export const metadata = {
  title: "Import History | Asset Hub",
  description: "View past bulk asset imports",
};

function HistorySkeleton() {
  return (
    <div className="p-8 space-y-4">
      <div className="flex items-center gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border border-[var(--border)] p-4">
          <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
          <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
          <div className="h-4 w-16 animate-pulse rounded bg-[var(--muted)]" />
          <div className="h-4 w-16 animate-pulse rounded bg-[var(--muted)]" />
          <div className="h-4 w-20 animate-pulse rounded bg-[var(--muted)]" />
        </div>
      ))}
    </div>
  );
}

export default function ImportHistoryPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-lg font-bold text-[var(--foreground)]">Import History</h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              Past bulk asset imports
            </p>
          </div>
        </div>
      </header>

      <Suspense fallback={<HistorySkeleton />}>
        <ImportHistoryClient />
      </Suspense>
    </div>
  );
}
