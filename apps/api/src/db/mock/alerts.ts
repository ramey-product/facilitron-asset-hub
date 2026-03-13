import type { ReorderRule, ReorderAlert, ListAlertsQuery, CreateReorderRuleInput, UpdateReorderRuleInput } from "@asset-hub/shared";
import { mockReorderRules, mockReorderAlerts } from "./data/alerts.js";
import type { PaginatedResult } from "../../types/providers.js";

// Working copies for in-memory mutations
const rules = mockReorderRules.map((r) => ({ ...r }));
let nextRuleId = Math.max(...rules.map((r) => r.id)) + 1;

const alerts = mockReorderAlerts.map((a) => ({ ...a }));
let nextAlertId = Math.max(...alerts.map((a) => a.id)) + 1;

// Part name lookup from existing inventory mock (subset)
const PART_LOOKUP: Record<number, { name: string; sku: string }> = {
  1: { name: "20A Circuit Breaker", sku: "EL-BRK-20A" },
  9: { name: "Universal Flush Valve Kit", sku: "PL-FLUSHKIT" },
  12: { name: "1-1/2\" P-Trap (PVC)", sku: "PL-TRAP-1.5" },
  14: { name: "V-Belt A48", sku: "HV-BELT-A48" },
  15: { name: "Run Capacitor 45/5 MFD", sku: "HV-CAPACITOR-45" },
  20: { name: "Hot Surface Ignitor", sku: "HV-IGNITOR-HOT" },
  21: { name: "MERV 8 Filter (20x25x1)", sku: "FL-MERV8-20X25" },
  22: { name: "MERV 13 Filter (20x25x1)", sku: "FL-MERV13-20X25" },
  23: { name: "MERV 8 Filter (16x20x1)", sku: "FL-MERV8-16X20" },
  31: { name: "LED T8 Tube (4ft, 18W)", sku: "LT-LED-T8-4FT" },
  36: { name: "Photoelectric Smoke Detector", sku: "SF-SMOKE-PHT" },
  37: { name: "Fire Extinguisher (5lb ABC)", sku: "SF-EXTINGUISH-5" },
  38: { name: "First Aid Kit (50-person)", sku: "SF-FIRSTAID-KIT" },
  40: { name: "Trash Bag 44 Gallon (100ct)", sku: "JN-TRASH-44GAL" },
  41: { name: "Multi-Purpose Cleaner (1gal)", sku: "JN-CLEANER-MP" },
  44: { name: "Jumbo Toilet Paper (12pk)", sku: "JN-TP-JUMBO" },
  45: { name: "Hand Sanitizer (1gal refill)", sku: "JN-SANITIZER-GL" },
};

const PROPERTY_LOOKUP: Record<number, string> = {
  1: "Rotten Robbie - Oakland",
  2: "Rotten Robbie - Fremont",
  3: "Rotten Robbie - San Jose",
  4: "Rotten Robbie - Hayward",
  5: "Rotten Robbie - Concord",
};

// ---- Reorder Rules ----

export function listReorderRules(customerID: number): ReorderRule[] {
  return rules.filter(() => customerID === 1); // all belong to customer 1 in mock
}

export function getReorderRule(customerID: number, id: number): ReorderRule | null {
  if (customerID !== 1) return null;
  return rules.find((r) => r.id === id) ?? null;
}

export function createReorderRule(customerID: number, input: CreateReorderRuleInput): ReorderRule {
  const part = PART_LOOKUP[input.partId];
  const newRule: ReorderRule = {
    id: nextRuleId++,
    partId: input.partId,
    partName: part?.name ?? null,
    partNumber: part?.sku ?? null,
    reorderPoint: input.reorderPoint,
    reorderQuantity: input.reorderQuantity,
    preferredVendorId: input.preferredVendorId ?? null,
    preferredVendorName: null,
    leadTimeDays: input.leadTimeDays ?? 7,
    isActive: true,
    propertyId: input.propertyId,
    propertyName: PROPERTY_LOOKUP[input.propertyId] ?? null,
  };
  rules.push(newRule);
  return newRule;
}

export function updateReorderRule(customerID: number, id: number, input: UpdateReorderRuleInput): ReorderRule | null {
  if (customerID !== 1) return null;
  const idx = rules.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const updated = {
    ...rules[idx],
    ...Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined)),
  } as ReorderRule;
  rules[idx] = updated;
  return updated;
}

export function deleteReorderRule(customerID: number, id: number): boolean {
  if (customerID !== 1) return false;
  const idx = rules.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  rules.splice(idx, 1);
  return true;
}

// ---- Alerts ----

export function listAlerts(customerID: number, query: ListAlertsQuery): PaginatedResult<ReorderAlert> {
  if (customerID !== 1) return { items: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } };

  let items = [...alerts];

  if (query.status) {
    items = items.filter((a) => a.status === query.status);
  }
  if (query.partId) {
    items = items.filter((a) => a.partId === query.partId);
  }
  if (query.propertyId) {
    items = items.filter((a) => a.propertyId === query.propertyId);
  }

  // Sort: Active first, then Ordered, then Dismissed. Within Active, out-of-stock first.
  items.sort((a, b) => {
    const statusOrder = { Active: 0, Ordered: 1, Dismissed: 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    // Within Active: sort by currentQuantity ascending (most critical first)
    if (a.status === "Active") {
      return a.currentQuantity - b.currentQuantity;
    }
    // Otherwise by createdAt descending
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  return { items: paged, meta: { page, limit, total, totalPages } };
}

export function dismissAlert(customerID: number, id: number, dismissedBy: number): ReorderAlert | null {
  if (customerID !== 1) return null;
  const idx = alerts.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const alert = alerts[idx]!;
  if (alert.status !== "Active") return null;

  alert.status = "Dismissed";
  alert.dismissedAt = new Date().toISOString();
  alert.dismissedBy = dismissedBy;
  return alert;
}

export function convertAlertToPO(
  customerID: number,
  alertId: number
): { alert: ReorderAlert; poId: number } | null {
  if (customerID !== 1) return null;
  const idx = alerts.findIndex((a) => a.id === alertId);
  if (idx === -1) return null;
  const alert = alerts[idx]!;
  if (alert.status !== "Active") return null;

  // Stub PO ID — in a real implementation this would create a PO record
  const stubbedPoId = 100 + alertId;

  alert.status = "Ordered";
  alert.convertedPoId = stubbedPoId;

  return { alert, poId: stubbedPoId };
}

export function checkAndGenerateAlerts(customerID: number): ReorderAlert[] {
  // In a real system, this scans stock levels vs reorder rules and creates new alerts.
  // For mock purposes, we just return the current Active alerts to simulate "scan results".
  return alerts.filter((a) => a.status === "Active");
}
