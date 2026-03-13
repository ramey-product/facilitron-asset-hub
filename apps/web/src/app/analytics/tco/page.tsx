"use client";

import { useState } from "react";
import Link from "next/link";
import { DollarSign, ChevronRight, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useTCOComparison } from "@/hooks/use-tco";
import type { AssetTCO, TCORecommendation } from "@asset-hub/shared";

function recoBadge(rec: TCORecommendation) {
  const config: Record<TCORecommendation, { label: string; classes: string }> = {
    green: { label: "Keep", classes: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20" },
    yellow: { label: "Watch", classes: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20" },
    red: { label: "Replace", classes: "bg-red-100 text-red-900 border-red-300 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20" },
  };
  const { label, classes } = config[rec];
  return <Badge className={cn("text-[10px] border", classes)}>{label}</Badge>;
}

export default function TCOPage() {
  const { data, isLoading } = useTCOComparison();
  const comparison = data?.data;
  const assets: AssetTCO[] = comparison?.assets ?? [];
  const summary = comparison?.summary;

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"totalTco" | "tcoRatio" | "annualTco" | "ageYears">("tcoRatio");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function toggleSort(field: typeof sortField) {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  }

  const filtered = assets
    .filter((a) => !search || a.assetName.toLowerCase().includes(search.toLowerCase()) || (a.categoryName ?? "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = a[sortField] as number;
      const bv = b[sortField] as number;
      return sortDir === "asc" ? av - bv : bv - av;
    });

  // Chart — top 12 by TCO ratio
  const chartData = [...assets]
    .sort((a, b) => b.tcoRatio - a.tcoRatio)
    .slice(0, 12)
    .map((a) => ({
      name: a.assetName.length > 14 ? a.assetName.slice(0, 13) + "…" : a.assetName,
      totalTco: a.totalTco,
      replacementCost: a.replacementCost,
    }));

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center gap-4 px-8">
          <DollarSign className="h-5 w-5 text-[var(--primary)]" />
          <h1 className="text-xl font-bold text-[var(--foreground)]">TCO Analysis</h1>
          <span className="text-sm text-[var(--muted-foreground)]">Total cost of ownership comparison</span>
          <div className="ml-auto">
            <Link href="/analytics/tco/repair-replace">
              <button className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Repair vs Replace
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {isLoading ? "—" : formatCurrency(summary?.totalTco ?? 0)}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">Total Fleet TCO</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-2xl font-bold text-[var(--foreground)]">
                {isLoading ? "—" : `${((summary?.avgTcoRatio ?? 0) * 100).toFixed(0)}%`}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">Avg TCO / Replacement Cost</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className={cn("text-2xl font-bold", (summary?.assetsNeedingReplacement ?? 0) > 0 ? "text-red-600 dark:text-red-400" : "text-[var(--foreground)]")}>
                {isLoading ? "—" : summary?.assetsNeedingReplacement ?? 0}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">Assets Flagged for Replacement</p>
            </CardContent>
          </Card>
        </div>

        {/* Bar chart */}
        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">TCO vs Replacement Cost (Top 12 by TCO Ratio)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} angle={-20} textAnchor="end" height={44} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                      formatter={(v: unknown) => [formatCurrency(Number(v)), ""]}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="totalTco" name="Total TCO" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="replacementCost" name="Replacement Cost" fill="#d1d5db" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
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
                    {(["totalTco", "annualTco", "tcoRatio", "ageYears"] as const).map((f) => (
                      <th
                        key={f}
                        className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)] cursor-pointer hover:text-[var(--foreground)] select-none"
                        onClick={() => toggleSort(f)}
                      >
                        {f === "totalTco" ? "Total TCO" : f === "annualTco" ? "Annual TCO" : f === "tcoRatio" ? "TCO Ratio" : "Age"}{" "}
                        {sortField === f ? (sortDir === "asc" ? "▲" : "▼") : ""}
                      </th>
                    ))}
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Status</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.assetId} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                        <Link href={`/assets/${a.assetId}/tco`} className="hover:text-[var(--primary)] transition-colors">
                          {a.assetName}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">{a.categoryName ?? "—"}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-[var(--foreground)]">{formatCurrency(a.totalTco)}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-[var(--muted-foreground)]">{formatCurrency(a.annualTco)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={cn("font-semibold tabular-nums",
                          a.tcoRatio >= 1 ? "text-red-600 dark:text-red-400" : a.tcoRatio >= 0.8 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                        )}>
                          {(a.tcoRatio * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-[var(--muted-foreground)] tabular-nums">{a.ageYears.toFixed(1)}y</td>
                      <td className="px-4 py-3">{recoBadge(a.recommendation)}</td>
                      <td className="px-4 py-3">
                        <Link href={`/assets/${a.assetId}/tco`}>
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
