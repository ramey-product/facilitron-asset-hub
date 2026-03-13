import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  createLifecycleEventSchema,
  listLifecycleEventsQuerySchema,
  lifecycleForecastQuerySchema,
} from "@asset-hub/shared";
import { lifecycleService } from "../services/lifecycle-service.js";
import type { AppEnv } from "../types/context.js";

const lifecycle = new Hono<AppEnv>();

// GET /api/v2/analytics/lifecycle — lifecycle KPIs
lifecycle.get("/", async (c) => {
  const { customerID } = c.get("auth");
  const kpis = await lifecycleService.getLifecycleKPIs(customerID);
  return c.json({ data: kpis });
});

// GET /api/v2/analytics/lifecycle/forecast — EOL forecast
lifecycle.get("/forecast", zValidator("query", lifecycleForecastQuerySchema), async (c) => {
  const { years } = c.req.valid("query");
  const { customerID } = c.get("auth");
  const forecast = await lifecycleService.getLifecycleForecast(customerID, years);
  return c.json({ data: forecast });
});

// GET /api/v2/analytics/lifecycle/compliance — compliance report
lifecycle.get("/compliance", async (c) => {
  const { customerID } = c.get("auth");
  const report = await lifecycleService.getComplianceReport(customerID);
  return c.json({ data: report });
});

export { lifecycle };

// Separate sub-router for asset-scoped lifecycle routes
// These are mounted under /api/v2/assets in app.ts
const assetLifecycle = new Hono<AppEnv>();

// GET /api/v2/assets/:assetId/lifecycle — lifecycle events for specific asset
assetLifecycle.get(
  "/:assetId/lifecycle",
  zValidator("query", listLifecycleEventsQuerySchema),
  async (c) => {
    const assetId = parseInt(c.req.param("assetId"), 10);
    if (isNaN(assetId)) return c.json({ error: "Invalid asset ID" }, 400);

    const { customerID } = c.get("auth");
    const events = await lifecycleService.getAssetLifecycleEvents(customerID, assetId);
    return c.json({ data: events });
  }
);

// POST /api/v2/assets/:assetId/lifecycle — log lifecycle transition
assetLifecycle.post(
  "/:assetId/lifecycle",
  zValidator("json", createLifecycleEventSchema),
  async (c) => {
    const assetId = parseInt(c.req.param("assetId"), 10);
    if (isNaN(assetId)) return c.json({ error: "Invalid asset ID" }, 400);

    const body = c.req.valid("json");
    const { customerID } = c.get("auth");

    const event = await lifecycleService.createLifecycleEvent(customerID, {
      ...body,
      assetId,
    });
    return c.json({ data: event }, 201);
  }
);

export { assetLifecycle };
