import { mockConsumablesDashboardProvider } from "../db/mock/consumables-dashboard.js";

const getProvider = () => {
  // When real DB is connected: if (process.env["DATA_SOURCE"] === "drizzle") return drizzleConsumablesDashboardProvider;
  return mockConsumablesDashboardProvider;
};

export const consumablesDashboardService = {
  async getKPIs(customerID: number) {
    return getProvider().getKPIs(customerID);
  },

  async getUsageTrends(customerID: number) {
    return getProvider().getUsageTrends(customerID);
  },

  async getRecentActivity(customerID: number) {
    return getProvider().getRecentActivity(customerID);
  },
};
