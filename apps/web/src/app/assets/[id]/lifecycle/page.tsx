"use client";

import { useState } from "react";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, GitBranch, Plus, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAssetLifecycle, useCreateLifecycleEvent } from "@/hooks/use-lifecycle";
import type { LifecycleStage, LifecycleEvent } from "@asset-hub/shared";

const STAGE_COLORS: Record<LifecycleStage, string> = {
  Procurement: "#3b82f6",
  Active: "#22c55e",
  UnderMaintenance: "#eab308",
  ScheduledForReplacement: "#f97316",
  Disposed: "#6b7280",
};

const STAGE_LABELS: Record<LifecycleStage, string> = {
  Procurement: "Procurement",
  Active: "Active",
  UnderMaintenance: "Under Maintenance",
  ScheduledForReplacement: "Scheduled for Replacement",
  Disposed: "Disposed",
};

const STAGES: LifecycleStage[] = [
  "Procurement",
  "Active",
  "UnderMaintenance",
  "ScheduledForReplacement",
  "Disposed",
];

function StageBadge({ stage }: { stage: LifecycleStage }) {
  const classes: Record<LifecycleStage, string> = {
    Procurement: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-400/10 dark:text-blue-400",
    Active: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-400",
    UnderMaintenance: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-400/10 dark:text-yellow-400",
    ScheduledForReplacement: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-400/10 dark:text-orange-400",
    Disposed: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-400/10 dark:text-zinc-400",
  };
  return (
    <Badge className={cn("border text-xs font-medium px-2 py-0.5", classes[stage])}>
      {STAGE_LABELS[stage]}
    </Badge>
  );
}

interface AddTransitionFormProps {
  onSubmit: (toStage: LifecycleStage, reason: string, notes: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function AddTransitionForm({ onSubmit, onCancel, isLoading }: AddTransitionFormProps) {
  const [toStage, setToStage] = useState<LifecycleStage>("Active");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(toStage, reason, notes);
  };

  const inputClass = "w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
          New Stage
        </label>
        <select
          value={toStage}
          onChange={(e) => setToStage(e.target.value as LifecycleStage)}
          className={inputClass}
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>{STAGE_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
          Reason <span className="text-[var(--destructive)]">*</span>
        </label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={inputClass}
          placeholder="e.g. Compressor failure requiring repair"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[var(--foreground)] mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={cn(inputClass, "resize-none")}
          rows={2}
          placeholder="Optional additional context..."
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isLoading || !reason}>
          {isLoading ? "Saving..." : "Log Transition"}
        </Button>
      </div>
    </form>
  );
}

interface AssetLifecyclePageProps {
  params: Promise<{ id: string }>;
}

export default function AssetLifecyclePage({ params }: AssetLifecyclePageProps) {
  const { id } = use(params);
  const assetId = parseInt(id, 10);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError } = useAssetLifecycle(assetId);
  const createEvent = useCreateLifecycleEvent(assetId);

  const events = data?.data ?? [];
  const currentEvent = events[events.length - 1];
  const currentStage = currentEvent?.toStage ?? null;

  const handleAddTransition = async (toStage: LifecycleStage, reason: string, notes: string) => {
    await createEvent.mutateAsync({ assetId, toStage, reason, notes });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <Link
              href={`/assets/${assetId}`}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10">
              <GitBranch className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">
                {currentEvent?.assetName ?? `Asset #${assetId}`} — Lifecycle
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm text-[var(--muted-foreground)]">Current stage:</span>
                {currentStage && <StageBadge stage={currentStage} />}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Log Transition
          </Button>
        </div>
      </header>

      <div className="p-8 max-w-3xl space-y-6">
        {/* Transition form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Log Lifecycle Transition</CardTitle>
            </CardHeader>
            <CardContent>
              <AddTransitionForm
                onSubmit={handleAddTransition}
                onCancel={() => setShowForm(false)}
                isLoading={createEvent.isPending}
              />
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-[var(--muted)]" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 w-40 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-3 w-56 animate-pulse rounded bg-[var(--muted)]" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-[var(--destructive)]">Failed to load lifecycle events.</p>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <GitBranch className="h-8 w-8 mx-auto mb-3 text-[var(--muted-foreground)]" />
              <p className="text-sm text-[var(--muted-foreground)]">
                No lifecycle events recorded for this asset yet.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-4"
                onClick={() => setShowForm(true)}
              >
                Log First Transition
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-[var(--border)]" />

            <div className="space-y-0">
              {[...events].reverse().map((event, index) => {
                const isFirst = index === 0; // most recent
                return (
                  <TimelineItem
                    key={event.id}
                    event={event}
                    isFirst={isFirst}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TimelineItem({ event, isFirst }: { event: LifecycleEvent; isFirst: boolean }) {
  const color = STAGE_COLORS[event.toStage];

  return (
    <div className="flex gap-4 pb-8 last:pb-0">
      {/* Stage dot */}
      <div className="relative z-10 shrink-0">
        <div
          className={cn(
            "h-8 w-8 rounded-full border-2 border-[var(--background)] flex items-center justify-center",
            isFirst && "ring-2 ring-offset-1 ring-offset-[var(--background)]"
          )}
          style={{ backgroundColor: color, ...(isFirst ? { ringColor: color } : {}) }}
          aria-hidden
        >
          <Circle className="h-3 w-3 fill-white text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-0.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <StageBadge stage={event.toStage} />
          {isFirst && (
            <Badge className="text-[9px] bg-[var(--primary)]/10 text-[var(--primary)]">Current</Badge>
          )}
        </div>

        {event.fromStage && (
          <p className="text-xs text-[var(--muted-foreground)] mb-1">
            from{" "}
            <span
              className="font-medium"
              style={{ color: STAGE_COLORS[event.fromStage] }}
            >
              {STAGE_LABELS[event.fromStage]}
            </span>
          </p>
        )}

        <p className="text-sm text-[var(--foreground)] font-medium">{event.reason}</p>

        {event.notes && (
          <p className="text-xs text-[var(--muted-foreground)] mt-1">{event.notes}</p>
        )}

        <div className="mt-2 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
          <span>{new Date(event.transitionDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}</span>
          <span>·</span>
          <span>{event.changedByName}</span>
        </div>
      </div>
    </div>
  );
}
