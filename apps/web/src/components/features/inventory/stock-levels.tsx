"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { useStockLevels, useAdjustStock } from "@/hooks/use-stock";
import type { StockAdjustInput } from "@asset-hub/shared";

interface StockLevelsProps {
  partId: number;
  reorderPoint: number;
}

function rowColor(available: number, reorderPoint: number): string {
  if (available <= 0) return "bg-red-50 dark:bg-red-400/5";
  if (available <= reorderPoint) return "bg-amber-50 dark:bg-yellow-400/5";
  return "";
}

const adjustReasons = [
  "Physical count",
  "Received shipment",
  "Damaged/spoiled",
  "Return to vendor",
  "Cycle count adjustment",
  "Other",
];

export function StockLevels({ partId, reorderPoint }: StockLevelsProps) {
  const { data, isLoading, isError } = useStockLevels(partId);
  const adjustMutation = useAdjustStock();
  const [adjustingRow, setAdjustingRow] = useState<number | null>(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState<string>("Physical count");
  const [adjustNotes, setAdjustNotes] = useState("");

  const levels = data?.data ?? [];

  const handleAdjust = (locationId: number) => {
    const qty = parseInt(adjustQty, 10);
    if (isNaN(qty) || qty < 0) return;

    const adjustData: StockAdjustInput = {
      qtyOnHand: qty,
      reason: adjustReason,
    };
    if (adjustNotes) {
      adjustData.notes = adjustNotes;
    }
    adjustMutation.mutate(
      {
        partId,
        locationId,
        data: adjustData,
      },
      {
        onSuccess: () => {
          setAdjustingRow(null);
          setAdjustQty("");
          setAdjustNotes("");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Card>
        <div className="p-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-16 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-16 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-4 w-16 animate-pulse rounded bg-[var(--muted)]" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-sm text-[var(--destructive)]">Failed to load stock levels.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Location
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Qty On Hand
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Qty Reserved
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Available
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Last Count
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {levels.map((level) => (
              <>
                <tr
                  key={level.id}
                  className={cn(
                    "border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/50 transition-colors",
                    rowColor(level.available, reorderPoint)
                  )}
                >
                  <td className="px-4 py-3 text-sm font-medium text-[var(--foreground)]">
                    {level.locationName}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-[var(--foreground)]">
                    {level.qtyOnHand}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-[var(--muted-foreground)]">
                    {level.qtyReserved}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-[var(--foreground)]">
                    {level.available}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                    {level.lastCountDate ? formatDate(level.lastCountDate) : "Never"}
                    {level.lastCountBy && (
                      <span className="ml-1 text-[10px]">by {level.lastCountBy}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (adjustingRow === level.locationId) {
                          setAdjustingRow(null);
                        } else {
                          setAdjustingRow(level.locationId);
                          setAdjustQty(String(level.qtyOnHand));
                        }
                      }}
                    >
                      {adjustingRow === level.locationId ? "Cancel" : "Adjust"}
                    </Button>
                  </td>
                </tr>
                {adjustingRow === level.locationId && (
                  <tr key={`adjust-${level.id}`} className="border-b border-[var(--border)]/50 bg-[var(--muted)]/30">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="flex items-end gap-3 flex-wrap">
                        <div>
                          <label htmlFor={`adj-qty-${level.id}`} className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
                            New Qty On Hand
                          </label>
                          <input
                            id={`adj-qty-${level.id}`}
                            type="number"
                            min="0"
                            value={adjustQty}
                            onChange={(e) => setAdjustQty(e.target.value)}
                            className="h-9 w-24 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                          />
                        </div>
                        <div>
                          <label htmlFor={`adj-reason-${level.id}`} className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
                            Reason
                          </label>
                          <select
                            id={`adj-reason-${level.id}`}
                            value={adjustReason}
                            onChange={(e) => setAdjustReason(e.target.value)}
                            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                          >
                            {adjustReasons.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <label htmlFor={`adj-notes-${level.id}`} className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">
                            Notes (optional)
                          </label>
                          <input
                            id={`adj-notes-${level.id}`}
                            type="text"
                            value={adjustNotes}
                            onChange={(e) => setAdjustNotes(e.target.value)}
                            placeholder="Additional notes..."
                            className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                          />
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAdjust(level.locationId)}
                          disabled={adjustMutation.isPending}
                        >
                          {adjustMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {levels.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-[var(--muted-foreground)]">
                  No stock records for this part.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
