import { describe, it, expect } from "vitest";
import app from "../app.js";

describe("Condition Tracking API", () => {
  describe("GET /api/v2/conditions/scale", () => {
    it("returns condition scale definitions", async () => {
      const res = await app.request("/api/v2/conditions/scale");
      expect(res.status).toBe(200);
      const body = (await res.json()) as { data: unknown[] };
      expect(body.data).toBeDefined();
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBe(5);
    });

    it("each scale item has required fields", async () => {
      const res = await app.request("/api/v2/conditions/scale");
      const body = (await res.json()) as {
        data: { conditionScore: number; conditionName: string; colorCode: string; description: string }[];
      };
      body.data.forEach((item) => {
        expect(item.conditionScore).toBeGreaterThanOrEqual(1);
        expect(item.conditionScore).toBeLessThanOrEqual(5);
        expect(typeof item.conditionName).toBe("string");
        expect(typeof item.colorCode).toBe("string");
        expect(typeof item.description).toBe("string");
      });
    });

    it("scale scores span 1 through 5", async () => {
      const res = await app.request("/api/v2/conditions/scale");
      const body = (await res.json()) as { data: { conditionScore: number }[] };
      const scores = body.data.map((item) => item.conditionScore).sort((a, b) => a - b);
      expect(scores).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("GET /api/v2/assets/:id/conditions/history", () => {
    it("returns condition history for an asset", async () => {
      const res = await app.request("/api/v2/assets/1/conditions/history");
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        data: unknown[];
        meta: { page: number; limit: number; total: number };
      };
      expect(body.data).toBeDefined();
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.meta).toBeDefined();
      expect(body.meta.total).toBeGreaterThan(0);
    });

    it("respects limit parameter", async () => {
      const res = await app.request("/api/v2/assets/1/conditions/history?limit=2");
      expect(res.status).toBe(200);
      const body = (await res.json()) as { data: unknown[] };
      expect(body.data.length).toBeLessThanOrEqual(2);
    });

    it("returns empty array for asset with no history", async () => {
      const res = await app.request("/api/v2/assets/99999/conditions/history");
      expect(res.status).toBe(200);
      const body = (await res.json()) as { data: unknown[] };
      expect(body.data).toEqual([]);
    });

    it("history records contain required fields", async () => {
      const res = await app.request("/api/v2/assets/1/conditions/history?limit=1");
      const body = (await res.json()) as {
        data: { id: number; equipmentRecordId: number; conditionScore: number; source: string; loggedAt: string }[];
      };
      if (body.data.length > 0) {
        const record = body.data[0]!;
        expect(record.id).toBeDefined();
        expect(record.equipmentRecordId).toBe(1);
        expect(record.conditionScore).toBeGreaterThanOrEqual(1);
        expect(record.conditionScore).toBeLessThanOrEqual(5);
        expect(record.source).toBeDefined();
        expect(record.loggedAt).toBeDefined();
      }
    });

    it("returns 400 for non-numeric asset ID", async () => {
      const res = await app.request("/api/v2/assets/abc/conditions/history");
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/v2/assets/:id/conditions/stats", () => {
    it("returns condition stats for an asset", async () => {
      const res = await app.request("/api/v2/assets/1/conditions/stats");
      expect(res.status).toBe(200);
      const body = (await res.json()) as {
        data: {
          currentScore: number;
          currentLabel: string;
          trend: string;
          totalLogs: number;
          averageScore: number;
          scoreHistory: unknown[];
        };
      };
      expect(body.data.currentScore).toBeGreaterThanOrEqual(1);
      expect(body.data.currentScore).toBeLessThanOrEqual(5);
      expect(typeof body.data.currentLabel).toBe("string");
      expect(["improving", "declining", "stable"]).toContain(body.data.trend);
      expect(body.data.totalLogs).toBeGreaterThan(0);
      expect(body.data.averageScore).toBeGreaterThanOrEqual(1);
      expect(body.data.averageScore).toBeLessThanOrEqual(5);
      expect(Array.isArray(body.data.scoreHistory)).toBe(true);
    });

    it("returns 404 for asset with no condition data", async () => {
      const res = await app.request("/api/v2/assets/99999/conditions/stats");
      expect(res.status).toBe(404);
    });

    it("returns 400 for non-numeric asset ID", async () => {
      const res = await app.request("/api/v2/assets/abc/conditions/stats");
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/v2/assets/:id/conditions", () => {
    it("logs a new condition assessment", async () => {
      const res = await app.request("/api/v2/assets/1/conditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conditionScore: 4,
          source: "manual",
          notes: "Test condition log",
        }),
      });
      expect(res.status).toBe(201);
      const body = (await res.json()) as {
        data: { id: number; conditionScore: number; source: string; notes: string };
      };
      expect(body.data.conditionScore).toBe(4);
      expect(body.data.source).toBe("manual");
      expect(body.data.notes).toBe("Test condition log");
    });

    it("defaults source to manual when omitted", async () => {
      const res = await app.request("/api/v2/assets/1/conditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conditionScore: 3 }),
      });
      expect(res.status).toBe(201);
      const body = (await res.json()) as { data: { source: string } };
      expect(body.data.source).toBe("manual");
    });

    it("accepts inspection as source", async () => {
      const res = await app.request("/api/v2/assets/1/conditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conditionScore: 2, source: "inspection" }),
      });
      expect(res.status).toBe(201);
      const body = (await res.json()) as { data: { source: string } };
      expect(body.data.source).toBe("inspection");
    });

    it("rejects conditionScore above 5", async () => {
      const res = await app.request("/api/v2/assets/1/conditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conditionScore: 6 }),
      });
      expect(res.status).toBe(400);
    });

    it("rejects conditionScore below 1", async () => {
      const res = await app.request("/api/v2/assets/1/conditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conditionScore: 0 }),
      });
      expect(res.status).toBe(400);
    });

    it("rejects non-integer conditionScore", async () => {
      const res = await app.request("/api/v2/assets/1/conditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conditionScore: 2.5 }),
      });
      expect(res.status).toBe(400);
    });

    it("rejects missing conditionScore", async () => {
      const res = await app.request("/api/v2/assets/1/conditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: "no score" }),
      });
      expect(res.status).toBe(400);
    });

    it("rejects invalid source value", async () => {
      const res = await app.request("/api/v2/assets/1/conditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conditionScore: 3, source: "unknown" }),
      });
      expect(res.status).toBe(400);
    });

    it("returns 400 for non-numeric asset ID", async () => {
      const res = await app.request("/api/v2/assets/abc/conditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conditionScore: 4 }),
      });
      expect(res.status).toBe(400);
    });
  });
});
