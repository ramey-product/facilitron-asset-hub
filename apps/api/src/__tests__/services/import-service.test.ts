/**
 * Unit tests for importService.
 * Tests validateImport and executeImport via the mock provider.
 */
import { describe, it, expect } from "vitest";
import { importService } from "../../services/import-service.js";
import type { ImportColumnMapping } from "@asset-hub/shared";

const CUSTOMER_ID = 1;
const CONTACT_ID = 1;

/** Helper: build a simple column mapping for the given fields. */
function makeMapping(
  fields: string[],
  prefix = ""
): ImportColumnMapping[] {
  return fields.map((f) => ({
    sourceColumn: prefix + f,
    targetField: f,
    confidence: 1,
  }));
}

/** A complete valid row that satisfies all three required fields. */
const VALID_ROW = {
  equipmentName: "Test Boiler",
  categoryName: "HVAC",
  propertyName: "Lincoln High School",
};

const VALID_MAPPING = makeMapping([
  "equipmentName",
  "categoryName",
  "propertyName",
]);

describe("importService.validateImport", () => {
  it("passes for a valid row with all required fields", async () => {
    const result = await importService.validateImport(
      CUSTOMER_ID,
      [VALID_ROW],
      VALID_MAPPING
    );
    expect(result.valid).toBe(true);
    expect(result.totalRows).toBe(1);
    expect(result.validRows).toBe(1);
    expect(result.errorRows).toBe(0);
    expect(result.errors).toHaveLength(0);
  });

  it("fails when equipmentName is missing", async () => {
    const result = await importService.validateImport(
      CUSTOMER_ID,
      [{ categoryName: "HVAC", propertyName: "Lincoln High School" }],
      makeMapping(["categoryName", "propertyName"])
    );
    expect(result.valid).toBe(false);
    const nameError = result.errors.find((e) => e.field === "equipmentName");
    expect(nameError).toBeDefined();
    expect(nameError!.message).toMatch(/required/i);
  });

  it("fails when categoryName is missing", async () => {
    const result = await importService.validateImport(
      CUSTOMER_ID,
      [{ equipmentName: "Pump", propertyName: "Lincoln High School" }],
      makeMapping(["equipmentName", "propertyName"])
    );
    expect(result.valid).toBe(false);
    const catError = result.errors.find((e) => e.field === "categoryName");
    expect(catError).toBeDefined();
  });

  it("fails when propertyName is missing", async () => {
    const result = await importService.validateImport(
      CUSTOMER_ID,
      [{ equipmentName: "Pump", categoryName: "HVAC" }],
      makeMapping(["equipmentName", "categoryName"])
    );
    expect(result.valid).toBe(false);
    const propError = result.errors.find((e) => e.field === "propertyName");
    expect(propError).toBeDefined();
  });

  it("fails for an invalid category name", async () => {
    const result = await importService.validateImport(
      CUSTOMER_ID,
      [
        {
          ...VALID_ROW,
          categoryName: "FakeCategory",
        },
      ],
      VALID_MAPPING
    );
    expect(result.valid).toBe(false);
    const catError = result.errors.find((e) => e.field === "categoryName");
    expect(catError).toBeDefined();
    expect(catError!.message).toContain("FakeCategory");
    expect(catError!.suggestion).toContain("HVAC"); // lists available categories
  });

  it("fails for an invalid property name", async () => {
    const result = await importService.validateImport(
      CUSTOMER_ID,
      [
        {
          ...VALID_ROW,
          propertyName: "Nonexistent School",
        },
      ],
      VALID_MAPPING
    );
    expect(result.valid).toBe(false);
    const propError = result.errors.find((e) => e.field === "propertyName");
    expect(propError).toBeDefined();
    expect(propError!.message).toContain("Nonexistent School");
  });

  it("fails for a negative acquisitionCost", async () => {
    const result = await importService.validateImport(
      CUSTOMER_ID,
      [
        {
          ...VALID_ROW,
          acquisitionCost: "-500",
        },
      ],
      makeMapping([
        "equipmentName",
        "categoryName",
        "propertyName",
        "acquisitionCost",
      ])
    );
    expect(result.valid).toBe(false);
    const costError = result.errors.find((e) => e.field === "acquisitionCost");
    expect(costError).toBeDefined();
  });

  it("fails for non-numeric acquisitionCost", async () => {
    const result = await importService.validateImport(
      CUSTOMER_ID,
      [
        {
          ...VALID_ROW,
          acquisitionCost: "not-a-number",
        },
      ],
      makeMapping([
        "equipmentName",
        "categoryName",
        "propertyName",
        "acquisitionCost",
      ])
    );
    expect(result.valid).toBe(false);
    const costError = result.errors.find((e) => e.field === "acquisitionCost");
    expect(costError).toBeDefined();
  });

  it("fails for non-positive expectedLifeYears", async () => {
    const result = await importService.validateImport(
      CUSTOMER_ID,
      [
        {
          ...VALID_ROW,
          expectedLifeYears: "0",
        },
      ],
      makeMapping([
        "equipmentName",
        "categoryName",
        "propertyName",
        "expectedLifeYears",
      ])
    );
    expect(result.valid).toBe(false);
    const lifeError = result.errors.find(
      (e) => e.field === "expectedLifeYears"
    );
    expect(lifeError).toBeDefined();
  });

  it("fails for an invalid acquisitionDate", async () => {
    const result = await importService.validateImport(
      CUSTOMER_ID,
      [
        {
          ...VALID_ROW,
          acquisitionDate: "not-a-date",
        },
      ],
      makeMapping([
        "equipmentName",
        "categoryName",
        "propertyName",
        "acquisitionDate",
      ])
    );
    expect(result.valid).toBe(false);
    const dateError = result.errors.find((e) => e.field === "acquisitionDate");
    expect(dateError).toBeDefined();
  });

  it("returns preview for first 10 rows", async () => {
    const rows = Array.from({ length: 15 }, (_, i) => ({
      ...VALID_ROW,
      equipmentName: `Unit ${i + 1}`,
    }));
    const result = await importService.validateImport(
      CUSTOMER_ID,
      rows,
      VALID_MAPPING
    );
    expect(result.preview.length).toBeLessThanOrEqual(10);
  });

  it("correctly counts errorRows when multiple rows fail", async () => {
    const rows = [
      VALID_ROW,
      { categoryName: "HVAC", propertyName: "Lincoln High School" }, // missing equipmentName
      { equipmentName: "Pump", propertyName: "Lincoln High School" }, // missing categoryName
    ];
    const result = await importService.validateImport(
      CUSTOMER_ID,
      rows,
      VALID_MAPPING
    );
    expect(result.valid).toBe(false);
    expect(result.errorRows).toBe(2);
    expect(result.validRows).toBe(1);
    expect(result.totalRows).toBe(3);
  });
});

describe("importService.executeImport", () => {
  it("returns ImportResult with importId and counts", async () => {
    const result = await importService.executeImport(
      CUSTOMER_ID,
      CONTACT_ID,
      "test-import.csv",
      [VALID_ROW],
      VALID_MAPPING
    );
    expect(result.importId).toBeTruthy();
    expect(result.importId).toMatch(/^IMP-/);
    expect(result.totalRows).toBe(1);
    expect(typeof result.created).toBe("number");
    expect(typeof result.updated).toBe("number");
    expect(typeof result.failed).toBe("number");
    expect(typeof result.duration).toBe("number");
  });

  it("creates one record for a valid new asset", async () => {
    const result = await importService.executeImport(
      CUSTOMER_ID,
      CONTACT_ID,
      "new-asset.csv",
      [
        {
          ...VALID_ROW,
          equipmentName: `Import Created Asset ${Date.now()}`,
          equipmentBarCodeID: `IMPORT-${Date.now()}`,
        },
      ],
      makeMapping([
        "equipmentName",
        "categoryName",
        "propertyName",
        "equipmentBarCodeID",
      ])
    );
    expect(result.created).toBe(1);
    expect(result.updated).toBe(0);
    expect(result.failed).toBe(0);
  });

  it("fails rows with missing required fields", async () => {
    const result = await importService.executeImport(
      CUSTOMER_ID,
      CONTACT_ID,
      "bad-import.csv",
      [{ categoryName: "HVAC", propertyName: "Lincoln High School" }], // no equipmentName
      makeMapping(["categoryName", "propertyName"])
    );
    expect(result.failed).toBe(1);
    expect(result.created).toBe(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("processes multiple rows and sums counts", async () => {
    const uniquePrefix = `MULTI-${Date.now()}`;
    const rows = [
      {
        equipmentName: `${uniquePrefix}-A`,
        categoryName: "HVAC",
        propertyName: "Lincoln High School",
        equipmentBarCodeID: `${uniquePrefix}-A`,
      },
      {
        equipmentName: `${uniquePrefix}-B`,
        categoryName: "Electrical",
        propertyName: "Lincoln High School",
        equipmentBarCodeID: `${uniquePrefix}-B`,
      },
      {
        categoryName: "HVAC", // missing equipmentName
        propertyName: "Lincoln High School",
      },
    ];
    const result = await importService.executeImport(
      CUSTOMER_ID,
      CONTACT_ID,
      "multi.csv",
      rows,
      makeMapping([
        "equipmentName",
        "categoryName",
        "propertyName",
        "equipmentBarCodeID",
      ])
    );
    expect(result.totalRows).toBe(3);
    expect(result.created).toBe(2);
    expect(result.failed).toBe(1);
  });

  it("records appear in import history", async () => {
    await importService.executeImport(
      CUSTOMER_ID,
      CONTACT_ID,
      "history-test.csv",
      [{ ...VALID_ROW, equipmentName: `HistoryAsset-${Date.now()}` }],
      VALID_MAPPING
    );
    const history = await importService.getImportHistory(CUSTOMER_ID, 1, 10);
    expect(history.meta.total).toBeGreaterThan(0);
    const entry = history.items[0]!;
    expect(entry).toHaveProperty("id");         // ImportHistoryEntry uses 'id', not 'importId'
    expect(entry).toHaveProperty("filename");
    expect(entry).toHaveProperty("totalRows");
    expect(entry).toHaveProperty("created");
    expect(entry).toHaveProperty("importedAt");
  });

  it("duration is a positive number", async () => {
    const result = await importService.executeImport(
      CUSTOMER_ID,
      CONTACT_ID,
      "duration-test.csv",
      [VALID_ROW],
      VALID_MAPPING
    );
    expect(result.duration).toBeGreaterThanOrEqual(0);
  });
});

describe("importService.getTemplate", () => {
  it("returns an array of field definitions", () => {
    const template = importService.getTemplate();
    expect(Array.isArray(template)).toBe(true);
    expect(template.length).toBeGreaterThan(0);
  });

  it("equipmentName field is marked required", () => {
    const template = importService.getTemplate();
    const nameField = template.find((f) => f.field === "equipmentName");
    expect(nameField).toBeDefined();
    expect(nameField!.required).toBe(true);
  });

  it("each field definition has field, label, required, and aliases", () => {
    const template = importService.getTemplate();
    for (const field of template) {
      expect(field).toHaveProperty("field");
      expect(field).toHaveProperty("label");
      expect(field).toHaveProperty("required");
      expect(field).toHaveProperty("aliases");
      expect(Array.isArray(field.aliases)).toBe(true);
    }
  });
});
