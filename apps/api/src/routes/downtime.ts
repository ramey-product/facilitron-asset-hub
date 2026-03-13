import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  createDowntimeEventSchema,
  listDowntimeEventsSchema,
  downtimeStatsSchema,
} from "@asset-hub/shared";
import { downtimeService } from "../services/downtime-service.js";
import type { AppEnv } from "../types/context.js";

const downtime = new Hono<AppEnv>();

// GET /api/v2/assets/:assetId/downtime — events list
downtime.get(
  "/:assetId/downtime",
  zValidator("query", listDowntimeEventsSchema),
  async (c) => {
    const assetId = parseInt(c.req.param("assetId"), 10);
    if (isNaN(assetId)) return c.json({ error: "Invalid asset ID" }, 400);

    const query = c.req.valid("query");
    const { customerID } = c.get("auth");

    const result = await downtimeService.getDowntimeEvents(customerID, assetId, query);
    return c.json({ data: result.items, meta: result.meta });
  }
);

// GET /api/v2/assets/:assetId/downtime/stats — MTBF/MTTR stats
downtime.get(
  "/:assetId/downtime/stats",
  zValidator("query", downtimeStatsSchema),
  async (c) => {
    const assetId = parseInt(c.req.param("assetId"), 10);
    if (isNaN(assetId)) return c.json({ error: "Invalid asset ID" }, 400);

    const { window } = c.req.valid("query");
    const { customerID } = c.get("auth");

    const result = await downtimeService.getDowntimeStats(customerID, assetId, window);
    return c.json({ data: result });
  }
);

// POST /api/v2/assets/:assetId/downtime — create event
downtime.post(
  "/:assetId/downtime",
  zValidator("json", createDowntimeEventSchema),
  async (c) => {
    const assetId = parseInt(c.req.param("assetId"), 10);
    if (isNaN(assetId)) return c.json({ error: "Invalid asset ID" }, 400);

    const body = c.req.valid("json");
    const { customerID } = c.get("auth");

    const event = await downtimeService.createDowntimeEvent(customerID, assetId, body);
    return c.json({ data: event }, 201);
  }
);

export { downtime };

// Separate router for the resolve endpoint (not under /assets/:id)
const downtimeResolve = new Hono<AppEnv>();

// POST /api/v2/downtime/:eventId/resolve — resolve event
downtimeResolve.post("/:eventId/resolve", async (c) => {
  const eventId = parseInt(c.req.param("eventId"), 10);
  if (isNaN(eventId)) return c.json({ error: "Invalid event ID" }, 400);

  const { customerID } = c.get("auth");
  const result = await downtimeService.resolveDowntimeEvent(customerID, eventId);
  if (!result) return c.json({ error: "Event not found" }, 404);
  return c.json({ data: result });
});

export { downtimeResolve };

// Reliability overview (analytics namespace)
const reliability = new Hono<AppEnv>();

// GET /api/v2/analytics/reliability — all assets reliability overview
reliability.get("/reliability", async (c) => {
  const { customerID } = c.get("auth");
  const result = await downtimeService.getReliabilityOverview(customerID);
  return c.json({ data: result });
});

export { reliability };
