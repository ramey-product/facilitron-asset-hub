import { mockCostProvider } from "../db/mock/costs.js";
import type { CostProvider } from "../types/providers.js";

const getProvider = (): CostProvider => {
  // When real DB is connected, swap to drizzle provider:
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleCostProvider;
  return mockCostProvider;
};

export const costService = {
  async getCostSummary(customerID: number, assetId: number) {
    return getProvider().getCostSummary(customerID, assetId);
  },

  async getCostHistory(
    customerID: number,
    assetId: number,
    months: number
  ) {
    return getProvider().getCostHistory(customerID, assetId, months);
  },

  async getTopCostAssets(customerID: number, limit: number) {
    return getProvider().getTopCostAssets(customerID, limit);
  },
};
