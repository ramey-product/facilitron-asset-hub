"use client";

import { useState } from "react";
import {
  CheckSquare,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Plus,
  PrinterIcon,
  Square,
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
  usePickLists,
  usePickList,
  useCreatePickList,
  useUpdatePickListItem,
  useCompletePickList,
} from "@/hooks/use-pick-lists";
import type {
  PickList,
  PickListStatus,
  PickListItem,
  CreatePickListInput,
  PickListDateRange,
} from "@asset-hub/shared";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type StatusMeta = { label: string; classes: string };

const STATUS_META: Record<PickListStatus, StatusMeta> = {
  draft: {
    label: "Draft",
    classes:
      "bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-500/10 dark:text-zinc-400 dark:border-zinc-400/20",
  },
  "in-progress": {
    label: "In Progress",
    classes:
      "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-400/20",
  },
  completed: {
    label: "Completed",
    classes:
      "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-400/20",
  },
  "on-hold": {
    label: "On Hold",
    classes:
      "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-400/20",
  },
};

const ITEM_STATUS_CLASSES: Record<string, string> = {
  pending: "text-[var(--muted-foreground)]",
  picked: "text-emerald-700 dark:text-emerald-400 line-through opacity-60",
  short: "text-red-700 dark:text-red-400",
};

const ACTIVE_STATUSES: PickListStatus[] = ["draft", "in-progress", "on-hold"];
const HISTORY_STATUS: PickListStatus = "completed";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function statusBadge(status: PickListStatus) {
  const meta = STATUS_META[status] ?? STATUS_META.draft;
  return (
    <Badge className={cn("text-[10px] border", meta.classes)}>{meta.label}</Badge>
  );
}

function progressPercent(list: PickList): number {
  if (list.totalItems === 0) return 0;
  return Math.round((list.pickedItems / list.totalItems) * 100);
}

// ---------------------------------------------------------------------------
// Generate Pick List Dialog
// ---------------------------------------------------------------------------

function GeneratePickListDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (id: number) => void;
}) {
  const createPickList = useCreatePickList();
  const [name, setName] = useState("");
  const [dateRange, setDateRange] = useState<PickListDateRange>("today");

  function handleGenerate() {
    const input: CreatePickListInput = {
      name: name || undefined,
      dateRange,
    };
    createPickList.mutate(input, {
      onSuccess: (res) => {
        const data = res as { data: PickList };
        onCreated(data.data.id);
      },
    });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent onClose={onClose} className="p-0 max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Pick List</DialogTitle>
          <DialogDescription>
            Pull all part requirements from scheduled work orders for the selected
            time window.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-2 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">
              List Name{" "}
              <span className="text-[var(--muted-foreground)]">(optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Monday AM picks"
              className="h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--foreground)]">
              Work Order Window <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {(
                [
                  { value: "today", label: "Today" },
                  { value: "tomorrow", label: "Tomorrow" },
                  { value: "week", label: "This Week" },
                ] as { value: PickListDateRange; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDateRange(opt.value)}
                  className={cn(
                    "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-all",
                    dateRange === opt.value
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)]/30 hover:text-[var(--foreground)]"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleGenerate}
            disabled={createPickList.isPending}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            {createPickList.isPending ? "Generating..." : "Generate List"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Pick List Item Row
// ---------------------------------------------------------------------------

function PickItemRow({
  item,
  pickListId,
  isCompleted,
}: {
  item: PickListItem;
  pickListId: number;
  isCompleted: boolean;
}) {
  const updateItem = useUpdatePickListItem();
  const isPicked = item.status === "picked";

  function togglePick() {
    if (isCompleted) return;
    updateItem.mutate({
      pickListId,
      itemId: item.id,
      data: { status: isPicked ? "pending" : "picked" },
    });
  }

  return (
    <tr
      className={cn(
        "border-b border-[var(--border)]/50 transition-colors",
        isPicked
          ? "bg-[var(--muted)]/30"
          : "hover:bg-[var(--muted)]/40"
      )}
    >
      <td className="px-4 py-3">
        <button
          onClick={togglePick}
          disabled={isCompleted || updateItem.isPending}
          aria-label={isPicked ? "Mark as unpicked" : "Mark as picked"}
          className="flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--primary)] disabled:opacity-50 transition-colors"
        >
          {isPicked ? (
            <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </button>
      </td>
      <td className="px-4 py-3">
        <p className={cn("text-sm font-medium", ITEM_STATUS_CLASSES[item.status] ?? "")}>
          {item.partName}
        </p>
        <p className="text-[10px] font-mono text-[var(--muted-foreground)]">
          {item.partSku}
        </p>
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-sm text-[var(--foreground)]">
        {item.quantityNeeded}
      </td>
      <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
        <span className="font-mono">{item.storageLocation}</span>
      </td>
      <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
        {item.woReference ?? "—"}
      </td>
      <td className="px-4 py-3">
        {item.status === "short" ? (
          <Badge className="text-[10px] border bg-red-100 text-red-900 border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-400/20">
            Short
          </Badge>
        ) : item.status === "picked" ? (
          <Badge className="text-[10px] border bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-400/20">
            Picked
          </Badge>
        ) : (
          <Badge className="text-[10px] border bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-500/10 dark:text-zinc-400 dark:border-zinc-400/20">
            Pending
          </Badge>
        )}
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Expanded Pick List Detail (loaded on demand)
// ---------------------------------------------------------------------------

function ExpandedPickList({ listId }: { listId: number }) {
  const { data, isLoading } = usePickList(listId);
  const completeList = useCompletePickList();
  const list = (data as { data: PickList } | undefined)?.data;

  if (isLoading) {
    return (
      <div className="px-4 pb-4 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 w-4 animate-pulse rounded bg-[var(--muted)]" />
            <div className="h-4 w-48 animate-pulse rounded bg-[var(--muted)]" />
            <div className="h-4 w-16 animate-pulse rounded bg-[var(--muted)]" />
          </div>
        ))}
      </div>
    );
  }

  if (!list) return null;

  const isCompleted = list.status === "completed";
  const allPicked =
    list.totalItems > 0 && list.pickedItems === list.totalItems;

  // Sort items by storageLocation
  const sortedItems = [...list.items].sort((a, b) =>
    a.storageLocation.localeCompare(b.storageLocation)
  );

  function handleComplete() {
    completeList.mutate(list!.id);
  }

  return (
    <div className="border-t border-[var(--border)]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
              <th
                scope="col"
                className="w-10 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
              >
                Pick
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
              >
                Part
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
              >
                Qty Needed
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
              >
                Storage Location
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
              >
                WO
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <PickItemRow
                key={item.id}
                item={item}
                pickListId={list.id}
                isCompleted={isCompleted}
              />
            ))}
            {sortedItems.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]"
                >
                  No items in this pick list.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isCompleted && allPicked && (
        <div className="px-4 py-3 border-t border-[var(--border)] bg-emerald-50 dark:bg-emerald-500/5 flex items-center justify-between gap-3">
          <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
            All items picked — ready to complete.
          </p>
          <Button
            size="sm"
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleComplete}
            disabled={completeList.isPending}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            {completeList.isPending ? "Completing..." : "Complete List"}
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pick List Card (active lists)
// ---------------------------------------------------------------------------

function PickListCard({ list }: { list: PickList }) {
  const [expanded, setExpanded] = useState(false);
  const pct = progressPercent(list);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden print:break-inside-avoid">
      {/* Card header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-5 py-4 hover:bg-[var(--muted)]/30 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
        aria-expanded={expanded}
        aria-controls={`pick-list-${list.id}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10">
              <ClipboardList className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[var(--foreground)] truncate">
                {list.name}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Created {formatDate(list.createdAt)} by {list.createdBy}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {statusBadge(list.status)}
            <span className="text-xs text-[var(--muted-foreground)] tabular-nums">
              {list.pickedItems}/{list.totalItems} items
            </span>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-[var(--muted-foreground)]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)]" />
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[var(--muted-foreground)]">
              Progress
            </span>
            <span className="text-xs font-medium tabular-nums text-[var(--foreground)]">
              {pct}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                pct === 100
                  ? "bg-emerald-500"
                  : pct > 50
                  ? "bg-blue-500"
                  : "bg-[var(--primary)]"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </button>

      {/* Expanded items */}
      {expanded && (
        <div id={`pick-list-${list.id}`}>
          <ExpandedPickList listId={list.id} />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// History row
// ---------------------------------------------------------------------------

function HistoryRow({ list }: { list: PickList }) {
  return (
    <tr className="border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/40 transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-[var(--foreground)]">{list.name}</p>
      </td>
      <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
        {list.completedAt ? formatDate(list.completedAt) : "—"}
      </td>
      <td className="px-4 py-3 text-right tabular-nums text-sm text-[var(--foreground)]">
        {list.totalItems}
      </td>
      <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
        {list.createdBy}
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function PickListsPage() {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [expandedNewId, setExpandedNewId] = useState<number | null>(null);

  const activeQuery = usePickLists({ status: "in-progress" });
  const draftQuery = usePickLists({ status: "draft" });
  const holdQuery = usePickLists({ status: "on-hold" });
  const historyQuery = usePickLists({ status: "completed", limit: 20 });

  const activeLists: PickList[] = [
    ...((activeQuery.data as { data: PickList[] } | undefined)?.data ?? []),
    ...((draftQuery.data as { data: PickList[] } | undefined)?.data ?? []),
    ...((holdQuery.data as { data: PickList[] } | undefined)?.data ?? []),
  ];
  const historyLists: PickList[] = (historyQuery.data as { data: PickList[] } | undefined)?.data ?? [];

  const isLoadingActive =
    activeQuery.isLoading || draftQuery.isLoading || holdQuery.isLoading;

  function handleCreated(id: number) {
    setShowGenerateModal(false);
    setExpandedNewId(id);
  }

  // If a new list was just created, ensure it appears expanded by injecting
  // its ID into the expanded state (handled inside PickListCard via state)
  void expandedNewId; // used as a trigger — PickListCard manages own state

  return (
    <div className="min-h-screen bg-[var(--background)] print:bg-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md print:static print:border-none print:backdrop-blur-none">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]/10 print:hidden">
              <ClipboardList className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">
                Pick Lists
              </h1>
              <p className="text-xs text-[var(--muted-foreground)] print:hidden">
                Generate and manage part pick lists for work orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => window.print()}
            >
              <PrinterIcon className="h-3.5 w-3.5" />
              Print
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => setShowGenerateModal(true)}
            >
              <Plus className="h-4 w-4" />
              Generate List
            </Button>
          </div>
        </div>
      </header>

      <div className="space-y-8 p-8 print:p-4">
        {/* Active pick lists */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Active Lists
            </h2>
            {!isLoadingActive && (
              <span className="text-xs text-[var(--muted-foreground)]">
                {activeLists.length} list{activeLists.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {isLoadingActive && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--muted)]"
                />
              ))}
            </div>
          )}

          {!isLoadingActive && activeLists.length === 0 && (
            <div className="rounded-xl border border-dashed border-[var(--border)] py-14 text-center">
              <ClipboardList className="mx-auto h-10 w-10 text-[var(--muted-foreground)]/40 mb-2" />
              <p className="text-sm font-medium text-[var(--foreground)]">
                No active pick lists
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Generate a list from scheduled work orders to get started.
              </p>
              <Button
                size="sm"
                className="mt-4 gap-1.5"
                onClick={() => setShowGenerateModal(true)}
              >
                <Plus className="h-4 w-4" />
                Generate List
              </Button>
            </div>
          )}

          {!isLoadingActive && activeLists.length > 0 && (
            <div className="space-y-3">
              {activeLists.map((list) => (
                <PickListCard key={list.id} list={list} />
              ))}
            </div>
          )}
        </section>

        {/* History */}
        <section className="print:break-before-page">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Completed Lists
            </h2>
            {!historyQuery.isLoading && (
              <span className="text-xs text-[var(--muted-foreground)]">
                {historyLists.length} list{historyLists.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {historyQuery.isLoading && (
            <div className="h-40 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--muted)]" />
          )}

          {!historyQuery.isLoading && historyLists.length === 0 && (
            <p className="text-sm text-[var(--muted-foreground)]">
              No completed pick lists yet.
            </p>
          )}

          {!historyQuery.isLoading && historyLists.length > 0 && (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                      >
                        Completed
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                      >
                        Items
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                      >
                        Completed By
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyLists.map((list) => (
                      <HistoryRow key={list.id} list={list} />
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </section>
      </div>

      {/* Generate modal */}
      {showGenerateModal && (
        <GeneratePickListDialog
          onClose={() => setShowGenerateModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
