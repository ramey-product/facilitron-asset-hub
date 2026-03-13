import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { tcoQuerySchema } from "@asset-hub/shared";
import { tcoService } from "../services/tco-service.js";
import type { AppEnv } from "../types/context.js";

// Asset-scoped TCO route
const tcoAsset = new Hono<AppEnv>();

// GET /api/v2/assets/:assetId/tco — single asset TCO
tcoAsset.get("/:assetId/tco", async (c) => {
  const assetId = parseInt(c.req.param("assetId"), 10);
  if (isNaN(assetId)) return c.json({ error: "Invalid asset ID" }, 400);

  const { customerID } = c.get("auth");
  const result = await tcoService.getAssetTCO(customerID, assetId);
  if (!result) return c.json({ error: "TCO record not found for this asset" }, 404);
  return c.json({ data: result });
});

export { tcoAsset };

// Analytics-namespace TCO routes
const tco = new Hono<AppEnv>();

// GET /api/v2/analytics/tco — comparison view
tco.get("/tco", zValidator("query", tcoQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const { customerID } = c.get("auth");
  const result = await tcoService.getTCOComparison(customerID, query);
  return c.json({ data: result });
});

// GET /api/v2/analytics/tco/repair-vs-replace — replacement candidates
tco.get("/tco/repair-vs-replace", async (c) => {
  const { customerID } = c.get("auth");
  const result = await tcoService.getRepairVsReplace(customerID);
  return c.json({ data: result });
});

export { tco };
