/**
 * Mock seed data for P1-31 Inventory Reports.
 * Pre-built and user-saved report templates, plus helper data for report generation.
 */

import type { SavedReportTemplate, ReportRow } from "@asset-hub/shared";

// Helper to get ISO date string N days ago
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
}

// Date helpers for filter defaults
function monthsAgo(n: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function startOfYear(): string {
  const d = new Date();
  d.setMonth(0, 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function today(): string {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

// --- Pre-built Templates (userId: null, isPreBuilt: true) ---

export const mockReportTemplates: SavedReportTemplate[] = [
  {
    id: 1,
    customerID: 1,
    userId: null,
    name: "Monthly Consumption Summary",
    reportType: "usage-by-part",
    filter: {
      dateStart: monthsAgo(12),
      dateEnd: today(),
      datePreset: "12m",
      groupBy: "monthly",
    },
    isPinned: true,
    isPreBuilt: true,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(90),
  },
  {
    id: 2,
    customerID: 1,
    userId: null,
    name: "Vendor Spend Analysis",
    reportType: "vendor-spend",
    filter: {
      dateStart: startOfYear(),
      dateEnd: today(),
      datePreset: "ytd",
      groupBy: "quarterly",
    },
    isPinned: true,
    isPreBuilt: true,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(90),
  },
  {
    id: 3,
    customerID: 1,
    userId: null,
    name: "Low Stock Alert Report",
    reportType: "usage-by-location",
    filter: {
      dateStart: monthsAgo(1),
      dateEnd: today(),
      datePreset: "30d",
      groupBy: "location",
    },
    isPinned: false,
    isPreBuilt: true,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(90),
  },

  // --- User-saved Templates (userId: 1) ---
  {
    id: 4,
    customerID: 1,
    userId: 1,
    name: "HVAC Parts Usage - Quarterly",
    reportType: "usage-by-part",
    filter: {
      dateStart: monthsAgo(3),
      dateEnd: today(),
      datePreset: "90d",
      groupBy: "monthly",
      categoryId: 3,
    },
    isPinned: true,
    isPreBuilt: false,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(10),
  },
  {
    id: 5,
    customerID: 1,
    userId: 1,
    name: "Grainger Cost Analysis",
    reportType: "cost-analysis",
    filter: {
      dateStart: startOfYear(),
      dateEnd: today(),
      datePreset: "ytd",
      groupBy: "vendor",
      vendorId: 1,
    },
    isPinned: false,
    isPreBuilt: false,
    createdAt: daysAgo(15),
    updatedAt: daysAgo(15),
  },
];

// --- Sample report data generators ---

/**
 * Pre-computed sample report rows for the "usage-by-part" report type.
 * The mock provider combines these with live filter logic.
 */
export const sampleUsageByPartRows: ReportRow[] = [
  { label: "MERV 8 Filter (20x25x1)", group: "Jan 2026", quantity: 36, cost: 198.00, avgCost: 5.50, percentOfTotal: 14.2 },
  { label: "MERV 8 Filter (20x25x1)", group: "Feb 2026", quantity: 48, cost: 264.00, avgCost: 5.50, percentOfTotal: 16.8 },
  { label: "MERV 8 Filter (20x25x1)", group: "Mar 2026", quantity: 24, cost: 132.00, avgCost: 5.50, percentOfTotal: 10.5 },
  { label: "20A Circuit Breaker", group: "Jan 2026", quantity: 8, cost: 68.00, avgCost: 8.50, percentOfTotal: 4.2 },
  { label: "20A Circuit Breaker", group: "Feb 2026", quantity: 12, cost: 102.00, avgCost: 8.50, percentOfTotal: 6.5 },
  { label: "20A Circuit Breaker", group: "Mar 2026", quantity: 6, cost: 51.00, avgCost: 8.50, percentOfTotal: 3.1 },
  { label: "LED T8 Tube (4ft, 18W)", group: "Jan 2026", quantity: 20, cost: 159.80, avgCost: 7.99, percentOfTotal: 8.3 },
  { label: "LED T8 Tube (4ft, 18W)", group: "Feb 2026", quantity: 16, cost: 127.84, avgCost: 7.99, percentOfTotal: 7.0 },
  { label: "LED T8 Tube (4ft, 18W)", group: "Mar 2026", quantity: 12, cost: 95.88, avgCost: 7.99, percentOfTotal: 5.2 },
  { label: "V-Belt A48", group: "Jan 2026", quantity: 4, cost: 45.00, avgCost: 11.25, percentOfTotal: 2.1 },
  { label: "V-Belt A48", group: "Feb 2026", quantity: 6, cost: 67.50, avgCost: 11.25, percentOfTotal: 3.5 },
  { label: "V-Belt A48", group: "Mar 2026", quantity: 2, cost: 22.50, avgCost: 11.25, percentOfTotal: 1.2 },
  { label: "Universal Flush Valve Kit", group: "Jan 2026", quantity: 6, cost: 74.94, avgCost: 12.49, percentOfTotal: 3.2 },
  { label: "Universal Flush Valve Kit", group: "Feb 2026", quantity: 4, cost: 49.96, avgCost: 12.49, percentOfTotal: 2.5 },
  { label: "Universal Flush Valve Kit", group: "Mar 2026", quantity: 8, cost: 99.92, avgCost: 12.49, percentOfTotal: 4.5 },
];

/**
 * Pre-computed sample rows for "vendor-spend" report type.
 */
export const sampleVendorSpendRows: ReportRow[] = [
  { label: "Grainger", group: "Q1 2026", quantity: 145, cost: 4250.75, avgCost: 29.32, percentOfTotal: 32.5 },
  { label: "Grainger", group: "Q2 2026", quantity: 98, cost: 2890.50, avgCost: 29.49, percentOfTotal: 22.1 },
  { label: "Ferguson Supply", group: "Q1 2026", quantity: 82, cost: 1845.30, avgCost: 22.50, percentOfTotal: 14.1 },
  { label: "Ferguson Supply", group: "Q2 2026", quantity: 65, cost: 1520.00, avgCost: 23.38, percentOfTotal: 11.6 },
  { label: "Johnstone Supply", group: "Q1 2026", quantity: 110, cost: 3120.45, avgCost: 28.37, percentOfTotal: 23.9 },
  { label: "Johnstone Supply", group: "Q2 2026", quantity: 72, cost: 1980.20, avgCost: 27.50, percentOfTotal: 15.2 },
  { label: "Fastenal", group: "Q1 2026", quantity: 45, cost: 680.50, avgCost: 15.12, percentOfTotal: 5.2 },
  { label: "Fastenal", group: "Q2 2026", quantity: 30, cost: 445.00, avgCost: 14.83, percentOfTotal: 3.4 },
  { label: "HD Supply", group: "Q1 2026", quantity: 55, cost: 1450.00, avgCost: 26.36, percentOfTotal: 11.1 },
  { label: "HD Supply", group: "Q2 2026", quantity: 38, cost: 990.00, avgCost: 26.05, percentOfTotal: 7.6 },
];

/**
 * Pre-computed sample rows for "usage-by-location" report type.
 */
export const sampleUsageByLocationRows: ReportRow[] = [
  { label: "Main Warehouse", group: "Main Warehouse", quantity: 185, cost: 4520.30, avgCost: 24.43, percentOfTotal: 42.5 },
  { label: "North Facility", group: "North Facility", quantity: 95, cost: 2150.80, avgCost: 22.64, percentOfTotal: 21.8 },
  { label: "South Facility", group: "South Facility", quantity: 72, cost: 1680.50, avgCost: 23.34, percentOfTotal: 16.5 },
  { label: "East Campus", group: "East Campus", quantity: 55, cost: 1320.00, avgCost: 24.00, percentOfTotal: 12.6 },
  { label: "Mobile Unit A", group: "Mobile Unit A", quantity: 28, cost: 680.40, avgCost: 24.30, percentOfTotal: 6.4 },
];
