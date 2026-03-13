import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { inventoryOverviewService } from "../services/inventory-overview-service.js";
import type { AppEnv } from "../types/context.js";

const inventoryOverview = new Hono<AppEnv>();

// GET /api/v2/inventory-overview/metrics — portfolio overview metrics
inventoryOverview.get("/metrics", async (c) => {
  const { customerID } = c.get("auth");

  const metrics = await inventoryOverviewService.getOverviewMetrics(customerID);
  return c.json({ data: metrics });
});

// GET /api/v2/inventory-overview/health-score — composite inventory health score
inventoryOverview.get("/health-score", async (c) => {
  const { customerID } = c.get("auth");

  const score = await inventoryOverviewService.getHealthScore(customerID);
  return c.json({ data: score });
});

// GET /api/v2/inventory-overview/search — cross-module search across assets and consumables
const searchQuerySchema = z.object({
  q: z.string().min(1).max(255),
  type: z.enum(["both", "assets", "consumables"]).default("both"),
});

inventoryOverview.get("/search", zValidator("query", searchQuerySchema), async (c) => {
  const { q, type } = c.req.valid("query");
  const { customerID } = c.get("auth");

  const results = await inventoryOverviewService.search(customerID, q, type);
  return c.json({ data: results });
});

export { inventoryOverview };
