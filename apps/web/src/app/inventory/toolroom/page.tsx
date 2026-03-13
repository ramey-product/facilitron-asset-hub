"use client";

import { useState } from "react";
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart2,
  ArrowLeftRight,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  useToolCheckouts,
  useToolroomStats,
  useCheckoutTool,
  useReturnTool,
} from "@/hooks/use-toolroom";
import type {
  ToolCheckout,
  ToolCheckoutStatus,
  AvailableTool,
  PopularTool,
  ToolroomStats,
  ReturnCondition,
} from "@asset-hub/shared";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function dueDateStatus(expectedReturn: string): "ok" | "soon" | "overdue" {
  const now = Date.now();
  const due = new Date(expectedReturn).getTime();
  const diffDays = (due - now) / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return "overdue";
  if (diffDays <= 3) return "soon";
  return "ok";
}

const STATUS_BADGE_CLASSES: Record<ToolCheckoutStatus, string> = {
  "checked-out":
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/20",
  returned:
    "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20",
  overdue:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20",
};

const STATUS_LABELS: Record<ToolCheckoutStatus, string> = {
  "checked-out": "Checked Out",
  returned: "Returned",
  overdue: "Overdue",
};

const DUE_DATE_RING: Record<"ok" | "soon" | "overdue", string> = {
  ok: "border-[var(--border)]",
  soon: "border-amber-400",
  overdue: "border-red-500",
};

const DUE_DATE_TEXT: Record<"ok" | "soon" | "overdue", string> = {
  ok: "text-[var(--muted-foreground)]",
  soon: "text-amber-600 dark:text-amber-400 font-medium",
  overdue: "text-red-600 dark:text-red-400 font-semibold",
};

// ---------------------------------------------------------------------------
// KPI Card
// ---------------------------------------------------------------------------

function KpiCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  sub?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            {label}
          </span>
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", iconBg)}>
            <Icon className={cn("h-4 w-4", iconColor)} />
          </div>
        </div>
        <div className="text-2xl font-bold text-[var(--foreground)]">{value}</div>
        {sub && <div className="mt-1 text-xs text-[var(--muted-foreground)]">{sub}</div>}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Overdue Alert Banner
// ---------------------------------------------------------------------------

function OverdueBanner({ checkouts }: { checkouts: ToolCheckout[] }) {
  const overdue = checkouts.filter((c) => c.status === "overdue");
  if (overdue.length === 0) return null;

  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-800 dark:text-red-300">
            {overdue.length} Overdue Return{overdue.length !== 1 ? "s" : ""}
          </p>
          <ul className="mt-1.5 space-y-0.5">
            {overdue.map((c) => (
              <li key={c.id} className="text-xs text-red-700 dark:text-red-400">
                <span className="font-medium">{c.toolName}</span> — checked out by{" "}
                {c.checkedOutByName}, due {formatDate(c.expectedReturnDate)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Checkout Card (active / overdue checkouts)
// ---------------------------------------------------------------------------

function CheckoutCard({
  checkout,
  onReturn,
}: {
  checkout: ToolCheckout;
  onReturn: (id: number) => void;
}) {
  const dueStatus =
    checkout.status === "overdue" ? "overdue" : dueDateStatus(checkout.expectedReturnDate);

  return (
    <div
      className={cn(
        "rounded-lg border bg-[var(--card)] p-4 transition-shadow hover:shadow-sm",
        DUE_DATE_RING[dueStatus]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10">
          <Wrench className="h-4 w-4 text-[var(--primary)]" />
        </div>
        <Badge className={cn("text-[10px] border", STATUS_BADGE_CLASSES[checkout.status])}>
          {STATUS_LABELS[checkout.status]}
        </Badge>
      </div>

      <div className="mt-3">
        <p className="font-semibold text-sm text-[var(--foreground)] leading-snug">
          {checkout.toolName}
        </p>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
          Tag: {checkout.toolAssetTag}
        </p>
      </div>

      <div className="mt-3 space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[var(--muted-foreground)]">Checked out by</span>
          <span className="font-medium text-[var(--foreground)]">{checkout.checkedOutByName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[var(--muted-foreground)]">Checked out</span>
          <span className="text-[var(--foreground)]">{formatDate(checkout.checkedOutAt)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[var(--muted-foreground)]">Due back</span>
          <span className={DUE_DATE_TEXT[dueStatus]}>
            {formatDate(checkout.expectedReturnDate)}
          </span>
        </div>
      </div>

      {checkout.notes && (
        <p className="mt-2 text-[10px] text-[var(--muted-foreground)] italic line-clamp-2">
          {checkout.notes}
        </p>
      )}

      <div className="mt-3 border-t border-[var(--border)] pt-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5 text-xs"
          onClick={() => onReturn(checkout.id)}
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          Return Tool
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Available Tool Row
// ---------------------------------------------------------------------------

function AvailableToolRow({
  tool,
  onCheckout,
}: {
  tool: AvailableTool;
  onCheckout: (tool: AvailableTool) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-[var(--muted)]/40 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-500/10">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--foreground)] truncate">{tool.toolName}</p>
          <p className="text-xs text-[var(--muted-foreground)]">Tag: {tool.assetTag}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {tool.lastReturnCondition && (
          <span className="text-xs text-[var(--muted-foreground)]">
            Last: {tool.lastReturnCondition}
          </span>
        )}
        <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => onCheckout(tool)}>
          <Plus className="h-3.5 w-3.5" />
          Checkout
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Popular Tools Chart
// ---------------------------------------------------------------------------

function PopularToolsChart({ tools }: { tools: PopularTool[] }) {
  const data = [...tools]
    .sort((a, b) => b.checkoutCount - a.checkoutCount)
    .slice(0, 8)
    .map((t) => ({ name: t.toolName, count: t.checkoutCount }));

  if (data.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-[var(--primary)]" />
          Popular Tools — Checkout Frequency
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 20, left: 8, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
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
              formatter={(v: unknown, _name?: string | number) => [
                `${v} checkout${Number(v) !== 1 ? "s" : ""}`,
                "Total",
              ]}
            />
            <Bar dataKey="count" name="Checkouts" fill="#6366f1" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Checkout Modal
// ---------------------------------------------------------------------------

interface CheckoutModalProps {
  availableTools: AvailableTool[];
  preselectedTool?: AvailableTool;
  onClose: () => void;
  onSubmit: (data: {
    toolId: number;
    checkedOutByName: string;
    expectedReturnDate: string;
    notes: string;
  }) => void;
  isLoading: boolean;
}

function CheckoutModal({
  availableTools,
  preselectedTool,
  onClose,
  onSubmit,
  isLoading,
}: CheckoutModalProps) {
  const [toolId, setToolId] = useState<number>(preselectedTool?.toolId ?? 0);
  const [userName, setUserName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const inputClass =
    "h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)] text-[var(--foreground)]";
  const labelClass = "mb-1 block text-xs font-medium text-[var(--foreground)]";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!toolId || !userName.trim() || !dueDate) return;
    onSubmit({ toolId, checkedOutByName: userName.trim(), expectedReturnDate: dueDate, notes });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Checkout Tool</h2>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Assign a tool to a team member and set the expected return date.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className={labelClass}>
              Tool <span className="text-red-500">*</span>
            </label>
            <select
              value={toolId}
              onChange={(e) => setToolId(Number(e.target.value))}
              className={inputClass}
              required
            >
              <option value={0} disabled>Select a tool...</option>
              {availableTools.map((t) => (
                <option key={t.toolId} value={t.toolId}>
                  {t.toolName} ({t.assetTag})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Checked Out By <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className={inputClass}
              placeholder="Full name of the person checking out"
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              Expected Return Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)] resize-none"
              placeholder="Optional: job site, task reference, etc."
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading || !toolId || !userName.trim() || !dueDate}
            >
              {isLoading ? "Checking out..." : "Checkout Tool"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Return Modal
// ---------------------------------------------------------------------------

interface ReturnModalProps {
  checkout: ToolCheckout;
  onClose: () => void;
  onSubmit: (data: { condition: ReturnCondition; notes: string }) => void;
  isLoading: boolean;
}

function ReturnModal({ checkout, onClose, onSubmit, isLoading }: ReturnModalProps) {
  const [condition, setCondition] = useState<ReturnCondition>("good");
  const [notes, setNotes] = useState("");

  const inputClass =
    "h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)] text-[var(--foreground)]";
  const labelClass = "mb-1 block text-xs font-medium text-[var(--foreground)]";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ condition, notes });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Return Tool</h2>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Confirm the return of{" "}
          <span className="font-medium text-[var(--foreground)]">{checkout.toolName}</span> from{" "}
          {checkout.checkedOutByName}.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className={labelClass}>
              Return Condition <span className="text-red-500">*</span>
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ReturnCondition)}
              className={inputClass}
            >
              <option value="good">Good — No issues</option>
              <option value="fair">Fair — Minor wear or damage</option>
              <option value="poor">Poor — Needs repair or replacement</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Condition Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)] resize-none"
              placeholder="Optional: describe any damage or issues"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isLoading}>
              {isLoading ? "Returning..." : "Confirm Return"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function ToolroomPage() {
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [preselectedTool, setPreselectedTool] = useState<AvailableTool | undefined>();
  const [returnTarget, setReturnTarget] = useState<ToolCheckout | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const statsQuery = useToolroomStats();
  const activeQuery = useToolCheckouts({ status: "checked-out" });
  const overdueQuery = useToolCheckouts({ status: "overdue" });

  const stats = (statsQuery.data as { data: ToolroomStats } | undefined)?.data;
  const activeCheckouts =
    (activeQuery.data as { data: ToolCheckout[] } | undefined)?.data ?? [];
  const overdueCheckouts =
    (overdueQuery.data as { data: ToolCheckout[] } | undefined)?.data ?? [];
  const allActive = [...overdueCheckouts, ...activeCheckouts];

  const checkoutMutation = useCheckoutTool();
  const returnMutation = useReturnTool();

  function openCheckout(tool?: AvailableTool) {
    setPreselectedTool(tool);
    setCheckoutModalOpen(true);
  }

  function openReturn(id: number) {
    const checkout = allActive.find((c) => c.id === id);
    if (checkout) setReturnTarget(checkout);
  }

  function handleCheckoutSubmit(data: {
    toolId: number;
    checkedOutByName: string;
    expectedReturnDate: string;
    notes: string;
  }) {
    checkoutMutation.mutate(
      {
        toolId: data.toolId,
        checkedOutBy: 1,
        expectedReturnDate: data.expectedReturnDate,
        notes: data.notes || undefined,
      },
      {
        onSuccess: () => {
          setCheckoutModalOpen(false);
          setPreselectedTool(undefined);
          setSuccessMsg(`Tool checked out to ${data.checkedOutByName} successfully.`);
          setTimeout(() => setSuccessMsg(null), 4000);
        },
      }
    );
  }

  function handleReturnSubmit(data: { condition: ReturnCondition; notes: string }) {
    if (!returnTarget) return;
    returnMutation.mutate(
      {
        id: returnTarget.id,
        data: { condition: data.condition, notes: data.notes || undefined },
      },
      {
        onSuccess: () => {
          setReturnTarget(null);
          setSuccessMsg(`${returnTarget.toolName} returned successfully.`);
          setTimeout(() => setSuccessMsg(null), 4000);
        },
      }
    );
  }

  const isLoading = statsQuery.isLoading || activeQuery.isLoading;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10">
              <Wrench className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">Toolroom Management</h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                Track tool checkouts, returns, and availability
              </p>
            </div>
          </div>
          <Button size="sm" onClick={() => openCheckout()} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Checkout Tool
          </Button>
        </div>
      </header>

      <div className="space-y-6 p-8">
        {/* Success toast */}
        {successMsg && (
          <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
            {successMsg}
          </div>
        )}

        {/* Overdue banner */}
        {!isLoading && <OverdueBanner checkouts={overdueCheckouts} />}

        {/* KPI cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-[var(--muted)]" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Total Tools"
              value={stats.totalTools}
              icon={Wrench}
              iconBg="bg-[var(--primary)]/10"
              iconColor="text-[var(--primary)]"
              sub="Tools in toolroom inventory"
            />
            <KpiCard
              label="Available"
              value={stats.availableTools}
              icon={CheckCircle2}
              iconBg="bg-emerald-100 dark:bg-emerald-500/10"
              iconColor="text-emerald-600 dark:text-emerald-400"
              sub="Ready for checkout"
            />
            <KpiCard
              label="Checked Out"
              value={stats.checkedOutCount}
              icon={Clock}
              iconBg="bg-blue-100 dark:bg-blue-500/10"
              iconColor="text-blue-600 dark:text-blue-400"
              sub="Currently in use"
            />
            <KpiCard
              label="Overdue Returns"
              value={stats.overdueCount}
              icon={AlertTriangle}
              iconBg={
                stats.overdueCount > 0
                  ? "bg-red-100 dark:bg-red-500/10"
                  : "bg-[var(--muted)]"
              }
              iconColor={
                stats.overdueCount > 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-[var(--muted-foreground)]"
              }
              sub={stats.overdueCount > 0 ? "Past due date" : "None overdue"}
            />
          </div>
        ) : null}

        {/* Available tools */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Available Tools
                {stats && (
                  <Badge className="ml-1 text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                    {stats.availableTools}
                  </Badge>
                )}
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => openCheckout()}>
                <Plus className="h-3.5 w-3.5" />
                New Checkout
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-px px-4 py-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded-md bg-[var(--muted)]" />
                ))}
              </div>
            ) : stats && stats.availableToolsList.length > 0 ? (
              <ul className="divide-y divide-[var(--border)]">
                {stats.availableToolsList.map((tool) => (
                  <li key={tool.toolId}>
                    <AvailableToolRow tool={tool} onCheckout={openCheckout} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center text-sm text-[var(--muted-foreground)]">
                No tools currently available — all checked out.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Checked-out tools */}
        {!isLoading && allActive.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Checked-Out Tools
                <span className="ml-1 text-[var(--muted-foreground)] font-normal">
                  ({allActive.length})
                </span>
              </h2>
              <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-400" />
                  OK (3+ days)
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-400" />
                  Due soon
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-500" />
                  Overdue
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allActive.map((checkout) => (
                <CheckoutCard key={checkout.id} checkout={checkout} onReturn={openReturn} />
              ))}
            </div>
          </div>
        )}

        {/* Popular tools chart */}
        {!isLoading && stats && stats.popularTools.length > 0 && (
          <PopularToolsChart tools={stats.popularTools} />
        )}

        {/* Empty state */}
        {!isLoading && allActive.length === 0 && (
          <div className="rounded-lg border border-dashed border-[var(--border)] py-16 text-center">
            <Wrench className="mx-auto h-10 w-10 text-[var(--muted-foreground)]/40" />
            <p className="mt-2 text-sm font-medium text-[var(--foreground)]">No active checkouts</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              All tools are currently available in the toolroom.
            </p>
            <Button className="mt-4 gap-1.5 text-sm" onClick={() => openCheckout()}>
              <Plus className="h-4 w-4" />
              Checkout a Tool
            </Button>
          </div>
        )}
      </div>

      {/* Checkout modal */}
      {checkoutModalOpen && stats && (
        <CheckoutModal
          availableTools={stats.availableToolsList}
          preselectedTool={preselectedTool}
          onClose={() => {
            setCheckoutModalOpen(false);
            setPreselectedTool(undefined);
          }}
          onSubmit={handleCheckoutSubmit}
          isLoading={checkoutMutation.isPending}
        />
      )}

      {/* Return modal */}
      {returnTarget && (
        <ReturnModal
          checkout={returnTarget}
          onClose={() => setReturnTarget(null)}
          onSubmit={handleReturnSubmit}
          isLoading={returnMutation.isPending}
        />
      )}
    </div>
  );
}
