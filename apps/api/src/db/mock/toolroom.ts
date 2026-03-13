/**
 * Mock tool room provider for P1-30.
 * In-memory checkout/return tracking with seed data.
 */

import type {
  ToolCheckout,
  CreateCheckoutInput,
  ReturnToolInput,
  ListCheckoutsQuery,
  ToolroomStats,
} from "@asset-hub/shared";
import type { PaginatedResult } from "../../types/providers.js";
import { mockTools, mockToolCheckouts } from "./data/toolroom.js";

// Working copies for in-memory mutations
const checkouts = [...mockToolCheckouts];
const tools = [...mockTools];
let nextId = Math.max(...checkouts.map((c) => c.id)) + 1;

const USER_LOOKUP: Record<number, string> = {
  1: "demo.user",
  2: "Mike Johnson",
  3: "Tom Wilson",
  4: "Sarah Chen",
};

export const mockToolroomProvider = {
  async listCheckouts(
    customerID: number,
    query: ListCheckoutsQuery
  ): Promise<PaginatedResult<ToolCheckout>> {
    let items = checkouts.filter((c) => c.customerID === customerID);

    // Filter by status
    if (query.status) {
      items = items.filter((c) => c.status === query.status);
    }

    // Filter by tool
    if (query.toolId) {
      items = items.filter((c) => c.toolId === query.toolId);
    }

    // Search
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter(
        (c) =>
          c.toolName.toLowerCase().includes(s) ||
          c.toolAssetTag.toLowerCase().includes(s) ||
          c.checkedOutByName.toLowerCase().includes(s) ||
          c.notes?.toLowerCase().includes(s)
      );
    }

    // Sort by most recent checkout first
    items.sort(
      (a, b) =>
        new Date(b.checkedOutAt).getTime() -
        new Date(a.checkedOutAt).getTime()
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

  async checkoutTool(
    customerID: number,
    input: CreateCheckoutInput
  ): Promise<ToolCheckout> {
    const tool = tools.find(
      (t) => t.customerID === customerID && t.toolId === input.toolId
    );
    const userName = USER_LOOKUP[input.checkedOutBy] ?? `User ${input.checkedOutBy}`;
    const now = new Date().toISOString();

    const checkout: ToolCheckout = {
      id: nextId++,
      customerID,
      toolId: input.toolId,
      toolName: tool?.toolName ?? `Tool ${input.toolId}`,
      toolAssetTag: tool?.assetTag ?? `TOOL-${String(input.toolId).padStart(3, "0")}`,
      checkedOutBy: input.checkedOutBy,
      checkedOutByName: userName,
      checkedOutAt: now,
      expectedReturnDate: input.expectedReturnDate,
      returnedAt: null,
      returnedCondition: null,
      returnedBy: null,
      returnedByName: null,
      status: "checked-out",
      notes: input.notes ?? null,
    };

    checkouts.unshift(checkout);
    return checkout;
  },

  async returnTool(
    customerID: number,
    checkoutId: number,
    input: ReturnToolInput
  ): Promise<ToolCheckout | null> {
    const idx = checkouts.findIndex(
      (c) => c.customerID === customerID && c.id === checkoutId
    );
    if (idx === -1) return null;

    const checkout = checkouts[idx]!;
    if (checkout.status === "returned") return null;

    checkout.returnedAt = new Date().toISOString();
    checkout.returnedCondition = input.condition;
    checkout.returnedBy = 1; // demo user
    checkout.returnedByName = "demo.user";
    checkout.status = "returned";
    if (input.notes) checkout.notes = input.notes;

    // Update the tool's last return condition
    const tool = tools.find((t) => t.toolId === checkout.toolId);
    if (tool) {
      (tool as { lastReturnCondition: string }).lastReturnCondition =
        input.condition;
    }

    return checkout;
  },

  async getStats(customerID: number): Promise<ToolroomStats> {
    const customerTools = tools.filter((t) => t.customerID === customerID);
    const activeCheckouts = checkouts.filter(
      (c) => c.customerID === customerID && c.status !== "returned"
    );
    const checkedOutToolIds = new Set(activeCheckouts.map((c) => c.toolId));

    // Count checkouts per tool across all records for popularity
    const checkoutCounts = new Map<number, number>();
    for (const c of checkouts.filter((c) => c.customerID === customerID)) {
      checkoutCounts.set(
        c.toolId,
        (checkoutCounts.get(c.toolId) ?? 0) + 1
      );
    }

    const popularTools = Array.from(checkoutCounts.entries())
      .map(([toolId, count]) => {
        const tool = customerTools.find((t) => t.toolId === toolId);
        return {
          toolId,
          toolName: tool?.toolName ?? `Tool ${toolId}`,
          checkoutCount: count,
        };
      })
      .sort((a, b) => b.checkoutCount - a.checkoutCount)
      .slice(0, 5);

    const availableToolsList = customerTools
      .filter((t) => !checkedOutToolIds.has(t.toolId))
      .map((t) => ({
        toolId: t.toolId,
        toolName: t.toolName,
        assetTag: t.assetTag,
        lastReturnCondition: t.lastReturnCondition,
      }));

    return {
      totalTools: customerTools.length,
      availableTools: customerTools.length - checkedOutToolIds.size,
      checkedOutCount: activeCheckouts.filter(
        (c) => c.status === "checked-out"
      ).length,
      overdueCount: activeCheckouts.filter((c) => c.status === "overdue")
        .length,
      popularTools,
      availableToolsList,
    };
  },
};
