export default function KitDetailLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="h-8 w-64 animate-pulse rounded-lg bg-[var(--muted)]" />
      <div className="h-40 animate-pulse rounded-lg bg-[var(--muted)]" />
      <div className="h-64 animate-pulse rounded-lg bg-[var(--muted)]" />
    </div>
  );
}
