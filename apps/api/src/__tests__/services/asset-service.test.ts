/**
 * Unit tests for assetService.
 *
 * The service is a thin pass-through to the mock provider, so these tests
 * exercise both the service contract and the underlying mock provider logic.
 */
import { describe, it, expect } from "vitest";
import { assetService } from "../../services/asset-service.js";

const CUSTOMER_ID = 1;
const CONTACT_ID = 1;

const baseQuery = { page: 1, limit: 20 };

describe("assetService.list", () => {
  it("returns paginated results", async () => {
    const result = await assetService.list(CUSTOMER_ID, baseQuery);
    expect(result.items).toBeInstanceOf(Array);
    expect(result.meta).toBeDefined();
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(20);
    expect(result.meta.total).toBeGreaterThan(0);
    expect(result.meta.totalPages).toBeGreaterThan(0);
  });

  it("returns only active assets for the given customerID", async () => {
    const result = await assetService.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
    });
    for (const asset of result.items) {
      expect(asset.isActive).toBe(true);
      expect(asset.customerID).toBe(CUSTOMER_ID);
    }
  });

  it("returns empty results for an unknown customerID", async () => {
    const result = await assetService.list(99999, baseQuery);
    expect(result.items).toHaveLength(0);
    expect(result.meta.total).toBe(0);
  });

  it("respects page and limit", async () => {
    const page1 = await assetService.list(CUSTOMER_ID, {
      page: 1,
      limit: 3,
    });
    const page2 = await assetService.list(CUSTOMER_ID, {
      page: 2,
      limit: 3,
    });
    expect(page1.items.length).toBeLessThanOrEqual(3);
    expect(page2.meta.page).toBe(2);
    // Pages should not overlap
    const ids1 = page1.items.map((a) => a.equipmentRecordID);
    const ids2 = page2.items.map((a) => a.equipmentRecordID);
    const overlap = ids1.filter((id) => ids2.includes(id));
    expect(overlap).toHaveLength(0);
  });

  it("returns fewer items on last page", async () => {
    const total = await assetService.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
    });
    const totalCount = total.meta.total;
    const pageSize = 3;
    const lastPage = Math.ceil(totalCount / pageSize);
    const lastPageResult = await assetService.list(CUSTOMER_ID, {
      page: lastPage,
      limit: pageSize,
    });
    expect(lastPageResult.items.length).toBeLessThanOrEqual(pageSize);
  });

  it("filters by status", async () => {
    const result = await assetService.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
      status: "Active",
    });
    for (const asset of result.items) {
      expect(asset.lifecycleStatus.toLowerCase()).toBe("active");
    }
  });

  it("filters by categoryID", async () => {
    // categoryID 1 = HVAC (slug: hvac)
    const result = await assetService.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
      categoryID: 1,
    });
    expect(result.items.length).toBeGreaterThan(0);
    for (const asset of result.items) {
      expect(asset.categorySlug).toBe("hvac");
    }
  });

  it("returns unfiltered list when categoryID does not match any known category", async () => {
    // The mock provider skips the filter when the categoryID resolves to no
    // known category — the full list is returned unchanged.
    const all = await assetService.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
    });
    const result = await assetService.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
      categoryID: 99999,
    });
    expect(result.meta.total).toBe(all.meta.total);
  });

  it("filters by propertyId", async () => {
    const result = await assetService.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
      propertyID: 1,
    });
    expect(result.items.length).toBeGreaterThan(0);
    for (const asset of result.items) {
      expect(asset.propertyID).toBe(1);
    }
  });

  it("filters by condition", async () => {
    const result = await assetService.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
      condition: "good",
    });
    // conditionRating 4 = "good"
    for (const asset of result.items) {
      expect(asset.conditionRating).toBe(4);
    }
  });

  it("search narrows results by name", async () => {
    const result = await assetService.list(CUSTOMER_ID, {
      ...baseQuery,
      search: "Gym",
    });
    expect(result.items.length).toBeGreaterThan(0);
    for (const asset of result.items) {
      const searchable = [
        asset.equipmentName,
        asset.serialNumber ?? "",
        asset.equipmentBarCodeID ?? "",
        asset.equipmentDescription ?? "",
        asset.manufacturerName ?? "",
      ]
        .join(" ")
        .toLowerCase();
      expect(searchable).toContain("gym");
    }
  });

  it("search is case-insensitive", async () => {
    const upper = await assetService.list(CUSTOMER_ID, {
      ...baseQuery,
      search: "GYM",
    });
    const lower = await assetService.list(CUSTOMER_ID, {
      ...baseQuery,
      search: "gym",
    });
    expect(upper.meta.total).toBe(lower.meta.total);
  });

  it("returns empty when search matches nothing", async () => {
    const result = await assetService.list(CUSTOMER_ID, {
      ...baseQuery,
      search: "XYZZYZZYZZY_NOMATCH",
    });
    expect(result.items).toHaveLength(0);
    expect(result.meta.total).toBe(0);
  });

  it("sorts ascending by equipmentName by default", async () => {
    const result = await assetService.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
    });
    const names = result.items.map((a) => a.equipmentName);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  it("sorts descending when sortOrder is desc", async () => {
    const result = await assetService.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
      sortBy: "equipmentName",
      sortOrder: "desc",
    });
    const names = result.items.map((a) => a.equipmentName);
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });
});

describe("assetService.getById", () => {
  it("returns the asset with matching ID", async () => {
    const asset = await assetService.getById(CUSTOMER_ID, 1);
    expect(asset).not.toBeNull();
    expect(asset!.equipmentRecordID).toBe(1);
    expect(asset!.customerID).toBe(CUSTOMER_ID);
  });

  it("returns null for a non-existent ID", async () => {
    const asset = await assetService.getById(CUSTOMER_ID, 99999);
    expect(asset).toBeNull();
  });

  it("returns null for wrong customerID", async () => {
    // Asset 1 belongs to customerID=1, not 2
    const asset = await assetService.getById(2, 1);
    expect(asset).toBeNull();
  });

  it("returned asset has expected shape", async () => {
    const asset = await assetService.getById(CUSTOMER_ID, 1);
    expect(asset).toMatchObject({
      equipmentRecordID: expect.any(Number),
      customerID: expect.any(Number),
      equipmentName: expect.any(String),
      isActive: true,
      lifecycleStatus: expect.any(String),
      operationalStatus: expect.stringMatching(/^(online|offline)$/),
    });
  });
});

describe("assetService.create", () => {
  it("creates an asset with required fields", async () => {
    const newAsset = await assetService.create(CUSTOMER_ID, CONTACT_ID, {
      equipmentName: "Test Chiller Unit",
    });
    expect(newAsset.equipmentName).toBe("Test Chiller Unit");
    expect(newAsset.customerID).toBe(CUSTOMER_ID);
    expect(newAsset.isActive).toBe(true);
    expect(newAsset.equipmentRecordID).toBeGreaterThan(0);
    expect(newAsset.createdBy).toBe(CONTACT_ID);
    expect(newAsset.operationalStatus).toBe("online");
  });

  it("newly created asset appears in list", async () => {
    const created = await assetService.create(CUSTOMER_ID, CONTACT_ID, {
      equipmentName: "Discoverable Pump Unit",
    });
    const list = await assetService.list(CUSTOMER_ID, {
      ...baseQuery,
      limit: 100,
      search: "Discoverable Pump Unit",
    });
    const found = list.items.find(
      (a) => a.equipmentRecordID === created.equipmentRecordID
    );
    expect(found).toBeDefined();
  });

  it("sets lifecycleStatus to Active by default", async () => {
    const asset = await assetService.create(CUSTOMER_ID, CONTACT_ID, {
      equipmentName: "Status Default Asset",
    });
    expect(asset.lifecycleStatus).toBe("Active");
  });

  it("accepts optional fields", async () => {
    const asset = await assetService.create(CUSTOMER_ID, CONTACT_ID, {
      equipmentName: "Full Optional Asset",
      serialNumber: "SN-TEST-999",
      modelNumber: "MODEL-X",
      acquisitionCost: 12500,
      conditionRating: 5,
      notes: "Test notes",
    });
    expect(asset.serialNumber).toBe("SN-TEST-999");
    expect(asset.modelNumber).toBe("MODEL-X");
    expect(asset.acquisitionCost).toBe(12500);
    expect(asset.conditionRating).toBe(5);
    expect(asset.notes).toBe("Test notes");
  });
});

describe("assetService.update", () => {
  it("updates an existing asset", async () => {
    const updated = await assetService.update(CUSTOMER_ID, 1, CONTACT_ID, {
      notes: "Updated notes via test",
    });
    expect(updated).not.toBeNull();
    expect(updated!.notes).toBe("Updated notes via test");
    expect(updated!.modifiedBy).toBe(CONTACT_ID);
    expect(updated!.dateModified).not.toBeNull();
  });

  it("returns null for a non-existent asset ID", async () => {
    const result = await assetService.update(CUSTOMER_ID, 99999, CONTACT_ID, {
      notes: "Ghost asset",
    });
    expect(result).toBeNull();
  });

  it("preserves non-updated fields", async () => {
    const before = await assetService.getById(CUSTOMER_ID, 1);
    const updated = await assetService.update(CUSTOMER_ID, 1, CONTACT_ID, {
      notes: "Preserve other fields test",
    });
    expect(updated!.equipmentName).toBe(before!.equipmentName);
    expect(updated!.customerID).toBe(CUSTOMER_ID);
  });
});

describe("assetService.delete", () => {
  it("soft-deletes an asset (returns true)", async () => {
    // Create a fresh asset to delete
    const created = await assetService.create(CUSTOMER_ID, CONTACT_ID, {
      equipmentName: "Asset To Be Deleted",
    });
    const result = await assetService.delete(CUSTOMER_ID, created.equipmentRecordID);
    expect(result).toBe(true);
  });

  it("deleted asset no longer appears in getById", async () => {
    const created = await assetService.create(CUSTOMER_ID, CONTACT_ID, {
      equipmentName: "Asset Gone After Delete",
    });
    await assetService.delete(CUSTOMER_ID, created.equipmentRecordID);
    const found = await assetService.getById(CUSTOMER_ID, created.equipmentRecordID);
    expect(found).toBeNull();
  });

  it("returns false for non-existent asset", async () => {
    const result = await assetService.delete(CUSTOMER_ID, 99999);
    expect(result).toBe(false);
  });
});
