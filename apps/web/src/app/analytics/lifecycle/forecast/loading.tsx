export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] p-8 space-y-6">
      <div className="h-8 w-64 animate-pulse rounded bg-[var(--muted)]" />
      <div className="h-72 animate-pulse rounded-xl bg-[var(--muted)]" />
      <div className="h-64 animate-pulse rounded-xl bg-[var(--muted)]" />
    </div>
  );
}
