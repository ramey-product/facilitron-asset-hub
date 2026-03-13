/**
 * Report schedule and delivery types shared between API and web app.
 * P1-34: Scheduled Auto-Reports
 */

export type ReportType =
  | "reliability"
  | "tco"
  | "financial"
  | "fixed-asset-register"
  | "downtime"
  | "meter-readings"
  | "lifecycle";

export type ReportFormat = "pdf" | "csv" | "excel";

export type ReportCadence = "daily" | "weekly" | "monthly" | "quarterly";

export type ReportDateRange = "7d" | "30d" | "90d" | "6m" | "12m";

export type ReportScheduleStatus = "scheduled" | "running" | "failed" | "delivered";

export type ReportDeliveryStatus = "delivered" | "failed" | "pending";

export interface ReportSchedule {
  id: number;
  name: string;
  reportType: ReportType;
  format: ReportFormat;
  cadence: ReportCadence;
  dateRange: ReportDateRange;
  recipients: string[];
  isActive: boolean;
  lastSentAt: string | null;
  nextSendAt: string | null;
  createdAt: string;
  createdBy: string;
  status: ReportScheduleStatus;
}

export interface ReportDelivery {
  id: number;
  scheduleId: number;
  scheduleName: string;
  sentAt: string;
  recipientCount: number;
  status: ReportDeliveryStatus;
  errorMessage: string | null;
  fileSize: number | null; // bytes
}

export interface CreateReportScheduleInput {
  name: string;
  reportType: ReportType;
  format: ReportFormat;
  cadence: ReportCadence;
  dateRange: ReportDateRange;
  recipients: string[];
  isActive?: boolean;
}

export interface UpdateReportScheduleInput {
  name?: string;
  reportType?: ReportType;
  format?: ReportFormat;
  cadence?: ReportCadence;
  dateRange?: ReportDateRange;
  recipients?: string[];
  isActive?: boolean;
}

export interface ListReportSchedulesQuery {
  page?: number;
  limit?: number;
  isActive?: boolean;
  reportType?: ReportType;
}

export interface ListReportDeliveriesQuery {
  page?: number;
  limit?: number;
  scheduleId?: number;
  status?: ReportDeliveryStatus;
}

export interface ReportPreview {
  scheduleId: number;
  scheduleName: string;
  reportType: ReportType;
  generatedAt: string;
  rowCount: number;
  sampleRows: Record<string, string | number | null>[];
  columns: string[];
}
