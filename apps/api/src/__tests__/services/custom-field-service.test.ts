/**
 * Unit tests for customFieldService.
 */
import { describe, it, expect } from "vitest";
import { customFieldService } from "../../services/custom-field-service.js";

const CUSTOMER_ID = 1;

// Assets 1 and 10 have seed values in the mock data
const ASSET_WITH_VALUES = 1;
const ASSET_WITHOUT_VALUES = 9999; // asset that has no custom field values

describe("customFieldService.listDefinitions", () => {
  it("returns definitions array for customerID 1", async () => {
    const defs = await customFieldService.listDefinitions(CUSTOMER_ID);
    expect(Array.isArray(defs)).toBe(true);
    expect(defs.length).toBeGreaterThan(0);
  });

  it("each definition has expected shape", async () => {
    const defs = await customFieldService.listDefinitions(CUSTOMER_ID);
    for (const def of defs) {
      expect(def).toHaveProperty("id");
      expect(def).toHaveProperty("customerID");
      expect(def).toHaveProperty("fieldName");
      expect(def).toHaveProperty("fieldLabel");
      expect(def).toHaveProperty("fieldType");
      expect(def).toHaveProperty("isRequired");
      expect(def).toHaveProperty("displayOrder");
      expect(def).toHaveProperty("isActive");
      expect(def.customerID).toBe(CUSTOMER_ID);
      expect(def.isActive).toBe(true);
    }
  });

  it("returns definitions sorted by displayOrder ascending", async () => {
    const defs = await customFieldService.listDefinitions(CUSTOMER_ID);
    const orders = defs.map((d) => d.displayOrder);
    for (let i = 1; i < orders.length; i++) {
      expect(orders[i]!).toBeGreaterThanOrEqual(orders[i - 1]!);
    }
  });

  it("returns empty for unknown customerID", async () => {
    const defs = await customFieldService.listDefinitions(99999);
    expect(defs).toHaveLength(0);
  });

  it("known field types are valid", async () => {
    const defs = await customFieldService.listDefinitions(CUSTOMER_ID);
    const validTypes = ["text", "number", "date", "boolean", "select"];
    for (const def of defs) {
      expect(validTypes).toContain(def.fieldType);
    }
  });
});

describe("customFieldService.getAssetValues", () => {
  it("returns values array for an asset with known seed values", async () => {
    const values = await customFieldService.getAssetValues(
      CUSTOMER_ID,
      ASSET_WITH_VALUES
    );
    expect(Array.isArray(values)).toBe(true);
    expect(values.length).toBeGreaterThan(0);
  });

  it("each value has expected shape", async () => {
    const values = await customFieldService.getAssetValues(
      CUSTOMER_ID,
      ASSET_WITH_VALUES
    );
    for (const v of values) {
      expect(v).toHaveProperty("definitionId");
      expect(v).toHaveProperty("fieldName");
      expect(v).toHaveProperty("fieldLabel");
      expect(v).toHaveProperty("fieldType");
      expect(v).toHaveProperty("value");
    }
  });

  it("returns one entry per active definition (some may be null)", async () => {
    const defs = await customFieldService.listDefinitions(CUSTOMER_ID);
    const values = await customFieldService.getAssetValues(
      CUSTOMER_ID,
      ASSET_WITH_VALUES
    );
    expect(values.length).toBe(defs.length);
  });

  it("returns all-null values for an asset with no custom field data", async () => {
    const values = await customFieldService.getAssetValues(
      CUSTOMER_ID,
      ASSET_WITHOUT_VALUES
    );
    for (const v of values) {
      expect(v.value).toBeNull();
    }
  });
});

describe("customFieldService.createDefinition", () => {
  it("creates a new field definition and returns it", async () => {
    const newDef = await customFieldService.createDefinition(CUSTOMER_ID, {
      fieldName: "test_field_created",
      fieldLabel: "Test Created Field",
      fieldType: "text",
    });
    expect(newDef.id).toBeGreaterThan(0);
    expect(newDef.customerID).toBe(CUSTOMER_ID);
    expect(newDef.fieldName).toBe("test_field_created");
    expect(newDef.fieldLabel).toBe("Test Created Field");
    expect(newDef.fieldType).toBe("text");
    expect(newDef.isActive).toBe(true);
  });

  it("new definition appears in subsequent listDefinitions", async () => {
    const uniqueName = `field_${Date.now()}`;
    const created = await customFieldService.createDefinition(CUSTOMER_ID, {
      fieldName: uniqueName,
      fieldLabel: "Unique Test Field",
      fieldType: "number",
    });
    const defs = await customFieldService.listDefinitions(CUSTOMER_ID);
    const found = defs.find((d) => d.id === created.id);
    expect(found).toBeDefined();
  });
});

describe("customFieldService.updateDefinition", () => {
  it("updates an existing definition", async () => {
    const defs = await customFieldService.listDefinitions(CUSTOMER_ID);
    const first = defs[0]!;
    const updated = await customFieldService.updateDefinition(
      CUSTOMER_ID,
      first.id,
      { fieldLabel: "Updated Label" }
    );
    expect(updated).not.toBeNull();
    expect(updated!.fieldLabel).toBe("Updated Label");
    expect(updated!.id).toBe(first.id);
  });

  it("returns null for non-existent definition", async () => {
    const result = await customFieldService.updateDefinition(
      CUSTOMER_ID,
      99999,
      { fieldLabel: "Ghost" }
    );
    expect(result).toBeNull();
  });
});

describe("customFieldService.updateAssetValues", () => {
  it("updates values and returns new state", async () => {
    const defs = await customFieldService.listDefinitions(CUSTOMER_ID);
    const firstDef = defs[0]!;

    const updatedValues = await customFieldService.updateAssetValues(
      CUSTOMER_ID,
      ASSET_WITH_VALUES,
      {
        values: [{ definitionId: firstDef.id, value: "TestUpdateValue" }],
      }
    );
    const updated = updatedValues.find((v) => v.definitionId === firstDef.id);
    expect(updated).toBeDefined();
    expect(updated!.value).toBe("TestUpdateValue");
  });

  it("returns one entry per active definition after update", async () => {
    const defs = await customFieldService.listDefinitions(CUSTOMER_ID);
    const updatedValues = await customFieldService.updateAssetValues(
      CUSTOMER_ID,
      ASSET_WITH_VALUES,
      {
        values: [{ definitionId: defs[0]!.id, value: "check" }],
      }
    );
    expect(updatedValues.length).toBe(defs.length);
  });
});

describe("customFieldService.deleteDefinition", () => {
  it("soft-deletes a definition and returns true", async () => {
    // Create a throwaway definition to delete
    const created = await customFieldService.createDefinition(CUSTOMER_ID, {
      fieldName: `to_delete_${Date.now()}`,
      fieldLabel: "Throwaway Field",
      fieldType: "boolean",
    });
    const result = await customFieldService.deleteDefinition(
      CUSTOMER_ID,
      created.id
    );
    expect(result).toBe(true);
  });

  it("deleted definition no longer appears in listDefinitions", async () => {
    const created = await customFieldService.createDefinition(CUSTOMER_ID, {
      fieldName: `gone_field_${Date.now()}`,
      fieldLabel: "Gone Field",
      fieldType: "text",
    });
    await customFieldService.deleteDefinition(CUSTOMER_ID, created.id);
    const defs = await customFieldService.listDefinitions(CUSTOMER_ID);
    const found = defs.find((d) => d.id === created.id);
    expect(found).toBeUndefined();
  });

  it("returns false for non-existent definition", async () => {
    const result = await customFieldService.deleteDefinition(CUSTOMER_ID, 99999);
    expect(result).toBe(false);
  });
});
