import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  dashboardStatsQuerySchema,
  dashboardAlertsQuerySchema,
  dashboardActivityQuerySchema,
} from "@asset-hub/shared";
import { dashboardService } from "../services/dashboard-service.js";
import type { AppEnv } from "../types/context.js";

const dashboard = new Hono<AppEnv>();

// GET /api/v2/dashboard/stats — summary KPIs
dashboard.get(
  "/stats",
  zValidator("query", dashboardStatsQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const { customerID } = c.get("auth");
    const stats = await dashboardService.getStats(customerID, query.propertyId);
    return c.json({ data: stats });
  }
);

// GET /api/v2/dashboard/alerts — paginated alerts
dashboard.get(
  "/alerts",
  zValidator("query", dashboardAlertsQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const { customerID } = c.get("auth");

    const result = await dashboardService.getAlerts(
      customerID,
      query.type,
      query.page,
      query.limit,
      query.propertyId
    );
    return c.json({ data: result.items, meta: result.meta });
  }
);

// GET /api/v2/dashboard/activity — recent activity feed
dashboard.get(
  "/activity",
  zValidator("query", dashboardActivityQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const { customerID } = c.get("auth");

    const result = await dashboardService.getActivity(
      customerID,
      query.page,
      query.limit,
      query.propertyId
    );
    return c.json({ data: result.items, meta: result.meta });
  }
);

export { dashboard };
