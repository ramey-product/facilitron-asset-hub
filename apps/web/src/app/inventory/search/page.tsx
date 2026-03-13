"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Box,
  Package,
  ChevronRight,
  Tag,
  MapPin,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import { useInventorySearch } from "@/hooks/use-inventory-overview";
import type { CrossModuleSearchResult } from "@asset-hub/shared";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterMode = "all" | "asset" | "consumable";

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20",
  Inactive: "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-400/10 dark:text-zinc-400 dark:border-zinc-400/20",
  "Under Maintenance": "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/20",
  "Flagged for Replacement": "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-400/10 dark:text-orange-400 dark:border-orange-400/20",
  Decommissioned: "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-400/10 dark:text-zinc-400 dark:border-zinc-400/20",
  "Low Stock": "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20",
  "In Stock": "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20",
  "Out of Stock": "bg-red-100 text-red-900 border-red-300 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20",
};

function statusBadgeClass(status: string): string {
  return (
    STATUS_COLORS[status] ??
    "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-400/10 dark:text-zinc-400 dark:border-zinc-400/20"
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-[var(--muted)]" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-40 animate-pulse rounded bg-[var(--muted)]" />
        <div className="h-3 w-56 animate-pulse rounded bg-[var(--muted)]" />
      </div>
      <div className="h-5 w-16 animate-pulse rounded-full bg-[var(--muted)]" />
    </div>
  );
}

// ─── Asset Result Card ────────────────────────────────────────────────────────

function AssetCard({ result }: { result: CrossModuleSearchResult }) {
  return (
    <Link href={`/assets/${result.id}`} className="block">
      <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--primary)]/40 hover:bg-[var(--muted)]/30 transition-all">
        {/* Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/10">
          <Box className="h-5 w-5 text-blue-700 dark:text-blue-400" />
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--foreground)]">
            {result.name}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {result.identifier}
            </span>
            <span className="flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {result.category}
            </span>
            {result.detail && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {result.detail}
              </span>
            )}
          </div>
        </div>

        {/* Status + arrow */}
        <div className="flex items-center gap-2 shrink-0">
          <Badge className={cn("border text-[10px]", statusBadgeClass(result.status))}>
            {result.status}
          </Badge>
          <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]" />
        </div>
      </div>
    </Link>
  );
}

// ─── Part Result Card ─────────────────────────────────────────────────────────

function PartCard({ result }: { result: CrossModuleSearchResult }) {
  // detail field carries "qty:12|cost:45.00" compact payload from mock
  // Parse what we can gracefully
  const detail = result.detail ?? "";
  const qtyMatch = detail.match(/qty:(\d+)/);
  const costMatch = detail.match(/cost:([\d.]+)/);
  const qty = qtyMatch?.[1] ? parseInt(qtyMatch[1], 10) : null;
  const cost = costMatch?.[1] ? parseFloat(costMatch[1]) : null;

  return (
    <Link href={`/inventory/${result.id}`} className="block">
      <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--primary)]/40 hover:bg-[var(--muted)]/30 transition-all">
        {/* Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/10">
          <Package className="h-5 w-5 text-purple-700 dark:text-purple-400" />
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--foreground)]">
            {result.name}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {result.identifier}
            </span>
            <span className="flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {result.category}
            </span>
            {qty !== null && (
              <span>
                Stock: <span className="font-medium text-[var(--foreground)]">{qty}</span>
              </span>
            )}
            {cost !== null && (
              <span>
                Unit cost:{" "}
                <span className="font-medium text-[var(--foreground)]">
                  {formatCurrency(cost)}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Status + arrow */}
        <div className="flex items-center gap-2 shrink-0">
          <Badge className={cn("border text-[10px]", statusBadgeClass(result.status))}>
            {result.status}
          </Badge>
          <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]" />
        </div>
      </div>
    </Link>
  );
}

// ─── Results section ──────────────────────────────────────────────────────────

function ResultsSection({
  assets,
  parts,
  filter,
}: {
  assets: CrossModuleSearchResult[];
  parts: CrossModuleSearchResult[];
  filter: FilterMode;
}) {
  const showAssets = filter === "all" || filter === "asset";
  const showParts = filter === "all" || filter === "consumable";

  return (
    <div className="space-y-6">
      {/* Assets */}
      {showAssets && assets.length > 0 && (
        <section aria-label="Asset results">
          <div className="mb-3 flex items-center gap-2">
            <Box className="h-4 w-4 text-[var(--muted-foreground)]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Assets
            </h2>
            <Badge className="border bg-[var(--muted)] text-[var(--foreground)] text-[10px]">
              {assets.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {assets.map((r) => (
              <AssetCard key={r.id} result={r} />
            ))}
          </div>
        </section>
      )}

      {/* Parts */}
      {showParts && parts.length > 0 && (
        <section aria-label="Parts results">
          <div className="mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-[var(--muted-foreground)]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Parts &amp; Supplies
            </h2>
            <Badge className="border bg-[var(--muted)] text-[var(--foreground)] text-[10px]">
              {parts.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {parts.map((r) => (
              <PartCard key={r.id} result={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function InventorySearchPage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(inputValue.trim());
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue]);

  const apiType =
    filter === "asset"
      ? "asset"
      : filter === "consumable"
      ? "consumable"
      : undefined;

  const { data, isFetching } = useInventorySearch(debouncedQuery, apiType);
  const results: CrossModuleSearchResult[] = data?.data ?? [];

  const assets = results.filter((r) => r.type === "asset");
  const parts = results.filter((r) => r.type === "consumable");

  const hasQuery = debouncedQuery.length >= 2;
  const hasResults = results.length > 0;
  const isEmpty = hasQuery && !isFetching && !hasResults;

  void router; // used for future imperative navigation if needed

  const FILTERS: { mode: FilterMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { mode: "all", label: "All", icon: Search },
    { mode: "asset", label: "Assets Only", icon: Box },
    { mode: "consumable", label: "Parts Only", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center gap-4 px-8">
          <Search className="h-5 w-5 text-[var(--primary)]" />
          <div>
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]"
            >
              <Link
                href="/inventory"
                className="hover:text-[var(--foreground)] transition-colors"
              >
                Inventory
              </Link>
              <span>/</span>
              <span className="text-[var(--foreground)]">Search</span>
            </nav>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              Inventory Search
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-6 p-8">
        {/* Search box */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search assets and parts..."
            autoFocus
            aria-label="Search assets and parts"
            className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] pl-12 pr-4 text-base text-[var(--foreground)] placeholder-[var(--muted-foreground)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-shadow"
          />
          {isFetching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
            </div>
          )}
        </div>

        {/* Filter toggles */}
        <div
          className="flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1"
          role="group"
          aria-label="Filter results"
        >
          {FILTERS.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                filter === mode
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              )}
              aria-pressed={filter === mode}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Empty state — no query */}
        {!hasQuery && !isFetching && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--muted)]">
              <Search className="h-6 w-6 text-[var(--muted-foreground)]" />
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">
              Enter a search term to find assets and parts across your inventory
            </p>
          </div>
        )}

        {/* Loading skeletons */}
        {isFetching && hasQuery && (
          <div className="space-y-6">
            {(filter === "all" || filter === "asset") && (
              <div className="space-y-2">
                <div className="h-3 w-16 animate-pulse rounded bg-[var(--muted)]" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}
            {(filter === "all" || filter === "consumable") && (
              <div className="space-y-2">
                <div className="h-3 w-28 animate-pulse rounded bg-[var(--muted)]" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* No results */}
        {isEmpty && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--muted)]">
              <Search className="h-6 w-6 text-[var(--muted-foreground)]" />
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)]">
                No results found for &ldquo;{debouncedQuery}&rdquo;
              </p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Try different keywords, check the spelling, or broaden your
                filter.
              </p>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-2 text-xs text-[var(--muted-foreground)]">
              <span className="rounded-md border border-[var(--border)] px-2 py-1">
                Check spelling
              </span>
              <span className="rounded-md border border-[var(--border)] px-2 py-1">
                Try an asset tag or part number
              </span>
              <span className="rounded-md border border-[var(--border)] px-2 py-1">
                Search by category
              </span>
            </div>
          </div>
        )}

        {/* Results */}
        {!isFetching && hasResults && (
          <>
            <p className="text-xs text-[var(--muted-foreground)]">
              {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
              &ldquo;{debouncedQuery}&rdquo;
            </p>
            <ResultsSection assets={assets} parts={parts} filter={filter} />
          </>
        )}
      </div>
    </div>
  );
}
