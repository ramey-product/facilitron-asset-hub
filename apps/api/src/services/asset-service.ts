import { mockAssetProvider } from "../db/mock/assets.js";
import type {
  AssetProvider,
  ListAssetsQuery,
  CreateAssetInput,
  UpdateAssetInput,
} from "../types/providers.js";

const getProvider = (): AssetProvider => {
  // When real DB is connected, swap to drizzle provider:
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleAssetProvider;
  return mockAssetProvider;
};

export const assetService = {
  async list(customerID: number, query: ListAssetsQuery) {
    const provider = getProvider();
    return provider.list(customerID, query);
  },

  async getById(customerID: number, id: number) {
    const provider = getProvider();
    return provider.getById(customerID, id);
  },

  async create(
    customerID: number,
    contactId: number,
    data: CreateAssetInput
  ) {
    const provider = getProvider();
    return provider.create(customerID, contactId, data);
  },

  async update(
    customerID: number,
    id: number,
    contactId: number,
    data: UpdateAssetInput
  ) {
    const provider = getProvider();
    return provider.update(customerID, id, contactId, data);
  },

  async delete(customerID: number, id: number) {
    const provider = getProvider();
    return provider.delete(customerID, id);
  },
};
