import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  listKitsQuerySchema,
  createKitSchema,
  updateKitSchema,
  kitCheckoutSchema,
} from "@asset-hub/shared";
import { kittingService } from "../services/kitting-service.js";
import type { AppEnv } from "../types/context.js";

const kitting = new Hono<AppEnv>();

// GET /api/v2/inventory/kits — list kits (must be before /:id)
kitting.get("/kits", zValidator("query", listKitsQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const { customerID } = c.get("auth");

  const result = await kittingService.list(customerID, query);
  return c.json({ data: result.items, meta: result.meta });
});

// POST /api/v2/inventory/kits — create kit
kitting.post("/kits", zValidator("json", createKitSchema), async (c) => {
  const body = c.req.valid("json");
  const { customerID } = c.get("auth");

  const kit = await kittingService.create(customerID, body);
  return c.json({ data: kit }, 201);
});

// GET /api/v2/inventory/kits/:id — kit detail
kitting.get("/kits/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid kit ID" }, 400);

  const { customerID } = c.get("auth");
  const kit = await kittingService.getById(customerID, id);
  if (!kit) return c.json({ error: "Kit not found" }, 404);

  return c.json({ data: kit });
});

// PUT /api/v2/inventory/kits/:id — update kit
kitting.put("/kits/:id", zValidator("json", updateKitSchema), async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid kit ID" }, 400);

  const body = c.req.valid("json");
  const { customerID } = c.get("auth");

  const kit = await kittingService.update(customerID, id, body);
  if (!kit) return c.json({ error: "Kit not found" }, 404);

  return c.json({ data: kit });
});

// DELETE /api/v2/inventory/kits/:id — soft delete kit
kitting.delete("/kits/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid kit ID" }, 400);

  const { customerID } = c.get("auth");
  const deleted = await kittingService.delete(customerID, id);
  if (!deleted) return c.json({ error: "Kit not found" }, 404);

  return c.json({ data: { success: true } });
});

// POST /api/v2/inventory/kits/:id/checkout — checkout kit
kitting.post("/kits/:id/checkout", zValidator("json", kitCheckoutSchema), async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid kit ID" }, 400);

  const body = c.req.valid("json");
  const { customerID } = c.get("auth");

  // Ensure kitId in body matches URL param
  const result = await kittingService.checkout(customerID, { ...body, kitId: id });
  return c.json({ data: result });
});

export { kitting };
