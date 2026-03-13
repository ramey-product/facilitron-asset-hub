/**
 * Mock provider for P1-34 Scheduled Auto-Reports.
 * In-memory schedule and delivery management.
 */

import type {
  ReportSchedule,
  ReportDelivery,
  ReportPreview,
  CreateReportScheduleInput,
  UpdateReportScheduleInput,
  ListReportSchedulesQuery,
  ListReportDeliveriesQuery,
  ReportCadence,
} from "@asset-hub/shared";
import type { PaginatedResult } from "../../types/providers.js";
import { mockReportSchedules, mockReportDeliveries } from "./data/reports.js";

// Working copies
const schedules: ReportSchedule[] = mockReportSchedules.map((s) => ({
  ...s,
  recipients: [...s.recipients],
}));
const deliveries: ReportDelivery[] = mockReportDeliveries.map((d) => ({ ...d }));

let nextScheduleId = Math.max(...schedules.map((s) => s.id)) + 1;
let nextDeliveryId = Math.max(...deliveries.map((d) => d.id)) + 1;

function calcNextSendAt(cadence: ReportCadence, from?: string): string {
  const base = from ? new Date(from) : new Date();
  switch (cadence) {
    case "daily":
      base.setDate(base.getDate() + 1);
      break;
    case "weekly":
      base.setDate(base.getDate() + 7);
      break;
    case "monthly":
      base.setMonth(base.getMonth() + 1);
      break;
    case "quarterly":
      base.setMonth(base.getMonth() + 3);
      break;
  }
  return base.toISOString();
}

export const mockReportsProvider = {
  async listSchedules(
    _customerID: number,
    query: Required<Pick<ListReportSchedulesQuery, "page" | "limit">> &
      Omit<ListReportSchedulesQuery, "page" | "limit">
  ): Promise<PaginatedResult<ReportSchedule>> {
    let items = [...schedules];

    if (query.isActive !== undefined) {
      items = items.filter((s) => s.isActive === query.isActive);
    }
    if (query.reportType) {
      items = items.filter((s) => s.reportType === query.reportType);
    }

    items.sort((a, b) => a.name.localeCompare(b.name));

    const total = items.length;
    const { page, limit } = query;
    const start = (page - 1) * limit;
    items = items.slice(start, start + limit);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getSchedule(
    _customerID: number,
    id: number
  ): Promise<ReportSchedule | null> {
    return schedules.find((s) => s.id === id) ?? null;
  },

  async createSchedule(
    _customerID: number,
    input: CreateReportScheduleInput
  ): Promise<ReportSchedule> {
    const now = new Date().toISOString();
    const schedule: ReportSchedule = {
      id: nextScheduleId++,
      name: input.name,
      reportType: input.reportType,
      format: input.format,
      cadence: input.cadence,
      dateRange: input.dateRange,
      recipients: [...input.recipients],
      isActive: input.isActive ?? true,
      lastSentAt: null,
      nextSendAt: calcNextSendAt(input.cadence),
      createdAt: now,
      createdBy: "demo.user",
      status: "scheduled",
    };
    schedules.push(schedule);
    return schedule;
  },

  async updateSchedule(
    _customerID: number,
    id: number,
    input: UpdateReportScheduleInput
  ): Promise<ReportSchedule | null> {
    const idx = schedules.findIndex((s) => s.id === id);
    if (idx === -1) return null;

    const s = schedules[idx]!;
    if (input.name !== undefined) s.name = input.name;
    if (input.reportType !== undefined) s.reportType = input.reportType;
    if (input.format !== undefined) s.format = input.format;
    if (input.cadence !== undefined) {
      s.cadence = input.cadence;
      s.nextSendAt = calcNextSendAt(input.cadence);
    }
    if (input.dateRange !== undefined) s.dateRange = input.dateRange;
    if (input.recipients !== undefined) s.recipients = [...input.recipients];
    if (input.isActive !== undefined) {
      s.isActive = input.isActive;
      if (!input.isActive) s.nextSendAt = null;
    }

    return s;
  },

  async deleteSchedule(
    _customerID: number,
    id: number
  ): Promise<boolean> {
    const idx = schedules.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    schedules[idx]!.isActive = false;
    schedules[idx]!.nextSendAt = null;
    return true;
  },

  async listDeliveries(
    _customerID: number,
    query: Required<Pick<ListReportDeliveriesQuery, "page" | "limit">> &
      Omit<ListReportDeliveriesQuery, "page" | "limit">
  ): Promise<PaginatedResult<ReportDelivery>> {
    let items = [...deliveries];

    if (query.scheduleId) {
      items = items.filter((d) => d.scheduleId === query.scheduleId);
    }
    if (query.status) {
      items = items.filter((d) => d.status === query.status);
    }

    items.sort((a, b) => b.sentAt.localeCompare(a.sentAt));

    const total = items.length;
    const { page, limit } = query;
    const start = (page - 1) * limit;
    items = items.slice(start, start + limit);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async retryDelivery(
    _customerID: number,
    deliveryId: number
  ): Promise<ReportDelivery | null> {
    const idx = deliveries.findIndex((d) => d.id === deliveryId);
    if (idx === -1) return null;

    deliveries[idx]!.status = "pending";
    deliveries[idx]!.errorMessage = null;
    return deliveries[idx]!;
  },

  async previewReport(
    _customerID: number,
    scheduleId: number
  ): Promise<ReportPreview | null> {
    const schedule = schedules.find((s) => s.id === scheduleId);
    if (!schedule) return null;

    const columns: Record<string, string[]> = {
      reliability: ["Asset", "Category", "MTBF (days)", "MTTR (hours)", "Availability %", "Downtime Events"],
      tco: ["Asset", "Purchase Cost", "Maintenance YTD", "Labor YTD", "Parts YTD", "TCO"],
      financial: ["Asset", "Book Value", "Depreciation YTD", "Net Book Value", "Category"],
      "fixed-asset-register": ["Asset ID", "Asset Name", "Category", "Location", "Purchase Date", "Original Cost", "Net Book Value"],
      downtime: ["Asset", "Event Date", "Duration (hrs)", "Cause", "Resolution", "Impact"],
      "meter-readings": ["Asset", "Meter Type", "Current Reading", "Last Reading", "Date", "Delta"],
      lifecycle: ["Asset", "Current Stage", "Stage Entry Date", "Expected Max Days", "Days In Stage", "Status"],
    };

    const cols = columns[schedule.reportType] ?? ["Asset", "Value", "Date"];

    const sampleRows: Record<string, string | number | null>[] = [];
    for (let i = 1; i <= 5; i++) {
      const row: Record<string, string | number | null> = {};
      for (const col of cols) {
        if (col.includes("Cost") || col.includes("Value") || col.includes("TCO")) {
          row[col] = Math.round(Math.random() * 50000 + 5000);
        } else if (col.includes("%")) {
          row[col] = Math.round(Math.random() * 20 + 80);
        } else if (col.includes("hrs") || col.includes("hours") || col.includes("MTTR")) {
          row[col] = Math.round(Math.random() * 48 + 1);
        } else if (col.includes("days") || col.includes("Days")) {
          row[col] = Math.round(Math.random() * 365 + 30);
        } else if (col === "Asset" || col === "Asset Name") {
          row[col] = ["RTU-01", "Boiler B-01", "Chiller CH-01", "AHU-01", "Generator EG-01"][i - 1] ?? `Asset ${i}`;
        } else if (col === "Category") {
          row[col] = ["HVAC", "HVAC", "HVAC", "HVAC", "Electrical"][i - 1] ?? "HVAC";
        } else if (col === "Date" || col.includes("Date")) {
          row[col] = `2026-0${i}-15`;
        } else if (col === "Status") {
          row[col] = i <= 3 ? "OK" : "Overdue";
        } else {
          row[col] = `Value ${i}`;
        }
      }
      sampleRows.push(row);
    }

    return {
      scheduleId,
      scheduleName: schedule.name,
      reportType: schedule.reportType,
      generatedAt: new Date().toISOString(),
      rowCount: Math.round(Math.random() * 80 + 20),
      sampleRows,
      columns: cols,
    };
  },

  // Add a new synthetic delivery record (for preview/run simulation)
  async recordDelivery(
    scheduleId: number,
    status: "delivered" | "failed",
    fileSize: number | null = null,
    errorMessage: string | null = null
  ): Promise<ReportDelivery> {
    const schedule = schedules.find((s) => s.id === scheduleId);
    const delivery: ReportDelivery = {
      id: nextDeliveryId++,
      scheduleId,
      scheduleName: schedule?.name ?? `Schedule ${scheduleId}`,
      sentAt: new Date().toISOString(),
      recipientCount: schedule?.recipients.length ?? 1,
      status,
      errorMessage,
      fileSize,
    };
    deliveries.unshift(delivery);
    return delivery;
  },
};
