"use client";

import Link from "next/link";
import { TrendingDown, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useDepreciationSummary } from "@/hooks/use-depreciation";
import type { DepreciationByCategory } from "@asset-hub/shared";

export default function DepreciationPage() {
  const { data, isLoading } = useDepreciationSummary();
  const summary = data?.data;

  const chartData: DepreciationByCategory[] = summary?.byCategory ?? [];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center gap-4 px-8">
          <TrendingDown className="h-5 w-5 text-[var(--primary)]" />
          <h1 className="text-xl font-bold text-[var(--foreground)]">Depreciation</h1>
          <span className="text-sm text-[var(--muted-foreground)]">Fixed asset book value tracking</span>
          <div className="ml-auto">
            <Link href="/analytics/depreciation/register">
              <button className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
                <FileText className="h-4 w-4" />
                Fixed Asset Register
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {isLoading ? "—" : formatCurrency(summary?.totalOriginalCost ?? 0)}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">Original Cost</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {isLoading ? "—" : formatCurrency(summary?.totalAccumulatedDepreciation ?? 0)}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">Accumulated Depreciation</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {isLoading ? "—" : formatCurrency(summary?.totalBookValue ?? 0)}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">Net Book Value</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {isLoading ? "—" : summary?.assetCount ?? 0}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">Total Assets</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {isLoading ? "—" : summary?.fullyDepreciatedCount ?? 0}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">Fully Depreciated</p>
            </CardContent>
          </Card>
        </div>

        {/* Bar chart by category */}
        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Book Value by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="categoryName" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                      formatter={(v: unknown) => [formatCurrency(Number(v)), ""]}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="originalCost" name="Original Cost" fill="#6366f1" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="bookValue" name="Book Value" fill="#10b981" radius={[4, 4, 0, 0]} stackId="b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category breakdown table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="h-32 animate-pulse m-4 rounded-lg bg-[var(--muted)]" />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Category</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Assets</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Original Cost</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Depreciated</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Book Value</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((c) => {
                    const remaining = c.originalCost > 0 ? Math.round((c.bookValue / c.originalCost) * 100) : 0;
                    return (
                      <tr key={c.categoryName} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/30 transition-colors">
                        <td className="px-4 py-2.5 font-medium text-[var(--foreground)]">{c.categoryName}</td>
                        <td className="px-4 py-2.5 text-right text-[var(--muted-foreground)]">{c.count}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-[var(--foreground)]">{formatCurrency(c.originalCost)}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-[var(--muted-foreground)]">{formatCurrency(c.accumulatedDepreciation)}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-[var(--foreground)]">{formatCurrency(c.bookValue)}</td>
                        <td className="px-4 py-2.5 text-right">
                          <span className={cn("text-xs font-semibold",
                            remaining <= 20 ? "text-red-600 dark:text-red-400"
                            : remaining <= 50 ? "text-amber-600 dark:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400"
                          )}>
                            {remaining}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {/* Grand total */}
                  {summary && (
                    <tr className="bg-[var(--muted)]/50 font-semibold border-t border-[var(--border)]">
                      <td className="px-4 py-2.5 text-[var(--foreground)]">Total</td>
                      <td className="px-4 py-2.5 text-right text-[var(--foreground)]">{summary.assetCount}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-[var(--foreground)]">{formatCurrency(summary.totalOriginalCost)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-[var(--foreground)]">{formatCurrency(summary.totalAccumulatedDepreciation)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-[var(--foreground)]">{formatCurrency(summary.totalBookValue)}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="text-xs font-semibold text-[var(--foreground)]">
                          {summary.totalOriginalCost > 0 ? Math.round((summary.totalBookValue / summary.totalOriginalCost) * 100) : 0}%
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
