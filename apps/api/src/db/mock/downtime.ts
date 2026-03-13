/**
 * Mock provider for P1-30 Downtime Tracking.
 */

import type {
  DowntimeEvent,
  DowntimeStats,
  ReliabilityRecord,
  CreateDowntimeEventInput,
  ListDowntimeEventsQuery,
  StatsWindow,
} from "@asset-hub/shared";
import type { PaginatedResult } from "../../types/providers.js";
import { mockDowntimeEvents } from "./data/downtime.js";

// Working copies
const events: DowntimeEvent[] = mockDowntimeEvents.map((e) => ({ ...e }));
let nextEventId = Math.max(...events.map((e) => e.id)) + 1;

function windowToDays(window: StatsWindow): number {
  switch (window) {
    case "90d": return 90;
    case "6m": return 182;
    case "12m": return 365;
  }
}

function calcStats(assetEvents: DowntimeEvent[], assetId: number, window: StatsWindow): DowntimeStats {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowToDays(window));
  const cutoffStr = cutoff.toISOString();

  const windowEvents = assetEvents.filter((e) => e.startTime >= cutoffStr);
  const completedEvents = windowEvents.filter((e) => e.endTime !== null);
  const ongoingEvents = windowEvents.filter((e) => e.endTime === null).length;

  const totalDowntimeMinutes = completedEvents.reduce((sum, e) => sum + (e.durationMinutes ?? 0), 0);
  const totalDowntimeHours = Math.round((totalDowntimeMinutes / 60) * 10) / 10;

  const windowHours = windowToDays(window) * 24;
  const availability = windowHours > 0
    ? Math.round((1 - totalDowntimeHours / windowHours) * 1000) / 10
    : 100;

  // MTBF: uptime hours / number of failures (excluding planned maintenance)
  const failures = completedEvents.filter(
    (e) => e.reason !== "planned_maintenance" && e.reason !== "inspection"
  );
  const mtbf = failures.length > 0
    ? Math.round(((windowHours - totalDowntimeHours) / failures.length) * 10) / 10
    : windowHours;

  // MTTR: average repair time for failures
  const mttr = failures.length > 0
    ? Math.round((failures.reduce((s, e) => s + (e.durationMinutes ?? 0), 0) / failures.length / 60) * 10) / 10
    : 0;

  return {
    assetId,
    window,
    mtbf,
    mttr,
    availability: Math.min(100, Math.max(0, availability)),
    totalEvents: windowEvents.length,
    totalDowntimeHours,
    ongoingEvents,
    asOf: new Date().toISOString(),
  };
}

// Pre-compute asset names from events
const assetNameMap = new Map<number, string>();
const assetCategoryMap = new Map<number, string | null>();
const assetPropertyMap = new Map<number, string | null>();

for (const e of events) {
  if (e.assetName) assetNameMap.set(e.assetId, e.assetName);
}

// Assign categories for known asset IDs
const CATEGORY_MAP: Record<number, string> = {
  1: "HVAC", 2: "HVAC", 3: "HVAC", 4: "HVAC", 5: "HVAC",
  6: "Electrical", 7: "Fleet", 8: "Equipment", 9: "Equipment",
  10: "Fire Safety", 11: "Plumbing", 12: "Equipment", 13: "Vertical Transport",
  14: "Vertical Transport", 15: "HVAC", 16: "HVAC", 17: "HVAC",
  18: "Electrical", 19: "HVAC", 20: "Fleet", 21: "Equipment",
  22: "Plumbing", 23: "Equipment", 24: "HVAC", 25: "Fire Safety",
};

const PROPERTY_MAP: Record<number, string> = {
  1: "Main Campus", 2: "Main Campus", 3: "Main Campus", 4: "North Building", 5: "Main Campus",
  6: "Main Campus", 7: "Main Campus", 8: "Warehouse", 9: "Warehouse",
  10: "Main Campus", 11: "Main Campus", 12: "Warehouse", 13: "Main Campus",
  14: "Main Campus", 15: "South Wing", 16: "South Wing", 17: "North Building",
  18: "North Building", 19: "East Campus", 20: "North Building", 21: "Warehouse",
  22: "Main Campus", 23: "Warehouse", 24: "East Campus", 25: "Main Campus",
};

for (const [assetId, category] of Object.entries(CATEGORY_MAP)) {
  assetCategoryMap.set(parseInt(assetId), category);
}
for (const [assetId, property] of Object.entries(PROPERTY_MAP)) {
  assetPropertyMap.set(parseInt(assetId), property);
}

export const mockDowntimeProvider = {
  async getDowntimeEvents(
    _customerID: number,
    assetId: number,
    query: Required<Pick<ListDowntimeEventsQuery, "page" | "limit">> & Omit<ListDowntimeEventsQuery, "page" | "limit">
  ): Promise<PaginatedResult<DowntimeEvent>> {
    let items = events.filter((e) => e.assetId === assetId);

    if (query.startDate) {
      items = items.filter((e) => e.startTime >= query.startDate!);
    }
    if (query.endDate) {
      items = items.filter((e) => e.startTime <= query.endDate!);
    }
    if (query.reason) {
      items = items.filter((e) => e.reason === query.reason);
    }
    if (query.ongoingOnly) {
      items = items.filter((e) => e.endTime === null);
    }

    items.sort((a, b) => b.startTime.localeCompare(a.startTime));

    const total = items.length;
    const { page, limit } = query;
    const start = (page - 1) * limit;
    items = items.slice(start, start + limit);

    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  async getDowntimeStats(
    _customerID: number,
    assetId: number,
    window: StatsWindow
  ): Promise<DowntimeStats> {
    const assetEvents = events.filter((e) => e.assetId === assetId);
    return calcStats(assetEvents, assetId, window);
  },

  async getReliabilityOverview(_customerID: number): Promise<ReliabilityRecord[]> {
    // Get all unique asset IDs
    const assetIds = [...new Set(events.map((e) => e.assetId))];

    const records: ReliabilityRecord[] = assetIds.map((assetId) => {
      const assetEvents = events.filter((e) => e.assetId === assetId);
      const stats90d = calcStats(assetEvents, assetId, "90d");
      const stats6m = calcStats(assetEvents, assetId, "6m");

      // Trend: compare 90d availability to 6m availability
      let trend: "improving" | "declining" | "stable" = "stable";
      const diff = stats90d.availability - stats6m.availability;
      if (diff > 2) trend = "improving";
      else if (diff < -2) trend = "declining";

      const lastEvent = assetEvents
        .filter((e) => e.endTime !== null)
        .sort((a, b) => b.startTime.localeCompare(a.startTime))[0];

      return {
        assetId,
        assetName: assetNameMap.get(assetId) ?? `Asset ${assetId}`,
        categoryName: assetCategoryMap.get(assetId) ?? null,
        propertyName: assetPropertyMap.get(assetId) ?? null,
        mtbf: stats90d.mtbf,
        mttr: stats90d.mttr,
        availability: stats90d.availability,
        downtimeEvents: stats90d.totalEvents,
        totalDowntimeHours: stats90d.totalDowntimeHours,
        trend,
        lastDowntimeDate: lastEvent?.startTime ?? null,
      };
    });

    // Sort by availability ascending (worst first)
    return records.sort((a, b) => a.availability - b.availability);
  },

  async createDowntimeEvent(
    _customerID: number,
    assetId: number,
    input: CreateDowntimeEventInput
  ): Promise<DowntimeEvent> {
    const now = new Date().toISOString();
    const event: DowntimeEvent = {
      id: nextEventId++,
      assetId,
      assetName: assetNameMap.get(assetId) ?? null,
      startTime: input.startTime ?? now,
      endTime: null,
      durationMinutes: null,
      reason: input.reason,
      reasonDescription: input.reasonDescription ?? null,
      associatedWoId: input.associatedWoId ?? null,
      resolvedBy: null,
      resolvedByName: null,
      createdAt: now,
      updatedAt: now,
    };
    events.push(event);
    return event;
  },

  async resolveDowntimeEvent(
    _customerID: number,
    eventId: number
  ): Promise<DowntimeEvent | null> {
    const idx = events.findIndex((e) => e.id === eventId);
    if (idx === -1) return null;

    const existing = events[idx]!;
    if (existing.endTime !== null) return existing; // already resolved

    const now = new Date().toISOString();
    const startMs = new Date(existing.startTime).getTime();
    const endMs = new Date(now).getTime();
    const durationMinutes = Math.round((endMs - startMs) / 60000);

    events[idx] = {
      id: existing.id,
      assetId: existing.assetId,
      assetName: existing.assetName,
      startTime: existing.startTime,
      endTime: now,
      durationMinutes,
      reason: existing.reason,
      reasonDescription: existing.reasonDescription,
      associatedWoId: existing.associatedWoId,
      resolvedBy: 1,
      resolvedByName: "demo.user",
      createdAt: existing.createdAt,
      updatedAt: now,
    };

    return events[idx]!;
  },
};
