import type {
  StockProvider,
  PaginatedResult,
} from "../../types/providers.js";
import type {
  StockLevel,
  StockRollup,
  StockAlert,
  StockAdjustInput,
} from "@asset-hub/shared";
import { mockParts, mockStockLevels } from "./data/inventory.js";

// Working copy for in-memory mutations
const stockLevels = [...mockStockLevels];
let nextStockId = Math.max(...stockLevels.map((s) => s.id)) + 1;

function computeRollup(partId: number): StockRollup | null {
  const part = mockParts.find((p) => p.id === partId);
  if (!part) return null;

  const levels = stockLevels.filter((s) => s.partId === partId);
  if (levels.length === 0) return null;

  const totalOnHand = levels.reduce((sum, l) => sum + l.qtyOnHand, 0);
  const totalReserved = levels.reduce((sum, l) => sum + l.qtyReserved, 0);
  const totalAvailable = totalOnHand - totalReserved;
  const qtyValues = levels.map((l) => l.qtyOnHand);

  let stockStatus: "in-stock" | "low-stock" | "out-of-stock";
  if (totalOnHand === 0) {
    stockStatus = "out-of-stock";
  } else if (totalOnHand <= part.reorderPoint) {
    stockStatus = "low-stock";
  } else {
    stockStatus = "in-stock";
  }

  return {
    partId: part.id,
    partName: part.name,
    sku: part.sku,
    totalOnHand,
    totalReserved,
    totalAvailable,
    locationCount: levels.length,
    minLocationQty: Math.min(...qtyValues),
    maxLocationQty: Math.max(...qtyValues),
    reorderPoint: part.reorderPoint,
    stockStatus,
  };
}

export const mockStockProvider: StockProvider = {
  async getStockLevels(
    _customerID: number,
    partId: number
  ): Promise<StockLevel[]> {
    // CustomerID filtering would be done via the part ownership in real DB
    return stockLevels.filter((s) => s.partId === partId);
  },

  async getRollup(
    customerID: number,
    query: {
      page: number;
      limit: number;
      status?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }
  ): Promise<PaginatedResult<StockRollup>> {
    // Build rollups for all active parts belonging to customer
    const customerParts = mockParts.filter(
      (p) => p.customerID === customerID && p.isActive
    );

    let rollups = customerParts
      .map((p) => computeRollup(p.id))
      .filter((r): r is StockRollup => r !== null);

    // Filter by stock status
    if (query.status && query.status !== "all") {
      rollups = rollups.filter((r) => r.stockStatus === query.status);
    }

    // Search
    if (query.search) {
      const s = query.search.toLowerCase();
      rollups = rollups.filter(
        (r) =>
          r.partName.toLowerCase().includes(s) ||
          r.sku.toLowerCase().includes(s)
      );
    }

    // Sorting
    const sortBy = query.sortBy ?? "partName";
    const sortOrder = query.sortOrder ?? "asc";
    rollups.sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortBy];
      const bVal = (b as unknown as Record<string, unknown>)[sortBy];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp =
        typeof aVal === "string"
          ? aVal.localeCompare(bVal as string)
          : (aVal as number) - (bVal as number);
      return sortOrder === "desc" ? -cmp : cmp;
    });

    const total = rollups.length;
    const page = query.page;
    const limit = query.limit;
    const start = (page - 1) * limit;
    const items = rollups.slice(start, start + limit);

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

  async adjustStock(
    _customerID: number,
    partId: number,
    locationId: number,
    _adjustedBy: number,
    data: StockAdjustInput
  ): Promise<StockLevel | null> {
    const idx = stockLevels.findIndex(
      (s) => s.partId === partId && s.locationId === locationId
    );

    if (idx === -1) return null;

    const existing = stockLevels[idx]!;
    const now = new Date().toISOString();

    const updated: StockLevel = {
      ...existing,
      qtyOnHand: data.qtyOnHand ?? existing.qtyOnHand,
      qtyReserved: data.qtyReserved ?? existing.qtyReserved,
      available:
        (data.qtyOnHand ?? existing.qtyOnHand) -
        (data.qtyReserved ?? existing.qtyReserved),
      lastCountDate: now,
      lastCountBy: "demo.user",
    };

    stockLevels[idx] = updated;
    return updated;
  },

  async getAlerts(
    customerID: number,
    query: { page: number; limit: number; severity?: string }
  ): Promise<PaginatedResult<StockAlert>> {
    const customerParts = mockParts.filter(
      (p) => p.customerID === customerID && p.isActive
    );

    let alerts: StockAlert[] = [];

    for (const part of customerParts) {
      const levels = stockLevels.filter((s) => s.partId === part.id);
      const totalOnHand = levels.reduce((sum, l) => sum + l.qtyOnHand, 0);

      if (totalOnHand <= part.reorderPoint) {
        const deficit = part.reorderPoint - totalOnHand;
        const severity: "warning" | "critical" =
          totalOnHand === 0 ? "critical" : "warning";

        alerts.push({
          partId: part.id,
          partName: part.name,
          sku: part.sku,
          reorderPoint: part.reorderPoint,
          totalOnHand,
          deficit,
          severity,
        });
      }
    }

    // Filter by severity
    if (query.severity && query.severity !== "all") {
      alerts = alerts.filter((a) => a.severity === query.severity);
    }

    // Sort by severity (critical first) then deficit
    alerts.sort((a, b) => {
      if (a.severity !== b.severity) {
        return a.severity === "critical" ? -1 : 1;
      }
      return b.deficit - a.deficit;
    });

    const total = alerts.length;
    const page = query.page;
    const limit = query.limit;
    const start = (page - 1) * limit;
    const items = alerts.slice(start, start + limit);

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
