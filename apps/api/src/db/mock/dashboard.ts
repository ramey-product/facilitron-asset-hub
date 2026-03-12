import type {
  DashboardProvider,
  PaginatedResult,
} from "../../types/providers.js";
import type {
  DashboardStats,
  DashboardAlert,
  DashboardAlertType,
  ActivityEvent,
} from "@asset-hub/shared";
import { mockAssets } from "./data/assets.js";
import { mockActivityEvents } from "./data/activity.js";

export const mockDashboardProvider: DashboardProvider = {
  async getStats(customerID: number): Promise<DashboardStats> {
    const active = mockAssets.filter(
      (a) => a.customerID === customerID && a.isActive
    );

    // Assets by status
    const statusMap = new Map<string, number>();
    for (const a of active) {
      const s = a.lifecycleStatus;
      statusMap.set(s, (statusMap.get(s) ?? 0) + 1);
    }
    const assetsByStatus = Array.from(statusMap.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

    // Assets by category — top 5
    const catMap = new Map<string, { slug: string; count: number }>();
    for (const a of active) {
      const cat = a.categoryName ?? "Uncategorized";
      const slug = a.categorySlug ?? "uncategorized";
      const existing = catMap.get(cat);
      if (existing) {
        existing.count++;
      } else {
        catMap.set(cat, { slug, count: 1 });
      }
    }
    const assetsByCategory = Array.from(catMap.entries())
      .map(([category, { slug, count }]) => ({ category, slug, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Assets needing attention: poor condition (<=2), overdue maintenance (>180 days),
    // expired warranty, or flagged status
    const now = new Date();
    const dayMs = 86400000;
    let needsAttention = 0;
    for (const a of active) {
      if (a.conditionRating !== null && a.conditionRating <= 2) {
        needsAttention++;
        continue;
      }
      if (a.lastConditionDate) {
        const lastDate = new Date(a.lastConditionDate);
        if (now.getTime() - lastDate.getTime() > 180 * dayMs) {
          needsAttention++;
          continue;
        }
      }
      if (a.warrantyExpiration) {
        const expDate = new Date(a.warrantyExpiration);
        if (expDate < now) {
          needsAttention++;
          continue;
        }
      }
      if (a.lifecycleStatus === "Flagged") {
        needsAttention++;
      }
    }

    return {
      totalAssets: active.length,
      activeAssets: active.filter((a) => a.lifecycleStatus === "Active").length,
      assetsByStatus,
      assetsByCategory,
      assetsNeedingAttention: needsAttention,
    };
  },

  async getAlerts(
    customerID: number,
    type: DashboardAlertType | undefined,
    page: number,
    limit: number
  ): Promise<PaginatedResult<DashboardAlert>> {
    const active = mockAssets.filter(
      (a) => a.customerID === customerID && a.isActive
    );
    const now = new Date();
    const dayMs = 86400000;
    const alerts: DashboardAlert[] = [];
    let alertId = 1;

    for (const a of active) {
      // Overdue maintenance (>180 days since last condition)
      if (a.lastConditionDate) {
        const lastDate = new Date(a.lastConditionDate);
        const daysSince = Math.floor(
          (now.getTime() - lastDate.getTime()) / dayMs
        );
        if (daysSince > 180) {
          alerts.push({
            id: alertId++,
            type: "overdue_maintenance",
            severity: daysSince > 365 ? "critical" : "warning",
            assetId: a.equipmentRecordID,
            assetName: a.equipmentName,
            propertyName: a.propertyName ?? null,
            message: `Maintenance overdue by ${daysSince} days`,
            detail: `Last condition assessment: ${lastDate.toLocaleDateString()}`,
            createdAt: now.toISOString(),
          });
        }
      }

      // Poor condition (rating <= 2)
      if (a.conditionRating !== null && a.conditionRating <= 2) {
        alerts.push({
          id: alertId++,
          type: "poor_condition",
          severity: a.conditionRating === 1 ? "critical" : "warning",
          assetId: a.equipmentRecordID,
          assetName: a.equipmentName,
          propertyName: a.propertyName ?? null,
          message: `Condition rated ${a.conditionRating === 1 ? "Critical" : "Poor"} (${a.conditionRating}/5)`,
          detail: a.notes,
          createdAt: a.lastConditionDate ?? now.toISOString(),
        });
      }

      // Expired warranty
      if (a.warrantyExpiration) {
        const expDate = new Date(a.warrantyExpiration);
        if (expDate < now) {
          alerts.push({
            id: alertId++,
            type: "expired_warranty",
            severity: "warning",
            assetId: a.equipmentRecordID,
            assetName: a.equipmentName,
            propertyName: a.propertyName ?? null,
            message: "Warranty has expired",
            detail: `Expired on ${expDate.toLocaleDateString()}`,
            createdAt: a.warrantyExpiration,
          });
        } else {
          // Expiring warranty (<90 days)
          const daysUntil = Math.floor(
            (expDate.getTime() - now.getTime()) / dayMs
          );
          if (daysUntil < 90) {
            alerts.push({
              id: alertId++,
              type: "expiring_warranty",
              severity: daysUntil < 30 ? "warning" : "info",
              assetId: a.equipmentRecordID,
              assetName: a.equipmentName,
              propertyName: a.propertyName ?? null,
              message: `Warranty expires in ${daysUntil} days`,
              detail: `Expires on ${expDate.toLocaleDateString()}`,
              createdAt: now.toISOString(),
            });
          }
        }
      }
    }

    // Filter by type if specified
    let filtered = type ? alerts.filter((a) => a.type === type) : alerts;

    // Sort by severity (critical first), then by date
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    filtered.sort(
      (a, b) =>
        severityOrder[a.severity] - severityOrder[b.severity] ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const total = filtered.length;
    const start = (page - 1) * limit;
    filtered = filtered.slice(start, start + limit);

    return {
      items: filtered,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getActivity(
    customerID: number,
    page: number,
    limit: number
  ): Promise<PaginatedResult<ActivityEvent>> {
    // All mock activity is for customerID=1
    const events =
      customerID === 1
        ? [...mockActivityEvents].sort(
            (a, b) =>
              new Date(b.timestamp).getTime() -
              new Date(a.timestamp).getTime()
          )
        : [];

    const total = events.length;
    const start = (page - 1) * limit;
    const items = events.slice(start, start + limit);

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
