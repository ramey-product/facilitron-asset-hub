import type { CostProvider } from "../../types/providers.js";
import type {
  CostSummary,
  MonthlyCostBreakdown,
  TopCostAsset,
} from "@asset-hub/shared";
import { mockAssets } from "./data/assets.js";
import { mockWorkOrders } from "./data/work-orders.js";

function totalCost(wo: { laborCost: number; partsCost: number; vendorCost: number }): number {
  return wo.laborCost + wo.partsCost + wo.vendorCost;
}

export const mockCostProvider: CostProvider = {
  async getCostSummary(
    customerID: number,
    assetId: number
  ): Promise<CostSummary | null> {
    const asset = mockAssets.find(
      (a) =>
        a.customerID === customerID &&
        a.equipmentRecordID === assetId &&
        a.isActive
    );
    if (!asset) return null;

    const wos = mockWorkOrders.filter(
      (wo) =>
        wo.customerID === customerID &&
        wo.equipmentRecordID === assetId
    );

    const lifetimeTotal = wos.reduce((sum, wo) => sum + totalCost(wo), 0);
    const laborTotal = wos.reduce((sum, wo) => sum + wo.laborCost, 0);
    const partsTotal = wos.reduce((sum, wo) => sum + wo.partsCost, 0);
    const vendorTotal = wos.reduce((sum, wo) => sum + wo.vendorCost, 0);

    // YTD — current year
    const currentYear = new Date().getFullYear();
    const ytdWOs = wos.filter(
      (wo) => new Date(wo.completedDate).getFullYear() === currentYear
    );
    const yearToDate = ytdWOs.reduce((sum, wo) => sum + totalCost(wo), 0);

    const costs = wos.map((wo) => totalCost(wo));
    const averagePerWorkOrder =
      wos.length > 0 ? lifetimeTotal / wos.length : 0;
    const highestWorkOrderCost =
      costs.length > 0 ? Math.max(...costs) : 0;

    return {
      assetId,
      assetName: asset.equipmentName,
      lifetimeTotal,
      yearToDate,
      averagePerWorkOrder: Math.round(averagePerWorkOrder * 100) / 100,
      highestWorkOrderCost,
      workOrderCount: wos.length,
      laborTotal,
      partsTotal,
      vendorTotal,
    };
  },

  async getCostHistory(
    customerID: number,
    assetId: number,
    months: number
  ): Promise<MonthlyCostBreakdown[]> {
    const wos = mockWorkOrders.filter(
      (wo) =>
        wo.customerID === customerID &&
        wo.equipmentRecordID === assetId
    );

    // Build monthly buckets going back N months from now
    const now = new Date();
    const result: MonthlyCostBreakdown[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const monthWOs = wos.filter((wo) => {
        const woDate = new Date(wo.completedDate);
        return (
          woDate.getFullYear() === d.getFullYear() &&
          woDate.getMonth() === d.getMonth()
        );
      });

      const labor = monthWOs.reduce((sum, wo) => sum + wo.laborCost, 0);
      const parts = monthWOs.reduce((sum, wo) => sum + wo.partsCost, 0);
      const vendor = monthWOs.reduce((sum, wo) => sum + wo.vendorCost, 0);

      result.push({
        month: monthKey,
        labor,
        parts,
        vendor,
        total: labor + parts + vendor,
      });
    }

    return result;
  },

  async getTopCostAssets(
    customerID: number,
    limit: number
  ): Promise<TopCostAsset[]> {
    const custAssets = mockAssets.filter(
      (a) => a.customerID === customerID && a.isActive
    );
    const custWOs = mockWorkOrders.filter(
      (wo) => wo.customerID === customerID
    );

    // Aggregate costs per asset
    const costMap = new Map<
      number,
      { total: number; count: number }
    >();
    for (const wo of custWOs) {
      const existing = costMap.get(wo.equipmentRecordID);
      const woCost = totalCost(wo);
      if (existing) {
        existing.total += woCost;
        existing.count++;
      } else {
        costMap.set(wo.equipmentRecordID, {
          total: woCost,
          count: 1,
        });
      }
    }

    // Join with asset data and sort
    const results: TopCostAsset[] = [];
    for (const [assetId, { total, count }] of costMap) {
      const asset = custAssets.find(
        (a) => a.equipmentRecordID === assetId
      );
      if (asset) {
        results.push({
          assetId,
          assetName: asset.equipmentName,
          propertyName: asset.propertyName ?? null,
          categoryName: asset.categoryName ?? null,
          lifetimeCost: total,
          workOrderCount: count,
        });
      }
    }

    return results
      .sort((a, b) => b.lifetimeCost - a.lifetimeCost)
      .slice(0, limit);
  },
};
