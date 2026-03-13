/**
 * Mock seed data for P1-27 Pick Lists.
 * 8 pick lists in various statuses with realistic items.
 */

import type { PickList } from "@asset-hub/shared";

// Helper to get ISO date string N days ago
function daysAgo(n: number, hour = 8): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
}

export const mockPickLists: PickList[] = [
  // --- Completed (2) ---
  {
    id: 1,
    customerID: 1,
    name: "HVAC Filter Change - Q1",
    status: "completed",
    generatedFrom: "scheduled-wos",
    dateRange: "week",
    woIds: [145, 148],
    items: [
      { id: 1, pickListId: 1, partId: 21, partName: "MERV 8 Filter (20x25x1)", partSku: "FL-MERV8-20X25", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf J-1", quantityNeeded: 12, quantityPicked: 12, status: "picked", woReference: "WO-2024-0145" },
      { id: 2, pickListId: 1, partId: 22, partName: "MERV 13 Filter (20x25x1)", partSku: "FL-MERV13-20X25", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf J-2", quantityNeeded: 6, quantityPicked: 6, status: "picked", woReference: "WO-2024-0145" },
      { id: 3, pickListId: 1, partId: 23, partName: "MERV 8 Filter (16x20x1)", partSku: "FL-MERV8-16X20", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf J-1", quantityNeeded: 8, quantityPicked: 8, status: "picked", woReference: "WO-2024-0148" },
      { id: 4, pickListId: 1, partId: 14, partName: "V-Belt A48", partSku: "HV-BELT-A48", locationId: 1, locationName: "Main Warehouse", storageLocation: "Bin F-2", quantityNeeded: 2, quantityPicked: 2, status: "picked", woReference: "WO-2024-0148" },
    ],
    totalItems: 4,
    pickedItems: 4,
    createdBy: "Sarah Chen",
    createdAt: daysAgo(14, 7),
    completedAt: daysAgo(13, 10),
  },
  {
    id: 2,
    customerID: 1,
    name: "Emergency Electrical Repair",
    status: "completed",
    generatedFrom: "manual",
    dateRange: null,
    woIds: [135],
    items: [
      { id: 5, pickListId: 2, partId: 1, partName: "20A Circuit Breaker", partSku: "EL-BRK-20A", locationId: 1, locationName: "Main Warehouse", storageLocation: "Bin A-12", quantityNeeded: 4, quantityPicked: 4, status: "picked", woReference: "WO-2024-0135" },
      { id: 6, pickListId: 2, partId: 3, partName: "Duplex Outlet (20A)", partSku: "EL-OUTLET-DPX", locationId: 1, locationName: "Main Warehouse", storageLocation: "Bin A-14", quantityNeeded: 6, quantityPicked: 6, status: "picked", woReference: "WO-2024-0135" },
      { id: 7, pickListId: 2, partId: 2, partName: "12 AWG THHN Wire (500ft)", partSku: "EL-WIRE-12G", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf B-3", quantityNeeded: 1, quantityPicked: 1, status: "picked", woReference: "WO-2024-0135" },
    ],
    totalItems: 3,
    pickedItems: 3,
    createdBy: "Mike Johnson",
    createdAt: daysAgo(20, 6),
    completedAt: daysAgo(20, 9),
  },

  // --- In-Progress (3) ---
  {
    id: 3,
    customerID: 1,
    name: "Restroom Renovation - North Wing",
    status: "in-progress",
    generatedFrom: "scheduled-wos",
    dateRange: "today",
    woIds: [150, 151],
    items: [
      { id: 8, pickListId: 3, partId: 9, partName: "Universal Flush Valve Kit", partSku: "PL-FLUSHKIT", locationId: 2, locationName: "North Facility", storageLocation: "Bin D-8", quantityNeeded: 4, quantityPicked: 4, status: "picked", woReference: "WO-2024-0150" },
      { id: 9, pickListId: 3, partId: 11, partName: "Lavatory Faucet (Chrome)", partSku: "PL-FAUCET-LAV", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf E-2", quantityNeeded: 3, quantityPicked: 2, status: "picked", woReference: "WO-2024-0150" },
      { id: 10, pickListId: 3, partId: 12, partName: '1-1/2" P-Trap (PVC)', partSku: "PL-TRAP-1.5", locationId: 1, locationName: "Main Warehouse", storageLocation: "Bin D-6", quantityNeeded: 3, quantityPicked: 0, status: "pending", woReference: "WO-2024-0151" },
      { id: 11, pickListId: 3, partId: 13, partName: '3/8" Supply Line (20")', partSku: "PL-SUPPLY-3/8", locationId: 1, locationName: "Main Warehouse", storageLocation: "Bin D-7", quantityNeeded: 6, quantityPicked: 0, status: "pending", woReference: "WO-2024-0151" },
      { id: 12, pickListId: 3, partId: 8, partName: '1" Ball Valve (Brass)', partSku: "PL-VALVE-1IN", locationId: 1, locationName: "Main Warehouse", storageLocation: "Bin D-5", quantityNeeded: 2, quantityPicked: 0, status: "pending", woReference: "WO-2024-0151" },
    ],
    totalItems: 5,
    pickedItems: 2,
    createdBy: "Tom Wilson",
    createdAt: daysAgo(1, 7),
    completedAt: null,
  },
  {
    id: 4,
    customerID: 1,
    name: "Lighting Upgrade - South Hallways",
    status: "in-progress",
    generatedFrom: "manual",
    dateRange: null,
    woIds: [138],
    items: [
      { id: 13, pickListId: 4, partId: 31, partName: "LED T8 Tube (4ft, 18W)", partSku: "LT-LED-T8-4FT", locationId: 3, locationName: "South Facility", storageLocation: "Shelf L-1", quantityNeeded: 20, quantityPicked: 12, status: "picked", woReference: "WO-2024-0138" },
      { id: 14, pickListId: 4, partId: 32, partName: "LED Panel Light (2x2, 40W)", partSku: "LT-LED-PANEL-2X2", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf L-2", quantityNeeded: 4, quantityPicked: 0, status: "pending", woReference: "WO-2024-0138" },
      { id: 15, pickListId: 4, partId: 35, partName: "Occupancy Sensor Switch", partSku: "LT-SENSOR-OCC", locationId: 1, locationName: "Main Warehouse", storageLocation: "Bin A-16", quantityNeeded: 6, quantityPicked: 0, status: "pending", woReference: "WO-2024-0138" },
    ],
    totalItems: 3,
    pickedItems: 1,
    createdBy: "Sarah Chen",
    createdAt: daysAgo(3, 9),
    completedAt: null,
  },
  {
    id: 5,
    customerID: 1,
    name: "Weekly Safety Replenishment",
    status: "in-progress",
    generatedFrom: "scheduled-wos",
    dateRange: "week",
    woIds: [152, 153],
    items: [
      { id: 16, pickListId: 5, partId: 36, partName: "Photoelectric Smoke Detector", partSku: "SF-SMOKE-PHT", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf M-1", quantityNeeded: 3, quantityPicked: 3, status: "picked", woReference: "WO-2024-0152" },
      { id: 17, pickListId: 5, partId: 37, partName: "Fire Extinguisher (5lb ABC)", partSku: "SF-EXTINGUISH-5", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf M-2", quantityNeeded: 2, quantityPicked: 1, status: "picked", woReference: "WO-2024-0152" },
      { id: 18, pickListId: 5, partId: 38, partName: "First Aid Kit (50-person)", partSku: "SF-FIRSTAID-KIT", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf M-3", quantityNeeded: 1, quantityPicked: 0, status: "short", woReference: "WO-2024-0153" },
      { id: 19, pickListId: 5, partId: 39, partName: "Emergency Eyewash Cartridge", partSku: "SF-EYEWASH-CART", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf M-4", quantityNeeded: 2, quantityPicked: 0, status: "pending", woReference: "WO-2024-0153" },
    ],
    totalItems: 4,
    pickedItems: 2,
    createdBy: "Mike Johnson",
    createdAt: daysAgo(2, 6),
    completedAt: null,
  },

  // --- Draft (2) ---
  {
    id: 6,
    customerID: 1,
    name: "HVAC Preventive Maintenance - April",
    status: "draft",
    generatedFrom: "scheduled-wos",
    dateRange: "week",
    woIds: [160, 161, 162],
    items: [
      { id: 20, pickListId: 6, partId: 14, partName: "V-Belt A48", partSku: "HV-BELT-A48", locationId: 1, locationName: "Main Warehouse", storageLocation: "Bin F-2", quantityNeeded: 4, quantityPicked: 0, status: "pending", woReference: "WO-2024-0160" },
      { id: 21, pickListId: 6, partId: 15, partName: "Run Capacitor 45/5 MFD", partSku: "HV-CAPACITOR-45", locationId: 1, locationName: "Main Warehouse", storageLocation: "Bin F-4", quantityNeeded: 2, quantityPicked: 0, status: "pending", woReference: "WO-2024-0160" },
      { id: 22, pickListId: 6, partId: 16, partName: "30A Contactor (2-Pole)", partSku: "HV-CONTACTOR-30A", locationId: 1, locationName: "Main Warehouse", storageLocation: "Bin F-5", quantityNeeded: 1, quantityPicked: 0, status: "pending", woReference: "WO-2024-0161" },
      { id: 23, pickListId: 6, partId: 21, partName: "MERV 8 Filter (20x25x1)", partSku: "FL-MERV8-20X25", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf J-1", quantityNeeded: 24, quantityPicked: 0, status: "pending", woReference: "WO-2024-0162" },
      { id: 24, pickListId: 6, partId: 22, partName: "MERV 13 Filter (20x25x1)", partSku: "FL-MERV13-20X25", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf J-2", quantityNeeded: 12, quantityPicked: 0, status: "pending", woReference: "WO-2024-0162" },
      { id: 25, pickListId: 6, partId: 20, partName: "Hot Surface Ignitor", partSku: "HV-IGNITOR-HOT", locationId: 1, locationName: "Main Warehouse", storageLocation: "Bin F-6", quantityNeeded: 3, quantityPicked: 0, status: "pending", woReference: "WO-2024-0161" },
    ],
    totalItems: 6,
    pickedItems: 0,
    createdBy: "Sarah Chen",
    createdAt: daysAgo(0, 14),
    completedAt: null,
  },
  {
    id: 7,
    customerID: 1,
    name: "Janitorial Restock - All Sites",
    status: "draft",
    generatedFrom: "manual",
    dateRange: null,
    woIds: [],
    items: [
      { id: 26, pickListId: 7, partId: 40, partName: "Trash Bag 44 Gallon (100ct)", partSku: "JN-TRASH-44GAL", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf N-1", quantityNeeded: 5, quantityPicked: 0, status: "pending", woReference: null },
      { id: 27, pickListId: 7, partId: 41, partName: "Multi-Purpose Cleaner (1gal)", partSku: "JN-CLEANER-MP", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf N-2", quantityNeeded: 4, quantityPicked: 0, status: "pending", woReference: null },
      { id: 28, pickListId: 7, partId: 43, partName: "Paper Towel Roll (6pk)", partSku: "JN-PAPER-TOWEL", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf N-4", quantityNeeded: 6, quantityPicked: 0, status: "pending", woReference: null },
      { id: 29, pickListId: 7, partId: 44, partName: "Jumbo Toilet Paper (12pk)", partSku: "JN-TP-JUMBO", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf N-5", quantityNeeded: 4, quantityPicked: 0, status: "pending", woReference: null },
      { id: 30, pickListId: 7, partId: 45, partName: "Hand Sanitizer (1gal refill)", partSku: "JN-SANITIZER-GL", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf N-6", quantityNeeded: 3, quantityPicked: 0, status: "pending", woReference: null },
    ],
    totalItems: 5,
    pickedItems: 0,
    createdBy: "Tom Wilson",
    createdAt: daysAgo(0, 11),
    completedAt: null,
  },

  // --- On-Hold (1) ---
  {
    id: 8,
    customerID: 1,
    name: "Server Room Cooling Upgrade",
    status: "on-hold",
    generatedFrom: "manual",
    dateRange: null,
    woIds: [155],
    items: [
      { id: 31, pickListId: 8, partId: 18, partName: "R-410A Refrigerant (25lb)", partSku: "HV-REFRIG-R410A", locationId: 1, locationName: "Main Warehouse", storageLocation: "Cage H-1", quantityNeeded: 2, quantityPicked: 0, status: "pending", woReference: "WO-2024-0155" },
      { id: 32, pickListId: 8, partId: 19, partName: "1/3 HP Blower Motor", partSku: "HV-MOTOR-1/3HP", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf G-2", quantityNeeded: 1, quantityPicked: 0, status: "short", woReference: "WO-2024-0155" },
      { id: 33, pickListId: 8, partId: 17, partName: "Programmable Thermostat", partSku: "HV-THERMOSTAT-PRG", locationId: 1, locationName: "Main Warehouse", storageLocation: "Shelf G-1", quantityNeeded: 2, quantityPicked: 1, status: "picked", woReference: "WO-2024-0155" },
    ],
    totalItems: 3,
    pickedItems: 1,
    createdBy: "Mike Johnson",
    createdAt: daysAgo(5, 8),
    completedAt: null,
  },
];
