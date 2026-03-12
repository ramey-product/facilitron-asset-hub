import { createMiddleware } from "hono/factory";
import type { AppEnv, AuthContext } from "../types/context.js";

/**
 * Mock auth middleware.
 * Injects a hardcoded auth context into every request.
 * Swap this out for a real .NET cookie bridge when connecting to production.
 */
export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const mockAuth: AuthContext = {
    customerID: 1,
    contactId: 1,
    username: "demo.user",
    roles: ["OrderAdministrator"],
  };

  c.set("auth", mockAuth);
  await next();
});
