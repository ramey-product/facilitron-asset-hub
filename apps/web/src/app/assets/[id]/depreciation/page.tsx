"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { useAssetDepreciation, useDepreciationSchedule } from "@/hooks/use-depreciation";
import type { AssetDepreciation, DepreciationScheduleRow } from "@asset-hub/shared";

function methodBadge(method: "straight-line" | "declining-balance") {
  return (
    <Badge className={cn("text-xs border px-3 py-1",
      method === "straight-line"
        ? "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/20"
        : "bg-violet-100 text-violet-900 border-violet-300 dark:bg-violet-400/10 dark:text-violet-400 dark:border-violet-400/20"
    )}>
      {method === "straight-line" ? "Straight-Line" : "Declining Balance"}
    </Badge>
  );
}

const CURRENT_YEAR = 2026;

export default function AssetDepreciationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const assetId = parseInt(id, 10);
  const { data: depData, isLoading } = useAssetDepreciation(assetId);
  const { data: schedData } = useDepreciationSchedule(assetId);
  const record: AssetDepreciation | undefined = depData?.data;
  const schedule: DepreciationScheduleRow[] = schedData?.data ?? [];

  const yearsRemaining = record ? Math.max(0, record.usefulLifeYears - record.yearsElapsed) : 0;

  // Chart data
  const chartData = schedule.map((row) => ({
    year: row.year,
    bookValue: row.endingValue,
    isCurrent: row.year === CURRENT_YEAR,
  }));

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center gap-3 px-8">
          <Link href={`/assets/${assetId}`} className="flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to Asset
          </Link>
          <span className="text-[var(--border)]">/</span>
          <TrendingDown className="h-4 w-4 text-[var(--primary)]" />
          <h1 className="text-xl font-bold text-[var(--foreground)]">Depreciation</h1>
          {record && <div className="ml-4">{methodBadge(record.method)}</div>}
          {record?.isFullyDepreciated && (
            <Badge className="bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-400/10 dark:text-zinc-400 dark:border-zinc-400/20 text-xs border ml-2">
              Fully Depreciated
            </Badge>
          )}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-[var(--muted)]" />
            ))}
          </div>
        )}

        {!isLoading && !record && (
          <div className="rounded-xl border border-dashed border-[var(--border)] p-16 text-center">
            <TrendingDown className="mx-auto h-12 w-12 text-[var(--muted-foreground)] mb-4" />
            <p className="text-lg font-semibold text-[var(--foreground)]">No depreciation data</p>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">Depreciation has not been configured for this asset.</p>
          </div>
        )}

        {record && (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Card>
                <CardContent className="pt-5 pb-5">
                  <p className="text-2xl font-bold text-[var(--foreground)]">{formatCurrency(record.currentBookValue)}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Current Book Value</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 pb-5">
                  <p className="text-2xl font-bold text-[var(--foreground)]">{formatCurrency(record.annualDepreciation)}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Annual Depreciation</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 pb-5">
                  <p className="text-2xl font-bold text-[var(--foreground)]">{formatCurrency(record.accumulatedDepreciation)}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Accumulated Depreciation</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 pb-5">
                  <p className={cn("text-2xl font-bold", yearsRemaining === 0 ? "text-red-600 dark:text-red-400" : "text-[var(--foreground)]")}>
                    {yearsRemaining}y
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">Useful Life Remaining</p>
                </CardContent>
              </Card>
            </div>

            {/* Book value chart */}
            {chartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Book Value Over Useful Life</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="year" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                        <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                        <Tooltip
                          contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                          formatter={(v: unknown) => [formatCurrency(Number(v)), "Book Value"]}
                        />
                        <ReferenceLine x={CURRENT_YEAR} stroke="var(--primary)" strokeDasharray="4 4" label={{ value: "Today", fill: "var(--primary)", fontSize: 11 }} />
                        <Line
                          type="monotone"
                          dataKey="bookValue"
                          stroke="#6366f1"
                          strokeWidth={2}
                          dot={(props: Record<string, unknown>) => {
                            const cx = Number(props.cx ?? 0);
                            const cy = Number(props.cy ?? 0);
                            const payload = props.payload as { isCurrent?: boolean } | undefined;
                            return payload?.isCurrent ? (
                              <circle key="current" cx={cx} cy={cy} r={6} fill="#6366f1" stroke="white" strokeWidth={2} />
                            ) : (
                              <circle key="normal" cx={cx} cy={cy} r={2} fill="#6366f1" />
                            );
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Schedule table */}
            {schedule.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Year-by-Year Schedule</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Year</th>
                          <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Beginning Value</th>
                          <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Annual Dep.</th>
                          <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Accumulated</th>
                          <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Ending Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.map((row) => (
                          <tr key={row.year} className={cn(
                            "border-b border-[var(--border)] last:border-0 transition-colors",
                            row.isCurrent
                              ? "bg-[var(--primary)]/5 border-l-2 border-l-[var(--primary)]"
                              : row.isPast
                              ? "opacity-60 hover:opacity-100 hover:bg-[var(--muted)]/30"
                              : "hover:bg-[var(--muted)]/30"
                          )}>
                            <td className="px-4 py-2.5">
                              <span className="font-medium text-[var(--foreground)]">{row.year}</span>
                              {row.isCurrent && (
                                <span className="ml-2 text-[10px] font-semibold text-[var(--primary)]">Current</span>
                              )}
                            </td>
                            <td className="px-4 py-2.5 text-right tabular-nums text-[var(--foreground)]">{formatCurrency(row.beginningValue)}</td>
                            <td className="px-4 py-2.5 text-right tabular-nums text-red-600 dark:text-red-400">{formatCurrency(row.annualDepreciation)}</td>
                            <td className="px-4 py-2.5 text-right tabular-nums text-[var(--muted-foreground)]">{formatCurrency(row.accumulatedDepreciation)}</td>
                            <td className="px-4 py-2.5 text-right tabular-nums font-medium text-[var(--foreground)]">{formatCurrency(row.endingValue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
