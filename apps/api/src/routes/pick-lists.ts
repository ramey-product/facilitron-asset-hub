import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  listPickListsQuerySchema,
  createPickListSchema,
} from "@asset-hub/shared";
import { pickListService } from "../services/pick-list-service.js";
import type { AppEnv } from "../types/context.js";

const pickLists = new Hono<AppEnv>();

// GET /api/v2/pick-lists — list pick lists with filters and pagination
pickLists.get("/", zValidator("query", listPickListsQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const { customerID } = c.get("auth");

  const result = await pickListService.listPickLists(customerID, query);
  return c.json({ data: result.items, meta: result.meta });
});

// GET /api/v2/pick-lists/:id — single pick list with items
pickLists.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid pick list ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const pickList = await pickListService.getPickList(customerID, id);
  if (!pickList) {
    return c.json({ error: "Pick list not found" }, 404);
  }
  return c.json({ data: pickList });
});

// POST /api/v2/pick-lists — create new pick list
pickLists.post("/", zValidator("json", createPickListSchema), async (c) => {
  const body = c.req.valid("json");
  const { customerID } = c.get("auth");

  const pickList = await pickListService.createPickList(customerID, body);
  return c.json({ data: pickList }, 201);
});

// PATCH /api/v2/pick-lists/:id/items/:itemId — update picked quantity for an item
const updateItemSchema = z.object({
  quantityPicked: z.number().int().min(0),
});

pickLists.patch(
  "/:id/items/:itemId",
  zValidator("json", updateItemSchema),
  async (c) => {
    const pickListId = parseInt(c.req.param("id"), 10);
    const itemId = parseInt(c.req.param("itemId"), 10);
    if (isNaN(pickListId) || isNaN(itemId)) {
      return c.json({ error: "Invalid ID" }, 400);
    }

    const body = c.req.valid("json");
    const { customerID } = c.get("auth");

    const item = await pickListService.updateItem(customerID, pickListId, itemId, body);
    if (!item) {
      return c.json({ error: "Pick list or item not found" }, 404);
    }
    return c.json({ data: item });
  }
);

// POST /api/v2/pick-lists/:id/complete — complete pick list and allocate
pickLists.post("/:id/complete", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid pick list ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const pickList = await pickListService.completePickList(customerID, id);
  if (!pickList) {
    return c.json({ error: "Pick list not found or already completed" }, 404);
  }
  return c.json({ data: pickList });
});

export { pickLists };
