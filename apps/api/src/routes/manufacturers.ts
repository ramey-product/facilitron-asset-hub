import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  manufacturerSearchSchema,
  createManufacturerSchema,
  modelSearchSchema,
  createModelSchema,
} from "@asset-hub/shared";
import { manufacturerService } from "../services/manufacturer-service.js";
import type { AppEnv } from "../types/context.js";

const manufacturers = new Hono<AppEnv>();

// GET /api/v2/manufacturers?q= — typeahead search
manufacturers.get(
  "/",
  zValidator("query", manufacturerSearchSchema),
  async (c) => {
    const { q } = c.req.valid("query");
    const { customerID } = c.get("auth");

    const result = await manufacturerService.search(customerID, q);
    return c.json({ data: result });
  }
);

// GET /api/v2/manufacturers/:id — get by ID
manufacturers.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid manufacturer ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const manufacturer = await manufacturerService.getById(customerID, id);
  if (!manufacturer) {
    return c.json({ error: "Manufacturer not found" }, 404);
  }
  return c.json({ data: manufacturer });
});

// GET /api/v2/manufacturers/:id/models?q= — models for manufacturer
manufacturers.get(
  "/:id/models",
  zValidator("query", modelSearchSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ error: "Invalid manufacturer ID" }, 400);
    }

    const { q } = c.req.valid("query");
    const { customerID } = c.get("auth");

    const result = await manufacturerService.getModels(customerID, id, q);
    return c.json({ data: result });
  }
);

// POST /api/v2/manufacturers — create custom manufacturer
manufacturers.post(
  "/",
  zValidator("json", createManufacturerSchema),
  async (c) => {
    const body = c.req.valid("json");
    const { customerID } = c.get("auth");

    const result = await manufacturerService.create(customerID, body);
    return c.json({ data: result }, 201);
  }
);

// POST /api/v2/manufacturers/:id/models — create model for manufacturer
manufacturers.post(
  "/:id/models",
  zValidator("json", createModelSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ error: "Invalid manufacturer ID" }, 400);
    }

    const body = c.req.valid("json");
    const { customerID } = c.get("auth");

    // Verify manufacturer exists first
    const mfr = await manufacturerService.getById(customerID, id);
    if (!mfr) {
      return c.json({ error: "Manufacturer not found" }, 404);
    }

    const result = await manufacturerService.createModel(customerID, id, body);
    return c.json({ data: result }, 201);
  }
);

export { manufacturers };
