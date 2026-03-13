/**
 * Seed data for P1-34 Scheduled Auto-Reports.
 * 8 schedules + 25+ delivery records.
 */

import type { ReportSchedule, ReportDelivery } from "@asset-hub/shared";

export const mockReportSchedules: ReportSchedule[] = [
  {
    id: 1,
    name: "Weekly Reliability Summary",
    reportType: "reliability",
    format: "pdf",
    cadence: "weekly",
    dateRange: "7d",
    recipients: ["facilities@district.edu", "maintenance@district.edu"],
    isActive: true,
    lastSentAt: "2026-03-10T06:00:00Z",
    nextSendAt: "2026-03-17T06:00:00Z",
    createdAt: "2025-06-01T10:00:00Z",
    createdBy: "admin.user",
    status: "scheduled",
  },
  {
    id: 2,
    name: "Monthly TCO Report",
    reportType: "tco",
    format: "excel",
    cadence: "monthly",
    dateRange: "30d",
    recipients: ["cfo@district.edu", "admin@district.edu", "facilities@district.edu"],
    isActive: true,
    lastSentAt: "2026-03-01T07:00:00Z",
    nextSendAt: "2026-04-01T07:00:00Z",
    createdAt: "2025-07-15T09:00:00Z",
    createdBy: "admin.user",
    status: "scheduled",
  },
  {
    id: 3,
    name: "Quarterly Fixed Asset Register",
    reportType: "fixed-asset-register",
    format: "excel",
    cadence: "quarterly",
    dateRange: "90d",
    recipients: ["auditor@district.edu", "cfo@district.edu"],
    isActive: true,
    lastSentAt: "2026-01-01T08:00:00Z",
    nextSendAt: "2026-04-01T08:00:00Z",
    createdAt: "2025-01-10T11:00:00Z",
    createdBy: "admin.user",
    status: "scheduled",
  },
  {
    id: 4,
    name: "Daily Downtime Alert",
    reportType: "downtime",
    format: "csv",
    cadence: "daily",
    dateRange: "7d",
    recipients: ["maintenance@district.edu"],
    isActive: true,
    lastSentAt: "2026-03-12T05:00:00Z",
    nextSendAt: "2026-03-13T05:00:00Z",
    createdAt: "2025-11-01T08:00:00Z",
    createdBy: "demo.user",
    status: "delivered",
  },
  {
    id: 5,
    name: "Monthly Meter Readings Summary",
    reportType: "meter-readings",
    format: "pdf",
    cadence: "monthly",
    dateRange: "30d",
    recipients: ["energy@district.edu", "facilities@district.edu"],
    isActive: true,
    lastSentAt: "2026-03-01T07:30:00Z",
    nextSendAt: "2026-04-01T07:30:00Z",
    createdAt: "2025-08-20T12:00:00Z",
    createdBy: "admin.user",
    status: "scheduled",
  },
  {
    id: 6,
    name: "Annual Lifecycle Assessment",
    reportType: "lifecycle",
    format: "pdf",
    cadence: "quarterly",
    dateRange: "12m",
    recipients: ["superintendent@district.edu", "facilities@district.edu", "cfo@district.edu"],
    isActive: true,
    lastSentAt: "2026-01-01T09:00:00Z",
    nextSendAt: "2026-04-01T09:00:00Z",
    createdAt: "2024-12-01T10:00:00Z",
    createdBy: "admin.user",
    status: "scheduled",
  },
  {
    id: 7,
    name: "Financial Summary (INACTIVE)",
    reportType: "financial",
    format: "csv",
    cadence: "monthly",
    dateRange: "30d",
    recipients: ["finance@district.edu"],
    isActive: false,
    lastSentAt: "2025-12-01T08:00:00Z",
    nextSendAt: null,
    createdAt: "2025-03-01T10:00:00Z",
    createdBy: "demo.user",
    status: "scheduled",
  },
  {
    id: 8,
    name: "Weekly TCO Digest",
    reportType: "tco",
    format: "pdf",
    cadence: "weekly",
    dateRange: "30d",
    recipients: ["admin@district.edu"],
    isActive: true,
    lastSentAt: "2026-03-09T07:00:00Z",
    nextSendAt: "2026-03-16T07:00:00Z",
    createdAt: "2025-09-01T09:00:00Z",
    createdBy: "admin.user",
    status: "failed",
  },
];

export const mockReportDeliveries: ReportDelivery[] = [
  // Schedule 1 — Weekly Reliability (recent weeks)
  { id: 1, scheduleId: 1, scheduleName: "Weekly Reliability Summary", sentAt: "2026-03-10T06:02:00Z", recipientCount: 2, status: "delivered", errorMessage: null, fileSize: 245760 },
  { id: 2, scheduleId: 1, scheduleName: "Weekly Reliability Summary", sentAt: "2026-03-03T06:01:00Z", recipientCount: 2, status: "delivered", errorMessage: null, fileSize: 239104 },
  { id: 3, scheduleId: 1, scheduleName: "Weekly Reliability Summary", sentAt: "2026-02-24T06:00:00Z", recipientCount: 2, status: "delivered", errorMessage: null, fileSize: 251904 },
  { id: 4, scheduleId: 1, scheduleName: "Weekly Reliability Summary", sentAt: "2026-02-17T06:00:00Z", recipientCount: 2, status: "failed", errorMessage: "SMTP connection timeout", fileSize: null },
  { id: 5, scheduleId: 1, scheduleName: "Weekly Reliability Summary", sentAt: "2026-02-10T06:00:00Z", recipientCount: 2, status: "delivered", errorMessage: null, fileSize: 228352 },

  // Schedule 2 — Monthly TCO
  { id: 6, scheduleId: 2, scheduleName: "Monthly TCO Report", sentAt: "2026-03-01T07:04:00Z", recipientCount: 3, status: "delivered", errorMessage: null, fileSize: 1048576 },
  { id: 7, scheduleId: 2, scheduleName: "Monthly TCO Report", sentAt: "2026-02-01T07:01:00Z", recipientCount: 3, status: "delivered", errorMessage: null, fileSize: 1024000 },
  { id: 8, scheduleId: 2, scheduleName: "Monthly TCO Report", sentAt: "2026-01-01T07:00:00Z", recipientCount: 3, status: "delivered", errorMessage: null, fileSize: 987136 },

  // Schedule 3 — Quarterly Fixed Asset Register
  { id: 9, scheduleId: 3, scheduleName: "Quarterly Fixed Asset Register", sentAt: "2026-01-01T08:05:00Z", recipientCount: 2, status: "delivered", errorMessage: null, fileSize: 2097152 },
  { id: 10, scheduleId: 3, scheduleName: "Quarterly Fixed Asset Register", sentAt: "2025-10-01T08:02:00Z", recipientCount: 2, status: "delivered", errorMessage: null, fileSize: 2031616 },

  // Schedule 4 — Daily Downtime
  { id: 11, scheduleId: 4, scheduleName: "Daily Downtime Alert", sentAt: "2026-03-12T05:00:00Z", recipientCount: 1, status: "delivered", errorMessage: null, fileSize: 12288 },
  { id: 12, scheduleId: 4, scheduleName: "Daily Downtime Alert", sentAt: "2026-03-11T05:00:00Z", recipientCount: 1, status: "delivered", errorMessage: null, fileSize: 11264 },
  { id: 13, scheduleId: 4, scheduleName: "Daily Downtime Alert", sentAt: "2026-03-10T05:00:00Z", recipientCount: 1, status: "delivered", errorMessage: null, fileSize: 13312 },
  { id: 14, scheduleId: 4, scheduleName: "Daily Downtime Alert", sentAt: "2026-03-09T05:00:00Z", recipientCount: 1, status: "failed", errorMessage: "Recipient mailbox full", fileSize: null },
  { id: 15, scheduleId: 4, scheduleName: "Daily Downtime Alert", sentAt: "2026-03-08T05:00:00Z", recipientCount: 1, status: "delivered", errorMessage: null, fileSize: 10240 },

  // Schedule 5 — Monthly Meters
  { id: 16, scheduleId: 5, scheduleName: "Monthly Meter Readings Summary", sentAt: "2026-03-01T07:32:00Z", recipientCount: 2, status: "delivered", errorMessage: null, fileSize: 348160 },
  { id: 17, scheduleId: 5, scheduleName: "Monthly Meter Readings Summary", sentAt: "2026-02-01T07:30:00Z", recipientCount: 2, status: "delivered", errorMessage: null, fileSize: 339968 },

  // Schedule 6 — Annual Lifecycle
  { id: 18, scheduleId: 6, scheduleName: "Annual Lifecycle Assessment", sentAt: "2026-01-01T09:05:00Z", recipientCount: 3, status: "delivered", errorMessage: null, fileSize: 3145728 },

  // Schedule 7 — Financial (inactive but has history)
  { id: 19, scheduleId: 7, scheduleName: "Financial Summary (INACTIVE)", sentAt: "2025-12-01T08:01:00Z", recipientCount: 1, status: "delivered", errorMessage: null, fileSize: 204800 },
  { id: 20, scheduleId: 7, scheduleName: "Financial Summary (INACTIVE)", sentAt: "2025-11-01T08:00:00Z", recipientCount: 1, status: "delivered", errorMessage: null, fileSize: 196608 },

  // Schedule 8 — Weekly TCO Digest (recent failures)
  { id: 21, scheduleId: 8, scheduleName: "Weekly TCO Digest", sentAt: "2026-03-09T07:00:00Z", recipientCount: 1, status: "failed", errorMessage: "Report generation timeout after 300s", fileSize: null },
  { id: 22, scheduleId: 8, scheduleName: "Weekly TCO Digest", sentAt: "2026-03-02T07:01:00Z", recipientCount: 1, status: "failed", errorMessage: "Report generation timeout after 300s", fileSize: null },
  { id: 23, scheduleId: 8, scheduleName: "Weekly TCO Digest", sentAt: "2026-02-23T07:00:00Z", recipientCount: 1, status: "delivered", errorMessage: null, fileSize: 512000 },
  { id: 24, scheduleId: 8, scheduleName: "Weekly TCO Digest", sentAt: "2026-02-16T07:00:00Z", recipientCount: 1, status: "delivered", errorMessage: null, fileSize: 524288 },
  { id: 25, scheduleId: 8, scheduleName: "Weekly TCO Digest", sentAt: "2026-02-09T07:00:00Z", recipientCount: 1, status: "pending", errorMessage: null, fileSize: null },
];
