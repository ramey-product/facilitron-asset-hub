import { mockWarehouseProvider } from "../db/mock/warehouse.js";
import type { ListTransactionsQuery, CreateTransactionInput } from "@asset-hub/shared";

const getProvider = () => {
  // When real DB is connected: if (process.env["DATA_SOURCE"] === "drizzle") return drizzleWarehouseProvider;
  return mockWarehouseProvider;
};

export const warehouseService = {
  async listTransactions(customerID: number, query: ListTransactionsQuery) {
    return getProvider().listTransactions(customerID, query);
  },

  async createTransaction(customerID: number, transactedBy: string, input: CreateTransactionInput) {
    return getProvider().createTransaction(customerID, transactedBy, input);
  },

  async getStats(customerID: number) {
    return getProvider().getStats(customerID);
  },
};
