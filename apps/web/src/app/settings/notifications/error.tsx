"use client";

export default function NotificationsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
        <svg
          className="h-6 w-6 text-red-600 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-base font-semibold text-[var(--foreground)]">
          Failed to load Notification Preferences
        </p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {error.message || "An unexpected error occurred. Make sure the API server is running on port 3001."}
        </p>
      </div>
      <button
        onClick={reset}
        className="rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
      >
        Try Again
      </button>
    </div>
  );
}
