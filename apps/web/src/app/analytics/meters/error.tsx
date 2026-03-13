"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--background)]">
      <p className="text-[var(--muted-foreground)]">Failed to load meter alerts: {error.message}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary)]/90"
      >
        Retry
      </button>
    </div>
  );
}
