import type {
  Kit,
  KitItem,
  ListKitsQuery,
  CreateKitInput,
  UpdateKitInput,
  KitCheckoutInput,
  KitCheckoutResult,
} from "@asset-hub/shared";
import { mockKits } from "./data/kitting.js";
import type { PaginatedResult } from "../../types/providers.js";

// Working copies for in-memory mutations
const kits: Kit[] = mockKits.map((k) => ({
  ...k,
  items: k.items.map((item) => ({ ...item })),
}));
let nextKitId = Math.max(...kits.map((k) => k.id)) + 1;
let nextItemId = Math.max(...kits.flatMap((k) => k.items.map((i) => i.id))) + 1;

// Part lookup for display names (subset of inventory mock)
const PART_LOOKUP: Record<number, { name: string; sku: string; unitCost: number }> = {
  1: { name: "20A Circuit Breaker", sku: "EL-BRK-20A", unitCost: 8.50 },
  2: { name: "12 AWG THHN Wire (500ft)", sku: "EL-WIRE-12G", unitCost: 89.99 },
  3: { name: "Duplex Outlet (20A)", sku: "EL-OUTLET-DPX", unitCost: 3.25 },
  5: { name: "Single Pole Switch (15A)", sku: "EL-SWITCH-SP", unitCost: 2.10 },
  7: { name: "GFCI Outlet (20A)", sku: "EL-GFCI-20A", unitCost: 18.50 },
  8: { name: "1\" Ball Valve (Brass)", sku: "PL-VALVE-1IN", unitCost: 15.99 },
  9: { name: "Universal Flush Valve Kit", sku: "PL-FLUSHKIT", unitCost: 12.49 },
  10: { name: "2\" PVC Pipe (10ft)", sku: "PL-PIPE-PVC-2", unitCost: 7.25 },
  11: { name: "Lavatory Faucet (Chrome)", sku: "PL-FAUCET-LAV", unitCost: 65.00 },
  12: { name: "1-1/2\" P-Trap (PVC)", sku: "PL-TRAP-1.5", unitCost: 6.75 },
  13: { name: "3/8\" Supply Line (20\")", sku: "PL-SUPPLY-3/8", unitCost: 8.99 },
  14: { name: "V-Belt A48", sku: "HV-BELT-A48", unitCost: 11.25 },
  15: { name: "Run Capacitor 45/5 MFD", sku: "HV-CAPACITOR-45", unitCost: 18.75 },
  16: { name: "30A Contactor (2-Pole)", sku: "HV-CONTACTOR-30A", unitCost: 22.50 },
  17: { name: "Programmable Thermostat", sku: "HV-THERMOSTAT-PRG", unitCost: 45.00 },
  19: { name: "1/3 HP Blower Motor", sku: "HV-MOTOR-1/3HP", unitCost: 135.00 },
  20: { name: "Hot Surface Ignitor", sku: "HV-IGNITOR-HOT", unitCost: 28.00 },
  21: { name: "MERV 8 Filter (20x25x1)", sku: "FL-MERV8-20X25", unitCost: 5.50 },
  22: { name: "MERV 13 Filter (20x25x1)", sku: "FL-MERV13-20X25", unitCost: 14.75 },
  23: { name: "MERV 8 Filter (16x20x1)", sku: "FL-MERV8-16X20", unitCost: 4.75 },
  24: { name: "10\" Water Filter Cartridge", sku: "FL-WATER-10", unitCost: 8.99 },
  26: { name: "3/8\" x 2\" Hex Bolt (25pk)", sku: "FS-BOLT-3/8X2", unitCost: 9.50 },
  27: { name: "Drywall Screws #6 x 1-5/8\" (1lb)", sku: "FS-SCREW-DRYWALL", unitCost: 6.25 },
  28: { name: "1/4\" Concrete Anchor (50pk)", sku: "FS-ANCHOR-1/4", unitCost: 24.99 },
  29: { name: "3/8\" Hex Nut (100pk)", sku: "FS-NUT-3/8", unitCost: 7.50 },
  30: { name: "3/8\" Flat Washer (100pk)", sku: "FS-WASHER-3/8", unitCost: 4.99 },
  31: { name: "LED T8 Tube (4ft, 18W)", sku: "LT-LED-T8-4FT", unitCost: 7.99 },
  35: { name: "Occupancy Sensor Switch", sku: "LT-SENSOR-OCC", unitCost: 24.00 },
  36: { name: "Photoelectric Smoke Detector", sku: "SF-SMOKE-PHT", unitCost: 22.00 },
  37: { name: "Fire Extinguisher (5lb ABC)", sku: "SF-EXTINGUISH-5", unitCost: 48.00 },
  38: { name: "First Aid Kit (50-person)", sku: "SF-FIRSTAID-KIT", unitCost: 35.00 },
  39: { name: "Emergency Eyewash Cartridge", sku: "SF-EYEWASH-CART", unitCost: 42.00 },
  40: { name: "Trash Bag 44 Gallon (100ct)", sku: "JN-TRASH-44GAL", unitCost: 32.00 },
  41: { name: "Multi-Purpose Cleaner (1gal)", sku: "JN-CLEANER-MP", unitCost: 15.99 },
  43: { name: "Paper Towel Roll (6pk)", sku: "JN-PAPER-TOWEL", unitCost: 44.00 },
  44: { name: "Jumbo Toilet Paper (12pk)", sku: "JN-TP-JUMBO", unitCost: 38.00 },
  45: { name: "Hand Sanitizer (1gal refill)", sku: "JN-SANITIZER-GL", unitCost: 22.00 },
};

// Simulate stock per location (mock — enough stock for most checkouts except intentional failures)
const MOCK_STOCK: Record<string, number> = {}; // "partId:locationId" -> qty

function getStock(partId: number, locationId: number): number {
  const key = `${partId}:${locationId}`;
  if (!(key in MOCK_STOCK)) {
    // Default: ample stock at location 1, moderate elsewhere, scarce at location 4
    if (locationId === 1) return 50;
    if (locationId === 4) return 2; // intentionally tight to demonstrate insufficient stock
    return 15;
  }
  return MOCK_STOCK[key] ?? 0;
}

function decrementStock(partId: number, locationId: number, qty: number) {
  const key = `${partId}:${locationId}`;
  MOCK_STOCK[key] = Math.max(0, getStock(partId, locationId) - qty);
}

function recalcKit(kit: Kit): Kit {
  const estimatedCost = kit.items.reduce(
    (sum, item) => sum + item.quantity * (item.unitCost ?? 0),
    0
  );
  kit.totalComponents = kit.items.length;
  kit.estimatedCost = Math.round(estimatedCost * 100) / 100;
  kit.updatedAt = new Date().toISOString();
  return kit;
}

// ---- Provider methods ----

export function listKits(customerID: number, query: ListKitsQuery): PaginatedResult<Kit> {
  if (customerID !== 1) return { items: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } };

  let items = [...kits];

  if (query.search) {
    const s = query.search.toLowerCase();
    items = items.filter(
      (k) =>
        k.name.toLowerCase().includes(s) ||
        k.description?.toLowerCase().includes(s) ||
        k.categoryName?.toLowerCase().includes(s)
    );
  }

  if (query.categoryId !== undefined) {
    items = items.filter((k) => k.categoryId === query.categoryId);
  }

  if (query.isActive !== undefined) {
    items = items.filter((k) => k.isActive === query.isActive);
  }

  items.sort((a, b) => a.name.localeCompare(b.name));

  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  return { items: paged, meta: { page, limit, total, totalPages } };
}

export function getKit(customerID: number, id: number): Kit | null {
  if (customerID !== 1) return null;
  return kits.find((k) => k.id === id) ?? null;
}

export function createKit(customerID: number, input: CreateKitInput): Kit {
  const now = new Date().toISOString();
  const items: KitItem[] = input.items.map((i) => {
    const part = PART_LOOKUP[i.partId];
    return {
      id: nextItemId++,
      kitId: nextKitId,
      partId: i.partId,
      partName: part?.name ?? null,
      partNumber: part?.sku ?? null,
      quantity: i.quantity,
      unitCost: part?.unitCost ?? null,
    };
  });

  const estimatedCost = items.reduce(
    (sum, item) => sum + item.quantity * (item.unitCost ?? 0),
    0
  );

  const newKit: Kit = {
    id: nextKitId++,
    name: input.name,
    description: input.description ?? null,
    categoryId: input.categoryId ?? null,
    categoryName: null,
    isActive: true,
    totalComponents: items.length,
    estimatedCost: Math.round(estimatedCost * 100) / 100,
    items,
    createdAt: now,
    updatedAt: now,
  };

  kits.push(newKit);
  return newKit;
}

export function updateKit(customerID: number, id: number, input: UpdateKitInput): Kit | null {
  if (customerID !== 1) return null;
  const idx = kits.findIndex((k) => k.id === id);
  if (idx === -1) return null;

  const updated = kits[idx]!;

  if (input.name !== undefined) updated.name = input.name;
  if (input.description !== undefined) updated.description = input.description ?? null;
  if (input.categoryId !== undefined) updated.categoryId = input.categoryId ?? null;
  if (input.isActive !== undefined) updated.isActive = input.isActive;

  if (input.items !== undefined) {
    // Replace all items
    const currentKitId = id;
    updated.items = input.items.map((i) => {
      const part = PART_LOOKUP[i.partId];
      return {
        id: nextItemId++,
        kitId: currentKitId,
        partId: i.partId,
        partName: part?.name ?? null,
        partNumber: part?.sku ?? null,
        quantity: i.quantity,
        unitCost: part?.unitCost ?? null,
      };
    });
  }

  recalcKit(updated);
  return updated;
}

export function deleteKit(customerID: number, id: number): boolean {
  if (customerID !== 1) return false;
  const idx = kits.findIndex((k) => k.id === id);
  if (idx === -1) return false;
  // Soft delete
  kits[idx]!.isActive = false;
  kits[idx]!.updatedAt = new Date().toISOString();
  return true;
}

export function checkoutKit(customerID: number, input: KitCheckoutInput): KitCheckoutResult {
  if (customerID !== 1) {
    return {
      success: false,
      kitId: input.kitId,
      kitName: "",
      itemsCheckedOut: [],
      insufficientStock: [],
    };
  }

  const kit = kits.find((k) => k.id === input.kitId);
  if (!kit) {
    return {
      success: false,
      kitId: input.kitId,
      kitName: "Unknown Kit",
      itemsCheckedOut: [],
      insufficientStock: null,
    };
  }

  // Check stock for all items at the specified location
  const insufficient: { partId: number; partName: string; required: number; available: number }[] = [];

  for (const item of kit.items) {
    const available = getStock(item.partId, input.locationId);
    if (available < item.quantity) {
      insufficient.push({
        partId: item.partId,
        partName: item.partName ?? `Part #${item.partId}`,
        required: item.quantity,
        available,
      });
    }
  }

  if (insufficient.length > 0) {
    return {
      success: false,
      kitId: kit.id,
      kitName: kit.name,
      itemsCheckedOut: [],
      insufficientStock: insufficient,
    };
  }

  // All items have sufficient stock — decrement
  for (const item of kit.items) {
    decrementStock(item.partId, input.locationId, item.quantity);
  }

  return {
    success: true,
    kitId: kit.id,
    kitName: kit.name,
    itemsCheckedOut: kit.items.map((item) => ({
      partId: item.partId,
      partName: item.partName ?? `Part #${item.partId}`,
      quantity: item.quantity,
    })),
    insufficientStock: null,
  };
}
