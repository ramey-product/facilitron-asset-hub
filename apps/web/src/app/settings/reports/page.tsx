"use client";

import { useState } from "react";
import {
  CalendarClock,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import {
  useReportSchedules,
  useCreateReportSchedule,
  useUpdateReportSchedule,
  useDeleteReportSchedule,
  useReportDeliveries,
  useRetryDelivery,
} from "@/hooks/use-reports";
import type {
  ReportSchedule,
  ReportDelivery,
  ReportType,
  ReportFormat,
  ReportCadence,
  ReportDateRange,
  ReportScheduleStatus,
  ReportDeliveryStatus,
  CreateReportScheduleInput,
} from "@asset-hub/shared";

// --- Helpers ---

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  reliability: "Reliability",
  tco: "TCO",
  financial: "Financial",
  "fixed-asset-register": "Fixed Asset Register",
  downtime: "Downtime",
  "meter-readings": "Meter Readings",
  lifecycle: "Lifecycle",
};

const FORMAT_LABELS: Record<ReportFormat, string> = {
  pdf: "PDF",
  csv: "CSV",
  excel: "Excel",
};

const CADENCE_LABELS: Record<ReportCadence, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
};

const DATE_RANGE_LABELS: Record<ReportDateRange, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "6m": "Last 6 months",
  "12m": "Last 12 months",
};

function scheduleStatusBadge(status: ReportScheduleStatus) {
  const classes: Record<ReportScheduleStatus, string> = {
    scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-400/10 dark:text-blue-400",
    running: "bg-amber-100 text-amber-800 dark:bg-amber-400/10 dark:text-amber-400",
    failed: "bg-red-100 text-red-800 dark:bg-red-400/10 dark:text-red-400",
    delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-400",
  };
  return (
    <Badge className={cn("text-[10px]", classes[status])}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function deliveryStatusBadge(status: ReportDeliveryStatus) {
  const classes: Record<ReportDeliveryStatus, string> = {
    delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-400",
    failed: "bg-red-100 text-red-800 dark:bg-red-400/10 dark:text-red-400",
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-400/10 dark:text-amber-400",
  };
  return (
    <Badge className={cn("text-[10px]", classes[status])}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// --- Schedule form ---

const defaultForm: CreateReportScheduleInput = {
  name: "",
  reportType: "reliability",
  format: "pdf",
  cadence: "weekly",
  dateRange: "30d",
  recipients: [],
  isActive: true,
};

interface ScheduleFormProps {
  initial?: Partial<CreateReportScheduleInput>;
  onSubmit: (data: CreateReportScheduleInput) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function ScheduleForm({ initial, onSubmit, onCancel, isLoading }: ScheduleFormProps) {
  const [form, setForm] = useState<CreateReportScheduleInput>({ ...defaultForm, ...initial });
  const [recipientText, setRecipientText] = useState(
    (initial?.recipients ?? []).join("\n")
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emails = recipientText
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    onSubmit({ ...form, recipients: emails });
  };

  const labelClass = "block text-xs font-medium text-[var(--foreground)] mb-1";
  const inputClass =
    "w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Schedule Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
          placeholder="e.g. Weekly Reliability Summary"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Report Type</label>
          <select
            value={form.reportType}
            onChange={(e) => setForm({ ...form, reportType: e.target.value as ReportType })}
            className={inputClass}
          >
            {Object.entries(REPORT_TYPE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Format</label>
          <select
            value={form.format}
            onChange={(e) => setForm({ ...form, format: e.target.value as ReportFormat })}
            className={inputClass}
          >
            {Object.entries(FORMAT_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Cadence</label>
          <select
            value={form.cadence}
            onChange={(e) => setForm({ ...form, cadence: e.target.value as ReportCadence })}
            className={inputClass}
          >
            {Object.entries(CADENCE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Date Range</label>
          <select
            value={form.dateRange}
            onChange={(e) => setForm({ ...form, dateRange: e.target.value as ReportDateRange })}
            className={inputClass}
          >
            {Object.entries(DATE_RANGE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Recipients (one email per line)</label>
        <textarea
          value={recipientText}
          onChange={(e) => setRecipientText(e.target.value)}
          className={cn(inputClass, "min-h-[80px] resize-none")}
          placeholder={"facilities@district.edu\nmaintenance@district.edu"}
          required
        />
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={form.isActive ?? true}
          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          className="rounded"
        />
        Active (schedule will run automatically)
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Schedule"}
        </Button>
      </div>
    </form>
  );
}

// --- Main page ---

export default function ReportSchedulesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ReportSchedule | null>(null);
  const [deliveryPage, setDeliveryPage] = useState(1);

  const { data: schedulesData, isLoading: schedulesLoading } = useReportSchedules({ page: 1, limit: 50 });
  const { data: deliveriesData, isLoading: deliveriesLoading } = useReportDeliveries({ page: deliveryPage, limit: 20 });

  const createSchedule = useCreateReportSchedule();
  const updateSchedule = useUpdateReportSchedule();
  const deleteSchedule = useDeleteReportSchedule();
  const retryDelivery = useRetryDelivery();

  const schedules = schedulesData?.data ?? [];
  const deliveries = deliveriesData?.data ?? [];
  const deliveryMeta = deliveriesData?.meta ?? { page: 1, limit: 20, total: 0, totalPages: 0 };

  const handleCreate = async (data: CreateReportScheduleInput) => {
    await createSchedule.mutateAsync(data);
    setShowForm(false);
  };

  const handleUpdate = async (data: CreateReportScheduleInput) => {
    if (!editingSchedule) return;
    await updateSchedule.mutateAsync({ id: editingSchedule.id, data });
    setEditingSchedule(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deactivate this report schedule?")) return;
    await deleteSchedule.mutateAsync(id);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10">
              <CalendarClock className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">Report Schedules</h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                Automated report delivery configuration
              </p>
            </div>
          </div>
          <Button size="sm" onClick={() => { setShowForm(true); setEditingSchedule(null); }}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Schedule
          </Button>
        </div>
      </header>

      <div className="p-8 space-y-8">
        {/* Create / Edit form */}
        {(showForm || editingSchedule) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {editingSchedule ? "Edit Schedule" : "New Report Schedule"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScheduleForm
                initial={editingSchedule ?? undefined}
                onSubmit={editingSchedule ? handleUpdate : handleCreate}
                onCancel={() => { setShowForm(false); setEditingSchedule(null); }}
                isLoading={createSchedule.isPending || updateSchedule.isPending}
              />
            </CardContent>
          </Card>
        )}

        {/* Schedules table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              {schedules.length} Schedule{schedules.length !== 1 ? "s" : ""}
            </h2>
          </div>

          {schedulesLoading ? (
            <Card>
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-4 w-48 animate-pulse rounded bg-[var(--muted)]" />
                    <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
                    <div className="h-5 w-20 animate-pulse rounded bg-[var(--muted)]" />
                    <div className="ml-auto h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Name</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Type</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Cadence</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Format</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Recipients</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Last Sent</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Status</th>
                      <th scope="col" className="px-4 py-3 w-24"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((schedule) => (
                      <tr
                        key={schedule.id}
                        className={cn(
                          "border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/50 transition-colors",
                          !schedule.isActive && "opacity-50"
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <CalendarClock className="h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)]" />
                            <span className="text-sm font-medium text-[var(--foreground)]">
                              {schedule.name}
                            </span>
                            {!schedule.isActive && (
                              <Badge className="text-[9px] bg-zinc-100 text-zinc-600 dark:bg-zinc-400/10 dark:text-zinc-400">
                                Inactive
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                          {REPORT_TYPE_LABELS[schedule.reportType]}
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                          {CADENCE_LABELS[schedule.cadence]}
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                          {FORMAT_LABELS[schedule.format]}
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                          {schedule.recipients.length} recipient{schedule.recipients.length !== 1 ? "s" : ""}
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                          {schedule.lastSentAt ? formatDate(schedule.lastSentAt) : "Never"}
                        </td>
                        <td className="px-4 py-3">
                          {scheduleStatusBadge(schedule.status)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => { setEditingSchedule(schedule); setShowForm(false); }}
                              className="rounded p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                              aria-label={`Edit ${schedule.name}`}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(schedule.id)}
                              className="rounded p-1 text-[var(--muted-foreground)] hover:text-[var(--destructive)] hover:bg-[var(--muted)] transition-colors"
                              aria-label={`Delete ${schedule.name}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {schedules.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-sm text-[var(--muted-foreground)]">
                          No report schedules configured. Click &ldquo;New Schedule&rdquo; to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Delivery history */}
        <div>
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">
            Delivery History
          </h2>

          {deliveriesLoading ? (
            <Card>
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-4 w-48 animate-pulse rounded bg-[var(--muted)]" />
                    <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
                    <div className="h-5 w-20 animate-pulse rounded bg-[var(--muted)]" />
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Schedule</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Sent At</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Recipients</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Status</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">File Size</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Error</th>
                        <th scope="col" className="px-4 py-3 w-16"><span className="sr-only">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveries.map((delivery) => (
                        <tr
                          key={delivery.id}
                          className="border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-[var(--foreground)]">
                              {delivery.scheduleName}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                            {formatDate(delivery.sentAt)}
                          </td>
                          <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                            {delivery.recipientCount}
                          </td>
                          <td className="px-4 py-3">
                            {deliveryStatusBadge(delivery.status)}
                          </td>
                          <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                            {delivery.fileSize ? formatBytes(delivery.fileSize) : "—"}
                          </td>
                          <td className="px-4 py-3 max-w-[200px]">
                            {delivery.errorMessage && (
                              <span className="text-xs text-[var(--destructive)] truncate block" title={delivery.errorMessage}>
                                {delivery.errorMessage}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {delivery.status === "failed" && (
                              <button
                                onClick={() => retryDelivery.mutate(delivery.id)}
                                disabled={retryDelivery.isPending}
                                className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
                                aria-label="Retry delivery"
                              >
                                <RefreshCw className="h-3 w-3" />
                                Retry
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {deliveries.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-12 text-center text-sm text-[var(--muted-foreground)]">
                            No delivery history yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Pagination */}
              {deliveryMeta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-3">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Page {deliveryMeta.page} of {deliveryMeta.totalPages} ({deliveryMeta.total} total)
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline" size="sm"
                      disabled={deliveryPage <= 1}
                      onClick={() => setDeliveryPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline" size="sm"
                      disabled={deliveryPage >= deliveryMeta.totalPages}
                      onClick={() => setDeliveryPage((p) => p + 1)}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
