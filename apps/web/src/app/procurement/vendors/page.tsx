"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  LayoutGrid,
  List,
  Star,
  ChevronLeft,
  ChevronRight,
  Truck,
  Mail,
  Phone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVendors } from "@/hooks/use-vendors";

function categoryBadge(category: string) {
  switch (category) {
    case "parts":
      return (
        <Badge className="text-[10px] border bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/20">
          Parts
        </Badge>
      );
    case "service":
      return (
        <Badge className="text-[10px] border bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-400/10 dark:text-purple-400 dark:border-purple-400/20">
          Service
        </Badge>
      );
    case "both":
      return (
        <Badge className="text-[10px] border bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-400/10 dark:text-indigo-400 dark:border-indigo-400/20">
          Parts & Service
        </Badge>
      );
    default:
      return null;
  }
}

function renderStars(rating: number | null) {
  if (rating === null) return <span className="text-xs text-[var(--muted-foreground)]">No rating</span>;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3 w-3",
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "text-[var(--muted-foreground)]/30"
          )}
        />
      ))}
    </div>
  );
}

export default function VendorsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<string>("active");
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      if (search !== debouncedSearch) setPage(1);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const params: Record<string, string | number> = { page, limit };
  if (debouncedSearch) params.search = debouncedSearch;
  if (categoryFilter !== "all") params.category = categoryFilter;
  if (activeFilter === "active") params.isActive = 1;
  else if (activeFilter === "inactive") params.isActive = 0;

  const { data, isLoading, isError } = useVendors(params);
  const vendors = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, limit: 20, total: 0, totalPages: 0 };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">Vendor Directory</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              {meta.total} vendors
            </p>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] pl-9 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              aria-label="Search vendors"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            <option value="parts">Parts</option>
            <option value="service">Service</option>
            <option value="both">Parts & Service</option>
          </select>

          <select
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            aria-label="Filter by status"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5 space-y-3">
                  <div className="h-5 w-36 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-48 animate-pulse rounded bg-[var(--muted)]" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-sm text-[var(--destructive)]">
                Failed to load vendors. Make sure the API server is running.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Grid View */}
        {!isLoading && !isError && viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {vendors.map((vendor) => (
              <Link key={vendor.id} href={`/procurement/vendors/${vendor.id}`}>
                <Card className="hover:border-[var(--primary)]/30 transition-all hover:shadow-lg hover:shadow-[var(--primary)]/5 cursor-pointer h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-[var(--foreground)] truncate">
                          {vendor.name}
                        </h3>
                        <div className="mt-1">{categoryBadge(vendor.category)}</div>
                      </div>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--muted)]">
                        <Truck className="h-5 w-5 text-[var(--muted-foreground)]" />
                      </div>
                    </div>
                    <div className="mt-3">{renderStars(vendor.rating)}</div>
                    <div className="mt-3 space-y-1.5">
                      {vendor.contactName && (
                        <p className="text-xs text-[var(--foreground)]">{vendor.contactName}</p>
                      )}
                      {vendor.email && (
                        <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                          <Mail className="h-3 w-3" />
                          {vendor.email}
                        </div>
                      )}
                      {vendor.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                          <Phone className="h-3 w-3" />
                          {vendor.phone}
                        </div>
                      )}
                    </div>
                    {!vendor.isActive && (
                      <Badge className="mt-3 text-[10px] border bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-400/10 dark:text-zinc-400 dark:border-zinc-400/20">
                        Inactive
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
            {vendors.length === 0 && (
              <div className="col-span-full py-12 text-center text-sm text-[var(--muted-foreground)]">
                No vendors found matching your filters.
              </div>
            )}
          </div>
        )}

        {/* Table View */}
        {!isLoading && !isError && viewMode === "table" && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Name</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Category</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Rating</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Contact</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Email</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Status</th>
                    <th scope="col" className="px-4 py-3 w-10"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor) => (
                    <tr key={vendor.id} className="border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/procurement/vendors/${vendor.id}`} className="group">
                          <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                            {vendor.name}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">{categoryBadge(vendor.category)}</td>
                      <td className="px-4 py-3">{renderStars(vendor.rating)}</td>
                      <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{vendor.contactName ?? "---"}</td>
                      <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{vendor.email ?? "---"}</td>
                      <td className="px-4 py-3">
                        <Badge className={cn("text-[10px] border", vendor.isActive
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20"
                          : "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-400/10 dark:text-zinc-400 dark:border-zinc-400/20"
                        )}>
                          {vendor.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/procurement/vendors/${vendor.id}`} aria-label={`View ${vendor.name} details`}>
                          <ExternalLink className="h-3.5 w-3.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {vendors.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-sm text-[var(--muted-foreground)]">
                        No vendors found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Pagination */}
        {!isLoading && !isError && meta.totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-[var(--muted-foreground)]">
              Page {meta.page} of {meta.totalPages} ({meta.total} total)
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
