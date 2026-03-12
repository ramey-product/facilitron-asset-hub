"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, getConditionBg } from "@/lib/utils";
import { useConditionHistory } from "@/hooks/use-conditions";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const scoreLabels: Record<number, string> = {
  5: "Excellent",
  4: "Good",
  3: "Fair",
  2: "Poor",
  1: "Critical",
};

const sourceLabels: Record<string, string> = {
  manual: "Manual",
  inspection: "Inspection",
  work_order: "Work Order",
};

interface ConditionHistoryProps {
  assetId: number;
}

export function ConditionHistory({ assetId }: ConditionHistoryProps) {
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const { data, isLoading } = useConditionHistory(assetId, { limit, offset });

  const logs = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 0;
  const currentPage = meta?.page ?? 1;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-5 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-16 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-48 animate-pulse rounded bg-[var(--muted)]" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            No condition assessments recorded yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">
          Condition History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Date
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Score
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Change
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Source
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const change =
                  log.previousScore !== null
                    ? log.conditionScore - log.previousScore
                    : null;
                return (
                  <tr
                    key={log.id}
                    className="border-b border-[var(--border)]/50"
                  >
                    <td className="px-3 py-2 text-xs text-[var(--muted-foreground)]">
                      {new Date(log.loggedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-3 py-2">
                      <Badge
                        className={cn(
                          "text-[10px] border",
                          getConditionBg(
                            scoreLabels[log.conditionScore] ?? "Unknown"
                          )
                        )}
                      >
                        {log.conditionScore} — {scoreLabels[log.conditionScore]}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      {change !== null && change !== 0 ? (
                        <span
                          className={cn(
                            "text-xs font-medium",
                            change > 0
                              ? "text-emerald-500"
                              : "text-red-500"
                          )}
                        >
                          {change > 0 ? `+${change}` : change}
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {change === 0 ? "—" : "Initial"}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-[var(--muted-foreground)]">
                      {sourceLabels[log.source] ?? log.source}
                    </td>
                    <td className="px-3 py-2 text-xs text-[var(--muted-foreground)] max-w-xs truncate">
                      {log.notes ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--muted-foreground)]">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={offset === 0}
                onClick={() => setOffset((o) => Math.max(0, o - limit))}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setOffset((o) => o + limit)}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
