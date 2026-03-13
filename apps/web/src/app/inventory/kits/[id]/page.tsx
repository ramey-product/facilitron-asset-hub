"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Package,
  ShoppingCart,
  Pencil,
  Check,
  X,
  AlertTriangle,
  MapPin,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { useKit, useUpdateKit, useCheckoutKit } from "@/hooks/use-kitting";
import type { Kit, UpdateKitInput, KitCheckoutInput, KitCheckoutResult } from "@asset-hub/shared";

// Location options (mock — would come from API in full implementation)
const LOCATIONS = [
  { id: 1, name: "Main Warehouse", propertyName: "Rotten Robbie - Oakland" },
  { id: 2, name: "North Facility", propertyName: "Rotten Robbie - Oakland" },
  { id: 3, name: "South Facility", propertyName: "Rotten Robbie - Fremont" },
  { id: 4, name: "Mobile Unit A", propertyName: "Rotten Robbie - San Jose" },
  { id: 5, name: "East Campus", propertyName: "Rotten Robbie - Fremont" },
];

function CheckoutModal({
  kit,
  onClose,
}: {
  kit: Kit;
  onClose: () => void;
}) {
  const checkout = useCheckoutKit();
  const [locationId, setLocationId] = useState<number | null>(null);
  const [workOrderId, setWorkOrderId] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<KitCheckoutResult | null>(null);

  function handleCheckout() {
    if (!locationId) return;
    const input: KitCheckoutInput = {
      kitId: kit.id,
      locationId,
      workOrderId: workOrderId ? parseInt(workOrderId) : undefined,
      notes: notes || undefined,
    };
    checkout.mutate(input, {
      onSuccess: (res) => {
        const data = res as { data: KitCheckoutResult };
        setResult(data.data);
      },
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
        {!result ? (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">Checkout Kit</h2>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{kit.name}</p>
              </div>
              <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  value={locationId ?? ""}
                  onChange={(e) => setLocationId(parseInt(e.target.value) || null)}
                  className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                >
                  <option value="">Select location...</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} — {loc.propertyName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">
                  Work Order ID (optional)
                </label>
                <input
                  type="number"
                  value={workOrderId}
                  onChange={(e) => setWorkOrderId(e.target.value)}
                  placeholder="e.g. 12345"
                  className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                  placeholder="Optional notes about this checkout"
                />
              </div>

              <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-3">
                <p className="text-xs font-medium text-[var(--foreground)] mb-2">
                  Components to checkout ({kit.items.length})
                </p>
                <ul className="space-y-1">
                  {kit.items.map((item) => (
                    <li key={item.id} className="flex justify-between text-xs text-[var(--muted-foreground)]">
                      <span>{item.partName ?? `Part #${item.partId}`}</span>
                      <span className="font-medium">×{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
              <Button
                size="sm"
                onClick={handleCheckout}
                disabled={!locationId || checkout.isPending}
                className="gap-1.5"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                {checkout.isPending ? "Processing..." : "Checkout Kit"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              {result.success ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                  <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              )}
              <div>
                <h2 className="font-semibold text-[var(--foreground)]">
                  {result.success ? "Checkout Successful" : "Insufficient Stock"}
                </h2>
                <p className="text-xs text-[var(--muted-foreground)]">{result.kitName}</p>
              </div>
            </div>

            {result.success && (
              <div className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 p-3 dark:border-emerald-500/30 dark:bg-emerald-950/20">
                <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300 mb-2">
                  Parts checked out:
                </p>
                <ul className="space-y-1">
                  {result.itemsCheckedOut.map((item) => (
                    <li key={item.partId} className="flex justify-between text-xs text-emerald-700 dark:text-emerald-400">
                      <span>{item.partName}</span>
                      <span>×{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!result.success && result.insufficientStock && (
              <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 dark:border-red-500/30 dark:bg-red-950/20">
                <p className="text-xs font-medium text-red-800 dark:text-red-300 mb-2">
                  The following parts have insufficient stock at the selected location:
                </p>
                <ul className="space-y-1.5">
                  {result.insufficientStock.map((item) => (
                    <li key={item.partId} className="text-xs text-red-700 dark:text-red-400">
                      <span className="font-medium">{item.partName}</span>
                      <span className="ml-2">
                        Required: {item.required} — Available: {item.available}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button size="sm" onClick={onClose}>Done</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function KitDetailPage() {
  const params = useParams();
  const id = parseInt(params.id as string, 10);

  const { data, isLoading, error } = useKit(id);
  const updateKit = useUpdateKit();

  const [isEditing, setIsEditing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [editForm, setEditForm] = useState<UpdateKitInput>({});

  const kit = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-[var(--muted)]" />
        <div className="h-40 animate-pulse rounded-lg bg-[var(--muted)]" />
      </div>
    );
  }

  if (error || !kit) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <p className="text-sm text-[var(--muted-foreground)]">Kit not found</p>
          <Link href="/inventory/kits" className="mt-2 text-sm text-[var(--primary)] hover:underline">
            Back to Kits
          </Link>
        </div>
      </div>
    );
  }

  function startEdit() {
    setEditForm({
      name: kit!.name,
      description: kit!.description ?? undefined,
      isActive: kit!.isActive,
    });
    setIsEditing(true);
  }

  function saveEdit() {
    updateKit.mutate({ id, data: editForm }, {
      onSuccess: () => setIsEditing(false),
    });
  }

  const totalCost = kit.items.reduce(
    (sum, item) => sum + item.quantity * (item.unitCost ?? 0),
    0
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
        <Link href="/inventory/kits" className="flex items-center gap-1 hover:text-[var(--foreground)]">
          <ArrowLeft className="h-3.5 w-3.5" />
          Kits
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)]">{kit.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10">
            <Package className="h-6 w-6 text-[var(--primary)]" />
          </div>
          <div>
            {isEditing ? (
              <input
                type="text"
                value={editForm.name ?? ""}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="h-8 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-xl font-bold focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              />
            ) : (
              <h1 className="text-2xl font-bold text-[var(--foreground)]">{kit.name}</h1>
            )}
            <div className="mt-1 flex items-center gap-2">
              {isEditing ? (
                <label className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                  <input
                    type="checkbox"
                    checked={editForm.isActive ?? kit.isActive}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                    className="h-3.5 w-3.5 accent-[var(--primary)]"
                  />
                  Active
                </label>
              ) : kit.isActive ? (
                <Badge className="text-[10px] border bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20">
                  Active
                </Badge>
              ) : (
                <Badge className="text-[10px] border bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]">
                  Inactive
                </Badge>
              )}
              {kit.categoryName && (
                <span className="text-xs text-[var(--muted-foreground)]">{kit.categoryName}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="gap-1.5 text-xs"
                onClick={saveEdit}
                disabled={updateKit.isPending}
              >
                <Check className="h-3.5 w-3.5" />
                {updateKit.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={startEdit}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Kit
              </Button>
              <Button
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => setShowCheckout(true)}
                disabled={!kit.isActive}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Checkout Kit
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {isEditing ? (
        <textarea
          value={editForm.description ?? ""}
          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          rows={2}
          className="rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
          placeholder="Kit description"
        />
      ) : kit.description ? (
        <p className="text-sm text-[var(--muted-foreground)]">{kit.description}</p>
      ) : null}

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
              Components
            </p>
            <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{kit.totalComponents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
              Estimated Cost
            </p>
            <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">
              {formatCurrency(kit.estimatedCost)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
              Last Updated
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {new Date(kit.updatedAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Components table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Components</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--muted)]/50">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Part
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Part #
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Qty Required
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Unit Cost
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Line Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {kit.items.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-[var(--card)] transition-colors hover:bg-[var(--muted)]/30"
                  >
                    <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                      {item.partName ?? `Part #${item.partId}`}
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                      {item.partNumber ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[var(--foreground)]">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--muted-foreground)]">
                      {item.unitCost != null ? formatCurrency(item.unitCost) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[var(--foreground)]">
                      {item.unitCost != null
                        ? formatCurrency(item.quantity * item.unitCost)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-[var(--border)] bg-[var(--muted)]/30">
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-right text-sm font-semibold text-[var(--foreground)]">
                    Total
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-[var(--foreground)]">
                    {formatCurrency(totalCost)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {showCheckout && (
        <CheckoutModal kit={kit} onClose={() => setShowCheckout(false)} />
      )}
    </div>
  );
}
