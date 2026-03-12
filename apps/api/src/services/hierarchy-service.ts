import { mockHierarchyProvider } from "../db/mock/hierarchies.js";
import type { HierarchyProvider } from "../types/providers.js";

const getProvider = (): HierarchyProvider => {
  // When real DB is connected, swap to drizzle provider:
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleHierarchyProvider;
  return mockHierarchyProvider;
};

export const hierarchyService = {
  async getTree(customerID: number, assetId: number) {
    return getProvider().getTree(customerID, assetId);
  },

  async getRollup(customerID: number, assetId: number) {
    return getProvider().getRollup(customerID, assetId);
  },

  async reparent(
    customerID: number,
    assetId: number,
    newParentId: number | null,
    contactId: number
  ) {
    return getProvider().reparent(customerID, assetId, newParentId, contactId);
  },

  async bulkReparent(
    customerID: number,
    items: { assetId: number; newParentId: number | null }[],
    contactId: number
  ) {
    return getProvider().bulkReparent(customerID, items, contactId);
  },
};
