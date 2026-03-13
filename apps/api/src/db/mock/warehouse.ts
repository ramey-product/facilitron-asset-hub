/**
 * Mock warehouse transaction provider for P1-26.
 * Provides transaction listing, creation, and aggregate stats.
 */

import type {
  InventoryTransaction,
  CreateTransactionInput,
  ListTransactionsQuery,
  WarehouseStats,
  TransactionVolumeEntry,
  TurnoverRateEntry,
  ShrinkageEntry,
} from "@asset-hub/shared";
import type { PaginatedResult } from "../../types/providers.js";
import { mockTransactions } from "./data/warehouse.js";
import { mockParts } from "./data/inventory.js";

// Working copy for in-memory mutations
const transactions = [...mockTransactions];
let nextId = Math.max(...transactions.map((t) => t.id)) + 1;

const LOCATION_LOOKUP: Record<number, string> = {
  1: "Main Warehouse",
  2: "North Facility",
  3: "South Facility",
  4: "Mobile Unit A",
  5: "East Campus",
};

export const mockWarehouseProvider = {
  async listTransactions(
    customerID: number,
    query: ListTransactionsQuery
  ): Promise<PaginatedResult<InventoryTransaction>> {
    let items = transactions.filter((t) => t.customerID === customerID);

    // Filter by transaction type
    if (query.transactionType) {
      items = items.filter((t) => t.transactionType === query.transactionType);
    }

    // Filter by part
    if (query.partId) {
      items = items.filter((t) => t.partId === query.partId);
    }

    // Filter by location
    if (query.locationId) {
      items = items.filter((t) => t.locationId === query.locationId);
    }

    // Filter by date range
    if (query.dateFrom) {
      const from = new Date(query.dateFrom).getTime();
      items = items.filter(
        (t) => new Date(t.transactionDate).getTime() >= from
      );
    }
    if (query.dateTo) {
      const to = new Date(query.dateTo).getTime();
      items = items.filter(
        (t) => new Date(t.transactionDate).getTime() <= to
      );
    }

    // Search
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter(
        (t) =>
          t.partName.toLowerCase().includes(s) ||
          t.partSku.toLowerCase().includes(s) ||
          t.locationName.toLowerCase().includes(s) ||
          t.reference?.toLowerCase().includes(s) ||
          t.transactedBy.toLowerCase().includes(s) ||
          t.notes?.toLowerCase().includes(s)
      );
    }

    // Sort by date descending (most recent first)
    items.sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime()
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

  async createTransaction(
    customerID: number,
    transactedBy: string,
    input: CreateTransactionInput
  ): Promise<InventoryTransaction> {
    const part = mockParts.find((p) => p.id === input.partId);
    const locationName = LOCATION_LOOKUP[input.locationId] ?? `Location ${input.locationId}`;

    // Calculate running balance from last transaction for this part+location
    const relevantTxns = transactions.filter(
      (t) =>
        t.customerID === customerID &&
        t.partId === input.partId &&
        t.locationId === input.locationId
    );
    const lastBalance =
      relevantTxns.length > 0
        ? relevantTxns.sort(
            (a, b) =>
              new Date(b.transactionDate).getTime() -
              new Date(a.transactionDate).getTime()
          )[0]!.runningBalance
        : 0;

    const signedQty =
      input.transactionType === "issue"
        ? -Math.abs(input.quantity)
        : Math.abs(input.quantity);

    const newTxn: InventoryTransaction = {
      id: nextId++,
      customerID,
      transactionType: input.transactionType,
      partId: input.partId,
      partName: part?.name ?? "Unknown Part",
      partSku: part?.sku ?? "UNKNOWN",
      locationId: input.locationId,
      locationName,
      quantity: signedQty,
      reference: input.reference ?? null,
      referenceType: input.referenceType ?? null,
      transactedBy,
      transactionDate: new Date().toISOString(),
      notes: input.notes ?? null,
      runningBalance: lastBalance + signedQty,
    };

    transactions.push(newTxn);
    return newTxn;
  },

  async getStats(customerID: number): Promise<WarehouseStats> {
    const customerTxns = transactions.filter(
      (t) => t.customerID === customerID
    );

    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const weekStart = todayStart - 7 * 24 * 60 * 60 * 1000;
    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).getTime();

    const totalTransactionsToday = customerTxns.filter(
      (t) => new Date(t.transactionDate).getTime() >= todayStart
    ).length;

    const weekTxns = customerTxns.filter(
      (t) => new Date(t.transactionDate).getTime() >= weekStart
    );

    const issuesThisWeek = weekTxns.filter(
      (t) => t.transactionType === "issue"
    ).length;
    const receiptsThisWeek = weekTxns.filter(
      (t) => t.transactionType === "receive"
    ).length;

    const adjustmentsThisMonth = customerTxns.filter(
      (t) =>
        t.transactionType === "adjust" &&
        new Date(t.transactionDate).getTime() >= monthStart
    ).length;

    // Transaction volume by month (last 3 months)
    const transactionVolume: TransactionVolumeEntry[] = [];
    for (let i = 2; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthLabel = d.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      const mStart = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
      const mEnd = new Date(
        d.getFullYear(),
        d.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      ).getTime();

      const monthTxns = customerTxns.filter((t) => {
        const ts = new Date(t.transactionDate).getTime();
        return ts >= mStart && ts <= mEnd;
      });

      transactionVolume.push({
        month: monthLabel,
        issues: monthTxns.filter((t) => t.transactionType === "issue").length,
        receipts: monthTxns.filter((t) => t.transactionType === "receive")
          .length,
        adjustments: monthTxns.filter((t) => t.transactionType === "adjust")
          .length,
        transfers: monthTxns.filter((t) => t.transactionType === "transfer")
          .length,
        returns: monthTxns.filter((t) => t.transactionType === "return").length,
      });
    }

    // Turnover rates: issued qty vs average on-hand for top parts
    const issuedByPart = new Map<number, { name: string; qty: number }>();
    for (const t of customerTxns) {
      if (t.transactionType === "issue") {
        const existing = issuedByPart.get(t.partId);
        if (existing) {
          existing.qty += Math.abs(t.quantity);
        } else {
          issuedByPart.set(t.partId, {
            name: t.partName,
            qty: Math.abs(t.quantity),
          });
        }
      }
    }

    const turnoverRates: TurnoverRateEntry[] = Array.from(
      issuedByPart.entries()
    )
      .map(([partId, data]) => {
        const part = mockParts.find((p) => p.id === partId);
        const avgOnHand = part
          ? Math.max(1, (part.minQty + part.maxQty) / 2)
          : 50;
        return {
          partId,
          partName: data.name,
          issuedQty: data.qty,
          avgOnHand: Math.round(avgOnHand),
          turnoverRate: parseFloat((data.qty / avgOnHand).toFixed(2)),
        };
      })
      .sort((a, b) => b.turnoverRate - a.turnoverRate)
      .slice(0, 10);

    // Shrinkage: negative adjustments
    const shrinkageReport: ShrinkageEntry[] = customerTxns
      .filter((t) => t.transactionType === "adjust" && t.quantity < 0)
      .map((t) => {
        const d = new Date(t.transactionDate);
        return {
          month: d.toLocaleString("default", {
            month: "short",
            year: "numeric",
          }),
          partId: t.partId,
          partName: t.partName,
          adjustedQty: Math.abs(t.quantity),
          estimatedLoss: parseFloat(
            (
              Math.abs(t.quantity) *
              (mockParts.find((p) => p.id === t.partId)?.unitCost ?? 0)
            ).toFixed(2)
          ),
        };
      });

    return {
      totalTransactionsToday,
      issuesThisWeek,
      receiptsThisWeek,
      adjustmentsThisMonth,
      transactionVolume,
      turnoverRates,
      shrinkageReport,
    };
  },
};
