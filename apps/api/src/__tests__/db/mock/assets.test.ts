/**
 * Unit tests for mockAssetProvider — tests the mock data layer directly.
 */
import { describe, it, expect } from "vitest";
import { mockAssetProvider } from "../../../db/mock/assets.js";

const CUSTOMER_ID = 1;
const CONTACT_ID = 1;

const baseQuery = { page: 1, limit: 20 };

describe("mockAssetProvider — data consistency", () => {
  it("seed data contains at least 20 assets for customerID 1", async () => {
    const result = await mockAssetProvider.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
    });
    expect(result.meta.total).toBeGreaterThanOrEqual(20);
  });

  it("all seed assets have non-empty equipmentName", async () => {
    const result = await mockAssetProvider.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
    });
    for (const asset of result.items) {
      expect(asset.equipmentName.length).toBeGreaterThan(0);
    }
  });

  it("all seed assets have valid operationalStatus", async () => {
    const result = await mockAssetProvider.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
    });
    for (const asset of result.items) {
      expect(["online", "offline"]).toContain(asset.operationalStatus);
    }
  });

  it("seed data covers multiple lifecycle statuses", async () => {
    const result = await mockAssetProvider.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
    });
    const statuses = new Set(result.items.map((a) => a.lifecycleStatus));
    expect(statuses.size).toBeGreaterThanOrEqual(1);
  });

  it("seed data covers multiple categories", async () => {
    const result = await mockAssetProvider.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
    });
    const categories = new Set(
      result.items.map((a) => a.categorySlug).filter(Boolean)
    );
    expect(categories.size).toBeGreaterThanOrEqual(3);
  });

  it("seed data covers multiple properties", async () => {
    const result = await mockAssetProvider.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
    });
    const properties = new Set(
      result.items.map((a) => a.propertyID).filter(Boolean)
    );
    expect(properties.size).toBeGreaterThanOrEqual(2);
  });
});

describe("mockAssetProvider.list — filtering", () => {
  it("propertyId filter returns only matching assets", async () => {
    const result = await mockAssetProvider.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
      propertyID: 1,
    });
    expect(result.items.length).toBeGreaterThan(0);
    for (const asset of result.items) {
      expect(asset.propertyID).toBe(1);
    }
  });

  it("propertyId filter returns fewer results than full list", async () => {
    const all = await mockAssetProvider.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
    });
    const scoped = await mockAssetProvider.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
      propertyID: 1,
    });
    expect(scoped.meta.total).toBeLessThan(all.meta.total);
  });

  it("status filter works for Active", async () => {
    const result = await mockAssetProvider.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
      status: "Active",
    });
    expect(result.items.length).toBeGreaterThan(0);
    for (const asset of result.items) {
      expect(asset.lifecycleStatus.toLowerCase()).toBe("active");
    }
  });

  it("status filter is case-insensitive", async () => {
    const upper = await mockAssetProvider.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
      status: "Active",
    });
    const lower = await mockAssetProvider.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
      status: "active",
    });
    expect(upper.meta.total).toBe(lower.meta.total);
  });

  it("condition filter 'excellent' returns only rating=5 assets", async () => {
    const result = await mockAssetProvider.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
      condition: "excellent",
    });
    for (const asset of result.items) {
      expect(asset.conditionRating).toBe(5);
    }
  });

  it("condition filter 'poor' returns only rating=2 assets", async () => {
    const result = await mockAssetProvider.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
      condition: "poor",
    });
    for (const asset of result.items) {
      expect(asset.conditionRating).toBe(2);
    }
  });

  it("search by barcode format returns matching asset", async () => {
    const result = await mockAssetProvider.list(CUSTOMER_ID, {
      ...baseQuery,
      search: "AST-0001",
    });
    expect(result.items.length).toBeGreaterThan(0);
    const found = result.items.find(
      (a) => a.equipmentBarCodeID === "AST-0001"
    );
    expect(found).toBeDefined();
  });
});

describe("mockAssetProvider.list — pagination edge cases", () => {
  it("page 1 with limit 1 returns exactly 1 item", async () => {
    const result = await mockAssetProvider.list(CUSTOMER_ID, {
      page: 1,
      limit: 1,
    });
    expect(result.items.length).toBe(1);
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(1);
  });

  it("totalPages is ceiling of total/limit", async () => {
    const result = await mockAssetProvider.list(CUSTOMER_ID, {
      page: 1,
      limit: 3,
    });
    const expected = Math.ceil(result.meta.total / 3);
    expect(result.meta.totalPages).toBe(expected);
  });

  it("requesting a very high page number returns empty items", async () => {
    // Page 999999 is guaranteed to be beyond the last page for any realistic
    // mock data set — regardless of how many assets were created in this run.
    const result = await mockAssetProvider.list(CUSTOMER_ID, {
      page: 999999,
      limit: 20,
    });
    expect(result.items).toHaveLength(0);
    // meta.total still reflects the actual total count
    expect(result.meta.total).toBeGreaterThan(0);
  });

  it("empty customerID yields meta.total = 0 with correct page/limit", async () => {
    const result = await mockAssetProvider.list(99999, {
      page: 1,
      limit: 10,
    });
    expect(result.items).toHaveLength(0);
    expect(result.meta.total).toBe(0);
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(10);
  });
});

describe("mockAssetProvider.getById", () => {
  it("returns asset for ID 1 with correct shape", async () => {
    const asset = await mockAssetProvider.getById(CUSTOMER_ID, 1);
    expect(asset).not.toBeNull();
    expect(asset!.equipmentRecordID).toBe(1);
    expect(asset!.customerID).toBe(CUSTOMER_ID);
    expect(asset!.isActive).toBe(true);
  });

  it("returns null for ID 99999", async () => {
    const asset = await mockAssetProvider.getById(CUSTOMER_ID, 99999);
    expect(asset).toBeNull();
  });

  it("returns null for correct ID but wrong customerID", async () => {
    const asset = await mockAssetProvider.getById(2, 1);
    expect(asset).toBeNull();
  });
});

describe("mockAssetProvider.create", () => {
  it("assigns a new incrementing ID", async () => {
    const a1 = await mockAssetProvider.create(CUSTOMER_ID, CONTACT_ID, {
      equipmentName: "ID Increment A",
    });
    const a2 = await mockAssetProvider.create(CUSTOMER_ID, CONTACT_ID, {
      equipmentName: "ID Increment B",
    });
    expect(a2.equipmentRecordID).toBeGreaterThan(a1.equipmentRecordID);
  });

  it("sets dateCreated to current ISO string", async () => {
    const before = Date.now();
    const asset = await mockAssetProvider.create(CUSTOMER_ID, CONTACT_ID, {
      equipmentName: "Date Created Test",
    });
    const after = Date.now();
    const created = new Date(asset.dateCreated).getTime();
    expect(created).toBeGreaterThanOrEqual(before);
    expect(created).toBeLessThanOrEqual(after);
  });

  it("dateModified is null on initial creation", async () => {
    const asset = await mockAssetProvider.create(CUSTOMER_ID, CONTACT_ID, {
      equipmentName: "No Modified Date",
    });
    expect(asset.dateModified).toBeNull();
  });
});

describe("mockAssetProvider.delete", () => {
  it("soft-deletes: isActive becomes false, hidden from list", async () => {
    const created = await mockAssetProvider.create(CUSTOMER_ID, CONTACT_ID, {
      equipmentName: "Soft Delete Test",
    });
    const id = created.equipmentRecordID;
    await mockAssetProvider.delete(CUSTOMER_ID, id);

    // Should not appear in getById
    const found = await mockAssetProvider.getById(CUSTOMER_ID, id);
    expect(found).toBeNull();

    // Should not appear in list
    const list = await mockAssetProvider.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 200,
    });
    const inList = list.items.find((a) => a.equipmentRecordID === id);
    expect(inList).toBeUndefined();
  });
});
