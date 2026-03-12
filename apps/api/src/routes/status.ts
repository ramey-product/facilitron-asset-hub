import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  statusChangeSchema,
  statusHistoryQuerySchema,
} from "@asset-hub/shared";
import { statusService } from "../services/status-service.js";
import type { AppEnv } from "../types/context.js";

const status = new Hono<AppEnv>();

// GET /api/v2/assets/:id/status — current operational status
status.get("/:id/status", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid asset ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const record = await statusService.getStatus(customerID, id);
  if (!record) {
    return c.json({ error: "Asset not found" }, 404);
  }
  return c.json({ data: record });
});

// PUT /api/v2/assets/:id/status — toggle status
status.put(
  "/:id/status",
  zValidator("json", statusChangeSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ error: "Invalid asset ID" }, 400);
    }

    const body = c.req.valid("json");
    const { customerID, contactId } = c.get("auth");

    const record = await statusService.updateStatus(
      customerID,
      id,
      body.status,
      body.reasonCode,
      body.notes,
      contactId
    );

    if (!record) {
      return c.json({ error: "Asset not found" }, 404);
    }
    return c.json({ data: record });
  }
);

// GET /api/v2/assets/:id/status-history — paginated status changes
status.get(
  "/:id/status-history",
  zValidator("query", statusHistoryQuerySchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ error: "Invalid asset ID" }, 400);
    }

    const query = c.req.valid("query");
    const { customerID } = c.get("auth");

    const result = await statusService.getHistory(
      customerID,
      id,
      query.page,
      query.limit
    );
    return c.json({ data: result.items, meta: result.meta });
  }
);

// GET /api/v2/status-reasons — list all reason codes
// Note: This is registered at the /api/v2/status-reasons path in app.ts
const statusReasons = new Hono<AppEnv>();

statusReasons.get("/", async (c) => {
  const reasons = statusService.getReasons();
  return c.json({ data: reasons });
});

export { status, statusReasons };
