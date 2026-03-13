import { Suspense } from "react";
import { ImportWizard } from "@/components/features/import/ImportWizard";

export const metadata = {
  title: "Import Assets | Asset Hub",
  description: "Bulk import assets from CSV or Excel files",
};

function ImportPageSkeleton() {
  return (
    <div className="space-y-8 p-8">
      {/* Progress bar skeleton */}
      <div className="flex items-center justify-between px-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--muted)]" />
              <div className="h-3 w-12 animate-pulse rounded bg-[var(--muted)]" />
            </div>
            {i < 4 && <div className="mx-3 h-0.5 flex-1 rounded-full bg-[var(--muted)]" />}
          </div>
        ))}
      </div>
      {/* Content skeleton */}
      <div className="flex flex-col items-center gap-4 pt-12">
        <div className="h-14 w-14 animate-pulse rounded-full bg-[var(--muted)]" />
        <div className="h-5 w-48 animate-pulse rounded bg-[var(--muted)]" />
        <div className="h-4 w-72 animate-pulse rounded bg-[var(--muted)]" />
        <div className="mt-4 h-40 w-full max-w-xl animate-pulse rounded-xl border-2 border-dashed border-[var(--muted)] bg-[var(--muted)]/30" />
      </div>
    </div>
  );
}

export default function ImportPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-lg font-bold text-[var(--foreground)]">Bulk Import</h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              Import assets from CSV or Excel files
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl p-8">
        <Suspense fallback={<ImportPageSkeleton />}>
          <ImportWizard />
        </Suspense>
      </div>
    </div>
  );
}
