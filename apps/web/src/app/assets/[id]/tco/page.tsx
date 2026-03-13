"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useAssetTCO } from "@/hooks/use-tco";
import type { AssetTCO, TCORecommendation } from "@asset-hub/shared";

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"];

function recoBadge(rec: TCORecommendation) {
  const config: Record<TCORecommendation, { label: string; classes: string }> = {
    green: { label: "Keep — Low TCO", classes: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20" },
    yellow: { label: "Watch — Moderate TCO", classes: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20" },
    red: { label: "Replace — High TCO", classes: "bg-red-100 text-red-900 border-red-300 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20" },
  };
  const { label, classes } = config[rec];
  return <Badge className={cn("text-xs border px-3 py-1", classes)}>{label}</Badge>;
}

function TCOBreakdown({ tco }: { tco: AssetTCO }) {
  const breakdown = [
    { name: "Maintenance", value: tco.maintenanceCost },
    { name: "Parts", value: tco.partsCost },
    { name: "Labor", value: tco.laborCost },
    { name: "Downtime", value: tco.downtimeCost },
    { name: "Depreciation", value: tco.depreciationCost },
  ].filter((d) => d.value > 0);

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={breakdown}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {breakdown.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]!} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
            formatter={(v: unknown) => [formatCurrency(Number(v)), ""]}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function AssetTCOPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const assetId = parseInt(id, 10);
  const { data, isLoading } = useAssetTCO(assetId);
  const tco: AssetTCO | undefined = data?.data;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center gap-3 px-8">
          <Link href={`/assets/${assetId}`} className="flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to Asset
          </Link>
          <span className="text-[var(--border)]">/</span>
          <DollarSign className="h-4 w-4 text-[var(--primary)]" />
          <h1 className="text-xl font-bold text-[var(--foreground)]">Total Cost of Ownership</h1>
          {tco && <div className="ml-4">{recoBadge(tco.recommendation)}</div>}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {isLoading && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-[var(--muted)]" />
              ))}
            </div>
          </div>
        )}

        {!isLoading && !tco && (
          <div className="rounded-xl border border-dashed border-[var(--border)] p-16 text-center">
            <DollarSign className="mx-auto h-12 w-12 text-[var(--muted-foreground)] mb-4" />
            <p className="text-lg font-semibold text-[var(--foreground)]">No TCO data available</p>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">TCO records have not been calculated for this asset.</p>
          </div>
        )}

        {tco && (
          <>
            {/* KPI strip */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Card>
                <CardContent className="pt-5 pb-5">
                  <p className="text-2xl font-bold text-[var(--foreground)]">{formatCurrency(tco.totalTco)}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Lifetime TCO</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 pb-5">
                  <p className="text-2xl font-bold text-[var(--foreground)]">{formatCurrency(tco.annualTco)}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Annual Cost</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 pb-5">
                  <p className={cn("text-2xl font-bold",
                    tco.tcoRatio >= 1 ? "text-red-600 dark:text-red-400"
                    : tco.tcoRatio >= 0.8 ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400"
                  )}>
                    {(tco.tcoRatio * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">of Replacement Cost</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5 pb-5">
                  <p className="text-2xl font-bold text-[var(--foreground)]">{tco.ageYears.toFixed(1)}y</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Asset Age</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Pie chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <TCOBreakdown tco={tco} />
                </CardContent>
              </Card>

              {/* Cost detail table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Cost Detail</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        { label: "Purchase Cost", value: tco.purchaseCost, muted: true },
                        { label: "Maintenance Labor", value: tco.laborCost },
                        { label: "Parts & Materials", value: tco.partsCost },
                        { label: "Maintenance Total", value: tco.maintenanceCost },
                        { label: "Downtime Cost", value: tco.downtimeCost },
                        { label: "Accumulated Depreciation", value: tco.depreciationCost },
                      ].map(({ label, value, muted }) => (
                        <tr key={label} className="border-b border-[var(--border)] last:border-0">
                          <td className={cn("px-4 py-2.5", muted ? "text-[var(--muted-foreground)]" : "text-[var(--foreground)]")}>
                            {label}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono text-[var(--foreground)]">
                            {formatCurrency(value)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-[var(--muted)]/50 font-semibold">
                        <td className="px-4 py-2.5 text-[var(--foreground)]">Total TCO</td>
                        <td className="px-4 py-2.5 text-right font-mono text-[var(--foreground)]">
                          {formatCurrency(tco.totalTco)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2.5 text-[var(--muted-foreground)]">Replacement Cost (current)</td>
                        <td className="px-4 py-2.5 text-right font-mono text-[var(--muted-foreground)]">
                          {formatCurrency(tco.replacementCost)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
