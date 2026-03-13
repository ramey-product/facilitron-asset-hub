import { mockMappingProvider } from "../db/mock/mapping.js";
import type {
  ListFloorPlansQuery,
  MapFilter,
  CreateAssetPinInput,
  UpdateAssetPinInput,
} from "@asset-hub/shared";

const getProvider = () => mockMappingProvider;

export const mappingService = {
  async listFloorPlans(customerID: number, query: ListFloorPlansQuery) {
    const provider = getProvider();
    return provider.getFloorPlans(customerID, {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      propertyId: query.propertyId,
    });
  },

  async getFloorPlan(customerID: number, mapId: number) {
    const provider = getProvider();
    return provider.getFloorPlan(customerID, mapId);
  },

  async getAssetPins(customerID: number, mapId: number, filter?: MapFilter) {
    const provider = getProvider();
    return provider.getAssetPins(customerID, mapId, filter);
  },

  async createAssetPin(customerID: number, mapId: number, input: CreateAssetPinInput) {
    const provider = getProvider();
    return provider.createAssetPin(customerID, mapId, input);
  },

  async updateAssetPin(customerID: number, pinId: number, input: UpdateAssetPinInput) {
    const provider = getProvider();
    return provider.updateAssetPin(customerID, pinId, input);
  },

  async deleteAssetPin(customerID: number, pinId: number) {
    const provider = getProvider();
    return provider.deleteAssetPin(customerID, pinId);
  },
};
