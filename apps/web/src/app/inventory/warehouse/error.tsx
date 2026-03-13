"use client";

import { Warehouse } from "lucide-react";

export default function WarehouseError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--destructive)]/20 bg-[var(--destructive)]/10">
        <Warehouse className="h-6 w-6 text-[var(--destructive)]" />
      </div>
      <div className="text-center">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          Failed to load Warehouse Operations
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {error.message || "An unexpected error occurred."}
        </p>
      </div>
      <button
        onClick={reset}
        className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
      >
        Retry
      </button>
    </div>
  );
}
