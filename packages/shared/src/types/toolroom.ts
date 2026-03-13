/**
 * Tool room checkout/return types shared between API and web app.
 * P1-30: Tool Room Management
 */

export type ToolCheckoutStatus = "checked-out" | "returned" | "overdue";

export type ReturnCondition = "good" | "fair" | "poor";

export interface ToolCheckout {
  id: number;
  customerID: number;
  toolId: number;
  toolName: string;
  toolAssetTag: string;
  checkedOutBy: number;
  checkedOutByName: string;
  checkedOutAt: string;
  expectedReturnDate: string;
  returnedAt: string | null;
  returnedCondition: ReturnCondition | null;
  returnedBy: number | null;
  returnedByName: string | null;
  status: ToolCheckoutStatus;
  notes: string | null;
}

export interface CreateCheckoutInput {
  toolId: number;
  checkedOutBy: number;
  expectedReturnDate: string;
  notes?: string;
}

export interface ReturnToolInput {
  condition: ReturnCondition;
  notes?: string;
}

export interface ListCheckoutsQuery {
  page?: number;
  limit?: number;
  status?: ToolCheckoutStatus;
  toolId?: number;
  search?: string;
}

export interface PopularTool {
  toolId: number;
  toolName: string;
  checkoutCount: number;
}

export interface AvailableTool {
  toolId: number;
  toolName: string;
  assetTag: string;
  lastReturnCondition: string | null;
}

export interface ToolroomStats {
  totalTools: number;
  availableTools: number;
  checkedOutCount: number;
  overdueCount: number;
  popularTools: PopularTool[];
  availableToolsList: AvailableTool[];
}
