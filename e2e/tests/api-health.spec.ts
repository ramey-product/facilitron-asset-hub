import { test, expect } from "@playwright/test";

const API_BASE = "http://localhost:3001";

/**
 * API health & contract smoke tests.
 * These use Playwright's `request` fixture to call the Hono API directly
 * without loading the browser UI — fast sanity checks on every core endpoint.
 */
test.describe("API Health", () => {
  test("GET /health returns ok", async ({ request }) => {
    const res = await request.get(`${API_BASE}/health`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.status).toBe("ok");
  });

  test("GET /api/v2/assets returns 200 with data array", async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/v2/assets`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("data");
    expect(Array.isArray(body.data)).toBe(true);
    expect(body).toHaveProperty("meta");
    expect(body.meta).toHaveProperty("total");
    expect(body.meta).toHaveProperty("page");
    expect(body.meta).toHaveProperty("limit");
  });

  test("GET /api/v2/assets?page=1&limit=5 respects pagination params", async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/v2/assets?page=1&limit=5`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.length).toBeLessThanOrEqual(5);
    expect(body.meta.page).toBe(1);
    expect(body.meta.limit).toBe(5);
  });

  test("GET /api/v2/assets/:id returns single asset", async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/v2/assets/1`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("equipmentRecordID");
  });

  test("GET /api/v2/assets/99999 returns 404 for missing asset", async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/v2/assets/99999`);
    expect(res.status()).toBe(404);
  });

  test("GET /api/v2/properties returns data array", async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/v2/properties`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("data");
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test("GET /api/v2/dashboard/stats returns KPI data", async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/v2/dashboard/stats`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("data");
    const stats = body.data;
    expect(stats).toHaveProperty("totalAssets");
    expect(stats).toHaveProperty("activeCount");
    expect(typeof stats.totalAssets).toBe("number");
  });

  test("GET /api/v2/dashboard/alerts returns paginated alerts", async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/v2/dashboard/alerts`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("data");
    expect(body).toHaveProperty("meta");
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("GET /api/v2/dashboard/activity returns activity feed", async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/v2/dashboard/activity`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("data");
    expect(Array.isArray(body.data)).toBe(true);
  });
});
