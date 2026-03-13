import { mockCustomFieldProvider } from "../db/mock/custom-fields.js";
import type {
  CustomFieldProvider,
} from "../types/providers.js";
import type {
  CreateCustomFieldDefinitionInput,
  UpdateCustomFieldDefinitionInput,
  UpdateCustomFieldValuesInput,
} from "@asset-hub/shared";

const getProvider = (): CustomFieldProvider => {
  // When real DB is connected, swap to drizzle provider:
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleCustomFieldProvider;
  return mockCustomFieldProvider;
};

export const customFieldService = {
  async listDefinitions(customerID: number) {
    const provider = getProvider();
    return provider.listDefinitions(customerID);
  },

  async createDefinition(
    customerID: number,
    data: CreateCustomFieldDefinitionInput
  ) {
    const provider = getProvider();
    return provider.createDefinition(customerID, data);
  },

  async updateDefinition(
    customerID: number,
    id: number,
    data: UpdateCustomFieldDefinitionInput
  ) {
    const provider = getProvider();
    return provider.updateDefinition(customerID, id, data);
  },

  async deleteDefinition(customerID: number, id: number) {
    const provider = getProvider();
    return provider.deleteDefinition(customerID, id);
  },

  async getAssetValues(customerID: number, assetId: number) {
    const provider = getProvider();
    return provider.getAssetValues(customerID, assetId);
  },

  async updateAssetValues(
    customerID: number,
    assetId: number,
    data: UpdateCustomFieldValuesInput
  ) {
    const provider = getProvider();
    return provider.updateAssetValues(customerID, assetId, data);
  },
};
