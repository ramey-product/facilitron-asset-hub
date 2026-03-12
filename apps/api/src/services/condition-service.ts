import { mockConditionProvider } from "../db/mock/conditions.js";
import type {
  ConditionProvider,
  CreateConditionLogInput,
} from "../types/providers.js";

const getProvider = (): ConditionProvider => {
  // When real DB is connected, swap to drizzle provider:
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleConditionProvider;
  return mockConditionProvider;
};

export const conditionService = {
  async getScale(customerID: number) {
    return getProvider().getScale(customerID);
  },

  async getHistory(
    customerID: number,
    equipmentId: number,
    limit: number,
    offset: number
  ) {
    return getProvider().getHistory(customerID, equipmentId, limit, offset);
  },

  async getStats(customerID: number, equipmentId: number) {
    return getProvider().getStats(customerID, equipmentId);
  },

  async logCondition(
    customerID: number,
    equipmentId: number,
    loggedBy: number,
    data: CreateConditionLogInput
  ) {
    return getProvider().logCondition(customerID, equipmentId, loggedBy, data);
  },
};
