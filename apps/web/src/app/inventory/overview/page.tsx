"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  Box,
  Package,
  Wallet,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
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
  Legend,
} from "recharts";
import { useInventoryOverview, useHealthScore, useInventorySearch } from "@/hooks/use-inventory-overview";
import type {
  InventoryOverviewMetrics,
  InventoryHealthScore,
  AgeDistribution,
  StockHealthBreakdown,
} from "@asset-hub/shared";

// ─── Colour helpers ─────────────────────────────────────────────────────────

function healthColor(score: number): string {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function healthBg(score: number): string {
  if (score >= 80) return "stroke-emerald-500 dark:stroke-emerald-400";
  if (score >= 60) return "stroke-amber-500 dark:stroke-amber-400";
  return "stroke-red-500 dark:stroke-red-400";
}

function healthBadge(score: number) {
  if (score >= 80) return "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20";
  if (score >= 60) return "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20";
  return "bg-red-100 text-red-900 border-red-300 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20";
}

// ─── Circular progress SVG ──────────────────────────────────────────────────

function CircularProgress({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const gap = circumference - filled;

  return (
    <svg width="128" height="128" viewBox="0 0 128 128" className="mx-auto">
      {/* Track */}
      <circle
        cx="64"
        cy="64"
        r={radius}
        fill="none"
        strokeWidth="10"
        className="stroke-[var(--muted)]"
      />
      {/* Progress */}
      <circle
        cx="64"
        cy="64"
        r={radius}
        fill="none"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${gap}`}
        strokeDashoffset={circumference * 0.25} // start from top
        className={cn("transition-all duration-500", healthBg(score))}
      />
      {/* Label */}
      <text
        x="64"
        y="64"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-2xl font-bold fill-[var(--foreground)]"
        style={{ fontSize: 22, fontWeight: 700 }}
      >
        {score}
      </text>
      <text
        x="64"
        y="80"
        textAnchor="middle"
        style={{ fontSize: 11 }}
        className="fill-[var(--muted-foreground)]"
      >
        / 100
      </text>
    </svg>
  );
}

// ─── KPI Card ───────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  emphasized?: boolean;
  valueClass?: string;
}

function KpiCard({ label, value, icon: Icon, emphasized, valueClass }: KpiCardProps) {
  return (
    <Card className={cn(emphasized && "ring-2 ring-[var(--primary)]/30")}>
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            {label}
          </p>
          <Icon className="h-4 w-4 text-[var(--muted-foreground)]" />
        </div>
        <p className={cn("text-2xl font-bold", valueClass ?? "text-[var(--foreground)]")}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Health Detail Card ─────────────────────────────────────────────────────

function HealthScoreCard({ health }: { health: InventoryHealthScore }) {
  const TrendIcon =
    health.trend === "improving"
      ? TrendingUp
      : health.trend === "declining"
      ? TrendingDown
      : Minus;

  const trendColor =
    health.trend === "improving"
      ? "text-emerald-600 dark:text-emerald-400"
      : health.trend === "declining"
      ? "text-red-600 dark:text-red-400"
      : "text-amber-600 dark:text-amber-400";

  const trendLabel =
    health.trend === "improving"
      ? "Improving"
      : health.trend === "declining"
      ? "Declining"
      : "Stable";

  const delta = health.overall - health.previousScore;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Portfolio Health Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Circular indicator */}
        <CircularProgress score={health.overall} />

        {/* Trend */}
        <div className="flex items-center justify-center gap-1.5">
          <TrendIcon className={cn("h-4 w-4", trendColor)} />
          <span className={cn("text-sm font-medium", trendColor)}>{trendLabel}</span>
          {delta !== 0 && (
            <span className="text-xs text-[var(--muted-foreground)]">
              ({delta > 0 ? "+" : ""}{delta.toFixed(0)} pts vs last period)
            </span>
          )}
        </div>

        {/* Sub-scores */}
        <div className="divide-y divide-[var(--border)]">
          {[
            { label: "Asset Condition", score: health.assetConditionScore },
            { label: "Stock Adequacy", score: health.stockAdequacyScore },
            { label: "Maintenance Compliance", score: health.maintenanceComplianceScore },
          ].map(({ label, score }) => (
            <div key={label} className="flex items-center justify-between py-2.5">
              <span className="text-sm text-[var(--muted-foreground)]">{label}</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 rounded-full bg-[var(--muted)] overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      score >= 80
                        ? "bg-emerald-500"
                        : score >= 60
                        ? "bg-amber-500"
                        : "bg-red-500"
                    )}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <Badge className={cn("text-[10px] border tabular-nums w-10 justify-center", healthBadge(score))}>
                  {score}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Age Distribution Chart ─────────────────────────────────────────────────

function AgeDistributionChart({ data }: { data: AgeDistribution[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Asset Age Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="range"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v: unknown) => [Number(v), "Assets"]}
              />
              <Bar dataKey="count" name="Assets" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Stock Health Pie Chart ─────────────────────────────────────────────────

const STOCK_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

function StockHealthChart({ data }: { data: StockHealthBreakdown }) {
  const total = data.adequate + data.low + data.critical;
  const chartData = [
    { name: "Adequate", value: data.adequate, pct: total > 0 ? Math.round((data.adequate / total) * 100) : 0 },
    { name: "Low", value: data.low, pct: total > 0 ? Math.round((data.low / total) * 100) : 0 },
    { name: "Critical", value: data.critical, pct: total > 0 ? Math.round((data.critical / total) * 100) : 0 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Stock Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56 flex items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STOCK_COLORS[index % STOCK_COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                formatter={(value: string) => {
                  const item = chartData.find((d) => d.name === value);
                  return (
                    <span style={{ fontSize: 12, color: "var(--foreground)" }}>
                      {value}: {item?.value ?? 0} ({item?.pct ?? 0}%)
                    </span>
                  );
                }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v: unknown, name?: string | number) => {
                  const item = chartData.find((d) => d.name === String(name ?? ""));
                  return [`${Number(v)} parts (${item?.pct ?? 0}%)`, String(name ?? "")];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Summary row */}
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          {chartData.map((d, i) => (
            <div key={d.name}>
              <p
                className="text-lg font-bold tabular-nums"
                style={{ color: STOCK_COLORS[i] }}
              >
                {d.value}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">{d.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Cross-module search ─────────────────────────────────────────────────────

function CrossModuleSearch() {
  const [query, setQuery] = useState("");
  const { data, isFetching } = useInventorySearch(query);
  const results = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Cross-Module Search</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assets, parts, SKUs..."
            className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] pl-9 pr-3 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
          />
        </div>

        {isFetching && (
          <p className="text-xs text-[var(--muted-foreground)]">Searching...</p>
        )}

        {!isFetching && query.length >= 2 && results.length === 0 && (
          <p className="text-xs text-[var(--muted-foreground)]">
            No results for &ldquo;{query}&rdquo;.
          </p>
        )}

        {results.length > 0 && (
          <div className="divide-y divide-[var(--border)] rounded-lg border border-[var(--border)] overflow-hidden">
            {results.slice(0, 8).map((r) => (
              <Link
                key={`${r.type}-${r.id}`}
                href={r.type === "asset" ? `/assets/${r.id}` : `/inventory/${r.id}`}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-[var(--muted)]/40 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{r.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {r.identifier} · {r.category}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      "text-[10px] border",
                      r.type === "asset"
                        ? "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/20"
                        : "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-400/10 dark:text-purple-400 dark:border-purple-400/20"
                    )}
                  >
                    {r.type === "asset" ? "Asset" : "Part"}
                  </Badge>
                  <ChevronRight className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {query.length < 2 && (
          <p className="text-xs text-[var(--muted-foreground)]">
            Type at least 2 characters to search across assets and consumable parts.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Skeleton helpers ───────────────────────────────────────────────────────

function MetricSkeleton() {
  return <div className="h-24 animate-pulse rounded-xl bg-[var(--muted)]" />;
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function InventoryOverviewPage() {
  const { data: metricsData, isLoading: metricsLoading, isError: metricsError } =
    useInventoryOverview();
  const { data: healthData, isLoading: healthLoading } = useHealthScore();

  const metrics = metricsData?.data as
    | (InventoryOverviewMetrics & {
        ageDistribution: AgeDistribution[];
        stockHealth: StockHealthBreakdown;
      })
    | undefined;

  const health = healthData?.data as InventoryHealthScore | undefined;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center gap-4 px-8">
          <Activity className="h-5 w-5 text-[var(--primary)]" />
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              Inventory Overview
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Unified view of assets and consumables
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/inventory">
              <button className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
                <Package className="h-4 w-4" />
                Parts Catalog
              </button>
            </Link>
            <Link href="/assets">
              <button className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
                <Box className="h-4 w-4" />
                Asset Registry
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-6">
        {/* Error state */}
        {metricsError && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            Failed to load inventory metrics. Ensure the API is running on port 3001.
          </div>
        )}

        {/* Portfolio Metrics — 6 KPI cards */}
        <section aria-label="Portfolio metrics">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Portfolio Metrics
          </h2>
          {metricsLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <MetricSkeleton key={i} />
              ))}
            </div>
          ) : metrics ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              <KpiCard
                label="Asset Value"
                value={formatCurrency(metrics.totalAssetValue)}
                icon={DollarSign}
              />
              <KpiCard
                label="Assets"
                value={metrics.assetCount.toLocaleString()}
                icon={Box}
              />
              <KpiCard
                label="Parts"
                value={metrics.consumableCount.toLocaleString()}
                icon={Package}
              />
              <KpiCard
                label="Parts Value"
                value={formatCurrency(metrics.consumableValue)}
                icon={DollarSign}
              />
              <KpiCard
                label="Portfolio Value"
                value={formatCurrency(metrics.portfolioValue)}
                icon={Wallet}
                emphasized
              />
              <KpiCard
                label="Health Score"
                value={`${metrics.healthScore}%`}
                icon={Activity}
                valueClass={healthColor(metrics.healthScore)}
              />
            </div>
          ) : null}
        </section>

        {/* Main content: Health card + charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Health Score Detail */}
          <div className="lg:col-span-1">
            {healthLoading ? (
              <div className="h-80 animate-pulse rounded-xl bg-[var(--muted)]" />
            ) : health ? (
              <HealthScoreCard health={health} />
            ) : null}
          </div>

          {/* Charts column */}
          <div className="lg:col-span-2 space-y-6">
            {metricsLoading ? (
              <>
                <div className="h-72 animate-pulse rounded-xl bg-[var(--muted)]" />
                <div className="h-72 animate-pulse rounded-xl bg-[var(--muted)]" />
              </>
            ) : metrics ? (
              <>
                <AgeDistributionChart data={metrics.ageDistribution} />
                <StockHealthChart data={metrics.stockHealth} />
              </>
            ) : null}
          </div>
        </div>

        {/* Cross-Module Search */}
        <section aria-label="Cross-module search">
          <CrossModuleSearch />
        </section>

        {/* Quick Links */}
        <section aria-label="Quick links">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "Parts Catalog", href: "/inventory", icon: Package },
              { label: "Stock Matrix", href: "/inventory/stock", icon: Box },
              { label: "Purchase Orders", href: "/procurement/orders", icon: DollarSign },
              { label: "Transfers", href: "/procurement/transfers", icon: Activity },
              { label: "Reorder Alerts", href: "/procurement/reorder-alerts", icon: Activity },
              { label: "Asset Registry", href: "/assets", icon: Box },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 hover:bg-[var(--muted)] transition-colors cursor-pointer">
                  <item.icon className="h-4 w-4 text-[var(--muted-foreground)]" />
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {item.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
