/**
 * Mock seed data for P1-24 Kitting.
 * Kits group multiple parts for common maintenance tasks.
 * Part IDs reference existing parts from inventory.ts.
 */

import type { Kit, KitItem } from "@asset-hub/shared";

// ---- Kit Items helper type (without kitId, added when constructing) ----

interface KitItemSeed {
  id: number;
  partId: number;
  partName: string;
  partNumber: string;
  quantity: number;
  unitCost: number;
}

interface KitSeed {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  items: KitItemSeed[];
}

const kitSeeds: KitSeed[] = [
  {
    id: 1,
    name: "HVAC Filter Change Kit",
    description: "Everything needed for a standard HVAC filter replacement — covers most commercial RTU configurations.",
    categoryId: 3,
    categoryName: "HVAC",
    isActive: true,
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2026-01-15T08:00:00Z",
    items: [
      { id: 1, partId: 21, partName: "MERV 8 Filter (20x25x1)", partNumber: "FL-MERV8-20X25", quantity: 4, unitCost: 5.50 },
      { id: 2, partId: 22, partName: "MERV 13 Filter (20x25x1)", partNumber: "FL-MERV13-20X25", quantity: 2, unitCost: 14.75 },
      { id: 3, partId: 23, partName: "MERV 8 Filter (16x20x1)", partNumber: "FL-MERV8-16X20", quantity: 4, unitCost: 4.75 },
    ],
  },
  {
    id: 2,
    name: "Plumbing Repair Kit",
    description: "Standard supply kit for minor plumbing repairs — toilet flush valve, p-trap, supply lines.",
    categoryId: 2,
    categoryName: "Plumbing",
    isActive: true,
    createdAt: "2025-09-15T10:00:00Z",
    updatedAt: "2026-02-01T09:00:00Z",
    items: [
      { id: 4, partId: 9, partName: "Universal Flush Valve Kit", partNumber: "PL-FLUSHKIT", quantity: 2, unitCost: 12.49 },
      { id: 5, partId: 12, partName: "1-1/2\" P-Trap (PVC)", partNumber: "PL-TRAP-1.5", quantity: 2, unitCost: 6.75 },
      { id: 6, partId: 13, partName: "3/8\" Supply Line (20\")", partNumber: "PL-SUPPLY-3/8", quantity: 4, unitCost: 8.99 },
      { id: 7, partId: 8, partName: "1\" Ball Valve (Brass)", partNumber: "PL-VALVE-1IN", quantity: 1, unitCost: 15.99 },
    ],
  },
  {
    id: 3,
    name: "Electrical Panel Service Kit",
    description: "Components for panel service, outlet replacement, and circuit work.",
    categoryId: 1,
    categoryName: "Electrical",
    isActive: true,
    createdAt: "2025-10-01T10:00:00Z",
    updatedAt: "2026-02-10T14:00:00Z",
    items: [
      { id: 8, partId: 1, partName: "20A Circuit Breaker", partNumber: "EL-BRK-20A", quantity: 4, unitCost: 8.50 },
      { id: 9, partId: 3, partName: "Duplex Outlet (20A)", partNumber: "EL-OUTLET-DPX", quantity: 6, unitCost: 3.25 },
      { id: 10, partId: 7, partName: "GFCI Outlet (20A)", partNumber: "EL-GFCI-20A", quantity: 3, unitCost: 18.50 },
      { id: 11, partId: 5, partName: "Single Pole Switch (15A)", partNumber: "EL-SWITCH-SP", quantity: 4, unitCost: 2.10 },
    ],
  },
  {
    id: 4,
    name: "HVAC Capacitor & Contactor Kit",
    description: "Replacement run capacitors and contactors — covers the most common HVAC compressor failures.",
    categoryId: 3,
    categoryName: "HVAC",
    isActive: true,
    createdAt: "2025-10-15T10:00:00Z",
    updatedAt: "2026-01-20T11:00:00Z",
    items: [
      { id: 12, partId: 15, partName: "Run Capacitor 45/5 MFD", partNumber: "HV-CAPACITOR-45", quantity: 3, unitCost: 18.75 },
      { id: 13, partId: 16, partName: "30A Contactor (2-Pole)", partNumber: "HV-CONTACTOR-30A", quantity: 2, unitCost: 22.50 },
      { id: 14, partId: 20, partName: "Hot Surface Ignitor", partNumber: "HV-IGNITOR-HOT", quantity: 2, unitCost: 28.00 },
    ],
  },
  {
    id: 5,
    name: "Lighting Retrofit Kit",
    description: "LED retrofit components for standard office/warehouse fluorescent fixture upgrades.",
    categoryId: 6,
    categoryName: "Lighting",
    isActive: true,
    createdAt: "2025-11-01T10:00:00Z",
    updatedAt: "2026-02-15T09:30:00Z",
    items: [
      { id: 15, partId: 31, partName: "LED T8 Tube (4ft, 18W)", partNumber: "LT-LED-T8-4FT", quantity: 8, unitCost: 7.99 },
      { id: 16, partId: 35, partName: "Occupancy Sensor Switch", partNumber: "LT-SENSOR-OCC", quantity: 2, unitCost: 24.00 },
    ],
  },
  {
    id: 6,
    name: "Safety Compliance Kit",
    description: "Annual safety inspection restocking kit — smoke detectors, first aid, eye wash.",
    categoryId: 7,
    categoryName: "Safety",
    isActive: true,
    createdAt: "2025-11-15T10:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z",
    items: [
      { id: 17, partId: 36, partName: "Photoelectric Smoke Detector", partNumber: "SF-SMOKE-PHT", quantity: 4, unitCost: 22.00 },
      { id: 18, partId: 37, partName: "Fire Extinguisher (5lb ABC)", partNumber: "SF-EXTINGUISH-5", quantity: 2, unitCost: 48.00 },
      { id: 19, partId: 38, partName: "First Aid Kit (50-person)", partNumber: "SF-FIRSTAID-KIT", quantity: 1, unitCost: 35.00 },
      { id: 20, partId: 39, partName: "Emergency Eyewash Cartridge", partNumber: "SF-EYEWASH-CART", quantity: 2, unitCost: 42.00 },
    ],
  },
  {
    id: 7,
    name: "Janitorial Supply Replenishment Kit",
    description: "Monthly replenishment kit for high-traffic facility restrooms and common areas.",
    categoryId: 8,
    categoryName: "Janitorial",
    isActive: true,
    createdAt: "2025-12-01T10:00:00Z",
    updatedAt: "2026-03-05T08:00:00Z",
    items: [
      { id: 21, partId: 40, partName: "Trash Bag 44 Gallon (100ct)", partNumber: "JN-TRASH-44GAL", quantity: 3, unitCost: 32.00 },
      { id: 22, partId: 41, partName: "Multi-Purpose Cleaner (1gal)", partNumber: "JN-CLEANER-MP", quantity: 4, unitCost: 15.99 },
      { id: 23, partId: 43, partName: "Paper Towel Roll (6pk)", partNumber: "JN-PAPER-TOWEL", quantity: 3, unitCost: 44.00 },
      { id: 24, partId: 44, partName: "Jumbo Toilet Paper (12pk)", partNumber: "JN-TP-JUMBO", quantity: 4, unitCost: 38.00 },
      { id: 25, partId: 45, partName: "Hand Sanitizer (1gal refill)", partNumber: "JN-SANITIZER-GL", quantity: 2, unitCost: 22.00 },
    ],
  },
  {
    id: 8,
    name: "HVAC Belt & Motor Preventive Maintenance Kit",
    description: "PM kit for annual blower motor and belt inspection on commercial air handlers.",
    categoryId: 3,
    categoryName: "HVAC",
    isActive: true,
    createdAt: "2026-01-05T10:00:00Z",
    updatedAt: "2026-02-20T11:00:00Z",
    items: [
      { id: 26, partId: 14, partName: "V-Belt A48", partNumber: "HV-BELT-A48", quantity: 2, unitCost: 11.25 },
      { id: 27, partId: 19, partName: "1/3 HP Blower Motor", partNumber: "HV-MOTOR-1/3HP", quantity: 1, unitCost: 135.00 },
      { id: 28, partId: 17, partName: "Programmable Thermostat", partNumber: "HV-THERMOSTAT-PRG", quantity: 1, unitCost: 45.00 },
    ],
  },
  {
    id: 9,
    name: "General Fastener Starter Pack",
    description: "Assorted fasteners for daily maintenance work — bolts, screws, anchors, nuts, washers.",
    categoryId: 5,
    categoryName: "Fasteners",
    isActive: true,
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-02-28T09:00:00Z",
    items: [
      { id: 29, partId: 26, partName: "3/8\" x 2\" Hex Bolt (25pk)", partNumber: "FS-BOLT-3/8X2", quantity: 2, unitCost: 9.50 },
      { id: 30, partId: 27, partName: "Drywall Screws #6 x 1-5/8\" (1lb)", partNumber: "FS-SCREW-DRYWALL", quantity: 2, unitCost: 6.25 },
      { id: 31, partId: 28, partName: "1/4\" Concrete Anchor (50pk)", partNumber: "FS-ANCHOR-1/4", quantity: 1, unitCost: 24.99 },
      { id: 32, partId: 29, partName: "3/8\" Hex Nut (100pk)", partNumber: "FS-NUT-3/8", quantity: 1, unitCost: 7.50 },
      { id: 33, partId: 30, partName: "3/8\" Flat Washer (100pk)", partNumber: "FS-WASHER-3/8", quantity: 1, unitCost: 4.99 },
    ],
  },
  {
    id: 10,
    name: "Water Quality Maintenance Kit",
    description: "Water filter replacement and supply line service kit for drinking water and utility connections.",
    categoryId: 2,
    categoryName: "Plumbing",
    isActive: true,
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-03-10T10:00:00Z",
    items: [
      { id: 34, partId: 24, partName: "10\" Water Filter Cartridge", partNumber: "FL-WATER-10", quantity: 3, unitCost: 8.99 },
      { id: 35, partId: 10, partName: "2\" PVC Pipe (10ft)", partNumber: "PL-PIPE-PVC-2", quantity: 2, unitCost: 7.25 },
      { id: 36, partId: 8, partName: "1\" Ball Valve (Brass)", partNumber: "PL-VALVE-1IN", quantity: 2, unitCost: 15.99 },
    ],
  },
  {
    id: 11,
    name: "Emergency Response Kit",
    description: "Quick-access emergency response kit for first-responder facilities maintenance. Keep stocked at all times.",
    categoryId: 7,
    categoryName: "Safety",
    isActive: false, // Deprecated — replaced by Safety Compliance Kit
    createdAt: "2025-07-01T10:00:00Z",
    updatedAt: "2026-01-05T14:00:00Z",
    items: [
      { id: 37, partId: 37, partName: "Fire Extinguisher (5lb ABC)", partNumber: "SF-EXTINGUISH-5", quantity: 1, unitCost: 48.00 },
      { id: 38, partId: 38, partName: "First Aid Kit (50-person)", partNumber: "SF-FIRSTAID-KIT", quantity: 1, unitCost: 35.00 },
    ],
  },
];

// Build final Kit array with proper KitItem shapes
function buildKit(seed: KitSeed): Kit {
  const items: KitItem[] = seed.items.map((item) => ({
    id: item.id,
    kitId: seed.id,
    partId: item.partId,
    partName: item.partName,
    partNumber: item.partNumber,
    quantity: item.quantity,
    unitCost: item.unitCost,
  }));

  const estimatedCost = items.reduce(
    (sum, item) => sum + item.quantity * (item.unitCost ?? 0),
    0
  );

  return {
    id: seed.id,
    name: seed.name,
    description: seed.description,
    categoryId: seed.categoryId,
    categoryName: seed.categoryName,
    isActive: seed.isActive,
    totalComponents: items.length,
    estimatedCost: Math.round(estimatedCost * 100) / 100,
    items,
    createdAt: seed.createdAt,
    updatedAt: seed.updatedAt,
  };
}

export const mockKits: Kit[] = kitSeeds.map(buildKit);
