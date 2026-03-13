import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  listPurchaseOrdersSchema,
  createPurchaseOrderSchema,
  updatePurchaseOrderSchema,
  approvePoSchema,
} from "@asset-hub/shared";
import { procurementService } from "../services/procurement-service.js";
import type { AppEnv } from "../types/context.js";

const procurement = new Hono<AppEnv>();

// GET /api/v2/procurement/orders/analytics — spend analytics (BEFORE /:id)
procurement.get("/analytics", async (c) => {
  const { customerID } = c.get("auth");
  const analytics = await procurementService.getSpendAnalytics(customerID);
  return c.json({ data: analytics });
});

// GET /api/v2/procurement/orders — list POs
procurement.get(
  "/",
  zValidator("query", listPurchaseOrdersSchema),
  async (c) => {
    const query = c.req.valid("query");
    const { customerID } = c.get("auth");

    const result = await procurementService.list(customerID, query);
    return c.json({ data: result.items, meta: result.meta });
  }
);

// POST /api/v2/procurement/orders — create PO
procurement.post(
  "/",
  zValidator("json", createPurchaseOrderSchema),
  async (c) => {
    const body = c.req.valid("json");
    const { customerID } = c.get("auth");

    const po = await procurementService.create(customerID, body);
    return c.json({ data: po }, 201);
  }
);

// GET /api/v2/procurement/orders/:id — get PO
procurement.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid PO ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const po = await procurementService.getById(customerID, id);
  if (!po) {
    return c.json({ error: "Purchase order not found" }, 404);
  }
  return c.json({ data: po });
});

// PUT /api/v2/procurement/orders/:id — update PO (Draft only)
procurement.put(
  "/:id",
  zValidator("json", updatePurchaseOrderSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ error: "Invalid PO ID" }, 400);
    }

    const body = c.req.valid("json");
    const { customerID } = c.get("auth");

    const po = await procurementService.update(customerID, id, body);
    if (!po) {
      return c.json({ error: "Purchase order not found or cannot be edited in its current status" }, 404);
    }
    return c.json({ data: po });
  }
);

// POST /api/v2/procurement/orders/:id/submit — Draft → Submitted
procurement.post("/:id/submit", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid PO ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const po = await procurementService.submit(customerID, id);
  if (!po) {
    return c.json({ error: "Purchase order not found or is not in Draft status" }, 400);
  }
  return c.json({ data: po });
});

// POST /api/v2/procurement/orders/:id/approve — Submitted → Approved
procurement.post(
  "/:id/approve",
  zValidator("json", approvePoSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ error: "Invalid PO ID" }, 400);
    }

    const { approvedBy } = c.req.valid("json");
    const { customerID } = c.get("auth");

    const result = await procurementService.approve(customerID, id, approvedBy);
    if ("error" in result) {
      return c.json({ error: result.error }, 400);
    }
    return c.json({ data: result });
  }
);

// POST /api/v2/procurement/orders/:id/cancel — cancel PO
procurement.post("/:id/cancel", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid PO ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const po = await procurementService.cancel(customerID, id);
  if (!po) {
    return c.json({ error: "Purchase order not found or cannot be cancelled in its current status" }, 400);
  }
  return c.json({ data: po });
});

// POST /api/v2/procurement/orders/:id/mark-ordered — Approved → Ordered
procurement.post("/:id/mark-ordered", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid PO ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const po = await procurementService.getById(customerID, id);
  if (!po) return c.json({ error: "Purchase order not found" }, 404);
  if (po.status !== "Approved") {
    return c.json({ error: "Only Approved purchase orders can be marked as Ordered" }, 400);
  }

  const now = new Date().toISOString();
  // Direct in-place mutation of the mock object (mock only — Drizzle would use a proper UPDATE)
  (po as { status: string }).status = "Ordered";
  (po as { orderedAt: string | null }).orderedAt = now;
  (po as { updatedAt: string }).updatedAt = now;

  return c.json({ data: po });
});

export { procurement };
