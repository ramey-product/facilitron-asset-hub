import { mockManufacturerProvider } from "../db/mock/manufacturers.js";
import type {
  ManufacturerProvider,
  CreateManufacturerInput,
  CreateModelInput,
} from "../types/providers.js";

const getProvider = (): ManufacturerProvider => {
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleManufacturerProvider;
  return mockManufacturerProvider;
};

export const manufacturerService = {
  async search(customerID: number, query: string) {
    const provider = getProvider();
    return provider.search(customerID, query);
  },

  async getById(customerID: number, id: number) {
    const provider = getProvider();
    return provider.getById(customerID, id);
  },

  async getModels(customerID: number, manufacturerId: number, query?: string) {
    const provider = getProvider();
    return provider.getModels(customerID, manufacturerId, query);
  },

  async create(customerID: number, data: CreateManufacturerInput) {
    const provider = getProvider();
    return provider.create(customerID, data);
  },

  async createModel(
    customerID: number,
    manufacturerId: number,
    data: CreateModelInput
  ) {
    const provider = getProvider();
    return provider.createModel(customerID, manufacturerId, data);
  },
};
