import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  createPhotoSchema,
  createDocumentSchema,
} from "@asset-hub/shared";
import { documentService } from "../services/document-service.js";
import type { AppEnv } from "../types/context.js";

const documents = new Hono<AppEnv>();

// ---- Photos ----

// GET /api/v2/assets/:id/photos
documents.get("/:id/photos", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid asset ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const photos = await documentService.listPhotos(customerID, id);
  return c.json({ data: photos });
});

// POST /api/v2/assets/:id/photos
documents.post(
  "/:id/photos",
  zValidator("json", createPhotoSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ error: "Invalid asset ID" }, 400);
    }

    const body = c.req.valid("json");
    const { customerID, contactId } = c.get("auth");

    const photo = await documentService.addPhoto(customerID, id, contactId, body);
    return c.json({ data: photo }, 201);
  }
);

// DELETE /api/v2/assets/:id/photos/:photoId
documents.delete("/:id/photos/:photoId", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const photoId = parseInt(c.req.param("photoId"), 10);
  if (isNaN(id) || isNaN(photoId)) {
    return c.json({ error: "Invalid ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const deleted = await documentService.deletePhoto(customerID, id, photoId);
  if (!deleted) {
    return c.json({ error: "Photo not found" }, 404);
  }
  return c.json({ data: { success: true } });
});

// PUT /api/v2/assets/:id/photos/:photoId/primary
documents.put("/:id/photos/:photoId/primary", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const photoId = parseInt(c.req.param("photoId"), 10);
  if (isNaN(id) || isNaN(photoId)) {
    return c.json({ error: "Invalid ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const photo = await documentService.setPrimaryPhoto(customerID, id, photoId);
  if (!photo) {
    return c.json({ error: "Photo not found" }, 404);
  }
  return c.json({ data: photo });
});

// ---- Documents ----

// GET /api/v2/assets/:id/documents
documents.get("/:id/documents", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  if (isNaN(id)) {
    return c.json({ error: "Invalid asset ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const docs = await documentService.listDocuments(customerID, id);
  return c.json({ data: docs });
});

// POST /api/v2/assets/:id/documents
documents.post(
  "/:id/documents",
  zValidator("json", createDocumentSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ error: "Invalid asset ID" }, 400);
    }

    const body = c.req.valid("json");
    const { customerID, contactId } = c.get("auth");

    const doc = await documentService.addDocument(customerID, id, contactId, body);
    return c.json({ data: doc }, 201);
  }
);

// DELETE /api/v2/assets/:id/documents/:docId
documents.delete("/:id/documents/:docId", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const docId = parseInt(c.req.param("docId"), 10);
  if (isNaN(id) || isNaN(docId)) {
    return c.json({ error: "Invalid ID" }, 400);
  }

  const { customerID } = c.get("auth");
  const deleted = await documentService.deleteDocument(customerID, id, docId);
  if (!deleted) {
    return c.json({ error: "Document not found" }, 404);
  }
  return c.json({ data: { success: true } });
});

export { documents };
