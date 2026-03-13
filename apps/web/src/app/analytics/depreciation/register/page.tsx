"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Download, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useFixedAssetRegister } from "@/hooks/use-depreciation";
import type { FixedAssetRegisterRow } from "@asset-hub/shared";

function methodBadge(method: "straight-line" | "declining-balance") {
  return (
    <Badge className={cn("text-[10px] border",
      method === "straight-line"
        ? "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/20"
        : "bg-violet-100 text-violet-900 border-violet-300 dark:bg-violet-400/10 dark:text-violet-400 dark:border-violet-400/20"
    )}>
      {method === "straight-line" ? "SL" : "DB"}
    </Badge>
  );
}

function downloadCSV(rows: FixedAssetRegisterRow[]) {
  const headers = ["Asset", "Category", "Property", "Acquisition Date", "Useful Life", "Method", "Original Cost", "Annual Dep.", "Accumulated Dep.", "Book Value", "Salvage Value", "Fully Depreciated"];
  const lines = [
    headers.join(","),
    ...rows.map((r) => [
      `"${r.assetName}"`,
      `"${r.categoryName ?? ""}"`,
      `"${r.propertyName ?? ""}"`,
      `"${r.acquisitionDate ?? ""}"`,
      r.usefulLife,
      r.method,
      r.originalCost.toFixed(2),
      r.annualDepreciation.toFixed(2),
      r.accumulatedDepreciation.toFixed(2),
      r.currentBookValue.toFixed(2),
      r.salvageValue.toFixed(2),
      r.isFullyDepreciated ? "Yes" : "No",
    ].join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "fixed-asset-register.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function FixedAssetRegisterPage() {
  const { data, isLoading } = useFixedAssetRegister();
  const rows: FixedAssetRegisterRow[] = data?.data ?? [];
  const [search, setSearch] = useState("");

  const filtered = rows.filter((r) =>
    !search ||
    r.assetName.toLowerCase().includes(search.toLowerCase()) ||
    (r.categoryName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  // Totals
  const totalOriginal = filtered.reduce((s, r) => s + r.originalCost, 0);
  const totalAnnual = filtered.reduce((s, r) => s + r.annualDepreciation, 0);
  const totalAccumulated = filtered.reduce((s, r) => s + r.accumulatedDepreciation, 0);
  const totalBook = filtered.reduce((s, r) => s + r.currentBookValue, 0);
  const totalSalvage = filtered.reduce((s, r) => s + r.salvageValue, 0);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center gap-3 px-8">
          <Link href="/analytics/depreciation" className="flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Depreciation
          </Link>
          <span className="text-[var(--border)]">/</span>
          <TrendingDown className="h-4 w-4 text-[var(--primary)]" />
          <h1 className="text-xl font-bold text-[var(--foreground)]">Fixed Asset Register</h1>
          <div className="ml-auto flex items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets..."
              className="h-8 w-48 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
            />
            <button
              onClick={() => downloadCSV(filtered)}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">{filtered.length} Assets</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="h-32 animate-pulse m-4 rounded-lg bg-[var(--muted)]" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[900px]">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Asset</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Category</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Acquired</th>
                      <th className="px-4 py-2.5 text-center text-xs font-semibold text-[var(--muted-foreground)]">Life</th>
                      <th className="px-4 py-2.5 text-center text-xs font-semibold text-[var(--muted-foreground)]">Method</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Original Cost</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Annual Dep.</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Accumulated</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Book Value</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Salvage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.assetId} className={cn(
                        "border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/30 transition-colors",
                        r.isFullyDepreciated && "opacity-60"
                      )}>
                        <td className="px-4 py-2.5">
                          <Link href={`/assets/${r.assetId}/depreciation`} className="font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
                            {r.assetName}
                          </Link>
                          {r.isFullyDepreciated && (
                            <span className="ml-2 text-[10px] text-[var(--muted-foreground)] bg-[var(--muted)] rounded px-1 py-0.5">Fully Depr.</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-[var(--muted-foreground)]">{r.categoryName ?? "—"}</td>
                        <td className="px-4 py-2.5 text-[var(--muted-foreground)]">{r.acquisitionDate ? formatDate(r.acquisitionDate) : "—"}</td>
                        <td className="px-4 py-2.5 text-center text-[var(--muted-foreground)]">{r.usefulLife}y</td>
                        <td className="px-4 py-2.5 text-center">{methodBadge(r.method)}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-[var(--foreground)]">{formatCurrency(r.originalCost)}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-[var(--muted-foreground)]">{formatCurrency(r.annualDepreciation)}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-[var(--muted-foreground)]">{formatCurrency(r.accumulatedDepreciation)}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums font-medium text-[var(--foreground)]">{formatCurrency(r.currentBookValue)}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-[var(--muted-foreground)]">{formatCurrency(r.salvageValue)}</td>
                      </tr>
                    ))}
                    {/* Grand total row */}
                    <tr className="border-t border-[var(--border)] bg-[var(--muted)]/50 font-semibold">
                      <td className="px-4 py-2.5 text-[var(--foreground)]" colSpan={5}>Grand Total ({filtered.length} assets)</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-[var(--foreground)]">{formatCurrency(totalOriginal)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-[var(--foreground)]">{formatCurrency(totalAnnual)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-[var(--foreground)]">{formatCurrency(totalAccumulated)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-[var(--foreground)]">{formatCurrency(totalBook)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-[var(--foreground)]">{formatCurrency(totalSalvage)}</td>
                    </tr>
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
