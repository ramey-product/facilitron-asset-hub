import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  createCustomFieldDefinitionSchema,
  updateCustomFieldDefinitionSchema,
  updateCustomFieldValuesSchema,
} from "@asset-hub/shared";
import { customFieldService } from "../services/custom-field-service.js";
import type { AppEnv } from "../types/context.js";

const customFields = new Hono<AppEnv>();

// ---- Definitions (org-scoped) ----

// GET /api/v2/custom-fields — list definitions for customer
customFields.get("/", async (c) => {
  const { customerID } = c.get("auth");
  const definitions = await customFieldService.listDefinitions(customerID);
  return c.json({ data: definitions });
});

// POST /api/v2/custom-fields — create definition
customFields.post(
  "/",
  zValidator("json", createCustomFieldDefinitionSchema),
  async (c) => {
    const body = c.req.valid("json");
    const { customerID } = c.get("auth");

    const definition = await customFieldService.createDefinition(
      customerID,
      body
    );
    return c.json({ data: definition }, 201);
  }
);

// PUT /api/v2/custom-fields/:id — update definition
customFields.put(
  "/:id",
  zValidator("json", updateCustomFieldDefinitionSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ error: "Invalid custom field ID" }, 400);
    }

    const body = c.req.valid("json");
    const { customerID } = c.get("auth");

    const definition = await customFieldService.updateDefinition(
      customerID,
      id,
      body
    );
    if (!definition) {
      return c.json({ error: "Custom field definition not found" }, 404);
    }
    return c.json({ data: definition });
  }
);

// DELETE /api/v2/custom-fields/:id — deactivate
customFields.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid custom field ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const deleted = await customFieldService.deleteDefinition(customerID, id);
  if (!deleted) {
    return c.json({ error: "Custom field definition not found" }, 404);
  }
  return c.json({ data: { success: true } });
});

// ---- Asset-scoped custom field values ----

const assetCustomFields = new Hono<AppEnv>();

// GET /api/v2/assets/:id/custom-fields — get values for asset
assetCustomFields.get("/:id/custom-fields", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid asset ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const values = await customFieldService.getAssetValues(customerID, id);
  return c.json({ data: values });
});

// PUT /api/v2/assets/:id/custom-fields — update values for asset
assetCustomFields.put(
  "/:id/custom-fields",
  zValidator("json", updateCustomFieldValuesSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ error: "Invalid asset ID" }, 400);
    }

    const body = c.req.valid("json");
    const { customerID } = c.get("auth");

    const values = await customFieldService.updateAssetValues(
      customerID,
      id,
      body
    );
    return c.json({ data: values });
  }
);

export { customFields, assetCustomFields };
