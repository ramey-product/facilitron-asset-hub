"use client";

import { useState, useCallback } from "react";
import {
  Bell,
  AlertTriangle,
  Package,
  Clock,
  ShoppingCart,
  X,
  Plus,
  Pencil,
  Trash2,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import {
  useReorderAlerts,
  useDismissAlert,
  useConvertAlertToPO,
  useReorderRules,
  useCreateReorderRule,
  useUpdateReorderRule,
  useDeleteReorderRule,
} from "@/hooks/use-alerts";
import type { ReorderAlert, ReorderRule, CreateReorderRuleInput } from "@asset-hub/shared";

type AlertStatusFilter = "Active" | "Dismissed" | "Ordered";

const STATUS_TABS: { label: string; value: AlertStatusFilter | "all" }[] = [
  { label: "Active", value: "Active" },
  { label: "Ordered", value: "Ordered" },
  { label: "Dismissed", value: "Dismissed" },
  { label: "All", value: "all" },
];

function severityColor(alert: ReorderAlert) {
  if (alert.currentQuantity === 0)
    return "border-red-300 bg-red-50 dark:border-red-500/30 dark:bg-red-950/20";
  if (alert.currentQuantity <= alert.reorderPoint * 0.5)
    return "border-orange-300 bg-orange-50 dark:border-orange-500/30 dark:bg-orange-950/20";
  return "border-amber-300 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-950/20";
}

function SeverityBadge({ alert }: { alert: ReorderAlert }) {
  if (alert.currentQuantity === 0)
    return (
      <Badge className="text-[10px] border bg-red-100 text-red-900 border-red-300 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20">
        Out of Stock
      </Badge>
    );
  return (
    <Badge className="text-[10px] border bg-amber-100 text-amber-900 border-amber-300 dark:bg-yellow-400/10 dark:text-yellow-400 dark:border-yellow-400/20">
      Low Stock
    </Badge>
  );
}

function AlertCard({
  alert,
  selected,
  onSelect,
  onDismiss,
  onConvert,
}: {
  alert: ReorderAlert;
  selected: boolean;
  onSelect: (id: number) => void;
  onDismiss: (id: number) => void;
  onConvert: (id: number) => void;
}) {
  return (
    <div
      className={cn(
        "relative rounded-lg border p-4 transition-all",
        alert.status === "Active" ? severityColor(alert) : "border-[var(--border)] bg-[var(--card)]",
        selected && "ring-2 ring-[var(--primary)]"
      )}
    >
      {alert.status === "Active" && (
        <div className="absolute left-3 top-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(alert.id)}
            className="h-4 w-4 rounded border-[var(--border)] accent-[var(--primary)]"
            aria-label={`Select alert for ${alert.partName}`}
          />
        </div>
      )}

      <div className={cn("flex flex-col gap-2", alert.status === "Active" && "pl-6")}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--foreground)]">
              {alert.partName}
            </p>
            <p className="text-[11px] text-[var(--muted-foreground)]">{alert.partNumber}</p>
          </div>
          {alert.status === "Active" ? (
            <SeverityBadge alert={alert} />
          ) : alert.status === "Ordered" ? (
            <Badge className="text-[10px] border bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/20">
              Ordered
            </Badge>
          ) : (
            <Badge className="text-[10px] border bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]">
              Dismissed
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div>
            <span className="text-[var(--muted-foreground)]">On Hand</span>
            <span
              className={cn(
                "ml-2 font-semibold",
                alert.currentQuantity === 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-[var(--foreground)]"
              )}
            >
              {alert.currentQuantity}
            </span>
          </div>
          <div>
            <span className="text-[var(--muted-foreground)]">Reorder At</span>
            <span className="ml-2 font-medium text-[var(--foreground)]">{alert.reorderPoint}</span>
          </div>
          <div>
            <span className="text-[var(--muted-foreground)]">Order Qty</span>
            <span className="ml-2 font-medium text-[var(--foreground)]">{alert.reorderQuantity}</span>
          </div>
          <div>
            <span className="text-[var(--muted-foreground)]">Lead Time</span>
            <span className="ml-2 font-medium text-[var(--foreground)]">{alert.leadTimeDays}d</span>
          </div>
        </div>

        {alert.preferredVendorName && (
          <p className="text-[11px] text-[var(--muted-foreground)]">
            Vendor: {alert.preferredVendorName}
          </p>
        )}

        {alert.propertyName && (
          <p className="text-[11px] text-[var(--muted-foreground)]">
            {alert.propertyName}
          </p>
        )}

        {alert.status === "Active" && (
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              className="h-7 flex-1 gap-1.5 text-xs"
              onClick={() => onConvert(alert.id)}
            >
              <ShoppingCart className="h-3 w-3" />
              Create PO
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              onClick={() => onDismiss(alert.id)}
              aria-label="Dismiss alert"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {alert.status === "Ordered" && alert.convertedPoId && (
          <p className="text-[11px] text-blue-600 dark:text-blue-400">
            PO #{alert.convertedPoId} created
          </p>
        )}
      </div>
    </div>
  );
}

// ---- Reorder Rules Table ----

function RulesTable() {
  const { data, isLoading } = useReorderRules();
  const createRule = useCreateReorderRule();
  const updateRule = useUpdateReorderRule();
  const deleteRule = useDeleteReorderRule();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<CreateReorderRuleInput> & { isActive?: boolean }>({
    leadTimeDays: 7,
  });

  const rules = data?.data ?? [];

  function handleSave() {
    if (!form.partId || !form.reorderPoint || !form.reorderQuantity || !form.propertyId) return;
    createRule.mutate(form as CreateReorderRuleInput, {
      onSuccess: () => {
        setShowAddForm(false);
        setForm({ leadTimeDays: 7 });
      },
    });
  }

  function handleUpdate(id: number) {
    if (!form.reorderPoint && !form.reorderQuantity && form.isActive === undefined) return;
    updateRule.mutate({ id, data: form }, {
      onSuccess: () => setEditingId(null),
    });
  }

  if (isLoading) {
    return <div className="py-8 text-center text-sm text-[var(--muted-foreground)]">Loading rules...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted-foreground)]">
          {rules.length} rule{rules.length !== 1 ? "s" : ""} configured
        </p>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-3.5 w-3.5" />
          Add Rule
        </Button>
      </div>

      {showAddForm && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="mb-3 text-sm font-medium">New Reorder Rule</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-[var(--muted-foreground)]">
                Part ID
              </label>
              <input
                type="number"
                value={form.partId ?? ""}
                onChange={(e) => setForm({ ...form, partId: parseInt(e.target.value) || undefined })}
                className="h-8 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                placeholder="e.g. 21"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-[var(--muted-foreground)]">
                Property ID
              </label>
              <input
                type="number"
                value={form.propertyId ?? ""}
                onChange={(e) => setForm({ ...form, propertyId: parseInt(e.target.value) || undefined })}
                className="h-8 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                placeholder="e.g. 1"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-[var(--muted-foreground)]">
                Reorder Point
              </label>
              <input
                type="number"
                value={form.reorderPoint ?? ""}
                onChange={(e) => setForm({ ...form, reorderPoint: parseInt(e.target.value) || undefined })}
                className="h-8 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-[var(--muted-foreground)]">
                Order Quantity
              </label>
              <input
                type="number"
                value={form.reorderQuantity ?? ""}
                onChange={(e) => setForm({ ...form, reorderQuantity: parseInt(e.target.value) || undefined })}
                className="h-8 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-[var(--muted-foreground)]">
                Lead Time (days)
              </label>
              <input
                type="number"
                value={form.leadTimeDays ?? 7}
                onChange={(e) => setForm({ ...form, leadTimeDays: parseInt(e.target.value) || 7 })}
                className="h-8 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button size="sm" variant="ghost" className="text-xs" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button size="sm" className="text-xs" onClick={handleSave} disabled={createRule.isPending}>
              {createRule.isPending ? "Saving..." : "Save Rule"}
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--muted)]/50">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Part
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Property
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Reorder Point
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Order Qty
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Lead Time
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Vendor
              </th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Active
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {rules.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-sm text-[var(--muted-foreground)]">
                  No reorder rules configured
                </td>
              </tr>
            )}
            {rules.map((rule) => (
              <tr key={rule.id} className="bg-[var(--card)] transition-colors hover:bg-[var(--muted)]/30">
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--foreground)]">{rule.partName}</p>
                  <p className="text-[11px] text-[var(--muted-foreground)]">{rule.partNumber}</p>
                </td>
                <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{rule.propertyName}</td>
                <td className="px-4 py-3 text-right font-medium text-[var(--foreground)]">{rule.reorderPoint}</td>
                <td className="px-4 py-3 text-right font-medium text-[var(--foreground)]">{rule.reorderQuantity}</td>
                <td className="px-4 py-3 text-right text-xs text-[var(--muted-foreground)]">{rule.leadTimeDays}d</td>
                <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                  {rule.preferredVendorName ?? "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  {rule.isActive ? (
                    <Check className="mx-auto h-4 w-4 text-emerald-500" />
                  ) : (
                    <X className="mx-auto h-4 w-4 text-[var(--muted-foreground)]" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => {
                        setEditingId(rule.id);
                        setForm({
                          reorderPoint: rule.reorderPoint,
                          reorderQuantity: rule.reorderQuantity,
                          leadTimeDays: rule.leadTimeDays,
                          isActive: rule.isActive,
                        });
                      }}
                      className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                      aria-label="Edit rule"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteRule.mutate(rule.id)}
                      className="rounded p-1 text-[var(--muted-foreground)] hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                      aria-label="Delete rule"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- Main page ----

export default function ReorderAlertsPage() {
  const [tab, setTab] = useState<AlertStatusFilter | "all">("Active");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [activeView, setActiveView] = useState<"alerts" | "rules">("alerts");

  const params: Record<string, string | number> = {};
  if (tab !== "all") params.status = tab;

  const { data, isLoading, error } = useReorderAlerts(params);
  const dismissAlert = useDismissAlert();
  const convertAlert = useConvertAlertToPO();

  const alerts = data?.data ?? [];
  const meta = data?.meta;

  const activeAlerts = alerts.filter((a) => a.status === "Active");
  const criticalCount = activeAlerts.filter((a) => a.currentQuantity === 0).length;

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (selectedIds.size === activeAlerts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(activeAlerts.map((a) => a.id)));
    }
  }

  function handleBulkConvert() {
    for (const id of selectedIds) {
      convertAlert.mutate(id);
    }
    setSelectedIds(new Set());
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-[var(--muted-foreground)]">Failed to load alerts</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Reorder Alerts</h1>
          <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
            Manage reorder rules and track low-stock alerts across all properties
          </p>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  Out of Stock
                </p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">{criticalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/20">
                <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  Active Alerts
                </p>
                <p className="text-xl font-bold text-[var(--foreground)]">{activeAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  Converted to PO
                </p>
                <p className="text-xl font-bold text-[var(--foreground)]">
                  {/* Count from all tabs would need separate query; use current tab data */}
                  {alerts.filter((a) => a.status === "Ordered").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10">
                <Package className="h-4 w-4 text-[var(--primary)]" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  Reorder Rules
                </p>
                <p className="text-xl font-bold text-[var(--foreground)]">—</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View toggle */}
      <div className="flex border-b border-[var(--border)]">
        <button
          onClick={() => setActiveView("alerts")}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors",
            activeView === "alerts"
              ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          )}
        >
          Alerts
        </button>
        <button
          onClick={() => setActiveView("rules")}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-colors",
            activeView === "rules"
              ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          )}
        >
          Reorder Rules
        </button>
      </div>

      {activeView === "alerts" && (
        <div className="space-y-4">
          {/* Status tabs + bulk actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1">
              {STATUS_TABS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => { setTab(t.value); setSelectedIds(new Set()); }}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    tab === t.value
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80 hover:text-[var(--foreground)]"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "Active" && activeAlerts.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs text-[var(--primary)] hover:underline"
                >
                  {selectedIds.size === activeAlerts.length ? "Deselect all" : "Select all"}
                </button>
                {selectedIds.size > 0 && (
                  <Button
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={handleBulkConvert}
                    disabled={convertAlert.isPending}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Convert {selectedIds.size} to PO
                  </Button>
                )}
              </div>
            )}
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-lg bg-[var(--muted)]" />
              ))}
            </div>
          )}

          {!isLoading && alerts.length === 0 && (
            <div className="rounded-lg border border-dashed border-[var(--border)] py-12 text-center">
              <Bell className="mx-auto h-8 w-8 text-[var(--muted-foreground)]/40" />
              <p className="mt-2 text-sm font-medium text-[var(--foreground)]">No alerts</p>
              <p className="text-xs text-[var(--muted-foreground)]">
                {tab === "Active" ? "All stock levels are above reorder points" : `No ${tab.toLowerCase()} alerts`}
              </p>
            </div>
          )}

          {!isLoading && alerts.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  selected={selectedIds.has(alert.id)}
                  onSelect={toggleSelect}
                  onDismiss={(id) => dismissAlert.mutate(id)}
                  onConvert={(id) => convertAlert.mutate(id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeView === "rules" && <RulesTable />}
    </div>
  );
}
