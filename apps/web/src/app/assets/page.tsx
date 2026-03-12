"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpDown,
  ExternalLink,
  QrCode,
  Download,
  Plus,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, getConditionBg, getLifecycleBg } from "@/lib/utils";
import { useAssets, conditionLabel, lifecycleLabel } from "@/hooks/use-assets";

const conditions = ["excellent", "good", "fair", "poor", "critical"] as const;
const lifecycleStages = ["Active", "UnderMaintenance", "Flagged", "Decommissioned"] as const;

export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [sortBy, setSortBy] = useState("equipmentName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Debounce search with proper cleanup
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      if (search !== debouncedSearch) setPage(1);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Build API params
  const params: Record<string, string | number> = {
    page,
    limit,
    sortBy,
    sortOrder,
  };
  if (debouncedSearch) params.search = debouncedSearch;
  if (selectedCondition !== "all") params.condition = selectedCondition;
  if (selectedStatus !== "all") params.status = selectedStatus;

  const { data, isLoading, isError } = useAssets(params);

  const assets = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, limit: 20, total: 0, totalPages: 0 };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const activeFilters = [selectedCondition, selectedStatus].filter(
    (f) => f !== "all"
  ).length;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              Asset Registry
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              {meta.total} assets{activeFilters > 0 ? " (filtered)" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-3.5 w-3.5" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <QrCode className="mr-2 h-3.5 w-3.5" />
              Scan
            </Button>
            <Link href="/assets/new">
              <Button size="sm">
                <Plus className="mr-2 h-3.5 w-3.5" />
                Add Asset
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-4">
        {/* Search & Filters Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search by name, serial, barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] pl-9 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              aria-label="Search assets"
            />
          </div>

          <select
            value={selectedCondition}
            onChange={(e) => {
              setSelectedCondition(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            aria-label="Filter by condition"
          >
            <option value="all">All Conditions</option>
            {conditions.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            aria-label="Filter by lifecycle status"
          >
            <option value="all">All Statuses</option>
            {lifecycleStages.map((s) => (
              <option key={s} value={s}>
                {lifecycleLabel(s)}
              </option>
            ))}
          </select>

          {activeFilters > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-[var(--muted-foreground)]"
              onClick={() => {
                setSelectedCondition("all");
                setSelectedStatus("all");
                setSearch("");
                setDebouncedSearch("");
                setPage(1);
              }}
            >
              Clear ({activeFilters})
            </Button>
          )}

          <div className="ml-auto flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "table"
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
              aria-label="Table view"
              aria-pressed={viewMode === "table"}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <div className="p-4 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-4 w-20 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-48 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-5 w-16 animate-pulse rounded-md bg-[var(--muted)]" />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Error State */}
        {isError && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-sm text-[var(--destructive)]">
                Failed to load assets. Make sure the API server is running on port 3001.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Table View */}
        {!isLoading && !isError && viewMode === "table" && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    {[
                      { key: "equipmentBarCodeID", label: "Asset Tag" },
                      { key: "equipmentName", label: "Name" },
                      { key: "categoryName", label: "Category" },
                      { key: "propertyName", label: "Property" },
                      { key: "conditionRating", label: "Condition" },
                      { key: "lifecycleStatus", label: "Status" },
                      { key: "acquisitionCost", label: "Cost" },
                    ].map((col) => (
                      <th
                        key={col.key}
                        className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                        onClick={() => toggleSort(col.key)}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          <ArrowUpDown className="h-3 w-3 opacity-50" />
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-3 w-10">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr
                      key={asset.equipmentRecordID}
                      className="border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-[var(--muted-foreground)]">
                          {asset.equipmentBarCodeID ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/assets/${asset.equipmentRecordID}`}
                          className="group"
                        >
                          <div className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                            {asset.equipmentName}
                          </div>
                          {asset.serialNumber && (
                            <div className="text-[10px] text-[var(--muted-foreground)]">
                              S/N: {asset.serialNumber}
                            </div>
                          )}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {asset.categoryName ?? asset.equipmentTypeName ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {asset.propertyName ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={cn(
                            "text-[10px] border",
                            getConditionBg(conditionLabel(asset.conditionRating))
                          )}
                        >
                          {conditionLabel(asset.conditionRating)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={cn(
                            "text-[10px] border",
                            getLifecycleBg(lifecycleLabel(asset.lifecycleStatus))
                          )}
                        >
                          {lifecycleLabel(asset.lifecycleStatus)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-[var(--foreground)]">
                          {asset.acquisitionCost
                            ? formatCurrency(asset.acquisitionCost)
                            : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/assets/${asset.equipmentRecordID}`}
                          aria-label={`View ${asset.equipmentName} details`}
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {assets.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-12 text-center text-sm text-[var(--muted-foreground)]"
                      >
                        No assets found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Grid View */}
        {!isLoading && !isError && viewMode === "grid" && (
          <div className="grid grid-cols-3 gap-4">
            {assets.map((asset) => (
              <Link
                key={asset.equipmentRecordID}
                href={`/assets/${asset.equipmentRecordID}`}
              >
                <Card className="hover:border-[var(--primary)]/30 transition-all hover:shadow-lg hover:shadow-[var(--primary)]/5 cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[10px] text-[var(--muted-foreground)]">
                          {asset.equipmentBarCodeID ?? "—"}
                        </span>
                        <h3 className="text-sm font-semibold text-[var(--foreground)] mt-0.5">
                          {asset.equipmentName}
                        </h3>
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                          {asset.propertyName ?? "—"}
                        </p>
                      </div>
                      <Badge
                        className={cn(
                          "text-[10px] border",
                          getConditionBg(conditionLabel(asset.conditionRating))
                        )}
                      >
                        {conditionLabel(asset.conditionRating)}
                      </Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                          Category
                        </div>
                        <div className="text-xs font-medium text-[var(--foreground)]">
                          {asset.categoryName ?? "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                          Cost
                        </div>
                        <div className="text-xs font-medium text-[var(--foreground)]">
                          {asset.acquisitionCost
                            ? formatCurrency(asset.acquisitionCost)
                            : "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                          Serial
                        </div>
                        <div className="text-xs font-medium text-[var(--foreground)]">
                          {asset.serialNumber ?? "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                          Status
                        </div>
                        <Badge
                          className={cn(
                            "text-[10px] border mt-0.5",
                            getLifecycleBg(
                              lifecycleLabel(asset.lifecycleStatus)
                            )
                          )}
                        >
                          {lifecycleLabel(asset.lifecycleStatus)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && meta.totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-[var(--muted-foreground)]">
              Page {meta.page} of {meta.totalPages} ({meta.total} total)
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
