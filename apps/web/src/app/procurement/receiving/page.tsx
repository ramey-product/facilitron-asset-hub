"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Package, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { usePurchaseOrders, usePurchaseOrder } from "@/hooks/use-procurement";
import { useCreateReceivingRecord } from "@/hooks/use-receiving";
import type { PurchaseOrderLineItem } from "@asset-hub/shared";

interface ReceivingLineDraft {
  poLineItemId: number;
  poLineItem: PurchaseOrderLineItem;
  quantityReceived: number;
  quantityRejected: number;
  rejectionReason: string;
  locationId: number;
}

// Mock locations — in a real app, fetch from /api/v2/properties or a locations endpoint
const LOCATIONS = [
  { id: 1, name: "Main Warehouse" },
  { id: 2, name: "Cage H-1 (Lincoln)" },
  { id: 3, name: "District Office Supply" },
  { id: 4, name: "Sports Complex Shop" },
  { id: 5, name: "Jefferson HVAC Supply" },
  { id: 6, name: "Washington Elementary Plumbing" },
  { id: 7, name: "Lincoln Filter Storage" },
];

export default function ReceivingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPoId = searchParams.get("poId") ? Number(searchParams.get("poId")) : null;

  const [selectedPoId, setSelectedPoId] = useState<number | "">(preselectedPoId ?? "");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<ReceivingLineDraft[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Load open/partially-received POs for dropdown
  const { data: orderedPOsData } = usePurchaseOrders({ page: 1, limit: 100, status: "Ordered" });
  const { data: partialPOsData } = usePurchaseOrders({ page: 1, limit: 100, status: "PartiallyReceived" });
  const receivablePOs = [
    ...(orderedPOsData?.data ?? []),
    ...(partialPOsData?.data ?? []),
  ].sort((a, b) => a.poNumber.localeCompare(b.poNumber));

  // Load selected PO details
  const { data: poData } = usePurchaseOrder(selectedPoId ? Number(selectedPoId) : 0);
  const po = poData?.data;

  const createReceiving = useCreateReceivingRecord();

  // Initialize line items when PO changes
  useEffect(() => {
    if (!po) {
      setLineItems([]);
      return;
    }
    // Only show items that still have remaining qty
    const drafts: ReceivingLineDraft[] = po.lineItems
      .filter((li) => li.quantity - li.quantityReceived > 0)
      .map((li) => ({
        poLineItemId: li.id,
        poLineItem: li,
        quantityReceived: li.quantity - li.quantityReceived, // default to remaining
        quantityRejected: 0,
        rejectionReason: "",
        locationId: LOCATIONS[0]!.id,
      }));
    setLineItems(drafts);
  }, [po]);

  const updateLine = (poLineItemId: number, field: Partial<ReceivingLineDraft>) => {
    setLineItems((items) =>
      items.map((li) => li.poLineItemId === poLineItemId ? { ...li, ...field } : li)
    );
  };

  const handleSubmit = async () => {
    if (!selectedPoId || lineItems.length === 0) return;
    setSubmitError(null);

    // Validate at least one item has qty > 0
    const activeItems = lineItems.filter((li) => li.quantityReceived > 0 || li.quantityRejected > 0);
    if (activeItems.length === 0) {
      setSubmitError("Enter at least one received or rejected quantity");
      return;
    }

    try {
      await createReceiving.mutateAsync({
        poId: Number(selectedPoId),
        notes: notes || undefined,
        lineItems: activeItems.map((li) => ({
          poLineItemId: li.poLineItemId,
          quantityReceived: li.quantityReceived,
          quantityRejected: li.quantityRejected || undefined,
          rejectionReason: li.rejectionReason || undefined,
          locationId: li.locationId,
        })),
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError((err as Error).message);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-400/10 mx-auto">
              <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">Items Received</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Receiving record created. Stock levels have been updated.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href={`/procurement/orders/${selectedPoId}`}>
                <Button variant="outline" size="sm">View PO</Button>
              </Link>
              <Link href="/procurement/receiving/history">
                <Button size="sm">View Receiving History</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <Link href="/procurement/orders">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                aria-label="Back to purchase orders"
              >
                <ArrowLeft className="h-4 w-4 text-[var(--muted-foreground)]" />
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">Receive Items</h1>
              <p className="text-sm text-[var(--muted-foreground)]">Record receipt of ordered items</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/procurement/receiving/history">
              <Button variant="outline" size="sm">Receiving History</Button>
            </Link>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!selectedPoId || lineItems.length === 0 || createReceiving.isPending}
            >
              <Package className="mr-1.5 h-3.5 w-3.5" />
              {createReceiving.isPending ? "Recording..." : "Record Receipt"}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-8 max-w-4xl mx-auto space-y-6">
        {/* Error banner */}
        {submitError && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {submitError}
          </div>
        )}

        {/* PO Selection */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Select Purchase Order</h2>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Purchase Order <span className="text-[var(--destructive)]">*</span>
              </label>
              <select
                value={selectedPoId}
                onChange={(e) => {
                  setSelectedPoId(e.target.value ? Number(e.target.value) : "");
                  setSubmitError(null);
                }}
                className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                aria-label="Select purchase order to receive against"
              >
                <option value="">Select a PO to receive against...</option>
                {receivablePOs.map((po) => (
                  <option key={po.id} value={po.id}>
                    {po.poNumber} — {po.vendorName ?? `Vendor #${po.vendorId}`} ({po.status === "PartiallyReceived" ? "Partial" : "Ordered"})
                  </option>
                ))}
              </select>
              {receivablePOs.length === 0 && (
                <p className="text-xs text-[var(--muted-foreground)]">
                  No purchase orders in Ordered or Partially Received status.
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Receiving Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Any notes about this receiving event..."
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)] resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Line Items to Receive */}
        {po && lineItems.length > 0 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[var(--foreground)]">
                  Items to Receive
                </h2>
                <span className="text-xs text-[var(--muted-foreground)]">
                  From {po.poNumber} · {po.vendorName}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th scope="col" className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Part</th>
                      <th scope="col" className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] w-20">Ordered</th>
                      <th scope="col" className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] w-20">Prior</th>
                      <th scope="col" className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] w-20">Remaining</th>
                      <th scope="col" className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] w-24">Rcv Qty</th>
                      <th scope="col" className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] w-24">Rej Qty</th>
                      <th scope="col" className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] w-48">Rejection Reason</th>
                      <th scope="col" className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((li) => {
                      const remaining = li.poLineItem.quantity - li.poLineItem.quantityReceived;
                      return (
                        <tr key={li.poLineItemId} className="border-b border-[var(--border)]/50">
                          <td className="py-3 pr-4">
                            <div className="text-sm font-medium text-[var(--foreground)]">
                              {li.poLineItem.partName ?? `Part #${li.poLineItem.partId}`}
                            </div>
                            {li.poLineItem.partNumber && (
                              <div className="text-[10px] font-mono text-[var(--muted-foreground)]">
                                {li.poLineItem.partNumber}
                              </div>
                            )}
                            <div className="text-[10px] text-[var(--muted-foreground)]">
                              {formatCurrency(li.poLineItem.unitCost)} / unit
                            </div>
                          </td>
                          <td className="py-3 text-right text-sm text-[var(--muted-foreground)]">
                            {li.poLineItem.quantity}
                          </td>
                          <td className="py-3 text-right text-sm text-emerald-700 dark:text-emerald-400">
                            {li.poLineItem.quantityReceived > 0 ? li.poLineItem.quantityReceived : "—"}
                          </td>
                          <td className="py-3 text-right text-sm font-medium text-[var(--foreground)]">
                            {remaining}
                          </td>
                          <td className="py-3 pr-2">
                            <input
                              type="number"
                              min={0}
                              max={remaining}
                              value={li.quantityReceived}
                              onChange={(e) =>
                                updateLine(li.poLineItemId, {
                                  quantityReceived: Math.min(remaining, Math.max(0, Number(e.target.value))),
                                })
                              }
                              className="h-8 w-20 rounded-md border border-[var(--border)] bg-[var(--muted)] px-2 text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                              aria-label={`Quantity received for ${li.poLineItem.partName}`}
                            />
                          </td>
                          <td className="py-3 pr-2">
                            <input
                              type="number"
                              min={0}
                              max={remaining}
                              value={li.quantityRejected}
                              onChange={(e) =>
                                updateLine(li.poLineItemId, {
                                  quantityRejected: Math.max(0, Number(e.target.value)),
                                })
                              }
                              className={cn(
                                "h-8 w-20 rounded-md border bg-[var(--muted)] px-2 text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]",
                                li.quantityRejected > 0
                                  ? "border-red-400 dark:border-red-400/60"
                                  : "border-[var(--border)]"
                              )}
                              aria-label={`Quantity rejected for ${li.poLineItem.partName}`}
                            />
                          </td>
                          <td className="py-3 pr-2">
                            {li.quantityRejected > 0 && (
                              <input
                                type="text"
                                value={li.rejectionReason}
                                onChange={(e) =>
                                  updateLine(li.poLineItemId, { rejectionReason: e.target.value })
                                }
                                placeholder="Reason for rejection..."
                                className="h-8 w-44 rounded-md border border-red-400/60 bg-[var(--muted)] px-2 text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-red-400/60"
                                aria-label={`Rejection reason for ${li.poLineItem.partName}`}
                              />
                            )}
                          </td>
                          <td className="py-3">
                            <select
                              value={li.locationId}
                              onChange={(e) =>
                                updateLine(li.poLineItemId, { locationId: Number(e.target.value) })
                              }
                              className="h-8 rounded-md border border-[var(--border)] bg-[var(--muted)] px-2 text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                              aria-label={`Storage location for ${li.poLineItem.partName}`}
                            >
                              {LOCATIONS.map((loc) => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {po && lineItems.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <p className="text-sm text-[var(--muted-foreground)]">
                All items on this PO have already been received.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Bottom actions */}
        {lineItems.length > 0 && (
          <div className="flex items-center justify-end gap-3 pb-8">
            <Link href="/procurement/orders">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button
              onClick={handleSubmit}
              disabled={!selectedPoId || createReceiving.isPending}
            >
              <Package className="mr-1.5 h-3.5 w-3.5" />
              {createReceiving.isPending ? "Recording..." : "Record Receipt"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
