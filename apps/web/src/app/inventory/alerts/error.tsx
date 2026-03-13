"use client";

export default function AlertsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <p className="text-sm text-[var(--muted-foreground)]">
        Failed to load reorder alerts: {error.message}
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        Retry
      </button>
    </div>
  );
}
