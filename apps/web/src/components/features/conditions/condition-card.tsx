"use client";

import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, getConditionBg } from "@/lib/utils";
import type { ConditionStats } from "@/hooks/use-conditions";

interface ConditionCardProps {
  assetId: number;
  stats: ConditionStats | null;
}

export function ConditionCard({ stats }: ConditionCardProps) {
  if (!stats) {
    return (
      <Card>
        <CardContent className="p-5 text-center">
          <Activity className="mx-auto h-6 w-6 text-[var(--muted-foreground)]" />
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            No condition data yet
          </p>
        </CardContent>
      </Card>
    );
  }

  const TrendIcon =
    stats.trend === "improving"
      ? TrendingUp
      : stats.trend === "declining"
        ? TrendingDown
        : Minus;

  const trendColor =
    stats.trend === "improving"
      ? "text-emerald-500"
      : stats.trend === "declining"
        ? "text-red-500"
        : "text-[var(--muted-foreground)]";

  const trendLabel =
    stats.trend === "improving"
      ? "Improving"
      : stats.trend === "declining"
        ? "Declining"
        : "Stable";

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Condition
          </h3>
          <Badge
            className={cn(
              "text-[10px] border",
              getConditionBg(stats.currentLabel)
            )}
          >
            {stats.currentLabel}
          </Badge>
        </div>

        {/* Score display */}
        <div className="flex items-end gap-3">
          <div className="text-4xl font-bold text-[var(--foreground)]">
            {stats.currentScore}
          </div>
          <div className="mb-1 text-xs text-[var(--muted-foreground)]">
            / 5
          </div>
          <div className={cn("mb-1 flex items-center gap-1 ml-auto", trendColor)}>
            <TrendIcon className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{trendLabel}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border)]">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
              Average
            </div>
            <div className="text-sm font-medium text-[var(--foreground)]">
              {stats.averageScore.toFixed(1)}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
              Assessments
            </div>
            <div className="text-sm font-medium text-[var(--foreground)]">
              {stats.totalLogs}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
              Previous
            </div>
            <div className="text-sm font-medium text-[var(--foreground)]">
              {stats.previousScore ?? "—"}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
              Last Logged
            </div>
            <div className="text-sm font-medium text-[var(--foreground)]">
              {new Date(stats.lastLoggedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
