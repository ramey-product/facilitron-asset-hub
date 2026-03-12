import { describe, it, expect } from "vitest";
import app from "../app.js";

describe("Health endpoint", () => {
  it("GET /health returns 200 with status ok", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { status: string };
    expect(body.status).toBe("ok");
  });

  it("GET /unknown returns 404", async () => {
    const res = await app.request("/unknown-route-that-does-not-exist");
    expect(res.status).toBe(404);
  });
});
