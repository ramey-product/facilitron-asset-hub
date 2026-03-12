import { mockSettingsProvider } from "../db/mock/settings.js";
import type {
  SettingsProvider,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types/providers.js";

const getProvider = (): SettingsProvider => {
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleSettingsProvider;
  return mockSettingsProvider;
};

export const settingsService = {
  async getAll(customerID: number) {
    const provider = getProvider();
    return provider.getAll(customerID);
  },

  async getByKey(customerID: number, key: string) {
    const provider = getProvider();
    return provider.getByKey(customerID, key);
  },

  async upsert(
    customerID: number,
    contactId: number,
    key: string,
    value: string
  ) {
    const provider = getProvider();
    return provider.upsert(customerID, contactId, key, value);
  },

  async listCategories(customerID: number) {
    const provider = getProvider();
    return provider.listCategories(customerID);
  },

  async createCategory(
    customerID: number,
    contactId: number,
    data: CreateCategoryInput
  ) {
    const provider = getProvider();
    return provider.createCategory(customerID, contactId, data);
  },

  async updateCategory(
    customerID: number,
    id: number,
    data: UpdateCategoryInput
  ) {
    const provider = getProvider();
    return provider.updateCategory(customerID, id, data);
  },

  async deleteCategory(customerID: number, id: number) {
    const provider = getProvider();
    return provider.deleteCategory(customerID, id);
  },
};
