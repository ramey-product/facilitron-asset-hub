import { mockProcurementProvider } from "../db/mock/procurement.js";
import type {
  CreatePurchaseOrderInput,
  UpdatePurchaseOrderInput,
  ListPurchaseOrdersQuery,
} from "@asset-hub/shared";

const getProvider = () => {
  // When real DB is connected, swap to drizzle provider:
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleProcurementProvider;
  return mockProcurementProvider;
};

export const procurementService = {
  async list(
    customerID: number,
    query: Required<Pick<ListPurchaseOrdersQuery, "page" | "limit">> &
      Omit<ListPurchaseOrdersQuery, "page" | "limit">
  ) {
    return getProvider().list(customerID, query);
  },

  async getById(customerID: number, id: number) {
    return getProvider().getById(customerID, id);
  },

  async create(customerID: number, input: CreatePurchaseOrderInput) {
    return getProvider().create(customerID, input);
  },

  async update(customerID: number, id: number, input: UpdatePurchaseOrderInput) {
    return getProvider().update(customerID, id, input);
  },

  async submit(customerID: number, id: number) {
    return getProvider().submit(customerID, id);
  },

  async approve(customerID: number, id: number, approvedBy: number) {
    return getProvider().approve(customerID, id, approvedBy);
  },

  async cancel(customerID: number, id: number) {
    return getProvider().cancel(customerID, id);
  },

  async getSpendAnalytics(customerID: number) {
    return getProvider().getSpendAnalytics(customerID);
  },
};
