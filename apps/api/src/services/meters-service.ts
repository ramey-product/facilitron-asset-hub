import { mockMetersProvider } from "../db/mock/meters.js";
import type { CreateMeterReadingInput, UpdateMeterThresholdInput, ListMeterReadingsQuery } from "@asset-hub/shared";

const getProvider = () => {
  // When real DB is connected: if (process.env["DATA_SOURCE"] === "drizzle") return drizzleMetersProvider;
  return mockMetersProvider;
};

export const metersService = {
  async getAssetMeters(customerID: number, assetId: number) {
    return getProvider().getAssetMeters(customerID, assetId);
  },

  async getMeterHistory(
    customerID: number,
    meterId: number,
    query: Required<Pick<ListMeterReadingsQuery, "page" | "limit">> & Omit<ListMeterReadingsQuery, "page" | "limit">
  ) {
    return getProvider().getMeterHistory(customerID, meterId, query);
  },

  async createReading(customerID: number, meterId: number, input: CreateMeterReadingInput) {
    return getProvider().createReading(customerID, meterId, input);
  },

  async getThresholds(customerID: number, meterId: number) {
    return getProvider().getThresholds(customerID, meterId);
  },

  async updateThreshold(customerID: number, meterId: number, thresholdId: number, input: UpdateMeterThresholdInput) {
    return getProvider().updateThreshold(customerID, meterId, thresholdId, input);
  },

  async getMeterAlerts(customerID: number) {
    return getProvider().getMeterAlerts(customerID);
  },

  async checkThresholds(customerID: number) {
    return getProvider().checkThresholds(customerID);
  },
};
