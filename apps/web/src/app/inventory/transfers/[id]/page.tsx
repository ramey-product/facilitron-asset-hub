"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Truck,
  PackageCheck,
  X,
  Clock,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useTransfer,
  useApproveTransfer,
  useShipTransfer,
  useReceiveTransfer,
  useCancelTransfer,
} from "@/hooks/use-transfers";
import type { TransferStatus } from "@asset-hub/shared";

const STATUS_BADGE: Record<TransferStatus, { label: string; className: string }> = {
  Requested: {
    label: "Requested",
    className: "border bg-amber-100 text-amber-900 border-amber-300 dark:bg-yellow-400/10 dark:text-yellow-400 dark:border-yellow-400/20",
  },
  Approved: {
    label: "Approved",
    className: "border bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/20",
  },
  InTransit: {
    label: "In Transit",
    className: "border bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-400/10 dark:text-purple-400 dark:border-purple-400/20",
  },
  Received: {
    label: "Received",
    className: "border bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20",
  },
  Cancelled: {
    label: "Cancelled",
    className: "border bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]",
  },
};

const STATUS_ORDER: TransferStatus[] = [
  "Requested",
  "Approved",
  "InTransit",
  "Received",
];

function TimelineStep({
  status,
  currentStatus,
  timestamp,
}: {
  status: TransferStatus;
  currentStatus: TransferStatus;
  timestamp?: string | null;
}) {
  const stepIndex = STATUS_ORDER.indexOf(status);
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const isCancelled = currentStatus === "Cancelled";

  let state: "complete" | "current" | "upcoming" | "cancelled" = "upcoming";
  if (isCancelled) {
    state = "cancelled";
  } else if (stepIndex < currentIndex) {
    state = "complete";
  } else if (stepIndex === currentIndex) {
    state = "current";
  }

  const LABELS: Record<TransferStatus, string> = {
    Requested: "Requested",
    Approved: "Approved",
    InTransit: "Shipped",
    Received: "Received",
    Cancelled: "Cancelled",
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium transition-all",
          state === "complete" &&
            "border-emerald-500 bg-emerald-500 text-white",
          state === "current" &&
            "border-[var(--primary)] bg-[var(--primary)] text-white",
          state === "upcoming" &&
            "border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]",
          state === "cancelled" &&
            "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)] opacity-50"
        )}
      >
        {state === "complete" ? (
          <Check className="h-4 w-4" />
        ) : (
          stepIndex + 1
        )}
      </div>
      <p
        className={cn(
          "text-[11px] font-medium",
          state === "complete" && "text-emerald-600 dark:text-emerald-400",
          state === "current" && "text-[var(--primary)]",
          (state === "upcoming" || state === "cancelled") && "text-[var(--muted-foreground)]"
        )}
      >
        {LABELS[status]}
      </p>
      {timestamp && (
        <p className="text-[10px] text-[var(--muted-foreground)]">
          {new Date(timestamp).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

export default function TransferDetailPage() {
  const params = useParams();
  const id = parseInt(params.id as string, 10);

  const { data, isLoading, error } = useTransfer(id);
  const approveTransfer = useApproveTransfer();
  const shipTransfer = useShipTransfer();
  const receiveTransfer = useReceiveTransfer();
  const cancelTransfer = useCancelTransfer();

  const transfer = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-[var(--muted)]" />
        <div className="h-48 animate-pulse rounded-lg bg-[var(--muted)]" />
      </div>
    );
  }

  if (error || !transfer) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-[var(--muted-foreground)]">Transfer not found</p>
          <Link href="/inventory/transfers" className="mt-2 text-sm text-[var(--primary)] hover:underline">
            Back to Transfers
          </Link>
        </div>
      </div>
    );
  }

  const badge = STATUS_BADGE[transfer.status];
  const isActive = transfer.status !== "Received" && transfer.status !== "Cancelled";

  const timestampMap: Partial<Record<TransferStatus, string | null>> = {
    Requested: transfer.createdAt,
    Approved: transfer.approvedAt,
    InTransit: transfer.shippedAt,
    Received: transfer.receivedAt,
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
        <Link href="/inventory/transfers" className="flex items-center gap-1 hover:text-[var(--foreground)]">
          <ArrowLeft className="h-3.5 w-3.5" />
          Transfers
        </Link>
        <span>/</span>
        <span className="font-mono text-[var(--foreground)]">{transfer.transferNumber}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-bold text-[var(--foreground)]">
              {transfer.transferNumber}
            </h1>
            <Badge className={cn("text-[10px]", badge.className)}>{badge.label}</Badge>
            {transfer.isInterProperty && (
              <div className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--muted)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--muted-foreground)]">
                <Building2 className="h-3 w-3" />
                Inter-Property
              </div>
            )}
          </div>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Requested by {transfer.requestedByName} on{" "}
            {new Date(transfer.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 items-center gap-2">
          {transfer.status === "Requested" && transfer.isInterProperty && (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 text-xs"
              onClick={() => approveTransfer.mutate(id)}
              disabled={approveTransfer.isPending}
            >
              <Check className="h-3.5 w-3.5" />
              Approve
            </Button>
          )}
          {(transfer.status === "Approved" || (transfer.status === "Requested" && !transfer.isInterProperty)) && (
            <Button
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => shipTransfer.mutate(id)}
              disabled={shipTransfer.isPending}
            >
              <Truck className="h-3.5 w-3.5" />
              {shipTransfer.isPending ? "Shipping..." : "Mark Shipped"}
            </Button>
          )}
          {transfer.status === "InTransit" && (
            <Button
              size="sm"
              className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
              onClick={() => receiveTransfer.mutate(id)}
              disabled={receiveTransfer.isPending}
            >
              <PackageCheck className="h-3.5 w-3.5" />
              {receiveTransfer.isPending ? "Receiving..." : "Mark Received"}
            </Button>
          )}
          {isActive && (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
              onClick={() => {
                if (confirm("Cancel this transfer?")) {
                  cancelTransfer.mutate(id);
                }
              }}
              disabled={cancelTransfer.isPending}
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Timeline */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {STATUS_ORDER.map((status, index) => (
              <>
                <TimelineStep
                  key={status}
                  status={status}
                  currentStatus={transfer.status}
                  timestamp={timestampMap[status]}
                />
                {index < STATUS_ORDER.length - 1 && (
                  <div
                    key={`line-${index}`}
                    className={cn(
                      "h-0.5 flex-1 mx-2",
                      STATUS_ORDER.indexOf(transfer.status) > index
                        ? "bg-emerald-400"
                        : "bg-[var(--border)]"
                    )}
                  />
                )}
              </>
            ))}
          </div>

          {transfer.status === "Cancelled" && transfer.cancelledAt && (
            <p className="mt-3 text-center text-xs text-[var(--muted-foreground)]">
              Cancelled on {new Date(transfer.cancelledAt).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Details grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Part Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Part Name
              </p>
              <p className="mt-0.5 font-medium text-[var(--foreground)]">{transfer.partName}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Part Number
              </p>
              <p className="mt-0.5 font-mono text-sm text-[var(--foreground)]">
                {transfer.partNumber ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Quantity
              </p>
              <p className="mt-0.5 text-2xl font-bold text-[var(--foreground)]">
                {transfer.quantity}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Route</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  From
                </p>
                <p className="mt-0.5 font-medium text-[var(--foreground)]">
                  {transfer.fromLocationName}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">{transfer.fromPropertyName}</p>
              </div>
              <div className="flex shrink-0 flex-col items-center pt-3">
                <ArrowRight className="h-5 w-5 text-[var(--muted-foreground)]" />
              </div>
              <div className="flex-1 text-right">
                <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  To
                </p>
                <p className="mt-0.5 font-medium text-[var(--foreground)]">
                  {transfer.toLocationName}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">{transfer.toPropertyName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Authorization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Requested By
              </p>
              <p className="mt-0.5 text-sm text-[var(--foreground)]">{transfer.requestedByName}</p>
            </div>
            {transfer.approvedBy && (
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  Approved By
                </p>
                <p className="mt-0.5 text-sm text-[var(--foreground)]">{transfer.approvedByName}</p>
                {transfer.approvedAt && (
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    {new Date(transfer.approvedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
            {!transfer.approvedBy && transfer.isInterProperty && (
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  Approval Required
                </p>
                <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">
                  Inter-property transfers require approval
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {transfer.notes && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--foreground)]">{transfer.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
