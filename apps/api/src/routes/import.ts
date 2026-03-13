import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  importValidateSchema,
  importExecuteSchema,
  importHistoryQuerySchema,
} from "@asset-hub/shared";
import { importService } from "../services/import-service.js";
import type { AppEnv } from "../types/context.js";

const importRoutes = new Hono<AppEnv>();

// POST /api/v2/import/validate — validate parsed rows against schema and references
importRoutes.post(
  "/validate",
  zValidator("json", importValidateSchema),
  async (c) => {
    const { rows, mapping } = c.req.valid("json");
    const { customerID } = c.get("auth");

    const result = await importService.validateImport(
      customerID,
      rows,
      mapping
    );
    return c.json({ data: result });
  }
);

// POST /api/v2/import/execute — validate and upsert assets from parsed rows
importRoutes.post(
  "/execute",
  zValidator("json", importExecuteSchema),
  async (c) => {
    const { rows, mapping, filename } = c.req.valid("json");
    const { customerID, contactId } = c.get("auth");

    const result = await importService.executeImport(
      customerID,
      contactId,
      filename,
      rows,
      mapping
    );
    return c.json({ data: result }, 201);
  }
);

// GET /api/v2/import/history — paginated import history
importRoutes.get(
  "/history",
  zValidator("query", importHistoryQuerySchema),
  async (c) => {
    const { page, limit } = c.req.valid("query");
    const { customerID } = c.get("auth");

    const result = await importService.getImportHistory(
      customerID,
      page,
      limit
    );
    return c.json({ data: result.items, meta: result.meta });
  }
);

// GET /api/v2/import/template — return importable field definitions
importRoutes.get("/template", async (c) => {
  const fields = importService.getTemplate();
  return c.json({ data: fields });
});

export { importRoutes };
