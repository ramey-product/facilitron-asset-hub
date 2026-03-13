"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useStockRollup } from "@/hooks/use-stock";

type StockFilter = "all" | "in-stock" | "low-stock" | "out-of-stock";

function stockCellColor(qty: number, reorderPoint: number): string {
  if (qty <= 0) {
    return "bg-red-100 text-red-900 dark:bg-red-400/10 dark:text-red-400";
  }
  if (qty <= reorderPoint) {
    return "bg-amber-100 text-amber-900 dark:bg-yellow-400/10 dark:text-yellow-400";
  }
  return "bg-emerald-50 text-emerald-900 dark:bg-emerald-400/5 dark:text-emerald-400";
}

export default function StockMatrixPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StockFilter>("all");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const params: Record<string, string | number> = {};
  if (debouncedSearch) params.search = debouncedSearch;
  if (statusFilter !== "all") params.status = statusFilter;

  const { data, isLoading, isError } = useStockRollup(params);
  const rollup = data?.data ?? [];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">Stock Matrix</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              System-wide inventory levels across all locations
            </p>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search parts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] pl-9 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              aria-label="Search stock matrix"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StockFilter)}
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            aria-label="Filter by stock status"
          >
            <option value="all">All Statuses</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        {/* Loading */}
        {isLoading && (
          <Card>
            <div className="p-4 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-4 w-16 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-48 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-8 w-16 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-8 w-16 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-8 w-16 animate-pulse rounded bg-[var(--muted)]" />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Error */}
        {isError && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-sm text-[var(--destructive)]">
                Failed to load stock data. Make sure the API server is running.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Matrix Table */}
        {!isLoading && !isError && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] sticky left-0 bg-[var(--card)]">
                      SKU
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] sticky left-[80px] bg-[var(--card)]">
                      Part Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Total On Hand
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Reserved
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Available
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Locations
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Reorder Point
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rollup.map((row) => (
                    <tr
                      key={row.partId}
                      className="border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/50 transition-colors"
                    >
                      <td className="px-4 py-3 sticky left-0 bg-[var(--card)]">
                        <span className="font-mono text-xs text-[var(--muted-foreground)]">{row.sku}</span>
                      </td>
                      <td className="px-4 py-3 sticky left-[80px] bg-[var(--card)]">
                        <span className="text-sm font-medium text-[var(--foreground)]">{row.partName}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn("inline-block min-w-[40px] rounded px-2 py-1 text-sm font-medium", stockCellColor(row.totalOnHand, row.reorderPoint))}>
                          {row.totalOnHand}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-[var(--muted-foreground)]">
                        {row.totalReserved}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-medium text-[var(--foreground)]">{row.totalAvailable}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-[var(--muted-foreground)]">
                        {row.locationCount}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-[var(--muted-foreground)]">
                        {row.reorderPoint}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={cn(
                            "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                            row.stockStatus === "in-stock"
                              ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-400"
                              : row.stockStatus === "low-stock"
                              ? "bg-amber-100 text-amber-900 dark:bg-yellow-400/10 dark:text-yellow-400"
                              : "bg-red-100 text-red-900 dark:bg-red-400/10 dark:text-red-400"
                          )}
                        >
                          {row.stockStatus === "in-stock" ? "In Stock" : row.stockStatus === "low-stock" ? "Low Stock" : "Out"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {rollup.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-sm text-[var(--muted-foreground)]">
                        No stock data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
