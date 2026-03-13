import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  partQuerySchema,
  createPartSchema,
  updatePartSchema,
  bulkPartIdsSchema,
} from "@asset-hub/shared";
import { inventoryService } from "../services/inventory-service.js";
import type { AppEnv } from "../types/context.js";

const inventory = new Hono<AppEnv>();

// GET /api/v2/inventory — list parts with search, filter, pagination
inventory.get("/", zValidator("query", partQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const { customerID } = c.get("auth");

  const result = await inventoryService.list(customerID, query);
  return c.json({ data: result.items, meta: result.meta });
});

// GET /api/v2/inventory/categories — list categories with part counts
inventory.get("/categories", async (c) => {
  const { customerID } = c.get("auth");

  const categories = await inventoryService.listCategories(customerID);
  return c.json({ data: categories });
});

// POST /api/v2/inventory/bulk-activate — bulk activate parts
inventory.post(
  "/bulk-activate",
  zValidator("json", bulkPartIdsSchema),
  async (c) => {
    const { ids } = c.req.valid("json");
    const { customerID } = c.get("auth");

    const count = await inventoryService.bulkActivate(customerID, ids);
    return c.json({ data: { activated: count } });
  }
);

// POST /api/v2/inventory/bulk-deactivate — bulk deactivate parts
inventory.post(
  "/bulk-deactivate",
  zValidator("json", bulkPartIdsSchema),
  async (c) => {
    const { ids } = c.req.valid("json");
    const { customerID } = c.get("auth");

    const count = await inventoryService.bulkDeactivate(customerID, ids);
    return c.json({ data: { deactivated: count } });
  }
);

// GET /api/v2/inventory/:id — single part detail
inventory.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid part ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const part = await inventoryService.getById(customerID, id);
  if (!part) {
    return c.json({ error: "Part not found" }, 404);
  }
  return c.json({ data: part });
});

// POST /api/v2/inventory — create part
inventory.post("/", zValidator("json", createPartSchema), async (c) => {
  const body = c.req.valid("json");
  const { customerID } = c.get("auth");

  const part = await inventoryService.create(customerID, body);
  return c.json({ data: part }, 201);
});

// PUT /api/v2/inventory/:id — update part
inventory.put("/:id", zValidator("json", updatePartSchema), async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid part ID" }, 400);
  }

  const body = c.req.valid("json");
  const { customerID } = c.get("auth");

  const part = await inventoryService.update(customerID, id, body);
  if (!part) {
    return c.json({ error: "Part not found" }, 404);
  }
  return c.json({ data: part });
});

// DELETE /api/v2/inventory/:id — soft delete (set isActive=false)
inventory.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid part ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const deleted = await inventoryService.delete(customerID, id);
  if (!deleted) {
    return c.json({ error: "Part not found" }, 404);
  }
  return c.json({ data: { success: true } });
});

export { inventory };
