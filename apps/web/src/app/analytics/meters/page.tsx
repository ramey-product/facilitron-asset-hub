"use client";

import Link from "next/link";
import { Gauge, AlertTriangle, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMeterAlerts } from "@/hooks/use-meters";
import type { MeterAlert, MeterAlertStatus } from "@asset-hub/shared";

function alertStatusBadge(status: MeterAlertStatus) {
  const config: Record<MeterAlertStatus, { label: string; classes: string }> = {
    exceeded: {
      label: "Exceeded",
      classes: "bg-red-100 text-red-900 border-red-300 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20",
    },
    approaching: {
      label: "Approaching",
      classes: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20",
    },
    overdue_reading: {
      label: "Overdue Reading",
      classes: "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/20",
    },
  };
  const { label, classes } = config[status];
  return <Badge className={cn("text-[10px] border", classes)}>{label}</Badge>;
}

function percentBar(pct: number | null) {
  if (pct === null) return null;
  const capped = Math.min(pct, 150);
  const color =
    pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-[var(--muted)]">
        <div
          className={cn("h-1.5 rounded-full transition-all", color)}
          style={{ width: `${(capped / 150) * 100}%` }}
        />
      </div>
      <span className={cn("text-xs font-semibold tabular-nums", pct >= 100 ? "text-red-600 dark:text-red-400" : pct >= 80 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>
        {pct}%
      </span>
    </div>
  );
}

function AlertCard({ alert }: { alert: MeterAlert }) {
  return (
    <Link href={`/assets/${alert.assetId}/meters`} className="block">
      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5 transition-all cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              {alertStatusBadge(alert.status)}
              <span className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">
                {alert.categoryName ?? "—"}
              </span>
            </div>
            <p className="text-sm font-semibold text-[var(--foreground)] truncate">{alert.assetName}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {alert.meterType.charAt(0).toUpperCase() + alert.meterType.slice(1)} meter
              &nbsp;·&nbsp;
              {alert.currentReading.toLocaleString()} {alert.unit}
              {alert.thresholdValue !== null && (
                <> of {alert.thresholdValue.toLocaleString()} {alert.unit} threshold</>
              )}
            </p>
            {alert.status === "overdue_reading" && alert.daysSinceReading !== null && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                Last reading {alert.daysSinceReading} days ago
              </p>
            )}
            {percentBar(alert.percentOfThreshold)}
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-[var(--muted-foreground)] mt-1" />
        </div>
      </div>
    </Link>
  );
}

export default function MeterAlertsPage() {
  const { data, isLoading } = useMeterAlerts();
  const alerts = data?.data ?? [];

  const exceeded = alerts.filter((a) => a.status === "exceeded");
  const approaching = alerts.filter((a) => a.status === "approaching");
  const overdue = alerts.filter((a) => a.status === "overdue_reading");
  const totalWithThreshold = alerts.filter((a) => a.thresholdValue !== null).length;
  const complianceRate =
    totalWithThreshold > 0
      ? Math.round(((totalWithThreshold - exceeded.length) / totalWithThreshold) * 100)
      : 100;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center gap-4 px-8">
          <Gauge className="h-5 w-5 text-[var(--primary)]" />
          <h1 className="text-xl font-bold text-[var(--foreground)]">Meter Alerts</h1>
          <span className="text-sm text-[var(--muted-foreground)]">
            Threshold monitoring &amp; overdue readings
          </span>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-400/10">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--foreground)]">
                    {isLoading ? "—" : exceeded.length}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">Thresholds Exceeded</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-400/10">
                  <Gauge className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--foreground)]">
                    {isLoading ? "—" : approaching.length}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">Approaching Threshold</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-400/10">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--foreground)]">
                    {isLoading ? "—" : overdue.length}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">Overdue Readings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-400/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--foreground)]">
                    {isLoading ? "—" : `${complianceRate}%`}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">Compliance Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exceeded */}
        {exceeded.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Exceeded ({exceeded.length})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {exceeded.map((a) => <AlertCard key={a.id} alert={a} />)}
            </div>
          </section>
        )}

        {/* Approaching */}
        {approaching.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Approaching Threshold ({approaching.length})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {approaching.map((a) => <AlertCard key={a.id} alert={a} />)}
            </div>
          </section>
        )}

        {/* Overdue readings */}
        {overdue.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Overdue Readings ({overdue.length})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {overdue.map((a) => <AlertCard key={a.id} alert={a} />)}
            </div>
          </section>
        )}

        {!isLoading && alerts.length === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-16 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
            <p className="text-lg font-semibold text-[var(--foreground)]">All meters in compliance</p>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">No threshold alerts or overdue readings at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
