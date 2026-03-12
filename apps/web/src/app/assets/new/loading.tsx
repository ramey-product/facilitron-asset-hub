import { Card, CardContent } from "@/components/ui/card";

export default function NewAssetLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-8 gap-4">
          <div className="h-8 w-16 animate-pulse rounded bg-[var(--muted)]" />
          <div className="h-6 w-40 animate-pulse rounded bg-[var(--muted)]" />
        </div>
      </header>
      <div className="mx-auto max-w-3xl p-8 space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5 space-y-4">
              <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-9 w-full animate-pulse rounded-lg bg-[var(--muted)]" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-9 animate-pulse rounded-lg bg-[var(--muted)]" />
                <div className="h-9 animate-pulse rounded-lg bg-[var(--muted)]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
