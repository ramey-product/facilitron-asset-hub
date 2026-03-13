export default function TransfersLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-[var(--muted)]" />
      <div className="h-96 animate-pulse rounded-lg bg-[var(--muted)]" />
    </div>
  );
}
