import { Hono } from "hono";
import { conditionService } from "../services/condition-service.js";
import type { AppEnv } from "../types/context.js";

const conditions = new Hono<AppEnv>();

// GET /api/v2/conditions/scale — condition scale definitions
conditions.get("/scale", async (c) => {
  const { customerID } = c.get("auth");
  const scale = await conditionService.getScale(customerID);
  return c.json({ data: scale });
});

export { conditions };
