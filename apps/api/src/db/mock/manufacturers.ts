import type {
  ManufacturerProvider,
  ManufacturerRecord,
  ManufacturerModelRecord,
  CreateManufacturerInput,
  CreateModelInput,
} from "../../types/providers.js";
import {
  mockManufacturers,
  mockManufacturerModels,
} from "./data/manufacturers.js";

// Working copies for in-memory mutations
const manufacturers = [...mockManufacturers];
let nextManufacturerId =
  Math.max(...manufacturers.map((m) => m.manufacturerRecordID)) + 1;

const models = [...mockManufacturerModels];
let nextModelId = Math.max(...models.map((m) => m.id)) + 1;

export const mockManufacturerProvider: ManufacturerProvider = {
  async search(
    customerID: number,
    query: string
  ): Promise<ManufacturerRecord[]> {
    const q = query.toLowerCase();
    return manufacturers
      .filter(
        (m) =>
          m.customerID === customerID &&
          m.isActive &&
          m.manufacturerName.toLowerCase().includes(q)
      )
      .slice(0, 20);
  },

  async getById(
    customerID: number,
    id: number
  ): Promise<ManufacturerRecord | null> {
    return (
      manufacturers.find(
        (m) =>
          m.customerID === customerID && m.manufacturerRecordID === id
      ) ?? null
    );
  },

  async getModels(
    customerID: number,
    manufacturerId: number,
    query?: string
  ): Promise<ManufacturerModelRecord[]> {
    let items = models.filter(
      (m) =>
        m.customerId === customerID &&
        m.manufacturerRecordId === manufacturerId &&
        m.isActive
    );

    if (query) {
      const q = query.toLowerCase();
      items = items.filter(
        (m) =>
          m.modelName.toLowerCase().includes(q) ||
          m.modelNumber?.toLowerCase().includes(q)
      );
    }

    return items.slice(0, 20);
  },

  async create(
    customerID: number,
    data: CreateManufacturerInput
  ): Promise<ManufacturerRecord> {
    // Check for duplicate name within customer
    const existing = manufacturers.find(
      (m) =>
        m.customerID === customerID &&
        m.isActive &&
        m.manufacturerName.toLowerCase() === data.manufacturerName.toLowerCase()
    );
    if (existing) {
      throw new Error(
        `Manufacturer "${data.manufacturerName}" already exists`
      );
    }

    const newMfr: ManufacturerRecord = {
      manufacturerRecordID: nextManufacturerId++,
      customerID,
      manufacturerName: data.manufacturerName,
      contactInfo: data.contactInfo ?? null,
      website: data.website ?? null,
      isActive: true,
    };
    manufacturers.push(newMfr);
    return newMfr;
  },

  async createModel(
    customerID: number,
    manufacturerId: number,
    data: CreateModelInput
  ): Promise<ManufacturerModelRecord> {
    const now = new Date().toISOString();
    const newModel: ManufacturerModelRecord = {
      id: nextModelId++,
      manufacturerRecordId: manufacturerId,
      customerId: customerID,
      modelName: data.modelName,
      modelNumber: data.modelNumber ?? null,
      categorySlug: data.categorySlug ?? null,
      specifications: data.specifications ?? null,
      isActive: true,
      createdAt: now,
    };
    models.push(newModel);
    return newModel;
  },
};
