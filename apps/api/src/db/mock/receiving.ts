/**
 * Mock provider for P1-23 PO Receiving.
 * Creates receiving records, validates quantities, updates PO status.
 */

import type {
  ReceivingRecord,
  CreateReceivingInput,
  ListReceivingQuery,
} from "@asset-hub/shared";
import type { PaginatedResult } from "../../types/providers.js";
import { mockReceivingRecords } from "./data/procurement.js";
import { mockProcurementProvider } from "./procurement.js";

// Working copy for in-memory mutations
const receivingRecords: ReceivingRecord[] = mockReceivingRecords.map((r) => ({
  ...r,
  lineItems: [...r.lineItems],
}));

let nextReceivingId = Math.max(...receivingRecords.map((r) => r.id)) + 1;
let nextReceivingLineId =
  Math.max(...receivingRecords.flatMap((r) => r.lineItems.map((li) => li.id))) + 1;

export const mockReceivingProvider = {
  async list(
    _customerID: number,
    query: Required<Pick<ListReceivingQuery, "page" | "limit">> &
      Omit<ListReceivingQuery, "page" | "limit">
  ): Promise<PaginatedResult<ReceivingRecord>> {
    let items = [...receivingRecords];

    // Filter by PO
    if (query.poId) {
      items = items.filter((r) => r.poId === query.poId);
    }

    // Search by PO number or received-by name
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter(
        (r) =>
          (r.poNumber?.toLowerCase().includes(s) ?? false) ||
          (r.receivedByName?.toLowerCase().includes(s) ?? false) ||
          (r.notes?.toLowerCase().includes(s) ?? false)
      );
    }

    // Sort by receivedAt descending
    items.sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));

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
  ): Promise<ReceivingRecord | null> {
    return receivingRecords.find((r) => r.id === id) ?? null;
  },

  async create(
    customerID: number,
    input: CreateReceivingInput
  ): Promise<ReceivingRecord | { error: string }> {
    // Validate PO exists and is in a receivable state
    const po = await mockProcurementProvider.getById(customerID, input.poId);
    if (!po) return { error: "Purchase order not found" };
    if (po.status !== "Ordered" && po.status !== "PartiallyReceived") {
      return { error: "Purchase order must be in Ordered or PartiallyReceived status to receive items" };
    }

    // Validate quantities — cannot receive more than ordered - already received
    for (const li of input.lineItems) {
      const poLineItem = po.lineItems.find((pl) => pl.id === li.poLineItemId);
      if (!poLineItem) {
        return { error: `PO line item ${li.poLineItemId} not found on this PO` };
      }
      const alreadyReceived = receivingRecords
        .filter((r) => r.poId === input.poId)
        .flatMap((r) => r.lineItems)
        .filter((rl) => rl.poLineItemId === li.poLineItemId)
        .reduce((sum, rl) => sum + rl.quantityReceived, 0);

      const remaining = poLineItem.quantity - alreadyReceived;
      if (li.quantityReceived > remaining) {
        return {
          error: `Cannot receive ${li.quantityReceived} of line item ${li.poLineItemId} — only ${remaining} remaining`,
        };
      }
    }

    const now = new Date().toISOString();
    const lineItems: ReceivingRecord["lineItems"] = input.lineItems.map((li) => {
      const poLineItem = po.lineItems.find((pl) => pl.id === li.poLineItemId)!;
      return {
        id: nextReceivingLineId++,
        receivingId: nextReceivingId,
        poLineItemId: li.poLineItemId,
        partId: poLineItem.partId,
        partName: poLineItem.partName,
        partNumber: poLineItem.partNumber,
        quantityReceived: li.quantityReceived,
        quantityRejected: li.quantityRejected ?? 0,
        rejectionReason: li.rejectionReason ?? null,
        locationId: li.locationId,
        locationName: null,
      };
    });

    const record: ReceivingRecord = {
      id: nextReceivingId++,
      poId: input.poId,
      poNumber: po.poNumber,
      receivedBy: 1, // mock auth user
      receivedByName: "demo.user",
      receivedAt: now,
      notes: input.notes ?? null,
      lineItems,
    };

    receivingRecords.unshift(record);

    // Update quantityReceived on PO line items and recalculate PO status
    const updatedLineItems = po.lineItems.map((poLi) => {
      const receivingLi = input.lineItems.find((il) => il.poLineItemId === poLi.id);
      if (!receivingLi) return poLi;
      return {
        ...poLi,
        quantityReceived: poLi.quantityReceived + receivingLi.quantityReceived,
      };
    });

    // Determine new PO status
    const allReceived = updatedLineItems.every((li) => li.quantityReceived >= li.quantity);
    const anyReceived = updatedLineItems.some((li) => li.quantityReceived > 0);
    const newStatus = allReceived ? "Received" : anyReceived ? "PartiallyReceived" : po.status;

    // In-place mutate the PO (mimic the real DB update)
    // We access the shared array through the procurement provider module
    // Since they share the same runtime module instance, we update via the provider
    await mockProcurementProvider.update(customerID, input.poId, {});
    // Direct mutation of shared working copy (procurement provider exposes internal array via getById)
    const poRef = await mockProcurementProvider.getById(customerID, input.poId);
    if (poRef) {
      // Mutate in place — both providers reference the same object
      (poRef as { status: string }).status = newStatus;
      (poRef as { updatedAt: string }).updatedAt = now;
      if (newStatus === "Received") {
        (poRef as { receivedAt: string | null }).receivedAt = now;
      }
      // Update line items
      for (const li of updatedLineItems) {
        const refLi = poRef.lineItems.find((l) => l.id === li.id);
        if (refLi) {
          (refLi as { quantityReceived: number }).quantityReceived = li.quantityReceived;
        }
      }
    }

    return record;
  },

  async getDiscrepancies(
    _customerID: number
  ): Promise<ReceivingRecord[]> {
    return receivingRecords.filter((r) =>
      r.lineItems.some((li) => li.quantityRejected > 0)
    );
  },
};
