/**
 * Drizzle Schema — Barrel Export
 *
 * Re-exports all table definitions and inferred types.
 * Import from this file for access to any schema entity:
 *   import { equipment, Equipment, NewEquipment } from '../db/schema';
 */

// Core Equipment
export {
  equipment,
  type Equipment,
  type NewEquipment,
} from './equipment';

// Locations
export {
  propertyProfile,
  assetLocations,
  type PropertyProfile,
  type NewPropertyProfile,
  type AssetLocation,
  type NewAssetLocation,
} from './locations';

// Equipment Types, Manufacturers, Models
export {
  equipmentTypes,
  manufacturers,
  manufacturerModels,
  type EquipmentType,
  type NewEquipmentType,
  type Manufacturer,
  type NewManufacturer,
  type ManufacturerModel,
  type NewManufacturerModel,
} from './types';

// Condition Tracking
export {
  equipmentConditions,
  assetConditionLogs,
  type EquipmentCondition,
  type NewEquipmentCondition,
  type AssetConditionLog,
  type NewAssetConditionLog,
} from './conditions';

// System Settings & Categories
export {
  assetHubSettings,
  assetCategories,
  type AssetHubSetting,
  type NewAssetHubSetting,
  type AssetCategory,
  type NewAssetCategory,
} from './settings';

// Asset Documents
export {
  assetDocuments,
  type AssetDocument,
  type NewAssetDocument,
} from './documents';

// Asset Hierarchies
export {
  assetHierarchies,
  type AssetHierarchy,
  type NewAssetHierarchy,
} from './hierarchies';
