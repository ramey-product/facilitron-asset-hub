/**
 * Asset cost types shared between API and web app.
 */

export interface CostSummary {
  assetId: number;
  assetName: string;
  lifetimeTotal: number;
  yearToDate: number;
  averagePerWorkOrder: number;
  highestWorkOrderCost: number;
  workOrderCount: number;
  laborTotal: number;
  partsTotal: number;
  vendorTotal: number;
}

export interface MonthlyCostBreakdown {
  month: string; // "YYYY-MM" format
  labor: number;
  parts: number;
  vendor: number;
  total: number;
}

export interface TopCostAsset {
  assetId: number;
  assetName: string;
  propertyName: string | null;
  categoryName: string | null;
  lifetimeCost: number;
  workOrderCount: number;
}
