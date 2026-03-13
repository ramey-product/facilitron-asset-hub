import type {
  AssetPhoto,
  AssetDocument,
  CreatePhotoInput,
  CreateDocumentInput,
} from "@asset-hub/shared";
import type { DocumentProvider } from "../../types/providers.js";
import { mockAssets } from "./data/assets.js";

// ---- Seed data: generate photos and documents for each active asset ----

const photoTemplates: { filename: string; caption: string }[] = [
  { filename: "front-view.jpg", caption: "Front view" },
  { filename: "nameplate.jpg", caption: "Manufacturer nameplate / data plate" },
  { filename: "installation.jpg", caption: "Installation location" },
];

const docTemplates: {
  filename: string;
  documentType: AssetDocument["documentType"];
  description: string;
  mimeType: string;
}[] = [
  {
    filename: "installation-manual.pdf",
    documentType: "manual",
    description: "Original equipment installation and operation manual",
    mimeType: "application/pdf",
  },
  {
    filename: "warranty-certificate.pdf",
    documentType: "warranty",
    description: "Manufacturer warranty certificate",
    mimeType: "application/pdf",
  },
];

// Build initial photo/document arrays for customerID=1 active assets
const activeAssetIds = mockAssets
  .filter((a) => a.customerID === 1 && a.isActive)
  .map((a) => a.equipmentRecordID);

let nextPhotoId = 1;
let nextDocId = 1;

const photos: AssetPhoto[] = [];
const documents: AssetDocument[] = [];

for (const assetId of activeAssetIds) {
  // 2-3 photos per asset
  const photoCount = assetId % 3 === 0 ? 3 : 2;
  for (let i = 0; i < photoCount; i++) {
    const template = photoTemplates[i % photoTemplates.length]!;
    photos.push({
      id: nextPhotoId++,
      assetId,
      filename: `asset-${assetId}-${template.filename}`,
      url: `https://placeholder.asset-hub.dev/photos/asset-${assetId}/${template.filename}`,
      thumbnailUrl: `https://placeholder.asset-hub.dev/photos/asset-${assetId}/thumb-${template.filename}`,
      mimeType: "image/jpeg",
      sizeBytes: 250_000 + Math.floor(Math.random() * 750_000),
      isPrimary: i === 0,
      caption: template.caption,
      uploadedAt: "2025-06-15T10:00:00.000Z",
      uploadedBy: 1,
    });
  }

  // 1-2 documents per asset
  const docCount = assetId % 2 === 0 ? 2 : 1;
  for (let i = 0; i < docCount; i++) {
    const template = docTemplates[i % docTemplates.length]!;
    documents.push({
      id: nextDocId++,
      assetId,
      filename: `asset-${assetId}-${template.filename}`,
      url: `https://placeholder.asset-hub.dev/docs/asset-${assetId}/${template.filename}`,
      mimeType: template.mimeType,
      sizeBytes: 500_000 + Math.floor(Math.random() * 2_000_000),
      documentType: template.documentType,
      description: template.description,
      uploadedAt: "2025-06-15T10:00:00.000Z",
      uploadedBy: 1,
    });
  }
}

export const mockDocumentProvider: DocumentProvider = {
  async listPhotos(_customerID: number, assetId: number): Promise<AssetPhoto[]> {
    return photos.filter((p) => p.assetId === assetId);
  },

  async addPhoto(
    _customerID: number,
    assetId: number,
    uploadedBy: number,
    data: CreatePhotoInput
  ): Promise<AssetPhoto> {
    const existingPhotos = photos.filter((p) => p.assetId === assetId);
    const newPhoto: AssetPhoto = {
      id: nextPhotoId++,
      assetId,
      filename: data.filename,
      url: `https://placeholder.asset-hub.dev/photos/asset-${assetId}/${data.filename}`,
      thumbnailUrl: `https://placeholder.asset-hub.dev/photos/asset-${assetId}/thumb-${data.filename}`,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
      isPrimary: existingPhotos.length === 0, // first photo is primary
      caption: data.caption,
      uploadedAt: new Date().toISOString(),
      uploadedBy,
    };
    photos.push(newPhoto);
    return newPhoto;
  },

  async deletePhoto(
    _customerID: number,
    assetId: number,
    photoId: number
  ): Promise<boolean> {
    const idx = photos.findIndex(
      (p) => p.id === photoId && p.assetId === assetId
    );
    if (idx === -1) return false;
    const wasPrimary = photos[idx]!.isPrimary;
    photos.splice(idx, 1);

    // If deleted photo was primary, promote the next one
    if (wasPrimary) {
      const remaining = photos.filter((p) => p.assetId === assetId);
      if (remaining.length > 0) {
        remaining[0]!.isPrimary = true;
      }
    }
    return true;
  },

  async setPrimaryPhoto(
    _customerID: number,
    assetId: number,
    photoId: number
  ): Promise<AssetPhoto | null> {
    const target = photos.find(
      (p) => p.id === photoId && p.assetId === assetId
    );
    if (!target) return null;

    // Clear existing primary
    for (const p of photos) {
      if (p.assetId === assetId) {
        p.isPrimary = p.id === photoId;
      }
    }
    return target;
  },

  async listDocuments(
    _customerID: number,
    assetId: number
  ): Promise<AssetDocument[]> {
    return documents.filter((d) => d.assetId === assetId);
  },

  async addDocument(
    _customerID: number,
    assetId: number,
    uploadedBy: number,
    data: CreateDocumentInput
  ): Promise<AssetDocument> {
    const newDoc: AssetDocument = {
      id: nextDocId++,
      assetId,
      filename: data.filename,
      url: `https://placeholder.asset-hub.dev/docs/asset-${assetId}/${data.filename}`,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
      documentType: data.documentType,
      description: data.description,
      uploadedAt: new Date().toISOString(),
      uploadedBy,
    };
    documents.push(newDoc);
    return newDoc;
  },

  async deleteDocument(
    _customerID: number,
    assetId: number,
    docId: number
  ): Promise<boolean> {
    const idx = documents.findIndex(
      (d) => d.id === docId && d.assetId === assetId
    );
    if (idx === -1) return false;
    documents.splice(idx, 1);
    return true;
  },
};
