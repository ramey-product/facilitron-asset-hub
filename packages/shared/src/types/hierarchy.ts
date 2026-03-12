/**
 * Asset hierarchy types shared between API and web app.
 */

export interface HierarchyNode {
  equipmentRecordID: number;
  equipmentName: string;
  parentEquipmentId: number | null;
  categorySlug: string | null;
  categoryName: string | null;
  lifecycleStatus: string;
  conditionRating: number | null;
  propertyName: string | null;
  children: HierarchyNode[];
}

export interface HierarchyRollup {
  equipmentRecordID: number;
  equipmentName: string;
  totalDescendants: number;
  totalMaintenanceCost: number;
  workOrderCount: number;
  weightedAvgCondition: number | null;
  childCount: number;
  maxDepth: number;
}

export interface ReparentInput {
  parentEquipmentId: number | null;
}

export interface BulkReparentItem {
  assetId: number;
  newParentId: number | null;
}

export interface BulkReparentInput {
  items: BulkReparentItem[];
}

export interface BulkReparentResult {
  succeeded: number;
  failed: { assetId: number; error: string }[];
}
