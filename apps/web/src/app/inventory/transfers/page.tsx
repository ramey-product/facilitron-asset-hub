"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTransfers, useCreateTransfer } from "@/hooks/use-transfers";
import type { InventoryTransfer, TransferStatus, CreateTransferInput } from "@asset-hub/shared";

const STATUS_TABS: { label: string; value: TransferStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Requested", value: "Requested" },
  { label: "Approved", value: "Approved" },
  { label: "In Transit", value: "InTransit" },
  { label: "Received", value: "Received" },
  { label: "Cancelled", value: "Cancelled" },
];

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

// Location/part selectors (mock data)
const LOCATIONS = [
  { id: 1, name: "Main Warehouse", propertyId: 1, propertyName: "Oakland" },
  { id: 2, name: "North Facility", propertyId: 1, propertyName: "Oakland" },
  { id: 3, name: "South Facility", propertyId: 2, propertyName: "Fremont" },
  { id: 4, name: "Mobile Unit A", propertyId: 3, propertyName: "San Jose" },
  { id: 5, name: "East Campus", propertyId: 2, propertyName: "Fremont" },
];

function CreateTransferModal({ onClose }: { onClose: () => void }) {
  const createTransfer = useCreateTransfer();
  const [form, setForm] = useState<Partial<CreateTransferInput>>({});

  function handleSubmit() {
    if (!form.partId || !form.fromLocationId || !form.toLocationId || !form.quantity) return;
    if (form.fromLocationId === form.toLocationId) return;

    createTransfer.mutate(form as CreateTransferInput, {
      onSuccess: () => onClose(),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">New Transfer Request</h2>
        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
          Move inventory between locations or properties
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">
              Part ID <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.partId ?? ""}
              onChange={(e) => setForm({ ...form, partId: parseInt(e.target.value) || undefined })}
              placeholder="e.g. 21"
              className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">
              From Location <span className="text-red-500">*</span>
            </label>
            <select
              value={form.fromLocationId ?? ""}
              onChange={(e) => setForm({ ...form, fromLocationId: parseInt(e.target.value) || undefined })}
              className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            >
              <option value="">Select source location...</option>
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.propertyName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">
              To Location <span className="text-red-500">*</span>
            </label>
            <select
              value={form.toLocationId ?? ""}
              onChange={(e) => setForm({ ...form, toLocationId: parseInt(e.target.value) || undefined })}
              className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            >
              <option value="">Select destination location...</option>
              {LOCATIONS.filter((loc) => loc.id !== form.fromLocationId).map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.propertyName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={form.quantity ?? ""}
              onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || undefined })}
              placeholder="1"
              className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">
              Notes (optional)
            </label>
            <textarea
              value={form.notes ?? ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value || undefined })}
              rows={2}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              placeholder="Reason for transfer"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={
              createTransfer.isPending ||
              !form.partId ||
              !form.fromLocationId ||
              !form.toLocationId ||
              !form.quantity ||
              form.fromLocationId === form.toLocationId
            }
          >
            {createTransfer.isPending ? "Creating..." : "Submit Request"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function TransfersPage() {
  const [statusFilter, setStatusFilter] = useState<TransferStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const limit = 20;

  const params: Record<string, string | number> = { page, limit };
  if (statusFilter !== "all") params.status = statusFilter;
  if (search) params.search = search;

  const { data, isLoading } = useTransfers(params);
  const transfers = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Inventory Transfers</h1>
          <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
            Track part movements between locations and properties
          </p>
        </div>
        <Button className="gap-1.5 text-sm" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />
          New Transfer
        </Button>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-1 border-b border-[var(--border)] pb-0">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => { setStatusFilter(t.value); setPage(1); }}
            className={cn(
              "rounded-t-md px-3 py-2 text-xs font-medium transition-colors -mb-px",
              statusFilter === t.value
                ? "border border-b-[var(--background)] border-[var(--border)] bg-[var(--background)] text-[var(--primary)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by transfer #, part, location..."
          className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--muted)]/50">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Transfer #
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Part
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                From
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                To
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Qty
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {isLoading && (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={7} className="px-4 py-3">
                    <div className="h-5 animate-pulse rounded bg-[var(--muted)]" />
                  </td>
                </tr>
              ))
            )}
            {!isLoading && transfers.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-[var(--muted-foreground)]">
                  No transfers found
                </td>
              </tr>
            )}
            {!isLoading && transfers.map((transfer) => {
              const badge = STATUS_BADGE[transfer.status];
              return (
                <tr
                  key={transfer.id}
                  className="bg-[var(--card)] transition-colors hover:bg-[var(--muted)]/30 cursor-pointer"
                  onClick={() => window.location.href = `/inventory/transfers/${transfer.id}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-medium text-[var(--foreground)]">
                        {transfer.transferNumber}
                      </span>
                      {transfer.isInterProperty && (
                        <Building2 className="h-3 w-3 text-[var(--muted-foreground)]" aria-label="Inter-property transfer" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--foreground)]">{transfer.partName}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)]">{transfer.partNumber}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <p className="font-medium text-[var(--foreground)]">{transfer.fromLocationName}</p>
                    <p className="text-[var(--muted-foreground)]">{transfer.fromPropertyName}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <p className="font-medium text-[var(--foreground)]">{transfer.toLocationName}</p>
                    <p className="text-[var(--muted-foreground)]">{transfer.toPropertyName}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-[var(--foreground)]">
                    {transfer.quantity}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={cn("text-[10px]", badge.className)}>{badge.label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                    {new Date(transfer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-xs text-[var(--muted-foreground)]">
            {(page - 1) * limit + 1}–{Math.min(page * limit, meta.total)} of {meta.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-md border border-[var(--border)] p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--muted)] disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-[var(--foreground)]">
              Page {page} of {meta.totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
              disabled={page === meta.totalPages}
              className="rounded-md border border-[var(--border)] p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--muted)] disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {showCreateModal && <CreateTransferModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}
