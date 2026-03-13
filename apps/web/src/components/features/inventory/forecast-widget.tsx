"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { useConsumptionForecast } from "@/hooks/use-consumption";

interface ForecastWidgetProps {
  partId: number;
}

function statusConfig(status: string, days: number | null) {
  if (days === null) {
    return {
      icon: CheckCircle,
      label: "No Data",
      color: "text-[var(--muted-foreground)]",
      bg: "bg-[var(--muted)]",
      description: "No consumption history to forecast from",
    };
  }
  if (status === "urgent" || (days !== null && days < 15)) {
    return {
      icon: AlertTriangle,
      label: "Urgent",
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-100 dark:bg-red-400/10",
      description: "Stock will run out soon. Reorder immediately.",
    };
  }
  if (status === "caution" || (days !== null && days < 30)) {
    return {
      icon: TrendingDown,
      label: "Caution",
      color: "text-amber-600 dark:text-yellow-400",
      bg: "bg-amber-100 dark:bg-yellow-400/10",
      description: "Stock is declining. Consider reordering soon.",
    };
  }
  return {
    icon: CheckCircle,
    label: "Safe",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-400/10",
    description: "Stock levels are healthy.",
  };
}

export function ForecastWidget({ partId }: ForecastWidgetProps) {
  const { data, isLoading } = useConsumptionForecast(partId);
  const forecast = data?.data;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)] mb-3" />
          <div className="h-10 w-20 animate-pulse rounded bg-[var(--muted)]" />
        </CardContent>
      </Card>
    );
  }

  if (!forecast) {
    return null;
  }

  const config = statusConfig(forecast.stockoutStatus, forecast.daysUntilStockout);
  const StatusIcon = config.icon;

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
          Stockout Forecast
        </h2>
        <div className="flex items-center gap-3 mb-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", config.bg)}>
            <StatusIcon className={cn("h-5 w-5", config.color)} />
          </div>
          <div>
            <div className={cn("text-2xl font-bold", config.color)}>
              {forecast.daysUntilStockout !== null
                ? `${forecast.daysUntilStockout} days`
                : "N/A"}
            </div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
              Until stockout
            </div>
          </div>
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">{config.description}</p>
        {forecast.avgDailyConsumption > 0 && (
          <div className="mt-3 pt-3 border-t border-[var(--border)]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--muted-foreground)]">Avg daily usage</span>
              <span className="font-medium text-[var(--foreground)]">
                {forecast.avgDailyConsumption.toFixed(1)} units/day
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-[var(--muted-foreground)]">Current stock</span>
              <span className="font-medium text-[var(--foreground)]">
                {forecast.currentStock} units
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
