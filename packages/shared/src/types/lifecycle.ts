/**
 * Asset lifecycle tracking types shared between API and web app.
 * P1-35: Lifecycle Reporting, EOL forecasting, compliance
 */

export type LifecycleStage =
  | "Procurement"
  | "Active"
  | "UnderMaintenance"
  | "ScheduledForReplacement"
  | "Disposed";

export interface LifecycleEvent {
  id: number;
  assetId: number;
  assetName: string;
  fromStage: LifecycleStage | null; // null for initial placement
  toStage: LifecycleStage;
  transitionDate: string;
  reason: string;
  notes: string | null;
  changedBy: number;
  changedByName: string;
}

export interface AvgLifespanByCategory {
  categoryName: string;
  avgYears: number;
  assetCount: number;
}

export interface StageDistributionItem {
  stage: LifecycleStage;
  count: number;
  percentage: number;
}

export interface LifecycleKPIs {
  avgLifespanYears: number;
  avgLifespanByCategory: AvgLifespanByCategory[];
  stageDistribution: StageDistributionItem[];
  approachingEndOfLife: number; // count within 12 months
  disposedThisYear: number;
}

export interface ForecastedAsset {
  assetId: number;
  assetName: string;
  categoryName: string;
  predictedRetirementDate: string;
  replacementCost: number;
}

export interface LifecycleForecast {
  quarter: string; // "2026-Q1"
  predictedRetirements: number;
  estimatedReplacementCost: number;
  assets: ForecastedAsset[];
}

export interface ComplianceRecord {
  assetId: number;
  assetName: string;
  categoryName: string;
  currentStage: LifecycleStage;
  daysInStage: number;
  expectedMaxDays: number;
  isOverdue: boolean;
  lastTransitionDate: string;
  nextExpectedTransition: string | null;
}

export interface CreateLifecycleEventInput {
  assetId: number;
  toStage: LifecycleStage;
  reason: string;
  notes?: string;
  transitionDate?: string;
}

export interface ListLifecycleEventsQuery {
  page?: number;
  limit?: number;
  assetId?: number;
  stage?: LifecycleStage;
}
