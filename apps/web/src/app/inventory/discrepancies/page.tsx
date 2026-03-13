"use client";

import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useDiscrepancies } from "@/hooks/use-receiving";

export default function DiscrepanciesPage() {
  const { data, isLoading, isError } = useDiscrepancies();
  const records = data?.data ?? [];

  // Flatten to individual rejection line items
  const rejections = records.flatMap((record) =>
    record.lineItems
      .filter((li) => li.quantityRejected > 0)
      .map((li) => ({
        receiptId: record.id,
        poId: record.poId,
        poNumber: record.poNumber,
        receivedAt: record.receivedAt,
        receivedByName: record.receivedByName,
        partId: li.partId,
        partName: li.partName,
        partNumber: li.partNumber,
        quantityReceived: li.quantityReceived,
        quantityRejected: li.quantityRejected,
        rejectionReason: li.rejectionReason,
        locationName: li.locationName,
      }))
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <Link href="/inventory">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                aria-label="Back to inventory"
              >
                <ArrowLeft className="h-4 w-4 text-[var(--muted-foreground)]" />
              </button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 dark:bg-red-400/10">
                <AlertTriangle className="h-4.5 w-4.5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--foreground)]">Receiving Discrepancies</h1>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {rejections.length} rejection{rejections.length !== 1 ? "s" : ""} requiring review
                </p>
              </div>
            </div>
          </div>
          <Link href="/procurement/receiving/history">
            <Button variant="outline" size="sm">View All Receipts</Button>
          </Link>
        </div>
      </header>

      <div className="p-8 space-y-4">
        {/* Loading */}
        {isLoading && (
          <Card>
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-40 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-16 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-4 w-40 animate-pulse rounded bg-[var(--muted)]" />
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
                Failed to load discrepancy report. Make sure the API server is running.
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !isError && (
          <>
            {rejections.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-400/10 mx-auto mb-4">
                    <AlertTriangle className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm font-medium text-[var(--foreground)]">No discrepancies found</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    All receiving records are clean.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">PO Number</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Receipt</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Part</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Received</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Rejected</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Reason</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Date</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Received By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rejections.map((rej, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            {rej.poNumber ? (
                              <Link
                                href={`/procurement/orders/${rej.poId}`}
                                className="font-mono text-xs font-semibold text-[var(--primary)] hover:underline"
                              >
                                {rej.poNumber}
                              </Link>
                            ) : (
                              <span className="text-xs text-[var(--muted-foreground)]">PO #{rej.poId}</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs text-[var(--muted-foreground)]">
                              #{rej.receiptId}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-[var(--foreground)]">
                              {rej.partName ?? `Part #${rej.partId}`}
                            </div>
                            {rej.partNumber && (
                              <div className="text-[10px] font-mono text-[var(--muted-foreground)]">
                                {rej.partNumber}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                            {rej.quantityReceived}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-red-700 dark:text-red-400 font-bold">
                            {rej.quantityRejected}
                          </td>
                          <td className="px-4 py-3 max-w-xs">
                            {rej.rejectionReason ? (
                              <span className="text-xs text-[var(--foreground)]">
                                {rej.rejectionReason}
                              </span>
                            ) : (
                              <span className="text-xs text-[var(--muted-foreground)]">No reason given</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                            {formatDate(rej.receivedAt)}
                          </td>
                          <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                            {rej.receivedByName ?? "Unknown"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
