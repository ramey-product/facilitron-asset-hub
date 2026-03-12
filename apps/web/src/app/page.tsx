"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  AlertTriangle,
  Wrench,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Clock,
  Shield,
  Activity,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { resolveVar } from "@/lib/chart-theme";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import Link from "next/link";
import { useTheme } from "@/components/layout/theme-provider";
import { useOrg } from "@/components/layout/org-provider";

const priorityColors: Record<string, string> = {
  Critical: "bg-red-100 text-red-900 border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  High: "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
  Medium: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20",
  Low: "bg-zinc-200 text-zinc-800 border-zinc-300 dark:bg-zinc-500/10 dark:text-zinc-400 dark:border-zinc-500/20",
};

const statusColors: Record<string, string> = {
  Open: "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  "In Progress": "bg-violet-100 text-violet-900 border-violet-300 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
  Completed: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
};

export default function DashboardPage() {
  const { theme } = useTheme();
  const { currentOrg, orgData } = useOrg();
  const { dashboardStats, conditionDistribution, maintenanceCostByMonth, assetsByCategory, recentWorkOrders, topPropertiesByMaintenance } = orgData;

  const [chartColors, setChartColors] = useState({
    border: "#e2e4e9",
    muted: "#64748b",
    primary: "#2563eb",
    card: "#ffffff",
    foreground: "#1a1a2e",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setChartColors({
        border: resolveVar("--border"),
        muted: resolveVar("--muted-foreground"),
        primary: resolveVar("--primary"),
        card: resolveVar("--card"),
        foreground: resolveVar("--foreground"),
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [theme]);

  const kpiCards = useMemo(() => [
    {
      title: "Total Assets",
      value: formatNumber(dashboardStats.totalAssets),
      subtitle: `Across ${dashboardStats.totalProperties} ${currentOrg.propertyLabel.toLowerCase()}`,
      icon: Box,
      trend: currentOrg.id === "ocps" ? "+312 this quarter" : "+124 this quarter",
      trendUp: true,
    },
    {
      title: "Open Work Orders",
      value: dashboardStats.openWorkOrders.toString(),
      subtitle: `${dashboardStats.overdueWorkOrders} overdue`,
      icon: Wrench,
      trend: currentOrg.id === "ocps" ? "-8% vs last month" : "-12% vs last month",
      trendUp: true,
    },
    {
      title: "Critical Assets",
      value: dashboardStats.criticalAssets.toString(),
      subtitle: `${dashboardStats.flaggedForReplacement} flagged for replacement`,
      icon: AlertTriangle,
      trend: currentOrg.id === "ocps" ? "12 new this week" : "3 new this week",
      trendUp: false,
    },
    {
      title: "YTD Maintenance Cost",
      value: formatCurrency(dashboardStats.ytdMaintenanceCost),
      subtitle: `Asset value: ${formatCurrency(dashboardStats.totalAssetValue)}`,
      icon: DollarSign,
      trend: currentOrg.id === "ocps" ? "+5% vs last year" : "+8% vs last year",
      trendUp: false,
    },
  ], [dashboardStats, currentOrg]);

  const tooltipStyle: React.CSSProperties = {
    backgroundColor: chartColors.card,
    border: `1px solid ${chartColors.border}`,
    borderRadius: "8px",
    color: chartColors.foreground,
    fontSize: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">Asset Hub</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              {currentOrg.name} &mdash; {formatNumber(dashboardStats.totalAssets)} assets across{" "}
              {dashboardStats.totalProperties} {currentOrg.propertyLabel.toLowerCase()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-3.5 w-3.5" />
              Last synced 2m ago
            </Button>
            <Link href="/assets">
              <Button size="sm">
                View All Assets
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Quick Actions</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Box className="mr-1.5 h-3.5 w-3.5" />
                  Register New Asset
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Wrench className="mr-1.5 h-3.5 w-3.5" />
                  Create Work Order
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Activity className="mr-1.5 h-3.5 w-3.5" />
                  Run Condition Report
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Shield className="mr-1.5 h-3.5 w-3.5" />
                  Scan QR / Barcode
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          {kpiCards.map((card) => (
            <Card key={card.title} className="relative overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                      {card.title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">{card.value}</p>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">{card.subtitle}</p>
                  </div>
                  <div className="rounded-lg bg-[var(--primary)]/10 p-2.5">
                    <card.icon className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <TrendingUp className={`h-3 w-3 ${card.trendUp ? "text-emerald-500" : "text-orange-500"}`} />
                  <span className={`text-xs ${card.trendUp ? "text-emerald-600" : "text-orange-600"}`}>
                    {card.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Maintenance Spend Trend</CardTitle>
                <span className="text-xs text-[var(--muted-foreground)]">Last 6 months</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={maintenanceCostByMonth}>
                    <defs>
                      <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} />
                    <XAxis dataKey="month" tick={{ fill: chartColors.muted, fontSize: 12 }} axisLine={{ stroke: chartColors.border }} />
                    <YAxis tick={{ fill: chartColors.muted, fontSize: 12 }} axisLine={{ stroke: chartColors.border }} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: unknown) => [`$${((Number(value) || 0) / 1000).toFixed(1)}k`, "Cost"]} />
                    <Area type="monotone" dataKey="cost" stroke={chartColors.primary} strokeWidth={2} fill="url(#costGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Asset Condition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={conditionDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {conditionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1.5">
                {conditionDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="text-[var(--muted-foreground)]">{item.name}</span>
                    </div>
                    <span className="font-medium text-[var(--foreground)]">{formatNumber(item.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Recent Work Orders</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-[var(--muted-foreground)]">
                  View all
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {recentWorkOrders.slice(0, 6).map((wo) => (
                  <div key={wo.id} className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-[var(--muted)]/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-[var(--muted-foreground)]">{wo.id}</span>
                          <Badge className={`text-[10px] ${priorityColors[wo.priority]}`}>{wo.priority}</Badge>
                        </div>
                        <span className="text-sm font-medium text-[var(--foreground)] truncate">{wo.title}</span>
                        <span className="text-xs text-[var(--muted-foreground)]">{wo.assetName} &middot; {wo.propertyName}</span>
                      </div>
                    </div>
                    <Badge className={`shrink-0 text-[10px] ${statusColors[wo.status]}`}>{wo.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Top {currentOrg.propertyLabel} by Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPropertiesByMaintenance.map((prop, i) => (
                  <div key={prop.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[var(--foreground)] truncate max-w-[180px]">{prop.name}</span>
                      <span className="text-xs font-semibold text-[var(--foreground)]">{formatCurrency(prop.cost)}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[var(--muted)]">
                      <div className="h-1.5 rounded-full bg-[var(--primary)]" style={{ width: `${(prop.cost / (topPropertiesByMaintenance[0]?.cost || 1)) * 100}%`, opacity: 1 - i * 0.15 }} />
                    </div>
                    <span className="text-[10px] text-[var(--muted-foreground)]">{prop.workOrders} work orders</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border)]">
                <h4 className="text-xs font-semibold text-[var(--foreground)] mb-3">Assets by Category</h4>
                <div className="h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={assetsByCategory.slice(0, 5)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} horizontal={false} />
                      <XAxis type="number" tick={{ fill: chartColors.muted, fontSize: 10 }} axisLine={{ stroke: chartColors.border }} />
                      <YAxis type="category" dataKey="category" tick={{ fill: chartColors.muted, fontSize: 10 }} axisLine={{ stroke: chartColors.border }} width={80} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="count" fill={chartColors.primary} radius={[0, 4, 4, 0]} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
