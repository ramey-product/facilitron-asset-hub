import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  listReceivingSchema,
  createReceivingSchema,
} from "@asset-hub/shared";
import { receivingService } from "../services/receiving-service.js";
import type { AppEnv } from "../types/context.js";

const receiving = new Hono<AppEnv>();

// GET /api/v2/procurement/receiving/discrepancies — receiving records with rejections (BEFORE /:id)
receiving.get("/discrepancies", async (c) => {
  const { customerID } = c.get("auth");
  const records = await receivingService.getDiscrepancies(customerID);
  return c.json({ data: records });
});

// GET /api/v2/procurement/receiving — list receiving records
receiving.get(
  "/",
  zValidator("query", listReceivingSchema),
  async (c) => {
    const query = c.req.valid("query");
    const { customerID } = c.get("auth");

    const result = await receivingService.list(customerID, query);
    return c.json({ data: result.items, meta: result.meta });
  }
);

// POST /api/v2/procurement/receiving — create receiving record
receiving.post(
  "/",
  zValidator("json", createReceivingSchema),
  async (c) => {
    const body = c.req.valid("json");
    const { customerID } = c.get("auth");

    const result = await receivingService.create(customerID, body);
    if ("error" in result) {
      return c.json({ error: result.error }, 400);
    }
    return c.json({ data: result }, 201);
  }
);

// GET /api/v2/procurement/receiving/:id — get receiving record
receiving.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid receiving record ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const record = await receivingService.getById(customerID, id);
  if (!record) {
    return c.json({ error: "Receiving record not found" }, 404);
  }
  return c.json({ data: record });
});

export { receiving };
