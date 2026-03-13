/**
 * Seed data for P1-29 Meter-Based Maintenance.
 * 30+ meters, 100+ readings, 15+ thresholds, 10+ alerts.
 */

import type { AssetMeter, MeterReading, MeterThreshold, MeterAlert } from "@asset-hub/shared";

// Asset IDs 1-25 align with the existing mock assets
export const mockMeters: AssetMeter[] = [
  // HVAC Units — hours meters
  { id: 1, assetId: 1, assetName: "RTU-01 Rooftop Unit", meterType: "hours", unit: "hrs", currentReading: 8420, lastReadingDate: "2026-03-10T09:00:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2023-01-15T00:00:00Z", updatedAt: "2026-03-10T09:00:00Z", hasThreshold: true, thresholdValue: 8500, percentOfThreshold: 99 },
  { id: 2, assetId: 2, assetName: "AHU-02 Air Handler", meterType: "hours", unit: "hrs", currentReading: 5200, lastReadingDate: "2026-03-08T10:30:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2023-06-01T00:00:00Z", updatedAt: "2026-03-08T10:30:00Z", hasThreshold: true, thresholdValue: 6000, percentOfThreshold: 87 },
  { id: 3, assetId: 3, assetName: "Chiller Unit A", meterType: "hours", unit: "hrs", currentReading: 12100, lastReadingDate: "2026-03-11T08:00:00Z", lastReadingBy: 2, lastReadingByName: "admin.user", createdAt: "2022-03-01T00:00:00Z", updatedAt: "2026-03-11T08:00:00Z", hasThreshold: true, thresholdValue: 10000, percentOfThreshold: 121 },
  { id: 4, assetId: 4, assetName: "Boiler Unit B", meterType: "hours", unit: "hrs", currentReading: 3800, lastReadingDate: "2026-03-09T07:45:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2024-01-10T00:00:00Z", updatedAt: "2026-03-09T07:45:00Z", hasThreshold: true, thresholdValue: 4000, percentOfThreshold: 95 },
  { id: 5, assetId: 5, assetName: "Cooling Tower CT-1", meterType: "hours", unit: "hrs", currentReading: 2200, lastReadingDate: "2026-02-28T11:00:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2024-05-15T00:00:00Z", updatedAt: "2026-02-28T11:00:00Z", hasThreshold: false, thresholdValue: null, percentOfThreshold: null },

  // Generators — hours + fuel
  { id: 6, assetId: 6, assetName: "Generator GEN-01", meterType: "hours", unit: "hrs", currentReading: 650, lastReadingDate: "2026-03-12T06:00:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2026-03-12T06:00:00Z", hasThreshold: true, thresholdValue: 500, percentOfThreshold: 130 },
  { id: 7, assetId: 6, assetName: "Generator GEN-01", meterType: "gallons", unit: "gal", currentReading: 4800, lastReadingDate: "2026-03-12T06:00:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2026-03-12T06:00:00Z", hasThreshold: true, thresholdValue: 5000, percentOfThreshold: 96 },

  // Vehicles / Fleet — miles
  { id: 8, assetId: 7, assetName: "Service Van #1", meterType: "miles", unit: "mi", currentReading: 48200, lastReadingDate: "2026-03-11T17:30:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2022-09-01T00:00:00Z", updatedAt: "2026-03-11T17:30:00Z", hasThreshold: true, thresholdValue: 50000, percentOfThreshold: 96 },
  { id: 9, assetId: 8, assetName: "Forklift FL-02", meterType: "hours", unit: "hrs", currentReading: 1950, lastReadingDate: "2026-03-10T15:00:00Z", lastReadingBy: 2, lastReadingByName: "admin.user", createdAt: "2023-11-01T00:00:00Z", updatedAt: "2026-03-10T15:00:00Z", hasThreshold: true, thresholdValue: 2000, percentOfThreshold: 98 },
  { id: 10, assetId: 9, assetName: "Scissor Lift SL-01", meterType: "cycles", unit: "cycles", currentReading: 8800, lastReadingDate: "2026-03-07T13:00:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2023-04-01T00:00:00Z", updatedAt: "2026-03-07T13:00:00Z", hasThreshold: true, thresholdValue: 9000, percentOfThreshold: 98 },

  // Pumps — hours
  { id: 11, assetId: 10, assetName: "Fire Pump FP-1", meterType: "hours", unit: "hrs", currentReading: 320, lastReadingDate: "2026-03-05T10:00:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2024-06-01T00:00:00Z", updatedAt: "2026-03-05T10:00:00Z", hasThreshold: true, thresholdValue: 400, percentOfThreshold: 80 },
  { id: 12, assetId: 11, assetName: "Circulation Pump CP-A", meterType: "hours", unit: "hrs", currentReading: 6100, lastReadingDate: "2026-03-01T09:00:00Z", lastReadingBy: 2, lastReadingByName: "admin.user", createdAt: "2022-07-15T00:00:00Z", updatedAt: "2026-03-01T09:00:00Z", hasThreshold: true, thresholdValue: 6000, percentOfThreshold: 102 },

  // Compressors — hours + cycles
  { id: 13, assetId: 12, assetName: "Air Compressor AC-1", meterType: "hours", unit: "hrs", currentReading: 4500, lastReadingDate: "2026-03-09T11:00:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2023-03-01T00:00:00Z", updatedAt: "2026-03-09T11:00:00Z", hasThreshold: true, thresholdValue: 5000, percentOfThreshold: 90 },
  { id: 14, assetId: 12, assetName: "Air Compressor AC-1", meterType: "cycles", unit: "cycles", currentReading: 125000, lastReadingDate: "2026-03-09T11:00:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2023-03-01T00:00:00Z", updatedAt: "2026-03-09T11:00:00Z", hasThreshold: true, thresholdValue: 150000, percentOfThreshold: 83 },

  // Elevators — cycles
  { id: 15, assetId: 13, assetName: "Elevator ELV-A", meterType: "cycles", unit: "cycles", currentReading: 89500, lastReadingDate: "2026-03-11T12:00:00Z", lastReadingBy: 2, lastReadingByName: "admin.user", createdAt: "2022-01-01T00:00:00Z", updatedAt: "2026-03-11T12:00:00Z", hasThreshold: true, thresholdValue: 90000, percentOfThreshold: 99 },
  { id: 16, assetId: 14, assetName: "Elevator ELV-B", meterType: "cycles", unit: "cycles", currentReading: 52000, lastReadingDate: "2026-03-11T12:30:00Z", lastReadingBy: 2, lastReadingByName: "admin.user", createdAt: "2023-05-01T00:00:00Z", updatedAt: "2026-03-11T12:30:00Z", hasThreshold: true, thresholdValue: 75000, percentOfThreshold: 69 },

  // HVAC Filters — hours (between filter changes)
  { id: 17, assetId: 15, assetName: "AHU-03 Air Handler", meterType: "hours", unit: "hrs", currentReading: 2950, lastReadingDate: "2026-03-10T08:00:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2024-09-01T00:00:00Z", updatedAt: "2026-03-10T08:00:00Z", hasThreshold: true, thresholdValue: 3000, percentOfThreshold: 98 },
  { id: 18, assetId: 16, assetName: "RTU-02 Rooftop Unit", meterType: "hours", unit: "hrs", currentReading: 1200, lastReadingDate: "2026-03-08T09:30:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2025-01-15T00:00:00Z", updatedAt: "2026-03-08T09:30:00Z", hasThreshold: false, thresholdValue: null, percentOfThreshold: null },

  // Additional assets
  { id: 19, assetId: 17, assetName: "Cooling Tower CT-2", meterType: "hours", unit: "hrs", currentReading: 890, lastReadingDate: "2026-03-06T10:00:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2025-03-01T00:00:00Z", updatedAt: "2026-03-06T10:00:00Z", hasThreshold: false, thresholdValue: null, percentOfThreshold: null },
  { id: 20, assetId: 18, assetName: "Emergency Generator EG-2", meterType: "hours", unit: "hrs", currentReading: 210, lastReadingDate: "2026-01-15T06:00:00Z", lastReadingBy: 2, lastReadingByName: "admin.user", createdAt: "2025-06-01T00:00:00Z", updatedAt: "2026-01-15T06:00:00Z", hasThreshold: true, thresholdValue: 500, percentOfThreshold: 42 },
  { id: 21, assetId: 19, assetName: "Boiler Unit C", meterType: "hours", unit: "hrs", currentReading: 7200, lastReadingDate: "2026-03-02T08:00:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2022-10-01T00:00:00Z", updatedAt: "2026-03-02T08:00:00Z", hasThreshold: true, thresholdValue: 8000, percentOfThreshold: 90 },
  { id: 22, assetId: 20, assetName: "Service Van #2", meterType: "miles", unit: "mi", currentReading: 31500, lastReadingDate: "2026-03-10T17:00:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2023-07-01T00:00:00Z", updatedAt: "2026-03-10T17:00:00Z", hasThreshold: true, thresholdValue: 30000, percentOfThreshold: 105 },
  { id: 23, assetId: 21, assetName: "Hydraulic Press HP-1", meterType: "cycles", unit: "cycles", currentReading: 45000, lastReadingDate: "2026-03-11T14:00:00Z", lastReadingBy: 2, lastReadingByName: "admin.user", createdAt: "2023-02-01T00:00:00Z", updatedAt: "2026-03-11T14:00:00Z", hasThreshold: true, thresholdValue: 50000, percentOfThreshold: 90 },
  { id: 24, assetId: 22, assetName: "Water Softener WS-1", meterType: "gallons", unit: "gal", currentReading: 95000, lastReadingDate: "2026-03-11T09:00:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2023-08-01T00:00:00Z", updatedAt: "2026-03-11T09:00:00Z", hasThreshold: true, thresholdValue: 100000, percentOfThreshold: 95 },
  { id: 25, assetId: 23, assetName: "Vacuum Pump VP-1", meterType: "hours", unit: "hrs", currentReading: 3300, lastReadingDate: "2026-03-09T10:00:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2023-09-15T00:00:00Z", updatedAt: "2026-03-09T10:00:00Z", hasThreshold: true, thresholdValue: 3500, percentOfThreshold: 94 },
  // Overdue readings (last reading > 30 days ago)
  { id: 26, assetId: 24, assetName: "Cooling Tower CT-3", meterType: "hours", unit: "hrs", currentReading: 4100, lastReadingDate: "2026-01-20T08:00:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2023-06-01T00:00:00Z", updatedAt: "2026-01-20T08:00:00Z", hasThreshold: true, thresholdValue: 5000, percentOfThreshold: 82 },
  { id: 27, assetId: 25, assetName: "Fire Panel FP-Main", meterType: "cycles", unit: "cycles", currentReading: 18200, lastReadingDate: "2026-01-05T11:00:00Z", lastReadingBy: 2, lastReadingByName: "admin.user", createdAt: "2022-04-01T00:00:00Z", updatedAt: "2026-01-05T11:00:00Z", hasThreshold: false, thresholdValue: null, percentOfThreshold: null },
  { id: 28, assetId: 3, assetName: "Chiller Unit A", meterType: "gallons", unit: "gal", currentReading: 62000, lastReadingDate: "2026-02-01T09:00:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2022-03-01T00:00:00Z", updatedAt: "2026-02-01T09:00:00Z", hasThreshold: false, thresholdValue: null, percentOfThreshold: null },
  { id: 29, assetId: 10, assetName: "Fire Pump FP-1", meterType: "cycles", unit: "cycles", currentReading: 2400, lastReadingDate: "2026-01-28T10:00:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2024-06-01T00:00:00Z", updatedAt: "2026-01-28T10:00:00Z", hasThreshold: false, thresholdValue: null, percentOfThreshold: null },
  { id: 30, assetId: 11, assetName: "Circulation Pump CP-A", meterType: "cycles", unit: "cycles", currentReading: 35500, lastReadingDate: "2026-02-10T08:30:00Z", lastReadingBy: 1, lastReadingByName: "demo.user", createdAt: "2022-07-15T00:00:00Z", updatedAt: "2026-02-10T08:30:00Z", hasThreshold: false, thresholdValue: null, percentOfThreshold: null },
];

// Build readings for key meters — 100+ total across all meters
export const mockMeterReadings: MeterReading[] = [
  // Meter 1 (RTU-01, hours) — weekly readings
  { id: 1, meterId: 1, assetId: 1, value: 7000, readingDate: "2025-09-01T09:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 2, meterId: 1, assetId: 1, value: 7180, readingDate: "2025-09-08T09:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 180 },
  { id: 3, meterId: 1, assetId: 1, value: 7360, readingDate: "2025-09-15T09:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 180 },
  { id: 4, meterId: 1, assetId: 1, value: 7540, readingDate: "2025-09-22T09:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: 180 },
  { id: 5, meterId: 1, assetId: 1, value: 7700, readingDate: "2025-10-01T09:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 160 },
  { id: 6, meterId: 1, assetId: 1, value: 7900, readingDate: "2025-11-01T09:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 200 },
  { id: 7, meterId: 1, assetId: 1, value: 8100, readingDate: "2025-12-01T09:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 200 },
  { id: 8, meterId: 1, assetId: 1, value: 8200, readingDate: "2026-01-01T09:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: "Approaching threshold", delta: 100 },
  { id: 9, meterId: 1, assetId: 1, value: 8320, readingDate: "2026-02-01T09:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 120 },
  { id: 10, meterId: 1, assetId: 1, value: 8420, readingDate: "2026-03-10T09:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: "Threshold very close - schedule PM", delta: 100 },

  // Meter 3 (Chiller, hours — exceeded)
  { id: 11, meterId: 3, assetId: 3, value: 9000, readingDate: "2025-06-01T08:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: null },
  { id: 12, meterId: 3, assetId: 3, value: 9500, readingDate: "2025-08-01T08:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: 500 },
  { id: 13, meterId: 3, assetId: 3, value: 10050, readingDate: "2025-10-01T08:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: "Threshold exceeded - WO generated", delta: 550 },
  { id: 14, meterId: 3, assetId: 3, value: 10800, readingDate: "2025-12-01T08:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 750 },
  { id: 15, meterId: 3, assetId: 3, value: 11400, readingDate: "2026-01-15T08:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: 600 },
  { id: 16, meterId: 3, assetId: 3, value: 12100, readingDate: "2026-03-11T08:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: "Overdue for major service", delta: 700 },

  // Meter 6 (Generator, hours — exceeded)
  { id: 17, meterId: 6, assetId: 6, value: 300, readingDate: "2025-07-01T06:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 18, meterId: 6, assetId: 6, value: 420, readingDate: "2025-09-01T06:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 120 },
  { id: 19, meterId: 6, assetId: 6, value: 510, readingDate: "2025-11-01T06:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: "Exceeded 500hr threshold", delta: 90 },
  { id: 20, meterId: 6, assetId: 6, value: 580, readingDate: "2026-01-15T06:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: 70 },
  { id: 21, meterId: 6, assetId: 6, value: 620, readingDate: "2026-02-15T06:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 40 },
  { id: 22, meterId: 6, assetId: 6, value: 650, readingDate: "2026-03-12T06:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 30 },

  // Meter 8 (Service Van, miles)
  { id: 23, meterId: 8, assetId: 7, value: 40000, readingDate: "2025-06-01T17:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 24, meterId: 8, assetId: 7, value: 42500, readingDate: "2025-08-01T17:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 2500 },
  { id: 25, meterId: 8, assetId: 7, value: 44800, readingDate: "2025-10-01T17:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 2300 },
  { id: 26, meterId: 8, assetId: 7, value: 46200, readingDate: "2025-12-01T17:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 1400 },
  { id: 27, meterId: 8, assetId: 7, value: 47100, readingDate: "2026-01-15T17:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 900 },
  { id: 28, meterId: 8, assetId: 7, value: 47800, readingDate: "2026-02-15T17:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 700 },
  { id: 29, meterId: 8, assetId: 7, value: 48200, readingDate: "2026-03-11T17:30:00Z", recordedBy: 1, recordedByName: "demo.user", notes: "Approaching 50k oil change milestone", delta: 400 },

  // Meter 9 (Forklift)
  { id: 30, meterId: 9, assetId: 8, value: 1500, readingDate: "2025-09-01T15:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: null },
  { id: 31, meterId: 9, assetId: 8, value: 1700, readingDate: "2025-11-01T15:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: 200 },
  { id: 32, meterId: 9, assetId: 8, value: 1850, readingDate: "2026-01-15T15:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: 150 },
  { id: 33, meterId: 9, assetId: 8, value: 1950, readingDate: "2026-03-10T15:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: "Schedule 2000hr service", delta: 100 },

  // Meter 10 (Scissor Lift, cycles)
  { id: 34, meterId: 10, assetId: 9, value: 7000, readingDate: "2025-07-01T13:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 35, meterId: 10, assetId: 9, value: 7800, readingDate: "2025-10-01T13:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 800 },
  { id: 36, meterId: 10, assetId: 9, value: 8500, readingDate: "2025-12-15T13:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 700 },
  { id: 37, meterId: 10, assetId: 9, value: 8800, readingDate: "2026-03-07T13:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: "Close to 9000 inspection point", delta: 300 },

  // Meter 15 (Elevator ELV-A, cycles)
  { id: 38, meterId: 15, assetId: 13, value: 80000, readingDate: "2025-06-01T12:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: null },
  { id: 39, meterId: 15, assetId: 13, value: 84000, readingDate: "2025-09-01T12:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: 4000 },
  { id: 40, meterId: 15, assetId: 13, value: 87000, readingDate: "2025-12-01T12:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: 3000 },
  { id: 41, meterId: 15, assetId: 13, value: 88500, readingDate: "2026-02-01T12:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: 1500 },
  { id: 42, meterId: 15, assetId: 13, value: 89500, readingDate: "2026-03-11T12:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: "Schedule annual inspection soon", delta: 1000 },

  // Meter 12 (Circulation Pump — exceeded)
  { id: 43, meterId: 12, assetId: 11, value: 5600, readingDate: "2025-10-01T09:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: null },
  { id: 44, meterId: 12, assetId: 11, value: 5800, readingDate: "2025-12-01T09:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: 200 },
  { id: 45, meterId: 12, assetId: 11, value: 6100, readingDate: "2026-03-01T09:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: "Pump overhaul overdue", delta: 300 },

  // Meter 22 (Service Van #2 — exceeded)
  { id: 46, meterId: 22, assetId: 20, value: 28000, readingDate: "2025-08-01T17:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 47, meterId: 22, assetId: 20, value: 30200, readingDate: "2025-11-01T17:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: "30k service done", delta: 2200 },
  { id: 48, meterId: 22, assetId: 20, value: 31500, readingDate: "2026-03-10T17:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 1300 },

  // Meters 17 (AHU-03) — approaching
  { id: 49, meterId: 17, assetId: 15, value: 2500, readingDate: "2025-12-01T08:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 50, meterId: 17, assetId: 15, value: 2750, readingDate: "2026-01-15T08:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 250 },
  { id: 51, meterId: 17, assetId: 15, value: 2950, readingDate: "2026-03-10T08:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: "Filter change due soon", delta: 200 },

  // Additional readings to get over 100
  { id: 52, meterId: 4, assetId: 4, value: 3000, readingDate: "2025-10-01T07:45:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 53, meterId: 4, assetId: 4, value: 3500, readingDate: "2025-12-01T07:45:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 500 },
  { id: 54, meterId: 4, assetId: 4, value: 3800, readingDate: "2026-03-09T07:45:00Z", recordedBy: 1, recordedByName: "demo.user", notes: "Approaching 4000hr major service", delta: 300 },
  { id: 55, meterId: 2, assetId: 2, value: 4500, readingDate: "2025-09-01T10:30:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 56, meterId: 2, assetId: 2, value: 4900, readingDate: "2025-11-01T10:30:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 400 },
  { id: 57, meterId: 2, assetId: 2, value: 5200, readingDate: "2026-03-08T10:30:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 300 },
  { id: 58, meterId: 7, assetId: 6, value: 3800, readingDate: "2025-09-01T06:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 59, meterId: 7, assetId: 6, value: 4200, readingDate: "2025-12-01T06:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 400 },
  { id: 60, meterId: 7, assetId: 6, value: 4800, readingDate: "2026-03-12T06:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 600 },
  { id: 61, meterId: 11, assetId: 10, value: 200, readingDate: "2025-10-01T10:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 62, meterId: 11, assetId: 10, value: 280, readingDate: "2025-12-01T10:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 80 },
  { id: 63, meterId: 11, assetId: 10, value: 320, readingDate: "2026-03-05T10:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 40 },
  { id: 64, meterId: 13, assetId: 12, value: 3800, readingDate: "2025-09-01T11:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 65, meterId: 13, assetId: 12, value: 4200, readingDate: "2025-12-01T11:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 400 },
  { id: 66, meterId: 13, assetId: 12, value: 4500, readingDate: "2026-03-09T11:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 300 },
  { id: 67, meterId: 14, assetId: 12, value: 100000, readingDate: "2025-09-01T11:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 68, meterId: 14, assetId: 12, value: 115000, readingDate: "2025-12-01T11:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 15000 },
  { id: 69, meterId: 14, assetId: 12, value: 125000, readingDate: "2026-03-09T11:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 10000 },
  { id: 70, meterId: 16, assetId: 14, value: 42000, readingDate: "2025-09-01T12:30:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: null },
  { id: 71, meterId: 16, assetId: 14, value: 47000, readingDate: "2025-12-01T12:30:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: 5000 },
  { id: 72, meterId: 16, assetId: 14, value: 52000, readingDate: "2026-03-11T12:30:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: 5000 },
  { id: 73, meterId: 21, assetId: 19, value: 6500, readingDate: "2025-09-01T08:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 74, meterId: 21, assetId: 19, value: 6900, readingDate: "2025-12-01T08:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 400 },
  { id: 75, meterId: 21, assetId: 19, value: 7200, readingDate: "2026-03-02T08:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 300 },
  { id: 76, meterId: 23, assetId: 21, value: 38000, readingDate: "2025-09-01T14:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: null },
  { id: 77, meterId: 23, assetId: 21, value: 41000, readingDate: "2025-12-01T14:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: 3000 },
  { id: 78, meterId: 23, assetId: 21, value: 45000, readingDate: "2026-03-11T14:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: 4000 },
  { id: 79, meterId: 24, assetId: 22, value: 80000, readingDate: "2025-09-01T09:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 80, meterId: 24, assetId: 22, value: 88000, readingDate: "2025-12-01T09:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 8000 },
  { id: 81, meterId: 24, assetId: 22, value: 95000, readingDate: "2026-03-11T09:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 7000 },
  { id: 82, meterId: 25, assetId: 23, value: 2800, readingDate: "2025-10-01T10:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 83, meterId: 25, assetId: 23, value: 3100, readingDate: "2025-12-01T10:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 300 },
  { id: 84, meterId: 25, assetId: 23, value: 3300, readingDate: "2026-03-09T10:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 200 },
  { id: 85, meterId: 26, assetId: 24, value: 3500, readingDate: "2025-10-01T08:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 86, meterId: 26, assetId: 24, value: 3900, readingDate: "2025-12-15T08:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 400 },
  { id: 87, meterId: 26, assetId: 24, value: 4100, readingDate: "2026-01-20T08:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 200 },
  { id: 88, meterId: 27, assetId: 25, value: 17000, readingDate: "2025-09-01T11:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: null },
  { id: 89, meterId: 27, assetId: 25, value: 17800, readingDate: "2025-12-01T11:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: 800 },
  { id: 90, meterId: 27, assetId: 25, value: 18200, readingDate: "2026-01-05T11:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: 400 },
  { id: 91, meterId: 19, assetId: 17, value: 500, readingDate: "2025-09-01T10:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 92, meterId: 19, assetId: 17, value: 700, readingDate: "2025-12-01T10:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 200 },
  { id: 93, meterId: 19, assetId: 17, value: 890, readingDate: "2026-03-06T10:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 190 },
  { id: 94, meterId: 5, assetId: 5, value: 1600, readingDate: "2025-10-01T11:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 95, meterId: 5, assetId: 5, value: 1900, readingDate: "2025-12-15T11:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 300 },
  { id: 96, meterId: 5, assetId: 5, value: 2200, readingDate: "2026-02-28T11:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 300 },
  { id: 97, meterId: 18, assetId: 16, value: 800, readingDate: "2025-11-01T09:30:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 98, meterId: 18, assetId: 16, value: 1000, readingDate: "2026-01-01T09:30:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 200 },
  { id: 99, meterId: 18, assetId: 16, value: 1200, readingDate: "2026-03-08T09:30:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 200 },
  { id: 100, meterId: 20, assetId: 18, value: 100, readingDate: "2025-09-01T06:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: null },
  { id: 101, meterId: 20, assetId: 18, value: 160, readingDate: "2025-11-01T06:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: 60 },
  { id: 102, meterId: 20, assetId: 18, value: 210, readingDate: "2026-01-15T06:00:00Z", recordedBy: 2, recordedByName: "admin.user", notes: null, delta: 50 },
  { id: 103, meterId: 28, assetId: 3, value: 50000, readingDate: "2025-09-01T09:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: null },
  { id: 104, meterId: 28, assetId: 3, value: 56000, readingDate: "2025-12-01T09:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 6000 },
  { id: 105, meterId: 28, assetId: 3, value: 62000, readingDate: "2026-02-01T09:00:00Z", recordedBy: 1, recordedByName: "demo.user", notes: null, delta: 6000 },
];

export const mockMeterThresholds: MeterThreshold[] = [
  { id: 1, meterId: 1, assetId: 1, thresholdValue: 8500, triggerMode: "recurring", intervalValue: 500, pmTemplateDescription: "RTU coil cleaning and belt inspection", lastTriggeredAt: "2025-09-01T00:00:00Z", lastTriggeredReading: 8000, isActive: true, createdAt: "2023-01-15T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z" },
  { id: 2, meterId: 2, assetId: 2, thresholdValue: 6000, triggerMode: "once", intervalValue: null, pmTemplateDescription: "AHU belt and bearing inspection at 6000hrs", lastTriggeredAt: null, lastTriggeredReading: null, isActive: true, createdAt: "2023-06-01T00:00:00Z", updatedAt: "2023-06-01T00:00:00Z" },
  { id: 3, meterId: 3, assetId: 3, thresholdValue: 10000, triggerMode: "recurring", intervalValue: 2000, pmTemplateDescription: "Chiller tube cleaning and refrigerant check", lastTriggeredAt: "2025-10-01T00:00:00Z", lastTriggeredReading: 10050, isActive: true, createdAt: "2022-03-01T00:00:00Z", updatedAt: "2025-10-01T00:00:00Z" },
  { id: 4, meterId: 4, assetId: 4, thresholdValue: 4000, triggerMode: "recurring", intervalValue: 1000, pmTemplateDescription: "Boiler annual service and safety inspection", lastTriggeredAt: null, lastTriggeredReading: null, isActive: true, createdAt: "2024-01-10T00:00:00Z", updatedAt: "2024-01-10T00:00:00Z" },
  { id: 5, meterId: 6, assetId: 6, thresholdValue: 500, triggerMode: "recurring", intervalValue: 250, pmTemplateDescription: "Generator oil change and filter replacement", lastTriggeredAt: "2025-11-01T00:00:00Z", lastTriggeredReading: 510, isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-11-01T00:00:00Z" },
  { id: 6, meterId: 7, assetId: 6, thresholdValue: 5000, triggerMode: "recurring", intervalValue: 1000, pmTemplateDescription: "Fuel system inspection and tank cleaning", lastTriggeredAt: null, lastTriggeredReading: null, isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 7, meterId: 8, assetId: 7, thresholdValue: 50000, triggerMode: "recurring", intervalValue: 10000, pmTemplateDescription: "Major service: oil, filters, brake inspection", lastTriggeredAt: null, lastTriggeredReading: null, isActive: true, createdAt: "2022-09-01T00:00:00Z", updatedAt: "2022-09-01T00:00:00Z" },
  { id: 8, meterId: 9, assetId: 8, thresholdValue: 2000, triggerMode: "recurring", intervalValue: 500, pmTemplateDescription: "Forklift hydraulic service and tire inspection", lastTriggeredAt: null, lastTriggeredReading: null, isActive: true, createdAt: "2023-11-01T00:00:00Z", updatedAt: "2023-11-01T00:00:00Z" },
  { id: 9, meterId: 10, assetId: 9, thresholdValue: 9000, triggerMode: "recurring", intervalValue: 3000, pmTemplateDescription: "Scissor lift annual inspection and certification", lastTriggeredAt: null, lastTriggeredReading: null, isActive: true, createdAt: "2023-04-01T00:00:00Z", updatedAt: "2023-04-01T00:00:00Z" },
  { id: 10, meterId: 11, assetId: 10, thresholdValue: 400, triggerMode: "recurring", intervalValue: 200, pmTemplateDescription: "Fire pump test and seal inspection", lastTriggeredAt: null, lastTriggeredReading: null, isActive: true, createdAt: "2024-06-01T00:00:00Z", updatedAt: "2024-06-01T00:00:00Z" },
  { id: 11, meterId: 12, assetId: 11, thresholdValue: 6000, triggerMode: "recurring", intervalValue: 2000, pmTemplateDescription: "Pump bearing replacement and seal inspection", lastTriggeredAt: "2026-03-01T00:00:00Z", lastTriggeredReading: 6100, isActive: true, createdAt: "2022-07-15T00:00:00Z", updatedAt: "2026-03-01T00:00:00Z" },
  { id: 12, meterId: 13, assetId: 12, thresholdValue: 5000, triggerMode: "recurring", intervalValue: 1000, pmTemplateDescription: "Compressor oil change and valve inspection", lastTriggeredAt: null, lastTriggeredReading: null, isActive: true, createdAt: "2023-03-01T00:00:00Z", updatedAt: "2023-03-01T00:00:00Z" },
  { id: 13, meterId: 14, assetId: 12, thresholdValue: 150000, triggerMode: "recurring", intervalValue: 50000, pmTemplateDescription: "Valve and piston ring inspection", lastTriggeredAt: null, lastTriggeredReading: null, isActive: true, createdAt: "2023-03-01T00:00:00Z", updatedAt: "2023-03-01T00:00:00Z" },
  { id: 14, meterId: 15, assetId: 13, thresholdValue: 90000, triggerMode: "recurring", intervalValue: 10000, pmTemplateDescription: "Elevator annual inspection and certification", lastTriggeredAt: null, lastTriggeredReading: null, isActive: true, createdAt: "2022-01-01T00:00:00Z", updatedAt: "2022-01-01T00:00:00Z" },
  { id: 15, meterId: 17, assetId: 15, thresholdValue: 3000, triggerMode: "recurring", intervalValue: 1000, pmTemplateDescription: "AHU filter change and coil cleaning", lastTriggeredAt: null, lastTriggeredReading: null, isActive: true, createdAt: "2024-09-01T00:00:00Z", updatedAt: "2024-09-01T00:00:00Z" },
  { id: 16, meterId: 22, assetId: 20, thresholdValue: 30000, triggerMode: "recurring", intervalValue: 5000, pmTemplateDescription: "Vehicle service: oil, filters, inspection", lastTriggeredAt: "2025-11-01T00:00:00Z", lastTriggeredReading: 30200, isActive: true, createdAt: "2023-07-01T00:00:00Z", updatedAt: "2025-11-01T00:00:00Z" },
  { id: 17, meterId: 24, assetId: 22, thresholdValue: 100000, triggerMode: "recurring", intervalValue: 25000, pmTemplateDescription: "Water softener resin replacement", lastTriggeredAt: null, lastTriggeredReading: null, isActive: true, createdAt: "2023-08-01T00:00:00Z", updatedAt: "2023-08-01T00:00:00Z" },
  { id: 18, meterId: 25, assetId: 23, thresholdValue: 3500, triggerMode: "recurring", intervalValue: 500, pmTemplateDescription: "Vacuum pump oil change and filter replacement", lastTriggeredAt: null, lastTriggeredReading: null, isActive: true, createdAt: "2023-09-15T00:00:00Z", updatedAt: "2023-09-15T00:00:00Z" },
  { id: 19, meterId: 21, assetId: 19, thresholdValue: 8000, triggerMode: "once", intervalValue: null, pmTemplateDescription: "Boiler C major overhaul inspection", lastTriggeredAt: null, lastTriggeredReading: null, isActive: true, createdAt: "2022-10-01T00:00:00Z", updatedAt: "2022-10-01T00:00:00Z" },
  { id: 20, meterId: 23, assetId: 21, thresholdValue: 50000, triggerMode: "recurring", intervalValue: 10000, pmTemplateDescription: "Hydraulic fluid change and cylinder inspection", lastTriggeredAt: null, lastTriggeredReading: null, isActive: true, createdAt: "2023-02-01T00:00:00Z", updatedAt: "2023-02-01T00:00:00Z" },
];

// Alerts: approaching (80-99%), exceeded (100%+), overdue_reading (>30 days since last reading)
export const mockMeterAlerts: MeterAlert[] = [
  // Exceeded
  { id: 1, meterId: 3, assetId: 3, assetName: "Chiller Unit A", categoryName: "HVAC", meterType: "hours", unit: "hrs", currentReading: 12100, thresholdValue: 10000, percentOfThreshold: 121, status: "exceeded", lastReadingDate: "2026-03-11T08:00:00Z", daysSinceReading: 2 },
  { id: 2, meterId: 6, assetId: 6, assetName: "Generator GEN-01", categoryName: "Electrical", meterType: "hours", unit: "hrs", currentReading: 650, thresholdValue: 500, percentOfThreshold: 130, status: "exceeded", lastReadingDate: "2026-03-12T06:00:00Z", daysSinceReading: 1 },
  { id: 3, meterId: 12, assetId: 11, assetName: "Circulation Pump CP-A", categoryName: "Plumbing", meterType: "hours", unit: "hrs", currentReading: 6100, thresholdValue: 6000, percentOfThreshold: 102, status: "exceeded", lastReadingDate: "2026-03-01T09:00:00Z", daysSinceReading: 12 },
  { id: 4, meterId: 22, assetId: 20, assetName: "Service Van #2", categoryName: "Fleet", meterType: "miles", unit: "mi", currentReading: 31500, thresholdValue: 30000, percentOfThreshold: 105, status: "exceeded", lastReadingDate: "2026-03-10T17:00:00Z", daysSinceReading: 3 },

  // Approaching (80-99%)
  { id: 5, meterId: 1, assetId: 1, assetName: "RTU-01 Rooftop Unit", categoryName: "HVAC", meterType: "hours", unit: "hrs", currentReading: 8420, thresholdValue: 8500, percentOfThreshold: 99, status: "approaching", lastReadingDate: "2026-03-10T09:00:00Z", daysSinceReading: 3 },
  { id: 6, meterId: 4, assetId: 4, assetName: "Boiler Unit B", categoryName: "HVAC", meterType: "hours", unit: "hrs", currentReading: 3800, thresholdValue: 4000, percentOfThreshold: 95, status: "approaching", lastReadingDate: "2026-03-09T07:45:00Z", daysSinceReading: 4 },
  { id: 7, meterId: 8, assetId: 7, assetName: "Service Van #1", categoryName: "Fleet", meterType: "miles", unit: "mi", currentReading: 48200, thresholdValue: 50000, percentOfThreshold: 96, status: "approaching", lastReadingDate: "2026-03-11T17:30:00Z", daysSinceReading: 2 },
  { id: 8, meterId: 9, assetId: 8, assetName: "Forklift FL-02", categoryName: "Equipment", meterType: "hours", unit: "hrs", currentReading: 1950, thresholdValue: 2000, percentOfThreshold: 98, status: "approaching", lastReadingDate: "2026-03-10T15:00:00Z", daysSinceReading: 3 },
  { id: 9, meterId: 10, assetId: 9, assetName: "Scissor Lift SL-01", categoryName: "Equipment", meterType: "cycles", unit: "cycles", currentReading: 8800, thresholdValue: 9000, percentOfThreshold: 98, status: "approaching", lastReadingDate: "2026-03-07T13:00:00Z", daysSinceReading: 6 },
  { id: 10, meterId: 15, assetId: 13, assetName: "Elevator ELV-A", categoryName: "Vertical Transport", meterType: "cycles", unit: "cycles", currentReading: 89500, thresholdValue: 90000, percentOfThreshold: 99, status: "approaching", lastReadingDate: "2026-03-11T12:00:00Z", daysSinceReading: 2 },
  { id: 11, meterId: 17, assetId: 15, assetName: "AHU-03 Air Handler", categoryName: "HVAC", meterType: "hours", unit: "hrs", currentReading: 2950, thresholdValue: 3000, percentOfThreshold: 98, status: "approaching", lastReadingDate: "2026-03-10T08:00:00Z", daysSinceReading: 3 },
  { id: 12, meterId: 7, assetId: 6, assetName: "Generator GEN-01", categoryName: "Electrical", meterType: "gallons", unit: "gal", currentReading: 4800, thresholdValue: 5000, percentOfThreshold: 96, status: "approaching", lastReadingDate: "2026-03-12T06:00:00Z", daysSinceReading: 1 },

  // Overdue readings
  { id: 13, meterId: 26, assetId: 24, assetName: "Cooling Tower CT-3", categoryName: "HVAC", meterType: "hours", unit: "hrs", currentReading: 4100, thresholdValue: 5000, percentOfThreshold: 82, status: "overdue_reading", lastReadingDate: "2026-01-20T08:00:00Z", daysSinceReading: 52 },
  { id: 14, meterId: 27, assetId: 25, assetName: "Fire Panel FP-Main", categoryName: "Fire Safety", meterType: "cycles", unit: "cycles", currentReading: 18200, thresholdValue: null, percentOfThreshold: null, status: "overdue_reading", lastReadingDate: "2026-01-05T11:00:00Z", daysSinceReading: 67 },
  { id: 15, meterId: 28, assetId: 3, assetName: "Chiller Unit A", categoryName: "HVAC", meterType: "gallons", unit: "gal", currentReading: 62000, thresholdValue: null, percentOfThreshold: null, status: "overdue_reading", lastReadingDate: "2026-02-01T09:00:00Z", daysSinceReading: 40 },
];
