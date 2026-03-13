"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ArrowLeft, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { useReceivingRecords } from "@/hooks/use-receiving";

export default function ReceivingHistoryPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
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

  const { data, isLoading, isError } = useReceivingRecords(params);
  const records = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, limit: 20, total: 0, totalPages: 0 };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <Link href="/procurement/receiving">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                aria-label="Back to receiving"
              >
                <ArrowLeft className="h-4 w-4 text-[var(--muted-foreground)]" />
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">Receiving History</h1>
              <p className="text-sm text-[var(--muted-foreground)]">{meta.total} receipt{meta.total !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/inventory/discrepancies">
              <Button variant="outline" size="sm">
                <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
                Discrepancies
              </Button>
            </Link>
            <Link href="/procurement/receiving">
              <Button size="sm">New Receipt</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search by PO number or recipient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] pl-9 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            aria-label="Search receiving records"
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <Card>
            <div className="p-4 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-4 w-20 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-28 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-20 animate-pulse rounded bg-[var(--muted)]" />
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
                Failed to load receiving history. Make sure the API server is running.
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
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Receipt #</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">PO Number</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Received By</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Date</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Items</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Flags</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => {
                    const hasRejections = record.lineItems.some((li) => li.quantityRejected > 0);
                    const totalReceived = record.lineItems.reduce((sum, li) => sum + li.quantityReceived, 0);
                    const totalRejected = record.lineItems.reduce((sum, li) => sum + li.quantityRejected, 0);
                    return (
                      <tr
                        key={record.id}
                        className="border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-semibold text-[var(--foreground)]">
                            #{record.id}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {record.poNumber ? (
                            <Link
                              href={`/procurement/orders/${record.poId}`}
                              className="font-mono text-xs font-semibold text-[var(--primary)] hover:underline"
                            >
                              {record.poNumber}
                            </Link>
                          ) : (
                            <span className="text-xs text-[var(--muted-foreground)]">PO #{record.poId}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                          {record.receivedByName ?? `User #${record.receivedBy}`}
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                          {formatDate(record.receivedAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs text-[var(--foreground)]">
                            {record.lineItems.length} line{record.lineItems.length !== 1 ? "s" : ""}
                          </div>
                          <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
                            {totalReceived} unit{totalReceived !== 1 ? "s" : ""} received
                          </div>
                          {totalRejected > 0 && (
                            <div className="text-[10px] text-red-700 dark:text-red-400">
                              {totalRejected} unit{totalRejected !== 1 ? "s" : ""} rejected
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {hasRejections && (
                            <Badge className="text-[10px] border bg-red-100 text-red-900 border-red-300 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20">
                              Rejections
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          {record.notes ? (
                            <span className="text-xs text-[var(--muted-foreground)] truncate block">
                              {record.notes}
                            </span>
                          ) : (
                            <span className="text-xs text-[var(--muted-foreground)]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-sm text-[var(--muted-foreground)]">
                        No receiving records found.
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
