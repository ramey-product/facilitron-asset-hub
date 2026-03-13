/**
 * Unit tests for dashboardService.
 */
import { describe, it, expect } from "vitest";
import { dashboardService } from "../../services/dashboard-service.js";

const CUSTOMER_ID = 1;

describe("dashboardService.getStats", () => {
  it("returns expected top-level shape", async () => {
    const stats = await dashboardService.getStats(CUSTOMER_ID);
    expect(stats).toMatchObject({
      totalAssets: expect.any(Number),
      activeCount: expect.any(Number),
      flaggedCount: expect.any(Number),
      criticalCount: expect.any(Number),
      poorCount: expect.any(Number),
      onlineCount: expect.any(Number),
      offlineCount: expect.any(Number),
      totalProperties: expect.any(Number),
      openWorkOrders: expect.any(Number),
      overdueWorkOrders: expect.any(Number),
      ytdMaintenanceCost: expect.any(Number),
      totalAssetValue: expect.any(Number),
      assetsNeedingAttention: expect.any(Number),
    });
  });

  it("returns non-zero asset counts for customerID 1", async () => {
    const stats = await dashboardService.getStats(CUSTOMER_ID);
    expect(stats.totalAssets).toBeGreaterThan(0);
    expect(stats.activeCount).toBeGreaterThan(0);
  });

  it("returns assetsByStatus as array of {status, count}", async () => {
    const stats = await dashboardService.getStats(CUSTOMER_ID);
    expect(Array.isArray(stats.assetsByStatus)).toBe(true);
    for (const entry of stats.assetsByStatus) {
      expect(entry).toHaveProperty("status");
      expect(entry).toHaveProperty("count");
      expect(typeof entry.count).toBe("number");
      expect(entry.count).toBeGreaterThanOrEqual(0);
    }
  });

  it("returns assetsByCategory with up to 5 entries", async () => {
    const stats = await dashboardService.getStats(CUSTOMER_ID);
    expect(Array.isArray(stats.assetsByCategory)).toBe(true);
    expect(stats.assetsByCategory.length).toBeLessThanOrEqual(5);
    for (const entry of stats.assetsByCategory) {
      expect(entry).toHaveProperty("category");
      expect(entry).toHaveProperty("count");
      expect(entry).toHaveProperty("slug");
    }
  });

  it("returns conditionDistribution as array", async () => {
    const stats = await dashboardService.getStats(CUSTOMER_ID);
    expect(Array.isArray(stats.conditionDistribution)).toBe(true);
    for (const entry of stats.conditionDistribution) {
      expect(entry).toHaveProperty("name");
      expect(entry).toHaveProperty("value");
      expect(entry).toHaveProperty("fill");
    }
  });

  it("returns categoryBreakdown as array", async () => {
    const stats = await dashboardService.getStats(CUSTOMER_ID);
    expect(Array.isArray(stats.categoryBreakdown)).toBe(true);
    for (const entry of stats.categoryBreakdown) {
      expect(entry).toHaveProperty("name");
      expect(entry).toHaveProperty("count");
      expect(entry).toHaveProperty("slug");
    }
  });

  it("returns zero counts for unknown customerID", async () => {
    const stats = await dashboardService.getStats(99999);
    expect(stats.totalAssets).toBe(0);
    expect(stats.activeCount).toBe(0);
  });

  it("propertyId filter reduces totalAssets vs unscoped", async () => {
    const all = await dashboardService.getStats(CUSTOMER_ID);
    const scoped = await dashboardService.getStats(CUSTOMER_ID, 1);
    // Property-scoped count should be <= total
    expect(scoped.totalAssets).toBeLessThanOrEqual(all.totalAssets);
  });

  it("propertyId filter sets totalProperties to 1", async () => {
    const scoped = await dashboardService.getStats(CUSTOMER_ID, 1);
    expect(scoped.totalProperties).toBe(1);
  });

  it("unscoped totalProperties is greater than 1", async () => {
    const stats = await dashboardService.getStats(CUSTOMER_ID);
    expect(stats.totalProperties).toBeGreaterThan(1);
  });

  it("assetsNeedingAttention is non-negative", async () => {
    const stats = await dashboardService.getStats(CUSTOMER_ID);
    expect(stats.assetsNeedingAttention).toBeGreaterThanOrEqual(0);
  });

  it("totalAssetValue is non-negative", async () => {
    const stats = await dashboardService.getStats(CUSTOMER_ID);
    expect(stats.totalAssetValue).toBeGreaterThanOrEqual(0);
  });
});

describe("dashboardService.getAlerts", () => {
  it("returns array of alert items", async () => {
    const result = await dashboardService.getAlerts(
      CUSTOMER_ID,
      undefined,
      1,
      20
    );
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.meta).toBeDefined();
  });

  it("each alert has expected shape", async () => {
    const result = await dashboardService.getAlerts(
      CUSTOMER_ID,
      undefined,
      1,
      20
    );
    for (const alert of result.items) {
      expect(alert).toHaveProperty("id");
      expect(alert).toHaveProperty("type");
      expect(alert).toHaveProperty("severity");
      expect(alert).toHaveProperty("assetId");
      expect(alert).toHaveProperty("assetName");
      expect(alert).toHaveProperty("message");
      expect(alert).toHaveProperty("createdAt");
    }
  });

  it("severity values are valid enum members", async () => {
    const result = await dashboardService.getAlerts(
      CUSTOMER_ID,
      undefined,
      1,
      100
    );
    const validSeverities = ["critical", "warning", "info"];
    for (const alert of result.items) {
      expect(validSeverities).toContain(alert.severity);
    }
  });

  it("type filter returns only matching alerts", async () => {
    const result = await dashboardService.getAlerts(
      CUSTOMER_ID,
      "poor_condition",
      1,
      100
    );
    for (const alert of result.items) {
      expect(alert.type).toBe("poor_condition");
    }
  });

  it("pagination works correctly", async () => {
    const page1 = await dashboardService.getAlerts(
      CUSTOMER_ID,
      undefined,
      1,
      5
    );
    const page2 = await dashboardService.getAlerts(
      CUSTOMER_ID,
      undefined,
      2,
      5
    );
    expect(page1.meta.page).toBe(1);
    expect(page2.meta.page).toBe(2);
    if (page1.items.length === 5 && page2.items.length > 0) {
      const ids1 = page1.items.map((a) => a.id);
      const ids2 = page2.items.map((a) => a.id);
      const overlap = ids1.filter((id) => ids2.includes(id));
      expect(overlap).toHaveLength(0);
    }
  });

  it("propertyId scoping filters alerts", async () => {
    const all = await dashboardService.getAlerts(
      CUSTOMER_ID,
      undefined,
      1,
      1000
    );
    const scoped = await dashboardService.getAlerts(
      CUSTOMER_ID,
      undefined,
      1,
      1000,
      1
    );
    expect(scoped.meta.total).toBeLessThanOrEqual(all.meta.total);
  });

  it("returns empty for unknown customerID", async () => {
    const result = await dashboardService.getAlerts(99999, undefined, 1, 20);
    expect(result.items).toHaveLength(0);
    expect(result.meta.total).toBe(0);
  });
});

describe("dashboardService.getActivity", () => {
  it("returns paginated activity items", async () => {
    const result = await dashboardService.getActivity(CUSTOMER_ID, 1, 10);
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.meta).toBeDefined();
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(10);
  });

  it("activity items have expected shape", async () => {
    const result = await dashboardService.getActivity(CUSTOMER_ID, 1, 10);
    for (const event of result.items) {
      expect(event).toHaveProperty("id");
      expect(event).toHaveProperty("timestamp");
      expect(event).toHaveProperty("type");
    }
  });

  it("returns empty for unknown customerID", async () => {
    const result = await dashboardService.getActivity(99999, 1, 10);
    expect(result.items).toHaveLength(0);
    expect(result.meta.total).toBe(0);
  });

  it("propertyId filter narrows activity", async () => {
    const all = await dashboardService.getActivity(CUSTOMER_ID, 1, 1000);
    const scoped = await dashboardService.getActivity(CUSTOMER_ID, 1, 1000, 1);
    expect(scoped.meta.total).toBeLessThanOrEqual(all.meta.total);
  });

  it("items are sorted most-recent first", async () => {
    const result = await dashboardService.getActivity(CUSTOMER_ID, 1, 50);
    const timestamps = result.items.map((e) => new Date(e.timestamp).getTime());
    for (let i = 1; i < timestamps.length; i++) {
      expect(timestamps[i - 1]!).toBeGreaterThanOrEqual(timestamps[i]!);
    }
  });
});
