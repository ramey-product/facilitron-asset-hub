import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  reportFilterSchema,
  createReportTemplateSchema,
  listReportTemplatesQuerySchema,
} from "@asset-hub/shared";
import { inventoryReportService } from "../services/inventory-report-service.js";
import type { AppEnv } from "../types/context.js";

const inventoryReports = new Hono<AppEnv>();

// POST /api/v2/inventory-reports/generate — generate report data from filter
inventoryReports.post(
  "/generate",
  zValidator("json", reportFilterSchema),
  async (c) => {
    const filter = c.req.valid("json");
    const { customerID } = c.get("auth");

    const report = await inventoryReportService.generateReport(customerID, filter);
    return c.json({ data: report });
  }
);

// GET /api/v2/inventory-reports/templates — list saved report templates
inventoryReports.get(
  "/templates",
  zValidator("query", listReportTemplatesQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const { customerID } = c.get("auth");

    const result = await inventoryReportService.listTemplates(customerID, query);
    return c.json({ data: result.items, meta: result.meta });
  }
);

// GET /api/v2/inventory-reports/templates/:id — single template detail
inventoryReports.get("/templates/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid template ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const template = await inventoryReportService.getTemplate(customerID, id);
  if (!template) {
    return c.json({ error: "Template not found" }, 404);
  }
  return c.json({ data: template });
});

// POST /api/v2/inventory-reports/templates — create saved report template
inventoryReports.post(
  "/templates",
  zValidator("json", createReportTemplateSchema),
  async (c) => {
    const body = c.req.valid("json");
    const { customerID } = c.get("auth");

    const template = await inventoryReportService.createTemplate(customerID, body);
    return c.json({ data: template }, 201);
  }
);

// PUT /api/v2/inventory-reports/templates/:id — update saved report template
inventoryReports.put(
  "/templates/:id",
  zValidator("json", createReportTemplateSchema.partial()),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ error: "Invalid template ID" }, 400);
    }

    const body = c.req.valid("json");
    const { customerID } = c.get("auth");

    const template = await inventoryReportService.updateTemplate(customerID, id, body);
    if (!template) {
      return c.json({ error: "Template not found" }, 404);
    }
    return c.json({ data: template });
  }
);

// DELETE /api/v2/inventory-reports/templates/:id — delete saved report template
inventoryReports.delete("/templates/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid template ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const deleted = await inventoryReportService.deleteTemplate(customerID, id);
  if (!deleted) {
    return c.json({ error: "Template not found" }, 404);
  }
  return c.json({ data: { success: true } });
});

export { inventoryReports };
