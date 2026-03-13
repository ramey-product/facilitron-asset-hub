/**
 * Mock seed data for P1-25 Inventory Transfers.
 * Covers intra-property (same propertyId) and inter-property transfers.
 * Location/property IDs aligned with existing mock data.
 */

import type { InventoryTransfer } from "@asset-hub/shared";

// Locations reference
// id:1 = Main Warehouse (propertyId:1)
// id:2 = North Facility (propertyId:1)
// id:3 = South Facility (propertyId:2)
// id:4 = Mobile Unit A (propertyId:3)
// id:5 = East Campus (propertyId:2)

const LOCATION_PROPERTY_MAP: Record<number, { propertyId: number; propertyName: string; locationName: string }> = {
  1: { propertyId: 1, propertyName: "Rotten Robbie - Oakland", locationName: "Main Warehouse" },
  2: { propertyId: 1, propertyName: "Rotten Robbie - Oakland", locationName: "North Facility" },
  3: { propertyId: 2, propertyName: "Rotten Robbie - Fremont", locationName: "South Facility" },
  4: { propertyId: 3, propertyName: "Rotten Robbie - San Jose", locationName: "Mobile Unit A" },
  5: { propertyId: 2, propertyName: "Rotten Robbie - Fremont", locationName: "East Campus" },
};

function makeTransfer(
  id: number,
  seq: number,
  partId: number,
  partName: string,
  partNumber: string,
  fromLocationId: number,
  toLocationId: number,
  quantity: number,
  status: InventoryTransfer["status"],
  requestedBy: number,
  requestedByName: string,
  notes: string | null,
  dates: {
    createdAt: string;
    updatedAt: string;
    approvedAt?: string;
    shippedAt?: string;
    receivedAt?: string;
    cancelledAt?: string;
  },
  approvedBy?: number,
  approvedByName?: string
): InventoryTransfer {
  const from = LOCATION_PROPERTY_MAP[fromLocationId]!;
  const to = LOCATION_PROPERTY_MAP[toLocationId]!;
  const isInterProperty = from.propertyId !== to.propertyId;
  const year = 2026;

  return {
    id,
    transferNumber: `TRF-${year}-${String(seq).padStart(4, "0")}`,
    partId,
    partName,
    partNumber,
    fromLocationId,
    fromLocationName: from.locationName,
    fromPropertyId: from.propertyId,
    fromPropertyName: from.propertyName,
    toLocationId,
    toLocationName: to.locationName,
    toPropertyId: to.propertyId,
    toPropertyName: to.propertyName,
    quantity,
    status,
    requestedBy,
    requestedByName,
    approvedBy: approvedBy ?? null,
    approvedByName: approvedByName ?? null,
    notes,
    isInterProperty,
    createdAt: dates.createdAt,
    updatedAt: dates.updatedAt,
    approvedAt: dates.approvedAt ?? null,
    shippedAt: dates.shippedAt ?? null,
    receivedAt: dates.receivedAt ?? null,
    cancelledAt: dates.cancelledAt ?? null,
  };
}

export const mockTransfers: InventoryTransfer[] = [
  // Received transfers (completed)
  makeTransfer(1, 1, 21, "MERV 8 Filter (20x25x1)", "FL-MERV8-20X25", 1, 3, 24, "Received", 1, "John Smith", "Monthly filter restocking for South Facility", { createdAt: "2026-02-01T09:00:00Z", updatedAt: "2026-02-05T14:00:00Z", approvedAt: "2026-02-01T11:00:00Z", shippedAt: "2026-02-03T08:00:00Z", receivedAt: "2026-02-05T14:00:00Z" }, 2, "Maria Garcia"),
  makeTransfer(2, 2, 31, "LED T8 Tube (4ft, 18W)", "LT-LED-T8-4FT", 1, 4, 20, "Received", 1, "John Smith", "Retrofit stock for San Jose Mobile Unit", { createdAt: "2026-02-05T10:00:00Z", updatedAt: "2026-02-09T13:00:00Z", approvedAt: "2026-02-05T14:00:00Z", shippedAt: "2026-02-07T09:00:00Z", receivedAt: "2026-02-09T13:00:00Z" }, 2, "Maria Garcia"),
  makeTransfer(3, 3, 9, "Universal Flush Valve Kit", "PL-FLUSHKIT", 1, 2, 10, "Received", 3, "Bob Wilson", null, { createdAt: "2026-02-10T08:00:00Z", updatedAt: "2026-02-10T16:00:00Z", approvedAt: "2026-02-10T08:30:00Z", shippedAt: "2026-02-10T11:00:00Z", receivedAt: "2026-02-10T16:00:00Z" }, 1, "John Smith"),
  makeTransfer(4, 4, 40, "Trash Bag 44 Gallon (100ct)", "JN-TRASH-44GAL", 1, 5, 5, "Received", 3, "Bob Wilson", "Restocking East Campus janitorial supplies", { createdAt: "2026-02-12T09:00:00Z", updatedAt: "2026-02-15T14:00:00Z", approvedAt: "2026-02-12T10:00:00Z", shippedAt: "2026-02-13T09:00:00Z", receivedAt: "2026-02-15T14:00:00Z" }, 2, "Maria Garcia"),
  makeTransfer(5, 5, 1, "20A Circuit Breaker", "EL-BRK-20A", 1, 3, 15, "Received", 1, "John Smith", "Emergency restock for South Facility electrical work", { createdAt: "2026-02-15T08:00:00Z", updatedAt: "2026-02-17T11:00:00Z", approvedAt: "2026-02-15T09:00:00Z", shippedAt: "2026-02-16T08:00:00Z", receivedAt: "2026-02-17T11:00:00Z" }, 2, "Maria Garcia"),
  makeTransfer(6, 6, 14, "V-Belt A48", "HV-BELT-A48", 1, 2, 6, "Received", 1, "John Smith", null, { createdAt: "2026-02-18T10:00:00Z", updatedAt: "2026-02-18T15:00:00Z", shippedAt: "2026-02-18T11:30:00Z", receivedAt: "2026-02-18T15:00:00Z" }),

  // InTransit transfers
  makeTransfer(7, 7, 22, "MERV 13 Filter (20x25x1)", "FL-MERV13-20X25", 1, 4, 24, "InTransit", 1, "John Smith", "Filter upgrade for San Jose unit", { createdAt: "2026-03-10T09:00:00Z", updatedAt: "2026-03-12T08:00:00Z", approvedAt: "2026-03-10T10:00:00Z", shippedAt: "2026-03-12T08:00:00Z" }, 2, "Maria Garcia"),
  makeTransfer(8, 8, 15, "Run Capacitor 45/5 MFD", "HV-CAPACITOR-45", 1, 3, 5, "InTransit", 3, "Bob Wilson", "Critical HVAC stock transfer — compressor issues at South", { createdAt: "2026-03-11T11:00:00Z", updatedAt: "2026-03-13T07:00:00Z", approvedAt: "2026-03-11T12:00:00Z", shippedAt: "2026-03-13T07:00:00Z" }, 2, "Maria Garcia"),
  makeTransfer(9, 9, 45, "Hand Sanitizer (1gal refill)", "JN-SANITIZER-GL", 2, 5, 4, "InTransit", 1, "John Smith", null, { createdAt: "2026-03-12T14:00:00Z", updatedAt: "2026-03-13T09:00:00Z", shippedAt: "2026-03-13T09:00:00Z" }),

  // Approved — ready to ship (inter-property, awaiting physical shipment)
  makeTransfer(10, 10, 36, "Photoelectric Smoke Detector", "SF-SMOKE-PHT", 1, 4, 8, "Approved", 4, "Alice Chen", "Safety compliance restocking for San Jose site", { createdAt: "2026-03-12T08:00:00Z", updatedAt: "2026-03-12T14:30:00Z", approvedAt: "2026-03-12T14:30:00Z" }, 2, "Maria Garcia"),
  makeTransfer(11, 11, 3, "Duplex Outlet (20A)", "EL-OUTLET-DPX", 1, 5, 20, "Approved", 1, "John Smith", "Renovation project supply at East Campus", { createdAt: "2026-03-12T10:00:00Z", updatedAt: "2026-03-12T16:00:00Z", approvedAt: "2026-03-12T16:00:00Z" }, 2, "Maria Garcia"),
  makeTransfer(12, 12, 41, "Multi-Purpose Cleaner (1gal)", "JN-CLEANER-MP", 1, 3, 8, "Approved", 3, "Bob Wilson", null, { createdAt: "2026-03-13T07:00:00Z", updatedAt: "2026-03-13T10:00:00Z", approvedAt: "2026-03-13T10:00:00Z" }, 2, "Maria Garcia"),

  // Requested — pending approval (inter-property)
  makeTransfer(13, 13, 18, "R-410A Refrigerant (25lb)", "HV-REFRIG-R410A", 1, 4, 2, "Requested", 4, "Alice Chen", "Need refrigerant for San Jose unit servicing", { createdAt: "2026-03-13T08:00:00Z", updatedAt: "2026-03-13T08:00:00Z" }),
  makeTransfer(14, 14, 20, "Hot Surface Ignitor", "HV-IGNITOR-HOT", 1, 4, 3, "Requested", 1, "John Smith", "Urgent — Hayward unit is down", { createdAt: "2026-03-13T09:30:00Z", updatedAt: "2026-03-13T09:30:00Z" }),
  makeTransfer(15, 15, 32, "LED Panel Light (2x2, 40W)", "LT-LED-PANEL-2X2", 1, 3, 4, "Requested", 3, "Bob Wilson", "Lighting upgrade at South Facility break room", { createdAt: "2026-03-13T10:00:00Z", updatedAt: "2026-03-13T10:00:00Z" }),
  makeTransfer(16, 16, 11, "Lavatory Faucet (Chrome)", "PL-FAUCET-LAV", 1, 5, 3, "Requested", 1, "John Smith", "Restroom renovation East Campus", { createdAt: "2026-03-12T15:00:00Z", updatedAt: "2026-03-12T15:00:00Z" }),

  // Intra-property (no approval needed)
  makeTransfer(17, 17, 27, "Drywall Screws #6 x 1-5/8\" (1lb)", "FS-SCREW-DRYWALL", 1, 2, 5, "Received", 1, "John Smith", null, { createdAt: "2026-03-05T09:00:00Z", updatedAt: "2026-03-05T11:00:00Z", shippedAt: "2026-03-05T09:30:00Z", receivedAt: "2026-03-05T11:00:00Z" }),
  makeTransfer(18, 18, 44, "Jumbo Toilet Paper (12pk)", "JN-TP-JUMBO", 1, 2, 8, "Received", 3, "Bob Wilson", null, { createdAt: "2026-03-08T08:00:00Z", updatedAt: "2026-03-08T10:00:00Z", shippedAt: "2026-03-08T08:30:00Z", receivedAt: "2026-03-08T10:00:00Z" }),
  makeTransfer(19, 19, 5, "Single Pole Switch (15A)", "EL-SWITCH-SP", 1, 2, 10, "InTransit", 1, "John Smith", null, { createdAt: "2026-03-13T07:00:00Z", updatedAt: "2026-03-13T09:00:00Z", shippedAt: "2026-03-13T09:00:00Z" }),

  // Cancelled transfers
  makeTransfer(20, 20, 6, "200A Main Breaker Panel", "EL-PANEL-200A", 1, 3, 1, "Cancelled", 1, "John Smith", "Wrong part ordered — project scope changed", { createdAt: "2026-03-01T10:00:00Z", updatedAt: "2026-03-02T14:00:00Z", cancelledAt: "2026-03-02T14:00:00Z" }),
  makeTransfer(21, 21, 37, "Fire Extinguisher (5lb ABC)", "SF-EXTINGUISH-5", 1, 4, 3, "Cancelled", 4, "Alice Chen", "Vendor will ship directly to site instead", { createdAt: "2026-03-03T11:00:00Z", updatedAt: "2026-03-04T09:00:00Z", cancelledAt: "2026-03-04T09:00:00Z" }),
  makeTransfer(22, 22, 16, "30A Contactor (2-Pole)", "HV-CONTACTOR-30A", 1, 3, 2, "Cancelled", 3, "Bob Wilson", "Part found locally — transfer not needed", { createdAt: "2026-03-06T13:00:00Z", updatedAt: "2026-03-07T10:00:00Z", cancelledAt: "2026-03-07T10:00:00Z" }),
];
