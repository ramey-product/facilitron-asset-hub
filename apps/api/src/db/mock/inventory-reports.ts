/**
 * Mock inventory report provider for P1-31.
 * In-memory report generation and template management with seed data.
 */

import type {
  InventoryReport,
  ReportFilter,
  ReportRow,
  SavedReportTemplate,
  CreateReportTemplateInput,
  ListReportTemplatesQuery,
} from "@asset-hub/shared";
import type { PaginatedResult } from "../../types/providers.js";
import {
  mockReportTemplates,
  sampleUsageByPartRows,
  sampleVendorSpendRows,
  sampleUsageByLocationRows,
} from "./data/inventory-reports.js";

// Working copy for in-memory mutations
const savedTemplates = [...mockReportTemplates];
let nextTemplateId = Math.max(...savedTemplates.map((t) => t.id)) + 1;

/**
 * Generates report rows based on filter criteria.
 * Uses pre-computed sample data where available, falls back to generated data.
 */
function generateReportRows(filter: ReportFilter): ReportRow[] {
  // Use pre-computed rows for known report types
  switch (filter.reportType) {
    case "usage-by-part":
      return filterRowsByDateRange(sampleUsageByPartRows, filter);
    case "vendor-spend":
      return filterRowsByDateRange(sampleVendorSpendRows, filter);
    case "usage-by-location":
      return filterRowsByDateRange(sampleUsageByLocationRows, filter);
    default:
      return generateFallbackRows(filter);
  }
}

/**
 * Filters pre-computed rows based on the date range (simple pass-through
 * for the mock -- real implementation would query the DB).
 */
function filterRowsByDateRange(rows: ReportRow[], _filter: ReportFilter): ReportRow[] {
  // In mock mode, return all pre-computed rows since they're already
  // representative of the data shape. Real implementation would query by date.
  return [...rows];
}

/**
 * Generates fallback rows for report types without pre-computed data.
 */
function generateFallbackRows(filter: ReportFilter): ReportRow[] {
  const labelSets: Record<string, string[]> = {
    "usage-by-wo-type": [
      "Preventive Maintenance",
      "Corrective",
      "Emergency",
      "Inspection",
      "Capital Project",
    ],
    "cost-analysis": [
      "HVAC",
      "Electrical",
      "Plumbing",
      "Filters",
      "Fasteners",
      "Lighting",
      "Safety",
      "Janitorial",
    ],
  };

  const labels = labelSets[filter.reportType] ?? [
    "Category A",
    "Category B",
    "Category C",
  ];

  const groups =
    filter.groupBy === "monthly"
      ? ["Jan 2026", "Feb 2026", "Mar 2026"]
      : filter.groupBy === "quarterly"
        ? ["Q1 2026", "Q2 2026"]
        : labels; // group by the label itself for location/vendor/category

  const rows: ReportRow[] = [];
  let grandTotal = 0;

  // First pass: generate raw data
  const preRows: {
    label: string;
    group: string;
    quantity: number;
    cost: number;
  }[] = [];
  for (const label of labels) {
    for (const group of groups) {
      // Use a deterministic-ish seed based on label + group
      const seed = (label.length * 17 + group.length * 31) % 100;
      const quantity = 5 + seed + ((label.charCodeAt(0) * group.length) % 50);
      const unitCost = 5 + ((label.charCodeAt(0) + group.charCodeAt(0)) % 40);
      const cost = parseFloat((quantity * unitCost).toFixed(2));
      grandTotal += cost;
      preRows.push({ label, group, quantity, cost });
    }
  }

  // Second pass: calculate percentages
  for (const r of preRows) {
    rows.push({
      label: r.label,
      group: r.group,
      quantity: r.quantity,
      cost: r.cost,
      avgCost: parseFloat((r.cost / r.quantity).toFixed(2)),
      percentOfTotal: parseFloat(((r.cost / grandTotal) * 100).toFixed(1)),
    });
  }

  return rows;
}

export const mockInventoryReportProvider = {
  async generateReport(
    _customerID: number,
    filter: ReportFilter
  ): Promise<InventoryReport> {
    const rows = generateReportRows(filter);
    const totalQuantity = rows.reduce((s, r) => s + r.quantity, 0);
    const totalCost = parseFloat(
      rows.reduce((s, r) => s + r.cost, 0).toFixed(2)
    );

    return {
      reportType: filter.reportType,
      filter,
      generatedAt: new Date().toISOString(),
      rows,
      summary: {
        totalQuantity,
        totalCost,
        avgCost:
          totalQuantity > 0
            ? parseFloat((totalCost / totalQuantity).toFixed(2))
            : 0,
        rowCount: rows.length,
      },
    };
  },

  async listTemplates(
    customerID: number,
    query: ListReportTemplatesQuery
  ): Promise<PaginatedResult<SavedReportTemplate>> {
    let items = savedTemplates.filter((t) => t.customerID === customerID);

    // Sort: pinned first, then by updatedAt desc
    items.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return (
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    });

    const total = items.length;
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const start = (page - 1) * limit;
    items = items.slice(start, start + limit);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getTemplate(
    customerID: number,
    id: number
  ): Promise<SavedReportTemplate | null> {
    return (
      savedTemplates.find(
        (t) => t.customerID === customerID && t.id === id
      ) ?? null
    );
  },

  async createTemplate(
    customerID: number,
    input: CreateReportTemplateInput
  ): Promise<SavedReportTemplate> {
    const now = new Date().toISOString();
    const template: SavedReportTemplate = {
      id: nextTemplateId++,
      customerID,
      userId: 1, // demo user
      name: input.name,
      reportType: input.reportType,
      filter: input.filter,
      isPinned: input.isPinned ?? false,
      isPreBuilt: false,
      createdAt: now,
      updatedAt: now,
    };
    savedTemplates.push(template);
    return template;
  },

  async updateTemplate(
    customerID: number,
    id: number,
    input: Partial<CreateReportTemplateInput>
  ): Promise<SavedReportTemplate | null> {
    const idx = savedTemplates.findIndex(
      (t) => t.customerID === customerID && t.id === id
    );
    if (idx === -1) return null;

    const t = savedTemplates[idx]!;
    if (input.name !== undefined) t.name = input.name;
    if (input.reportType !== undefined) t.reportType = input.reportType;
    if (input.filter !== undefined) t.filter = input.filter;
    if (input.isPinned !== undefined) t.isPinned = input.isPinned;
    t.updatedAt = new Date().toISOString();

    return t;
  },

  async deleteTemplate(
    customerID: number,
    id: number
  ): Promise<boolean> {
    const idx = savedTemplates.findIndex(
      (t) => t.customerID === customerID && t.id === id
    );
    if (idx === -1) return false;
    savedTemplates.splice(idx, 1);
    return true;
  },
};
