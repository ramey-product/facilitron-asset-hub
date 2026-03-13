import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  createMeterReadingSchema,
  updateMeterThresholdSchema,
  listMeterReadingsSchema,
} from "@asset-hub/shared";
import { metersService } from "../services/meters-service.js";
import type { AppEnv } from "../types/context.js";

const meters = new Hono<AppEnv>();

// GET /api/v2/assets/:assetId/meters — all meters for asset
meters.get("/:assetId/meters", async (c) => {
  const assetId = parseInt(c.req.param("assetId"), 10);
  if (isNaN(assetId)) return c.json({ error: "Invalid asset ID" }, 400);

  const { customerID } = c.get("auth");
  const result = await metersService.getAssetMeters(customerID, assetId);
  return c.json({ data: result });
});

// POST /api/v2/assets/:assetId/meters/:meterId/readings — new reading
meters.post(
  "/:assetId/meters/:meterId/readings",
  zValidator("json", createMeterReadingSchema),
  async (c) => {
    const assetId = parseInt(c.req.param("assetId"), 10);
    const meterId = parseInt(c.req.param("meterId"), 10);
    if (isNaN(assetId) || isNaN(meterId)) return c.json({ error: "Invalid ID" }, 400);

    const body = c.req.valid("json");
    const { customerID } = c.get("auth");

    const reading = await metersService.createReading(customerID, meterId, body);
    return c.json({ data: reading }, 201);
  }
);

// GET /api/v2/assets/:assetId/meters/:meterId/history — reading history
meters.get(
  "/:assetId/meters/:meterId/history",
  zValidator("query", listMeterReadingsSchema),
  async (c) => {
    const assetId = parseInt(c.req.param("assetId"), 10);
    const meterId = parseInt(c.req.param("meterId"), 10);
    if (isNaN(assetId) || isNaN(meterId)) return c.json({ error: "Invalid ID" }, 400);

    const query = c.req.valid("query");
    const { customerID } = c.get("auth");

    const result = await metersService.getMeterHistory(customerID, meterId, query);
    return c.json({ data: result.items, meta: result.meta });
  }
);

// GET /api/v2/assets/:assetId/meters/:meterId/thresholds — thresholds for meter
meters.get("/:assetId/meters/:meterId/thresholds", async (c) => {
  const assetId = parseInt(c.req.param("assetId"), 10);
  const meterId = parseInt(c.req.param("meterId"), 10);
  if (isNaN(assetId) || isNaN(meterId)) return c.json({ error: "Invalid ID" }, 400);

  const { customerID } = c.get("auth");
  const result = await metersService.getThresholds(customerID, meterId);
  return c.json({ data: result });
});

// PUT /api/v2/assets/:assetId/meters/:meterId/threshold/:thresholdId — update threshold
meters.put(
  "/:assetId/meters/:meterId/threshold/:thresholdId",
  zValidator("json", updateMeterThresholdSchema),
  async (c) => {
    const assetId = parseInt(c.req.param("assetId"), 10);
    const meterId = parseInt(c.req.param("meterId"), 10);
    const thresholdId = parseInt(c.req.param("thresholdId"), 10);
    if (isNaN(assetId) || isNaN(meterId) || isNaN(thresholdId)) return c.json({ error: "Invalid ID" }, 400);

    const body = c.req.valid("json");
    const { customerID } = c.get("auth");

    const result = await metersService.updateThreshold(customerID, meterId, thresholdId, body);
    if (!result) return c.json({ error: "Threshold not found" }, 404);
    return c.json({ data: result });
  }
);

export { meters };

// Separate router for the meter alerts dashboard (not under /assets/:id)
const meterAlerts = new Hono<AppEnv>();

// GET /api/v2/meters/alerts — all alerts across all assets
meterAlerts.get("/alerts", async (c) => {
  const { customerID } = c.get("auth");
  const result = await metersService.getMeterAlerts(customerID);
  return c.json({ data: result });
});

export { meterAlerts };
