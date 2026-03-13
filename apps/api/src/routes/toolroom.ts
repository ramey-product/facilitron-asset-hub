import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  listCheckoutsQuerySchema,
  createCheckoutSchema,
  returnToolSchema,
} from "@asset-hub/shared";
import { toolroomService } from "../services/toolroom-service.js";
import type { AppEnv } from "../types/context.js";

const toolroom = new Hono<AppEnv>();

// GET /api/v2/toolroom — list checkouts with filters and pagination
toolroom.get("/", zValidator("query", listCheckoutsQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const { customerID } = c.get("auth");

  const result = await toolroomService.listCheckouts(customerID, query);
  return c.json({ data: result.items, meta: result.meta });
});

// GET /api/v2/toolroom/stats — toolroom statistics
toolroom.get("/stats", async (c) => {
  const { customerID } = c.get("auth");

  const stats = await toolroomService.getStats(customerID);
  return c.json({ data: stats });
});

// POST /api/v2/toolroom/checkout — create new tool checkout
toolroom.post("/checkout", zValidator("json", createCheckoutSchema), async (c) => {
  const body = c.req.valid("json");
  const { customerID } = c.get("auth");

  const checkout = await toolroomService.checkoutTool(customerID, body);
  return c.json({ data: checkout }, 201);
});

// POST /api/v2/toolroom/:id/return — record tool return
toolroom.post("/:id/return", zValidator("json", returnToolSchema), async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid checkout ID" }, 400);
  }

  const body = c.req.valid("json");
  const { customerID } = c.get("auth");

  const checkout = await toolroomService.returnTool(customerID, id, body);
  if (!checkout) {
    return c.json({ error: "Checkout not found or already returned" }, 404);
  }
  return c.json({ data: checkout });
});

export { toolroom };
