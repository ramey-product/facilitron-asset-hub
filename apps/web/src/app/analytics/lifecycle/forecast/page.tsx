"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { cn, formatCurrency } from "@/lib/utils";
import { useLifecycleForecast } from "@/hooks/use-lifecycle";
import type { LifecycleForecast } from "@asset-hub/shared";

function ForecastTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 shadow-lg text-xs space-y-1">
      <p className="font-semibold">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-[var(--muted-foreground)]">
          {p.name}: <span className="text-[var(--foreground)] font-medium">
            {p.name.includes("Cost") ? formatCurrency(p.value) : p.value}
          </span>
        </p>
      ))}
    </div>
  );
}

export default function LifecycleForecastPage() {
  const [years, setYears] = useState(5);
  const { data, isLoading, isError } = useLifecycleForecast(years);
  const forecast = data?.data ?? [];

  // Build cumulative cost data
  let cumulative = 0;
  const chartData = forecast.map((f) => {
    cumulative += f.estimatedReplacementCost;
    return {
      quarter: f.quarter,
      retirements: f.predictedRetirements,
      replacementCost: f.estimatedReplacementCost,
      cumulativeCost: cumulative,
    };
  });

  const totalRetirements = forecast.reduce((sum, f) => sum + f.predictedRetirements, 0);
  const totalCost = forecast.reduce((sum, f) => sum + f.estimatedReplacementCost, 0);

  // Flatten all upcoming assets sorted by date
  const allUpcomingAssets = forecast
    .flatMap((f) =>
      f.assets.map((a) => ({
        ...a,
        quarter: f.quarter,
      }))
    )
    .sort((a, b) => a.predictedRetirementDate.localeCompare(b.predictedRetirementDate));

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <Link href="/analytics/lifecycle" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10">
              <TrendingDown className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">EOL Forecast</h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                End-of-life retirement predictions and replacement cost planning
              </p>
            </div>
          </div>

          {/* Years selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--muted-foreground)]">Forecast horizon:</span>
            {[3, 5, 10].map((y) => (
              <button
                key={y}
                onClick={() => setYears(y)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  years === y
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                )}
              >
                {y}yr
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="p-8 space-y-6">
        {/* Summary KPIs */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs text-[var(--muted-foreground)] mb-1">Total Predicted Retirements ({years}yr)</p>
              <p className="text-3xl font-bold text-[var(--foreground)]">{totalRetirements}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">assets across {forecast.length} quarters</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs text-[var(--muted-foreground)] mb-1">Estimated Replacement Cost ({years}yr)</p>
              <p className="text-3xl font-bold text-[var(--foreground)]">{formatCurrency(totalCost)}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                avg {formatCurrency(totalRetirements > 0 ? totalCost / totalRetirements : 0)} per asset
              </p>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="h-72 animate-pulse rounded-xl bg-[var(--muted)]" />
        ) : isError ? (
          <p className="text-sm text-[var(--destructive)]">Failed to load forecast data.</p>
        ) : (
          <>
            {/* Retirements by quarter bar chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Predicted Retirements by Quarter</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData} margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis
                      dataKey="quarter"
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
                    <Tooltip content={<ForecastTooltip />} />
                    <Bar dataKey="retirements" name="Retirements" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cumulative cost line chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Cumulative Replacement Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={chartData} margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="quarter"
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<ForecastTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line
                      type="monotone"
                      dataKey="cumulativeCost"
                      name="Cumulative Cost"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="replacementCost"
                      name="Per-Quarter Cost"
                      stroke="#f97316"
                      strokeWidth={1.5}
                      strokeDasharray="4 2"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Upcoming retirements table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Upcoming Asset Retirements ({allUpcomingAssets.length} total)
                </CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Asset</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Quarter</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Target Date</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Est. Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUpcomingAssets.map((asset) => (
                      <tr key={asset.assetId} className="border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/50 transition-colors">
                        <td className="px-4 py-3">
                          <Link
                            href={`/assets/${asset.assetId}`}
                            className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                          >
                            {asset.assetName}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{asset.categoryName}</td>
                        <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{asset.quarter}</td>
                        <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                          {new Date(asset.predictedRetirementDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-[var(--foreground)]">
                          {formatCurrency(asset.replacementCost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
