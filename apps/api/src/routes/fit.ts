import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { fitInspectionsQuerySchema } from "@asset-hub/shared";
import { fitService } from "../services/fit-service.js";
import type { AppEnv } from "../types/context.js";

const fit = new Hono<AppEnv>();

// GET /api/v2/assets/:id/fit-summary
fit.get("/:id/fit-summary", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid asset ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const summary = await fitService.getSummary(customerID, id);

  if (!summary) {
    return c.json({ error: "No FIT data found for this asset" }, 404);
  }

  // 5-minute cache header — FIT data is read-only and updates infrequently
  c.header("Cache-Control", "public, max-age=300");
  return c.json({ data: summary });
});

// GET /api/v2/assets/:id/fit-inspections
fit.get(
  "/:id/fit-inspections",
  zValidator("query", fitInspectionsQuerySchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ error: "Invalid asset ID" }, 400);
    }

    const query = c.req.valid("query");
    const { customerID } = c.get("auth");

    const result = await fitService.getInspections(
      customerID,
      id,
      query.page,
      query.limit
    );
    return c.json({ data: result.items, meta: result.meta });
  }
);

export { fit };
