import type {
  InventoryTransfer,
  TransferStatus,
  CreateTransferInput,
  ListTransfersQuery,
} from "@asset-hub/shared";
import { mockTransfers } from "./data/transfers.js";
import type { PaginatedResult } from "../../types/providers.js";

// Working copy for in-memory mutations
const transfers: InventoryTransfer[] = mockTransfers.map((t) => ({ ...t }));
let nextId = Math.max(...transfers.map((t) => t.id)) + 1;
let nextSeq = transfers.length + 1;

const LOCATION_PROPERTY_MAP: Record<number, { propertyId: number; propertyName: string; locationName: string }> = {
  1: { propertyId: 1, propertyName: "Rotten Robbie - Oakland", locationName: "Main Warehouse" },
  2: { propertyId: 1, propertyName: "Rotten Robbie - Oakland", locationName: "North Facility" },
  3: { propertyId: 2, propertyName: "Rotten Robbie - Fremont", locationName: "South Facility" },
  4: { propertyId: 3, propertyName: "Rotten Robbie - San Jose", locationName: "Mobile Unit A" },
  5: { propertyId: 2, propertyName: "Rotten Robbie - Fremont", locationName: "East Campus" },
};

const PART_LOOKUP: Record<number, { name: string; sku: string }> = {
  1: { name: "20A Circuit Breaker", sku: "EL-BRK-20A" },
  3: { name: "Duplex Outlet (20A)", sku: "EL-OUTLET-DPX" },
  5: { name: "Single Pole Switch (15A)", sku: "EL-SWITCH-SP" },
  7: { name: "GFCI Outlet (20A)", sku: "EL-GFCI-20A" },
  8: { name: "1\" Ball Valve (Brass)", sku: "PL-VALVE-1IN" },
  9: { name: "Universal Flush Valve Kit", sku: "PL-FLUSHKIT" },
  11: { name: "Lavatory Faucet (Chrome)", sku: "PL-FAUCET-LAV" },
  12: { name: "1-1/2\" P-Trap (PVC)", sku: "PL-TRAP-1.5" },
  14: { name: "V-Belt A48", sku: "HV-BELT-A48" },
  15: { name: "Run Capacitor 45/5 MFD", sku: "HV-CAPACITOR-45" },
  16: { name: "30A Contactor (2-Pole)", sku: "HV-CONTACTOR-30A" },
  18: { name: "R-410A Refrigerant (25lb)", sku: "HV-REFRIG-R410A" },
  20: { name: "Hot Surface Ignitor", sku: "HV-IGNITOR-HOT" },
  21: { name: "MERV 8 Filter (20x25x1)", sku: "FL-MERV8-20X25" },
  22: { name: "MERV 13 Filter (20x25x1)", sku: "FL-MERV13-20X25" },
  27: { name: "Drywall Screws #6 x 1-5/8\" (1lb)", sku: "FS-SCREW-DRYWALL" },
  31: { name: "LED T8 Tube (4ft, 18W)", sku: "LT-LED-T8-4FT" },
  32: { name: "LED Panel Light (2x2, 40W)", sku: "LT-LED-PANEL-2X2" },
  36: { name: "Photoelectric Smoke Detector", sku: "SF-SMOKE-PHT" },
  37: { name: "Fire Extinguisher (5lb ABC)", sku: "SF-EXTINGUISH-5" },
  40: { name: "Trash Bag 44 Gallon (100ct)", sku: "JN-TRASH-44GAL" },
  41: { name: "Multi-Purpose Cleaner (1gal)", sku: "JN-CLEANER-MP" },
  44: { name: "Jumbo Toilet Paper (12pk)", sku: "JN-TP-JUMBO" },
  45: { name: "Hand Sanitizer (1gal refill)", sku: "JN-SANITIZER-GL" },
};

const USER_LOOKUP: Record<number, string> = {
  1: "John Smith",
  2: "Maria Garcia",
  3: "Bob Wilson",
  4: "Alice Chen",
};

// ---- Provider methods ----

export function listTransfers(customerID: number, query: ListTransfersQuery): PaginatedResult<InventoryTransfer> {
  if (customerID !== 1) return { items: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } };

  let items = [...transfers];

  if (query.status) {
    items = items.filter((t) => t.status === query.status);
  }

  if (query.partId) {
    items = items.filter((t) => t.partId === query.partId);
  }

  if (query.search) {
    const s = query.search.toLowerCase();
    items = items.filter(
      (t) =>
        t.transferNumber.toLowerCase().includes(s) ||
        t.partName?.toLowerCase().includes(s) ||
        t.fromLocationName?.toLowerCase().includes(s) ||
        t.toLocationName?.toLowerCase().includes(s) ||
        t.fromPropertyName?.toLowerCase().includes(s) ||
        t.toPropertyName?.toLowerCase().includes(s)
    );
  }

  // Sort
  const sortBy = query.sortBy ?? "createdAt";
  const sortOrder = query.sortOrder ?? "desc";
  items.sort((a, b) => {
    const aVal = a[sortBy as keyof InventoryTransfer] as string;
    const bVal = b[sortBy as keyof InventoryTransfer] as string;
    const cmp = (aVal ?? "").toString().localeCompare((bVal ?? "").toString());
    return sortOrder === "desc" ? -cmp : cmp;
  });

  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  return { items: paged, meta: { page, limit, total, totalPages } };
}

export function getTransfer(customerID: number, id: number): InventoryTransfer | null {
  if (customerID !== 1) return null;
  return transfers.find((t) => t.id === id) ?? null;
}

export function createTransfer(
  customerID: number,
  input: CreateTransferInput,
  requestedBy: number
): InventoryTransfer {
  const from = LOCATION_PROPERTY_MAP[input.fromLocationId];
  const to = LOCATION_PROPERTY_MAP[input.toLocationId];
  const part = PART_LOOKUP[input.partId];
  const now = new Date().toISOString();

  const newTransfer: InventoryTransfer = {
    id: nextId++,
    transferNumber: `TRF-2026-${String(nextSeq++).padStart(4, "0")}`,
    partId: input.partId,
    partName: part?.name ?? null,
    partNumber: part?.sku ?? null,
    fromLocationId: input.fromLocationId,
    fromLocationName: from?.locationName ?? null,
    fromPropertyId: from?.propertyId ?? 1,
    fromPropertyName: from?.propertyName ?? null,
    toLocationId: input.toLocationId,
    toLocationName: to?.locationName ?? null,
    toPropertyId: to?.propertyId ?? 1,
    toPropertyName: to?.propertyName ?? null,
    quantity: input.quantity,
    status: "Requested",
    requestedBy,
    requestedByName: USER_LOOKUP[requestedBy] ?? null,
    approvedBy: null,
    approvedByName: null,
    notes: input.notes ?? null,
    isInterProperty: (from?.propertyId ?? 0) !== (to?.propertyId ?? 0),
    createdAt: now,
    updatedAt: now,
    approvedAt: null,
    shippedAt: null,
    receivedAt: null,
    cancelledAt: null,
  };

  transfers.push(newTransfer);
  return newTransfer;
}

export function approveTransfer(
  customerID: number,
  id: number,
  approvedBy: number
): InventoryTransfer | null {
  if (customerID !== 1) return null;
  const idx = transfers.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  const transfer = transfers[idx]!;
  if (transfer.status !== "Requested") return null;

  const now = new Date().toISOString();
  transfer.status = "Approved";
  transfer.approvedBy = approvedBy;
  transfer.approvedByName = USER_LOOKUP[approvedBy] ?? null;
  transfer.approvedAt = now;
  transfer.updatedAt = now;
  return transfer;
}

export function shipTransfer(customerID: number, id: number): InventoryTransfer | null {
  if (customerID !== 1) return null;
  const idx = transfers.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  const transfer = transfers[idx]!;
  if (transfer.status !== "Approved" && transfer.status !== "Requested") return null;
  // Intra-property transfers can skip approval

  const now = new Date().toISOString();
  transfer.status = "InTransit";
  transfer.shippedAt = now;
  transfer.updatedAt = now;
  return transfer;
}

export function receiveTransfer(customerID: number, id: number): InventoryTransfer | null {
  if (customerID !== 1) return null;
  const idx = transfers.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  const transfer = transfers[idx]!;
  if (transfer.status !== "InTransit") return null;

  const now = new Date().toISOString();
  transfer.status = "Received";
  transfer.receivedAt = now;
  transfer.updatedAt = now;
  return transfer;
}

export function cancelTransfer(customerID: number, id: number): InventoryTransfer | null {
  if (customerID !== 1) return null;
  const idx = transfers.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  const transfer = transfers[idx]!;
  if (transfer.status === "Received") return null; // Cannot cancel received

  const now = new Date().toISOString();
  transfer.status = "Cancelled";
  transfer.cancelledAt = now;
  transfer.updatedAt = now;
  return transfer;
}
