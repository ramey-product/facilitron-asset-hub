import { mockDepreciationProvider } from "../db/mock/depreciation.js";

const getProvider = () => {
  // When real DB is connected: if (process.env["DATA_SOURCE"] === "drizzle") return drizzleDepreciationProvider;
  return mockDepreciationProvider;
};

export const depreciationService = {
  async getAssetDepreciation(customerID: number, assetId: number) {
    return getProvider().getAssetDepreciation(customerID, assetId);
  },

  async getDepreciationSchedule(customerID: number, assetId: number) {
    return getProvider().getDepreciationSchedule(customerID, assetId);
  },

  async getFixedAssetRegister(customerID: number) {
    return getProvider().getFixedAssetRegister(customerID);
  },

  async getDepreciationSummary(customerID: number) {
    return getProvider().getDepreciationSummary(customerID);
  },
};
