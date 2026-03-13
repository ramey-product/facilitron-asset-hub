import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { listTransfersQuerySchema, createTransferSchema } from "@asset-hub/shared";
import { transfersService } from "../services/transfers-service.js";
import type { AppEnv } from "../types/context.js";

const transfers = new Hono<AppEnv>();

// GET /api/v2/inventory/transfers — list transfers
transfers.get("/transfers", zValidator("query", listTransfersQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const { customerID } = c.get("auth");

  const result = await transfersService.list(customerID, query);
  return c.json({ data: result.items, meta: result.meta });
});

// POST /api/v2/inventory/transfers — create transfer
transfers.post("/transfers", zValidator("json", createTransferSchema), async (c) => {
  const body = c.req.valid("json");
  const { customerID, contactId } = c.get("auth");

  const transfer = await transfersService.create(customerID, body, contactId);
  return c.json({ data: transfer }, 201);
});

// GET /api/v2/inventory/transfers/:id — transfer detail
transfers.get("/transfers/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid transfer ID" }, 400);

  const { customerID } = c.get("auth");
  const transfer = await transfersService.getById(customerID, id);
  if (!transfer) return c.json({ error: "Transfer not found" }, 404);

  return c.json({ data: transfer });
});

// POST /api/v2/inventory/transfers/:id/approve — approve transfer
transfers.post("/transfers/:id/approve", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid transfer ID" }, 400);

  const { customerID, contactId } = c.get("auth");
  const transfer = await transfersService.approve(customerID, id, contactId);
  if (!transfer) return c.json({ error: "Transfer not found or cannot be approved" }, 404);

  return c.json({ data: transfer });
});

// POST /api/v2/inventory/transfers/:id/ship — ship transfer (Approved → InTransit)
transfers.post("/transfers/:id/ship", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid transfer ID" }, 400);

  const { customerID } = c.get("auth");
  const transfer = await transfersService.ship(customerID, id);
  if (!transfer) return c.json({ error: "Transfer not found or cannot be shipped" }, 404);

  return c.json({ data: transfer });
});

// POST /api/v2/inventory/transfers/:id/receive — receive transfer (InTransit → Received)
transfers.post("/transfers/:id/receive", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid transfer ID" }, 400);

  const { customerID } = c.get("auth");
  const transfer = await transfersService.receive(customerID, id);
  if (!transfer) return c.json({ error: "Transfer not found or cannot be received" }, 404);

  return c.json({ data: transfer });
});

// POST /api/v2/inventory/transfers/:id/cancel — cancel transfer
transfers.post("/transfers/:id/cancel", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid transfer ID" }, 400);

  const { customerID } = c.get("auth");
  const transfer = await transfersService.cancel(customerID, id);
  if (!transfer) return c.json({ error: "Transfer not found or cannot be cancelled" }, 404);

  return c.json({ data: transfer });
});

export { transfers };
