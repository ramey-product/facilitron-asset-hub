/**
 * Mock pick list provider for P1-27.
 * In-memory pick list management with seed data.
 */

import type {
  PickList,
  PickListItem,
  CreatePickListInput,
  ListPickListsQuery,
} from "@asset-hub/shared";
import type { PaginatedResult } from "../../types/providers.js";
import { mockPickLists } from "./data/pick-lists.js";

// Working copy for in-memory mutations
const pickLists = [...mockPickLists];
let nextPickListId = Math.max(...pickLists.map((p) => p.id)) + 1;
let nextItemId =
  Math.max(...pickLists.flatMap((p) => p.items.map((i) => i.id))) + 1;

export const mockPickListProvider = {
  async listPickLists(
    customerID: number,
    query: ListPickListsQuery
  ): Promise<PaginatedResult<PickList>> {
    let items = pickLists.filter((p) => p.customerID === customerID);

    // Filter by status
    if (query.status) {
      items = items.filter((p) => p.status === query.status);
    }

    // Search
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.createdBy.toLowerCase().includes(s) ||
          p.items.some(
            (i) =>
              i.partName.toLowerCase().includes(s) ||
              i.partSku.toLowerCase().includes(s)
          )
      );
    }

    // Sort by most recently created
    items.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = items.length;
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const start = (page - 1) * limit;
    items = items.slice(start, start + limit);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getPickList(
    customerID: number,
    id: number
  ): Promise<PickList | null> {
    return (
      pickLists.find(
        (p) => p.customerID === customerID && p.id === id
      ) ?? null
    );
  },

  async createPickList(
    customerID: number,
    input: CreatePickListInput
  ): Promise<PickList> {
    const now = new Date().toISOString();
    const newList: PickList = {
      id: nextPickListId++,
      customerID,
      name: input.name ?? `Pick List ${nextPickListId - 1}`,
      status: "draft",
      generatedFrom: input.woIds?.length ? "manual" : "scheduled-wos",
      dateRange: input.dateRange ?? null,
      woIds: input.woIds ?? [],
      items: [],
      totalItems: 0,
      pickedItems: 0,
      createdBy: "demo.user",
      createdAt: now,
      completedAt: null,
    };
    pickLists.unshift(newList);
    return newList;
  },

  async updateItem(
    customerID: number,
    pickListId: number,
    itemId: number,
    update: { quantityPicked: number }
  ): Promise<PickListItem | null> {
    const list = pickLists.find(
      (p) => p.customerID === customerID && p.id === pickListId
    );
    if (!list) return null;

    const item = list.items.find((i) => i.id === itemId);
    if (!item) return null;

    item.quantityPicked = update.quantityPicked;
    if (item.quantityPicked >= item.quantityNeeded) {
      item.status = "picked";
    } else if (item.quantityPicked > 0) {
      item.status = "short";
    } else {
      item.status = "pending";
    }

    // Recalculate list stats
    list.pickedItems = list.items.filter((i) => i.status === "picked").length;
    if (list.status === "draft" && update.quantityPicked > 0) {
      list.status = "in-progress";
    }

    return item;
  },

  async completePickList(
    customerID: number,
    id: number
  ): Promise<PickList | null> {
    const list = pickLists.find(
      (p) => p.customerID === customerID && p.id === id
    );
    if (!list) return null;
    if (list.status === "completed") return null;

    list.status = "completed";
    list.completedAt = new Date().toISOString();
    return list;
  },
};
