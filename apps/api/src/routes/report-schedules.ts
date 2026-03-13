import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  createReportScheduleSchema,
  updateReportScheduleSchema,
  listReportSchedulesQuerySchema,
  listReportDeliveriesQuerySchema,
} from "@asset-hub/shared";
import { reportsService } from "../services/reports-service.js";
import type { AppEnv } from "../types/context.js";

const reportSchedules = new Hono<AppEnv>();

// GET /api/v2/reports/schedules — list all schedules
reportSchedules.get(
  "/schedules",
  zValidator("query", listReportSchedulesQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const { customerID } = c.get("auth");
    const result = await reportsService.listSchedules(customerID, query);
    return c.json({ data: result.items, meta: result.meta });
  }
);

// POST /api/v2/reports/schedules — create schedule
reportSchedules.post(
  "/schedules",
  zValidator("json", createReportScheduleSchema),
  async (c) => {
    const body = c.req.valid("json");
    const { customerID } = c.get("auth");
    const schedule = await reportsService.createSchedule(customerID, body);
    return c.json({ data: schedule }, 201);
  }
);

// GET /api/v2/reports/schedules/:id — single schedule
reportSchedules.get("/schedules/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid schedule ID" }, 400);

  const { customerID } = c.get("auth");
  const schedule = await reportsService.getSchedule(customerID, id);
  if (!schedule) return c.json({ error: "Schedule not found" }, 404);
  return c.json({ data: schedule });
});

// PUT /api/v2/reports/schedules/:id — update schedule
reportSchedules.put(
  "/schedules/:id",
  zValidator("json", updateReportScheduleSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) return c.json({ error: "Invalid schedule ID" }, 400);

    const body = c.req.valid("json");
    const { customerID } = c.get("auth");
    const schedule = await reportsService.updateSchedule(customerID, id, body);
    if (!schedule) return c.json({ error: "Schedule not found" }, 404);
    return c.json({ data: schedule });
  }
);

// DELETE /api/v2/reports/schedules/:id — soft delete (deactivate)
reportSchedules.delete("/schedules/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid schedule ID" }, 400);

  const { customerID } = c.get("auth");
  const deleted = await reportsService.deleteSchedule(customerID, id);
  if (!deleted) return c.json({ error: "Schedule not found" }, 404);
  return c.json({ data: { success: true } });
});

// GET /api/v2/reports/deliveries — delivery history
reportSchedules.get(
  "/deliveries",
  zValidator("query", listReportDeliveriesQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const { customerID } = c.get("auth");
    const result = await reportsService.listDeliveries(customerID, query);
    return c.json({ data: result.items, meta: result.meta });
  }
);

// POST /api/v2/reports/deliveries/:id/retry — retry failed delivery
reportSchedules.post("/deliveries/:id/retry", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid delivery ID" }, 400);

  const { customerID } = c.get("auth");
  const delivery = await reportsService.retryDelivery(customerID, id);
  if (!delivery) return c.json({ error: "Delivery not found" }, 404);
  return c.json({ data: delivery });
});

// POST /api/v2/reports/schedules/:id/preview — preview report data
reportSchedules.post("/schedules/:id/preview", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) return c.json({ error: "Invalid schedule ID" }, 400);

  const { customerID } = c.get("auth");
  const preview = await reportsService.previewReport(customerID, id);
  if (!preview) return c.json({ error: "Schedule not found" }, 404);
  return c.json({ data: preview });
});

export { reportSchedules };
