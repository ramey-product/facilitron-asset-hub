"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Send,
  Package,
  Truck,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  usePurchaseOrder,
  useSubmitPurchaseOrder,
  useApprovePurchaseOrder,
  useCancelPurchaseOrder,
  useMarkOrdered,
} from "@/hooks/use-procurement";
import { useReceivingRecords } from "@/hooks/use-receiving";
import type { PurchaseOrderStatus } from "@asset-hub/shared";

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
    PartiallyReceived: "Partially Received",
    Received: "Received",
    Cancelled: "Cancelled",
  };
  return (
    <Badge className={cn("text-[10px] border", classes[status])}>
      {labels[status]}
    </Badge>
  );
}

// Status pipeline steps
const PIPELINE: { status: PurchaseOrderStatus; label: string }[] = [
  { status: "Draft", label: "Draft" },
  { status: "Submitted", label: "Submitted" },
  { status: "Approved", label: "Approved" },
  { status: "Ordered", label: "Ordered" },
  { status: "Received", label: "Received" },
];

const STATUS_ORDER = ["Draft", "Submitted", "Approved", "Ordered", "PartiallyReceived", "Received"];

function getStatusIndex(status: PurchaseOrderStatus): number {
  if (status === "PartiallyReceived") return 4; // between Ordered and Received
  return STATUS_ORDER.indexOf(status);
}

export default function PODetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const poId = parseInt(id, 10);
  const router = useRouter();
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const { data, isLoading, isError } = usePurchaseOrder(poId);
  const { data: receivingData } = useReceivingRecords({ poId });
  const po = data?.data;
  const receivingRecords = receivingData?.data ?? [];

  const submitPO = useSubmitPurchaseOrder();
  const approvePO = useApprovePurchaseOrder();
  const cancelPO = useCancelPurchaseOrder();
  const markOrdered = useMarkOrdered();

  const handleSubmit = async () => {
    try {
      setActionError(null);
      await submitPO.mutateAsync(poId);
    } catch (err) {
      setActionError((err as Error).message);
    }
  };

  const handleApprove = async () => {
    try {
      setActionError(null);
      await approvePO.mutateAsync({ id: poId, approvedBy: 2 }); // approver ID 2 in mock
    } catch (err) {
      setActionError((err as Error).message);
    }
  };

  const handleMarkOrdered = async () => {
    try {
      setActionError(null);
      await markOrdered.mutateAsync(poId);
    } catch (err) {
      setActionError((err as Error).message);
    }
  };

  const handleCancel = async () => {
    if (!confirmCancel) {
      setConfirmCancel(true);
      return;
    }
    try {
      setActionError(null);
      setConfirmCancel(false);
      await cancelPO.mutateAsync(poId);
    } catch (err) {
      setActionError((err as Error).message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  if (isError || !po) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
        <AlertCircle className="h-8 w-8 text-[var(--destructive)]" />
        <p className="text-sm text-[var(--muted-foreground)]">Purchase order not found</p>
        <Link href="/procurement/orders">
          <Button variant="outline" size="sm">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const currentStepIdx = getStatusIndex(po.status);
  const isCancelled = po.status === "Cancelled";
  const isTerminal = po.status === "Received" || isCancelled;

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
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10">
                <ShoppingCart className="h-4.5 w-4.5 text-[var(--primary)]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[var(--foreground)] font-mono">
                    {po.poNumber}
                  </h1>
                  {statusBadge(po.status)}
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {po.vendorName ?? `Vendor #${po.vendorId}`} &middot; Created {formatDate(po.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons based on status */}
          {!isTerminal && (
            <div className="flex items-center gap-2">
              {po.status === "Draft" && (
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={submitPO.isPending}
                >
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  {submitPO.isPending ? "Submitting..." : "Submit for Approval"}
                </Button>
              )}
              {po.status === "Submitted" && (
                <Button
                  size="sm"
                  onClick={handleApprove}
                  disabled={approvePO.isPending}
                >
                  <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                  {approvePO.isPending ? "Approving..." : "Approve"}
                </Button>
              )}
              {po.status === "Approved" && (
                <Button
                  size="sm"
                  onClick={handleMarkOrdered}
                  disabled={markOrdered.isPending}
                >
                  <Truck className="mr-1.5 h-3.5 w-3.5" />
                  {markOrdered.isPending ? "Updating..." : "Mark as Ordered"}
                </Button>
              )}
              {(po.status === "Ordered" || po.status === "PartiallyReceived") && (
                <Link href="/procurement/receiving">
                  <Button size="sm">
                    <Package className="mr-1.5 h-3.5 w-3.5" />
                    Receive Items
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={cancelPO.isPending}
                className={confirmCancel ? "border-red-400 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-400/10" : ""}
              >
                <XCircle className="mr-1.5 h-3.5 w-3.5" />
                {confirmCancel ? "Confirm Cancel" : "Cancel PO"}
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="p-8 max-w-4xl mx-auto space-y-6">
        {/* Error banner */}
        {actionError && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {actionError}
          </div>
        )}

        {/* Status pipeline */}
        {!isCancelled && (
          <Card>
            <CardContent className="px-6 py-4">
              <div className="flex items-center gap-0">
                {PIPELINE.map((step, idx) => {
                  const isComplete = currentStepIdx > idx;
                  const isCurrent = currentStepIdx === idx ||
                    (step.status === "Ordered" && po.status === "PartiallyReceived");
                  return (
                    <div key={step.status} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                            isComplete
                              ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                              : isCurrent
                              ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                              : "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]"
                          )}
                        >
                          {isComplete ? "✓" : idx + 1}
                        </div>
                        <span
                          className={cn(
                            "text-[10px] font-medium",
                            isCurrent
                              ? "text-[var(--primary)]"
                              : isComplete
                              ? "text-[var(--foreground)]"
                              : "text-[var(--muted-foreground)]"
                          )}
                        >
                          {step.label}
                        </span>
                      </div>
                      {idx < PIPELINE.length - 1 && (
                        <div
                          className={cn(
                            "flex-1 h-0.5 mx-1 mb-4",
                            isComplete ? "bg-[var(--primary)]" : "bg-[var(--border)]"
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* PO Header Details */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] mb-1">Vendor</div>
                <div className="text-sm font-medium text-[var(--foreground)]">
                  {po.vendorName ?? `Vendor #${po.vendorId}`}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] mb-1">Property</div>
                <div className="text-sm font-medium text-[var(--foreground)]">
                  {po.propertyName ?? `Property #${po.propertyId}`}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] mb-1">Created By</div>
                <div className="text-sm font-medium text-[var(--foreground)]">
                  {po.createdByName ?? `User #${po.createdBy}`}
                </div>
              </div>
              {po.approvedBy && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] mb-1">Approved By</div>
                  <div className="text-sm font-medium text-[var(--foreground)]">
                    {po.approvedByName ?? `User #${po.approvedBy}`}
                  </div>
                  {po.approvedAt && (
                    <div className="text-xs text-[var(--muted-foreground)]">{formatDate(po.approvedAt)}</div>
                  )}
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-2 md:grid-cols-4 gap-4">
              {po.submittedAt && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] mb-1">Submitted</div>
                  <div className="text-xs text-[var(--foreground)]">{formatDate(po.submittedAt)}</div>
                </div>
              )}
              {po.orderedAt && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] mb-1">Ordered</div>
                  <div className="text-xs text-[var(--foreground)]">{formatDate(po.orderedAt)}</div>
                </div>
              )}
              {po.receivedAt && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] mb-1">Received</div>
                  <div className="text-xs text-[var(--foreground)]">{formatDate(po.receivedAt)}</div>
                </div>
              )}
              {po.cancelledAt && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] mb-1">Cancelled</div>
                  <div className="text-xs text-[var(--destructive)]">{formatDate(po.cancelledAt)}</div>
                </div>
              )}
            </div>

            {po.notes && (
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] mb-1">Notes</div>
                <p className="text-sm text-[var(--foreground)]">{po.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Line Items ({po.lineItems.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th scope="col" className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Part</th>
                    <th scope="col" className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] w-20">Qty</th>
                    <th scope="col" className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] w-24">Unit Cost</th>
                    <th scope="col" className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] w-24">Line Total</th>
                    <th scope="col" className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] w-20">Received</th>
                    <th scope="col" className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] w-20">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {po.lineItems.map((li) => {
                    const remaining = li.quantity - li.quantityReceived;
                    const allReceived = remaining <= 0;
                    return (
                      <tr key={li.id} className="border-b border-[var(--border)]/50">
                        <td className="py-3 pr-4">
                          <div className="text-sm font-medium text-[var(--foreground)]">
                            {li.partName ?? `Part #${li.partId}`}
                          </div>
                          {li.partNumber && (
                            <div className="text-[10px] font-mono text-[var(--muted-foreground)]">
                              {li.partNumber}
                            </div>
                          )}
                          {li.notes && (
                            <div className="text-[10px] text-[var(--muted-foreground)] italic mt-0.5">
                              {li.notes}
                            </div>
                          )}
                        </td>
                        <td className="py-3 text-right text-sm text-[var(--foreground)]">{li.quantity}</td>
                        <td className="py-3 text-right text-sm text-[var(--foreground)]">{formatCurrency(li.unitCost)}</td>
                        <td className="py-3 text-right">
                          <div className="text-sm font-medium text-[var(--foreground)]">
                            {formatCurrency(li.lineTotal + li.taxAmount)}
                          </div>
                          {li.taxAmount > 0 && (
                            <div className="text-[10px] text-[var(--muted-foreground)]">
                              +{formatCurrency(li.taxAmount)} tax
                            </div>
                          )}
                        </td>
                        <td className="py-3 text-right text-sm text-[var(--foreground)]">
                          {li.quantityReceived > 0 ? (
                            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                              {li.quantityReceived}
                            </span>
                          ) : (
                            <span className="text-[var(--muted-foreground)]">0</span>
                          )}
                        </td>
                        <td className="py-3 text-right text-sm">
                          {allReceived ? (
                            <span className="text-emerald-700 dark:text-emerald-400">
                              Complete
                            </span>
                          ) : (
                            <span className={cn(
                              remaining > 0 ? "text-amber-700 dark:text-amber-400" : "text-[var(--muted-foreground)]"
                            )}>
                              {remaining}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="ml-auto max-w-xs space-y-1.5 border-t border-[var(--border)] pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Subtotal</span>
                <span className="font-medium text-[var(--foreground)]">{formatCurrency(po.totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Tax</span>
                <span className="font-medium text-[var(--foreground)]">{formatCurrency(po.taxAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-base border-t border-[var(--border)] pt-1.5">
                <span className="font-semibold text-[var(--foreground)]">Grand Total</span>
                <span className="font-bold text-[var(--foreground)]">{formatCurrency(po.grandTotal)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receiving History */}
        {receivingRecords.length > 0 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[var(--foreground)]">
                  Receiving History ({receivingRecords.length} receipt{receivingRecords.length !== 1 ? "s" : ""})
                </h2>
                <Link href="/procurement/receiving/history">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
              <div className="space-y-3">
                {receivingRecords.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-lg border border-[var(--border)] p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-[var(--foreground)]">
                          Receipt #{record.id}
                        </span>
                        <span className="mx-2 text-[var(--muted-foreground)]">&middot;</span>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {formatDate(record.receivedAt)}
                        </span>
                        <span className="mx-2 text-[var(--muted-foreground)]">&middot;</span>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          by {record.receivedByName}
                        </span>
                      </div>
                      {record.lineItems.some((li) => li.quantityRejected > 0) && (
                        <Badge className="text-[10px] border bg-red-100 text-red-900 border-red-300 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20">
                          Has Rejections
                        </Badge>
                      )}
                    </div>
                    {record.notes && (
                      <p className="text-xs text-[var(--muted-foreground)] italic">{record.notes}</p>
                    )}
                    <div className="grid grid-cols-1 gap-1">
                      {record.lineItems.map((li) => (
                        <div key={li.id} className="flex items-center justify-between text-xs">
                          <span className="text-[var(--foreground)]">
                            {li.partName ?? `Part #${li.partId}`}
                            {li.partNumber && (
                              <span className="ml-1 font-mono text-[var(--muted-foreground)]">({li.partNumber})</span>
                            )}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                              +{li.quantityReceived} received
                            </span>
                            {li.quantityRejected > 0 && (
                              <span className="text-red-700 dark:text-red-400">
                                -{li.quantityRejected} rejected
                                {li.rejectionReason && ` (${li.rejectionReason})`}
                              </span>
                            )}
                            <span className="text-[var(--muted-foreground)]">
                              → {li.locationName ?? `Loc #${li.locationId}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prompt to receive if Ordered/PartiallyReceived */}
        {(po.status === "Ordered" || po.status === "PartiallyReceived") && (
          <Card className="border-amber-300 dark:border-amber-400/20">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400">
                <Package className="h-4 w-4 shrink-0" />
                <span className="text-sm">
                  {po.status === "PartiallyReceived"
                    ? "Some items have been received. Ready to receive remaining items?"
                    : "Order has been placed. Ready to receive items?"}
                </span>
              </div>
              <Link href="/procurement/receiving">
                <Button size="sm">
                  <Package className="mr-1.5 h-3.5 w-3.5" />
                  Receive Items
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
