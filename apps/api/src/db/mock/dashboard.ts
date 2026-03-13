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
import { mockProperties } from "./data/locations.js";
import { mockWorkOrders } from "./data/work-orders.js";

export const mockDashboardProvider: DashboardProvider = {
  async getStats(customerID: number, propertyId?: number): Promise<DashboardStats> {
    let active = mockAssets.filter(
      (a) => a.customerID === customerID && a.isActive
    );
    if (propertyId !== undefined) {
      active = active.filter((a) => a.propertyID === propertyId);
    }

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

    // Category breakdown (same data, different key name for the chart component)
    const categoryBreakdown = assetsByCategory.map((c) => ({
      name: c.category,
      count: c.count,
      slug: c.slug,
    }));

    // Condition distribution for donut chart
    const conditionBuckets = { Excellent: 0, Good: 0, Fair: 0, Poor: 0, Critical: 0 };
    const conditionFills: Record<string, string> = {
      Excellent: "var(--chart-1)",
      Good: "var(--chart-2)",
      Fair: "var(--chart-3)",
      Poor: "var(--chart-4)",
      Critical: "var(--chart-5)",
    };
    for (const a of active) {
      const r = a.conditionRating;
      if (r === null) continue;
      if (r === 5) conditionBuckets.Excellent++;
      else if (r === 4) conditionBuckets.Good++;
      else if (r === 3) conditionBuckets.Fair++;
      else if (r === 2) conditionBuckets.Poor++;
      else conditionBuckets.Critical++;
    }
    const conditionDistribution = Object.entries(conditionBuckets)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value, fill: conditionFills[name] ?? "var(--chart-1)" }));

    // Count poor/critical condition
    const poorCount = active.filter(
      (a) => a.conditionRating !== null && a.conditionRating === 2
    ).length;
    const criticalCount = active.filter(
      (a) => a.conditionRating !== null && a.conditionRating <= 1
    ).length;

    // Online/offline from operationalStatus field
    const onlineCount = active.filter(
      (a) => a.operationalStatus === "online"
    ).length;
    const offlineCount = active.filter(
      (a) => a.operationalStatus === "offline"
    ).length;

    // Total properties for this customer (scoped to 1 when filtering by property)
    const totalProperties = propertyId !== undefined
      ? 1
      : mockProperties.filter(
          (p) => p.customerID === customerID && p.isActive
        ).length;

    // Work orders (filter by property via asset lookup when scoped)
    const activeAssetIds = propertyId !== undefined
      ? new Set(active.map((a) => a.equipmentRecordID))
      : null;
    const customerWOs = mockWorkOrders.filter(
      (wo) =>
        wo.customerID === customerID &&
        (activeAssetIds === null || activeAssetIds.has(wo.equipmentRecordID))
    );
    const openWorkOrders = customerWOs.filter(
      (wo) => wo.status === "InProgress" || wo.status === "Open"
    ).length;
    const overdueWorkOrders = Math.max(0, Math.floor(openWorkOrders * 0.3)); // ~30% overdue for demo

    // YTD maintenance cost
    const currentYear = new Date().getFullYear();
    const ytdMaintenanceCost = customerWOs
      .filter((wo) => {
        if (!wo.completedDate) return false;
        return new Date(wo.completedDate).getFullYear() >= currentYear - 1;
      })
      .reduce((sum, wo) => sum + wo.laborCost + wo.partsCost + wo.vendorCost, 0);

    // Total asset value (sum of acquisition costs)
    const totalAssetValue = active.reduce(
      (sum, a) => sum + (a.acquisitionCost ?? 0),
      0
    );

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
      activeCount: active.filter((a) => a.lifecycleStatus === "Active").length,
      flaggedCount: active.filter((a) => a.lifecycleStatus === "Flagged").length,
      criticalCount,
      poorCount,
      onlineCount,
      offlineCount,
      totalProperties,
      openWorkOrders,
      overdueWorkOrders,
      ytdMaintenanceCost,
      totalAssetValue,
      assetsNeedingAttention: needsAttention,
      assetsByStatus,
      assetsByCategory,
      conditionDistribution,
      categoryBreakdown,
    };
  },

  async getAlerts(
    customerID: number,
    type: DashboardAlertType | undefined,
    page: number,
    limit: number,
    propertyId?: number
  ): Promise<PaginatedResult<DashboardAlert>> {
    let active = mockAssets.filter(
      (a) => a.customerID === customerID && a.isActive
    );
    if (propertyId !== undefined) {
      active = active.filter((a) => a.propertyID === propertyId);
    }
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
    limit: number,
    propertyId?: number
  ): Promise<PaginatedResult<ActivityEvent>> {
    // All mock activity is for customerID=1
    let events =
      customerID === 1
        ? [...mockActivityEvents].sort(
            (a, b) =>
              new Date(b.timestamp).getTime() -
              new Date(a.timestamp).getTime()
          )
        : [];

    // Filter activity to the scoped property via asset lookup
    if (propertyId !== undefined) {
      const propertyAssetIds = new Set(
        mockAssets
          .filter(
            (a) => a.customerID === customerID && a.propertyID === propertyId
          )
          .map((a) => a.equipmentRecordID)
      );
      events = events.filter(
        (e) => e.assetId !== null && propertyAssetIds.has(e.assetId)
      );
    }

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
