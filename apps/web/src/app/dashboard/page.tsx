"use client";

import { useState, useCallback } from "react";
import { RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useScope } from "@/components/layout/scope-provider";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { KpiCards } from "@/components/features/dashboard/kpi-cards";
import { StatusDonutChart } from "@/components/features/dashboard/status-donut-chart";
import { CategoryBreakdown } from "@/components/features/dashboard/category-breakdown";
import { AlertsWidget } from "@/components/features/dashboard/alerts-widget";
import { ActivityFeed } from "@/components/features/dashboard/activity-feed";
import { QuickActions } from "@/components/features/dashboard/quick-actions";
import { useQueryClient } from "@tanstack/react-query";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export default function DashboardPage() {
  const { propertyID, selectedProperty } = useScope();
  const queryClient = useQueryClient();
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const { data, isLoading, isError } = useDashboardStats(REFRESH_INTERVAL_MS, propertyID);
  const stats = data?.data;

  const handleManualRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    setLastRefreshed(new Date());
  }, [queryClient]);

  const timeSinceRefresh = () => {
    const diffMs = Date.now() - lastRefreshed.getTime();
    const diffMins = Math.floor(diffMs / 60_000);
    if (diffMins < 1) return "just now";
    if (diffMins === 1) return "1m ago";
    return `${diffMins}m ago`;
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
              <span>Asset Hub</span>
              <span>/</span>
              <span className="text-[var(--foreground)]">Dashboard</span>
            </nav>
            <h1 className="text-xl font-bold text-[var(--foreground)]">Asset Hub</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              {selectedProperty
                ? `${selectedProperty.name} — ${selectedProperty.city}, ${selectedProperty.state}`
                : `All Properties${stats ? ` · ${stats.totalProperties} sites` : ""}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Role badge */}
            <Badge className="border border-[var(--border)] bg-[var(--muted)] text-xs text-[var(--muted-foreground)]">
              OrderAdministrator
            </Badge>

            {/* Auto-refresh indicator */}
            <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
              <Clock className="h-3.5 w-3.5" />
              <span>Refreshed {timeSinceRefresh()}</span>
            </div>

            {/* Manual refresh */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              aria-label="Refresh dashboard"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="space-y-6 p-8">
        {/* Quick Actions */}
        <QuickActions />

        {/* Error state */}
        {isError && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            Failed to load dashboard data. Make sure the API server is running on port 3001.
          </div>
        )}

        {/* KPI Cards skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-[var(--muted)]" />
            ))}
          </div>
        )}

        {/* KPI Cards */}
        {!isLoading && stats && <KpiCards stats={stats} />}

        {/* Charts row: condition donut + category breakdown + online/offline */}
        {!isLoading && stats && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatusDonutChart stats={stats} />
            <CategoryBreakdown stats={stats} />

            {/* Attention count card */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
              <div className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Need Attention
              </div>
              <div className="mt-2 text-3xl font-bold text-[var(--foreground)]">
                {stats.poorCount + stats.criticalCount}
              </div>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                {stats.criticalCount} critical · {stats.poorCount} poor
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-md bg-emerald-50 px-3 py-2 dark:bg-emerald-500/10">
                  <div className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Online
                  </div>
                  <div className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
                    {stats.onlineCount}
                  </div>
                </div>
                <div className="rounded-md bg-red-50 px-3 py-2 dark:bg-red-500/10">
                  <div className="text-[10px] uppercase tracking-wider text-red-700 dark:text-red-400">
                    Offline
                  </div>
                  <div className="text-lg font-bold text-red-800 dark:text-red-300">
                    {stats.offlineCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom row: alerts + activity */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AlertsWidget refetchInterval={REFRESH_INTERVAL_MS} propertyId={propertyID} />
          <ActivityFeed refetchInterval={REFRESH_INTERVAL_MS} propertyId={propertyID} />
        </div>
      </div>
    </div>
  );
}
