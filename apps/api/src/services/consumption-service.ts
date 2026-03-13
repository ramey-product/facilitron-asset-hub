import { mockConsumptionProvider } from "../db/mock/consumption.js";
import type {
  ConsumptionProvider,
} from "../types/providers.js";
import type {
  ListConsumptionQuery,
  ListAuditQuery,
} from "@asset-hub/shared";

const getProvider = (): ConsumptionProvider => {
  // When real DB is connected, swap to drizzle provider:
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleConsumptionProvider;
  return mockConsumptionProvider;
};

export const consumptionService = {
  async list(customerID: number, query: ListConsumptionQuery) {
    const provider = getProvider();
    return provider.list(customerID, query);
  },

  async getForecast(customerID: number, partId: number) {
    const provider = getProvider();
    return provider.getForecast(customerID, partId);
  },

  async reverse(customerID: number, id: number, reversedBy: string) {
    const provider = getProvider();
    return provider.reverse(customerID, id, reversedBy);
  },

  async listAudit(customerID: number, query: ListAuditQuery) {
    const provider = getProvider();
    return provider.listAudit(customerID, query);
  },
};
