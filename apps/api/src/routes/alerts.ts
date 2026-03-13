import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  listAlertsQuerySchema,
  createReorderRuleSchema,
  updateReorderRuleSchema,
} from "@asset-hub/shared";
import { alertsService } from "../services/alerts-service.js";
import type { AppEnv } from "../types/context.js";

const alerts = new Hono<AppEnv>();

// GET /api/v2/inventory/alerts — list reorder alerts
alerts.get("/alerts", zValidator("query", listAlertsQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const { customerID } = c.get("auth");

  const result = await alertsService.listAlerts(customerID, query);
  return c.json({ data: result.items, meta: result.meta });
});

// POST /api/v2/inventory/alerts/:id/dismiss — dismiss an alert
alerts.post("/alerts/:id/dismiss", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid alert ID" }, 400);

  const { customerID, contactId } = c.get("auth");
  const alert = await alertsService.dismissAlert(customerID, id, contactId);
  if (!alert) return c.json({ error: "Alert not found or already dismissed" }, 404);

  return c.json({ data: alert });
});

// POST /api/v2/inventory/alerts/:id/convert-to-po — convert alert to PO
alerts.post("/alerts/:id/convert-to-po", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid alert ID" }, 400);

  const { customerID } = c.get("auth");
  const result = await alertsService.convertToPO(customerID, id);
  if (!result) return c.json({ error: "Alert not found or not eligible for PO conversion" }, 404);

  return c.json({ data: result });
});

// GET /api/v2/inventory/reorder-rules — list all rules
alerts.get("/reorder-rules", async (c) => {
  const { customerID } = c.get("auth");
  const rules = await alertsService.listRules(customerID);
  return c.json({ data: rules });
});

// POST /api/v2/inventory/reorder-rules — create rule
alerts.post("/reorder-rules", zValidator("json", createReorderRuleSchema), async (c) => {
  const body = c.req.valid("json");
  const { customerID } = c.get("auth");

  const rule = await alertsService.createRule(customerID, body);
  return c.json({ data: rule }, 201);
});

// PUT /api/v2/inventory/reorder-rules/:id — update rule
alerts.put("/reorder-rules/:id", zValidator("json", updateReorderRuleSchema), async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid rule ID" }, 400);

  const body = c.req.valid("json");
  const { customerID } = c.get("auth");

  const rule = await alertsService.updateRule(customerID, id, body);
  if (!rule) return c.json({ error: "Reorder rule not found" }, 404);

  return c.json({ data: rule });
});

// DELETE /api/v2/inventory/reorder-rules/:id — delete rule
alerts.delete("/reorder-rules/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid rule ID" }, 400);

  const { customerID } = c.get("auth");
  const deleted = await alertsService.deleteRule(customerID, id);
  if (!deleted) return c.json({ error: "Reorder rule not found" }, 404);

  return c.json({ data: { success: true } });
});

export { alerts };
