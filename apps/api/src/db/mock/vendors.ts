import type {
  VendorProvider,
  PaginatedResult,
} from "../../types/providers.js";
import type {
  VendorRecord,
  VendorPerformance,
  ListVendorsQuery,
  CreateVendorInput,
  UpdateVendorInput,
} from "@asset-hub/shared";
import { mockVendors, mockVendorPerformance } from "./data/vendors.js";

// Working copy for in-memory mutations
const vendors = [...mockVendors];
let nextId = Math.max(...vendors.map((v) => v.id)) + 1;

export const mockVendorProvider: VendorProvider = {
  async list(
    customerID: number,
    query: ListVendorsQuery
  ): Promise<PaginatedResult<VendorRecord>> {
    let items = vendors.filter((v) => v.customerID === customerID);

    // Search
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter(
        (v) =>
          v.name.toLowerCase().includes(s) ||
          v.contactName?.toLowerCase().includes(s) ||
          v.email?.toLowerCase().includes(s) ||
          v.notes?.toLowerCase().includes(s)
      );
    }

    // Filter by category
    if (query.category) {
      items = items.filter((v) => v.category === query.category);
    }

    // Filter by active status
    if (query.isActive !== undefined) {
      items = items.filter((v) => v.isActive === query.isActive);
    }

    // Filter by minimum rating
    if (query.ratingMin) {
      items = items.filter(
        (v) => v.rating !== null && v.rating >= query.ratingMin!
      );
    }

    // Sort
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
  ): Promise<VendorRecord | null> {
    return (
      vendors.find((v) => v.customerID === customerID && v.id === id) ?? null
    );
  },

  async create(
    customerID: number,
    data: CreateVendorInput
  ): Promise<VendorRecord> {
    const now = new Date().toISOString();
    const newVendor: VendorRecord = {
      id: nextId++,
      customerID,
      name: data.name,
      contactName: data.contactName ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      address: data.address ?? null,
      website: data.website ?? null,
      category: data.category,
      rating: data.rating ?? null,
      notes: data.notes ?? null,
      contractExpiry: data.contractExpiry ?? null,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    vendors.push(newVendor);
    return newVendor;
  },

  async update(
    customerID: number,
    id: number,
    data: UpdateVendorInput
  ): Promise<VendorRecord | null> {
    const idx = vendors.findIndex(
      (v) => v.customerID === customerID && v.id === id
    );
    if (idx === -1) return null;

    const existing = vendors[idx]!;
    const updated: VendorRecord = {
      ...existing,
      ...data,
      id: existing.id,
      customerID: existing.customerID,
      createdAt: existing.createdAt,
      isActive: existing.isActive,
      updatedAt: new Date().toISOString(),
    };
    vendors[idx] = updated;
    return updated;
  },

  async delete(customerID: number, id: number): Promise<boolean> {
    const idx = vendors.findIndex(
      (v) => v.customerID === customerID && v.id === id
    );
    if (idx === -1) return false;

    // Soft delete
    vendors[idx] = { ...vendors[idx]!, isActive: false, updatedAt: new Date().toISOString() };
    return true;
  },

  async getPerformance(
    customerID: number,
    vendorId: number
  ): Promise<VendorPerformance | null> {
    // Verify vendor belongs to customer
    const vendor = vendors.find(
      (v) => v.customerID === customerID && v.id === vendorId
    );
    if (!vendor) return null;

    return (
      mockVendorPerformance.find((p) => p.vendorId === vendorId) ?? null
    );
  },

  async compareVendors(
    customerID: number,
    vendorIds: number[]
  ): Promise<Array<VendorRecord & { performance: VendorPerformance | null }>> {
    return vendorIds
      .map((id) => {
        const vendor = vendors.find(
          (v) => v.customerID === customerID && v.id === id
        );
        if (!vendor) return null;

        const performance =
          mockVendorPerformance.find((p) => p.vendorId === id) ?? null;
        return { ...vendor, performance };
      })
      .filter((v): v is VendorRecord & { performance: VendorPerformance | null } => v !== null);
  },
};
