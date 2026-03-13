import { Hono } from "hono";
import { depreciationService } from "../services/depreciation-service.js";
import type { AppEnv } from "../types/context.js";

// Asset-scoped depreciation routes
const depreciationAsset = new Hono<AppEnv>();

// GET /api/v2/assets/:assetId/depreciation — single asset
depreciationAsset.get("/:assetId/depreciation", async (c) => {
  const assetId = parseInt(c.req.param("assetId"), 10);
  if (isNaN(assetId)) return c.json({ error: "Invalid asset ID" }, 400);

  const { customerID } = c.get("auth");
  const result = await depreciationService.getAssetDepreciation(customerID, assetId);
  if (!result) return c.json({ error: "Depreciation record not found" }, 404);
  return c.json({ data: result });
});

// GET /api/v2/assets/:assetId/depreciation/schedule — year-by-year
depreciationAsset.get("/:assetId/depreciation/schedule", async (c) => {
  const assetId = parseInt(c.req.param("assetId"), 10);
  if (isNaN(assetId)) return c.json({ error: "Invalid asset ID" }, 400);

  const { customerID } = c.get("auth");
  const result = await depreciationService.getDepreciationSchedule(customerID, assetId);
  return c.json({ data: result });
});

export { depreciationAsset };

// Analytics-namespace depreciation routes
const depreciation = new Hono<AppEnv>();

// GET /api/v2/analytics/depreciation — summary dashboard
depreciation.get("/depreciation", async (c) => {
  const { customerID } = c.get("auth");
  const result = await depreciationService.getDepreciationSummary(customerID);
  return c.json({ data: result });
});

// GET /api/v2/analytics/depreciation/register — fixed asset register
depreciation.get("/depreciation/register", async (c) => {
  const { customerID } = c.get("auth");
  const result = await depreciationService.getFixedAssetRegister(customerID);
  return c.json({ data: result });
});

export { depreciation };
