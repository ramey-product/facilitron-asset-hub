/**
 * Unit tests for propertyService.
 */
import { describe, it, expect } from "vitest";
import { propertyService } from "../../services/property-service.js";

const CUSTOMER_ID = 1;

describe("propertyService.getProperties", () => {
  it("returns an array of PropertySummary", async () => {
    const properties = await propertyService.getProperties(CUSTOMER_ID);
    expect(Array.isArray(properties)).toBe(true);
  });

  it("returns properties for customerID 1", async () => {
    const properties = await propertyService.getProperties(CUSTOMER_ID);
    expect(properties.length).toBeGreaterThan(0);
  });

  it("each property has required shape", async () => {
    const properties = await propertyService.getProperties(CUSTOMER_ID);
    for (const p of properties) {
      expect(p).toHaveProperty("id");
      expect(p).toHaveProperty("name");
      expect(p).toHaveProperty("assetCount");
      expect(p).toHaveProperty("isActive");
      expect(typeof p.id).toBe("number");
      expect(typeof p.name).toBe("string");
      expect(typeof p.assetCount).toBe("number");
    }
  });

  it("assetCount is non-negative for each property", async () => {
    const properties = await propertyService.getProperties(CUSTOMER_ID);
    for (const p of properties) {
      expect(p.assetCount).toBeGreaterThanOrEqual(0);
    }
  });

  it("at least one property has assetCount > 0", async () => {
    const properties = await propertyService.getProperties(CUSTOMER_ID);
    const withAssets = properties.filter((p) => p.assetCount > 0);
    expect(withAssets.length).toBeGreaterThan(0);
  });

  it("properties are sorted alphabetically by name", async () => {
    const properties = await propertyService.getProperties(CUSTOMER_ID);
    const names = properties.map((p) => p.name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  it("returns empty array for unknown customerID", async () => {
    const properties = await propertyService.getProperties(99999);
    expect(properties).toHaveLength(0);
  });

  it("all returned properties have isActive true", async () => {
    const properties = await propertyService.getProperties(CUSTOMER_ID);
    for (const p of properties) {
      expect(p.isActive).toBe(true);
    }
  });
});
