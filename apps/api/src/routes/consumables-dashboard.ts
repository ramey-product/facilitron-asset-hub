import { Hono } from "hono";
import { consumablesDashboardService } from "../services/consumables-dashboard-service.js";
import type { AppEnv } from "../types/context.js";

const consumablesDashboard = new Hono<AppEnv>();

// GET /api/v2/consumables-dashboard/kpis — KPI metrics (total parts, value, below reorder, etc.)
consumablesDashboard.get("/kpis", async (c) => {
  const { customerID } = c.get("auth");

  const kpis = await consumablesDashboardService.getKPIs(customerID);
  return c.json({ data: kpis });
});

// GET /api/v2/consumables-dashboard/trends — 12-month usage trends
consumablesDashboard.get("/trends", async (c) => {
  const { customerID } = c.get("auth");

  const trends = await consumablesDashboardService.getUsageTrends(customerID);
  return c.json({ data: trends });
});

// GET /api/v2/consumables-dashboard/activity — last 10 recent events
consumablesDashboard.get("/activity", async (c) => {
  const { customerID } = c.get("auth");

  const activity = await consumablesDashboardService.getRecentActivity(customerID);
  return c.json({ data: activity });
});

export { consumablesDashboard };
