import { describe, it, expect } from "vitest";
import app from "../app.js";

describe("Settings API", () => {
  describe("GET /api/v2/settings", () => {
    it("returns all settings for customer", async () => {
      const res = await app.request("/api/v2/settings");
      expect(res.status).toBe(200);
      const body = (await res.json()) as { data: unknown[] };
      expect(body.data).toBeDefined();
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBeGreaterThan(0);
    });
  });

  describe("PUT /api/v2/settings/:key", () => {
    it("upserts a setting value", async () => {
      const res = await app.request("/api/v2/settings/asset.barcode.prefix", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: "EQ" }),
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { data: { settingKey: string; settingValue: string } };
      expect(body.data.settingKey).toBe("asset.barcode.prefix");
      expect(body.data.settingValue).toBe("EQ");
    });
  });

  describe("GET /api/v2/settings/categories", () => {
    it("returns all categories", async () => {
      const res = await app.request("/api/v2/settings/categories");
      expect(res.status).toBe(200);
      const body = (await res.json()) as { data: unknown[] };
      expect(body.data).toBeDefined();
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBeGreaterThan(0);
    });
  });

  describe("POST /api/v2/settings/categories", () => {
    it("creates a new category", async () => {
      const res = await app.request("/api/v2/settings/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test Category",
          slug: "test-category",
          description: "A test category",
          icon: "TestTube",
          color: "#FF0000",
        }),
      });
      expect(res.status).toBe(201);
      const body = (await res.json()) as { data: { name: string } };
      expect(body.data.name).toBe("Test Category");
    });
  });
});
