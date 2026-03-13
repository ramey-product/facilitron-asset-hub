/**
 * Mock provider for P1-35 Asset Lifecycle Tracking.
 * In-memory lifecycle event management with KPIs and forecasting.
 */

import type {
  LifecycleEvent,
  LifecycleKPIs,
  LifecycleForecast,
  ComplianceRecord,
  LifecycleStage,
  CreateLifecycleEventInput,
} from "@asset-hub/shared";
import { mockLifecycleEvents, mockLifecycleForecast, mockComplianceRecords } from "./data/lifecycle.js";

// Working copy
const lifecycleEvents: LifecycleEvent[] = mockLifecycleEvents.map((e) => ({ ...e }));
let nextEventId = Math.max(...lifecycleEvents.map((e) => e.id)) + 1;

export const mockLifecycleProvider = {
  async getAssetLifecycleEvents(
    _customerID: number,
    assetId: number
  ): Promise<LifecycleEvent[]> {
    return lifecycleEvents
      .filter((e) => e.assetId === assetId)
      .sort((a, b) => a.transitionDate.localeCompare(b.transitionDate));
  },

  async getCurrentStage(
    _customerID: number,
    assetId: number
  ): Promise<LifecycleStage | null> {
    const events = lifecycleEvents
      .filter((e) => e.assetId === assetId)
      .sort((a, b) => b.transitionDate.localeCompare(a.transitionDate));
    return events[0]?.toStage ?? null;
  },

  async getLifecycleKPIs(_customerID: number): Promise<LifecycleKPIs> {
    // Get the final stage per asset
    const assetStageMap = new Map<number, { stage: LifecycleStage; assetName: string; firstDate: string }>();
    for (const event of lifecycleEvents) {
      const existing = assetStageMap.get(event.assetId);
      if (!existing || event.transitionDate > existing.firstDate) {
        const firstEvent = lifecycleEvents
          .filter((e) => e.assetId === event.assetId)
          .sort((a, b) => a.transitionDate.localeCompare(b.transitionDate))[0];
        assetStageMap.set(event.assetId, {
          stage: event.toStage,
          assetName: event.assetName,
          firstDate: firstEvent?.transitionDate ?? event.transitionDate,
        });
      }
    }

    // Stage distribution
    const stageCounts = new Map<LifecycleStage, number>();
    for (const { stage } of assetStageMap.values()) {
      stageCounts.set(stage, (stageCounts.get(stage) ?? 0) + 1);
    }
    const total = assetStageMap.size;
    const stageDistribution = (["Procurement", "Active", "UnderMaintenance", "ScheduledForReplacement", "Disposed"] as LifecycleStage[])
      .map((stage) => ({
        stage,
        count: stageCounts.get(stage) ?? 0,
        percentage: total > 0 ? Math.round(((stageCounts.get(stage) ?? 0) / total) * 100) : 0,
      }));

    // Disposed assets this year
    const thisYear = new Date().getFullYear();
    const disposedThisYear = lifecycleEvents.filter(
      (e) => e.toStage === "Disposed" && new Date(e.transitionDate).getFullYear() === thisYear
    ).length;

    // Approaching EOL: assets in ScheduledForReplacement stage
    const approachingEndOfLife = stageCounts.get("ScheduledForReplacement") ?? 0;

    // Average lifespan by category — using disposed assets
    const disposedAssets = [...assetStageMap.entries()].filter(([, v]) => v.stage === "Disposed");
    const categoryLifespan = new Map<string, number[]>();

    for (const [assetId, info] of disposedAssets) {
      const disposeEvent = lifecycleEvents
        .filter((e) => e.assetId === assetId && e.toStage === "Disposed")
        .sort((a, b) => b.transitionDate.localeCompare(a.transitionDate))[0];
      if (!disposeEvent) continue;

      const startDate = new Date(info.firstDate);
      const endDate = new Date(disposeEvent.transitionDate);
      const years = (endDate.getTime() - startDate.getTime()) / (365.25 * 24 * 3600 * 1000);

      const category = lifecycleEvents
        .filter((e) => e.assetId === assetId)
        .map((e) => {
          // Infer category from name
          if (e.assetName.toLowerCase().includes("boiler") || e.assetName.toLowerCase().includes("rtu") ||
              e.assetName.toLowerCase().includes("chiller") || e.assetName.toLowerCase().includes("ahu")) return "HVAC";
          if (e.assetName.toLowerCase().includes("elev")) return "Structural";
          return "General";
        })[0] ?? "General";

      const existing = categoryLifespan.get(category) ?? [];
      existing.push(years);
      categoryLifespan.set(category, existing);
    }

    const avgLifespanByCategory = [
      { categoryName: "HVAC", avgYears: 18.5, assetCount: 12 },
      { categoryName: "Electrical", avgYears: 22.0, assetCount: 7 },
      { categoryName: "Plumbing", avgYears: 20.0, assetCount: 5 },
      { categoryName: "Fire Safety", avgYears: 15.0, assetCount: 4 },
      { categoryName: "Structural", avgYears: 25.0, assetCount: 3 },
      { categoryName: "Security", avgYears: 8.0, assetCount: 6 },
    ];

    return {
      avgLifespanYears: 18.8,
      avgLifespanByCategory,
      stageDistribution,
      approachingEndOfLife,
      disposedThisYear,
    };
  },

  async getLifecycleForecast(
    _customerID: number,
    years: number = 5
  ): Promise<LifecycleForecast[]> {
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() + years);

    return mockLifecycleForecast.filter((f) => {
      const [yearStr, qStr] = f.quarter.split("-Q");
      const qYear = parseInt(yearStr ?? "0", 10);
      const qNum = parseInt(qStr ?? "1", 10);
      const qDate = new Date(qYear, (qNum - 1) * 3, 1);
      return qDate <= cutoff;
    });
  },

  async getComplianceReport(_customerID: number): Promise<ComplianceRecord[]> {
    return [...mockComplianceRecords].sort((a, b) => {
      // Sort: overdue first, then by days in stage desc
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      return b.daysInStage - a.daysInStage;
    });
  },

  async createLifecycleEvent(
    _customerID: number,
    input: CreateLifecycleEventInput
  ): Promise<LifecycleEvent> {
    const now = new Date().toISOString();

    // Get current stage for fromStage
    const currentStage = await mockLifecycleProvider.getCurrentStage(0, input.assetId);

    const event: LifecycleEvent = {
      id: nextEventId++,
      assetId: input.assetId,
      assetName: `Asset #${input.assetId}`,
      fromStage: currentStage,
      toStage: input.toStage,
      transitionDate: input.transitionDate ?? now,
      reason: input.reason,
      notes: input.notes ?? null,
      changedBy: 1,
      changedByName: "demo.user",
    };

    lifecycleEvents.push(event);
    return event;
  },
};
