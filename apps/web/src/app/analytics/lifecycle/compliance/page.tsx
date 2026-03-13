"use client";

import Link from "next/link";
import { ArrowLeft, AlertTriangle, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLifecycleCompliance } from "@/hooks/use-lifecycle";
import type { LifecycleStage, ComplianceRecord } from "@asset-hub/shared";

const STAGE_LABELS: Record<LifecycleStage, string> = {
  Procurement: "Procurement",
  Active: "Active",
  UnderMaintenance: "Under Maintenance",
  ScheduledForReplacement: "Sched. Replacement",
  Disposed: "Disposed",
};

function StageBadge({ stage }: { stage: LifecycleStage }) {
  const classes: Record<LifecycleStage, string> = {
    Procurement: "bg-blue-100 text-blue-800 dark:bg-blue-400/10 dark:text-blue-400",
    Active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-400",
    UnderMaintenance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-400/10 dark:text-yellow-400",
    ScheduledForReplacement: "bg-orange-100 text-orange-800 dark:bg-orange-400/10 dark:text-orange-400",
    Disposed: "bg-zinc-100 text-zinc-700 dark:bg-zinc-400/10 dark:text-zinc-400",
  };
  return (
    <Badge className={cn("text-[10px]", classes[stage])}>
      {STAGE_LABELS[stage]}
    </Badge>
  );
}

function exportCSV(records: ComplianceRecord[]) {
  const headers = ["Asset", "Category", "Stage", "Days In Stage", "Max Expected Days", "Overdue", "Last Transition", "Next Expected"];
  const rows = records.map((r) => [
    r.assetName,
    r.categoryName,
    r.currentStage,
    r.daysInStage,
    r.expectedMaxDays,
    r.isOverdue ? "Yes" : "No",
    r.lastTransitionDate,
    r.nextExpectedTransition ?? "—",
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lifecycle-compliance-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function LifecycleCompliancePage() {
  const { data, isLoading, isError } = useLifecycleCompliance();
  const records = data?.data ?? [];

  const overdueCount = records.filter((r) => r.isOverdue).length;
  const atRiskCount = records.filter((r) => !r.isOverdue && r.daysInStage / r.expectedMaxDays > 0.75).length;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <Link href="/analytics/lifecycle" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">Lifecycle Compliance</h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                Assets exceeding expected stage durations
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCSV(records)}
            disabled={records.length === 0}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </header>

      <div className="p-8 space-y-5">
        {/* Summary banner */}
        {(overdueCount > 0 || atRiskCount > 0) && (
          <div className={cn(
            "flex items-center gap-3 rounded-lg border px-4 py-3",
            overdueCount > 0
              ? "border-red-300 bg-red-50 dark:border-red-400/30 dark:bg-red-400/5"
              : "border-yellow-300 bg-yellow-50 dark:border-yellow-400/30 dark:bg-yellow-400/5"
          )}>
            <AlertTriangle className={cn(
              "h-4 w-4 shrink-0",
              overdueCount > 0 ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"
            )} />
            <p className="text-sm">
              {overdueCount > 0 && (
                <span className="font-semibold text-red-700 dark:text-red-400">
                  {overdueCount} asset{overdueCount !== 1 ? "s" : ""} overdue
                </span>
              )}
              {overdueCount > 0 && atRiskCount > 0 && " · "}
              {atRiskCount > 0 && (
                <span className="font-semibold text-yellow-700 dark:text-yellow-400">
                  {atRiskCount} asset{atRiskCount !== 1 ? "s" : ""} at risk (75%+ of max duration)
                </span>
              )}
            </p>
          </div>
        )}

        {/* Compliance table */}
        {isLoading ? (
          <Card>
            <div className="p-4 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-4 w-40 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-20 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-5 w-28 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="ml-auto h-4 w-16 animate-pulse rounded bg-[var(--muted)]" />
                </div>
              ))}
            </div>
          </Card>
        ) : isError ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-sm text-[var(--destructive)]">Failed to load compliance data.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Asset</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Current Stage</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Days in Stage</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Max Expected</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Progress</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Last Transition</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => {
                    const pct = Math.min(100, Math.round((record.daysInStage / record.expectedMaxDays) * 100));
                    const isAtRisk = !record.isOverdue && pct >= 75;
                    return (
                      <tr
                        key={record.assetId}
                        className={cn(
                          "border-b border-[var(--border)]/50 transition-colors",
                          record.isOverdue
                            ? "bg-red-50/50 dark:bg-red-400/5 hover:bg-red-50 dark:hover:bg-red-400/10"
                            : isAtRisk
                            ? "bg-yellow-50/50 dark:bg-yellow-400/5 hover:bg-yellow-50 dark:hover:bg-yellow-400/10"
                            : "hover:bg-[var(--muted)]/50"
                        )}
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/assets/${record.assetId}`}
                            className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                          >
                            {record.assetName}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                          {record.categoryName}
                        </td>
                        <td className="px-4 py-3">
                          <StageBadge stage={record.currentStage} />
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-[var(--foreground)]">
                          {record.daysInStage.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-[var(--muted-foreground)]">
                          {record.expectedMaxDays.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-24 rounded-full bg-[var(--muted)] overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  record.isOverdue ? "bg-red-500" : pct >= 75 ? "bg-yellow-500" : "bg-emerald-500"
                                )}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className={cn(
                              "text-[10px] font-medium",
                              record.isOverdue ? "text-red-600 dark:text-red-400" : pct >= 75 ? "text-yellow-600 dark:text-yellow-400" : "text-[var(--muted-foreground)]"
                            )}>
                              {pct}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                          {new Date(record.lastTransitionDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {record.isOverdue ? (
                            <Badge className="text-[10px] bg-red-100 text-red-800 dark:bg-red-400/10 dark:text-red-400">
                              Overdue
                            </Badge>
                          ) : isAtRisk ? (
                            <Badge className="text-[10px] bg-yellow-100 text-yellow-800 dark:bg-yellow-400/10 dark:text-yellow-400">
                              At Risk
                            </Badge>
                          ) : (
                            <Badge className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-400">
                              On Track
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-sm text-[var(--muted-foreground)]">
                        No compliance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
