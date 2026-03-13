import { mockLifecycleProvider } from "../db/mock/lifecycle.js";
import type {
  CreateLifecycleEventInput,
} from "@asset-hub/shared";

const getProvider = () => mockLifecycleProvider;

export const lifecycleService = {
  async getAssetLifecycleEvents(customerID: number, assetId: number) {
    const provider = getProvider();
    return provider.getAssetLifecycleEvents(customerID, assetId);
  },

  async getCurrentStage(customerID: number, assetId: number) {
    const provider = getProvider();
    return provider.getCurrentStage(customerID, assetId);
  },

  async getLifecycleKPIs(customerID: number) {
    const provider = getProvider();
    return provider.getLifecycleKPIs(customerID);
  },

  async getLifecycleForecast(customerID: number, years?: number) {
    const provider = getProvider();
    return provider.getLifecycleForecast(customerID, years);
  },

  async getComplianceReport(customerID: number) {
    const provider = getProvider();
    return provider.getComplianceReport(customerID);
  },

  async createLifecycleEvent(customerID: number, input: CreateLifecycleEventInput) {
    const provider = getProvider();
    return provider.createLifecycleEvent(customerID, input);
  },
};
