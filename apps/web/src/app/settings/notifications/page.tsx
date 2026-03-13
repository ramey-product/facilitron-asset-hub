"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import {
  useNotificationPreferences,
  useUpdatePreferences,
  useEmailLog,
  useNotificationTemplates,
} from "@/hooks/use-notifications";
import type {
  NotificationPreference,
  NotificationType,
  NotificationFrequency,
  EmailLog,
  EmailStatus,
  NotificationTemplate,
  UpdatePreferencesInput,
} from "@asset-hub/shared";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  "new-request": "New Request",
  approved: "Request Approved",
  fulfilled: "Request Fulfilled",
  rejected: "Request Rejected",
  "low-stock": "Low Stock Alert",
};

const NOTIFICATION_TYPE_DESCRIPTIONS: Record<NotificationType, string> = {
  "new-request": "Notify when a new inventory or maintenance request is submitted",
  approved: "Notify when a request has been approved by a manager",
  fulfilled: "Notify when a request has been fulfilled and closed",
  rejected: "Notify when a request has been rejected",
  "low-stock": "Alert when a part or consumable falls below its reorder threshold",
};

const FREQUENCY_OPTIONS: { value: NotificationFrequency; label: string }[] = [
  { value: "instant", label: "Instant" },
  { value: "daily", label: "Daily Digest" },
  { value: "weekly", label: "Weekly Digest" },
  { value: "none", label: "None" },
];

const EMAIL_STATUS_BADGE: Record<EmailStatus, { label: string; classes: string; icon: React.ReactNode }> = {
  sent: {
    label: "Sent",
    classes:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  failed: {
    label: "Failed",
    classes:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20",
    icon: <XCircle className="h-3 w-3" />,
  },
  pending: {
    label: "Pending",
    classes:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20",
    icon: <Clock className="h-3 w-3" />,
  },
};

const ALL_NOTIFICATION_TYPES: NotificationType[] = [
  "new-request",
  "approved",
  "fulfilled",
  "rejected",
  "low-stock",
];

// ---------------------------------------------------------------------------
// Preference Row
// ---------------------------------------------------------------------------

interface PreferenceState {
  enabled: boolean;
  frequency: NotificationFrequency;
}

function PreferenceRow({
  type,
  state,
  onChange,
}: {
  type: NotificationType;
  state: PreferenceState;
  onChange: (type: NotificationType, patch: Partial<PreferenceState>) => void;
}) {
  const selectClass =
    "h-8 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4 px-4 py-3.5 transition-colors",
        !state.enabled && "opacity-60"
      )}
    >
      {/* Toggle */}
      <button
        role="switch"
        aria-checked={state.enabled}
        aria-label={`Toggle ${NOTIFICATION_TYPE_LABELS[type]} notifications`}
        onClick={() => onChange(type, { enabled: !state.enabled })}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-1",
          state.enabled ? "bg-[var(--primary)]" : "bg-[var(--muted-foreground)]/30"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
            state.enabled ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>

      {/* Label + description */}
      <div className="flex-1 min-w-[180px]">
        <p className="text-sm font-medium text-[var(--foreground)]">
          {NOTIFICATION_TYPE_LABELS[type]}
        </p>
        <p className="text-xs text-[var(--muted-foreground)]">
          {NOTIFICATION_TYPE_DESCRIPTIONS[type]}
        </p>
      </div>

      {/* Frequency select */}
      <div className="shrink-0">
        <select
          value={state.frequency}
          onChange={(e) => onChange(type, { frequency: e.target.value as NotificationFrequency })}
          disabled={!state.enabled}
          className={selectClass}
          aria-label={`Frequency for ${NOTIFICATION_TYPE_LABELS[type]}`}
        >
          {FREQUENCY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Email Log Table
// ---------------------------------------------------------------------------

function EmailLogTable({ logs, page, onPageChange, totalPages }: {
  logs: EmailLog[];
  page: number;
  onPageChange: (p: number) => void;
  totalPages: number;
}) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Date
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Type
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Subject
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Recipient
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((entry) => {
              const statusInfo = EMAIL_STATUS_BADGE[entry.status];
              return (
                <tr
                  key={entry.id}
                  className="border-b border-[var(--border)]/50 hover:bg-[var(--muted)]/40 transition-colors"
                >
                  <td className="px-4 py-3 text-xs text-[var(--muted-foreground)] whitespace-nowrap">
                    {formatDate(entry.sentAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="text-[10px]">
                      {NOTIFICATION_TYPE_LABELS[entry.notificationType]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--foreground)] max-w-[240px] truncate">
                    {entry.subject}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                    {entry.recipientName || entry.recipient}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={cn(
                        "flex w-fit items-center gap-1 text-[10px] border",
                        statusInfo.classes
                      )}
                    >
                      {statusInfo.icon}
                      {statusInfo.label}
                    </Badge>
                  </td>
                </tr>
              );
            })}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-[var(--muted-foreground)]">
                  No email history yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-[var(--border)]">
          <span className="text-xs text-[var(--muted-foreground)]">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Template Preview Card
// ---------------------------------------------------------------------------

const TEMPLATE_SAMPLE_CONTENT: Record<NotificationType, string> = {
  "new-request": `A new maintenance request has been submitted.\n\nRequest #WO-2847 — HVAC Filter Replacement\nSubmitted by: J. Martinez\nPriority: Medium\nLocation: Building A, Room 204\n\nClick below to review and approve.`,
  approved: `Your request has been approved.\n\nRequest #WO-2847 — HVAC Filter Replacement\nApproved by: D. Nguyen\nApproved at: March 13, 2026, 9:42 AM\n\nWork is scheduled to begin shortly.`,
  fulfilled: `Your request has been fulfilled and closed.\n\nRequest #WO-2847 — HVAC Filter Replacement\nCompleted by: T. Williams\nCompleted at: March 13, 2026, 2:15 PM\n\nParts used: MERV-13 Filter (x2)`,
  rejected: `Your request has been rejected.\n\nRequest #WO-2847 — HVAC Filter Replacement\nRejected by: D. Nguyen\nReason: Scheduled for next PM cycle in April.\n\nContact your supervisor for more information.`,
  "low-stock": `A part has fallen below its reorder threshold.\n\nPart: MERV-13 Air Filter (16x25x1)\nCurrent Stock: 3 units\nReorder Point: 10 units\nLocation: Main Warehouse\n\nConsider creating a purchase order.`,
};

function TemplatePreviewCard({ template }: { template: NotificationTemplate }) {
  const sampleContent =
    TEMPLATE_SAMPLE_CONTENT[template.notificationType] ??
    "No sample content available for this template type.";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-semibold">{template.name}</CardTitle>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{template.description}</p>
          </div>
          <Badge className="shrink-0 text-[10px]">
            {NOTIFICATION_TYPE_LABELS[template.notificationType]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Simulated email preview */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 overflow-hidden">
          {/* Email chrome */}
          <div className="border-b border-[var(--border)] bg-[var(--muted)]/60 px-4 py-2.5 space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--muted-foreground)] w-12">From:</span>
              <span className="text-[var(--foreground)]">Asset Hub Notifications &lt;noreply@asset-hub.app&gt;</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--muted-foreground)] w-12">Subject:</span>
              <span className="font-medium text-[var(--foreground)]">{template.subject}</span>
            </div>
          </div>
          {/* Email body */}
          <div className="px-4 py-3">
            <pre className="whitespace-pre-wrap text-xs text-[var(--foreground)] font-sans leading-relaxed">
              {sampleContent}
            </pre>
            {template.variables.length > 0 && (
              <div className="mt-3 border-t border-[var(--border)] pt-2">
                <p className="text-[10px] font-medium text-[var(--muted-foreground)] mb-1">
                  Template variables:
                </p>
                <div className="flex flex-wrap gap-1">
                  {template.variables.map((v) => (
                    <code
                      key={v}
                      className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-[10px] text-[var(--foreground)]"
                    >
                      {`{{${v}}}`}
                    </code>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="mt-2 text-[10px] text-[var(--muted-foreground)] italic">
          Templates are managed by system administrators and are not editable in this view.
        </p>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function NotificationPreferencesPage() {
  const [preferences, setPreferences] = useState<
    Record<NotificationType, PreferenceState>
  >({
    "new-request": { enabled: true, frequency: "instant" },
    approved: { enabled: true, frequency: "instant" },
    fulfilled: { enabled: true, frequency: "daily" },
    rejected: { enabled: true, frequency: "instant" },
    "low-stock": { enabled: true, frequency: "instant" },
  });
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [logPage, setLogPage] = useState(1);

  const prefsQuery = useNotificationPreferences();
  const emailLogQuery = useEmailLog({ page: logPage, limit: 20 });
  const templatesQuery = useNotificationTemplates();
  const updatePrefs = useUpdatePreferences();

  // Hydrate local state from API response
  useEffect(() => {
    const raw = prefsQuery.data as { data: NotificationPreference[] } | undefined;
    const data = raw?.data;
    if (!data) return;
    const next = { ...preferences };
    for (const pref of data) {
      next[pref.notificationType] = {
        enabled: pref.enabled,
        frequency: pref.frequency,
      };
    }
    setPreferences(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefsQuery.data]);

  const emailLogs =
    (emailLogQuery.data as { data: EmailLog[]; meta?: { totalPages?: number } } | undefined)?.data ?? [];
  const emailMeta =
    (emailLogQuery.data as { meta?: { totalPages?: number } } | undefined)?.meta;
  const totalPages = emailMeta?.totalPages ?? 1;

  const templates =
    (templatesQuery.data as { data: NotificationTemplate[] } | undefined)?.data ?? [];

  function handlePreferenceChange(type: NotificationType, patch: Partial<PreferenceState>) {
    setPreferences((prev) => ({
      ...prev,
      [type]: { ...prev[type], ...patch },
    }));
  }

  function handleSave() {
    const payload: UpdatePreferencesInput = {
      preferences: ALL_NOTIFICATION_TYPES.map((type) => ({
        notificationType: type,
        frequency: preferences[type].frequency,
        enabled: preferences[type].enabled,
      })),
    };
    updatePrefs.mutate(payload, {
      onSuccess: () => {
        setSavedMsg("Notification preferences saved successfully.");
        setTimeout(() => setSavedMsg(null), 4000);
      },
    });
  }

  const prefsLoading = prefsQuery.isLoading;
  const logLoading = emailLogQuery.isLoading;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10">
              <Bell className="h-4 w-4 text-[var(--primary)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--foreground)]">
                Notification Preferences
              </h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                Manage how you receive notifications
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updatePrefs.isPending}
            className="gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            {updatePrefs.isPending ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </header>

      <div className="space-y-8 p-8">
        {/* Success toast */}
        {savedMsg && (
          <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
            {savedMsg}
          </div>
        )}

        {/* Preferences section */}
        <section aria-labelledby="prefs-heading">
          <h2
            id="prefs-heading"
            className="mb-3 text-sm font-semibold text-[var(--foreground)]"
          >
            Email Notification Settings
          </h2>
          <Card>
            {prefsLoading ? (
              <div className="space-y-px p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded-md bg-[var(--muted)]" />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {/* Column headers */}
                <div className="flex items-center gap-4 px-4 py-2 bg-[var(--muted)]/40">
                  <span className="w-9 shrink-0" />
                  <span className="flex-1 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Notification Type
                  </span>
                  <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Frequency
                  </span>
                </div>
                {ALL_NOTIFICATION_TYPES.map((type) => (
                  <PreferenceRow
                    key={type}
                    type={type}
                    state={preferences[type]}
                    onChange={handlePreferenceChange}
                  />
                ))}
              </div>
            )}
            <div className="flex justify-end border-t border-[var(--border)] px-4 py-3">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updatePrefs.isPending || prefsLoading}
                className="gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                {updatePrefs.isPending ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </Card>
        </section>

        {/* Email log section */}
        <section aria-labelledby="email-log-heading">
          <div className="mb-3 flex items-center gap-2">
            <Mail className="h-4 w-4 text-[var(--muted-foreground)]" />
            <h2
              id="email-log-heading"
              className="text-sm font-semibold text-[var(--foreground)]"
            >
              Recent Email History
            </h2>
          </div>
          <Card>
            {logLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-4 w-28 animate-pulse rounded bg-[var(--muted)]" />
                    <div className="h-5 w-24 animate-pulse rounded bg-[var(--muted)]" />
                    <div className="h-4 w-48 animate-pulse rounded bg-[var(--muted)]" />
                    <div className="ml-auto h-5 w-16 animate-pulse rounded bg-[var(--muted)]" />
                  </div>
                ))}
              </div>
            ) : (
              <EmailLogTable
                logs={emailLogs}
                page={logPage}
                onPageChange={setLogPage}
                totalPages={totalPages}
              />
            )}
          </Card>
        </section>

        {/* Template previews section */}
        <section aria-labelledby="templates-heading">
          <div className="mb-3 flex items-center gap-2">
            <Mail className="h-4 w-4 text-[var(--muted-foreground)]" />
            <h2
              id="templates-heading"
              className="text-sm font-semibold text-[var(--foreground)]"
            >
              Email Templates
            </h2>
          </div>
          <p className="mb-4 text-xs text-[var(--muted-foreground)]">
            Preview the email templates used for each notification type. Templates are
            read-only in this view.
          </p>
          {templatesQuery.isLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--muted)]"
                />
              ))}
            </div>
          ) : templates.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {templates.map((tpl) => (
                <TemplatePreviewCard key={tpl.id} template={tpl} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[var(--border)] py-12 text-center">
              <Mail className="mx-auto h-8 w-8 text-[var(--muted-foreground)]/40" />
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                No email templates found.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
