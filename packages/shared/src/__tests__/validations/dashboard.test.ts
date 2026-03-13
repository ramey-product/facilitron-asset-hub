/**
 * Unit tests for dashboard validation schemas.
 */
import { describe, it, expect } from "vitest";
import {
  dashboardStatsQuerySchema,
  dashboardAlertsQuerySchema,
  dashboardActivityQuerySchema,
  dashboardAlertTypeSchema,
} from "../../validations/dashboard.js";

describe("dashboardAlertTypeSchema", () => {
  it("accepts all valid alert types", () => {
    const validTypes = [
      "overdue_maintenance",
      "poor_condition",
      "expired_warranty",
      "expiring_warranty",
    ];
    for (const type of validTypes) {
      const result = dashboardAlertTypeSchema.safeParse(type);
      expect(result.success).toBe(true);
    }
  });

  it("rejects unknown alert type", () => {
    const result = dashboardAlertTypeSchema.safeParse("broken_asset");
    expect(result.success).toBe(false);
  });
});

describe("dashboardStatsQuerySchema", () => {
  it("parses empty object without error", () => {
    const result = dashboardStatsQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("propertyId is optional — undefined when not provided", () => {
    const result = dashboardStatsQuerySchema.parse({});
    expect(result.propertyId).toBeUndefined();
  });

  it("coerces string propertyId to number", () => {
    const result = dashboardStatsQuerySchema.parse({ propertyId: "3" });
    expect(result.propertyId).toBe(3);
  });

  it("rejects negative propertyId", () => {
    expect(() =>
      dashboardStatsQuerySchema.parse({ propertyId: "-1" })
    ).toThrow();
  });

  it("rejects propertyId of 0", () => {
    expect(() =>
      dashboardStatsQuerySchema.parse({ propertyId: "0" })
    ).toThrow();
  });

  it("accepts numeric propertyId directly", () => {
    const result = dashboardStatsQuerySchema.parse({ propertyId: 5 });
    expect(result.propertyId).toBe(5);
  });
});

describe("dashboardAlertsQuerySchema", () => {
  it("provides defaults: page=1, limit=20", () => {
    const result = dashboardAlertsQuerySchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it("coerces string page and limit to numbers", () => {
    const result = dashboardAlertsQuerySchema.parse({
      page: "2",
      limit: "10",
    });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
  });

  it("rejects page = 0", () => {
    expect(() =>
      dashboardAlertsQuerySchema.parse({ page: "0" })
    ).toThrow();
  });

  it("rejects limit > 100", () => {
    expect(() =>
      dashboardAlertsQuerySchema.parse({ limit: "101" })
    ).toThrow();
  });

  it("accepts limit = 100 (boundary)", () => {
    const result = dashboardAlertsQuerySchema.parse({ limit: "100" });
    expect(result.limit).toBe(100);
  });

  it("accepts optional type filter", () => {
    const result = dashboardAlertsQuerySchema.parse({
      type: "poor_condition",
    });
    expect(result.type).toBe("poor_condition");
  });

  it("rejects invalid type value", () => {
    expect(() =>
      dashboardAlertsQuerySchema.parse({ type: "invalid_type" })
    ).toThrow();
  });

  it("type is optional — undefined when not provided", () => {
    const result = dashboardAlertsQuerySchema.parse({});
    expect(result.type).toBeUndefined();
  });

  it("accepts optional propertyId and coerces to number", () => {
    const result = dashboardAlertsQuerySchema.parse({ propertyId: "2" });
    expect(result.propertyId).toBe(2);
  });
});

describe("dashboardActivityQuerySchema", () => {
  it("provides defaults: page=1, limit=10", () => {
    const result = dashboardActivityQuerySchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });

  it("rejects limit > 50", () => {
    expect(() =>
      dashboardActivityQuerySchema.parse({ limit: "51" })
    ).toThrow();
  });

  it("accepts limit = 50 (boundary)", () => {
    const result = dashboardActivityQuerySchema.parse({ limit: "50" });
    expect(result.limit).toBe(50);
  });

  it("coerces string propertyId to number", () => {
    const result = dashboardActivityQuerySchema.parse({ propertyId: "4" });
    expect(result.propertyId).toBe(4);
  });

  it("rejects negative page", () => {
    expect(() =>
      dashboardActivityQuerySchema.parse({ page: "-1" })
    ).toThrow();
  });
});
