/**
 * Downtime Tracking types shared between API and web app.
 * P1-30: Downtime events, MTBF/MTTR, reliability dashboard
 */

export type DowntimeReason =
  | "mechanical_failure"
  | "electrical_failure"
  | "planned_maintenance"
  | "operator_error"
  | "parts_unavailable"
  | "waiting_for_parts"
  | "inspection"
  | "environmental"
  | "unknown"
  | string;

export interface DowntimeEvent {
  id: number;
  assetId: number;
  assetName: string | null;
  startTime: string;
  endTime: string | null; // null = ongoing
  durationMinutes: number | null; // null if ongoing
  reason: DowntimeReason;
  reasonDescription: string | null;
  associatedWoId: number | null;
  resolvedBy: number | null;
  resolvedByName: string | null;
  createdAt: string;
  updatedAt: string;
}

export type StatsWindow = "90d" | "6m" | "12m";

export interface DowntimeStats {
  assetId: number;
  window: StatsWindow;
  mtbf: number; // Mean Time Between Failures, in hours
  mttr: number; // Mean Time To Repair, in hours
  availability: number; // percentage (0-100)
  totalEvents: number;
  totalDowntimeHours: number;
  ongoingEvents: number;
  asOf: string;
}

export type ReliabilityTrend = "improving" | "declining" | "stable";

export interface ReliabilityRecord {
  assetId: number;
  assetName: string;
  categoryName: string | null;
  propertyName: string | null;
  mtbf: number;
  mttr: number;
  availability: number;
  downtimeEvents: number;
  totalDowntimeHours: number;
  trend: ReliabilityTrend;
  lastDowntimeDate: string | null;
}

// ---- Inputs ----

export interface CreateDowntimeEventInput {
  startTime?: string;
  reason: DowntimeReason;
  reasonDescription?: string;
  associatedWoId?: number;
}

export interface ListDowntimeEventsQuery {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  reason?: DowntimeReason;
  ongoingOnly?: boolean;
}

export interface DowntimeStatsQuery {
  window?: StatsWindow;
}
