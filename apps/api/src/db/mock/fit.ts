import type {
  FitSummary,
  FitInspectionRecord,
  FitInspectionResult,
} from "@asset-hub/shared";
import type { FitProvider, PaginatedResult } from "../../types/providers.js";
import { mockAssets } from "./data/assets.js";

// ---- Seed: generate FIT inspection records for active assets ----

const inspectors = [
  "Mike Chen",
  "Sarah Rodriguez",
  "James Wilson",
  "Priya Patel",
  "Tom Bradley",
];

const results: FitInspectionResult[] = ["pass", "pass", "fail", "partial", "pass"];

let nextInspectionId = 1;

// Build inspection records: 3-5 per active asset
const inspections: FitInspectionRecord[] = [];

const activeAssetIds = mockAssets
  .filter((a) => a.customerID === 1 && a.isActive)
  .map((a) => a.equipmentRecordID);

for (const assetId of activeAssetIds) {
  const recordCount = 3 + (assetId % 3); // 3, 4, or 5 records
  const baseDate = new Date("2024-06-01");

  for (let i = 0; i < recordCount; i++) {
    const inspDate = new Date(baseDate);
    inspDate.setMonth(inspDate.getMonth() + i * 3); // quarterly inspections
    const resultIdx = (assetId + i) % results.length;
    const result = results[resultIdx]!;
    const inspectorIdx = (assetId + i) % inspectors.length;

    inspections.push({
      id: nextInspectionId++,
      assetId,
      inspectionDate: inspDate.toISOString(),
      result,
      inspector: inspectors[inspectorIdx]!,
      conditionRating: result === "pass" ? 4 + (i % 2) : result === "partial" ? 3 : 2,
      notes:
        result === "fail"
          ? "Deficiencies found — see attached report for remediation items."
          : result === "partial"
            ? "Minor issues noted. Follow-up items assigned."
            : null,
      deficiencyCount: result === "fail" ? 2 + (i % 3) : result === "partial" ? 1 : 0,
    });
  }
}

function buildSummary(assetId: number): FitSummary | null {
  const assetInspections = inspections
    .filter((r) => r.assetId === assetId)
    .sort(
      (a, b) =>
        new Date(b.inspectionDate).getTime() -
        new Date(a.inspectionDate).getTime()
    );

  if (assetInspections.length === 0) return null;

  const latest = assetInspections[0]!;
  const nextDate = new Date(latest.inspectionDate);
  nextDate.setMonth(nextDate.getMonth() + 6); // next scheduled 6 months after last

  const openDeficiencies = assetInspections
    .slice(0, 3)
    .reduce((sum, r) => sum + r.deficiencyCount, 0);

  return {
    assetId,
    lastInspectionDate: latest.inspectionDate,
    lastInspectionResult: latest.result,
    inspectionCount: assetInspections.length,
    nextScheduledDate: nextDate.toISOString(),
    conditionAtLastInspection: latest.conditionRating,
    inspector: latest.inspector,
    openDeficiencies: Math.min(openDeficiencies, 5), // cap at realistic number
  };
}

export const mockFitProvider: FitProvider = {
  async getSummary(
    _customerID: number,
    assetId: number
  ): Promise<FitSummary | null> {
    return buildSummary(assetId);
  },

  async getInspections(
    _customerID: number,
    assetId: number,
    page: number,
    limit: number
  ): Promise<PaginatedResult<FitInspectionRecord>> {
    const assetInspections = inspections
      .filter((r) => r.assetId === assetId)
      .sort(
        (a, b) =>
          new Date(b.inspectionDate).getTime() -
          new Date(a.inspectionDate).getTime()
      );

    const total = assetInspections.length;
    const start = (page - 1) * limit;
    const items = assetInspections.slice(start, start + limit);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};
