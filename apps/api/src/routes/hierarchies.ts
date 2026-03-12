import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { reparentSchema, bulkReparentSchema } from "@asset-hub/shared";
import { hierarchyService } from "../services/hierarchy-service.js";
import type { AppEnv } from "../types/context.js";

const hierarchies = new Hono<AppEnv>();

// GET /api/v2/assets/:id/tree — full subtree
hierarchies.get("/:id/tree", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid asset ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const tree = await hierarchyService.getTree(customerID, id);
  if (!tree) {
    return c.json({ error: "Asset not found" }, 404);
  }
  return c.json({ data: tree });
});

// GET /api/v2/assets/:id/rollup — aggregated descendant metrics
hierarchies.get("/:id/rollup", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid asset ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const rollup = await hierarchyService.getRollup(customerID, id);
  if (!rollup) {
    return c.json({ error: "Asset not found" }, 404);
  }
  return c.json({ data: rollup });
});

// PUT /api/v2/assets/:id/parent — reparent an asset
hierarchies.put(
  "/:id/parent",
  zValidator("json", reparentSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ error: "Invalid asset ID" }, 400);
    }

    const body = c.req.valid("json");
    const { customerID, contactId } = c.get("auth");

    const result = await hierarchyService.reparent(
      customerID,
      id,
      body.parentEquipmentId,
      contactId
    );

    if (!result.success) {
      return c.json({ error: result.error ?? "Reparent failed" }, 400);
    }
    return c.json({ data: { success: true } });
  }
);

// POST /api/v2/assets/bulk-reparent — batch reparent
hierarchies.post(
  "/bulk-reparent",
  zValidator("json", bulkReparentSchema),
  async (c) => {
    const body = c.req.valid("json");
    const { customerID, contactId } = c.get("auth");

    const result = await hierarchyService.bulkReparent(
      customerID,
      body.items.map((item) => ({
        assetId: item.assetId,
        newParentId: item.newParentId,
      })),
      contactId
    );
    return c.json({ data: result });
  }
);

export { hierarchies };
