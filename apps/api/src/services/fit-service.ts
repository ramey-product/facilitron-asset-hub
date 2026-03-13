import { mockFitProvider } from "../db/mock/fit.js";
import type { FitProvider } from "../types/providers.js";

const getProvider = (): FitProvider => {
  // When real DB is connected, swap to drizzle provider:
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleFitProvider;
  return mockFitProvider;
};

export const fitService = {
  async getSummary(customerID: number, assetId: number) {
    const provider = getProvider();
    return provider.getSummary(customerID, assetId);
  },

  async getInspections(
    customerID: number,
    assetId: number,
    page: number,
    limit: number
  ) {
    const provider = getProvider();
    return provider.getInspections(customerID, assetId, page, limit);
  },
};
