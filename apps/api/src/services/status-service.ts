import { mockStatusProvider } from "../db/mock/status.js";
import type { StatusProvider } from "../types/providers.js";
import type { OperationalStatus } from "@asset-hub/shared";

const getProvider = (): StatusProvider => {
  // When real DB is connected, swap to drizzle provider:
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleStatusProvider;
  return mockStatusProvider;
};

export const statusService = {
  async getStatus(customerID: number, assetId: number) {
    return getProvider().getStatus(customerID, assetId);
  },

  async updateStatus(
    customerID: number,
    assetId: number,
    status: OperationalStatus,
    reasonCode: string | null,
    notes: string | null,
    changedBy: number
  ) {
    return getProvider().updateStatus(
      customerID,
      assetId,
      status,
      reasonCode,
      notes,
      changedBy
    );
  },

  async getHistory(
    customerID: number,
    assetId: number,
    page: number,
    limit: number
  ) {
    return getProvider().getHistory(customerID, assetId, page, limit);
  },

  getReasons() {
    return getProvider().getReasons();
  },
};
