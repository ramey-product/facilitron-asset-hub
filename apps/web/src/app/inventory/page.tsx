"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpDown,
  ExternalLink,
  Plus,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { useParts, usePartCategories } from "@/hooks/use-inventory";
import { CollapsibleFilterSidebar } from "@/components/layout/collapsible-filter-sidebar";

function stockStatusBadge(part: { reorderPoint: number; minQty: number }, totalOnHand?: number) {
  // When we don't have rollup data, use the part's own fields as a rough signal
  const qty = totalOnHand ?? 0;
  if (qty <= 0) {
    return (
      <Badge className="text-[10px] border bg-red-100 text-red-900 border-red-300 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20">
        Out of Stock
      </Badge>
    );
  }
  if (qty <= part.reorderPoint) {
    return (
      <Badge className="text-[10px] border bg-amber-100 text-amber-900 border-amber-300 dark:bg-yellow-400/10 dark:text-yellow-400 dark:border-yellow-400/20">
        Low Stock
      </Badge>
    );
  }
  return (
    <Badge className="text-[10px] border bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20">
      In Stock
    </Badge>
  );
}

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Debounce search
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
  if (selectedCategory !== null) params.categoryId = selectedCategory;

  const { data, isLoading, isError } = useParts(params);
  const { data: categoriesData } = usePartCategories();

  const parts = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, limit: 20, total: 0, totalPages: 0 };
  const categories = categoriesData?.data ?? [];

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              Parts Catalog
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              {meta.total} parts{selectedCategory !== null ? " (filtered)" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/inventory/new">
              <Button size="sm">
                <Plus className="mr-2 h-3.5 w-3.5" />
                Add Part
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Category Sidebar */}
        <CollapsibleFilterSidebar storageKey="parts-catalog-categories">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">
            Categories
          </h2>
          <nav className="space-y-0.5" aria-label="Part categories">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setPage(1);
              }}
              className={cn(
                "w-full text-left rounded-md px-3 py-2 text-sm font-medium transition-colors",
                selectedCategory === null
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "text-[var(--foreground)] hover:bg-[var(--muted)]"
              )}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setPage(1);
                }}
                className={cn(
                  "w-full text-left rounded-md px-3 py-2 text-sm transition-colors flex items-center justify-between",
                  selectedCategory === cat.id
                    ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                    : "text-[var(--foreground)] hover:bg-[var(--muted)]"
                )}
              >
                <span className="truncate">{cat.name}</span>
                <span className="text-[10px] text-[var(--muted-foreground)] ml-2 shrink-0">
                  {cat.partCount}
                </span>
              </button>
            ))}
          </nav>
        </CollapsibleFilterSidebar>

        {/* Main Content */}
        <div className="flex-1 p-8 space-y-4">
          {/* Search & Filters Bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="Search by name, SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] pl-9 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                aria-label="Search parts"
              />
            </div>

            {/* Mobile category select (shown on small screens) */}
            <select
              value={selectedCategory ?? "all"}
              onChange={(e) => {
                setSelectedCategory(e.target.value === "all" ? null : Number(e.target.value));
                setPage(1);
              }}
              className="h-9 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)] lg:hidden"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <div className="ml-auto flex items-center border border-[var(--border)] rounded-lg overflow-hidden" role="group" aria-label="View mode">
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
                    <div className="h-4 w-16 animate-pulse rounded bg-[var(--muted)]" />
                    <div className="h-4 w-48 animate-pulse rounded bg-[var(--muted)]" />
                    <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
                    <div className="h-4 w-20 animate-pulse rounded bg-[var(--muted)]" />
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
                  Failed to load parts. Make sure the API server is running on port 3001.
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
                        { key: "sku", label: "SKU" },
                        { key: "name", label: "Name" },
                        { key: "categoryName", label: "Category" },
                        { key: "unitCost", label: "Unit Cost" },
                        { key: "unitOfMeasure", label: "UOM" },
                        { key: "vendorName", label: "Vendor" },
                        { key: "reorderPoint", label: "Stock" },
                      ].map((col) => (
                        <th
                          key={col.key}
                          scope="col"
                          aria-sort={sortBy === col.key ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
                          className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                          onClick={() => toggleSort(col.key)}
                        >
                          <div className="flex items-center gap-1">
                            {col.label}
                            <ArrowUpDown className="h-3 w-3 opacity-50" />
                          </div>
                        </th>
                      ))}
                      <th scope="col" className="px-4 py-3 w-10">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {parts.map((part) => (
                      <tr
                        key={part.id}
                        className="border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-[var(--muted-foreground)]">
                            {part.sku}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/inventory/${part.id}`} className="group">
                            <div className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                              {part.name}
                            </div>
                            {part.description && (
                              <div className="text-[10px] text-[var(--muted-foreground)] truncate max-w-xs">
                                {part.description}
                              </div>
                            )}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-[var(--muted-foreground)]">
                            {part.categoryName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-[var(--foreground)]">
                            {formatCurrency(part.unitCost)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-[var(--muted-foreground)]">
                            {part.unitOfMeasure}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-[var(--muted-foreground)]">
                            {part.vendorName ?? "---"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {stockStatusBadge(part)}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/inventory/${part.id}`}
                            aria-label={`View ${part.name} details`}
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {parts.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-4 py-12 text-center text-sm text-[var(--muted-foreground)]"
                        >
                          No parts found matching your filters.
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {parts.map((part) => (
                <Link key={part.id} href={`/inventory/${part.id}`}>
                  <Card className="hover:border-[var(--primary)]/30 transition-all hover:shadow-lg hover:shadow-[var(--primary)]/5 cursor-pointer h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] text-[var(--muted-foreground)]">
                            {part.sku}
                          </span>
                          <h3 className="text-sm font-semibold text-[var(--foreground)] mt-0.5 truncate">
                            {part.name}
                          </h3>
                          <p className="text-xs text-[var(--muted-foreground)] mt-1">
                            {part.categoryName}
                          </p>
                        </div>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--muted)]">
                          <Package className="h-5 w-5 text-[var(--muted-foreground)]" />
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                            Unit Cost
                          </div>
                          <div className="text-xs font-medium text-[var(--foreground)]">
                            {formatCurrency(part.unitCost)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                            UOM
                          </div>
                          <div className="text-xs font-medium text-[var(--foreground)]">
                            {part.unitOfMeasure}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                            Vendor
                          </div>
                          <div className="text-xs font-medium text-[var(--foreground)]">
                            {part.vendorName ?? "---"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                            Status
                          </div>
                          <div className="mt-0.5">
                            {stockStatusBadge(part)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {parts.length === 0 && (
                <div className="col-span-full py-12 text-center text-sm text-[var(--muted-foreground)]">
                  No parts found matching your filters.
                </div>
              )}
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
    </div>
  );
}
