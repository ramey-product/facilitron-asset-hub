import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  assetQuerySchema,
  createAssetSchema,
  updateAssetSchema,
  createConditionLogSchema,
  conditionHistoryQuerySchema,
} from "@asset-hub/shared";
import { assetService } from "../services/asset-service.js";
import { conditionService } from "../services/condition-service.js";
import type { AppEnv } from "../types/context.js";

const assets = new Hono<AppEnv>();

// GET /api/v2/assets — list with pagination + filtering
assets.get("/", zValidator("query", assetQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const { customerID } = c.get("auth");

  const result = await assetService.list(customerID, query);
  return c.json({ data: result.items, meta: result.meta });
});

// GET /api/v2/assets/:id — get by ID
assets.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid asset ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const asset = await assetService.getById(customerID, id);
  if (!asset) {
    return c.json({ error: "Asset not found" }, 404);
  }
  return c.json({ data: asset });
});

// POST /api/v2/assets — create
assets.post("/", zValidator("json", createAssetSchema), async (c) => {
  const body = c.req.valid("json");
  const { customerID, contactId } = c.get("auth");

  const asset = await assetService.create(customerID, contactId, {
    equipmentName: body.assetName,
    serialNumber: body.serialNumber,
    manufacturerRecordID: body.manufacturerID,
    modelNumber: body.modelNumber,
    acquisitionDate: body.purchaseDate,
    acquisitionCost: body.purchaseCost,
    warrantyExpiration: body.warrantyExpiration,
    notes: body.notes,
    lifecycleStatus:
      body.assetStatus === "maintenance" ? "UnderMaintenance" : "Active",
    conditionRating: body.assetCondition
      ? conditionToRating(body.assetCondition)
      : undefined,
    propertyID: body.propertyID,
    equipmentTypeID: body.categoryID,
  });
  return c.json({ data: asset }, 201);
});

// PUT /api/v2/assets/:id — update
assets.put("/:id", zValidator("json", updateAssetSchema), async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid asset ID" }, 400);
  }

  const body = c.req.valid("json");
  const { customerID, contactId } = c.get("auth");

  const asset = await assetService.update(customerID, id, contactId, {
    equipmentName: body.assetName,
    serialNumber: body.serialNumber,
    manufacturerRecordID: body.manufacturerID,
    modelNumber: body.modelNumber,
    acquisitionDate: body.purchaseDate,
    acquisitionCost: body.purchaseCost,
    warrantyExpiration: body.warrantyExpiration,
    notes: body.notes,
    lifecycleStatus: body.assetStatus
      ? body.assetStatus === "maintenance"
        ? "UnderMaintenance"
        : capitalizeFirst(body.assetStatus)
      : undefined,
    conditionRating: body.assetCondition
      ? conditionToRating(body.assetCondition)
      : undefined,
    propertyID: body.propertyID,
    equipmentTypeID: body.categoryID,
  });

  if (!asset) {
    return c.json({ error: "Asset not found" }, 404);
  }
  return c.json({ data: asset });
});

// DELETE /api/v2/assets/:id — soft delete (set isActive=false)
assets.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid asset ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const deleted = await assetService.delete(customerID, id);
  if (!deleted) {
    return c.json({ error: "Asset not found" }, 404);
  }
  return c.json({ data: { success: true } });
});

// ---- Condition tracking sub-routes ----

// POST /api/v2/assets/:id/conditions — log a new condition assessment
assets.post(
  "/:id/conditions",
  zValidator("json", createConditionLogSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ error: "Invalid asset ID" }, 400);
    }

    const body = c.req.valid("json");
    const { customerID, contactId } = c.get("auth");

    const log = await conditionService.logCondition(
      customerID,
      id,
      contactId,
      body
    );
    return c.json({ data: log }, 201);
  }
);

// GET /api/v2/assets/:id/conditions/history — condition log history
assets.get(
  "/:id/conditions/history",
  zValidator("query", conditionHistoryQuerySchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ error: "Invalid asset ID" }, 400);
    }

    const query = c.req.valid("query");
    const { customerID } = c.get("auth");

    const result = await conditionService.getHistory(
      customerID,
      id,
      query.limit,
      query.offset
    );
    return c.json({ data: result.items, meta: result.meta });
  }
);

// GET /api/v2/assets/:id/conditions/stats — condition statistics
assets.get("/:id/conditions/stats", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid asset ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const stats = await conditionService.getStats(customerID, id);

  if (!stats) {
    return c.json({ error: "No condition data found for this asset" }, 404);
  }
  return c.json({ data: stats });
});

// Helper: convert condition string to numeric rating
function conditionToRating(condition: string): number {
  const map: Record<string, number> = {
    excellent: 5,
    good: 4,
    fair: 3,
    poor: 2,
    critical: 1,
  };
  return map[condition] ?? 3;
}

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export { assets };
