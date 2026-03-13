/**
 * Inventory reporting types shared between API and web app.
 * P1-31: Inventory Reports
 */

export type InventoryReportType =
  | "usage-by-part"
  | "usage-by-location"
  | "usage-by-wo-type"
  | "cost-analysis"
  | "vendor-spend";

export type ReportGroupBy = "monthly" | "quarterly" | "category" | "location" | "vendor";

export type ReportDatePreset = "30d" | "90d" | "ytd" | "12m" | "custom";

export interface ReportFilter {
  reportType: InventoryReportType;
  dateStart: string;
  dateEnd: string;
  datePreset?: ReportDatePreset;
  groupBy: ReportGroupBy;
  partId?: number;
  locationId?: number;
  vendorId?: number;
  categoryId?: number;
}

export interface ReportRow {
  label: string;
  group: string;
  quantity: number;
  cost: number;
  avgCost: number;
  percentOfTotal: number;
}

export interface ReportSummary {
  totalQuantity: number;
  totalCost: number;
  avgCost: number;
  rowCount: number;
}

export interface InventoryReport {
  reportType: InventoryReportType;
  filter: ReportFilter;
  generatedAt: string;
  rows: ReportRow[];
  summary: ReportSummary;
}

export interface SavedReportTemplate {
  id: number;
  customerID: number;
  userId: number | null; // null = pre-built
  name: string;
  reportType: InventoryReportType;
  filter: Omit<ReportFilter, "reportType">;
  isPinned: boolean;
  isPreBuilt: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportTemplateInput {
  name: string;
  reportType: InventoryReportType;
  filter: Omit<ReportFilter, "reportType">;
  isPinned?: boolean;
}

export interface ListReportTemplatesQuery {
  page?: number;
  limit?: number;
}
