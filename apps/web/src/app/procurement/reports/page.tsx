"use client";

import Link from "next/link";
import { ArrowLeft, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useSpendAnalytics } from "@/hooks/use-procurement";
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
  LineChart,
  Line,
  Legend,
} from "recharts";

const CHART_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#a78bfa", // light violet
  "#c4b5fd", // lavender
  "#06b6d4", // cyan
  "#0284c7", // sky
  "#0ea5e9", // light sky
  "#7dd3fc", // pale sky
];

function KPICard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  sub?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            {label}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10">
            <Icon className="h-4 w-4 text-[var(--primary)]" />
          </div>
        </div>
        <div className="text-2xl font-bold text-[var(--foreground)]">{value}</div>
        {sub && <div className="text-xs text-[var(--muted-foreground)] mt-1">{sub}</div>}
      </CardContent>
    </Card>
  );
}

export default function SpendReportsPage() {
  const { data, isLoading, isError } = useSpendAnalytics();
  const analytics = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
          <div className="flex h-16 items-center px-8 gap-3">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-[var(--muted)]" />
            <div className="h-6 w-48 animate-pulse rounded bg-[var(--muted)]" />
          </div>
        </header>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5 space-y-3">
                  <div className="h-4 w-28 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-8 w-36 animate-pulse rounded bg-[var(--muted)]" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !analytics) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
        <p className="text-sm text-[var(--destructive)]">
          Failed to load spend analytics. Make sure the API server is running.
        </p>
      </div>
    );
  }

  // Format monthly data for Recharts
  const monthlyData = analytics.monthly.map((m) => ({
    month: m.month.slice(5), // Show "MM" only
    spend: m.totalSpend,
    orders: m.orderCount,
  }));

  // Format vendor data (top 6)
  const vendorData = analytics.byVendor.slice(0, 6);

  // Format category data
  const categoryData = analytics.byCategory.slice(0, 8);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <Link href="/procurement/orders">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                aria-label="Back to purchase orders"
              >
                <ArrowLeft className="h-4 w-4 text-[var(--muted-foreground)]" />
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">Spend Analytics</h1>
              <p className="text-sm text-[var(--muted-foreground)]">Procurement spend breakdown</p>
            </div>
          </div>
          <Link href="/procurement/orders/new">
            <Button size="sm">New Purchase Order</Button>
          </Link>
        </div>
      </header>

      <div className="p-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPICard
            label="Total Spend"
            value={formatCurrency(analytics.totalSpend)}
            icon={DollarSign}
            sub="All closed and in-progress orders"
          />
          <KPICard
            label="Avg Order Value"
            value={formatCurrency(analytics.avgOrderValue)}
            icon={TrendingUp}
            sub="Per purchase order"
          />
          <KPICard
            label="Open Orders"
            value={String(analytics.openOrders)}
            icon={ShoppingCart}
            sub="Draft, Submitted, or Approved"
          />
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spend by Vendor — Bar Chart */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">
                Spend by Vendor (Top 6)
              </h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={vendorData}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="vendorName"
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                    width={120}
                  />
                  <Tooltip
                    formatter={(v) => [formatCurrency(Number(v ?? 0)), "Spend"]}
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="totalSpend" radius={[0, 4, 4, 0]}>
                    {vendorData.map((_, idx) => (
                      <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Spend by Category — Pie Chart */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">
                Spend by Category
              </h2>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={240}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="totalSpend"
                      nameKey="categoryName"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={100}
                      paddingAngle={2}
                    >
                      {categoryData.map((_, idx) => (
                        <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [formatCurrency(Number(v ?? 0)), "Spend"]}
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-1.5">
                  {categoryData.map((cat, idx) => (
                    <div key={cat.categoryId} className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-sm"
                          style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                        />
                        <span className="text-[var(--muted-foreground)] truncate">{cat.categoryName}</span>
                      </div>
                      <span className="font-medium text-[var(--foreground)] shrink-0">
                        {formatCurrency(cat.totalSpend)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Spend — Line Chart */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">
              Monthly Spend Trend
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="spend"
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="orders"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value, name) =>
                    name === "spend" ? [formatCurrency(Number(value ?? 0)), "Spend"] : [value ?? 0, "Orders"]
                  }
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", color: "var(--muted-foreground)" }}
                />
                <Line
                  yAxisId="spend"
                  type="monotone"
                  dataKey="spend"
                  stroke={CHART_COLORS[0]}
                  strokeWidth={2}
                  dot={{ r: 4, fill: CHART_COLORS[0] }}
                  activeDot={{ r: 5 }}
                  name="Monthly Spend"
                />
                <Line
                  yAxisId="orders"
                  type="monotone"
                  dataKey="orders"
                  stroke={CHART_COLORS[4]}
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  dot={{ r: 3, fill: CHART_COLORS[4] }}
                  name="Order Count"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vendor breakdown table */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Vendor Breakdown</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Vendor</th>
                  <th scope="col" className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Orders</th>
                  <th scope="col" className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Total Spend</th>
                  <th scope="col" className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Avg / Order</th>
                  <th scope="col" className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Share</th>
                </tr>
              </thead>
              <tbody>
                {analytics.byVendor.map((vendor, idx) => {
                  const share = analytics.totalSpend > 0
                    ? (vendor.totalSpend / analytics.totalSpend) * 100
                    : 0;
                  const avgOrder = vendor.orderCount > 0
                    ? vendor.totalSpend / vendor.orderCount
                    : 0;
                  return (
                    <tr key={vendor.vendorId} className="border-b border-[var(--border)]/50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-sm"
                            style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                          />
                          <span className="font-medium text-[var(--foreground)]">{vendor.vendorName}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right text-[var(--muted-foreground)]">
                        {vendor.orderCount}
                      </td>
                      <td className="py-3 text-right font-medium text-[var(--foreground)]">
                        {formatCurrency(vendor.totalSpend)}
                      </td>
                      <td className="py-3 text-right text-[var(--muted-foreground)]">
                        {formatCurrency(avgOrder)}
                      </td>
                      <td className="py-3 pl-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${share}%`,
                                backgroundColor: CHART_COLORS[idx % CHART_COLORS.length],
                              }}
                            />
                          </div>
                          <span className="text-xs text-[var(--muted-foreground)] w-10 text-right">
                            {share.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
