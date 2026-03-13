/**
 * Unit tests for import validation schemas.
 */
import { describe, it, expect } from "vitest";
import {
  importValidateSchema,
  importExecuteSchema,
  importColumnMappingSchema,
  importHistoryQuerySchema,
} from "../../validations/import.js";

const validMapping = [
  { sourceColumn: "Name", targetField: "equipmentName", confidence: 0.95 },
  { sourceColumn: "Category", targetField: "categoryName", confidence: 0.9 },
];

const validRow = { Name: "Boiler Unit", Category: "HVAC" };

describe("importColumnMappingSchema", () => {
  it("accepts a valid mapping entry", () => {
    const result = importColumnMappingSchema.safeParse({
      sourceColumn: "Name",
      targetField: "equipmentName",
      confidence: 0.9,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty sourceColumn", () => {
    const result = importColumnMappingSchema.safeParse({
      sourceColumn: "",
      targetField: "equipmentName",
      confidence: 0.9,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty targetField", () => {
    const result = importColumnMappingSchema.safeParse({
      sourceColumn: "Name",
      targetField: "",
      confidence: 0.9,
    });
    expect(result.success).toBe(false);
  });

  it("rejects confidence < 0", () => {
    const result = importColumnMappingSchema.safeParse({
      sourceColumn: "Name",
      targetField: "equipmentName",
      confidence: -0.1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects confidence > 1", () => {
    const result = importColumnMappingSchema.safeParse({
      sourceColumn: "Name",
      targetField: "equipmentName",
      confidence: 1.1,
    });
    expect(result.success).toBe(false);
  });

  it("accepts confidence = 0 (boundary)", () => {
    const result = importColumnMappingSchema.safeParse({
      sourceColumn: "Name",
      targetField: "equipmentName",
      confidence: 0,
    });
    expect(result.success).toBe(true);
  });

  it("accepts confidence = 1 (boundary)", () => {
    const result = importColumnMappingSchema.safeParse({
      sourceColumn: "Name",
      targetField: "equipmentName",
      confidence: 1,
    });
    expect(result.success).toBe(true);
  });
});

describe("importValidateSchema", () => {
  it("accepts valid rows and mapping", () => {
    const result = importValidateSchema.safeParse({
      rows: [validRow],
      mapping: validMapping,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty rows array", () => {
    const result = importValidateSchema.safeParse({
      rows: [],
      mapping: validMapping,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const rowsError = result.error.issues.find(
        (i) => i.path.includes("rows")
      );
      expect(rowsError).toBeDefined();
    }
  });

  it("rejects rows exceeding 10,000 limit", () => {
    const bigRows = Array.from({ length: 10001 }, () => ({ Name: "Unit" }));
    const result = importValidateSchema.safeParse({
      rows: bigRows,
      mapping: validMapping,
    });
    expect(result.success).toBe(false);
  });

  it("accepts exactly 10,000 rows (boundary)", () => {
    const rows = Array.from({ length: 10000 }, (_, i) => ({
      Name: `Unit ${i}`,
    }));
    const result = importValidateSchema.safeParse({
      rows,
      mapping: validMapping,
    });
    expect(result.success).toBe(true);
  });

  it("accepts exactly 1 row (boundary)", () => {
    const result = importValidateSchema.safeParse({
      rows: [validRow],
      mapping: validMapping,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty mapping array", () => {
    const result = importValidateSchema.safeParse({
      rows: [validRow],
      mapping: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing rows", () => {
    const result = importValidateSchema.safeParse({
      mapping: validMapping,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing mapping", () => {
    const result = importValidateSchema.safeParse({
      rows: [validRow],
    });
    expect(result.success).toBe(false);
  });

  it("accepts rows with multiple string keys", () => {
    const result = importValidateSchema.safeParse({
      rows: [{ Name: "Unit", Serial: "SN-001", Property: "School A" }],
      mapping: validMapping,
    });
    expect(result.success).toBe(true);
  });
});

describe("importExecuteSchema", () => {
  it("accepts valid input with rows, mapping, and filename", () => {
    const result = importExecuteSchema.safeParse({
      rows: [validRow],
      mapping: validMapping,
      filename: "assets.csv",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing filename", () => {
    const result = importExecuteSchema.safeParse({
      rows: [validRow],
      mapping: validMapping,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty filename", () => {
    const result = importExecuteSchema.safeParse({
      rows: [validRow],
      mapping: validMapping,
      filename: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects filename longer than 255 characters", () => {
    const result = importExecuteSchema.safeParse({
      rows: [validRow],
      mapping: validMapping,
      filename: "A".repeat(256) + ".csv",
    });
    expect(result.success).toBe(false);
  });

  it("accepts filename of exactly 255 characters (boundary)", () => {
    const result = importExecuteSchema.safeParse({
      rows: [validRow],
      mapping: validMapping,
      filename: "A".repeat(251) + ".csv", // 255 chars total
    });
    expect(result.success).toBe(true);
  });

  it("also enforces the 10,000 row max", () => {
    const bigRows = Array.from({ length: 10001 }, () => ({ Name: "Unit" }));
    const result = importExecuteSchema.safeParse({
      rows: bigRows,
      mapping: validMapping,
      filename: "big.csv",
    });
    expect(result.success).toBe(false);
  });

  it("also rejects empty rows array", () => {
    const result = importExecuteSchema.safeParse({
      rows: [],
      mapping: validMapping,
      filename: "test.csv",
    });
    expect(result.success).toBe(false);
  });
});

describe("importHistoryQuerySchema", () => {
  it("provides defaults: page=1, limit=20", () => {
    const result = importHistoryQuerySchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it("coerces string values", () => {
    const result = importHistoryQuerySchema.parse({ page: "3", limit: "50" });
    expect(result.page).toBe(3);
    expect(result.limit).toBe(50);
  });

  it("rejects page = 0", () => {
    expect(() => importHistoryQuerySchema.parse({ page: "0" })).toThrow();
  });

  it("rejects limit > 100", () => {
    expect(() =>
      importHistoryQuerySchema.parse({ limit: "101" })
    ).toThrow();
  });

  it("accepts limit = 100 (boundary)", () => {
    const result = importHistoryQuerySchema.parse({ limit: "100" });
    expect(result.limit).toBe(100);
  });
});
