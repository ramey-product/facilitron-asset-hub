"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <div className="text-center space-y-4">
        <p className="text-sm text-[var(--destructive)]">{error.message}</p>
        <button
          onClick={reset}
          className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm text-white"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
