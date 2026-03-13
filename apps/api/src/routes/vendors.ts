import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  vendorQuerySchema,
  createVendorSchema,
  updateVendorSchema,
  vendorCompareSchema,
} from "@asset-hub/shared";
import { vendorService } from "../services/vendor-service.js";
import type { AppEnv } from "../types/context.js";

const vendors = new Hono<AppEnv>();

// GET /api/v2/procurement/vendors/compare — compare 2-5 vendors
// Must be registered BEFORE /:id to avoid parameter collision
vendors.get(
  "/compare",
  zValidator("query", vendorCompareSchema),
  async (c) => {
    const { ids } = c.req.valid("query");
    const { customerID } = c.get("auth");

    const result = await vendorService.compareVendors(customerID, ids);
    return c.json({ data: result });
  }
);

// GET /api/v2/procurement/vendors — list with search, filter, pagination
vendors.get("/", zValidator("query", vendorQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const { customerID } = c.get("auth");

  const result = await vendorService.list(customerID, query);
  return c.json({ data: result.items, meta: result.meta });
});

// GET /api/v2/procurement/vendors/:id — single vendor detail
vendors.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid vendor ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const vendor = await vendorService.getById(customerID, id);
  if (!vendor) {
    return c.json({ error: "Vendor not found" }, 404);
  }
  return c.json({ data: vendor });
});

// POST /api/v2/procurement/vendors — create
vendors.post("/", zValidator("json", createVendorSchema), async (c) => {
  const body = c.req.valid("json");
  const { customerID } = c.get("auth");

  const vendor = await vendorService.create(customerID, body);
  return c.json({ data: vendor }, 201);
});

// PUT /api/v2/procurement/vendors/:id — update
vendors.put("/:id", zValidator("json", updateVendorSchema), async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid vendor ID" }, 400);
  }

  const body = c.req.valid("json");
  const { customerID } = c.get("auth");

  const vendor = await vendorService.update(customerID, id, body);
  if (!vendor) {
    return c.json({ error: "Vendor not found" }, 404);
  }
  return c.json({ data: vendor });
});

// DELETE /api/v2/procurement/vendors/:id — soft delete
vendors.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid vendor ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const deleted = await vendorService.delete(customerID, id);
  if (!deleted) {
    return c.json({ error: "Vendor not found" }, 404);
  }
  return c.json({ data: { success: true } });
});

// GET /api/v2/procurement/vendors/:id/performance — performance metrics
vendors.get("/:id/performance", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid vendor ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const performance = await vendorService.getPerformance(customerID, id);
  if (!performance) {
    return c.json({ error: "Vendor not found or no performance data" }, 404);
  }
  return c.json({ data: performance });
});

export { vendors };
