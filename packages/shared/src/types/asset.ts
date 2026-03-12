/**
 * Asset entity types shared between API and web app.
 * Column names mirror tblAsset SQL Server schema.
 */

export type AssetStatus = "active" | "inactive" | "disposed" | "maintenance";

export type AssetCondition = "excellent" | "good" | "fair" | "poor" | "critical";

export interface Asset {
  assetID: number;
  customerID: number;
  assetName: string;
  assetTag: string | null;
  serialNumber: string | null;
  assetStatus: AssetStatus;
  assetCondition: AssetCondition | null;
  locationID: number | null;
  locationName: string | null;
  categoryID: number | null;
  categoryName: string | null;
  manufacturerID: number | null;
  manufacturerName: string | null;
  modelNumber: string | null;
  purchaseDate: string | null;
  purchaseCost: number | null;
  warrantyExpiration: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AssetSummary
  extends Pick<
    Asset,
    | "assetID"
    | "customerID"
    | "assetName"
    | "assetTag"
    | "assetStatus"
    | "assetCondition"
    | "locationName"
    | "categoryName"
    | "manufacturerName"
  > {}

export interface CreateAssetInput {
  assetName: string;
  assetTag?: string;
  serialNumber?: string;
  assetStatus?: AssetStatus;
  assetCondition?: AssetCondition;
  locationID?: number;
  categoryID?: number;
  manufacturerID?: number;
  modelNumber?: string;
  purchaseDate?: string;
  purchaseCost?: number;
  warrantyExpiration?: string;
  notes?: string;
}

export type UpdateAssetInput = Partial<CreateAssetInput>;
