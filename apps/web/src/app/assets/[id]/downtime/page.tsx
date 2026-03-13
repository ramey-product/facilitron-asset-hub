"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Activity, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { useDowntimeEvents, useDowntimeStats, useResolveDowntimeEvent } from "@/hooks/use-downtime";
import type { DowntimeEvent, StatsWindow } from "@asset-hub/shared";

const REASON_LABELS: Record<string, string> = {
  mechanical_failure: "Mechanical Failure",
  electrical_failure: "Electrical Failure",
  planned_maintenance: "Planned Maintenance",
  operator_error: "Operator Error",
  parts_unavailable: "Parts Unavailable",
  waiting_for_parts: "Waiting for Parts",
  inspection: "Inspection",
  environmental: "Environmental",
  unknown: "Unknown",
};

function reasonBadge(reason: string) {
  const label = REASON_LABELS[reason] ?? reason;
  const isPlanned = reason === "planned_maintenance" || reason === "inspection";
  return (
    <Badge className={cn(
      "text-[10px] border",
      isPlanned
        ? "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/20"
        : "bg-red-100 text-red-900 border-red-300 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20"
    )}>
      {label}
    </Badge>
  );
}

function formatDuration(minutes: number | null): string {
  if (minutes === null) return "Ongoing";
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function StatsCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <p className="text-2xl font-bold text-[var(--foreground)] tabular-nums">{value}</p>
        <p className="text-xs text-[var(--muted-foreground)]">{label}</p>
        {sub && <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

// Simple horizontal timeline bar: green = online, red = offline segments
function TimelineBar({ events, windowDays }: { events: DowntimeEvent[]; windowDays: number }) {
  const now = new Date();
  const start = new Date(now.getTime() - windowDays * 24 * 60 * 60 * 1000);
  const totalMs = windowDays * 24 * 60 * 60 * 1000;

  // Build segments
  type Seg = { left: number; width: number; isDown: boolean; label: string };
  const segs: Seg[] = [];
  const sortedEvents = [...events]
    .filter((e) => new Date(e.startTime) <= now && (!e.endTime || new Date(e.endTime) >= start))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  for (const ev of sortedEvents) {
    const evStart = Math.max(new Date(ev.startTime).getTime(), start.getTime());
    const evEnd = ev.endTime ? Math.min(new Date(ev.endTime).getTime(), now.getTime()) : now.getTime();
    const left = ((evStart - start.getTime()) / totalMs) * 100;
    const width = ((evEnd - evStart) / totalMs) * 100;
    if (width > 0) {
      segs.push({ left, width, isDown: true, label: REASON_LABELS[ev.reason] ?? ev.reason });
    }
  }

  return (
    <div className="relative h-8 w-full rounded-lg bg-emerald-500/20 overflow-hidden" title="Green = online, Red = downtime">
      {segs.map((seg, i) => (
        <div
          key={i}
          className={cn("absolute top-0 h-full", seg.isDown ? "bg-red-500/80" : "bg-emerald-500/80")}
          style={{ left: `${seg.left}%`, width: `${Math.max(seg.width, 0.5)}%` }}
          title={seg.label}
        />
      ))}
    </div>
  );
}

export default function AssetDowntimePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const assetId = parseInt(id, 10);
  const [window, setWindow] = useState<StatsWindow>("90d");

  const { data: eventsData, isLoading: eventsLoading } = useDowntimeEvents(assetId);
  const { data: statsData } = useDowntimeStats(assetId, window);
  const { mutate: resolve } = useResolveDowntimeEvent(assetId);

  const events: DowntimeEvent[] = eventsData?.data ?? [];
  const stats = statsData?.data;

  const ongoing = events.filter((e) => e.endTime === null);
  const windowDays = window === "90d" ? 90 : window === "6m" ? 182 : 365;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center gap-3 px-8">
          <Link href={`/assets/${assetId}`} className="flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to Asset
          </Link>
          <span className="text-[var(--border)]">/</span>
          <Activity className="h-4 w-4 text-[var(--primary)]" />
          <h1 className="text-xl font-bold text-[var(--foreground)]">Downtime History</h1>
          {ongoing.length > 0 && (
            <Badge className="bg-red-100 text-red-900 border border-red-300 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20 text-[10px] ml-2">
              {ongoing.length} Ongoing
            </Badge>
          )}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Window selector + stats */}
        <div className="flex items-center justify-between">
          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
            {(["90d", "6m", "12m"] as StatsWindow[]).map((w) => (
              <button
                key={w}
                onClick={() => setWindow(w)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  window === w
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                )}
              >
                {w === "90d" ? "90 Days" : w === "6m" ? "6 Months" : "12 Months"}
              </button>
            ))}
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatsCard label="MTBF" value={stats ? `${stats.mtbf}h` : "—"} sub="Mean Time Between Failures" />
          <StatsCard label="MTTR" value={stats ? `${stats.mttr}h` : "—"} sub="Mean Time To Repair" />
          <StatsCard
            label="Availability"
            value={stats ? `${stats.availability}%` : "—"}
            sub={`${windowDays}-day window`}
          />
          <StatsCard label="Total Downtime" value={stats ? `${stats.totalDowntimeHours}h` : "—"} sub={`${stats?.totalEvents ?? 0} events`} />
        </div>

        {/* Timeline bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Availability Timeline ({window})</CardTitle>
          </CardHeader>
          <CardContent>
            <TimelineBar events={events} windowDays={windowDays} />
            <div className="flex items-center gap-4 mt-3 text-xs text-[var(--muted-foreground)]">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500/60" /> Online</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500/80" /> Downtime</span>
            </div>
          </CardContent>
        </Card>

        {/* Ongoing events */}
        {ongoing.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Ongoing ({ongoing.length})
            </h2>
            <div className="space-y-3">
              {ongoing.map((ev) => (
                <div key={ev.id} className="rounded-lg border border-red-300 dark:border-red-400/30 bg-red-50 dark:bg-red-400/5 p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {reasonBadge(ev.reason)}
                      <span className="text-xs text-[var(--muted-foreground)]">Started {formatDate(ev.startTime)}</span>
                    </div>
                    <p className="text-sm text-[var(--foreground)]">{ev.reasonDescription ?? "No description"}</p>
                    {ev.associatedWoId && (
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">WO #{ev.associatedWoId}</p>
                    )}
                  </div>
                  <button
                    onClick={() => resolve(ev.id)}
                    className="shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
                  >
                    Resolve
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event history table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Event History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {eventsLoading ? (
              <div className="h-32 animate-pulse m-4 rounded-lg bg-[var(--muted)]" />
            ) : events.length === 0 ? (
              <div className="p-12 text-center">
                <Clock className="mx-auto h-10 w-10 text-[var(--muted-foreground)] mb-3" />
                <p className="text-sm text-[var(--muted-foreground)]">No downtime events recorded.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Start</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">End</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Duration</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Reason</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => (
                      <tr key={ev.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/30 transition-colors">
                        <td className="px-4 py-2.5 text-[var(--foreground)]">{formatDate(ev.startTime)}</td>
                        <td className="px-4 py-2.5 text-[var(--muted-foreground)]">
                          {ev.endTime ? formatDate(ev.endTime) : <span className="text-red-500 font-medium">Ongoing</span>}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-[var(--foreground)]">
                          {formatDuration(ev.durationMinutes)}
                        </td>
                        <td className="px-4 py-2.5">{reasonBadge(ev.reason)}</td>
                        <td className="px-4 py-2.5 text-[var(--muted-foreground)] max-w-xs truncate">{ev.reasonDescription ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
