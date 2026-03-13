"use client";

import Link from "next/link";
import { ChevronLeft, AlertTriangle, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import { useRepairVsReplace } from "@/hooks/use-tco";
import type { RepairVsReplaceRecord, TCORecommendation } from "@asset-hub/shared";

function recoBadge(rec: TCORecommendation) {
  const config: Record<TCORecommendation, { label: string; classes: string }> = {
    green: { label: "Keep", classes: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20" },
    yellow: { label: "Watch", classes: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20" },
    red: { label: "Replace", classes: "bg-red-100 text-red-900 border-red-300 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20" },
  };
  const { label, classes } = config[rec];
  return <Badge className={cn("text-[10px] border", classes)}>{label}</Badge>;
}

function downloadCSV(rows: RepairVsReplaceRecord[]) {
  const headers = ["Asset", "Category", "Age (years)", "Total TCO", "Replacement Cost", "TCO Ratio", "Recommendation"];
  const lines = [
    headers.join(","),
    ...rows.map((r) => [
      `"${r.assetName}"`,
      `"${r.categoryName ?? ""}"`,
      r.ageYears.toFixed(1),
      r.totalTco.toFixed(2),
      r.replacementCost.toFixed(2),
      (r.tcoRatio * 100).toFixed(0) + "%",
      r.recommendation,
    ].join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "repair-vs-replace.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function RepairVsReplacePage() {
  const { data, isLoading } = useRepairVsReplace();
  const records: RepairVsReplaceRecord[] = data?.data ?? [];

  const replaceCount = records.filter((r) => r.recommendation === "red").length;
  const watchCount = records.filter((r) => r.recommendation === "yellow").length;
  const totalReplacementCost = records
    .filter((r) => r.recommendation === "red")
    .reduce((s, r) => s + r.replacementCost, 0);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center gap-3 px-8">
          <Link href="/analytics/tco" className="flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            <ChevronLeft className="h-4 w-4" />
            TCO Analysis
          </Link>
          <span className="text-[var(--border)]">/</span>
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <h1 className="text-xl font-bold text-[var(--foreground)]">Repair vs Replace</h1>
          <div className="ml-auto">
            <button
              onClick={() => downloadCSV(records)}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{isLoading ? "—" : replaceCount}</p>
              <p className="text-xs text-[var(--muted-foreground)]">Assets Requiring Replacement</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{isLoading ? "—" : watchCount}</p>
              <p className="text-xs text-[var(--muted-foreground)]">Assets to Watch</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-5">
              <p className="text-2xl font-bold text-[var(--foreground)]">{isLoading ? "—" : formatCurrency(totalReplacementCost)}</p>
              <p className="text-xs text-[var(--muted-foreground)]">Estimated Replacement Budget</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Assets with TCO &ge; 80% of Replacement Cost ({records.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="h-32 animate-pulse m-4 rounded-lg bg-[var(--muted)]" />
            ) : records.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-sm text-[var(--muted-foreground)]">No assets meet the replacement threshold.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Asset</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Category</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Age</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Total TCO</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Replace Cost</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">TCO Ratio</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r) => (
                      <tr key={r.assetId} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/30 transition-colors">
                        <td className="px-4 py-3 font-medium">
                          <Link href={`/assets/${r.assetId}/tco`} className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
                            {r.assetName}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-[var(--muted-foreground)]">{r.categoryName ?? "—"}</td>
                        <td className="px-4 py-3 text-right text-[var(--muted-foreground)] tabular-nums">{r.ageYears.toFixed(1)}y</td>
                        <td className="px-4 py-3 text-right tabular-nums text-[var(--foreground)]">{formatCurrency(r.totalTco)}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-[var(--foreground)]">{formatCurrency(r.replacementCost)}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={cn("font-semibold tabular-nums",
                            r.tcoRatio >= 1 ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"
                          )}>
                            {(r.tcoRatio * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="px-4 py-3">{recoBadge(r.recommendation)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
