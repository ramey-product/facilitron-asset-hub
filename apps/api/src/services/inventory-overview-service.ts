import { mockInventoryOverviewProvider } from "../db/mock/inventory-overview.js";

const getProvider = () => {
  // When real DB is connected: if (process.env["DATA_SOURCE"] === "drizzle") return drizzleInventoryOverviewProvider;
  return mockInventoryOverviewProvider;
};

export const inventoryOverviewService = {
  async getOverviewMetrics(customerID: number) {
    return getProvider().getOverviewMetrics(customerID);
  },

  async getHealthScore(customerID: number) {
    return getProvider().getHealthScore(customerID);
  },

  async search(customerID: number, query: string, type: "both" | "assets" | "consumables" = "both") {
    return getProvider().search(customerID, query, type);
  },
};
