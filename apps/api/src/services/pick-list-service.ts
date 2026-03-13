import { mockPickListProvider } from "../db/mock/pick-lists.js";
import type { ListPickListsQuery, CreatePickListInput } from "@asset-hub/shared";

const getProvider = () => {
  // When real DB is connected: if (process.env["DATA_SOURCE"] === "drizzle") return drizzlePickListProvider;
  return mockPickListProvider;
};

export const pickListService = {
  async listPickLists(customerID: number, query: ListPickListsQuery) {
    return getProvider().listPickLists(customerID, query);
  },

  async getPickList(customerID: number, id: number) {
    return getProvider().getPickList(customerID, id);
  },

  async createPickList(customerID: number, input: CreatePickListInput) {
    return getProvider().createPickList(customerID, input);
  },

  async updateItem(customerID: number, pickListId: number, itemId: number, update: { quantityPicked: number }) {
    return getProvider().updateItem(customerID, pickListId, itemId, update);
  },

  async completePickList(customerID: number, id: number) {
    return getProvider().completePickList(customerID, id);
  },
};
