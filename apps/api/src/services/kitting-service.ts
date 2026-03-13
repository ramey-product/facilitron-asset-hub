import type {
  ListKitsQuery,
  CreateKitInput,
  UpdateKitInput,
  KitCheckoutInput,
} from "@asset-hub/shared";
import {
  listKits,
  getKit,
  createKit,
  updateKit,
  deleteKit,
  checkoutKit,
} from "../db/mock/kitting.js";

export const kittingService = {
  async list(customerID: number, query: ListKitsQuery) {
    return listKits(customerID, query);
  },

  async getById(customerID: number, id: number) {
    return getKit(customerID, id);
  },

  async create(customerID: number, input: CreateKitInput) {
    return createKit(customerID, input);
  },

  async update(customerID: number, id: number, input: UpdateKitInput) {
    return updateKit(customerID, id, input);
  },

  async delete(customerID: number, id: number) {
    return deleteKit(customerID, id);
  },

  async checkout(customerID: number, input: KitCheckoutInput) {
    return checkoutKit(customerID, input);
  },
};
