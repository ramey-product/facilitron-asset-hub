"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Package, DollarSign, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { useKits, useCreateKit } from "@/hooks/use-kitting";
import type { Kit, CreateKitInput } from "@asset-hub/shared";

function KitCard({ kit }: { kit: Kit }) {
  return (
    <Link
      href={`/inventory/kits/${kit.id}`}
      className="block rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 transition-all hover:border-[var(--primary)]/40 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10">
          <Package className="h-5 w-5 text-[var(--primary)]" />
        </div>
        {kit.isActive ? (
          <Badge className="text-[10px] border bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20">
            Active
          </Badge>
        ) : (
          <Badge className="text-[10px] border bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]">
            Inactive
          </Badge>
        )}
      </div>

      <div className="mt-3">
        <h3 className="font-semibold text-[var(--foreground)] leading-snug">{kit.name}</h3>
        {kit.description && (
          <p className="mt-1 line-clamp-2 text-xs text-[var(--muted-foreground)]">
            {kit.description}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs text-[var(--muted-foreground)]">
        <div className="flex items-center gap-1">
          <Layers className="h-3.5 w-3.5" />
          <span>{kit.totalComponents} component{kit.totalComponents !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-1 font-medium text-[var(--foreground)]">
          <DollarSign className="h-3.5 w-3.5" />
          <span>{formatCurrency(kit.estimatedCost)}</span>
        </div>
      </div>

      {kit.categoryName && (
        <p className="mt-2 text-[10px] text-[var(--muted-foreground)]">{kit.categoryName}</p>
      )}
    </Link>
  );
}

function CreateKitModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (id: number) => void;
}) {
  const createKit = useCreateKit();
  const [form, setForm] = useState({
    name: "",
    description: "",
    items: [{ partId: 0, quantity: 1 }],
  });

  function addItem() {
    setForm({ ...form, items: [...form.items, { partId: 0, quantity: 1 }] });
  }

  function removeItem(index: number) {
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  }

  function updateItem(index: number, field: "partId" | "quantity", value: number) {
    const items = form.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setForm({ ...form, items });
  }

  function handleSubmit() {
    if (!form.name.trim()) return;
    const validItems = form.items.filter((i) => i.partId > 0 && i.quantity > 0);
    if (validItems.length === 0) return;

    const input: CreateKitInput = {
      name: form.name,
      description: form.description || undefined,
      items: validItems,
    };

    createKit.mutate(input, {
      onSuccess: (res) => {
        const data = res as { data: Kit };
        onCreated(data.data.id);
      },
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Create New Kit</h2>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Group parts into a reusable kit for common maintenance tasks.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">
              Kit Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              placeholder="e.g. HVAC Filter Change Kit"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              placeholder="Optional description of this kit's purpose"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-[var(--foreground)]">
                Components <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addItem}
                className="text-xs text-[var(--primary)] hover:underline"
              >
                + Add component
              </button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={item.partId || ""}
                      onChange={(e) => updateItem(i, "partId", parseInt(e.target.value) || 0)}
                      placeholder="Part ID"
                      className="h-8 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                    />
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(e) => updateItem(i, "quantity", parseInt(e.target.value) || 1)}
                      placeholder="Qty"
                      className="h-8 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                    />
                  </div>
                  {form.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="text-[var(--muted-foreground)] hover:text-red-500"
                      aria-label="Remove component"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={createKit.isPending || !form.name.trim()}
          >
            {createKit.isPending ? "Creating..." : "Create Kit"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function KitsPage() {
  const [search, setSearch] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const params: Record<string, string | number> = {};
  if (search) params.search = search;
  if (showActiveOnly) params.isActive = "true";

  const { data, isLoading } = useKits(params);
  const kits = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Kits</h1>
          <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
            Manage pre-defined part bundles for common maintenance tasks
          </p>
        </div>
        <Button className="gap-1.5 text-sm" onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />
          Create Kit
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search kits..."
            className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--foreground)]">
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={(e) => setShowActiveOnly(e.target.checked)}
            className="h-4 w-4 rounded accent-[var(--primary)]"
          />
          Active only
        </label>
        {meta && (
          <p className="ml-auto text-xs text-[var(--muted-foreground)]">
            {meta.total} kit{meta.total !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Kits grid */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg bg-[var(--muted)]" />
          ))}
        </div>
      )}

      {!isLoading && kits.length === 0 && (
        <div className="rounded-lg border border-dashed border-[var(--border)] py-16 text-center">
          <Package className="mx-auto h-10 w-10 text-[var(--muted-foreground)]/40" />
          <p className="mt-2 text-sm font-medium text-[var(--foreground)]">No kits found</p>
          <p className="text-xs text-[var(--muted-foreground)]">
            {search ? "Try a different search term" : "Create your first kit to get started"}
          </p>
          {!search && (
            <Button className="mt-4 gap-1.5 text-sm" onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4" />
              Create Kit
            </Button>
          )}
        </div>
      )}

      {!isLoading && kits.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {kits.map((kit) => (
            <KitCard key={kit.id} kit={kit} />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateKitModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(id) => {
            setShowCreateModal(false);
            window.location.href = `/inventory/kits/${id}`;
          }}
        />
      )}
    </div>
  );
}
