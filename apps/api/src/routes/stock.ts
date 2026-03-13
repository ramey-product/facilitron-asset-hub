import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  stockAdjustSchema,
  stockRollupQuerySchema,
  stockAlertQuerySchema,
} from "@asset-hub/shared";
import { stockService } from "../services/stock-service.js";
import type { AppEnv } from "../types/context.js";

const stock = new Hono<AppEnv>();

// GET /api/v2/stock/rollup — system-wide stock rollup (paginated, filterable)
// NOTE: Must be registered before /:partId to prevent route collision
stock.get("/rollup", zValidator("query", stockRollupQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const { customerID } = c.get("auth");

  const result = await stockService.getRollup(customerID, query);
  return c.json({ data: result.items, meta: result.meta });
});

// GET /api/v2/stock/alerts — parts below reorder point
stock.get("/alerts", zValidator("query", stockAlertQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const { customerID } = c.get("auth");

  const result = await stockService.getAlerts(customerID, query);
  return c.json({ data: result.items, meta: result.meta });
});

// GET /api/v2/stock/:partId — stock levels per location for a part
stock.get("/:partId", async (c) => {
  const partId = parseInt(c.req.param("partId"), 10);
  if (isNaN(partId)) {
    return c.json({ error: "Invalid part ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const levels = await stockService.getStockLevels(customerID, partId);
  return c.json({ data: levels });
});

// PUT /api/v2/stock/:partId/:locationId — adjust stock at a location
stock.put(
  "/:partId/:locationId",
  zValidator("json", stockAdjustSchema),
  async (c) => {
    const partId = parseInt(c.req.param("partId"), 10);
    const locationId = parseInt(c.req.param("locationId"), 10);
    if (isNaN(partId) || isNaN(locationId)) {
      return c.json({ error: "Invalid part ID or location ID" }, 400);
    }

    const body = c.req.valid("json");
    const { customerID, contactId } = c.get("auth");

    const level = await stockService.adjustStock(
      customerID,
      partId,
      locationId,
      contactId,
      body
    );

    if (!level) {
      return c.json(
        { error: "Stock record not found for this part/location combination" },
        404
      );
    }
    return c.json({ data: level });
  }
);

export { stock };
