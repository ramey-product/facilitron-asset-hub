/**
 * Depreciation types shared between API and web app.
 * P1-32: Depreciation engine, schedule view, financial dashboard
 */

export type DepreciationMethod = "straight-line" | "declining-balance";

export interface AssetDepreciation {
  assetId: number;
  assetName: string;
  categoryName: string | null;
  method: DepreciationMethod;
  usefulLifeYears: number;
  salvageValue: number;
  purchaseCost: number;
  annualDepreciation: number;
  accumulatedDepreciation: number;
  currentBookValue: number;
  yearsElapsed: number;
  isFullyDepreciated: boolean;
  acquisitionDate: string | null;
  dateCalculated: string;
}

export interface DepreciationScheduleRow {
  year: number; // fiscal year (e.g., 2024)
  yearNumber: number; // 1, 2, 3, ... usefulLifeYears
  beginningValue: number;
  annualDepreciation: number;
  accumulatedDepreciation: number;
  endingValue: number;
  isPast: boolean; // year <= current year
  isCurrent: boolean;
}

export interface FixedAssetRegisterRow {
  assetId: number;
  assetName: string;
  categoryName: string | null;
  propertyName: string | null;
  acquisitionDate: string | null;
  usefulLife: number;
  method: DepreciationMethod;
  originalCost: number;
  annualDepreciation: number;
  accumulatedDepreciation: number;
  currentBookValue: number;
  salvageValue: number;
  yearsElapsed: number;
  isFullyDepreciated: boolean;
}

export interface DepreciationByCategory {
  categoryName: string;
  originalCost: number;
  accumulatedDepreciation: number;
  bookValue: number;
  count: number;
}

export interface DepreciationSummary {
  totalOriginalCost: number;
  totalAccumulatedDepreciation: number;
  totalBookValue: number;
  assetCount: number;
  fullyDepreciatedCount: number;
  byCategory: DepreciationByCategory[];
}
