import type {
  ConditionProvider,
  ConditionLogRecord,
  ConditionScaleRecord,
  CreateConditionLogInput,
  ConditionStats,
  PaginatedResult,
} from "../../types/providers.js";
import { mockConditionLogs } from "./data/condition-logs.js";
import { mockConditionScales } from "./data/conditions.js";

// Working copy for in-memory mutations
const logs = [...mockConditionLogs];
let nextId = Math.max(...logs.map((l) => l.id)) + 1;

const scoreToLabel: Record<number, string> = {
  5: "Excellent",
  4: "Good",
  3: "Fair",
  2: "Poor",
  1: "Critical",
};

export const mockConditionProvider: ConditionProvider = {
  async getScale(customerID: number): Promise<ConditionScaleRecord[]> {
    return mockConditionScales
      .filter((s) => s.customerID === customerID && s.isActive)
      .map((s) => ({
        ...s,
        description: getScaleDescription(s.conditionScore),
      }));
  },

  async getHistory(
    customerID: number,
    equipmentId: number,
    limit: number,
    offset: number
  ): Promise<PaginatedResult<ConditionLogRecord>> {
    const items = logs
      .filter(
        (l) =>
          l.customerId === customerID && l.equipmentRecordId === equipmentId
      )
      .sort(
        (a, b) =>
          new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
      );

    const total = items.length;
    const paged = items.slice(offset, offset + limit);

    return {
      items: paged,
      meta: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getStats(
    customerID: number,
    equipmentId: number
  ): Promise<ConditionStats | null> {
    const items = logs
      .filter(
        (l) =>
          l.customerId === customerID && l.equipmentRecordId === equipmentId
      )
      .sort(
        (a, b) =>
          new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime()
      );

    if (items.length === 0) return null;

    const latest = items[items.length - 1]!;
    const previous = items.length > 1 ? items[items.length - 2]! : null;

    const avgScore =
      items.reduce((sum, l) => sum + l.conditionScore, 0) / items.length;

    // Determine trend from last 3 entries
    let trend: "improving" | "declining" | "stable" = "stable";
    if (items.length >= 2) {
      const recent = items.slice(-3);
      const first = recent[0]!.conditionScore;
      const last = recent[recent.length - 1]!.conditionScore;
      if (last > first) trend = "improving";
      else if (last < first) trend = "declining";
    }

    return {
      currentScore: latest.conditionScore,
      currentLabel: scoreToLabel[latest.conditionScore] ?? "Unknown",
      previousScore: previous?.conditionScore ?? null,
      trend,
      totalLogs: items.length,
      lastLoggedAt: latest.loggedAt,
      averageScore: Math.round(avgScore * 100) / 100,
      scoreHistory: items.map((l) => ({
        date: l.loggedAt,
        score: l.conditionScore,
      })),
    };
  },

  async logCondition(
    customerID: number,
    equipmentId: number,
    loggedBy: number,
    data: CreateConditionLogInput
  ): Promise<ConditionLogRecord> {
    // Find most recent log for this asset to get previous score
    const existing = logs
      .filter(
        (l) =>
          l.customerId === customerID && l.equipmentRecordId === equipmentId
      )
      .sort(
        (a, b) =>
          new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
      );

    const previousScore =
      existing.length > 0 ? existing[0]!.conditionScore : null;

    const newLog: ConditionLogRecord = {
      id: nextId++,
      equipmentRecordId: equipmentId,
      customerId: customerID,
      conditionScore: data.conditionScore,
      previousScore,
      source: data.source ?? "manual",
      notes: data.notes ?? null,
      loggedBy,
      loggedAt: new Date().toISOString(),
    };

    logs.push(newLog);
    return newLog;
  },
};

function getScaleDescription(score: number): string {
  switch (score) {
    case 5:
      return "Asset is in like-new condition with no defects.";
    case 4:
      return "Asset functions well with minor cosmetic wear.";
    case 3:
      return "Asset is functional but shows moderate wear or minor issues.";
    case 2:
      return "Asset has significant issues affecting performance.";
    case 1:
      return "Asset is non-functional or poses safety risks.";
    default:
      return "";
  }
}
