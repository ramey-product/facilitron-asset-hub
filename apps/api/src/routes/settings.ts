import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  updateSettingSchema,
  createCategorySchema,
  updateCategorySchema,
} from "@asset-hub/shared";
import { settingsService } from "../services/settings-service.js";
import type { AppEnv } from "../types/context.js";

const settings = new Hono<AppEnv>();

// GET /api/v2/settings — get all settings for customer
settings.get("/", async (c) => {
  const { customerID } = c.get("auth");
  const result = await settingsService.getAll(customerID);
  return c.json({ data: result });
});

// ---- Category routes BEFORE parameterized /:key route ----

// GET /api/v2/settings/categories — list asset categories
settings.get("/categories", async (c) => {
  const { customerID } = c.get("auth");
  const result = await settingsService.listCategories(customerID);
  return c.json({ data: result });
});

// POST /api/v2/settings/categories — create category
settings.post(
  "/categories",
  zValidator("json", createCategorySchema),
  async (c) => {
    const body = c.req.valid("json");
    const { customerID, contactId } = c.get("auth");

    const result = await settingsService.createCategory(
      customerID,
      contactId,
      body
    );
    return c.json({ data: result }, 201);
  }
);

// PUT /api/v2/settings/categories/:id — update category
settings.put(
  "/categories/:id",
  zValidator("json", updateCategorySchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ error: "Invalid category ID" }, 400);
    }

    const body = c.req.valid("json");
    const { customerID } = c.get("auth");

    const result = await settingsService.updateCategory(customerID, id, body);
    if (!result) {
      return c.json({ error: "Category not found" }, 404);
    }
    return c.json({ data: result });
  }
);

// DELETE /api/v2/settings/categories/:id — soft delete category
settings.delete("/categories/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid category ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const deleted = await settingsService.deleteCategory(customerID, id);
  if (!deleted) {
    return c.json({ error: "Category not found" }, 404);
  }
  return c.json({ data: { success: true } });
});

// PUT /api/v2/settings/:key — update (upsert) a setting
// NOTE: This parameterized route MUST be after specific routes like /categories
settings.put("/:key", zValidator("json", updateSettingSchema), async (c) => {
  const key = c.req.param("key");
  const { value } = c.req.valid("json");
  const { customerID, contactId } = c.get("auth");

  const result = await settingsService.upsert(
    customerID,
    contactId,
    key,
    value
  );
  return c.json({ data: result });
});

export { settings };
