/**
 * Vendor entity types shared between API and web app.
 * P1-22: Vendor Directory
 */

export interface VendorRecord {
  id: number;
  customerID: number;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  category: "parts" | "service" | "both";
  rating: number | null; // 1-5
  notes: string | null;
  contractExpiry: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VendorPerformance {
  vendorId: number;
  onTimeDeliveryPct: number;
  avgLeadTimeDays: number;
  defectRatePct: number;
  totalPOs: number;
  totalSpend: number;
  monthlyTrend: Array<{
    month: string;
    onTimePct: number;
    leadTimeDays: number;
  }>;
}

export interface ListVendorsQuery {
  page: number;
  limit: number;
  search?: string;
  category?: "parts" | "service" | "both";
  isActive?: boolean;
  ratingMin?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateVendorInput {
  name: string;
  category: "parts" | "service" | "both";
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  rating?: number;
  notes?: string;
  contractExpiry?: string;
}

export type UpdateVendorInput = Partial<CreateVendorInput>;
