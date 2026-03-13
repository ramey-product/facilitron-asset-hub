"use client";

import Link from "next/link";
import {
  Package,
  DollarSign,
  AlertTriangle,
  XCircle,
  ShoppingCart,
  ArrowRightLeft,
  Bell,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  useConsumablesKPIs,
  useUsageTrends,
  useRecentActivity,
} from "@/hooks/use-consumables-dashboard";
import { useQueryClient } from "@tanstack/react-query";
import type {
  ConsumableDashboardKPIs,
  UsageTrend,
  RecentActivity,
  RecentActivityEventType,
} from "@asset-hub/shared";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CHART_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#0ea5e9", // sky
  "#a78bfa", // light violet
];

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// ---------------------------------------------------------------------------
// KPI Card
// ---------------------------------------------------------------------------

function KpiCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  sub,
  href,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  sub?: string;
  href?: string;
}) {
  const inner = (
    <CardContent className="p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
          {label}
        </span>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", iconBg)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </div>
      <div className="text-2xl font-bold text-[var(--foreground)]">{value}</div>
      {sub && <div className="mt-1 text-xs text-[var(--muted-foreground)]">{sub}</div>}
    </CardContent>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        <Card className="transition-shadow hover:shadow-md">{inner}</Card>
      </Link>
    );
  }

  return <Card>{inner}</Card>;
}

// ---------------------------------------------------------------------------
// KPI Cards row
// ---------------------------------------------------------------------------

function KpiCards({ kpis }: { kpis: ConsumableDashboardKPIs }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        label="Total Parts"
        value={kpis.totalParts.toLocaleString()}
        icon={Package}
        iconBg="bg-[var(--primary)]/10"
        iconColor="text-[var(--primary)]"
        sub="Active SKUs in catalog"
        href="/inventory"
      />
      <KpiCard
        label="Total Value"
        value={formatCurrency(kpis.totalValue)}
        icon={DollarSign}
        iconBg="bg-emerald-100 dark:bg-emerald-500/10"
        iconColor="text-emerald-700 dark:text-emerald-400"
        sub="On-hand stock value"
      />
      <KpiCard
        label="Below Reorder"
        value={kpis.belowReorder.toLocaleString()}
        icon={AlertTriangle}
        iconBg="bg-amber-100 dark:bg-amber-500/10"
        iconColor="text-amber-700 dark:text-amber-400"
        sub="Parts at or below reorder point"
        href="/inventory/alerts"
      />
      <KpiCard
        label="Zero Stock"
        value={kpis.zeroStock.toLocaleString()}
        icon={XCircle}
        iconBg="bg-red-100 dark:bg-red-500/10"
        iconColor="text-red-700 dark:text-red-400"
        sub="Parts with no on-hand quantity"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Category Breakdown (Pie)
// ---------------------------------------------------------------------------

function CategoryChart({ kpis }: { kpis: ConsumableDashboardKPIs }) {
  const data = kpis.categoryBreakdown;
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <ResponsiveContainer width="50%" height={220}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
              >
                {data.map((_, idx) => (
                  <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: unknown, name: unknown) => [
                  `${v} parts`,
                  String(name),
                ]}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex-1 space-y-2">
            {data.map((entry, idx) => {
              const pct = total > 0 ? ((entry.count / total) * 100).toFixed(1) : "0.0";
              return (
                <div key={entry.category} className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-sm"
                      style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                    />
                    <span className="truncate text-[var(--muted-foreground)]">
                      {entry.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-medium tabular-nums text-[var(--foreground)]">
                      {entry.count}
                    </span>
                    <span className="text-[var(--muted-foreground)] tabular-nums w-10 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Usage Trends (Line chart — top 5 parts)
// ---------------------------------------------------------------------------

function UsageTrendsChart({ trends }: { trends: UsageTrend[] }) {
  // Collect the top 5 part names across all months by total quantity
  const partTotals: Record<string, number> = {};
  for (const month of trends) {
    for (const part of month.parts) {
      partTotals[part.partName] = (partTotals[part.partName] ?? 0) + part.quantity;
    }
  }
  const topParts = Object.entries(partTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name);

  // Build chart data — one row per month
  const chartData = trends.map((m) => {
    const row: Record<string, string | number> = {
      month: MONTH_LABELS[parseInt(m.month.slice(5, 7), 10) - 1] ?? m.month,
    };
    for (const partName of topParts) {
      const found = m.parts.find((p) => p.partName === partName);
      row[partName] = found?.quantity ?? 0;
    }
    return row;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Usage Trends — Top 5 Parts (12 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v: unknown, name: unknown) => [`${v} units`, String(name)]}
            />
            <Legend wrapperStyle={{ fontSize: "11px", color: "var(--muted-foreground)" }} />
            {topParts.map((partName, idx) => (
              <Line
                key={partName}
                type="monotone"
                dataKey={partName}
                stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Cost Trends (Bar chart — monthly total cost)
// ---------------------------------------------------------------------------

function CostTrendsChart({ trends }: { trends: UsageTrend[] }) {
  const chartData = trends.map((m) => ({
    month: MONTH_LABELS[parseInt(m.month.slice(5, 7), 10) - 1] ?? m.month,
    cost: m.totalCost,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Monthly Cost (12 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v: unknown) => [formatCurrency(Number(v)), "Cost"]}
            />
            <Bar dataKey="cost" name="Total Cost" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Quick Actions
// ---------------------------------------------------------------------------

function QuickActions() {
  const actions = [
    {
      label: "Receive Items",
      icon: Inbox,
      href: "/procurement/receiving",
      variant: "default" as const,
    },
    {
      label: "Create PO",
      icon: ShoppingCart,
      href: "/procurement/orders/new",
      variant: "outline" as const,
    },
    {
      label: "Low Stock Alerts",
      icon: Bell,
      href: "/inventory/alerts",
      variant: "outline" as const,
    },
    {
      label: "Stock Transfers",
      icon: ArrowRightLeft,
      href: "/inventory/transfers",
      variant: "outline" as const,
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {actions.map((action) => (
        <Link key={action.label} href={action.href}>
          <Button variant={action.variant} size="sm" className="flex items-center gap-2">
            <action.icon className="h-4 w-4" />
            {action.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Activity event type badge
// ---------------------------------------------------------------------------

const EVENT_BADGE: Record<RecentActivityEventType, { label: string; classes: string }> = {
  receipt: {
    label: "Receipt",
    classes:
      "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-400/20",
  },
  consumption: {
    label: "Consumed",
    classes:
      "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-400/20",
  },
  transfer: {
    label: "Transfer",
    classes:
      "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-400/20",
  },
  adjustment: {
    label: "Adjustment",
    classes:
      "bg-red-100 text-red-900 border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-400/20",
  },
  "reorder-alert": {
    label: "Reorder Alert",
    classes:
      "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-400/20",
  },
};

function relativeTime(timestamp: string): string {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

// ---------------------------------------------------------------------------
// Activity Feed
// ---------------------------------------------------------------------------

function ActivityFeed({ activity }: { activity: RecentActivity[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
          <Link
            href="/inventory/warehouse"
            className="text-xs text-[var(--primary)] hover:underline"
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-[var(--border)]">
          {activity.map((event) => {
            const badge = EVENT_BADGE[event.eventType];
            return (
              <li
                key={event.id}
                className="flex items-start gap-3 px-5 py-3 hover:bg-[var(--muted)]/30 transition-colors"
              >
                <Badge
                  className={cn("mt-0.5 shrink-0 border text-[10px] font-semibold", badge.classes)}
                >
                  {badge.label}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)] truncate">
                    {event.partName}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {event.quantity > 0 ? `+${event.quantity}` : event.quantity} units
                    {event.reference ? ` · ${event.reference}` : ""}
                    {" · "}{event.user}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-[var(--muted-foreground)] tabular-nums">
                  {relativeTime(event.timestamp)}
                </span>
              </li>
            );
          })}
          {activity.length === 0 && (
            <li className="px-5 py-6 text-center text-sm text-[var(--muted-foreground)]">
              No recent activity
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function SkeletonGrid({ cols, count, height }: { cols: string; count: number; height: string }) {
  return (
    <div className={cn("grid gap-4", cols)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn("animate-pulse rounded-xl border border-[var(--border)] bg-[var(--muted)]", height)}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function InventoryDashboardPage() {
  const queryClient = useQueryClient();

  const kpisQuery = useConsumablesKPIs();
  const trendsQuery = useUsageTrends();
  const activityQuery = useRecentActivity();

  const kpis = (kpisQuery.data as { data: ConsumableDashboardKPIs } | undefined)?.data;
  const trends = (trendsQuery.data as { data: UsageTrend[] } | undefined)?.data ?? [];
  const activity = (activityQuery.data as { data: RecentActivity[] } | undefined)?.data ?? [];

  const isLoading = kpisQuery.isLoading || trendsQuery.isLoading || activityQuery.isLoading;
  const isError = kpisQuery.isError || trendsQuery.isError || activityQuery.isError;

  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: ["consumables-kpis"] });
    queryClient.invalidateQueries({ queryKey: ["consumables-trends"] });
    queryClient.invalidateQueries({ queryKey: ["consumables-activity"] });
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]"
            >
              <Link href="/inventory" className="hover:text-[var(--foreground)] transition-colors">
                Inventory
              </Link>
              <span>/</span>
              <span className="text-[var(--foreground)]">Dashboard</span>
            </nav>
            <h1 className="text-xl font-bold text-[var(--foreground)]">Inventory Dashboard</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Real-time inventory metrics and trends
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            aria-label="Refresh dashboard"
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
          </Button>
        </div>
      </header>

      <div className="space-y-6 p-8">
        {/* Quick Actions */}
        <QuickActions />

        {/* Error state */}
        {isError && (
          <div className="flex items-center justify-between rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            <span>Failed to load dashboard data. Make sure the API server is running on port 3001.</span>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-4 shrink-0">
              Retry
            </Button>
          </div>
        )}

        {/* KPI Cards */}
        {isLoading ? (
          <SkeletonGrid cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" count={4} height="h-28" />
        ) : (
          kpis && <KpiCards kpis={kpis} />
        )}

        {/* Charts row: category pie + usage trends */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="h-72 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--muted)]" />
            <div className="h-72 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--muted)]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {kpis && <CategoryChart kpis={kpis} />}
            {trends.length > 0 && <UsageTrendsChart trends={trends} />}
          </div>
        )}

        {/* Cost trends full-width */}
        {isLoading ? (
          <div className="h-72 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--muted)]" />
        ) : (
          trends.length > 0 && <CostTrendsChart trends={trends} />
        )}

        {/* Activity feed */}
        {isLoading ? (
          <div className="h-64 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--muted)]" />
        ) : (
          <ActivityFeed activity={activity} />
        )}
      </div>
    </div>
  );
}
