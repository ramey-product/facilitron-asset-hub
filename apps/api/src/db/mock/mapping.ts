/**
 * Mock provider for P1-33 Interactive Asset Mapping.
 * In-memory floor plan and pin management.
 */

import type {
  FloorPlan,
  AssetPin,
  FloorPlanWithPins,
  MapFilter,
  ListFloorPlansQuery,
  CreateAssetPinInput,
  UpdateAssetPinInput,
} from "@asset-hub/shared";
import type { PaginatedResult } from "../../types/providers.js";
import { mockFloorPlans, mockAssetPins } from "./data/mapping.js";

// Working copies for in-memory mutations
const floorPlans: FloorPlan[] = mockFloorPlans.map((fp) => ({ ...fp }));
const assetPins: AssetPin[] = mockAssetPins.map((pin) => ({ ...pin }));

let nextPinId = Math.max(...assetPins.map((p) => p.id)) + 1;

export const mockMappingProvider = {
  async getFloorPlans(
    _customerID: number,
    query: Required<Pick<ListFloorPlansQuery, "page" | "limit">> &
      Omit<ListFloorPlansQuery, "page" | "limit">
  ): Promise<PaginatedResult<FloorPlan>> {
    let items = [...floorPlans];

    if (query.propertyId) {
      items = items.filter((fp) => fp.propertyId === query.propertyId);
    }

    // Update pinCounts from live data
    items = items.map((fp) => ({
      ...fp,
      pinCount: assetPins.filter((p) => p.mapId === fp.id).length,
    }));

    items.sort((a, b) => a.floorNumber - b.floorNumber);

    const total = items.length;
    const { page, limit } = query;
    const start = (page - 1) * limit;
    items = items.slice(start, start + limit);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async getFloorPlan(
    _customerID: number,
    mapId: number
  ): Promise<FloorPlanWithPins | null> {
    const fp = floorPlans.find((f) => f.id === mapId);
    if (!fp) return null;

    const pins = assetPins.filter((p) => p.mapId === mapId);
    return {
      ...fp,
      pinCount: pins.length,
      pins,
    };
  },

  async getAssetPins(
    _customerID: number,
    mapId: number,
    filter?: MapFilter
  ): Promise<AssetPin[]> {
    let pins = assetPins.filter((p) => p.mapId === mapId);

    if (filter?.category) {
      pins = pins.filter((p) => p.categoryName === filter.category);
    }
    if (filter?.condition) {
      pins = pins.filter((p) => p.condition === filter.condition);
    }
    if (filter?.status) {
      pins = pins.filter((p) => p.status === filter.status);
    }
    if (filter?.search) {
      const s = filter.search.toLowerCase();
      pins = pins.filter((p) => p.assetName.toLowerCase().includes(s));
    }

    return pins;
  },

  async createAssetPin(
    _customerID: number,
    mapId: number,
    input: CreateAssetPinInput
  ): Promise<AssetPin | null> {
    const fp = floorPlans.find((f) => f.id === mapId);
    if (!fp) return null;

    const pin: AssetPin = {
      id: nextPinId++,
      assetId: input.assetId,
      assetName: `Asset #${input.assetId}`,
      categoryName: "General",
      condition: null,
      status: null,
      mapId,
      x: input.x,
      y: input.y,
      iconType: input.iconType ?? "generic",
    };

    assetPins.push(pin);
    return pin;
  },

  async updateAssetPin(
    _customerID: number,
    pinId: number,
    input: UpdateAssetPinInput
  ): Promise<AssetPin | null> {
    const idx = assetPins.findIndex((p) => p.id === pinId);
    if (idx === -1) return null;

    const existing = assetPins[idx]!;
    if (input.x !== undefined) existing.x = input.x;
    if (input.y !== undefined) existing.y = input.y;
    if (input.iconType !== undefined) existing.iconType = input.iconType;

    return existing;
  },

  async deleteAssetPin(
    _customerID: number,
    pinId: number
  ): Promise<boolean> {
    const idx = assetPins.findIndex((p) => p.id === pinId);
    if (idx === -1) return false;
    assetPins.splice(idx, 1);
    return true;
  },
};
