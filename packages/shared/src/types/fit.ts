/**
 * FIT (Facilitron Inspection Tool) integration types.
 * P0-16 feature set. Read-only from Asset Hub's perspective.
 */

export type FitInspectionResult = "pass" | "fail" | "partial";

export interface FitSummary {
  assetId: number;
  lastInspectionDate: string | null;
  lastInspectionResult: FitInspectionResult | null;
  inspectionCount: number;
  nextScheduledDate: string | null;
  conditionAtLastInspection: number | null;
  inspector: string | null;
  openDeficiencies: number;
}

export interface FitInspectionRecord {
  id: number;
  assetId: number;
  inspectionDate: string;
  result: FitInspectionResult;
  inspector: string;
  conditionRating: number;
  notes: string | null;
  deficiencyCount: number;
}
