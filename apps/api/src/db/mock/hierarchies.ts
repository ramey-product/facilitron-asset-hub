import type {
  HierarchyProvider,
  AssetRecord,
} from "../../types/providers.js";
import type {
  HierarchyNode,
  HierarchyRollup,
  BulkReparentResult,
} from "@asset-hub/shared";
import { mockAssets } from "./data/assets.js";
import { mockWorkOrders } from "./data/work-orders.js";

// Working copy reference — mutations happen against the imported array
const assets = mockAssets;

function buildNode(asset: AssetRecord, allAssets: AssetRecord[], depth: number): HierarchyNode {
  const children = allAssets
    .filter(
      (a) =>
        a.parentEquipmentId === asset.equipmentRecordID &&
        a.isActive
    )
    .map((child) => buildNode(child, allAssets, depth + 1));

  return {
    equipmentRecordID: asset.equipmentRecordID,
    equipmentName: asset.equipmentName,
    parentEquipmentId: asset.parentEquipmentId,
    categorySlug: asset.categorySlug ?? null,
    categoryName: asset.categoryName ?? null,
    lifecycleStatus: asset.lifecycleStatus,
    conditionRating: asset.conditionRating,
    propertyName: asset.propertyName ?? null,
    children,
  };
}

function getDescendants(assetId: number, allAssets: AssetRecord[]): AssetRecord[] {
  const directChildren = allAssets.filter(
    (a) => a.parentEquipmentId === assetId && a.isActive
  );
  const descendants: AssetRecord[] = [...directChildren];
  for (const child of directChildren) {
    descendants.push(...getDescendants(child.equipmentRecordID, allAssets));
  }
  return descendants;
}

function getMaxDepth(assetId: number, allAssets: AssetRecord[]): number {
  const children = allAssets.filter(
    (a) => a.parentEquipmentId === assetId && a.isActive
  );
  if (children.length === 0) return 0;
  return 1 + Math.max(...children.map((c) => getMaxDepth(c.equipmentRecordID, allAssets)));
}

function getAncestorChain(assetId: number, allAssets: AssetRecord[]): number[] {
  const chain: number[] = [];
  let current = allAssets.find((a) => a.equipmentRecordID === assetId);
  while (current?.parentEquipmentId) {
    chain.push(current.parentEquipmentId);
    current = allAssets.find(
      (a) => a.equipmentRecordID === current!.parentEquipmentId
    );
  }
  return chain;
}

function wouldCreateCircularRef(
  assetId: number,
  newParentId: number,
  allAssets: AssetRecord[]
): boolean {
  if (assetId === newParentId) return true;
  // Check if newParentId is a descendant of assetId
  const descendants = getDescendants(assetId, allAssets);
  return descendants.some((d) => d.equipmentRecordID === newParentId);
}

function getDepthAt(assetId: number, allAssets: AssetRecord[]): number {
  const chain = getAncestorChain(assetId, allAssets);
  return chain.length;
}

export const mockHierarchyProvider: HierarchyProvider = {
  async getTree(
    customerID: number,
    assetId: number
  ): Promise<HierarchyNode | null> {
    const custAssets = assets.filter(
      (a) => a.customerID === customerID && a.isActive
    );
    const root = custAssets.find((a) => a.equipmentRecordID === assetId);
    if (!root) return null;

    return buildNode(root, custAssets, 0);
  },

  async getRollup(
    customerID: number,
    assetId: number
  ): Promise<HierarchyRollup | null> {
    const custAssets = assets.filter(
      (a) => a.customerID === customerID && a.isActive
    );
    const root = custAssets.find((a) => a.equipmentRecordID === assetId);
    if (!root) return null;

    const descendants = getDescendants(assetId, custAssets);
    const allInclusive = [root, ...descendants];

    // Total maintenance cost from work orders
    const relatedWOs = mockWorkOrders.filter(
      (wo) =>
        wo.customerID === customerID &&
        allInclusive.some((a) => a.equipmentRecordID === wo.equipmentRecordID)
    );
    const totalMaintenanceCost = relatedWOs.reduce(
      (sum, wo) => sum + wo.laborCost + wo.partsCost + wo.vendorCost,
      0
    );

    // Weighted average condition
    const withCondition = allInclusive.filter(
      (a) => a.conditionRating !== null
    );
    const weightedAvgCondition =
      withCondition.length > 0
        ? withCondition.reduce((sum, a) => sum + a.conditionRating!, 0) /
          withCondition.length
        : null;

    const directChildren = custAssets.filter(
      (a) => a.parentEquipmentId === assetId
    );

    return {
      equipmentRecordID: assetId,
      equipmentName: root.equipmentName,
      totalDescendants: descendants.length,
      totalMaintenanceCost,
      workOrderCount: relatedWOs.length,
      weightedAvgCondition:
        weightedAvgCondition !== null
          ? Math.round(weightedAvgCondition * 10) / 10
          : null,
      childCount: directChildren.length,
      maxDepth: getMaxDepth(assetId, custAssets),
    };
  },

  async reparent(
    customerID: number,
    assetId: number,
    newParentId: number | null,
    contactId: number
  ): Promise<{ success: boolean; error?: string }> {
    const custAssets = assets.filter(
      (a) => a.customerID === customerID && a.isActive
    );
    const idx = assets.findIndex(
      (a) =>
        a.customerID === customerID &&
        a.equipmentRecordID === assetId &&
        a.isActive
    );
    if (idx === -1) {
      return { success: false, error: "Asset not found" };
    }

    if (newParentId !== null) {
      const parent = custAssets.find(
        (a) => a.equipmentRecordID === newParentId
      );
      if (!parent) {
        return { success: false, error: "Parent asset not found" };
      }

      if (wouldCreateCircularRef(assetId, newParentId, custAssets)) {
        return {
          success: false,
          error: "Cannot reparent: would create circular reference",
        };
      }

      // Check max depth (4 levels)
      const parentDepth = getDepthAt(newParentId, custAssets);
      const subtreeDepth = getMaxDepth(assetId, custAssets);
      if (parentDepth + 1 + subtreeDepth > 4) {
        return {
          success: false,
          error: "Cannot reparent: would exceed maximum depth of 4 levels",
        };
      }
    }

    assets[idx] = {
      ...assets[idx]!,
      parentEquipmentId: newParentId,
      modifiedBy: contactId,
      dateModified: new Date().toISOString(),
    };

    return { success: true };
  },

  async bulkReparent(
    customerID: number,
    items: { assetId: number; newParentId: number | null }[],
    contactId: number
  ): Promise<BulkReparentResult> {
    let succeeded = 0;
    const failed: { assetId: number; error: string }[] = [];

    for (const item of items) {
      const result = await this.reparent(
        customerID,
        item.assetId,
        item.newParentId,
        contactId
      );
      if (result.success) {
        succeeded++;
      } else {
        failed.push({
          assetId: item.assetId,
          error: result.error ?? "Unknown error",
        });
      }
    }

    return { succeeded, failed };
  },
};
