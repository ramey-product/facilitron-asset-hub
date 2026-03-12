"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  GitBranch,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, getConditionBg } from "@/lib/utils";
import { conditionLabel } from "@/hooks/use-assets";
import { useAssetTree, useReparentAsset } from "@/hooks/use-hierarchies";
import type { AssetTreeNode } from "@/hooks/use-hierarchies";

interface AssetTreeProps {
  assetId: number;
}

export function AssetTree({ assetId }: AssetTreeProps) {
  const { data, isLoading } = useAssetTree(assetId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Asset Hierarchy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-[var(--muted)]" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.data) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Asset Hierarchy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center">
            <GitBranch className="mx-auto h-6 w-6 text-[var(--muted-foreground)]" />
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">No hierarchy data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Asset Hierarchy</CardTitle>
      </CardHeader>
      <CardContent>
        <TreeNode node={data.data} rootAssetId={assetId} />
      </CardContent>
    </Card>
  );
}

interface TreeNodeProps {
  node: AssetTreeNode;
  rootAssetId: number;
  isDragTarget?: boolean;
}

function TreeNode({ node, rootAssetId, isDragTarget = false }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showDecommissionWarning, setShowDecommissionWarning] = useState(false);
  const reparent = useReparentAsset();

  const hasChildren = node.children.length > 0;
  const isRoot = node.assetId === rootAssetId;
  const condLabel = conditionLabel(node.conditionRating);
  const isCriticalOrPoor = node.conditionRating !== null && node.conditionRating <= 2;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("assetId", node.assetId.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const draggedId = parseInt(e.dataTransfer.getData("assetId"), 10);
    if (draggedId !== node.assetId && draggedId > 0) {
      reparent.mutate({ assetId: draggedId, parentId: node.assetId });
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg px-2 py-2 transition-colors",
          isDragOver && "bg-[var(--primary)]/10 ring-1 ring-[var(--primary)]/30",
          isRoot ? "font-semibold" : "hover:bg-[var(--muted)]/50",
          isDragTarget && "cursor-grab active:cursor-grabbing"
        )}
        style={{ paddingLeft: `${8 + node.depth * 20}px` }}
        draggable={!isRoot}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Expand/collapse toggle */}
        <button
          onClick={() => hasChildren && setIsExpanded(!isExpanded)}
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors",
            hasChildren
              ? "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              : "invisible"
          )}
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {hasChildren &&
            (isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            ))}
        </button>

        {/* Condition warning dot */}
        {isCriticalOrPoor && (
          <AlertTriangle className="h-3 w-3 shrink-0 text-red-500" />
        )}

        {/* Asset name + link */}
        <Link
          href={`/assets/${node.assetId}`}
          className={cn(
            "min-w-0 flex-1 truncate text-sm",
            isRoot
              ? "font-semibold text-[var(--foreground)]"
              : "text-[var(--foreground)] hover:text-[var(--primary)]"
          )}
        >
          {node.equipmentName}
        </Link>

        {/* Badges */}
        <div className="ml-2 flex shrink-0 items-center gap-1.5">
          {node.categoryName && (
            <span className="text-[10px] text-[var(--muted-foreground)]">
              {node.categoryName}
            </span>
          )}
          <Badge className={cn("border text-[10px]", getConditionBg(condLabel))}>
            {condLabel}
          </Badge>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.assetId}
              node={child}
              rootAssetId={rootAssetId}
              isDragTarget
            />
          ))}
        </div>
      )}

      {/* Decommission warning modal */}
      {showDecommissionWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="mx-4 w-full max-w-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  Decommission Warning
                </h3>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                This asset has {node.children.length} child asset
                {node.children.length !== 1 ? "s" : ""}. Decommissioning it
                will also affect all children.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDecommissionWarning(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-[var(--destructive)] text-white"
                  onClick={() => setShowDecommissionWarning(false)}
                >
                  Proceed
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
