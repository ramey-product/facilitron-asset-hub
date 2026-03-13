"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useConsumption } from "@/hooks/use-consumption";

interface ConsumptionHistoryProps {
  partId: number;
}

export function ConsumptionHistory({ partId }: ConsumptionHistoryProps) {
  const { data, isLoading, isError } = useConsumption({ partId, limit: 50 });
  const records = data?.data ?? [];

  if (isLoading) {
    return (
      <Card>
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-20 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-12 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-sm text-[var(--destructive)]">Failed to load consumption history.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Consumption History</h3>
          <p className="text-xs text-[var(--muted-foreground)]">{records.length} records</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">WO #</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Date</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Qty</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Location</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Technician</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Cost</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  key={record.id}
                  className={cn(
                    "border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/50 transition-colors",
                    record.isReversed && "opacity-50"
                  )}
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`#wo-${record.workOrderId}`}
                      className={cn(
                        "text-sm font-medium text-[var(--primary)] hover:underline",
                        record.isReversed && "line-through"
                      )}
                    >
                      {record.workOrderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs text-[var(--muted-foreground)]", record.isReversed && "line-through")}>
                      {formatDate(record.loggedAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn("text-sm font-medium text-[var(--foreground)]", record.isReversed && "line-through")}>
                      {record.qty}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs text-[var(--muted-foreground)]", record.isReversed && "line-through")}>
                      {record.locationName}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs text-[var(--muted-foreground)]", record.isReversed && "line-through")}>
                      {record.loggedBy}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn("text-sm text-[var(--foreground)]", record.isReversed && "line-through")}>
                      {formatCurrency(record.totalCost)}
                    </span>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-[var(--muted-foreground)]">
                    No consumption records for this part.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
