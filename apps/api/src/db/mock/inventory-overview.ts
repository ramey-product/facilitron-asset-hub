/**
 * Mock provider for P1-33 Inventory Overview / Dashboard.
 * In-memory portfolio metrics, health score, and cross-module search.
 */

import type {
  InventoryOverviewMetrics,
  InventoryHealthScore,
  CrossModuleSearchResult,
} from "@asset-hub/shared";

const mockAssetResults: CrossModuleSearchResult[] = [
  { type: "asset", id: 1, name: "Carrier WeatherMaster 50XC", identifier: "AST-0001", category: "HVAC", status: "Active", detail: "Rooftop Unit - Building A" },
  { type: "asset", id: 2, name: "Weil-McLain EGH-95", identifier: "AST-0002", category: "HVAC", status: "Active", detail: "Boiler - Mechanical Room B" },
  { type: "asset", id: 3, name: "Caterpillar D150", identifier: "AST-0003", category: "Electrical", status: "Active", detail: "Emergency Generator - Utility Yard" },
  { type: "asset", id: 4, name: "Honeywell Notifier NFS2-3030", identifier: "AST-0004", category: "Fire Safety", status: "Under Maintenance", detail: "Fire Alarm Panel - Main Lobby" },
  { type: "asset", id: 5, name: "Otis Gen2 Comfort", identifier: "AST-0005", category: "Vertical Transport", status: "Active", detail: "Elevator - Tower 1" },
];

const mockConsumableResults: CrossModuleSearchResult[] = [
  { type: "consumable", id: 21, name: "MERV 8 Filter (20x25x1)", identifier: "FL-MERV8-20X25", category: "Filters", status: "In Stock", detail: "Qty: 200 | Reorder at: 50" },
  { type: "consumable", id: 1, name: "20A Circuit Breaker", identifier: "EL-BRK-20A", category: "Electrical", status: "In Stock", detail: "Qty: 45 | Reorder at: 20" },
  { type: "consumable", id: 14, name: "V-Belt A48", identifier: "HV-BELT-A48", category: "HVAC", status: "Low Stock", detail: "Qty: 8 | Reorder at: 10" },
  { type: "consumable", id: 31, name: "LED T8 Tube (4ft, 18W)", identifier: "LT-LED-T8-4FT", category: "Lighting", status: "In Stock", detail: "Qty: 68 | Reorder at: 20" },
  { type: "consumable", id: 40, name: "Trash Bag 44 Gallon (100ct)", identifier: "JN-TRASH-44GAL", category: "Janitorial", status: "In Stock", detail: "Qty: 22 | Reorder at: 10" },
];

export const mockInventoryOverviewProvider = {
  async getOverviewMetrics(customerID: number): Promise<InventoryOverviewMetrics> {
    if (customerID !== 1) {
      return { totalAssetValue: 0, assetCount: 0, consumableCount: 0, consumableValue: 0, portfolioValue: 0, healthScore: 0 };
    }

    return {
      totalAssetValue: 2450000,
      assetCount: 25,
      consumableCount: 45,
      consumableValue: 87450,
      portfolioValue: 2537450,
      healthScore: 82,
    };
  },

  async getHealthScore(customerID: number): Promise<InventoryHealthScore> {
    if (customerID !== 1) {
      return { overall: 0, assetConditionScore: 0, stockAdequacyScore: 0, maintenanceComplianceScore: 0, trend: "stable", previousScore: 0 };
    }

    return {
      overall: 82,
      assetConditionScore: 78,
      stockAdequacyScore: 85,
      maintenanceComplianceScore: 84,
      trend: "improving",
      previousScore: 79,
    };
  },

  async search(
    customerID: number,
    query: string,
    type: "both" | "assets" | "consumables" = "both"
  ): Promise<CrossModuleSearchResult[]> {
    if (customerID !== 1) return [];

    const q = query.toLowerCase();
    let results: CrossModuleSearchResult[] = [];

    if (type === "both" || type === "assets") {
      results = results.concat(
        mockAssetResults.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.identifier.toLowerCase().includes(q) ||
            r.category.toLowerCase().includes(q) ||
            r.detail.toLowerCase().includes(q)
        )
      );
    }

    if (type === "both" || type === "consumables") {
      results = results.concat(
        mockConsumableResults.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.identifier.toLowerCase().includes(q) ||
            r.category.toLowerCase().includes(q)
        )
      );
    }

    return results;
  },
};
