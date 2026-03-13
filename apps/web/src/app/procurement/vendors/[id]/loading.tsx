import { Card } from "@/components/ui/card";

export default function VendorDetailLoading() {
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
      </header>
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="p-6 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 w-full animate-pulse rounded bg-[var(--muted)]" />
              ))}
            </div>
          </Card>
          <Card>
            <div className="p-6 space-y-3">
              <div className="h-4 w-20 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-6 w-32 animate-pulse rounded bg-[var(--muted)]" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
