import { mockTCOProvider } from "../db/mock/tco.js";
import type { TCOQuery } from "@asset-hub/shared";

const getProvider = () => {
  // When real DB is connected: if (process.env["DATA_SOURCE"] === "drizzle") return drizzleTCOProvider;
  return mockTCOProvider;
};

export const tcoService = {
  async getAssetTCO(customerID: number, assetId: number) {
    return getProvider().getAssetTCO(customerID, assetId);
  },

  async getTCOComparison(customerID: number, query: TCOQuery) {
    return getProvider().getTCOComparison(customerID, query);
  },

  async getRepairVsReplace(customerID: number) {
    return getProvider().getRepairVsReplace(customerID);
  },
};
