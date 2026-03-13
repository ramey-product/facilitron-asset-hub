import { mockDocumentProvider } from "../db/mock/documents.js";
import type {
  DocumentProvider,
} from "../types/providers.js";
import type {
  CreatePhotoInput,
  CreateDocumentInput,
} from "@asset-hub/shared";

const getProvider = (): DocumentProvider => {
  // When real DB is connected, swap to drizzle provider:
  // if (process.env["DATA_SOURCE"] === "drizzle") return drizzleDocumentProvider;
  return mockDocumentProvider;
};

export const documentService = {
  async listPhotos(customerID: number, assetId: number) {
    const provider = getProvider();
    return provider.listPhotos(customerID, assetId);
  },

  async addPhoto(
    customerID: number,
    assetId: number,
    uploadedBy: number,
    data: CreatePhotoInput
  ) {
    const provider = getProvider();
    return provider.addPhoto(customerID, assetId, uploadedBy, data);
  },

  async deletePhoto(customerID: number, assetId: number, photoId: number) {
    const provider = getProvider();
    return provider.deletePhoto(customerID, assetId, photoId);
  },

  async setPrimaryPhoto(
    customerID: number,
    assetId: number,
    photoId: number
  ) {
    const provider = getProvider();
    return provider.setPrimaryPhoto(customerID, assetId, photoId);
  },

  async listDocuments(customerID: number, assetId: number) {
    const provider = getProvider();
    return provider.listDocuments(customerID, assetId);
  },

  async addDocument(
    customerID: number,
    assetId: number,
    uploadedBy: number,
    data: CreateDocumentInput
  ) {
    const provider = getProvider();
    return provider.addDocument(customerID, assetId, uploadedBy, data);
  },

  async deleteDocument(customerID: number, assetId: number, docId: number) {
    const provider = getProvider();
    return provider.deleteDocument(customerID, assetId, docId);
  },
};
