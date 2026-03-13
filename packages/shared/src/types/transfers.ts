export type TransferStatus =
  | "Requested"
  | "Approved"
  | "InTransit"
  | "Received"
  | "Cancelled";

export interface InventoryTransfer {
  id: number;
  transferNumber: string; // "TRF-{year}-{seq}"
  partId: number;
  partName: string | null;
  partNumber: string | null;
  fromLocationId: number;
  fromLocationName: string | null;
  fromPropertyId: number;
  fromPropertyName: string | null;
  toLocationId: number;
  toLocationName: string | null;
  toPropertyId: number;
  toPropertyName: string | null;
  quantity: number;
  status: TransferStatus;
  requestedBy: number;
  requestedByName: string | null;
  approvedBy: number | null;
  approvedByName: string | null;
  notes: string | null;
  isInterProperty: boolean; // fromPropertyId !== toPropertyId
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  shippedAt: string | null;
  receivedAt: string | null;
  cancelledAt: string | null;
}

export interface CreateTransferInput {
  partId: number;
  fromLocationId: number;
  toLocationId: number;
  quantity: number;
  notes?: string;
}

export interface ListTransfersQuery {
  page?: number;
  limit?: number;
  status?: TransferStatus;
  partId?: number;
  search?: string;
  sortBy?: "transferNumber" | "createdAt" | "status";
  sortOrder?: "asc" | "desc";
}
