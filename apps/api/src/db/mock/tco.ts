/**
 * Mock provider for P1-31 Asset Cost Rollup / TCO.
 */

import type { AssetTCO, TCOComparison, RepairVsReplaceRecord, TCOQuery } from "@asset-hub/shared";
import { mockTCORecords } from "./data/tco.js";

const tcoRecords: AssetTCO[] = mockTCORecords.map((r) => ({ ...r }));

export const mockTCOProvider = {
  async getAssetTCO(_customerID: number, assetId: number): Promise<AssetTCO | null> {
    return tcoRecords.find((r) => r.assetId === assetId) ?? null;
  },

  async getTCOComparison(_customerID: number, query: TCOQuery): Promise<TCOComparison> {
    let assets = [...tcoRecords];

    if (query.categoryId) {
      // Filter by category ID — map against known category names
      // In mock, we don't have IDs for categories, so skip this filter
    }
    if (query.propertyId) {
      // Similar limitation in mock — skip property filter
    }
    if (query.minTcoRatio !== undefined) {
      assets = assets.filter((r) => r.tcoRatio >= query.minTcoRatio!);
    }

    // Sort
    const sortBy = query.sortBy ?? "tcoRatio";
    const sortOrder = query.sortOrder ?? "desc";
    assets.sort((a, b) => {
      let aVal: number;
      let bVal: number;
      switch (sortBy) {
        case "totalTco": aVal = a.totalTco; bVal = b.totalTco; break;
        case "annualTco": aVal = a.annualTco; bVal = b.annualTco; break;
        case "ageYears": aVal = a.ageYears; bVal = b.ageYears; break;
        default: aVal = a.tcoRatio; bVal = b.tcoRatio;
      }
      return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
    });

    const totalTco = Math.round(assets.reduce((s, r) => s + r.totalTco, 0) * 100) / 100;
    const avgTcoRatio = assets.length > 0
      ? Math.round((assets.reduce((s, r) => s + r.tcoRatio, 0) / assets.length) * 100) / 100
      : 0;
    const assetsNeedingReplacement = assets.filter((r) => r.recommendation === "red").length;

    return {
      assets,
      summary: { totalTco, avgTcoRatio, assetsNeedingReplacement, assetCount: assets.length },
    };
  },

  async getRepairVsReplace(_customerID: number): Promise<RepairVsReplaceRecord[]> {
    // Assets where TCO ratio >= 0.8 (yellow or red)
    const candidates = tcoRecords.filter((r) => r.tcoRatio >= 0.8);

    return candidates
      .sort((a, b) => b.tcoRatio - a.tcoRatio)
      .map((r) => ({
        assetId: r.assetId,
        assetName: r.assetName,
        categoryName: r.categoryName,
        propertyName: r.propertyName,
        ageYears: r.ageYears,
        totalTco: r.totalTco,
        replacementCost: r.replacementCost,
        tcoRatio: r.tcoRatio,
        usefulLifeRemaining: null, // would come from depreciation in real implementation
        lastMaintenanceDate: null,
        recommendation: r.recommendation,
      }));
  },
};
