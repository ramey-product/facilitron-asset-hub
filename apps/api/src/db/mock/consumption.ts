import type {
  ConsumptionProvider,
  PaginatedResult,
} from "../../types/providers.js";
import type {
  ConsumptionRecord,
  ConsumptionForecast,
  InventoryAuditRecord,
  ListConsumptionQuery,
  ListAuditQuery,
} from "@asset-hub/shared";
import {
  mockConsumptionRecords,
  mockAuditRecords,
} from "./data/consumption.js";

// Working copy for in-memory mutations
const consumptions = [...mockConsumptionRecords];
const audits = [...mockAuditRecords];

export const mockConsumptionProvider: ConsumptionProvider = {
  async list(
    customerID: number,
    query: ListConsumptionQuery
  ): Promise<PaginatedResult<ConsumptionRecord>> {
    let items = consumptions.filter((c) => c.customerID === customerID);

    if (query.partId) {
      items = items.filter((c) => c.partId === query.partId);
    }
    if (query.workOrderId) {
      items = items.filter((c) => c.workOrderId === query.workOrderId);
    }
    if (query.locationId) {
      items = items.filter((c) => c.locationId === query.locationId);
    }
    if (query.dateFrom) {
      const from = new Date(query.dateFrom).getTime();
      items = items.filter((c) => new Date(c.loggedAt).getTime() >= from);
    }
    if (query.dateTo) {
      const to = new Date(query.dateTo).getTime();
      items = items.filter((c) => new Date(c.loggedAt).getTime() <= to);
    }

    const total = items.length;
    const page = query.page;
    const limit = query.limit;
    const start = (page - 1) * limit;
    items = items.slice(start, start + limit);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getForecast(
    customerID: number,
    partId: number
  ): Promise<ConsumptionForecast | null> {
    // Collect non-reversed consumptions for this part in the last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentConsumptions = consumptions.filter(
      (c) =>
        c.customerID === customerID &&
        c.partId === partId &&
        !c.isReversed &&
        new Date(c.loggedAt).getTime() >= thirtyDaysAgo
    );

    if (recentConsumptions.length === 0) {
      // Check if part exists at all
      const anyRecord = consumptions.find(
        (c) => c.customerID === customerID && c.partId === partId
      );
      if (!anyRecord) return null;

      return {
        partId,
        partName: anyRecord.partName,
        currentStock: 50, // Mock current stock
        avgDailyConsumption: 0,
        daysUntilStockout: null,
        stockoutStatus: "safe",
        historyWindow: 30,
      };
    }

    const totalConsumed = recentConsumptions.reduce((sum, c) => sum + c.qty, 0);
    const avgDaily = totalConsumed / 30;

    // Mock current stock level (in a real system this would come from stock provider)
    const currentStock = 25 + Math.floor(Math.random() * 50);
    const daysUntilStockout =
      avgDaily > 0 ? Math.round(currentStock / avgDaily) : null;

    let stockoutStatus: ConsumptionForecast["stockoutStatus"] = "safe";
    if (daysUntilStockout !== null) {
      if (daysUntilStockout <= 7) stockoutStatus = "urgent";
      else if (daysUntilStockout <= 21) stockoutStatus = "caution";
    }

    return {
      partId,
      partName: recentConsumptions[0]!.partName,
      currentStock,
      avgDailyConsumption: Math.round(avgDaily * 100) / 100,
      daysUntilStockout,
      stockoutStatus,
      historyWindow: 30,
    };
  },

  async reverse(
    customerID: number,
    id: number,
    reversedBy: string
  ): Promise<ConsumptionRecord | null> {
    const idx = consumptions.findIndex(
      (c) => c.customerID === customerID && c.id === id
    );
    if (idx === -1) return null;

    const existing = consumptions[idx]!;
    if (existing.isReversed) return null; // Already reversed

    const now = new Date().toISOString();
    const updated: ConsumptionRecord = {
      ...existing,
      isReversed: true,
      reversedBy,
      reversedAt: now,
    };
    consumptions[idx] = updated;

    // Add an audit entry for the reversal
    audits.unshift({
      id: audits.length + 1,
      customerID,
      partId: existing.partId,
      partName: existing.partName,
      locationId: existing.locationId,
      locationName: existing.locationName,
      changeType: "reversal",
      qtyBefore: 0, // Simplified for mock
      qtyAfter: existing.qty,
      qtyChanged: existing.qty,
      reason: `Reversed consumption from ${existing.workOrderNumber}`,
      referenceId: existing.workOrderNumber,
      changedBy: reversedBy,
      changedAt: now,
    });

    return updated;
  },

  async listAudit(
    customerID: number,
    query: ListAuditQuery
  ): Promise<PaginatedResult<InventoryAuditRecord>> {
    let items = audits.filter((a) => a.customerID === customerID);

    if (query.partId) {
      items = items.filter((a) => a.partId === query.partId);
    }
    if (query.locationId) {
      items = items.filter((a) => a.locationId === query.locationId);
    }
    if (query.changeType) {
      items = items.filter((a) => a.changeType === query.changeType);
    }
    if (query.dateFrom) {
      const from = new Date(query.dateFrom).getTime();
      items = items.filter((a) => new Date(a.changedAt).getTime() >= from);
    }
    if (query.dateTo) {
      const to = new Date(query.dateTo).getTime();
      items = items.filter((a) => new Date(a.changedAt).getTime() <= to);
    }

    const total = items.length;
    const page = query.page;
    const limit = query.limit;
    const start = (page - 1) * limit;
    items = items.slice(start, start + limit);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};
