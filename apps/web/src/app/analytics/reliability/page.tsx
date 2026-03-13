"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { useReliabilityOverview } from "@/hooks/use-downtime";
import type { ReliabilityRecord } from "@asset-hub/shared";

function availabilityColor(avail: number): string {
  if (avail >= 95) return "text-emerald-600 dark:text-emerald-400";
  if (avail >= 85) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function availabilityBg(avail: number): string {
  if (avail >= 95) return "bg-emerald-500";
  if (avail >= 85) return "bg-amber-500";
  return "bg-red-500";
}

function TrendIcon({ trend }: { trend: "improving" | "declining" | "stable" }) {
  if (trend === "improving") return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />;
  if (trend === "declining") return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
  return <Minus className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />;
}

export default function ReliabilityPage() {
  const { data, isLoading } = useReliabilityOverview();
  const records: ReliabilityRecord[] = data?.data ?? [];

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"availability" | "mtbf" | "mttr" | "downtimeEvents">("availability");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  function toggleSort(field: typeof sortField) {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  }

  const filtered = records
    .filter((r) => !search || r.assetName.toLowerCase().includes(search.toLowerCase()) || (r.categoryName ?? "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = a[sortField] as number;
      const bv = b[sortField] as number;
      return sortDir === "asc" ? av - bv : bv - av;
    });

  // KPIs
  const avgAvail = records.length > 0 ? Math.round(records.reduce((s, r) => s + r.availability, 0) / records.length * 10) / 10 : 0;
  const critical = records.filter((r) => r.availability < 85).length;
  const improving = records.filter((r) => r.trend === "improving").length;
  const totalDowntimeHrs = Math.round(records.reduce((s, r) => s + r.totalDowntimeHours, 0) * 10) / 10;

  // Chart data — top 12 worst by availability
  const chartData = [...records]
    .sort((a, b) => a.availability - b.availability)
    .slice(0, 12)
    .map((r) => ({
      name: r.assetName.length > 14 ? r.assetName.slice(0, 13) + "…" : r.assetName,
      availability: r.availability,
      assetId: r.assetId,
    }));

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center gap-4 px-8">
          <Activity className="h-5 w-5 text-[var(--primary)]" />
          <h1 className="text-xl font-bold text-[var(--foreground)]">Reliability Dashboard</h1>
          <span className="text-sm text-[var(--muted-foreground)]">MTBF · MTTR · Availability (90-day window)</span>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-2xl font-bold text-[var(--foreground)]">{isLoading ? "—" : `${avgAvail}%`}</p>
              <p className="text-xs text-[var(--muted-foreground)]">Fleet Average Availability</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className={cn("text-2xl font-bold", critical > 0 ? "text-red-600 dark:text-red-400" : "text-[var(--foreground)]")}>
                {isLoading ? "—" : critical}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">Assets Below 85% Availability</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{isLoading ? "—" : improving}</p>
              <p className="text-xs text-[var(--muted-foreground)]">Improving Trend</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-2xl font-bold text-[var(--foreground)]">{isLoading ? "—" : `${totalDowntimeHrs}h`}</p>
              <p className="text-xs text-[var(--muted-foreground)]">Total Downtime (90d)</p>
            </CardContent>
          </Card>
        </div>

        {/* Bar chart */}
        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Availability by Asset (Bottom 12)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} angle={-20} textAnchor="end" height={40} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                      formatter={(v: unknown) => [`${v}%`, "Availability"]}
                    />
                    <Bar dataKey="availability" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry) => (
                        <Cell
                          key={entry.assetId}
                          fill={entry.availability >= 95 ? "#10b981" : entry.availability >= 85 ? "#f59e0b" : "#ef4444"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> &ge;95% Good</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> 85–95% Warning</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> &lt;85% Critical</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">All Assets</CardTitle>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assets..."
                className="h-8 w-56 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Asset</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Category</th>
                    {(["availability", "mtbf", "mttr", "downtimeEvents"] as const).map((f) => (
                      <th
                        key={f}
                        className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)] cursor-pointer hover:text-[var(--foreground)] select-none"
                        onClick={() => toggleSort(f)}
                      >
                        {f === "availability" ? "Availability" : f === "mtbf" ? "MTBF" : f === "mttr" ? "MTTR" : "Events"}{" "}
                        {sortField === f ? (sortDir === "asc" ? "▲" : "▼") : ""}
                      </th>
                    ))}
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Trend</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.assetId} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                        <Link href={`/assets/${r.assetId}/downtime`} className="hover:text-[var(--primary)] transition-colors">
                          {r.assetName}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{r.categoryName ?? "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={cn("font-semibold tabular-nums", availabilityColor(r.availability))}>
                          {r.availability}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--foreground)] tabular-nums">{r.mtbf}h</td>
                      <td className="px-4 py-3 text-right text-[var(--foreground)] tabular-nums">{r.mttr}h</td>
                      <td className="px-4 py-3 text-right text-[var(--muted-foreground)] tabular-nums">{r.downtimeEvents}</td>
                      <td className="px-4 py-3">
                        <TrendIcon trend={r.trend} />
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/assets/${r.assetId}/downtime`}>
                          <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
