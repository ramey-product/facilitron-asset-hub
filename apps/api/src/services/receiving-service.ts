import { mockReceivingProvider } from "../db/mock/receiving.js";
import type {
  CreateReceivingInput,
  ListReceivingQuery,
} from "@asset-hub/shared";

const getProvider = () => {
  // When real DB is connected, swap to drizzle provider:
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleReceivingProvider;
  return mockReceivingProvider;
};

export const receivingService = {
  async list(
    customerID: number,
    query: Required<Pick<ListReceivingQuery, "page" | "limit">> &
      Omit<ListReceivingQuery, "page" | "limit">
  ) {
    return getProvider().list(customerID, query);
  },

  async getById(customerID: number, id: number) {
    return getProvider().getById(customerID, id);
  },

  async create(customerID: number, input: CreateReceivingInput) {
    return getProvider().create(customerID, input);
  },

  async getDiscrepancies(customerID: number) {
    return getProvider().getDiscrepancies(customerID);
  },
};
