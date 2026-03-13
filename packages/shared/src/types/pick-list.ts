/**
 * Pick list types shared between API and web app.
 * P1-27: Pick Lists
 */

export type PickListStatus = "draft" | "in-progress" | "completed" | "on-hold";

export type PickListItemStatus = "pending" | "picked" | "short";

export type PickListSource = "scheduled-wos" | "manual";

export type PickListDateRange = "today" | "tomorrow" | "week";

export interface PickListItem {
  id: number;
  pickListId: number;
  partId: number;
  partName: string;
  partSku: string;
  locationId: number;
  locationName: string;
  storageLocation: string;
  quantityNeeded: number;
  quantityPicked: number;
  status: PickListItemStatus;
  woReference: string | null;
}

export interface PickList {
  id: number;
  customerID: number;
  name: string;
  status: PickListStatus;
  generatedFrom: PickListSource;
  dateRange: string | null;
  woIds: number[];
  items: PickListItem[];
  totalItems: number;
  pickedItems: number;
  createdBy: string;
  createdAt: string;
  completedAt: string | null;
}

export interface CreatePickListInput {
  name?: string;
  woIds?: number[];
  dateRange?: PickListDateRange;
}

export interface ListPickListsQuery {
  page?: number;
  limit?: number;
  status?: PickListStatus;
  search?: string;
}
