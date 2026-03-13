/**
 * Unit tests for fitService.
 */
import { describe, it, expect } from "vitest";
import { fitService } from "../../services/fit-service.js";

const CUSTOMER_ID = 1;

// Asset ID 1 is a known active asset with seed inspections
const KNOWN_ASSET_ID = 1;

describe("fitService.getSummary", () => {
  it("returns a FitSummary for a known active asset", async () => {
    const summary = await fitService.getSummary(CUSTOMER_ID, KNOWN_ASSET_ID);
    expect(summary).not.toBeNull();
  });

  it("summary has expected shape", async () => {
    const summary = await fitService.getSummary(CUSTOMER_ID, KNOWN_ASSET_ID);
    expect(summary).toMatchObject({
      assetId: expect.any(Number),
      lastInspectionDate: expect.any(String),
      lastInspectionResult: expect.stringMatching(/^(pass|fail|partial)$/),
      inspectionCount: expect.any(Number),
      nextScheduledDate: expect.any(String),
      conditionAtLastInspection: expect.any(Number),
      inspector: expect.any(String),
      openDeficiencies: expect.any(Number),
    });
  });

  it("assetId on summary matches requested assetId", async () => {
    const summary = await fitService.getSummary(CUSTOMER_ID, KNOWN_ASSET_ID);
    expect(summary!.assetId).toBe(KNOWN_ASSET_ID);
  });

  it("inspectionCount is greater than 0 for known asset", async () => {
    const summary = await fitService.getSummary(CUSTOMER_ID, KNOWN_ASSET_ID);
    expect(summary!.inspectionCount).toBeGreaterThan(0);
  });

  it("returns null for unknown asset ID", async () => {
    const summary = await fitService.getSummary(CUSTOMER_ID, 99999);
    expect(summary).toBeNull();
  });

  it("nextScheduledDate is after lastInspectionDate", async () => {
    const summary = await fitService.getSummary(CUSTOMER_ID, KNOWN_ASSET_ID);
    const last = new Date(summary!.lastInspectionDate).getTime();
    const next = new Date(summary!.nextScheduledDate).getTime();
    expect(next).toBeGreaterThan(last);
  });

  it("conditionAtLastInspection is between 1 and 5", async () => {
    const summary = await fitService.getSummary(CUSTOMER_ID, KNOWN_ASSET_ID);
    expect(summary!.conditionAtLastInspection).toBeGreaterThanOrEqual(1);
    expect(summary!.conditionAtLastInspection).toBeLessThanOrEqual(5);
  });

  it("openDeficiencies is non-negative", async () => {
    const summary = await fitService.getSummary(CUSTOMER_ID, KNOWN_ASSET_ID);
    expect(summary!.openDeficiencies).toBeGreaterThanOrEqual(0);
  });
});

describe("fitService.getInspections", () => {
  it("returns paginated inspection records for known asset", async () => {
    const result = await fitService.getInspections(
      CUSTOMER_ID,
      KNOWN_ASSET_ID,
      1,
      10
    );
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.meta).toBeDefined();
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(10);
  });

  it("returns at least one inspection record for known asset", async () => {
    const result = await fitService.getInspections(
      CUSTOMER_ID,
      KNOWN_ASSET_ID,
      1,
      10
    );
    expect(result.meta.total).toBeGreaterThan(0);
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("each inspection record has expected shape", async () => {
    const result = await fitService.getInspections(
      CUSTOMER_ID,
      KNOWN_ASSET_ID,
      1,
      10
    );
    for (const record of result.items) {
      expect(record).toHaveProperty("id");
      expect(record).toHaveProperty("assetId");
      expect(record).toHaveProperty("inspectionDate");
      expect(record).toHaveProperty("result");
      expect(record).toHaveProperty("inspector");
      expect(record).toHaveProperty("conditionRating");
      expect(record).toHaveProperty("deficiencyCount");
      expect(record.assetId).toBe(KNOWN_ASSET_ID);
    }
  });

  it("result values are valid enum members", async () => {
    const result = await fitService.getInspections(
      CUSTOMER_ID,
      KNOWN_ASSET_ID,
      1,
      100
    );
    const validResults = ["pass", "fail", "partial"];
    for (const record of result.items) {
      expect(validResults).toContain(record.result);
    }
  });

  it("records are sorted most-recent first", async () => {
    const result = await fitService.getInspections(
      CUSTOMER_ID,
      KNOWN_ASSET_ID,
      1,
      100
    );
    const dates = result.items.map((r) =>
      new Date(r.inspectionDate).getTime()
    );
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1]!).toBeGreaterThanOrEqual(dates[i]!);
    }
  });

  it("pagination works: page 2 differs from page 1", async () => {
    const total = (
      await fitService.getInspections(CUSTOMER_ID, KNOWN_ASSET_ID, 1, 100)
    ).meta.total;
    if (total > 2) {
      const page1 = await fitService.getInspections(
        CUSTOMER_ID,
        KNOWN_ASSET_ID,
        1,
        2
      );
      const page2 = await fitService.getInspections(
        CUSTOMER_ID,
        KNOWN_ASSET_ID,
        2,
        2
      );
      const ids1 = page1.items.map((r) => r.id);
      const ids2 = page2.items.map((r) => r.id);
      const overlap = ids1.filter((id) => ids2.includes(id));
      expect(overlap).toHaveLength(0);
    }
  });

  it("returns empty paginated result for unknown asset", async () => {
    const result = await fitService.getInspections(CUSTOMER_ID, 99999, 1, 10);
    expect(result.items).toHaveLength(0);
    expect(result.meta.total).toBe(0);
  });
});
