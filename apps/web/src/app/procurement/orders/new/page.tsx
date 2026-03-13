"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { useCreatePurchaseOrder, useSubmitPurchaseOrder } from "@/hooks/use-procurement";
import { useVendors } from "@/hooks/use-vendors";
import { useParts } from "@/hooks/use-inventory";

interface LineItemDraft {
  tempId: number;
  partId: number;
  partName: string;
  partNumber: string;
  quantity: number;
  unitCost: number;
  taxRate: number;
  notes: string;
}

let tempIdCounter = 0;

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const [vendorId, setVendorId] = useState<number | "">("");
  const [propertyId, setPropertyId] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItemDraft[]>([
    { tempId: tempIdCounter++, partId: 0, partName: "", partNumber: "", quantity: 1, unitCost: 0, taxRate: 0, notes: "" },
  ]);
  const [submitAfterCreate, setSubmitAfterCreate] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createPO = useCreatePurchaseOrder();
  const submitPO = useSubmitPurchaseOrder();

  // Load vendors and parts for dropdowns
  const { data: vendorsData } = useVendors({ page: 1, limit: 100 });
  const { data: partsData } = useParts({ page: 1, limit: 100, status: "active" });
  const vendors = vendorsData?.data ?? [];
  const parts = partsData?.data ?? [];

  // Property mock list (in a real app, fetch from /api/v2/properties)
  const properties = [
    { id: 1, name: "Lincoln High School" },
    { id: 2, name: "Jefferson Middle School" },
    { id: 3, name: "Washington Elementary" },
    { id: 4, name: "District Office" },
    { id: 5, name: "Sports Complex" },
  ];

  const addLineItem = () => {
    setLineItems((items) => [
      ...items,
      { tempId: tempIdCounter++, partId: 0, partName: "", partNumber: "", quantity: 1, unitCost: 0, taxRate: 0, notes: "" },
    ]);
  };

  const removeLineItem = (tempId: number) => {
    setLineItems((items) => items.filter((li) => li.tempId !== tempId));
  };

  const updateLineItem = (tempId: number, field: Partial<LineItemDraft>) => {
    setLineItems((items) =>
      items.map((li) => {
        if (li.tempId !== tempId) return li;
        const updated = { ...li, ...field };
        // Auto-fill part details when part selected
        if (field.partId !== undefined) {
          const part = parts.find((p) => p.id === field.partId);
          if (part) {
            updated.partName = part.name;
            updated.partNumber = part.sku;
            updated.unitCost = part.unitCost;
          }
        }
        return updated;
      })
    );
  };

  const subtotal = lineItems.reduce((sum, li) => sum + li.quantity * li.unitCost, 0);
  const taxTotal = lineItems.reduce((sum, li) => sum + li.quantity * li.unitCost * (li.taxRate / 100), 0);
  const grandTotal = subtotal + taxTotal;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!vendorId) newErrors.vendor = "Vendor is required";
    if (!propertyId) newErrors.property = "Property is required";
    if (lineItems.length === 0) newErrors.lineItems = "At least one line item is required";
    lineItems.forEach((li, idx) => {
      if (!li.partId) newErrors[`part-${idx}`] = "Select a part";
      if (li.quantity <= 0) newErrors[`qty-${idx}`] = "Quantity must be positive";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (andSubmit: boolean) => {
    if (!validate()) return;
    setSubmitAfterCreate(andSubmit);

    try {
      const result = await createPO.mutateAsync({
        vendorId: Number(vendorId),
        propertyId: Number(propertyId),
        notes: notes || undefined,
        lineItems: lineItems.map((li) => ({
          partId: li.partId,
          quantity: li.quantity,
          unitCost: li.unitCost,
          taxRate: li.taxRate || 0,
          notes: li.notes || undefined,
        })),
      });

      const newPo = (result as { data: { id: number } }).data;

      if (andSubmit) {
        await submitPO.mutateAsync(newPo.id);
      }

      router.push(`/procurement/orders/${newPo.id}`);
    } catch (err) {
      setErrors({ submit: (err as Error).message });
    }
  };

  const isPending = createPO.isPending || submitPO.isPending;

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
              <h1 className="text-xl font-bold text-[var(--foreground)]">New Purchase Order</h1>
              <p className="text-sm text-[var(--muted-foreground)]">Create a new purchase order</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSave(false)}
              disabled={isPending}
            >
              Save as Draft
            </Button>
            <Button
              size="sm"
              onClick={() => handleSave(true)}
              disabled={isPending}
            >
              {isPending && submitAfterCreate ? "Submitting..." : isPending ? "Saving..." : "Save & Submit"}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-8 max-w-4xl mx-auto space-y-6">
        {/* Error banner */}
        {errors.submit && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20">
            {errors.submit}
          </div>
        )}

        {/* PO Header */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Vendor */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                  Vendor <span className="text-[var(--destructive)]">*</span>
                </label>
                <select
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value ? Number(e.target.value) : "")}
                  className={cn(
                    "h-9 w-full rounded-lg border bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]",
                    errors.vendor ? "border-[var(--destructive)]" : "border-[var(--border)]"
                  )}
                  aria-label="Select vendor"
                >
                  <option value="">Select vendor...</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
                {errors.vendor && <p className="text-xs text-[var(--destructive)]">{errors.vendor}</p>}
              </div>

              {/* Property */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                  Property / Location <span className="text-[var(--destructive)]">*</span>
                </label>
                <select
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value ? Number(e.target.value) : "")}
                  className={cn(
                    "h-9 w-full rounded-lg border bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]",
                    errors.property ? "border-[var(--destructive)]" : "border-[var(--border)]"
                  )}
                  aria-label="Select property"
                >
                  <option value="">Select property...</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                {errors.property && <p className="text-xs text-[var(--destructive)]">{errors.property}</p>}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Add any notes for this purchase order..."
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)] resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--foreground)]">Line Items</h2>
              <Button variant="outline" size="sm" onClick={addLineItem}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Item
              </Button>
            </div>

            {errors.lineItems && (
              <p className="text-xs text-[var(--destructive)]">{errors.lineItems}</p>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th scope="col" className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Part</th>
                    <th scope="col" className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] w-24">Qty</th>
                    <th scope="col" className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] w-28">Unit Cost</th>
                    <th scope="col" className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] w-20">Tax %</th>
                    <th scope="col" className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] w-24">Line Total</th>
                    <th scope="col" className="pb-2 w-10"><span className="sr-only">Remove</span></th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {lineItems.map((li, idx) => {
                    const lineTotal = li.quantity * li.unitCost;
                    const lineTax = lineTotal * (li.taxRate / 100);
                    return (
                      <tr key={li.tempId} className="border-b border-[var(--border)]/40">
                        <td className="py-2 pr-3">
                          <select
                            value={li.partId || ""}
                            onChange={(e) =>
                              updateLineItem(li.tempId, { partId: e.target.value ? Number(e.target.value) : 0 })
                            }
                            className={cn(
                              "h-8 w-full min-w-[200px] rounded-md border bg-[var(--muted)] px-2 text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]",
                              errors[`part-${idx}`] ? "border-[var(--destructive)]" : "border-[var(--border)]"
                            )}
                            aria-label={`Select part for line ${idx + 1}`}
                          >
                            <option value="">Select part...</option>
                            {parts.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.sku} — {p.name}
                              </option>
                            ))}
                          </select>
                          {errors[`part-${idx}`] && (
                            <p className="mt-0.5 text-[10px] text-[var(--destructive)]">{errors[`part-${idx}`]}</p>
                          )}
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            type="number"
                            min={1}
                            value={li.quantity}
                            onChange={(e) =>
                              updateLineItem(li.tempId, { quantity: Math.max(1, Number(e.target.value)) })
                            }
                            className={cn(
                              "h-8 w-20 rounded-md border bg-[var(--muted)] px-2 text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]",
                              errors[`qty-${idx}`] ? "border-[var(--destructive)]" : "border-[var(--border)]"
                            )}
                            aria-label={`Quantity for line ${idx + 1}`}
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]">$</span>
                            <input
                              type="number"
                              min={0}
                              step={0.01}
                              value={li.unitCost}
                              onChange={(e) =>
                                updateLineItem(li.tempId, { unitCost: Math.max(0, Number(e.target.value)) })
                              }
                              className="h-8 w-24 rounded-md border border-[var(--border)] bg-[var(--muted)] pl-5 pr-2 text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                              aria-label={`Unit cost for line ${idx + 1}`}
                            />
                          </div>
                        </td>
                        <td className="py-2 pr-3">
                          <div className="relative">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              step={0.1}
                              value={li.taxRate}
                              onChange={(e) =>
                                updateLineItem(li.tempId, { taxRate: Math.max(0, Math.min(100, Number(e.target.value))) })
                              }
                              className="h-8 w-16 rounded-md border border-[var(--border)] bg-[var(--muted)] pl-2 pr-5 text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                              aria-label={`Tax rate for line ${idx + 1}`}
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]">%</span>
                          </div>
                        </td>
                        <td className="py-2 pr-3">
                          <div>
                            <span className="text-xs font-medium text-[var(--foreground)]">
                              {formatCurrency(lineTotal + lineTax)}
                            </span>
                            {li.taxRate > 0 && (
                              <div className="text-[10px] text-[var(--muted-foreground)]">
                                +{formatCurrency(lineTax)} tax
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-2">
                          <button
                            onClick={() => removeLineItem(li.tempId)}
                            disabled={lineItems.length === 1}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:text-[var(--destructive)] hover:bg-red-50 dark:hover:bg-red-400/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label={`Remove line item ${idx + 1}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
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
                <span className="font-medium text-[var(--foreground)]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Tax</span>
                <span className="font-medium text-[var(--foreground)]">{formatCurrency(taxTotal)}</span>
              </div>
              <div className="flex items-center justify-between text-base border-t border-[var(--border)] pt-1.5">
                <span className="font-semibold text-[var(--foreground)]">Grand Total</span>
                <span className="font-bold text-[var(--foreground)]">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Link href="/procurement/orders">
            <Button variant="outline" disabled={isPending}>Cancel</Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={isPending}
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={isPending}
          >
            {isPending && submitAfterCreate ? "Submitting..." : isPending ? "Saving..." : "Save & Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
