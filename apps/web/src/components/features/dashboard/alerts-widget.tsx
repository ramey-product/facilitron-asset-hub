"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  Shield,
  Activity,
  Filter,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDashboardAlerts } from "@/hooks/use-dashboard";
import type { DashboardAlertType } from "@asset-hub/shared";

const ALERT_TYPES = [
  { value: "all", label: "All Alerts" },
  { value: "overdue_maintenance", label: "Overdue Maintenance" },
  { value: "poor_condition", label: "Poor Condition" },
  { value: "expired_warranty", label: "Expired Warranty" },
  { value: "expiring_warranty", label: "Expiring Soon" },
] as const;

const alertTypeConfig: Record<
  DashboardAlertType,
  { icon: typeof AlertTriangle; label: string; color: string }
> = {
  overdue_maintenance: {
    icon: Wrench,
    label: "Overdue Maintenance",
    color: "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
  },
  poor_condition: {
    icon: Activity,
    label: "Poor Condition",
    color: "bg-red-100 text-red-900 border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  },
  expired_warranty: {
    icon: Shield,
    label: "Expired Warranty",
    color: "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-500/10 dark:text-zinc-400 dark:border-zinc-500/20",
  },
  expiring_warranty: {
    icon: Clock,
    label: "Expiring Soon",
    color: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
};

const severityConfig: Record<
  "critical" | "warning" | "info",
  { color: string; label: string }
> = {
  critical: {
    color: "bg-red-100 text-red-900 border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    label: "Critical",
  },
  warning: {
    color: "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
    label: "Warning",
  },
  info: {
    color: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    label: "Info",
  },
};

interface AlertsWidgetProps {
  refetchInterval?: number;
  propertyId?: number | null;
}

export function AlertsWidget({ refetchInterval, propertyId }: AlertsWidgetProps) {
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const { data, isLoading } = useDashboardAlerts(
    filterType !== "all" ? filterType : undefined,
    refetchInterval,
    propertyId
  );

  const alerts = data?.data ?? [];

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            Assets Needing Attention
            {alerts.length > 0 && (
              <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-500/10 dark:text-red-400">
                {data?.meta.total ?? alerts.length}
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-7 rounded border border-[var(--border)] bg-[var(--muted)] px-2 text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              aria-label="Filter alert type"
            >
              {ALERT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-[var(--muted)]" />
            ))}
          </div>
        )}

        {!isLoading && alerts.length === 0 && (
          <div className="py-8 text-center">
            <AlertTriangle className="mx-auto h-7 w-7 text-[var(--muted-foreground)]" />
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              No alerts — fleet looks good!
            </p>
          </div>
        )}

        {!isLoading && alerts.length > 0 && (
          <div className="space-y-1.5">
            {alerts.slice(0, 8).map((alert) => {
              const typeConf = alertTypeConfig[alert.type] ?? alertTypeConfig.overdue_maintenance;
              const sevConf = severityConfig[alert.severity] ?? severityConfig.info;
              const TypeIcon = typeConf.icon;
              const isChecked = selectedIds.has(alert.id);

              return (
                <div
                  key={alert.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors",
                    isChecked
                      ? "bg-[var(--primary)]/5"
                      : "hover:bg-[var(--muted)]/50"
                  )}
                >
                  {/* Checkbox (non-functional UI) */}
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSelected(alert.id)}
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-[var(--border)] accent-[var(--primary)]"
                    aria-label={`Select alert for ${alert.assetName}`}
                  />

                  <TypeIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)]" />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-[var(--foreground)]">
                        {alert.assetName}
                      </span>
                      {alert.propertyName && (
                        <span className="text-[10px] text-[var(--muted-foreground)]">
                          {alert.propertyName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">{alert.message}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Badge className={cn("text-[10px] border", typeConf.color)}>
                        {typeConf.label}
                      </Badge>
                      <Badge className={cn("text-[10px] border", sevConf.color)}>
                        {sevConf.label}
                      </Badge>
                    </div>
                  </div>

                  <Link
                    href={`/assets/${alert.assetId}`}
                    className="shrink-0 text-xs text-[var(--primary)] hover:underline"
                  >
                    View
                  </Link>
                </div>
              );
            })}

            {(data?.meta.total ?? 0) > 8 && (
              <div className="pt-2 text-center">
                <Button variant="ghost" size="sm" className="text-xs text-[var(--muted-foreground)]">
                  View all {data?.meta.total} alerts
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
