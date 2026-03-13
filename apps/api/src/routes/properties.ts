import { Hono } from "hono";
import { propertyService } from "../services/property-service.js";
import type { AppEnv } from "../types/context.js";

const properties = new Hono<AppEnv>();

// GET /api/v2/properties — list all properties for the customer
properties.get("/", async (c) => {
  const { customerID } = c.get("auth");
  const data = await propertyService.getProperties(customerID);
  return c.json({ data });
});

export { properties };
