import { mockDashboardProvider } from "../db/mock/dashboard.js";
import type { DashboardProvider } from "../types/providers.js";
import type { DashboardAlertType } from "@asset-hub/shared";

const getProvider = (): DashboardProvider => {
  // When real DB is connected, swap to drizzle provider:
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleDashboardProvider;
  return mockDashboardProvider;
};

export const dashboardService = {
  async getStats(customerID: number, propertyId?: number) {
    return getProvider().getStats(customerID, propertyId);
  },

  async getAlerts(
    customerID: number,
    type: DashboardAlertType | undefined,
    page: number,
    limit: number,
    propertyId?: number
  ) {
    return getProvider().getAlerts(customerID, type, page, limit, propertyId);
  },

  async getActivity(
    customerID: number,
    page: number,
    limit: number,
    propertyId?: number
  ) {
    return getProvider().getActivity(customerID, page, limit, propertyId);
  },
};
