"use client";

import Link from "next/link";
import {
  GitBranch,
  Clock,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import { useLifecycleKPIs } from "@/hooks/use-lifecycle";
import type { LifecycleStage, StageDistributionItem } from "@asset-hub/shared";

const STAGE_COLORS: Record<LifecycleStage, string> = {
  Procurement: "#3b82f6",
  Active: "#22c55e",
  UnderMaintenance: "#eab308",
  ScheduledForReplacement: "#f97316",
  Disposed: "#6b7280",
};

const STAGE_LABELS: Record<LifecycleStage, string> = {
  Procurement: "Procurement",
  Active: "Active",
  UnderMaintenance: "Under Maintenance",
  ScheduledForReplacement: "Scheduled for Replacement",
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

function KPICard({
  icon: Icon,
  label,
  value,
  sub,
  iconClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  iconClass?: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", iconClass ?? "bg-[var(--primary)]/10")}>
            <Icon className="h-4.5 w-4.5 text-[var(--primary)]" />
          </div>
          <span className="text-sm text-[var(--muted-foreground)]">{label}</span>
        </div>
        <p className="text-3xl font-bold text-[var(--foreground)]">{value}</p>
        {sub && <p className="text-xs text-[var(--muted-foreground)] mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function CustomBarTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; payload: StageDistributionItem }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const item = payload[0]!;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 shadow-lg text-xs">
      <p className="font-semibold mb-1">{label}</p>
      <p className="text-[var(--muted-foreground)]">
        {item.value} assets ({item.payload.percentage}%)
      </p>
    </div>
  );
}

export default function LifecycleDashboardPage() {
  const { data, isLoading, isError } = useLifecycleKPIs();
  const kpis = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-8">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-[var(--muted)]" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !kpis) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-sm text-[var(--destructive)]">Failed to load lifecycle data.</p>
      </div>
    );
  }

  const chartData = kpis.stageDistribution.map((item) => ({
    ...item,
    name: STAGE_LABELS[item.stage].replace(" for Replacement", "").replace("Under ", ""),
  }));

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10">
              <GitBranch className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">Asset Lifecycle</h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                Portfolio lifecycle overview and KPIs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/analytics/lifecycle/forecast">
              <Button variant="outline" size="sm">EOL Forecast</Button>
            </Link>
            <Link href="/analytics/lifecycle/compliance">
              <Button variant="outline" size="sm">Compliance Report</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KPICard
            icon={Clock}
            label="Avg Asset Lifespan"
            value={`${kpis.avgLifespanYears} yrs`}
            sub="Across all disposed assets"
          />
          <KPICard
            icon={AlertTriangle}
            label="Approaching EOL"
            value={kpis.approachingEndOfLife}
            sub="Scheduled for replacement"
            iconClass="bg-orange-500/10"
          />
          <KPICard
            icon={Trash2}
            label="Disposed This Year"
            value={kpis.disposedThisYear}
            sub={`As of ${new Date().getFullYear()}`}
            iconClass="bg-zinc-500/10"
          />
        </div>

        {/* Stage distribution chart + category table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Assets by Lifecycle Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STAGE_COLORS[entry.stage]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="mt-4 grid grid-cols-2 gap-1.5">
                {kpis.stageDistribution.map((item) => (
                  <div key={item.stage} className="flex items-center gap-2 text-xs">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-sm"
                      style={{ backgroundColor: STAGE_COLORS[item.stage] }}
                    />
                    <span className="text-[var(--muted-foreground)] truncate">
                      {STAGE_LABELS[item.stage]}
                    </span>
                    <span className="ml-auto font-semibold text-[var(--foreground)] shrink-0">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Avg lifespan by category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Avg Lifespan by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Category</th>
                      <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Assets</th>
                      <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Avg Lifespan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kpis.avgLifespanByCategory.map((cat) => (
                      <tr key={cat.categoryName} className="border-b border-[var(--border)]/50">
                        <td className="py-2 text-sm text-[var(--foreground)]">{cat.categoryName}</td>
                        <td className="py-2 text-right text-xs text-[var(--muted-foreground)]">{cat.assetCount}</td>
                        <td className="py-2 text-right text-sm font-semibold text-[var(--foreground)]">
                          {cat.avgYears.toFixed(1)} yrs
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
                <span className="text-xs text-[var(--muted-foreground)]">Portfolio average</span>
                <span className="text-sm font-bold text-[var(--foreground)]">
                  {kpis.avgLifespanYears} yrs
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stage badges summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Current Stage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {kpis.stageDistribution
                .filter((s) => s.count > 0)
                .map((item) => (
                  <div
                    key={item.stage}
                    className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2"
                  >
                    <StageBadge stage={item.stage} />
                    <span className="text-sm font-semibold text-[var(--foreground)]">
                      {item.count}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      ({item.percentage}%)
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
