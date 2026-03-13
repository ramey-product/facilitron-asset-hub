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
import { dashboard } from "./routes/dashboard.js";
import { hierarchies } from "./routes/hierarchies.js";
import { status, statusReasons } from "./routes/status.js";
import { costs, topCosts } from "./routes/costs.js";
import { properties } from "./routes/properties.js";
import { importRoutes } from "./routes/import.js";
import { documents } from "./routes/documents.js";
import { customFields, assetCustomFields } from "./routes/custom-fields.js";
import { fit } from "./routes/fit.js";
import { inventory } from "./routes/inventory.js";
import { stock } from "./routes/stock.js";
import { vendors } from "./routes/vendors.js";
import { consumption, audit } from "./routes/consumption.js";
import { procurement } from "./routes/procurement.js";
import { receiving } from "./routes/receiving.js";
import { alerts } from "./routes/alerts.js";
import { kitting } from "./routes/kitting.js";
import { transfers } from "./routes/transfers.js";
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
// Static/specific asset sub-routes MUST be registered before the generic /assets
// route to prevent /:id from swallowing them.
app.route("/api/v2/assets/costs/top", topCosts);
app.route("/api/v2/assets", hierarchies);
app.route("/api/v2/assets", assets);
app.route("/api/v2/settings", settings);
app.route("/api/v2/manufacturers", manufacturers);
app.route("/api/v2/conditions", conditions);

// Phase 4: Properties / scope filtering
app.route("/api/v2/properties", properties);

// Phase 3: Hub Experience routes
app.route("/api/v2/dashboard", dashboard);
app.route("/api/v2/assets", status);
app.route("/api/v2/assets", costs);
app.route("/api/v2/status-reasons", statusReasons);

// Phase 4: Bulk Import
app.route("/api/v2/import", importRoutes);

// Phase 4: Rich Asset Records (P0-08) — photos, documents, custom fields
app.route("/api/v2/assets", documents);
app.route("/api/v2/custom-fields", customFields);
app.route("/api/v2/assets", assetCustomFields);

// Phase 4: FIT Modal Integration (P0-16)
app.route("/api/v2/assets", fit);

// Phase 5: Inventory Foundation (P1-17, P1-18)
app.route("/api/v2/inventory", inventory);
app.route("/api/v2/stock", stock);

// Phase 5: Vendor Directory (P1-22)
app.route("/api/v2/procurement/vendors", vendors);

// Phase 5: WO Consumption (P1-19)
app.route("/api/v2/consumption", consumption);
app.route("/api/v2/audit/inventory", audit);

// Phase 6: Purchase Orders (P1-21)
// analytics must be registered before /:id to avoid parameter collision
app.route("/api/v2/procurement/orders", procurement);

// Phase 6: PO Receiving (P1-23)
// discrepancies must be registered before /:id
app.route("/api/v2/procurement/receiving", receiving);

// Phase 6: Reorder Alerts (P1-20) — /alerts/* and /reorder-rules/* under inventory namespace
app.route("/api/v2/inventory", alerts);

// Phase 6: Kitting (P1-24) — /kits/* under inventory namespace
app.route("/api/v2/inventory", kitting);

// Phase 6: Inventory Transfers (P1-25)
app.route("/api/v2/inventory", transfers);

// 404 fallback
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

// Error handler
app.onError(errorHandler);

export default app;
