import type { Context } from "hono";
import type { ApiError } from "@asset-hub/shared";
import { HTTPException } from "hono/http-exception";

export function errorHandler(err: Error, c: Context) {
  console.error("[API Error]", err);

  // Hono HTTP exceptions (thrown by middleware, validators)
  if (err instanceof HTTPException) {
    const response: ApiError = {
      error: err.message || "Request error",
    };
    return c.json(response, err.status);
  }

  // Known business logic errors (duplicate, not found, validation)
  if (err.message.includes("already exists")) {
    return c.json({ error: err.message } satisfies ApiError, 409);
  }
  if (err.message.includes("not found")) {
    return c.json({ error: err.message } satisfies ApiError, 404);
  }
  if (
    err.message.includes("Invalid") ||
    err.message.includes("required") ||
    err.message.includes("must be")
  ) {
    return c.json({ error: err.message } satisfies ApiError, 400);
  }

  // Fallback: unexpected server errors
  const response: ApiError = {
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error",
  };
  return c.json(response, 500);
}
