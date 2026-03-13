import { mockInventoryProvider } from "../db/mock/inventory.js";
import type {
  InventoryProvider,
} from "../types/providers.js";
import type {
  ListPartsQuery,
  CreatePartInput,
  UpdatePartInput,
} from "@asset-hub/shared";

const getProvider = (): InventoryProvider => {
  // When real DB is connected, swap to drizzle provider:
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleInventoryProvider;
  return mockInventoryProvider;
};

export const inventoryService = {
  async list(customerID: number, query: ListPartsQuery) {
    const provider = getProvider();
    return provider.list(customerID, query);
  },

  async getById(customerID: number, id: number) {
    const provider = getProvider();
    return provider.getById(customerID, id);
  },

  async create(customerID: number, data: CreatePartInput) {
    const provider = getProvider();
    return provider.create(customerID, data);
  },

  async update(customerID: number, id: number, data: UpdatePartInput) {
    const provider = getProvider();
    return provider.update(customerID, id, data);
  },

  async delete(customerID: number, id: number) {
    const provider = getProvider();
    return provider.delete(customerID, id);
  },

  async bulkActivate(customerID: number, ids: number[]) {
    const provider = getProvider();
    return provider.bulkActivate(customerID, ids);
  },

  async bulkDeactivate(customerID: number, ids: number[]) {
    const provider = getProvider();
    return provider.bulkDeactivate(customerID, ids);
  },

  async listCategories(customerID: number) {
    const provider = getProvider();
    return provider.listCategories(customerID);
  },
};
