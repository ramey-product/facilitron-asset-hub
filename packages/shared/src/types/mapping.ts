/**
 * Interactive Asset Mapping types shared between API and web app.
 * P1-33: Floor plan upload, pin placement, map viewer, analytics
 */

export interface FloorPlan {
  id: number;
  propertyId: number;
  propertyName: string;
  floorNumber: number;
  floorName: string;
  imageUrl: string; // placeholder URL for prototype
  width: number;   // logical width (e.g. 1200)
  height: number;  // logical height (e.g. 800)
  scale: string;   // e.g. "1 grid = 10 ft"
  uploadedAt: string;
  uploadedBy: string;
  pinCount: number;
}

export interface AssetPin {
  id: number;
  assetId: number;
  assetName: string;
  categoryName: string;
  condition: "Good" | "Fair" | "Poor" | null;
  status: "online" | "offline" | null;
  mapId: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  iconType: string; // e.g. "hvac", "electrical", "plumbing", "fire", "generic"
}

export interface MapFilter {
  category?: string;
  condition?: "Good" | "Fair" | "Poor";
  status?: "online" | "offline";
  search?: string;
}

export interface ListFloorPlansQuery {
  propertyId?: number;
  page?: number;
  limit?: number;
}

export interface CreateAssetPinInput {
  assetId: number;
  x: number;
  y: number;
  iconType?: string;
}

export interface UpdateAssetPinInput {
  x?: number;
  y?: number;
  iconType?: string;
}

export interface FloorPlanWithPins extends FloorPlan {
  pins: AssetPin[];
}
