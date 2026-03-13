/**
 * Meter-Based Maintenance types shared between API and web app.
 * P1-29: Meter readings, threshold triggers, auto-WO generation
 */

export type MeterType = "hours" | "miles" | "cycles" | "gallons" | string;

export interface AssetMeter {
  id: number;
  assetId: number;
  assetName: string | null;
  meterType: MeterType;
  unit: string; // "hrs", "mi", "cycles", "gal", etc.
  currentReading: number;
  lastReadingDate: string | null;
  lastReadingBy: number | null;
  lastReadingByName: string | null;
  createdAt: string;
  updatedAt: string;
  // joined threshold info
  hasThreshold: boolean;
  thresholdValue: number | null;
  percentOfThreshold: number | null; // 0-100+
}

export interface MeterReading {
  id: number;
  meterId: number;
  assetId: number;
  value: number;
  readingDate: string;
  recordedBy: number;
  recordedByName: string | null;
  notes: string | null;
  delta: number | null; // difference from previous reading
}

export interface MeterThreshold {
  id: number;
  meterId: number;
  assetId: number;
  thresholdValue: number;
  triggerMode: "once" | "recurring";
  intervalValue: number | null; // for recurring: trigger every N units
  pmTemplateDescription: string | null;
  lastTriggeredAt: string | null;
  lastTriggeredReading: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MeterAlertStatus = "approaching" | "exceeded" | "overdue_reading";

export interface MeterAlert {
  id: number;
  meterId: number;
  assetId: number;
  assetName: string;
  categoryName: string | null;
  meterType: MeterType;
  unit: string;
  currentReading: number;
  thresholdValue: number | null;
  percentOfThreshold: number | null;
  status: MeterAlertStatus;
  lastReadingDate: string | null;
  daysSinceReading: number | null;
}

// ---- Inputs ----

export interface CreateMeterReadingInput {
  value: number;
  readingDate?: string;
  notes?: string;
}

export interface UpdateMeterThresholdInput {
  thresholdValue: number;
  triggerMode?: "once" | "recurring";
  intervalValue?: number;
  pmTemplateDescription?: string;
  isActive?: boolean;
}

export interface ListMeterReadingsQuery {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}
