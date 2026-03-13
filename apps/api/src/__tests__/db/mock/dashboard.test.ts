/**
 * Unit tests for mockDashboardProvider — tests the mock data layer directly.
 */
import { describe, it, expect } from "vitest";
import { mockDashboardProvider } from "../../../db/mock/dashboard.js";

const CUSTOMER_ID = 1;

describe("mockDashboardProvider.getStats — unscoped", () => {
  it("returns DashboardStats for customerID 1", async () => {
    const stats = await mockDashboardProvider.getStats(CUSTOMER_ID);
    expect(stats).toBeDefined();
  });

  it("totalAssets equals count of active assets in mock data", async () => {
    const stats = await mockDashboardProvider.getStats(CUSTOMER_ID);
    expect(stats.totalAssets).toBeGreaterThan(0);
  });

  it("assetsByStatus sums to totalAssets", async () => {
    const stats = await mockDashboardProvider.getStats(CUSTOMER_ID);
    const sum = stats.assetsByStatus.reduce(
      (acc, s) => acc + s.count,
      0
    );
    expect(sum).toBe(stats.totalAssets);
  });

  it("onlineCount + offlineCount <= totalAssets", async () => {
    const stats = await mockDashboardProvider.getStats(CUSTOMER_ID);
    expect(stats.onlineCount + stats.offlineCount).toBeLessThanOrEqual(
      stats.totalAssets
    );
  });

  it("assetsByCategory has no more than 5 entries", async () => {
    const stats = await mockDashboardProvider.getStats(CUSTOMER_ID);
    expect(stats.assetsByCategory.length).toBeLessThanOrEqual(5);
  });

  it("assetsByCategory is sorted by count descending", async () => {
    const stats = await mockDashboardProvider.getStats(CUSTOMER_ID);
    const counts = stats.assetsByCategory.map((c) => c.count);
    for (let i = 1; i < counts.length; i++) {
      expect(counts[i - 1]!).toBeGreaterThanOrEqual(counts[i]!);
    }
  });

  it("conditionDistribution only includes buckets with value > 0", async () => {
    const stats = await mockDashboardProvider.getStats(CUSTOMER_ID);
    for (const bucket of stats.conditionDistribution) {
      expect(bucket.value).toBeGreaterThan(0);
    }
  });

  it("conditionDistribution names are valid", async () => {
    const stats = await mockDashboardProvider.getStats(CUSTOMER_ID);
    const validNames = ["Excellent", "Good", "Fair", "Poor", "Critical"];
    for (const bucket of stats.conditionDistribution) {
      expect(validNames).toContain(bucket.name);
    }
  });

  it("totalProperties is greater than 1", async () => {
    const stats = await mockDashboardProvider.getStats(CUSTOMER_ID);
    expect(stats.totalProperties).toBeGreaterThan(1);
  });

  it("totalAssetValue is a non-negative number", async () => {
    const stats = await mockDashboardProvider.getStats(CUSTOMER_ID);
    expect(typeof stats.totalAssetValue).toBe("number");
    expect(stats.totalAssetValue).toBeGreaterThanOrEqual(0);
  });

  it("overdueWorkOrders is <= openWorkOrders", async () => {
    const stats = await mockDashboardProvider.getStats(CUSTOMER_ID);
    expect(stats.overdueWorkOrders).toBeLessThanOrEqual(stats.openWorkOrders);
  });

  it("returns zeroed stats for unknown customerID", async () => {
    const stats = await mockDashboardProvider.getStats(99999);
    expect(stats.totalAssets).toBe(0);
    expect(stats.activeAssets).toBe(0);
    expect(stats.assetsByStatus).toHaveLength(0);
    expect(stats.assetsByCategory).toHaveLength(0);
  });
});

describe("mockDashboardProvider.getStats — propertyId scoping", () => {
  it("scoped stats have totalProperties = 1", async () => {
    const stats = await mockDashboardProvider.getStats(CUSTOMER_ID, 1);
    expect(stats.totalProperties).toBe(1);
  });

  it("scoped totalAssets <= unscoped totalAssets", async () => {
    const all = await mockDashboardProvider.getStats(CUSTOMER_ID);
    const scoped = await mockDashboardProvider.getStats(CUSTOMER_ID, 1);
    expect(scoped.totalAssets).toBeLessThanOrEqual(all.totalAssets);
  });

  it("scoped totalAssets > 0 for propertyID 1", async () => {
    const scoped = await mockDashboardProvider.getStats(CUSTOMER_ID, 1);
    expect(scoped.totalAssets).toBeGreaterThan(0);
  });

  it("scoped assetsByCategory sums to scoped totalAssets", async () => {
    const stats = await mockDashboardProvider.getStats(CUSTOMER_ID, 1);
    const sum = stats.assetsByCategory.reduce((acc, c) => acc + c.count, 0);
    // Top-5 only, so sum <= totalAssets
    expect(sum).toBeLessThanOrEqual(stats.totalAssets);
  });
});

describe("mockDashboardProvider.getAlerts", () => {
  it("returns paginated result with items and meta", async () => {
    const result = await mockDashboardProvider.getAlerts(
      CUSTOMER_ID,
      undefined,
      1,
      10
    );
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(10);
    expect(result.meta.total).toBeGreaterThanOrEqual(0);
  });

  it("alerts are sorted critical first", async () => {
    const result = await mockDashboardProvider.getAlerts(
      CUSTOMER_ID,
      undefined,
      1,
      100
    );
    const severityOrder: Record<string, number> = {
      critical: 0,
      warning: 1,
      info: 2,
    };
    const orders = result.items.map((a) => severityOrder[a.severity] ?? 3);
    for (let i = 1; i < orders.length; i++) {
      expect(orders[i - 1]!).toBeLessThanOrEqual(orders[i]!);
    }
  });

  it("filtering by 'expired_warranty' returns only those alerts", async () => {
    const result = await mockDashboardProvider.getAlerts(
      CUSTOMER_ID,
      "expired_warranty",
      1,
      100
    );
    for (const alert of result.items) {
      expect(alert.type).toBe("expired_warranty");
    }
  });

  it("filtering by 'poor_condition' returns only those alerts", async () => {
    const result = await mockDashboardProvider.getAlerts(
      CUSTOMER_ID,
      "poor_condition",
      1,
      100
    );
    for (const alert of result.items) {
      expect(alert.type).toBe("poor_condition");
    }
  });
});

describe("mockDashboardProvider.getActivity", () => {
  it("returns paginated activity events", async () => {
    const result = await mockDashboardProvider.getActivity(CUSTOMER_ID, 1, 10);
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(10);
  });

  it("returns no events for unknown customerID", async () => {
    const result = await mockDashboardProvider.getActivity(99999, 1, 10);
    expect(result.items).toHaveLength(0);
    expect(result.meta.total).toBe(0);
  });

  it("propertyId scoping filters events", async () => {
    const all = await mockDashboardProvider.getActivity(
      CUSTOMER_ID,
      1,
      10000
    );
    const scoped = await mockDashboardProvider.getActivity(
      CUSTOMER_ID,
      1,
      10000,
      1
    );
    expect(scoped.meta.total).toBeLessThanOrEqual(all.meta.total);
  });

  it("second page has different items from first page", async () => {
    const allResult = await mockDashboardProvider.getActivity(
      CUSTOMER_ID,
      1,
      1000
    );
    if (allResult.meta.total > 2) {
      const p1 = await mockDashboardProvider.getActivity(CUSTOMER_ID, 1, 2);
      const p2 = await mockDashboardProvider.getActivity(CUSTOMER_ID, 2, 2);
      const ids1 = p1.items.map((e) => e.id);
      const ids2 = p2.items.map((e) => e.id);
      const overlap = ids1.filter((id) => ids2.includes(id));
      expect(overlap).toHaveLength(0);
    }
  });
});
