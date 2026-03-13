import { mockVendorProvider } from "../db/mock/vendors.js";
import type {
  VendorProvider,
} from "../types/providers.js";
import type {
  ListVendorsQuery,
  CreateVendorInput,
  UpdateVendorInput,
} from "@asset-hub/shared";

const getProvider = (): VendorProvider => {
  // When real DB is connected, swap to drizzle provider:
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleVendorProvider;
  return mockVendorProvider;
};

export const vendorService = {
  async list(customerID: number, query: ListVendorsQuery) {
    const provider = getProvider();
    return provider.list(customerID, query);
  },

  async getById(customerID: number, id: number) {
    const provider = getProvider();
    return provider.getById(customerID, id);
  },

  async create(customerID: number, data: CreateVendorInput) {
    const provider = getProvider();
    return provider.create(customerID, data);
  },

  async update(customerID: number, id: number, data: UpdateVendorInput) {
    const provider = getProvider();
    return provider.update(customerID, id, data);
  },

  async delete(customerID: number, id: number) {
    const provider = getProvider();
    return provider.delete(customerID, id);
  },

  async getPerformance(customerID: number, vendorId: number) {
    const provider = getProvider();
    return provider.getPerformance(customerID, vendorId);
  },

  async compareVendors(customerID: number, vendorIds: number[]) {
    const provider = getProvider();
    return provider.compareVendors(customerID, vendorIds);
  },
};
