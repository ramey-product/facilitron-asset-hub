"use client";

import { useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Download,
  Package,
  RefreshCw,
  SlidersHorizontal,
  RotateCcw,
  ArrowRightLeft,
  Warehouse,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn, formatDate } from "@/lib/utils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  useTransactions,
  useWarehouseStats,
  useCreateTransaction,
} from "@/hooks/use-warehouse";
import type {
  InventoryTransaction,
  TransactionType,
  WarehouseStats,
  TransactionVolumeEntry,
  CreateTransactionInput,
} from "@asset-hub/shared";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TRANSACTION_TYPES: TransactionType[] = [
  "issue",
  "receive",
  "adjust",
  "transfer",
  "return",
];

type TxTypeMeta = {
  label: string;
  classes: string;
  sign: "+" | "-" | "±";
};

const TX_META: Record<TransactionType, TxTypeMeta> = {
  issue: {
    label: "Issue",
    classes:
      "bg-red-100 text-red-900 border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-400/20",
    sign: "-",
  },
  receive: {
    label: "Receive",
    classes:
      "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-400/20",
    sign: "+",
  },
  adjust: {
    label: "Adjust",
    classes:
      "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-400/20",
    sign: "±",
  },
  transfer: {
    label: "Transfer",
    classes:
      "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-400/20",
    sign: "±",
  },
  return: {
    label: "Return",
    classes:
      "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-400/20",
    sign: "+",
  },
};

const MONTH_LABELS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function txBadge(type: TransactionType) {
  const meta = TX_META[type] ?? TX_META.adjust;
  return (
    <Badge className={cn("text-[10px] border capitalize", meta.classes)}>
      {meta.label}
    </Badge>
  );
}

function qtyDisplay(tx: InventoryTransaction) {
  const isPositive = tx.quantity > 0;
  return (
    <span
      className={cn(
        "text-sm font-semibold tabular-nums",
        isPositive
          ? "text-emerald-700 dark:text-emerald-400"
          : "text-red-700 dark:text-red-400"
      )}
    >
      {isPositive ? "+" : ""}
      {tx.quantity}
    </span>
  );
}

function exportCsv(transactions: InventoryTransaction[]) {
  if (transactions.length === 0) return;
  const headers = [
    "Date",
    "Type",
    "Part",
    "SKU",
    "Location",
    "Quantity",
    "Reference",
    "Performed By",
    "Notes",
  ];
  const rows = transactions.map((t) => [
    t.transactionDate,
    t.transactionType,
    t.partName,
    t.partSku,
    t.locationName,
    t.quantity,
    t.reference ?? "",
    t.transactedBy,
    t.notes ?? "",
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `warehouse-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Stat pill
// ---------------------------------------------------------------------------

function StatPill({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: "green" | "red" | "default";
}) {
  const colorClass =
    highlight === "green"
      ? "text-emerald-700 dark:text-emerald-400"
      : highlight === "red"
      ? "text-red-700 dark:text-red-400"
      : "text-[var(--foreground)]";
  return (
    <div className="flex flex-col items-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-5 py-3 gap-0.5">
      <span className={cn("text-2xl font-bold tabular-nums", colorClass)}>
        {value}
      </span>
      <span className="text-xs text-[var(--muted-foreground)]">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quick Action Dialog forms
// ---------------------------------------------------------------------------

type ActionType = "issue" | "receive" | "adjust" | "return" | null;

const ACTION_CONFIG: Record<
  Exclude<ActionType, null>,
  { title: string; description: string; refLabel: string; refPlaceholder: string }
> = {
  issue: {
    title: "Issue to Work Order",
    description: "Decrement part stock for a specific work order.",
    refLabel: "Work Order #",
    refPlaceholder: "e.g. WO-2240",
  },
  receive: {
    title: "Receive from Purchase Order",
    description: "Record incoming stock against a purchase order.",
    refLabel: "Purchase Order #",
    refPlaceholder: "e.g. PO-1033",
  },
  adjust: {
    title: "Manual Adjustment",
    description: "Correct stock levels for a part at a location.",
    refLabel: "Reason / Reference",
    refPlaceholder: "e.g. Cycle count correction",
  },
  return: {
    title: "Record Return",
    description: "Return unused parts back to stock.",
    refLabel: "Work Order #",
    refPlaceholder: "e.g. WO-2240",
  },
};

function ActionDialog({
  type,
  onClose,
  onSubmit,
  isPending,
}: {
  type: Exclude<ActionType, null>;
  onClose: () => void;
  onSubmit: (data: CreateTransactionInput) => void;
  isPending: boolean;
}) {
  const config = ACTION_CONFIG[type];
  const [partId, setPartId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit() {
    const qty = parseInt(quantity);
    if (!partId || !locationId || !qty) return;
    onSubmit({
      transactionType: type,
      partId: parseInt(partId),
      locationId: parseInt(locationId),
      quantity: type === "issue" ? -Math.abs(qty) : Math.abs(qty),
      reference: reference || undefined,
      referenceType:
        type === "issue" || type === "return"
          ? "work-order"
          : type === "receive"
          ? "purchase-order"
          : "manual",
      notes: notes || undefined,
    });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent onClose={onClose} className="p-0 max-w-md">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-2 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">
              Part ID <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={partId}
              onChange={(e) => setPartId(e.target.value)}
              placeholder="Enter part ID"
              className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">
              Location ID <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              placeholder="Enter location ID"
              className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">
              {config.refLabel}
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={config.refPlaceholder}
              className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Optional notes"
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isPending || !partId || !locationId || !quantity}
          >
            {isPending ? "Saving..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Volume Chart
// ---------------------------------------------------------------------------

function VolumeChart({ entries }: { entries: TransactionVolumeEntry[] }) {
  const data = entries.map((e) => ({
    month:
      MONTH_LABELS[parseInt(e.month.slice(5, 7), 10) - 1] ?? e.month,
    Issues: e.issues,
    Receipts: e.receipts,
    Adjustments: e.adjustments,
    Transfers: e.transfers,
    Returns: e.returns,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Transaction Volume (12 Months)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v: unknown, name?: string | number) => [
                `${v} transactions`,
                String(name ?? ""),
              ]}
            />
            <Bar dataKey="Issues" fill="#ef4444" radius={[3, 3, 0, 0]} stackId="a" />
            <Bar dataKey="Receipts" fill="#10b981" radius={[0, 0, 0, 0]} stackId="a" />
            <Bar dataKey="Adjustments" fill="#f59e0b" radius={[0, 0, 0, 0]} stackId="a" />
            <Bar dataKey="Transfers" fill="#6366f1" radius={[0, 0, 0, 0]} stackId="a" />
            <Bar dataKey="Returns" fill="#a855f7" radius={[3, 3, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--muted-foreground)]">
          {(
            [
              { key: "Issues", color: "#ef4444" },
              { key: "Receipts", color: "#10b981" },
              { key: "Adjustments", color: "#f59e0b" },
              { key: "Transfers", color: "#6366f1" },
              { key: "Returns", color: "#a855f7" },
            ] as { key: string; color: string }[]
          ).map(({ key, color }) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: color }}
              />
              <span>{key}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Turnover table
// ---------------------------------------------------------------------------

function TurnoverTable({ stats }: { stats: WarehouseStats }) {
  const rows = stats.turnoverRates.slice(0, 10);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Top 10 Parts by Turnover Rate
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                >
                  Part
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                >
                  Issued
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                >
                  Avg On-Hand
                </th>
                <th
                  scope="col"
                  className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                >
                  Turnover
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.partId}
                  className="border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/40 transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-[var(--foreground)]">
                    {row.partName}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-[var(--muted-foreground)]">
                    {row.issuedQty}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-[var(--muted-foreground)]">
                    {row.avgOnHand.toFixed(1)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums font-semibold text-[var(--foreground)]">
                    {row.turnoverRate.toFixed(2)}x
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-8 text-center text-sm text-[var(--muted-foreground)]"
                  >
                    No turnover data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

type ActiveTab = "ledger" | "reporting";

export default function WarehousePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("ledger");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [activeDialog, setActiveDialog] = useState<ActionType>(null);

  const txParams: Record<string, string | number> = { limit: 50 };
  if (typeFilter !== "all") txParams.type = typeFilter;

  const { data: txData, isLoading: txLoading, isError: txError } =
    useTransactions(txParams);
  const { data: statsData, isLoading: statsLoading } = useWarehouseStats();

  const createTx = useCreateTransaction();

  const transactions: InventoryTransaction[] = (txData as { data: InventoryTransaction[] } | undefined)?.data ?? [];
  const stats = (statsData as { data: WarehouseStats } | undefined)?.data;

  function handleSubmitTransaction(input: CreateTransactionInput) {
    createTx.mutate(input, {
      onSuccess: () => {
        setActiveDialog(null);
      },
    });
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10">
              <Warehouse className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">
                Warehouse Operations
              </h1>
              <p className="text-xs text-[var(--muted-foreground)]">
                Transaction ledger and fulfillment tools
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCsv(transactions)}
            disabled={transactions.length === 0}
            className="gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </header>

      <div className="space-y-6 p-8">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => setActiveDialog("issue")}
          >
            <ArrowUpCircle className="h-4 w-4" />
            Issue to WO
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setActiveDialog("receive")}
          >
            <ArrowDownCircle className="h-4 w-4" />
            Receive from PO
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setActiveDialog("adjust")}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Manual Adjust
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setActiveDialog("return")}
          >
            <RotateCcw className="h-4 w-4" />
            Record Return
          </Button>
        </div>

        {/* Stats strip */}
        {!statsLoading && stats && (
          <div className="flex flex-wrap gap-3">
            <StatPill
              label="Transactions today"
              value={stats.totalTransactionsToday}
            />
            <StatPill
              label="Issues this week"
              value={stats.issuesThisWeek}
              highlight="red"
            />
            <StatPill
              label="Receipts this week"
              value={stats.receiptsThisWeek}
              highlight="green"
            />
            <StatPill
              label="Adjustments this month"
              value={stats.adjustmentsThisMonth}
            />
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-1 w-fit">
          {(
            [
              { id: "ledger", label: "Transaction Ledger" },
              { id: "reporting", label: "Reporting" },
            ] as { id: ActiveTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- Ledger Tab --- */}
        {activeTab === "ledger" && (
          <div className="space-y-4">
            {/* Type filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-[var(--muted-foreground)]">
                Filter:
              </span>
              {(["all", ...TRANSACTION_TYPES] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={cn(
                    "rounded-full border px-3 py-0.5 text-xs font-medium transition-all capitalize",
                    typeFilter === type
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)]/30 hover:text-[var(--foreground)]"
                  )}
                >
                  {type === "all" ? "All types" : type}
                </button>
              ))}
            </div>

            {/* Loading */}
            {txLoading && (
              <Card>
                <div className="p-4 space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
                      <div className="h-5 w-16 animate-pulse rounded-md bg-[var(--muted)]" />
                      <div className="h-4 w-36 animate-pulse rounded bg-[var(--muted)]" />
                      <div className="h-4 w-16 animate-pulse rounded bg-[var(--muted)] ml-auto" />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Error */}
            {txError && !txLoading && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-sm text-[var(--destructive)]">
                    Failed to load transactions. Make sure the API server is running.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Table */}
            {!txLoading && !txError && (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                        >
                          Part
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                        >
                          Location
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                        >
                          Qty
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                        >
                          Reference
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                        >
                          Performed By
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr
                          key={tx.id}
                          className="border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/40 transition-colors"
                        >
                          <td className="px-4 py-3 text-xs text-[var(--muted-foreground)] whitespace-nowrap">
                            {formatDate(tx.transactionDate)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {txBadge(tx.transactionType)}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-[var(--foreground)]">
                              {tx.partName}
                            </p>
                            <p className="text-[10px] font-mono text-[var(--muted-foreground)]">
                              {tx.partSku}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                            {tx.locationName}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {qtyDisplay(tx)}
                          </td>
                          <td className="px-4 py-3 text-xs font-mono text-[var(--muted-foreground)]">
                            {tx.reference ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                            {tx.transactedBy}
                          </td>
                        </tr>
                      ))}
                      {transactions.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-12 text-center"
                          >
                            <ArrowRightLeft className="mx-auto h-8 w-8 text-[var(--muted-foreground)] mb-3" />
                            <p className="text-sm text-[var(--muted-foreground)]">
                              No transactions found.
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {transactions.length > 0 && (
                  <div className="px-4 py-2 border-t border-[var(--border)] text-xs text-[var(--muted-foreground)]">
                    Showing {transactions.length} most recent transactions
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {/* --- Reporting Tab --- */}
        {activeTab === "reporting" && (
          <div className="space-y-6">
            {statsLoading && (
              <div className="space-y-4">
                <div className="h-80 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--muted)]" />
                <div className="h-64 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--muted)]" />
              </div>
            )}
            {!statsLoading && stats && (
              <>
                <VolumeChart entries={stats.transactionVolume} />
                <TurnoverTable stats={stats} />
              </>
            )}
            {!statsLoading && !stats && (
              <Card>
                <CardContent className="p-8 text-center">
                  <RefreshCw className="mx-auto h-8 w-8 text-[var(--muted-foreground)] mb-3" />
                  <p className="text-sm text-[var(--muted-foreground)]">
                    No reporting data available.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Action Dialogs */}
      {activeDialog && (
        <ActionDialog
          type={activeDialog}
          onClose={() => setActiveDialog(null)}
          onSubmit={handleSubmitTransaction}
          isPending={createTx.isPending}
        />
      )}
    </div>
  );
}
