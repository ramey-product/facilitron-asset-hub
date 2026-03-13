import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  listTransactionsQuerySchema,
  createTransactionSchema,
} from "@asset-hub/shared";
import { warehouseService } from "../services/warehouse-service.js";
import type { AppEnv } from "../types/context.js";

const warehouse = new Hono<AppEnv>();

// GET /api/v2/warehouse — list transactions with filters and pagination
warehouse.get("/", zValidator("query", listTransactionsQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const { customerID } = c.get("auth");

  const result = await warehouseService.listTransactions(customerID, query);
  return c.json({ data: result.items, meta: result.meta });
});

// GET /api/v2/warehouse/stats — warehouse statistics (volume, turnover, shrinkage)
warehouse.get("/stats", async (c) => {
  const { customerID } = c.get("auth");

  const stats = await warehouseService.getStats(customerID);
  return c.json({ data: stats });
});

// POST /api/v2/warehouse — create new transaction
warehouse.post("/", zValidator("json", createTransactionSchema), async (c) => {
  const body = c.req.valid("json");
  const { customerID, username } = c.get("auth");

  const txn = await warehouseService.createTransaction(customerID, username, body);
  return c.json({ data: txn }, 201);
});

export { warehouse };
