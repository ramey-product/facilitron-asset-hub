/**
 * Mock provider for P1-32 Depreciation.
 */

import type {
  AssetDepreciation,
  DepreciationScheduleRow,
  FixedAssetRegisterRow,
  DepreciationSummary,
  DepreciationByCategory,
} from "@asset-hub/shared";
import { mockDepreciationRecords } from "./data/depreciation.js";

const records: AssetDepreciation[] = mockDepreciationRecords.map((r) => ({ ...r }));

const CURRENT_YEAR = 2026;
const PROPERTY_MAP: Record<number, string> = {
  1: "Main Campus", 2: "Main Campus", 3: "Main Campus", 4: "North Building", 5: "Main Campus",
  6: "Main Campus", 7: "Main Campus", 8: "Warehouse", 9: "Warehouse",
  10: "Main Campus", 11: "Main Campus", 12: "Warehouse", 13: "Main Campus",
  14: "Main Campus", 15: "South Wing", 16: "South Wing", 17: "North Building",
  18: "North Building", 19: "East Campus", 20: "North Building", 21: "Warehouse",
  22: "Main Campus", 23: "Warehouse", 24: "East Campus", 25: "Main Campus",
};

function buildSchedule(record: AssetDepreciation): DepreciationScheduleRow[] {
  const acqYear = record.acquisitionDate
    ? parseInt(record.acquisitionDate.split("-")[0]!)
    : CURRENT_YEAR - record.yearsElapsed;

  const rows: DepreciationScheduleRow[] = [];
  let bookValue = record.purchaseCost;
  let accumulated = 0;

  for (let yearNum = 1; yearNum <= record.usefulLifeYears; yearNum++) {
    const calYear = acqYear + yearNum - 1;
    let annualDep: number;

    if (record.method === "straight-line") {
      annualDep = Math.round(((record.purchaseCost - record.salvageValue) / record.usefulLifeYears) * 100) / 100;
    } else {
      // 200% declining balance
      const rate = 2 / record.usefulLifeYears;
      annualDep = Math.round(Math.min(bookValue * rate, bookValue - record.salvageValue) * 100) / 100;
    }

    annualDep = Math.max(0, annualDep);
    const endingValue = Math.max(Math.round((bookValue - annualDep) * 100) / 100, record.salvageValue);
    accumulated = Math.round((accumulated + annualDep) * 100) / 100;

    rows.push({
      year: calYear,
      yearNumber: yearNum,
      beginningValue: Math.round(bookValue * 100) / 100,
      annualDepreciation: annualDep,
      accumulatedDepreciation: accumulated,
      endingValue,
      isPast: calYear < CURRENT_YEAR,
      isCurrent: calYear === CURRENT_YEAR,
    });

    bookValue = endingValue;
    if (bookValue <= record.salvageValue) break;
  }

  return rows;
}

export const mockDepreciationProvider = {
  async getAssetDepreciation(_customerID: number, assetId: number): Promise<AssetDepreciation | null> {
    return records.find((r) => r.assetId === assetId) ?? null;
  },

  async getDepreciationSchedule(_customerID: number, assetId: number): Promise<DepreciationScheduleRow[]> {
    const record = records.find((r) => r.assetId === assetId);
    if (!record) return [];
    return buildSchedule(record);
  },

  async getFixedAssetRegister(_customerID: number): Promise<FixedAssetRegisterRow[]> {
    return records.map((r) => ({
      assetId: r.assetId,
      assetName: r.assetName,
      categoryName: r.categoryName,
      propertyName: PROPERTY_MAP[r.assetId] ?? null,
      acquisitionDate: r.acquisitionDate,
      usefulLife: r.usefulLifeYears,
      method: r.method,
      originalCost: r.purchaseCost,
      annualDepreciation: r.annualDepreciation,
      accumulatedDepreciation: r.accumulatedDepreciation,
      currentBookValue: r.currentBookValue,
      salvageValue: r.salvageValue,
      yearsElapsed: r.yearsElapsed,
      isFullyDepreciated: r.isFullyDepreciated,
    }));
  },

  async getDepreciationSummary(_customerID: number): Promise<DepreciationSummary> {
    const totalOriginalCost = Math.round(records.reduce((s, r) => s + r.purchaseCost, 0) * 100) / 100;
    const totalAccumulated = Math.round(records.reduce((s, r) => s + r.accumulatedDepreciation, 0) * 100) / 100;
    const totalBookValue = Math.round(records.reduce((s, r) => s + r.currentBookValue, 0) * 100) / 100;
    const fullyDepreciatedCount = records.filter((r) => r.isFullyDepreciated).length;

    // By category
    const catMap = new Map<string, DepreciationByCategory>();
    for (const r of records) {
      const cat = r.categoryName ?? "Other";
      const existing = catMap.get(cat);
      if (existing) {
        existing.originalCost = Math.round((existing.originalCost + r.purchaseCost) * 100) / 100;
        existing.accumulatedDepreciation = Math.round((existing.accumulatedDepreciation + r.accumulatedDepreciation) * 100) / 100;
        existing.bookValue = Math.round((existing.bookValue + r.currentBookValue) * 100) / 100;
        existing.count += 1;
      } else {
        catMap.set(cat, {
          categoryName: cat,
          originalCost: r.purchaseCost,
          accumulatedDepreciation: r.accumulatedDepreciation,
          bookValue: r.currentBookValue,
          count: 1,
        });
      }
    }

    const byCategory = Array.from(catMap.values()).sort((a, b) => b.originalCost - a.originalCost);

    return {
      totalOriginalCost,
      totalAccumulatedDepreciation: totalAccumulated,
      totalBookValue,
      assetCount: records.length,
      fullyDepreciatedCount,
      byCategory,
    };
  },
};
