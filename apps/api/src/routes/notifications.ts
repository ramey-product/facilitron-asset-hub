import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  updatePreferencesSchema,
  listEmailLogQuerySchema,
} from "@asset-hub/shared";
import { notificationService } from "../services/notification-service.js";
import type { AppEnv } from "../types/context.js";

const notifications = new Hono<AppEnv>();

// GET /api/v2/notifications/preferences — get user notification preferences
notifications.get("/preferences", async (c) => {
  const { customerID, contactId } = c.get("auth");

  const prefs = await notificationService.getPreferences(customerID, contactId);
  return c.json({ data: prefs });
});

// PUT /api/v2/notifications/preferences — update user notification preferences
notifications.put(
  "/preferences",
  zValidator("json", updatePreferencesSchema),
  async (c) => {
    const body = c.req.valid("json");
    const { customerID, contactId } = c.get("auth");

    const prefs = await notificationService.updatePreferences(customerID, contactId, body);
    return c.json({ data: prefs });
  }
);

// GET /api/v2/notifications/email-log — list email log with filters and pagination
notifications.get("/email-log", zValidator("query", listEmailLogQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const { customerID } = c.get("auth");

  const result = await notificationService.listEmailLog(customerID, query);
  return c.json({ data: result.items, meta: result.meta });
});

// GET /api/v2/notifications/templates — list notification template definitions
notifications.get("/templates", async (c) => {
  const templates = await notificationService.getTemplates();
  return c.json({ data: templates });
});

export { notifications };
