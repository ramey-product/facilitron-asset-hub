import { mockStockProvider } from "../db/mock/stock.js";
import type { StockProvider } from "../types/providers.js";
import type { StockAdjustInput } from "@asset-hub/shared";

const getProvider = (): StockProvider => {
  // When real DB is connected, swap to drizzle provider:
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleStockProvider;
  return mockStockProvider;
};

export const stockService = {
  async getStockLevels(customerID: number, partId: number) {
    const provider = getProvider();
    return provider.getStockLevels(customerID, partId);
  },

  async getRollup(
    customerID: number,
    query: {
      page: number;
      limit: number;
      status?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }
  ) {
    const provider = getProvider();
    return provider.getRollup(customerID, query);
  },

  async adjustStock(
    customerID: number,
    partId: number,
    locationId: number,
    adjustedBy: number,
    data: StockAdjustInput
  ) {
    const provider = getProvider();
    return provider.adjustStock(customerID, partId, locationId, adjustedBy, data);
  },

  async getAlerts(
    customerID: number,
    query: { page: number; limit: number; severity?: string }
  ) {
    const provider = getProvider();
    return provider.getAlerts(customerID, query);
  },
};
