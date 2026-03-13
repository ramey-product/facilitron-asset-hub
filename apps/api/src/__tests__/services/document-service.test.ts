/**
 * Unit tests for documentService.
 */
import { describe, it, expect } from "vitest";
import { documentService } from "../../services/document-service.js";

const CUSTOMER_ID = 1;
const UPLOADED_BY = 1;

// Asset ID 1 is a known active asset (Gym Rooftop Unit #1)
const KNOWN_ASSET_ID = 1;

describe("documentService.listPhotos", () => {
  it("returns photos array for a known asset", async () => {
    const photos = await documentService.listPhotos(CUSTOMER_ID, KNOWN_ASSET_ID);
    expect(Array.isArray(photos)).toBe(true);
    expect(photos.length).toBeGreaterThan(0);
  });

  it("each photo has expected shape", async () => {
    const photos = await documentService.listPhotos(CUSTOMER_ID, KNOWN_ASSET_ID);
    for (const photo of photos) {
      expect(photo).toHaveProperty("id");
      expect(photo).toHaveProperty("assetId");
      expect(photo).toHaveProperty("filename");
      expect(photo).toHaveProperty("url");
      expect(photo).toHaveProperty("mimeType");
      expect(photo).toHaveProperty("sizeBytes");
      expect(photo).toHaveProperty("isPrimary");
      expect(photo).toHaveProperty("uploadedAt");
      expect(photo).toHaveProperty("uploadedBy");
    }
  });

  it("at most one photo is primary per asset", async () => {
    const photos = await documentService.listPhotos(CUSTOMER_ID, KNOWN_ASSET_ID);
    const primaryPhotos = photos.filter((p) => p.isPrimary);
    expect(primaryPhotos.length).toBeLessThanOrEqual(1);
  });

  it("all photos belong to the requested assetId", async () => {
    const photos = await documentService.listPhotos(CUSTOMER_ID, KNOWN_ASSET_ID);
    for (const photo of photos) {
      expect(photo.assetId).toBe(KNOWN_ASSET_ID);
    }
  });

  it("returns empty array for unknown asset", async () => {
    const photos = await documentService.listPhotos(CUSTOMER_ID, 99999);
    expect(photos).toHaveLength(0);
  });
});

describe("documentService.listDocuments", () => {
  it("returns documents array for a known asset", async () => {
    const docs = await documentService.listDocuments(CUSTOMER_ID, KNOWN_ASSET_ID);
    expect(Array.isArray(docs)).toBe(true);
    expect(docs.length).toBeGreaterThan(0);
  });

  it("each document has expected shape", async () => {
    const docs = await documentService.listDocuments(CUSTOMER_ID, KNOWN_ASSET_ID);
    for (const doc of docs) {
      expect(doc).toHaveProperty("id");
      expect(doc).toHaveProperty("assetId");
      expect(doc).toHaveProperty("filename");
      expect(doc).toHaveProperty("url");
      expect(doc).toHaveProperty("mimeType");
      expect(doc).toHaveProperty("sizeBytes");
      expect(doc).toHaveProperty("documentType");
      expect(doc).toHaveProperty("uploadedAt");
      expect(doc).toHaveProperty("uploadedBy");
    }
  });

  it("all documents belong to the requested assetId", async () => {
    const docs = await documentService.listDocuments(CUSTOMER_ID, KNOWN_ASSET_ID);
    for (const doc of docs) {
      expect(doc.assetId).toBe(KNOWN_ASSET_ID);
    }
  });

  it("returns empty array for unknown asset", async () => {
    const docs = await documentService.listDocuments(CUSTOMER_ID, 99999);
    expect(docs).toHaveLength(0);
  });
});

describe("documentService.addPhoto", () => {
  it("adds a photo and returns it with an ID", async () => {
    const photo = await documentService.addPhoto(
      CUSTOMER_ID,
      KNOWN_ASSET_ID,
      UPLOADED_BY,
      {
        filename: "new-photo.jpg",
        mimeType: "image/jpeg",
        sizeBytes: 300_000,
        caption: "Test photo",
      }
    );
    expect(photo.id).toBeGreaterThan(0);
    expect(photo.assetId).toBe(KNOWN_ASSET_ID);
    expect(photo.filename).toBe("new-photo.jpg");
    expect(photo.uploadedBy).toBe(UPLOADED_BY);
  });

  it("newly added photo appears in subsequent listPhotos call", async () => {
    const uniqueFilename = `test-photo-${Date.now()}.jpg`;
    const added = await documentService.addPhoto(
      CUSTOMER_ID,
      KNOWN_ASSET_ID,
      UPLOADED_BY,
      { filename: uniqueFilename, mimeType: "image/jpeg", sizeBytes: 100_000 }
    );
    const photos = await documentService.listPhotos(CUSTOMER_ID, KNOWN_ASSET_ID);
    const found = photos.find((p) => p.id === added.id);
    expect(found).toBeDefined();
    expect(found!.filename).toBe(uniqueFilename);
  });
});

describe("documentService.addDocument", () => {
  it("adds a document and returns it with an ID", async () => {
    const doc = await documentService.addDocument(
      CUSTOMER_ID,
      KNOWN_ASSET_ID,
      UPLOADED_BY,
      {
        filename: "test-manual.pdf",
        mimeType: "application/pdf",
        sizeBytes: 1_000_000,
        documentType: "manual",
        description: "Test manual upload",
      }
    );
    expect(doc.id).toBeGreaterThan(0);
    expect(doc.assetId).toBe(KNOWN_ASSET_ID);
    expect(doc.filename).toBe("test-manual.pdf");
    expect(doc.documentType).toBe("manual");
    expect(doc.uploadedBy).toBe(UPLOADED_BY);
  });

  it("newly added document appears in listDocuments", async () => {
    const uniqueFilename = `test-doc-${Date.now()}.pdf`;
    const added = await documentService.addDocument(
      CUSTOMER_ID,
      KNOWN_ASSET_ID,
      UPLOADED_BY,
      {
        filename: uniqueFilename,
        mimeType: "application/pdf",
        sizeBytes: 500_000,
        documentType: "warranty",
      }
    );
    const docs = await documentService.listDocuments(CUSTOMER_ID, KNOWN_ASSET_ID);
    const found = docs.find((d) => d.id === added.id);
    expect(found).toBeDefined();
  });
});

describe("documentService.deletePhoto", () => {
  it("returns true when deleting an existing photo", async () => {
    const photo = await documentService.addPhoto(
      CUSTOMER_ID,
      KNOWN_ASSET_ID,
      UPLOADED_BY,
      { filename: "to-delete.jpg", mimeType: "image/jpeg", sizeBytes: 50_000 }
    );
    const result = await documentService.deletePhoto(
      CUSTOMER_ID,
      KNOWN_ASSET_ID,
      photo.id
    );
    expect(result).toBe(true);
  });

  it("deleted photo no longer appears in listPhotos", async () => {
    const photo = await documentService.addPhoto(
      CUSTOMER_ID,
      KNOWN_ASSET_ID,
      UPLOADED_BY,
      { filename: "gone-photo.jpg", mimeType: "image/jpeg", sizeBytes: 60_000 }
    );
    await documentService.deletePhoto(CUSTOMER_ID, KNOWN_ASSET_ID, photo.id);
    const photos = await documentService.listPhotos(CUSTOMER_ID, KNOWN_ASSET_ID);
    const found = photos.find((p) => p.id === photo.id);
    expect(found).toBeUndefined();
  });

  it("returns false when deleting a non-existent photo", async () => {
    const result = await documentService.deletePhoto(
      CUSTOMER_ID,
      KNOWN_ASSET_ID,
      99999
    );
    expect(result).toBe(false);
  });
});

describe("documentService.deleteDocument", () => {
  it("returns true when deleting an existing document", async () => {
    const doc = await documentService.addDocument(
      CUSTOMER_ID,
      KNOWN_ASSET_ID,
      UPLOADED_BY,
      {
        filename: "to-delete.pdf",
        mimeType: "application/pdf",
        sizeBytes: 100_000,
        documentType: "manual",
      }
    );
    const result = await documentService.deleteDocument(
      CUSTOMER_ID,
      KNOWN_ASSET_ID,
      doc.id
    );
    expect(result).toBe(true);
  });

  it("returns false for non-existent document", async () => {
    const result = await documentService.deleteDocument(
      CUSTOMER_ID,
      KNOWN_ASSET_ID,
      99999
    );
    expect(result).toBe(false);
  });
});

describe("documentService.setPrimaryPhoto", () => {
  it("sets a photo as primary and returns it", async () => {
    const photos = await documentService.listPhotos(CUSTOMER_ID, KNOWN_ASSET_ID);
    const nonPrimary = photos.find((p) => !p.isPrimary);
    if (!nonPrimary) {
      // All photos are primary or there's only one — add a second one
      const added = await documentService.addPhoto(
        CUSTOMER_ID,
        KNOWN_ASSET_ID,
        UPLOADED_BY,
        {
          filename: "secondary-photo.jpg",
          mimeType: "image/jpeg",
          sizeBytes: 200_000,
        }
      );
      const result = await documentService.setPrimaryPhoto(
        CUSTOMER_ID,
        KNOWN_ASSET_ID,
        added.id
      );
      expect(result).not.toBeNull();
      expect(result!.id).toBe(added.id);
    } else {
      const result = await documentService.setPrimaryPhoto(
        CUSTOMER_ID,
        KNOWN_ASSET_ID,
        nonPrimary.id
      );
      expect(result).not.toBeNull();
      expect(result!.id).toBe(nonPrimary.id);
    }
  });

  it("returns null for non-existent photo ID", async () => {
    const result = await documentService.setPrimaryPhoto(
      CUSTOMER_ID,
      KNOWN_ASSET_ID,
      99999
    );
    expect(result).toBeNull();
  });
});
