import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  consumptionQuerySchema,
  consumptionForecastQuerySchema,
  auditQuerySchema,
} from "@asset-hub/shared";
import { consumptionService } from "../services/consumption-service.js";
import type { AppEnv } from "../types/context.js";

const consumption = new Hono<AppEnv>();

// GET /api/v2/consumption — list consumption records
consumption.get(
  "/",
  zValidator("query", consumptionQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const { customerID } = c.get("auth");

    const result = await consumptionService.list(customerID, query);
    return c.json({ data: result.items, meta: result.meta });
  }
);

// GET /api/v2/consumption/forecast — stockout forecast for a part
consumption.get(
  "/forecast",
  zValidator("query", consumptionForecastQuerySchema),
  async (c) => {
    const { partId } = c.req.valid("query");
    const { customerID } = c.get("auth");

    const forecast = await consumptionService.getForecast(customerID, partId);
    if (!forecast) {
      return c.json({ error: "Part not found or no consumption data" }, 404);
    }
    return c.json({ data: forecast });
  }
);

// POST /api/v2/consumption/reverse/:id — reverse a consumption record
consumption.post("/reverse/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid consumption record ID" }, 400);
  }

  const { customerID, username } = c.get("auth");
  const reversed = await consumptionService.reverse(
    customerID,
    id,
    username
  );
  if (!reversed) {
    return c.json(
      { error: "Record not found or already reversed" },
      404
    );
  }
  return c.json({ data: reversed });
});

// Audit trail routes — mounted under /api/v2/audit/inventory
const audit = new Hono<AppEnv>();

// GET /api/v2/audit/inventory — inventory adjustment audit trail
audit.get("/", zValidator("query", auditQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const { customerID } = c.get("auth");

  const result = await consumptionService.listAudit(customerID, query);
  return c.json({ data: result.items, meta: result.meta });
});

export { consumption, audit };
