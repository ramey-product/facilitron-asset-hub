"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { getTooltipStyle, resolveVar } from "@/lib/chart-theme";
import { useConsumption } from "@/hooks/use-consumption";

interface ConsumptionChartProps {
  partId: number;
}

/**
 * Groups consumption records by ISO week and sums qty consumed.
 * Shows last 12 weeks of data.
 */
function groupByWeek(
  records: Array<{ loggedAt: string; qty: number; isReversed: boolean }>
): Array<{ week: string; qty: number }> {
  const weekMap = new Map<string, number>();

  // Calculate 12 weeks ago
  const now = new Date();
  const twelveWeeksAgo = new Date(now);
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);

  for (const record of records) {
    if (record.isReversed) continue;
    const date = new Date(record.loggedAt);
    if (date < twelveWeeksAgo) continue;

    // Get start of week (Monday)
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(date.setDate(diff));
    const key = weekStart.toISOString().slice(0, 10);

    weekMap.set(key, (weekMap.get(key) ?? 0) + record.qty);
  }

  return Array.from(weekMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, qty]) => ({
      week: new Date(week).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      qty,
    }));
}

export function ConsumptionChart({ partId }: ConsumptionChartProps) {
  const { data, isLoading } = useConsumption({ partId, limit: 500 });
  const records = data?.data ?? [];
  const weeklyData = groupByWeek(records);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-4 w-40 animate-pulse rounded bg-[var(--muted)] mb-4" />
          <div className="h-48 animate-pulse rounded bg-[var(--muted)]" />
        </CardContent>
      </Card>
    );
  }

  if (weeklyData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            No consumption data available for the past 12 weeks.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">
          Weekly Consumption (Last 12 Weeks)
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={resolveVar("--border")} />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 10, fill: resolveVar("--muted-foreground") }}
                tickLine={false}
                axisLine={{ stroke: resolveVar("--border") }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: resolveVar("--muted-foreground") }}
                tickLine={false}
                axisLine={{ stroke: resolveVar("--border") }}
                allowDecimals={false}
              />
              <Tooltip contentStyle={getTooltipStyle()} />
              <Line
                type="monotone"
                dataKey="qty"
                name="Qty Consumed"
                stroke={resolveVar("--primary")}
                strokeWidth={2}
                dot={{ r: 3, fill: resolveVar("--primary") }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
