/**
 * Consumables dashboard types shared between API and web app.
 * P1-32: Consumables Dashboard
 */

export interface CategoryBreakdownEntry {
  category: string;
  count: number;
  value: number;
  percentage: number;
}

export interface ConsumableDashboardKPIs {
  totalParts: number;
  totalValue: number;
  belowReorder: number;
  zeroStock: number;
  categoryBreakdown: CategoryBreakdownEntry[];
}

export interface UsageTrendPart {
  partId: number;
  partName: string;
  quantity: number;
}

export interface UsageTrend {
  month: string;
  parts: UsageTrendPart[];
  totalCost: number;
}

export type RecentActivityEventType =
  | "receipt"
  | "consumption"
  | "transfer"
  | "adjustment"
  | "reorder-alert";

export interface RecentActivity {
  id: number;
  eventType: RecentActivityEventType;
  partId: number;
  partName: string;
  quantity: number;
  amount: number | null;
  user: string;
  timestamp: string;
  reference: string | null;
}
