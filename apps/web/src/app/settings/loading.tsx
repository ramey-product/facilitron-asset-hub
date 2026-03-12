export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-8">
          <div className="space-y-1.5">
            <div className="h-5 w-24 rounded-lg bg-[var(--muted)]/40 animate-pulse" />
            <div className="h-3.5 w-56 rounded-lg bg-[var(--muted)]/30 animate-pulse" />
          </div>
        </div>
        {/* Tabs skeleton */}
        <div className="flex items-center gap-1 px-8 pb-3">
          {[120, 140, 140, 100, 140].map((w, i) => (
            <div
              key={i}
              className="h-8 rounded-lg bg-[var(--muted)]/30 animate-pulse"
              style={{ width: w }}
            />
          ))}
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-8 space-y-4 max-w-2xl">
        <div className="h-6 w-40 rounded-lg bg-[var(--muted)]/40 animate-pulse" />
        <div className="h-4 w-80 rounded-lg bg-[var(--muted)]/30 animate-pulse" />
        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-16 rounded-xl bg-[var(--muted)]/30 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
