import { Card, CardContent } from "@/components/ui/card";

export default function VendorsLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-8">
          <div>
            <div className="h-6 w-40 animate-pulse rounded bg-[var(--muted)]" />
            <div className="mt-1 h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
          </div>
        </div>
      </header>
      <div className="p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-80 animate-pulse rounded-lg bg-[var(--muted)]" />
          <div className="h-9 w-36 animate-pulse rounded-lg bg-[var(--muted)]" />
          <div className="h-9 w-28 animate-pulse rounded-lg bg-[var(--muted)]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5 space-y-3">
                <div className="h-5 w-36 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-4 w-48 animate-pulse rounded bg-[var(--muted)]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
