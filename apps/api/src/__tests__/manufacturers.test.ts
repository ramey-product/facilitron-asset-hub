import { describe, it, expect } from "vitest";
import app from "../app.js";

describe("Manufacturers API", () => {
  describe("GET /api/v2/manufacturers", () => {
    it("returns manufacturers matching search query", async () => {
      const res = await app.request("/api/v2/manufacturers?q=Carrier");
      expect(res.status).toBe(200);
      const body = (await res.json()) as { data: { manufacturerName: string }[] };
      expect(body.data).toBeDefined();
      expect(Array.isArray(body.data)).toBe(true);
      const names = body.data.map((m) => m.manufacturerName);
      expect(names).toContain("Carrier");
    });

    it("returns empty array for no matches", async () => {
      const res = await app.request("/api/v2/manufacturers?q=ZZZZNOTREAL");
      expect(res.status).toBe(200);
      const body = (await res.json()) as { data: unknown[] };
      expect(body.data).toEqual([]);
    });

    it("returns all when query is empty", async () => {
      const res = await app.request("/api/v2/manufacturers?q=");
      expect(res.status).toBe(200);
      const body = (await res.json()) as { data: unknown[] };
      expect(body.data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/v2/manufacturers/:id", () => {
    it("returns a single manufacturer by ID", async () => {
      const res = await app.request("/api/v2/manufacturers/1");
      expect(res.status).toBe(200);
      const body = (await res.json()) as { data: { manufacturerRecordID: number; manufacturerName: string } };
      expect(body.data).toBeDefined();
      expect(body.data.manufacturerRecordID).toBe(1);
    });

    it("returns 404 for non-existent manufacturer", async () => {
      const res = await app.request("/api/v2/manufacturers/99999");
      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/v2/manufacturers/:id/models", () => {
    it("returns models for a manufacturer", async () => {
      const res = await app.request("/api/v2/manufacturers/1/models?q=");
      expect(res.status).toBe(200);
      const body = (await res.json()) as { data: unknown[] };
      expect(body.data).toBeDefined();
      expect(Array.isArray(body.data)).toBe(true);
    });

    it("filters models by search query", async () => {
      const res = await app.request("/api/v2/manufacturers/1/models?q=50");
      expect(res.status).toBe(200);
      const body = (await res.json()) as { data: unknown[] };
      expect(body.data).toBeDefined();
    });
  });

  describe("POST /api/v2/manufacturers", () => {
    it("creates a custom manufacturer", async () => {
      const res = await app.request("/api/v2/manufacturers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manufacturerName: "Custom MFG",
        }),
      });
      expect(res.status).toBe(201);
      const body = (await res.json()) as { data: { manufacturerName: string } };
      expect(body.data.manufacturerName).toBe("Custom MFG");
    });
  });
});
