"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-[var(--muted-foreground)]">{error.message}</p>
      <button onClick={reset} className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white">Retry</button>
    </div>
  );
}
