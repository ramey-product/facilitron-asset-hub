import app from "@asset-hub/api/app";

// Forward all HTTP methods to the Hono app.
// The [[...path]] catch-all matches /api, /api/v2/assets, /api/v2/assets/123, etc.
// Hono's app.fetch() uses the Web Standard Request/Response API — same as Next.js Route Handlers.
export const GET = (req: Request) => app.fetch(req);
export const POST = (req: Request) => app.fetch(req);
export const PUT = (req: Request) => app.fetch(req);
export const PATCH = (req: Request) => app.fetch(req);
export const DELETE = (req: Request) => app.fetch(req);
