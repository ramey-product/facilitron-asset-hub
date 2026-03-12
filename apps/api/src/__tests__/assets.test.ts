import { describe, it, expect } from "vitest";
import app from "../app.js";

describe("Assets API", () => {
  describe("GET /api/v2/assets", () => {
    it("returns paginated asset list", async () => {
      const res = await app.request("/api/v2/assets");
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        data: unknown[];
        meta: { page: number; limit: number; total: number };
      };
      expect(body.data).toBeDefined();
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.meta).toBeDefined();
      expect(body.meta.page).toBe(1);
      expect(body.meta.total).toBeGreaterThan(0);
    });

    it("respects page and limit query params", async () => {
      const res = await app.request("/api/v2/assets?page=1&limit=5");
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        data: unknown[];
        meta: { page: number; limit: number; total: number };
      };
      expect(body.data.length).toBeLessThanOrEqual(5);
      expect(body.meta.limit).toBe(5);
    });

    it("filters by search query", async () => {
      const res = await app.request("/api/v2/assets?search=HVAC");
      expect(res.status).toBe(200);
      const body = (await res.json()) as { data: unknown[] };
      expect(body.data).toBeDefined();
    });

    it("only returns active assets in list", async () => {
      const res = await app.request("/api/v2/assets?limit=100");
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        data: { isActive: boolean }[];
      };
      body.data.forEach((asset) => {
        expect(asset.isActive).toBe(true);
      });
    });
  });

  describe("GET /api/v2/assets/:id", () => {
    it("returns single asset by ID", async () => {
      const res = await app.request("/api/v2/assets/1");
      expect(res.status).toBe(200);
      const body = (await res.json()) as { data: { equipmentRecordID: number } };
      expect(body.data).toBeDefined();
      expect(body.data.equipmentRecordID).toBe(1);
    });

    it("returns 404 for non-existent asset", async () => {
      const res = await app.request("/api/v2/assets/99999");
      expect(res.status).toBe(404);
    });

    it("returns 400 for invalid ID", async () => {
      const res = await app.request("/api/v2/assets/abc");
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/v2/assets", () => {
    it("creates a new asset with required fields", async () => {
      const res = await app.request("/api/v2/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetName: "Test HVAC Unit",
        }),
      });
      expect(res.status).toBe(201);
      const body = (await res.json()) as {
        data: { equipmentRecordID: number; equipmentName: string; isActive: boolean };
      };
      expect(body.data.equipmentName).toBe("Test HVAC Unit");
      expect(body.data.isActive).toBe(true);
      expect(body.data.equipmentRecordID).toBeGreaterThan(0);
    });

    it("creates asset with all optional fields", async () => {
      const res = await app.request("/api/v2/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetName: "Full Test Asset",
          serialNumber: "SN-TEST-001",
          modelNumber: "MOD-001",
          purchaseCost: 5000,
          purchaseDate: "2024-01-15T00:00:00.000Z",
          warrantyExpiration: "2027-01-15T00:00:00.000Z",
          notes: "Test notes for full asset",
          assetCondition: "good",
          assetStatus: "active",
        }),
      });
      expect(res.status).toBe(201);
      const body = (await res.json()) as {
        data: {
          serialNumber: string;
          modelNumber: string;
          acquisitionCost: number;
          conditionRating: number;
          notes: string;
        };
      };
      expect(body.data.serialNumber).toBe("SN-TEST-001");
      expect(body.data.modelNumber).toBe("MOD-001");
      expect(body.data.acquisitionCost).toBe(5000);
      expect(body.data.conditionRating).toBe(4); // "good" = 4
      expect(body.data.notes).toBe("Test notes for full asset");
    });

    it("rejects missing assetName", async () => {
      const res = await app.request("/api/v2/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/v2/assets/:id", () => {
    it("updates an existing asset", async () => {
      const res = await app.request("/api/v2/assets/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetName: "Updated HVAC Unit",
        }),
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        data: { equipmentRecordID: number; equipmentName: string; dateModified: string };
      };
      expect(body.data.equipmentRecordID).toBe(1);
      expect(body.data.equipmentName).toBe("Updated HVAC Unit");
      expect(body.data.dateModified).toBeDefined();
    });

    it("returns 404 for non-existent asset", async () => {
      const res = await app.request("/api/v2/assets/99999", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetName: "Ghost Asset" }),
      });
      expect(res.status).toBe(404);
    });

    it("returns 400 for invalid ID", async () => {
      const res = await app.request("/api/v2/assets/abc", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetName: "Bad ID" }),
      });
      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/v2/assets/:id", () => {
    it("soft-deletes an asset and hides it from detail", async () => {
      // First create an asset to delete
      const createRes = await app.request("/api/v2/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetName: "Asset To Delete" }),
      });
      const { data: created } = (await createRes.json()) as {
        data: { equipmentRecordID: number };
      };
      const deleteId = created.equipmentRecordID;

      // Verify it exists
      const beforeRes = await app.request(`/api/v2/assets/${deleteId}`);
      expect(beforeRes.status).toBe(200);

      // Delete it
      const deleteRes = await app.request(`/api/v2/assets/${deleteId}`, {
        method: "DELETE",
      });
      expect(deleteRes.status).toBe(200);
      const deleteBody = (await deleteRes.json()) as { data: { success: boolean } };
      expect(deleteBody.data.success).toBe(true);

      // Verify it's now hidden from detail endpoint
      const afterRes = await app.request(`/api/v2/assets/${deleteId}`);
      expect(afterRes.status).toBe(404);
    });

    it("returns 404 for non-existent asset", async () => {
      const res = await app.request("/api/v2/assets/99999", {
        method: "DELETE",
      });
      expect(res.status).toBe(404);
    });

    it("returns 400 for invalid ID", async () => {
      const res = await app.request("/api/v2/assets/abc", {
        method: "DELETE",
      });
      expect(res.status).toBe(400);
    });
  });
});
