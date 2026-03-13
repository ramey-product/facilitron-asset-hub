/**
 * Dashboard types shared between API and web app.
 */

export interface DashboardStats {
  totalAssets: number;
  activeAssets: number;
  activeCount: number;
  flaggedCount: number;
  criticalCount: number;
  poorCount: number;
  onlineCount: number;
  offlineCount: number;
  totalProperties: number;
  openWorkOrders: number;
  overdueWorkOrders: number;
  ytdMaintenanceCost: number;
  totalAssetValue: number;
  assetsNeedingAttention: number;
  assetsByStatus: { status: string; count: number }[];
  assetsByCategory: { category: string; slug: string; count: number }[];
  conditionDistribution: { name: string; value: number; fill: string }[];
  categoryBreakdown: { name: string; count: number; slug: string }[];
}

export type DashboardAlertType =
  | "overdue_maintenance"
  | "poor_condition"
  | "expired_warranty"
  | "expiring_warranty";

export interface DashboardAlert {
  id: number;
  type: DashboardAlertType;
  severity: "critical" | "warning" | "info";
  assetId: number;
  assetName: string;
  propertyName: string | null;
  message: string;
  detail: string | null;
  createdAt: string;
}

export type ActivityEventType =
  | "asset_created"
  | "asset_updated"
  | "condition_logged"
  | "status_changed"
  | "maintenance_completed"
  | "warranty_expiring"
  | "work_order_opened"
  | "work_order_closed"
  | "cost_recorded"
  | "asset_reparented";

export interface ActivityEvent {
  id: number;
  type: ActivityEventType;
  assetId: number | null;
  assetName: string | null;
  propertyName: string | null;
  description: string;
  actor: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
