"use client";

import { Box, AlertTriangle, Wrench, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { DashboardStats } from "@/hooks/use-dashboard";

interface KpiCardsProps {
  stats: DashboardStats;
}

export function KpiCards({ stats }: KpiCardsProps) {
  const poorPercent =
    stats.totalAssets > 0
      ? ((stats.poorCount + stats.criticalCount) / stats.totalAssets) * 100
      : 0;

  const poorColorClass =
    poorPercent > 20
      ? "text-red-600 dark:text-red-400"
      : poorPercent > 10
        ? "text-amber-600 dark:text-amber-400"
        : "text-emerald-600 dark:text-emerald-400";

  const cards = [
    {
      title: "Total Assets",
      value: formatNumber(stats.totalAssets),
      subtitle: `Across ${stats.totalProperties} properties`,
      icon: Box,
      trend: `${stats.activeCount} active`,
      trendUp: true,
      valueClass: "",
    },
    {
      title: "Poor / Critical",
      value: `${stats.poorCount + stats.criticalCount}`,
      subtitle: `${poorPercent.toFixed(1)}% of fleet`,
      icon: AlertTriangle,
      trend: `${stats.criticalCount} critical`,
      trendUp: false,
      valueClass: poorColorClass,
    },
    {
      title: "Open Work Orders",
      value: stats.openWorkOrders.toString(),
      subtitle: `${stats.overdueWorkOrders} overdue`,
      icon: Wrench,
      trend: stats.overdueWorkOrders > 0 ? `${stats.overdueWorkOrders} need attention` : "On track",
      trendUp: stats.overdueWorkOrders === 0,
      valueClass: "",
    },
    {
      title: "YTD Maintenance Cost",
      value: formatCurrency(stats.ytdMaintenanceCost),
      subtitle: `Asset value: ${formatCurrency(stats.totalAssetValue)}`,
      icon: DollarSign,
      trend: "Year to date",
      trendUp: true,
      valueClass: "",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  {card.title}
                </p>
                <p className={`mt-2 text-3xl font-bold text-[var(--foreground)] ${card.valueClass}`}>
                  {card.value}
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{card.subtitle}</p>
              </div>
              <div className="ml-3 shrink-0 rounded-lg bg-[var(--primary)]/10 p-2.5">
                <card.icon className="h-5 w-5 text-[var(--primary)]" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              {card.trendUp ? (
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-orange-500" />
              )}
              <span
                className={`text-xs ${card.trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-orange-600 dark:text-orange-400"}`}
              >
                {card.trend}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
