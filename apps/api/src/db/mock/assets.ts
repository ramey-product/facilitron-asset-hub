import type {
  AssetProvider,
  AssetRecord,
  ListAssetsQuery,
  CreateAssetInput,
  UpdateAssetInput,
  PaginatedResult,
} from "../../types/providers.js";
import { mockAssets } from "./data/assets.js";
import { mockProperties, mockLocations } from "./data/locations.js";
import { mockEquipmentTypes } from "./data/types.js";
import { mockManufacturers } from "./data/manufacturers.js";
import { mockCategories } from "./data/categories.js";

// Working copy for in-memory mutations
const assets = [...mockAssets];
let nextId = Math.max(...assets.map((a) => a.equipmentRecordID)) + 1;

export const mockAssetProvider: AssetProvider = {
  async list(
    customerID: number,
    query: ListAssetsQuery
  ): Promise<PaginatedResult<AssetRecord>> {
    let items = assets.filter(
      (a) => a.customerID === customerID && a.isActive
    );

    // Search — match against name, serial, barcode, description
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter(
        (a) =>
          a.equipmentName.toLowerCase().includes(s) ||
          a.serialNumber?.toLowerCase().includes(s) ||
          a.equipmentBarCodeID?.toLowerCase().includes(s) ||
          a.equipmentDescription?.toLowerCase().includes(s) ||
          a.manufacturerName?.toLowerCase().includes(s)
      );
    }

    // Filter by lifecycle status
    if (query.status) {
      items = items.filter(
        (a) => a.lifecycleStatus.toLowerCase() === query.status!.toLowerCase()
      );
    }

    // Filter by condition rating
    if (query.condition) {
      const conditionMap: Record<string, number> = {
        excellent: 5,
        good: 4,
        fair: 3,
        poor: 2,
        critical: 1,
      };
      const targetRating = conditionMap[query.condition.toLowerCase()];
      if (targetRating !== undefined) {
        items = items.filter((a) => a.conditionRating === targetRating);
      }
    }

    // Filter by category
    if (query.categoryID) {
      const category = mockCategories.find(
        (c) => c.id === query.categoryID && c.customerId === customerID
      );
      if (category) {
        items = items.filter((a) => a.categorySlug === category.slug);
      }
    }

    // Filter by property (scope)
    if (query.propertyID) {
      items = items.filter((a) => a.propertyID === query.propertyID);
    }

    // Sorting
    const sortBy = query.sortBy ?? "equipmentName";
    const sortOrder = query.sortOrder ?? "asc";
    items.sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortBy];
      const bVal = (b as unknown as Record<string, unknown>)[sortBy];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp =
        typeof aVal === "string"
          ? aVal.localeCompare(bVal as string)
          : (aVal as number) - (bVal as number);
      return sortOrder === "desc" ? -cmp : cmp;
    });

    const total = items.length;
    const page = query.page;
    const limit = query.limit;
    const start = (page - 1) * limit;
    items = items.slice(start, start + limit);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(
    customerID: number,
    id: number
  ): Promise<AssetRecord | null> {
    return (
      assets.find(
        (a) =>
          a.customerID === customerID &&
          a.equipmentRecordID === id &&
          a.isActive
      ) ?? null
    );
  },

  async create(
    customerID: number,
    contactId: number,
    data: CreateAssetInput
  ): Promise<AssetRecord> {
    const now = new Date().toISOString();

    // Resolve joined display names
    const property = data.propertyID
      ? mockProperties.find(
          (p) => p.propertyID === data.propertyID && p.customerID === customerID
        )
      : undefined;
    const location = data.assetLocationID
      ? mockLocations.find(
          (l) =>
            l.assetLocationID === data.assetLocationID &&
            l.customerID === customerID
        )
      : undefined;
    const eqType = data.equipmentTypeID
      ? mockEquipmentTypes.find(
          (t) =>
            t.equipmentTypeID === data.equipmentTypeID &&
            t.customerID === customerID
        )
      : undefined;
    const manufacturer = data.manufacturerRecordID
      ? mockManufacturers.find(
          (m) =>
            m.manufacturerRecordID === data.manufacturerRecordID &&
            m.customerID === customerID
        )
      : undefined;
    const category = eqType
      ? mockCategories.find(
          (c) => c.slug === eqType.categorySlug && c.customerId === customerID
        )
      : undefined;

    const newAsset: AssetRecord = {
      equipmentRecordID: nextId++,
      customerID,
      propertyID: data.propertyID ?? null,
      assetLocationID: data.assetLocationID ?? null,
      equipmentName: data.equipmentName,
      equipmentDescription: data.equipmentDescription ?? null,
      equipmentTypeID: data.equipmentTypeID ?? null,
      serialNumber: data.serialNumber ?? null,
      equipmentBarCodeID: data.equipmentBarCodeID ?? null,
      manufacturerRecordID: data.manufacturerRecordID ?? null,
      modelNumber: data.modelNumber ?? null,
      acquisitionDate: data.acquisitionDate ?? null,
      acquisitionCost: data.acquisitionCost ?? null,
      warrantyExpiration: data.warrantyExpiration ?? null,
      expectedLifeYears: data.expectedLifeYears ?? null,
      lifecycleStatus: data.lifecycleStatus ?? "Active",
      conditionRating: data.conditionRating ?? null,
      lastConditionDate: data.conditionRating ? now : null,
      isActive: true,
      dateCreated: now,
      dateModified: null,
      createdBy: contactId,
      modifiedBy: null,
      notes: data.notes ?? null,
      parentEquipmentId: data.parentEquipmentId ?? null,
      operationalStatus: "online",
      statusReasonCode: null,
      statusChangedAt: null,
      statusChangedBy: null,
      propertyName: property?.propertyName ?? null,
      locationName: location?.locationName ?? null,
      categorySlug: eqType?.categorySlug ?? null,
      categoryName: category?.name ?? null,
      manufacturerName: manufacturer?.manufacturerName ?? null,
      equipmentTypeName: eqType?.equipmentTypeName ?? null,
    };

    assets.push(newAsset);
    return newAsset;
  },

  async update(
    customerID: number,
    id: number,
    contactId: number,
    data: UpdateAssetInput
  ): Promise<AssetRecord | null> {
    const idx = assets.findIndex(
      (a) => a.customerID === customerID && a.equipmentRecordID === id
    );
    if (idx === -1) return null;

    const existing = assets[idx]!;
    const now = new Date().toISOString();

    // Resolve updated joined names if foreign keys changed
    let propertyName = existing.propertyName;
    if (data.propertyID !== undefined) {
      const property = data.propertyID
        ? mockProperties.find(
            (p) =>
              p.propertyID === data.propertyID && p.customerID === customerID
          )
        : undefined;
      propertyName = property?.propertyName ?? null;
    }

    let locationName = existing.locationName;
    if (data.assetLocationID !== undefined) {
      const location = data.assetLocationID
        ? mockLocations.find(
            (l) =>
              l.assetLocationID === data.assetLocationID &&
              l.customerID === customerID
          )
        : undefined;
      locationName = location?.locationName ?? null;
    }

    let manufacturerName = existing.manufacturerName;
    if (data.manufacturerRecordID !== undefined) {
      const manufacturer = data.manufacturerRecordID
        ? mockManufacturers.find(
            (m) =>
              m.manufacturerRecordID === data.manufacturerRecordID &&
              m.customerID === customerID
          )
        : undefined;
      manufacturerName = manufacturer?.manufacturerName ?? null;
    }

    const updated: AssetRecord = {
      ...existing,
      ...data,
      // Ensure non-updatable fields remain
      equipmentRecordID: existing.equipmentRecordID,
      customerID: existing.customerID,
      dateCreated: existing.dateCreated,
      createdBy: existing.createdBy,
      // Update audit fields
      dateModified: now,
      modifiedBy: contactId,
      // Update condition date if rating changed
      lastConditionDate:
        data.conditionRating !== undefined ? now : existing.lastConditionDate,
      // Resolved names
      propertyName,
      locationName,
      manufacturerName,
    };

    assets[idx] = updated;
    return updated;
  },

  async delete(customerID: number, id: number): Promise<boolean> {
    const idx = assets.findIndex(
      (a) => a.customerID === customerID && a.equipmentRecordID === id
    );
    if (idx === -1) return false;

    // Soft delete
    assets[idx] = { ...assets[idx]!, isActive: false };
    return true;
  },
};
