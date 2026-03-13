/**
 * Mock provider for P1-21 Purchase Orders.
 * In-memory CRUD with full state machine for PO workflow.
 */

import type {
  PurchaseOrder,
  PurchaseOrderStatus,
  CreatePurchaseOrderInput,
  UpdatePurchaseOrderInput,
  ListPurchaseOrdersQuery,
  SpendAnalytics,
  SpendByVendor,
  SpendByCategory,
  MonthlySpend,
} from "@asset-hub/shared";
import type { PaginatedResult } from "../../types/providers.js";
import { mockPurchaseOrders } from "./data/procurement.js";

// Working copy for in-memory mutations
const purchaseOrders: PurchaseOrder[] = mockPurchaseOrders.map((po) => ({ ...po, lineItems: [...po.lineItems] }));
let nextPoId = Math.max(...purchaseOrders.map((po) => po.id)) + 1;
let nextPoSeq = 12; // next sequence number after PO-2026-0011

let nextLineItemId =
  Math.max(...purchaseOrders.flatMap((po) => po.lineItems.map((li) => li.id))) + 1;

function generatePoNumber(): string {
  const year = new Date().getFullYear();
  const seq = String(nextPoSeq++).padStart(4, "0");
  return `PO-${year}-${seq}`;
}

function calcLineTotals(lineItems: PurchaseOrder["lineItems"]): {
  totalAmount: number;
  taxAmount: number;
  grandTotal: number;
} {
  let totalAmount = 0;
  let taxAmount = 0;
  for (const li of lineItems) {
    totalAmount += li.lineTotal;
    taxAmount += li.taxAmount;
  }
  return {
    totalAmount: Math.round(totalAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    grandTotal: Math.round((totalAmount + taxAmount) * 100) / 100,
  };
}

export const mockProcurementProvider = {
  async list(
    customerID: number,
    query: Required<Pick<ListPurchaseOrdersQuery, "page" | "limit">> &
      Omit<ListPurchaseOrdersQuery, "page" | "limit">
  ): Promise<PaginatedResult<PurchaseOrder>> {
    let items = purchaseOrders.filter(
      // In this mock, all POs belong to customerID 1
      () => customerID > 0
    );

    // Status filter
    if (query.status) {
      items = items.filter((po) => po.status === query.status);
    }

    // Vendor filter
    if (query.vendorId) {
      items = items.filter((po) => po.vendorId === query.vendorId);
    }

    // Search by PO number or vendor name
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter(
        (po) =>
          po.poNumber.toLowerCase().includes(s) ||
          (po.vendorName?.toLowerCase().includes(s) ?? false) ||
          (po.notes?.toLowerCase().includes(s) ?? false)
      );
    }

    // Sort
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = query.sortOrder ?? "desc";
    items.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;
      switch (sortBy) {
        case "poNumber":
          aVal = a.poNumber;
          bVal = b.poNumber;
          break;
        case "totalAmount":
          aVal = a.grandTotal;
          bVal = b.grandTotal;
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          aVal = a.createdAt;
          bVal = b.createdAt;
      }
      const cmp = typeof aVal === "string" ? aVal.localeCompare(bVal as string) : aVal - (bVal as number);
      return sortOrder === "desc" ? -cmp : cmp;
    });

    const total = items.length;
    const page = query.page;
    const limit = query.limit;
    const start = (page - 1) * limit;
    items = items.slice(start, start + limit);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getById(
    _customerID: number,
    id: number
  ): Promise<PurchaseOrder | null> {
    return purchaseOrders.find((po) => po.id === id) ?? null;
  },

  async create(
    _customerID: number,
    input: CreatePurchaseOrderInput
  ): Promise<PurchaseOrder> {
    const now = new Date().toISOString();
    const lineItems: PurchaseOrder["lineItems"] = input.lineItems.map((li) => {
      const lineTotal = Math.round(li.quantity * li.unitCost * 100) / 100;
      const taxRate = li.taxRate ?? 0;
      const taxAmount = Math.round(lineTotal * (taxRate / 100) * 100) / 100;
      return {
        id: nextLineItemId++,
        poId: nextPoId,
        partId: li.partId,
        partNumber: null,
        partName: null,
        quantity: li.quantity,
        unitCost: li.unitCost,
        lineTotal,
        taxRate,
        taxAmount,
        quantityReceived: 0,
        notes: li.notes ?? null,
      };
    });

    const totals = calcLineTotals(lineItems);
    const po: PurchaseOrder = {
      id: nextPoId++,
      poNumber: generatePoNumber(),
      vendorId: input.vendorId,
      vendorName: null,
      status: "Draft",
      createdBy: 1,
      createdByName: "demo.user",
      approvedBy: null,
      approvedByName: null,
      ...totals,
      notes: input.notes ?? null,
      propertyId: input.propertyId,
      propertyName: null,
      createdAt: now,
      updatedAt: now,
      submittedAt: null,
      approvedAt: null,
      orderedAt: null,
      receivedAt: null,
      cancelledAt: null,
      lineItems,
    };
    purchaseOrders.unshift(po);
    return po;
  },

  async update(
    _customerID: number,
    id: number,
    input: UpdatePurchaseOrderInput
  ): Promise<PurchaseOrder | null> {
    const idx = purchaseOrders.findIndex((po) => po.id === id);
    if (idx === -1) return null;

    const existing = purchaseOrders[idx]!;
    if (existing.status !== "Draft") return null; // Only Draft POs can be edited

    const now = new Date().toISOString();
    let lineItems = existing.lineItems;

    if (input.lineItems) {
      lineItems = input.lineItems.map((li) => {
        const lineTotal = Math.round(li.quantity * li.unitCost * 100) / 100;
        const taxRate = li.taxRate ?? 0;
        const taxAmount = Math.round(lineTotal * (taxRate / 100) * 100) / 100;
        return {
          id: nextLineItemId++,
          poId: id,
          partId: li.partId,
          partNumber: null,
          partName: null,
          quantity: li.quantity,
          unitCost: li.unitCost,
          lineTotal,
          taxRate,
          taxAmount,
          quantityReceived: 0,
          notes: li.notes ?? null,
        };
      });
    }

    const totals = calcLineTotals(lineItems);
    const updated: PurchaseOrder = {
      ...existing,
      vendorId: input.vendorId ?? existing.vendorId,
      notes: input.notes !== undefined ? input.notes : existing.notes,
      lineItems,
      ...totals,
      updatedAt: now,
    };
    purchaseOrders[idx] = updated;
    return updated;
  },

  async submit(
    _customerID: number,
    id: number
  ): Promise<PurchaseOrder | null> {
    const idx = purchaseOrders.findIndex((po) => po.id === id);
    if (idx === -1) return null;

    const existing = purchaseOrders[idx]!;
    if (existing.status !== "Draft") return null;

    const now = new Date().toISOString();
    const updated: PurchaseOrder = {
      ...existing,
      status: "Submitted",
      submittedAt: now,
      updatedAt: now,
    };
    purchaseOrders[idx] = updated;
    return updated;
  },

  async approve(
    _customerID: number,
    id: number,
    approvedBy: number
  ): Promise<PurchaseOrder | { error: string }> {
    const idx = purchaseOrders.findIndex((po) => po.id === id);
    if (idx === -1) return { error: "Purchase order not found" };

    const existing = purchaseOrders[idx]!;
    if (existing.status !== "Submitted") {
      return { error: "Only Submitted purchase orders can be approved" };
    }
    if (existing.createdBy === approvedBy) {
      return { error: "Approver cannot be the same person who created the purchase order" };
    }

    const now = new Date().toISOString();
    const updated: PurchaseOrder = {
      ...existing,
      status: "Approved",
      approvedBy,
      approvedByName: approvedBy === 2 ? "admin.user" : "approver.user",
      approvedAt: now,
      updatedAt: now,
    };
    purchaseOrders[idx] = updated;
    return updated;
  },

  async cancel(
    _customerID: number,
    id: number
  ): Promise<PurchaseOrder | null> {
    const idx = purchaseOrders.findIndex((po) => po.id === id);
    if (idx === -1) return null;

    const existing = purchaseOrders[idx]!;
    if (existing.status === "Received" || existing.status === "Cancelled") {
      return null; // Cannot cancel Received or already-Cancelled POs
    }

    const now = new Date().toISOString();
    const updated: PurchaseOrder = {
      ...existing,
      status: "Cancelled",
      cancelledAt: now,
      updatedAt: now,
    };
    purchaseOrders[idx] = updated;
    return updated;
  },

  async getSpendAnalytics(_customerID: number): Promise<SpendAnalytics> {
    const closedStatuses: PurchaseOrderStatus[] = ["Received", "PartiallyReceived", "Ordered"];
    const openStatuses: PurchaseOrderStatus[] = ["Draft", "Submitted", "Approved"];

    const closedPOs = purchaseOrders.filter((po) => closedStatuses.includes(po.status));
    const openOrders = purchaseOrders.filter((po) => openStatuses.includes(po.status)).length;

    // By vendor
    const vendorMap = new Map<number, SpendByVendor>();
    for (const po of closedPOs) {
      const existing = vendorMap.get(po.vendorId);
      if (existing) {
        existing.totalSpend += po.grandTotal;
        existing.orderCount += 1;
      } else {
        vendorMap.set(po.vendorId, {
          vendorId: po.vendorId,
          vendorName: po.vendorName ?? `Vendor ${po.vendorId}`,
          totalSpend: po.grandTotal,
          orderCount: 1,
        });
      }
    }
    const byVendor = Array.from(vendorMap.values())
      .map((v) => ({ ...v, totalSpend: Math.round(v.totalSpend * 100) / 100 }))
      .sort((a, b) => b.totalSpend - a.totalSpend);

    // By category — derive from part category names embedded in line item part numbers
    const categoryMap = new Map<number, SpendByCategory>();
    const categoryNameMap: Record<string, { id: number; name: string }> = {
      "EL-": { id: 1, name: "Electrical" },
      "PL-": { id: 2, name: "Plumbing" },
      "HV-": { id: 3, name: "HVAC" },
      "FL-": { id: 4, name: "Filters" },
      "FS-": { id: 5, name: "Fasteners" },
      "LT-": { id: 6, name: "Lighting" },
      "SF-": { id: 7, name: "Safety" },
      "JA-": { id: 8, name: "Janitorial" },
    };

    for (const po of closedPOs) {
      for (const li of po.lineItems) {
        const partNum = li.partNumber ?? "";
        let cat = { id: 9, name: "Other" };
        for (const [prefix, c] of Object.entries(categoryNameMap)) {
          if (partNum.startsWith(prefix)) {
            cat = c;
            break;
          }
        }
        const existing = categoryMap.get(cat.id);
        if (existing) {
          existing.totalSpend += li.lineTotal + li.taxAmount;
          existing.partCount += 1;
        } else {
          categoryMap.set(cat.id, {
            categoryId: cat.id,
            categoryName: cat.name,
            totalSpend: li.lineTotal + li.taxAmount,
            partCount: 1,
          });
        }
      }
    }
    const byCategory = Array.from(categoryMap.values())
      .map((c) => ({ ...c, totalSpend: Math.round(c.totalSpend * 100) / 100 }))
      .sort((a, b) => b.totalSpend - a.totalSpend);

    // Monthly spend (last 12 months)
    const monthMap = new Map<string, MonthlySpend>();
    for (const po of closedPOs) {
      const date = new Date(po.createdAt);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const existing = monthMap.get(month);
      if (existing) {
        existing.totalSpend += po.grandTotal;
        existing.orderCount += 1;
      } else {
        monthMap.set(month, {
          month,
          totalSpend: po.grandTotal,
          orderCount: 1,
        });
      }
    }
    const monthly = Array.from(monthMap.values())
      .map((m) => ({ ...m, totalSpend: Math.round(m.totalSpend * 100) / 100 }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);

    const totalSpend = Math.round(closedPOs.reduce((sum, po) => sum + po.grandTotal, 0) * 100) / 100;
    const avgOrderValue = closedPOs.length > 0 ? Math.round((totalSpend / closedPOs.length) * 100) / 100 : 0;

    return { byVendor, byCategory, monthly, totalSpend, avgOrderValue, openOrders };
  },
};
