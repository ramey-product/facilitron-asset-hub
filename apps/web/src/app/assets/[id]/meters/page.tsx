"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Gauge, Plus, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useAssetMeters, useMeterHistory, useCreateReading } from "@/hooks/use-meters";
import type { AssetMeter, MeterReading } from "@asset-hub/shared";

function ThresholdGauge({ current, threshold, unit }: { current: number; threshold: number; unit: string }) {
  const pct = Math.min(Math.round((current / threshold) * 100), 150);
  const barPct = Math.min(pct, 100);
  const color = pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-500" : "bg-emerald-500";
  const textColor = pct >= 100 ? "text-red-600 dark:text-red-400" : pct >= 80 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400";

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-[var(--muted-foreground)] mb-1">
        <span>0 {unit}</span>
        <span className={cn("font-semibold", textColor)}>{pct}% of threshold</span>
        <span>{threshold.toLocaleString()} {unit}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-[var(--muted)]">
        <div className={cn("h-2 rounded-full transition-all", color)} style={{ width: `${barPct}%` }} />
      </div>
    </div>
  );
}

function LogReadingModal({ meter, onClose }: { meter: AssetMeter; onClose: () => void }) {
  const [value, setValue] = useState(meter.currentReading.toString());
  const [notes, setNotes] = useState("");
  const { mutate: createReading, isPending } = useCreateReading(meter.assetId, meter.id);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numVal = parseFloat(value);
    if (isNaN(numVal)) return;
    createReading({ value: numVal, notes: notes || undefined }, {
      onSuccess: () => onClose(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
        <h3 className="mb-4 text-base font-semibold text-[var(--foreground)]">
          Log Reading — {meter.meterType.charAt(0).toUpperCase() + meter.meterType.slice(1)} Meter
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">
              New Reading ({meter.unit})
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              min={meter.currentReading}
              step="0.1"
              className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
              required
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Current: {meter.currentReading.toLocaleString()} {meter.unit}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]">Cancel</button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary)]/90 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Reading"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MeterHistorySection({ assetId, meterId, unit }: { assetId: number; meterId: number; unit: string }) {
  const { data } = useMeterHistory(assetId, meterId, { limit: 20 });
  const readings: MeterReading[] = data?.data ?? [];

  if (readings.length === 0) return (
    <div className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center">
      <p className="text-sm text-[var(--muted-foreground)]">No readings recorded yet.</p>
    </div>
  );

  // Reverse for chart (oldest first)
  const chartData = [...readings].reverse().map((r) => ({
    date: new Date(r.readingDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: r.value,
  }));

  return (
    <div className="space-y-4">
      {/* Line chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={(v) => v.toLocaleString()} />
            <Tooltip
              contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
              formatter={(v: unknown) => [`${Number(v).toLocaleString()} ${unit}`, "Reading"]}
            />
            <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Date</th>
              <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Reading</th>
              <th className="px-4 py-2.5 text-right text-xs font-semibold text-[var(--muted-foreground)]">Delta</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Recorded By</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--muted-foreground)]">Notes</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((r) => (
              <tr key={r.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/30 transition-colors">
                <td className="px-4 py-2.5 text-[var(--foreground)]">{formatDate(r.readingDate)}</td>
                <td className="px-4 py-2.5 text-right font-mono text-[var(--foreground)]">{r.value.toLocaleString()} {unit}</td>
                <td className="px-4 py-2.5 text-right text-[var(--muted-foreground)]">
                  {r.delta !== null ? `+${r.delta.toLocaleString()}` : "—"}
                </td>
                <td className="px-4 py-2.5 text-[var(--muted-foreground)]">{r.recordedByName ?? "—"}</td>
                <td className="px-4 py-2.5 text-[var(--muted-foreground)]">{r.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MeterCard({ meter }: { meter: AssetMeter }) {
  const [showModal, setShowModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const meterLabel = meter.meterType.charAt(0).toUpperCase() + meter.meterType.slice(1);

  const statusColor =
    meter.percentOfThreshold !== null && meter.percentOfThreshold >= 100
      ? "border-red-400 dark:border-red-400/50"
      : meter.percentOfThreshold !== null && meter.percentOfThreshold >= 80
      ? "border-amber-400 dark:border-amber-400/50"
      : "border-[var(--border)]";

  return (
    <>
      <Card className={cn("border", statusColor)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-[var(--primary)]" />
              <CardTitle className="text-sm font-semibold">{meterLabel} Meter</CardTitle>
            </div>
            {meter.percentOfThreshold !== null && (
              <Badge className={cn("text-[10px] border",
                meter.percentOfThreshold >= 100
                  ? "bg-red-100 text-red-900 border-red-300 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20"
                  : meter.percentOfThreshold >= 80
                  ? "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20"
                  : "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20"
              )}>
                {meter.percentOfThreshold >= 100 ? "Exceeded" : meter.percentOfThreshold >= 80 ? "Approaching" : "OK"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-3xl font-bold text-[var(--foreground)] tabular-nums">
              {meter.currentReading.toLocaleString()}
            </p>
            <p className="text-sm text-[var(--muted-foreground)]">{meter.unit}</p>
          </div>

          {meter.thresholdValue !== null && (
            <ThresholdGauge
              current={meter.currentReading}
              threshold={meter.thresholdValue}
              unit={meter.unit}
            />
          )}

          <p className="text-xs text-[var(--muted-foreground)]">
            Last reading: {meter.lastReadingDate ? formatDate(meter.lastReadingDate) : "Never"}
            {meter.lastReadingByName && <> by {meter.lastReadingByName}</>}
          </p>

          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={() => setShowModal(true)} className="flex-1 gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Log Reading
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowHistory(!showHistory)} className="gap-1.5">
              <History className="h-3.5 w-3.5" />
              History
            </Button>
          </div>

          {showHistory && (
            <div className="pt-2">
              <MeterHistorySection assetId={meter.assetId} meterId={meter.id} unit={meter.unit} />
            </div>
          )}
        </CardContent>
      </Card>

      {showModal && <LogReadingModal meter={meter} onClose={() => setShowModal(false)} />}
    </>
  );
}

export default function AssetMetersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const assetId = parseInt(id, 10);
  const { data, isLoading } = useAssetMeters(assetId);
  const meters = data?.data ?? [];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center gap-3 px-8">
          <Link href={`/assets/${assetId}`} className="flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to Asset
          </Link>
          <span className="text-[var(--border)]">/</span>
          <Gauge className="h-4 w-4 text-[var(--primary)]" />
          <h1 className="text-xl font-bold text-[var(--foreground)]">Meter Readings</h1>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl bg-[var(--muted)]" />
            ))}
          </div>
        )}

        {!isLoading && meters.length === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--border)] p-16 text-center">
            <Gauge className="mx-auto h-12 w-12 text-[var(--muted-foreground)] mb-4" />
            <p className="text-lg font-semibold text-[var(--foreground)]">No meters configured</p>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">No meters have been set up for this asset.</p>
          </div>
        )}

        {meters.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {meters.map((meter) => (
              <MeterCard key={meter.id} meter={meter} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
