import { mockToolroomProvider } from "../db/mock/toolroom.js";
import type { ListCheckoutsQuery, CreateCheckoutInput, ReturnToolInput } from "@asset-hub/shared";

const getProvider = () => {
  // When real DB is connected: if (process.env["DATA_SOURCE"] === "drizzle") return drizzleToolroomProvider;
  return mockToolroomProvider;
};

export const toolroomService = {
  async listCheckouts(customerID: number, query: ListCheckoutsQuery) {
    return getProvider().listCheckouts(customerID, query);
  },

  async checkoutTool(customerID: number, input: CreateCheckoutInput) {
    return getProvider().checkoutTool(customerID, input);
  },

  async returnTool(customerID: number, checkoutId: number, input: ReturnToolInput) {
    return getProvider().returnTool(customerID, checkoutId, input);
  },

  async getStats(customerID: number) {
    return getProvider().getStats(customerID);
  },
};
