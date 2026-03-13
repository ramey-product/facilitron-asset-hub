export interface Kit {
  id: number;
  name: string;
  description: string | null;
  categoryId: number | null;
  categoryName: string | null;
  isActive: boolean;
  totalComponents: number;
  estimatedCost: number;
  items: KitItem[];
  createdAt: string;
  updatedAt: string;
}

export interface KitItem {
  id: number;
  kitId: number;
  partId: number;
  partName: string | null;
  partNumber: string | null;
  quantity: number;
  unitCost: number | null;
}

export interface ListKitsQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  isActive?: boolean;
}

export interface CreateKitInput {
  name: string;
  description?: string;
  categoryId?: number;
  items: { partId: number; quantity: number }[];
}

export interface UpdateKitInput {
  name?: string;
  description?: string;
  categoryId?: number;
  isActive?: boolean;
  items?: { partId: number; quantity: number }[];
}

export interface KitCheckoutInput {
  kitId: number;
  locationId: number;
  workOrderId?: number;
  notes?: string;
}

export interface KitCheckoutResult {
  success: boolean;
  kitId: number;
  kitName: string;
  itemsCheckedOut: { partId: number; partName: string; quantity: number }[];
  insufficientStock: {
    partId: number;
    partName: string;
    required: number;
    available: number;
  }[] | null;
}
