/**
 * Mock provider for P1-29 Meter-Based Maintenance.
 */

import type {
  AssetMeter,
  MeterReading,
  MeterThreshold,
  MeterAlert,
  CreateMeterReadingInput,
  UpdateMeterThresholdInput,
  ListMeterReadingsQuery,
} from "@asset-hub/shared";
import type { PaginatedResult } from "../../types/providers.js";
import { mockMeters, mockMeterReadings, mockMeterThresholds, mockMeterAlerts } from "./data/meters.js";

// Working copies
const meters: AssetMeter[] = mockMeters.map((m) => ({ ...m }));
const readings: MeterReading[] = mockMeterReadings.map((r) => ({ ...r }));
const thresholds: MeterThreshold[] = mockMeterThresholds.map((t) => ({ ...t }));
const alerts: MeterAlert[] = mockMeterAlerts.map((a) => ({ ...a }));
let nextReadingId = Math.max(...readings.map((r) => r.id)) + 1;

export const mockMetersProvider = {
  async getAssetMeters(_customerID: number, assetId: number): Promise<AssetMeter[]> {
    return meters.filter((m) => m.assetId === assetId);
  },

  async getMeterHistory(
    _customerID: number,
    meterId: number,
    query: Required<Pick<ListMeterReadingsQuery, "page" | "limit">> & Omit<ListMeterReadingsQuery, "page" | "limit">
  ): Promise<PaginatedResult<MeterReading>> {
    let items = readings.filter((r) => r.meterId === meterId);

    if (query.startDate) {
      items = items.filter((r) => r.readingDate >= query.startDate!);
    }
    if (query.endDate) {
      items = items.filter((r) => r.readingDate <= query.endDate!);
    }

    // Most recent first
    items.sort((a, b) => b.readingDate.localeCompare(a.readingDate));

    const total = items.length;
    const { page, limit } = query;
    const start = (page - 1) * limit;
    items = items.slice(start, start + limit);

    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  async createReading(
    _customerID: number,
    meterId: number,
    input: CreateMeterReadingInput
  ): Promise<MeterReading> {
    const meter = meters.find((m) => m.id === meterId);
    if (!meter) throw new Error("Meter not found");

    const now = new Date().toISOString();
    const readingDate = input.readingDate ?? now;

    // Find previous reading to compute delta
    const prev = readings
      .filter((r) => r.meterId === meterId)
      .sort((a, b) => b.readingDate.localeCompare(a.readingDate))[0];

    const delta = prev ? Math.round((input.value - prev.value) * 100) / 100 : null;

    const reading: MeterReading = {
      id: nextReadingId++,
      meterId,
      assetId: meter.assetId,
      value: input.value,
      readingDate,
      recordedBy: 1,
      recordedByName: "demo.user",
      notes: input.notes ?? null,
      delta,
    };

    readings.push(reading);

    // Update meter current reading and last reading info
    meter.currentReading = input.value;
    meter.lastReadingDate = readingDate;
    meter.lastReadingBy = 1;
    meter.lastReadingByName = "demo.user";
    meter.updatedAt = now;

    // Recompute percent of threshold
    if (meter.thresholdValue !== null) {
      meter.percentOfThreshold = Math.round((input.value / meter.thresholdValue) * 100);
    }

    return reading;
  },

  async getThresholds(_customerID: number, meterId: number): Promise<MeterThreshold[]> {
    return thresholds.filter((t) => t.meterId === meterId);
  },

  async updateThreshold(
    _customerID: number,
    meterId: number,
    thresholdId: number,
    input: UpdateMeterThresholdInput
  ): Promise<MeterThreshold | null> {
    const idx = thresholds.findIndex((t) => t.id === thresholdId && t.meterId === meterId);
    if (idx === -1) return null;

    const now = new Date().toISOString();
    const existing = thresholds[idx]!;
    thresholds[idx] = {
      id: existing.id,
      meterId: existing.meterId,
      assetId: existing.assetId,
      thresholdValue: input.thresholdValue ?? existing.thresholdValue,
      triggerMode: input.triggerMode ?? existing.triggerMode,
      intervalValue: input.intervalValue !== undefined ? input.intervalValue : existing.intervalValue,
      pmTemplateDescription: input.pmTemplateDescription !== undefined ? input.pmTemplateDescription : existing.pmTemplateDescription,
      lastTriggeredAt: existing.lastTriggeredAt,
      lastTriggeredReading: existing.lastTriggeredReading,
      isActive: input.isActive !== undefined ? input.isActive : existing.isActive,
      createdAt: existing.createdAt,
      updatedAt: now,
    };

    // Sync threshold value on the meter
    const meter = meters.find((m) => m.id === meterId);
    if (meter) {
      meter.thresholdValue = thresholds[idx]!.thresholdValue;
      meter.percentOfThreshold = meter.thresholdValue > 0
        ? Math.round((meter.currentReading / meter.thresholdValue) * 100)
        : null;
    }

    return thresholds[idx]!;
  },

  async getMeterAlerts(_customerID: number): Promise<MeterAlert[]> {
    // Sort: exceeded first, then approaching, then overdue — each by percentOfThreshold desc
    return [...alerts].sort((a, b) => {
      const statusOrder: Record<string, number> = { exceeded: 0, approaching: 1, overdue_reading: 2 };
      const sA = statusOrder[a.status] ?? 3;
      const sB = statusOrder[b.status] ?? 3;
      if (sA !== sB) return sA - sB;
      return (b.percentOfThreshold ?? 0) - (a.percentOfThreshold ?? 0);
    });
  },

  async checkThresholds(_customerID: number): Promise<{ alertsGenerated: number }> {
    // In real implementation this would scan all meters and update alerts table.
    // For mock, we just return the count of active alerts.
    return { alertsGenerated: alerts.length };
  },
};
