/**
 * Mock provider for P1-32 Consumables Dashboard.
 * In-memory KPI, trend, and activity data.
 */

import type {
  ConsumableDashboardKPIs,
  UsageTrend,
  RecentActivity,
} from "@asset-hub/shared";

export const mockConsumablesDashboardProvider = {
  async getKPIs(customerID: number): Promise<ConsumableDashboardKPIs> {
    if (customerID !== 1) {
      return { totalParts: 0, totalValue: 0, belowReorder: 0, zeroStock: 0, categoryBreakdown: [] };
    }

    return {
      totalParts: 45,
      totalValue: 87450.0,
      belowReorder: 7,
      zeroStock: 2,
      categoryBreakdown: [
        { category: "HVAC", count: 12, value: 28500, percentage: 32.6 },
        { category: "Electrical", count: 10, value: 18200, percentage: 20.8 },
        { category: "Plumbing", count: 7, value: 12800, percentage: 14.6 },
        { category: "Lighting", count: 6, value: 9600, percentage: 11.0 },
        { category: "Janitorial", count: 5, value: 8350, percentage: 9.5 },
        { category: "Fire Safety", count: 3, value: 6500, percentage: 7.4 },
        { category: "Fasteners", count: 2, value: 3500, percentage: 4.0 },
      ],
    };
  },

  async getUsageTrends(customerID: number): Promise<UsageTrend[]> {
    if (customerID !== 1) return [];

    const months = [
      "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09",
      "2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03",
    ];

    return months.map((month) => ({
      month,
      parts: [
        { partId: 21, partName: "MERV 8 Filter", quantity: Math.round(Math.random() * 20 + 10) },
        { partId: 31, partName: "LED T8 Tube", quantity: Math.round(Math.random() * 15 + 5) },
        { partId: 1, partName: "20A Circuit Breaker", quantity: Math.round(Math.random() * 8 + 3) },
        { partId: 40, partName: "Trash Bags (44gal)", quantity: Math.round(Math.random() * 12 + 6) },
      ],
      totalCost: Math.round(Math.random() * 5000 + 3000),
    }));
  },

  async getRecentActivity(customerID: number): Promise<RecentActivity[]> {
    if (customerID !== 1) return [];

    return [
      { id: 1, eventType: "receipt", partId: 21, partName: "MERV 8 Filter (20x25x1)", quantity: 50, amount: 425.0, user: "Maria Garcia", timestamp: "2026-03-13T10:30:00Z", reference: "PO-2026-0018" },
      { id: 2, eventType: "consumption", partId: 1, partName: "20A Circuit Breaker", quantity: 5, amount: 47.5, user: "John Smith", timestamp: "2026-03-13T09:00:00Z", reference: "WO-2026-0102" },
      { id: 3, eventType: "reorder-alert", partId: 14, partName: "V-Belt A48", quantity: 4, amount: null, user: "System", timestamp: "2026-03-12T22:00:00Z", reference: null },
      { id: 4, eventType: "transfer", partId: 31, partName: "LED T8 Tube (4ft, 18W)", quantity: 12, amount: 107.88, user: "Alice Chen", timestamp: "2026-03-12T16:00:00Z", reference: "TRF-2026-0005" },
      { id: 5, eventType: "adjustment", partId: 40, partName: "Trash Bag 44 Gallon (100ct)", quantity: -3, amount: -27.0, user: "Bob Wilson", timestamp: "2026-03-12T14:00:00Z", reference: null },
      { id: 6, eventType: "receipt", partId: 8, partName: '1" Ball Valve (Brass)', quantity: 10, amount: 189.0, user: "Alice Chen", timestamp: "2026-03-12T13:00:00Z", reference: "PO-2026-0019" },
      { id: 7, eventType: "consumption", partId: 31, partName: "LED T8 Tube (4ft, 18W)", quantity: 8, amount: 71.92, user: "Maria Garcia", timestamp: "2026-03-12T08:45:00Z", reference: "WO-2026-0105" },
      { id: 8, eventType: "reorder-alert", partId: 5, partName: "Single Pole Switch (15A)", quantity: 6, amount: null, user: "System", timestamp: "2026-03-11T22:00:00Z", reference: null },
      { id: 9, eventType: "consumption", partId: 3, partName: "Duplex Outlet (20A)", quantity: 6, amount: 43.5, user: "Bob Wilson", timestamp: "2026-03-11T10:00:00Z", reference: "WO-2026-0110" },
      { id: 10, eventType: "receipt", partId: 1, partName: "20A Circuit Breaker", quantity: 20, amount: 190.0, user: "Maria Garcia", timestamp: "2026-03-10T09:00:00Z", reference: "PO-2026-0017" },
    ];
  },
};
