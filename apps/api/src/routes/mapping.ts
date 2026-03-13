import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  listFloorPlansQuerySchema,
  createAssetPinSchema,
  updateAssetPinSchema,
  mapFilterSchema,
} from "@asset-hub/shared";
import { mappingService } from "../services/mapping-service.js";
import type { AppEnv } from "../types/context.js";

const mapping = new Hono<AppEnv>();

// GET /api/v2/maps — list floor plans, optionally filtered by propertyId
mapping.get("/", zValidator("query", listFloorPlansQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const { customerID } = c.get("auth");

  const result = await mappingService.listFloorPlans(customerID, query);
  return c.json({ data: result.items, meta: result.meta });
});

// GET /api/v2/maps/:mapId — single floor plan with all pins
mapping.get("/:mapId", async (c) => {
  const mapId = parseInt(c.req.param("mapId"), 10);
  if (isNaN(mapId)) {
    return c.json({ error: "Invalid map ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const fp = await mappingService.getFloorPlan(customerID, mapId);
  if (!fp) {
    return c.json({ error: "Floor plan not found" }, 404);
  }
  return c.json({ data: fp });
});

// GET /api/v2/maps/:mapId/pins — filtered pins for a floor plan
mapping.get("/:mapId/pins", zValidator("query", mapFilterSchema), async (c) => {
  const mapId = parseInt(c.req.param("mapId"), 10);
  if (isNaN(mapId)) {
    return c.json({ error: "Invalid map ID" }, 400);
  }

  const filter = c.req.valid("query");
  const { customerID } = c.get("auth");

  const pins = await mappingService.getAssetPins(customerID, mapId, filter);
  return c.json({ data: pins });
});

// POST /api/v2/maps/:mapId/pins — place a new asset pin on the floor plan
mapping.post("/:mapId/pins", zValidator("json", createAssetPinSchema), async (c) => {
  const mapId = parseInt(c.req.param("mapId"), 10);
  if (isNaN(mapId)) {
    return c.json({ error: "Invalid map ID" }, 400);
  }

  const body = c.req.valid("json");
  const { customerID } = c.get("auth");

  const pin = await mappingService.createAssetPin(customerID, mapId, body);
  if (!pin) {
    return c.json({ error: "Floor plan not found" }, 404);
  }
  return c.json({ data: pin }, 201);
});

// PUT /api/v2/maps/pins/:pinId — update pin position or icon
mapping.put("/pins/:pinId", zValidator("json", updateAssetPinSchema), async (c) => {
  const pinId = parseInt(c.req.param("pinId"), 10);
  if (isNaN(pinId)) {
    return c.json({ error: "Invalid pin ID" }, 400);
  }

  const body = c.req.valid("json");
  const { customerID } = c.get("auth");

  const pin = await mappingService.updateAssetPin(customerID, pinId, body);
  if (!pin) {
    return c.json({ error: "Pin not found" }, 404);
  }
  return c.json({ data: pin });
});

// DELETE /api/v2/maps/pins/:pinId — remove pin from map
mapping.delete("/pins/:pinId", async (c) => {
  const pinId = parseInt(c.req.param("pinId"), 10);
  if (isNaN(pinId)) {
    return c.json({ error: "Invalid pin ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const deleted = await mappingService.deleteAssetPin(customerID, pinId);
  if (!deleted) {
    return c.json({ error: "Pin not found" }, 404);
  }
  return c.json({ data: { success: true } });
});

export { mapping };
