/**
 * Unit tests for asset validation schemas.
 */
import { describe, it, expect } from "vitest";
import {
  assetQuerySchema,
  createAssetSchema,
  updateAssetSchema,
  createConditionLogSchema,
  conditionHistoryQuerySchema,
} from "../../validations/asset.js";

describe("assetQuerySchema", () => {
  it("parses an empty object with defaults", () => {
    const result = assetQuerySchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
    expect(result.sortOrder).toBe("asc");
  });

  it("coerces string page and limit to numbers", () => {
    const result = assetQuerySchema.parse({ page: "3", limit: "50" });
    expect(result.page).toBe(3);
    expect(result.limit).toBe(50);
  });

  it("rejects page = 0 (must be positive)", () => {
    expect(() => assetQuerySchema.parse({ page: "0" })).toThrow();
  });

  it("rejects page = -1", () => {
    expect(() => assetQuerySchema.parse({ page: "-1" })).toThrow();
  });

  it("rejects limit > 100 (max cap)", () => {
    expect(() => assetQuerySchema.parse({ limit: "101" })).toThrow();
  });

  it("accepts limit = 100 (boundary)", () => {
    const result = assetQuerySchema.parse({ limit: "100" });
    expect(result.limit).toBe(100);
  });

  it("accepts optional search string", () => {
    const result = assetQuerySchema.parse({ search: "HVAC unit" });
    expect(result.search).toBe("HVAC unit");
  });

  it("accepts optional status string", () => {
    const result = assetQuerySchema.parse({ status: "Active" });
    expect(result.status).toBe("Active");
  });

  it("accepts valid condition enum values", () => {
    const validConditions = ["excellent", "good", "fair", "poor", "critical"];
    for (const condition of validConditions) {
      const result = assetQuerySchema.parse({ condition });
      expect(result.condition).toBe(condition);
    }
  });

  it("rejects invalid condition value", () => {
    expect(() => assetQuerySchema.parse({ condition: "broken" })).toThrow();
  });

  it("accepts optional propertyID and coerces to number", () => {
    const result = assetQuerySchema.parse({ propertyID: "5" });
    expect(result.propertyID).toBe(5);
  });

  it("accepts optional categoryID and coerces to number", () => {
    const result = assetQuerySchema.parse({ categoryID: "2" });
    expect(result.categoryID).toBe(2);
  });

  it("accepts sortOrder asc and desc", () => {
    expect(assetQuerySchema.parse({ sortOrder: "asc" }).sortOrder).toBe("asc");
    expect(assetQuerySchema.parse({ sortOrder: "desc" }).sortOrder).toBe("desc");
  });

  it("rejects invalid sortOrder", () => {
    expect(() => assetQuerySchema.parse({ sortOrder: "random" })).toThrow();
  });

  it("accepts valid sortBy enum value", () => {
    const result = assetQuerySchema.parse({ sortBy: "equipmentName" });
    expect(result.sortBy).toBe("equipmentName");
  });

  it("rejects invalid sortBy value", () => {
    expect(() => assetQuerySchema.parse({ sortBy: "notAField" })).toThrow();
  });
});

describe("createAssetSchema", () => {
  it("accepts valid input with only assetName", () => {
    const result = createAssetSchema.safeParse({ assetName: "Test Unit" });
    expect(result.success).toBe(true);
  });

  it("rejects empty assetName", () => {
    const result = createAssetSchema.safeParse({ assetName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing assetName (required)", () => {
    const result = createAssetSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects assetName longer than 255 characters", () => {
    const result = createAssetSchema.safeParse({ assetName: "A".repeat(256) });
    expect(result.success).toBe(false);
  });

  it("accepts assetName of exactly 255 characters (boundary)", () => {
    const result = createAssetSchema.safeParse({ assetName: "A".repeat(255) });
    expect(result.success).toBe(true);
  });

  it("defaults assetStatus to 'active'", () => {
    const result = createAssetSchema.parse({ assetName: "Unit" });
    expect(result.assetStatus).toBe("active");
  });

  it("accepts all valid assetStatus values", () => {
    const validStatuses = ["active", "inactive", "disposed", "maintenance"];
    for (const assetStatus of validStatuses) {
      const r = createAssetSchema.safeParse({ assetName: "Unit", assetStatus });
      expect(r.success).toBe(true);
    }
  });

  it("rejects invalid assetStatus", () => {
    const result = createAssetSchema.safeParse({
      assetName: "Unit",
      assetStatus: "lost",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional numeric categoryID", () => {
    const result = createAssetSchema.safeParse({
      assetName: "Unit",
      categoryID: 1,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative categoryID", () => {
    const result = createAssetSchema.safeParse({
      assetName: "Unit",
      categoryID: -1,
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional purchaseCost as non-negative number", () => {
    const result = createAssetSchema.safeParse({
      assetName: "Unit",
      purchaseCost: 15000,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative purchaseCost", () => {
    const result = createAssetSchema.safeParse({
      assetName: "Unit",
      purchaseCost: -100,
    });
    expect(result.success).toBe(false);
  });

  it("accepts zero purchaseCost (boundary)", () => {
    const result = createAssetSchema.safeParse({
      assetName: "Unit",
      purchaseCost: 0,
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional notes up to 4000 chars", () => {
    const result = createAssetSchema.safeParse({
      assetName: "Unit",
      notes: "A".repeat(4000),
    });
    expect(result.success).toBe(true);
  });

  it("rejects notes longer than 4000 chars", () => {
    const result = createAssetSchema.safeParse({
      assetName: "Unit",
      notes: "A".repeat(4001),
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional purchaseDate as ISO datetime string", () => {
    const result = createAssetSchema.safeParse({
      assetName: "Unit",
      purchaseDate: "2024-01-15T00:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid purchaseDate format", () => {
    const result = createAssetSchema.safeParse({
      assetName: "Unit",
      purchaseDate: "not-a-date",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateAssetSchema", () => {
  it("allows empty object (all fields optional)", () => {
    const result = updateAssetSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("allows partial update with only assetName", () => {
    const result = updateAssetSchema.safeParse({ assetName: "New Name" });
    expect(result.success).toBe(true);
  });

  it("validates assetName max length even in partial update", () => {
    const result = updateAssetSchema.safeParse({ assetName: "A".repeat(256) });
    expect(result.success).toBe(false);
  });
});

describe("createConditionLogSchema", () => {
  it("accepts a valid conditionScore between 1 and 5", () => {
    for (const score of [1, 2, 3, 4, 5]) {
      const result = createConditionLogSchema.safeParse({ conditionScore: score });
      expect(result.success).toBe(true);
    }
  });

  it("rejects conditionScore of 0", () => {
    const result = createConditionLogSchema.safeParse({ conditionScore: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects conditionScore of 6", () => {
    const result = createConditionLogSchema.safeParse({ conditionScore: 6 });
    expect(result.success).toBe(false);
  });

  it("defaults source to 'manual'", () => {
    const result = createConditionLogSchema.parse({ conditionScore: 3 });
    expect(result.source).toBe("manual");
  });

  it("accepts valid source values", () => {
    const validSources = ["manual", "inspection", "work_order"];
    for (const source of validSources) {
      const r = createConditionLogSchema.safeParse({ conditionScore: 3, source });
      expect(r.success).toBe(true);
    }
  });

  it("rejects invalid source value", () => {
    const result = createConditionLogSchema.safeParse({
      conditionScore: 3,
      source: "robot",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional notes up to 2000 chars", () => {
    const result = createConditionLogSchema.safeParse({
      conditionScore: 4,
      notes: "A".repeat(2000),
    });
    expect(result.success).toBe(true);
  });

  it("rejects notes longer than 2000 chars", () => {
    const result = createConditionLogSchema.safeParse({
      conditionScore: 4,
      notes: "A".repeat(2001),
    });
    expect(result.success).toBe(false);
  });
});

describe("conditionHistoryQuerySchema", () => {
  it("provides defaults: limit=20, offset=0", () => {
    const result = conditionHistoryQuerySchema.parse({});
    expect(result.limit).toBe(20);
    expect(result.offset).toBe(0);
  });

  it("coerces string values", () => {
    const result = conditionHistoryQuerySchema.parse({
      limit: "50",
      offset: "10",
    });
    expect(result.limit).toBe(50);
    expect(result.offset).toBe(10);
  });

  it("rejects limit > 100", () => {
    expect(() =>
      conditionHistoryQuerySchema.parse({ limit: "200" })
    ).toThrow();
  });

  it("rejects negative offset", () => {
    expect(() =>
      conditionHistoryQuerySchema.parse({ offset: "-1" })
    ).toThrow();
  });
});
