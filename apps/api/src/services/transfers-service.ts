import type { ListTransfersQuery, CreateTransferInput } from "@asset-hub/shared";
import {
  listTransfers,
  getTransfer,
  createTransfer,
  approveTransfer,
  shipTransfer,
  receiveTransfer,
  cancelTransfer,
} from "../db/mock/transfers.js";

export const transfersService = {
  async list(customerID: number, query: ListTransfersQuery) {
    return listTransfers(customerID, query);
  },

  async getById(customerID: number, id: number) {
    return getTransfer(customerID, id);
  },

  async create(customerID: number, input: CreateTransferInput, requestedBy: number) {
    return createTransfer(customerID, input, requestedBy);
  },

  async approve(customerID: number, id: number, approvedBy: number) {
    return approveTransfer(customerID, id, approvedBy);
  },

  async ship(customerID: number, id: number) {
    return shipTransfer(customerID, id);
  },

  async receive(customerID: number, id: number) {
    return receiveTransfer(customerID, id);
  },

  async cancel(customerID: number, id: number) {
    return cancelTransfer(customerID, id);
  },
};
