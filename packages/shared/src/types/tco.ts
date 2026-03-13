/**
 * Asset Cost Rollup / TCO types shared between API and web app.
 * P1-31: TCO calculation, repair-vs-replace, comparison view
 */

export type TCORecommendation = "green" | "yellow" | "red";

export interface AssetTCO {
  assetId: number;
  assetName: string;
  categoryName: string | null;
  propertyName: string | null;
  purchaseCost: number;
  maintenanceCost: number; // total labor + WO costs
  partsCost: number; // parts consumed via WOs
  laborCost: number;
  downtimeCost: number; // estimated cost of downtime hours
  depreciationCost: number; // accumulated depreciation
  totalTco: number; // sum of all costs
  annualTco: number; // totalTco / ageYears
  replacementCost: number; // current replacement cost estimate
  tcoRatio: number; // totalTco / replacementCost (0.0 - 1.0+)
  recommendation: TCORecommendation; // green < 0.6, yellow 0.6-0.8, red >= 0.8
  ageYears: number;
  acquisitionDate: string | null;
  calculatedAt: string;
}

export interface TCOSummary {
  totalTco: number;
  avgTcoRatio: number;
  assetsNeedingReplacement: number; // count where recommendation = "red"
  assetCount: number;
}

export interface TCOComparison {
  assets: AssetTCO[];
  summary: TCOSummary;
}

export interface RepairVsReplaceRecord {
  assetId: number;
  assetName: string;
  categoryName: string | null;
  propertyName: string | null;
  ageYears: number;
  totalTco: number;
  replacementCost: number;
  tcoRatio: number;
  usefulLifeRemaining: number | null; // years
  lastMaintenanceDate: string | null;
  recommendation: TCORecommendation;
}

// ---- Inputs ----

export interface TCOQuery {
  assetIds?: number[];
  categoryId?: number;
  propertyId?: number;
  minTcoRatio?: number;
  sortBy?: "tcoRatio" | "totalTco" | "annualTco" | "ageYears";
  sortOrder?: "asc" | "desc";
}
