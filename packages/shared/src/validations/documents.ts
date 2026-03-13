import { z } from "zod";

// ---- Photo schemas ----

export const createPhotoSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1),
  sizeBytes: z.coerce.number().int().positive(),
  caption: z.string().max(500).optional(),
});

// ---- Document schemas ----

export const createDocumentSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1),
  sizeBytes: z.coerce.number().int().positive(),
  documentType: z.enum(["manual", "warranty", "inspection", "invoice", "other"]),
  description: z.string().max(1000).optional(),
});
