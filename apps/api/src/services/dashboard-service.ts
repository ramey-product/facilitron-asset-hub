import { mockDashboardProvider } from "../db/mock/dashboard.js";
import type { DashboardProvider } from "../types/providers.js";
import type { DashboardAlertType } from "@asset-hub/shared";

const getProvider = (): DashboardProvider => {
  // When real DB is connected, swap to drizzle provider:
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleDashboardProvider;
  return mockDashboardProvider;
};

export const dashboardService = {
  async getStats(customerID: number) {
    return getProvider().getStats(customerID);
  },

  async getAlerts(
    customerID: number,
    type: DashboardAlertType | undefined,
    page: number,
    limit: number
  ) {
    return getProvider().getAlerts(customerID, type, page, limit);
  },

  async getActivity(customerID: number, page: number, limit: number) {
    return getProvider().getActivity(customerID, page, limit);
  },
};
