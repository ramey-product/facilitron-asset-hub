"use client";

import Link from "next/link";

export default function KitDetailError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <p className="text-sm text-[var(--muted-foreground)]">
        Failed to load kit: {error.message}
      </p>
      <div className="flex gap-2">
        <button
          onClick={reset}
          className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Retry
        </button>
        <Link
          href="/inventory/kits"
          className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)]"
        >
          Back to Kits
        </Link>
      </div>
    </div>
  );
}
