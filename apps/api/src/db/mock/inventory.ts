import type {
  InventoryProvider,
  PaginatedResult,
} from "../../types/providers.js";
import type {
  PartRecord,
  PartCategory,
  ListPartsQuery,
  CreatePartInput,
  UpdatePartInput,
} from "@asset-hub/shared";
import { mockParts, mockPartCategories } from "./data/inventory.js";

// Working copies for in-memory mutations
const parts = [...mockParts];
const categories = [...mockPartCategories];
let nextPartId = Math.max(...parts.map((p) => p.id)) + 1;

export const mockInventoryProvider: InventoryProvider = {
  async list(
    customerID: number,
    query: ListPartsQuery
  ): Promise<PaginatedResult<PartRecord>> {
    let items = parts.filter((p) => p.customerID === customerID);

    // Status filter
    if (query.status === "active") {
      items = items.filter((p) => p.isActive);
    } else if (query.status === "inactive") {
      items = items.filter((p) => !p.isActive);
    }
    // "all" returns both active and inactive

    // Search — match against name, SKU, description
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.sku.toLowerCase().includes(s) ||
          p.description?.toLowerCase().includes(s) ||
          p.categoryName.toLowerCase().includes(s) ||
          p.vendorName?.toLowerCase().includes(s)
      );
    }

    // Category filter
    if (query.categoryId) {
      items = items.filter((p) => p.categoryId === query.categoryId);
    }

    // Vendor filter
    if (query.vendorId) {
      items = items.filter((p) => p.vendorId === query.vendorId);
    }

    // Sorting
    const sortBy = query.sortBy ?? "name";
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
  ): Promise<PartRecord | null> {
    return (
      parts.find((p) => p.customerID === customerID && p.id === id) ?? null
    );
  },

  async create(
    customerID: number,
    data: CreatePartInput
  ): Promise<PartRecord> {
    const now = new Date().toISOString();
    const category = categories.find(
      (c) => c.id === data.categoryId && c.customerID === customerID
    );

    const newPart: PartRecord = {
      id: nextPartId++,
      customerID,
      sku: data.sku,
      name: data.name,
      description: data.description ?? null,
      categoryId: data.categoryId,
      categoryName: category?.name ?? "Unknown",
      unitCost: data.unitCost ?? 0,
      unitOfMeasure: data.unitOfMeasure ?? "each",
      vendorId: data.vendorId ?? null,
      vendorName: null, // Would resolve from vendor lookup in real implementation
      minQty: data.minQty ?? 0,
      maxQty: data.maxQty ?? 0,
      reorderPoint: data.reorderPoint ?? 0,
      storageLocation: data.storageLocation ?? null,
      imageUrl: data.imageUrl ?? null,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    parts.push(newPart);

    // Update category count
    const catIdx = categories.findIndex(
      (c) => c.id === data.categoryId && c.customerID === customerID
    );
    if (catIdx !== -1) {
      categories[catIdx] = {
        ...categories[catIdx]!,
        partCount: categories[catIdx]!.partCount + 1,
      };
    }

    return newPart;
  },

  async update(
    customerID: number,
    id: number,
    data: UpdatePartInput
  ): Promise<PartRecord | null> {
    const idx = parts.findIndex(
      (p) => p.customerID === customerID && p.id === id
    );
    if (idx === -1) return null;

    const existing = parts[idx]!;
    const now = new Date().toISOString();

    // Resolve category name if categoryId changed
    let categoryName = existing.categoryName;
    if (data.categoryId !== undefined && data.categoryId !== existing.categoryId) {
      const cat = categories.find(
        (c) => c.id === data.categoryId && c.customerID === customerID
      );
      categoryName = cat?.name ?? "Unknown";
    }

    const updated: PartRecord = {
      ...existing,
      ...data,
      id: existing.id,
      customerID: existing.customerID,
      isActive: existing.isActive,
      createdAt: existing.createdAt,
      categoryName,
      updatedAt: now,
    };

    parts[idx] = updated;
    return updated;
  },

  async delete(customerID: number, id: number): Promise<boolean> {
    const idx = parts.findIndex(
      (p) => p.customerID === customerID && p.id === id
    );
    if (idx === -1) return false;

    // Soft delete
    parts[idx] = { ...parts[idx]!, isActive: false, updatedAt: new Date().toISOString() };
    return true;
  },

  async bulkActivate(customerID: number, ids: number[]): Promise<number> {
    let count = 0;
    const now = new Date().toISOString();
    for (const id of ids) {
      const idx = parts.findIndex(
        (p) => p.customerID === customerID && p.id === id
      );
      if (idx !== -1 && !parts[idx]!.isActive) {
        parts[idx] = { ...parts[idx]!, isActive: true, updatedAt: now };
        count++;
      }
    }
    return count;
  },

  async bulkDeactivate(customerID: number, ids: number[]): Promise<number> {
    let count = 0;
    const now = new Date().toISOString();
    for (const id of ids) {
      const idx = parts.findIndex(
        (p) => p.customerID === customerID && p.id === id
      );
      if (idx !== -1 && parts[idx]!.isActive) {
        parts[idx] = { ...parts[idx]!, isActive: false, updatedAt: now };
        count++;
      }
    }
    return count;
  },

  async listCategories(customerID: number): Promise<PartCategory[]> {
    return categories.filter((c) => c.customerID === customerID);
  },
};
