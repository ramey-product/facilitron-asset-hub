"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShoppingCart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { usePurchaseOrders } from "@/hooks/use-procurement";
import type { PurchaseOrderStatus } from "@asset-hub/shared";

const STATUS_TABS: { label: string; value: PurchaseOrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "Draft" },
  { label: "Submitted", value: "Submitted" },
  { label: "Approved", value: "Approved" },
  { label: "Ordered", value: "Ordered" },
  { label: "Receiving", value: "PartiallyReceived" },
  { label: "Received", value: "Received" },
  { label: "Cancelled", value: "Cancelled" },
];

function statusBadge(status: PurchaseOrderStatus) {
  const classes: Record<PurchaseOrderStatus, string> = {
    Draft: "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-400/10 dark:text-zinc-400 dark:border-zinc-400/20",
    Submitted: "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/20",
    Approved: "bg-violet-100 text-violet-900 border-violet-300 dark:bg-violet-400/10 dark:text-violet-400 dark:border-violet-400/20",
    Ordered: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-yellow-400/10 dark:text-yellow-400 dark:border-yellow-400/20",
    PartiallyReceived: "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-400/10 dark:text-orange-400 dark:border-orange-400/20",
    Received: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20",
    Cancelled: "bg-red-100 text-red-900 border-red-300 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20",
  };
  const labels: Record<PurchaseOrderStatus, string> = {
    Draft: "Draft",
    Submitted: "Submitted",
    Approved: "Approved",
    Ordered: "Ordered",
    PartiallyReceived: "Receiving",
    Received: "Received",
    Cancelled: "Cancelled",
  };
  return (
    <Badge className={cn("text-[10px] border", classes[status])}>
      {labels[status]}
    </Badge>
  );
}

export default function PurchaseOrdersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<PurchaseOrderStatus | "all">("all");
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

  const params: Record<string, string | number> = {
    page,
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
  };
  if (debouncedSearch) params.search = debouncedSearch;
  if (activeTab !== "all") params.status = activeTab;

  const { data, isLoading, isError } = usePurchaseOrders(params);
  const orders = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, limit: 20, total: 0, totalPages: 0 };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">Purchase Orders</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              {meta.total} order{meta.total !== 1 ? "s" : ""}
              {activeTab !== "all" ? ` (${activeTab})` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/procurement/reports">
              <Button variant="outline" size="sm">
                Spend Reports
              </Button>
            </Link>
            <Link href="/procurement/orders/new">
              <Button size="sm">
                <Plus className="mr-2 h-3.5 w-3.5" />
                New Purchase Order
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-4">
        {/* Status Tabs */}
        <div
          className="flex items-center gap-1 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Filter by status"
        >
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              role="tab"
              aria-selected={activeTab === tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setPage(1);
              }}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                activeTab === tab.value
                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search by PO number or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] pl-9 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              aria-label="Search purchase orders"
            />
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <Card>
            <div className="p-4 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-4 w-28 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-5 w-20 animate-pulse rounded-md bg-[var(--muted)]" />
                  <div className="h-4 w-20 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
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
                Failed to load purchase orders. Make sure the API server is running on port 3001.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Table */}
        {!isLoading && !isError && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">PO Number</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Vendor</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Status</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Total</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Property</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Created</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Items</th>
                    <th scope="col" className="px-4 py-3 w-10"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/50 transition-colors cursor-pointer"
                      onClick={() => window.location.href = `/procurement/orders/${order.id}`}
                    >
                      <td className="px-4 py-3">
                        <Link href={`/procurement/orders/${order.id}`} className="group">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--muted)]">
                              <ShoppingCart className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                            </div>
                            <span className="font-mono text-xs font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                              {order.poNumber}
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-[var(--foreground)]">
                          {order.vendorName ?? `Vendor #${order.vendorId}`}
                        </span>
                      </td>
                      <td className="px-4 py-3">{statusBadge(order.status)}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-[var(--foreground)]">
                          {formatCurrency(order.grandTotal)}
                        </span>
                        {order.taxAmount > 0 && (
                          <div className="text-[10px] text-[var(--muted-foreground)]">
                            +{formatCurrency(order.taxAmount)} tax
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {order.propertyName ?? "---"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {order.lineItems.length} item{order.lineItems.length !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/procurement/orders/${order.id}`}
                          aria-label={`View ${order.poNumber} details`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-sm text-[var(--muted-foreground)]">
                        No purchase orders found matching your filters.
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
