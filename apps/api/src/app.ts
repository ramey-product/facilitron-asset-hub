import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authMiddleware } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error-handler.js";
import { health } from "./routes/health.js";
import { assets } from "./routes/assets.js";
import { settings } from "./routes/settings.js";
import { manufacturers } from "./routes/manufacturers.js";
import { conditions } from "./routes/conditions.js";
import type { AppEnv } from "./types/context.js";

const app = new Hono<AppEnv>();

// Logging
app.use("*", logger());

// CORS — allow Next.js dev server
const corsOrigin = process.env["CORS_ORIGIN"] ?? "http://localhost:3000";
app.use(
  "*",
  cors({
    origin: corsOrigin,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Auth middleware — injects auth context on every request
app.use("*", authMiddleware);

// Routes — health at root level
app.route("/health", health);

// Routes — API v2 namespace
app.route("/api/v2/assets", assets);
app.route("/api/v2/settings", settings);
app.route("/api/v2/manufacturers", manufacturers);
app.route("/api/v2/conditions", conditions);

// 404 fallback
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

// Error handler
app.onError(errorHandler);

export default app;
