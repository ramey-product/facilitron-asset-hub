export interface ReorderRule {
  id: number;
  partId: number;
  partName: string | null;
  partNumber: string | null;
  reorderPoint: number;
  reorderQuantity: number;
  preferredVendorId: number | null;
  preferredVendorName: string | null;
  leadTimeDays: number;
  isActive: boolean;
  propertyId: number;
  propertyName: string | null;
}

export interface ReorderAlert {
  id: number;
  partId: number;
  partName: string | null;
  partNumber: string | null;
  propertyId: number;
  propertyName: string | null;
  currentQuantity: number;
  reorderPoint: number;
  reorderQuantity: number;
  preferredVendorId: number | null;
  preferredVendorName: string | null;
  leadTimeDays: number;
  status: "Active" | "Dismissed" | "Ordered";
  createdAt: string;
  dismissedAt: string | null;
  dismissedBy: number | null;
  convertedPoId: number | null;
}

export interface ListAlertsQuery {
  page?: number;
  limit?: number;
  status?: "Active" | "Dismissed" | "Ordered";
  partId?: number;
  propertyId?: number;
}

export interface CreateReorderRuleInput {
  partId: number;
  reorderPoint: number;
  reorderQuantity: number;
  preferredVendorId?: number;
  leadTimeDays?: number;
  propertyId: number;
}

export interface UpdateReorderRuleInput {
  reorderPoint?: number;
  reorderQuantity?: number;
  preferredVendorId?: number;
  leadTimeDays?: number;
  isActive?: boolean;
}
