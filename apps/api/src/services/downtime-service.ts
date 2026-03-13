import { mockDowntimeProvider } from "../db/mock/downtime.js";
import type { CreateDowntimeEventInput, ListDowntimeEventsQuery, StatsWindow } from "@asset-hub/shared";

const getProvider = () => {
  // When real DB is connected: if (process.env["DATA_SOURCE"] === "drizzle") return drizzleDowntimeProvider;
  return mockDowntimeProvider;
};

export const downtimeService = {
  async getDowntimeEvents(
    customerID: number,
    assetId: number,
    query: Required<Pick<ListDowntimeEventsQuery, "page" | "limit">> & Omit<ListDowntimeEventsQuery, "page" | "limit">
  ) {
    return getProvider().getDowntimeEvents(customerID, assetId, query);
  },

  async getDowntimeStats(customerID: number, assetId: number, window: StatsWindow) {
    return getProvider().getDowntimeStats(customerID, assetId, window);
  },

  async getReliabilityOverview(customerID: number) {
    return getProvider().getReliabilityOverview(customerID);
  },

  async createDowntimeEvent(customerID: number, assetId: number, input: CreateDowntimeEventInput) {
    return getProvider().createDowntimeEvent(customerID, assetId, input);
  },

  async resolveDowntimeEvent(customerID: number, eventId: number) {
    return getProvider().resolveDowntimeEvent(customerID, eventId);
  },
};
