/**
 * Inventory dashboard types shared between API and web app.
 * P1-33: Inventory Dashboard
 */

export interface InventoryOverviewMetrics {
  totalAssetValue: number;
  assetCount: number;
  consumableCount: number;
  consumableValue: number;
  portfolioValue: number;
  healthScore: number;
}

export interface AgeDistribution {
  range: string; // e.g. "0-2 years"
  count: number;
}

export interface StockHealthBreakdown {
  adequate: number;
  low: number;
  critical: number;
}

export interface CrossModuleSearchResult {
  type: "asset" | "consumable";
  id: number;
  name: string;
  identifier: string; // asset tag or SKU
  category: string;
  status: string;
  detail: string;
}

export type HealthScoreTrend = "improving" | "stable" | "declining";

export interface InventoryHealthScore {
  overall: number; // 0-100
  assetConditionScore: number;
  stockAdequacyScore: number;
  maintenanceComplianceScore: number;
  trend: HealthScoreTrend;
  previousScore: number;
}
