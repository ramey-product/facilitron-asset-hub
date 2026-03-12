import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  costHistoryQuerySchema,
  topCostAssetsQuerySchema,
} from "@asset-hub/shared";
import { costService } from "../services/cost-service.js";
import type { AppEnv } from "../types/context.js";

const costs = new Hono<AppEnv>();

// GET /api/v2/assets/:id/costs — lifetime cost summary
costs.get("/:id/costs", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid asset ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const summary = await costService.getCostSummary(customerID, id);
  if (!summary) {
    return c.json({ error: "Asset not found" }, 404);
  }
  return c.json({ data: summary });
});

// GET /api/v2/assets/:id/costs/history — monthly breakdown
costs.get(
  "/:id/costs/history",
  zValidator("query", costHistoryQuerySchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ error: "Invalid asset ID" }, 400);
    }

    const query = c.req.valid("query");
    const { customerID } = c.get("auth");

    const history = await costService.getCostHistory(
      customerID,
      id,
      query.months
    );
    return c.json({ data: history });
  }
);

// GET /api/v2/assets/costs/top — top N highest-cost assets
// Note: This must be registered BEFORE the /:id routes to avoid conflict
const topCosts = new Hono<AppEnv>();

topCosts.get(
  "/",
  zValidator("query", topCostAssetsQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const { customerID } = c.get("auth");

    const results = await costService.getTopCostAssets(
      customerID,
      query.limit
    );
    return c.json({ data: results });
  }
);

export { costs, topCosts };
