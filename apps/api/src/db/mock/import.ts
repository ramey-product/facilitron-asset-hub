import type {
  ImportProvider,
  AssetRecord,
} from "../../types/providers.js";
import type {
  ImportColumnMapping,
  ImportValidationError,
  ImportValidationResult,
  ImportResult,
  ImportHistoryEntry,
  ImportFieldDefinition,
  ImportableField,
} from "@asset-hub/shared";
import { IMPORTABLE_FIELDS } from "@asset-hub/shared";
import { mockAssets } from "./data/assets.js";
import { mockProperties, mockLocations } from "./data/locations.js";
import { mockCategories } from "./data/categories.js";
import { mockManufacturers } from "./data/manufacturers.js";
import { mockEquipmentTypes } from "./data/types.js";

// In-memory storage for import history
const importHistory: ImportHistoryEntry[] = [];

// Working copy of assets for mutations (same array the asset provider uses)
// We import from data/assets.ts which is the seed. The mock asset provider
// also keeps its own working copy. For the prototype, we push to mockAssets
// directly so both providers see the same data.
let nextAssetId =
  Math.max(...mockAssets.map((a) => a.equipmentRecordID)) + 100;

/**
 * Apply column mapping to a raw row, returning a record keyed by target field names.
 */
function applyMapping(
  row: Record<string, string>,
  mapping: ImportColumnMapping[]
): Record<string, string> {
  const mapped: Record<string, string> = {};
  for (const m of mapping) {
    const value = row[m.sourceColumn];
    if (value !== undefined && value !== "") {
      mapped[m.targetField] = value;
    }
  }
  return mapped;
}

/**
 * Validate a single mapped row. Returns an array of errors for that row.
 */
function validateRow(
  rowIndex: number,
  mapped: Record<string, string>,
  customerID: number
): ImportValidationError[] {
  const errors: ImportValidationError[] = [];

  // Check required fields
  const requiredFields = IMPORTABLE_FIELDS.filter((f) => f.required);
  for (const fieldDef of requiredFields) {
    const value = mapped[fieldDef.field];
    if (!value || value.trim() === "") {
      errors.push({
        row: rowIndex + 1,
        field: fieldDef.field,
        value: value ?? "",
        message: `${fieldDef.label} is required`,
      });
    }
  }

  // Validate categoryName — must match an existing category (case-insensitive)
  if (mapped["categoryName"]) {
    const cat = mockCategories.find(
      (c) =>
        c.customerId === customerID &&
        c.name.toLowerCase() === mapped["categoryName"]!.toLowerCase()
    );
    if (!cat) {
      const available = mockCategories
        .filter((c) => c.customerId === customerID)
        .map((c) => c.name);
      errors.push({
        row: rowIndex + 1,
        field: "categoryName",
        value: mapped["categoryName"],
        message: `Category "${mapped["categoryName"]}" not found`,
        suggestion: `Available categories: ${available.join(", ")}`,
      });
    }
  }

  // Validate propertyName — must match an existing property (case-insensitive)
  if (mapped["propertyName"]) {
    const prop = mockProperties.find(
      (p) =>
        p.customerID === customerID &&
        p.propertyName.toLowerCase() === mapped["propertyName"]!.toLowerCase()
    );
    if (!prop) {
      const available = mockProperties
        .filter((p) => p.customerID === customerID)
        .map((p) => p.propertyName);
      errors.push({
        row: rowIndex + 1,
        field: "propertyName",
        value: mapped["propertyName"],
        message: `Property "${mapped["propertyName"]}" not found`,
        suggestion: `Available properties: ${available.join(", ")}`,
      });
    }
  }

  // Validate locationName — if provided, must match a location within the resolved property
  if (mapped["locationName"] && mapped["propertyName"]) {
    const prop = mockProperties.find(
      (p) =>
        p.customerID === customerID &&
        p.propertyName.toLowerCase() === mapped["propertyName"]!.toLowerCase()
    );
    if (prop) {
      const loc = mockLocations.find(
        (l) =>
          l.customerID === customerID &&
          l.propertyID === prop.propertyID &&
          l.locationName.toLowerCase() === mapped["locationName"]!.toLowerCase()
      );
      if (!loc) {
        const available = mockLocations
          .filter(
            (l) => l.customerID === customerID && l.propertyID === prop.propertyID
          )
          .map((l) => l.locationName);
        errors.push({
          row: rowIndex + 1,
          field: "locationName",
          value: mapped["locationName"],
          message: `Location "${mapped["locationName"]}" not found at property "${prop.propertyName}"`,
          suggestion:
            available.length > 0
              ? `Available locations: ${available.join(", ")}`
              : "No locations defined for this property",
        });
      }
    }
  }

  // Validate manufacturerName — if provided, must match (case-insensitive)
  if (mapped["manufacturerName"]) {
    const mfg = mockManufacturers.find(
      (m) =>
        m.customerID === customerID &&
        m.manufacturerName.toLowerCase() ===
          mapped["manufacturerName"]!.toLowerCase()
    );
    if (!mfg) {
      errors.push({
        row: rowIndex + 1,
        field: "manufacturerName",
        value: mapped["manufacturerName"],
        message: `Manufacturer "${mapped["manufacturerName"]}" not found`,
        suggestion:
          "The manufacturer will be skipped. Create it first in the Manufacturer DB.",
      });
    }
  }

  // Validate acquisitionCost — must be a valid non-negative number
  if (mapped["acquisitionCost"]) {
    const cost = parseFloat(mapped["acquisitionCost"]);
    if (isNaN(cost) || cost < 0) {
      errors.push({
        row: rowIndex + 1,
        field: "acquisitionCost",
        value: mapped["acquisitionCost"],
        message: "Purchase cost must be a non-negative number",
        suggestion: "Use a numeric value like 42500 or 42500.00",
      });
    }
  }

  // Validate expectedLifeYears — must be a valid positive integer
  if (mapped["expectedLifeYears"]) {
    const years = parseInt(mapped["expectedLifeYears"], 10);
    if (isNaN(years) || years <= 0) {
      errors.push({
        row: rowIndex + 1,
        field: "expectedLifeYears",
        value: mapped["expectedLifeYears"],
        message: "Expected life must be a positive integer",
        suggestion: "Use a whole number like 10 or 25",
      });
    }
  }

  // Validate acquisitionDate — must be parseable as a date
  if (mapped["acquisitionDate"]) {
    const d = new Date(mapped["acquisitionDate"]);
    if (isNaN(d.getTime())) {
      errors.push({
        row: rowIndex + 1,
        field: "acquisitionDate",
        value: mapped["acquisitionDate"],
        message: "Invalid date format",
        suggestion: "Use ISO format (YYYY-MM-DD) or MM/DD/YYYY",
      });
    }
  }

  // Validate warrantyExpiration — must be parseable as a date
  if (mapped["warrantyExpiration"]) {
    const d = new Date(mapped["warrantyExpiration"]);
    if (isNaN(d.getTime())) {
      errors.push({
        row: rowIndex + 1,
        field: "warrantyExpiration",
        value: mapped["warrantyExpiration"],
        message: "Invalid date format",
        suggestion: "Use ISO format (YYYY-MM-DD) or MM/DD/YYYY",
      });
    }
  }

  // Validate parentAssetId — if provided, must reference an existing asset
  if (mapped["parentAssetId"]) {
    const parentRef = mapped["parentAssetId"];
    // Try matching by equipmentBarCodeID or equipmentRecordID
    const byBarcode = mockAssets.find(
      (a) =>
        a.customerID === customerID &&
        a.isActive &&
        a.equipmentBarCodeID?.toLowerCase() === parentRef.toLowerCase()
    );
    const byId = mockAssets.find(
      (a) =>
        a.customerID === customerID &&
        a.isActive &&
        a.equipmentRecordID === parseInt(parentRef, 10)
    );
    if (!byBarcode && !byId) {
      errors.push({
        row: rowIndex + 1,
        field: "parentAssetId",
        value: parentRef,
        message: `Parent asset "${parentRef}" not found`,
        suggestion:
          "Use an existing asset barcode (e.g., AST-0001) or record ID",
      });
    }
  }

  // Validate equipmentName length
  if (mapped["equipmentName"] && mapped["equipmentName"].length > 255) {
    errors.push({
      row: rowIndex + 1,
      field: "equipmentName",
      value: mapped["equipmentName"].substring(0, 50) + "...",
      message: "Asset name exceeds 255 character limit",
    });
  }

  return errors;
}

/**
 * Resolve a parent asset reference (barcode or ID) to an equipmentRecordID.
 */
function resolveParentId(
  parentRef: string,
  customerID: number,
  newAssetsByBarcode: Map<string, number>
): number | null {
  // Check newly created assets first (for parent references within the same import)
  const fromNew = newAssetsByBarcode.get(parentRef.toLowerCase());
  if (fromNew !== undefined) return fromNew;

  // Try barcode
  const byBarcode = mockAssets.find(
    (a) =>
      a.customerID === customerID &&
      a.isActive &&
      a.equipmentBarCodeID?.toLowerCase() === parentRef.toLowerCase()
  );
  if (byBarcode) return byBarcode.equipmentRecordID;

  // Try numeric ID
  const numId = parseInt(parentRef, 10);
  if (!isNaN(numId)) {
    const byId = mockAssets.find(
      (a) =>
        a.customerID === customerID &&
        a.isActive &&
        a.equipmentRecordID === numId
    );
    if (byId) return byId.equipmentRecordID;
  }

  return null;
}

/**
 * Topological sort: order rows so parents are processed before children.
 * Rows without parentAssetId come first. Rows referencing other rows in the
 * import (by barcode/ID) come after their parents.
 */
function topologicalSort(
  rows: { index: number; mapped: Record<string, string> }[]
): { index: number; mapped: Record<string, string> }[] {
  const withoutParent: typeof rows = [];
  const withParent: typeof rows = [];

  for (const r of rows) {
    if (r.mapped["parentAssetId"]) {
      withParent.push(r);
    } else {
      withoutParent.push(r);
    }
  }

  // Simple two-pass: parents first, then children.
  // For deeper hierarchies within a single import, this is sufficient for the prototype.
  return [...withoutParent, ...withParent];
}

export const mockImportProvider: ImportProvider = {
  async validate(
    customerID: number,
    rows: Record<string, string>[],
    mapping: ImportColumnMapping[]
  ): Promise<ImportValidationResult> {
    const allErrors: ImportValidationError[] = [];
    const preview: Record<string, unknown>[] = [];

    for (let i = 0; i < rows.length; i++) {
      const mapped = applyMapping(rows[i]!, mapping);
      const rowErrors = validateRow(i, mapped, customerID);
      allErrors.push(...rowErrors);

      // Build preview for first 10 rows
      if (i < 10) {
        preview.push(mapped);
      }
    }

    // Count unique error rows
    const errorRowSet = new Set(allErrors.map((e) => e.row));
    const errorRows = errorRowSet.size;

    return {
      valid: allErrors.length === 0,
      totalRows: rows.length,
      validRows: rows.length - errorRows,
      errorRows,
      errors: allErrors,
      preview,
    };
  },

  async execute(
    customerID: number,
    contactId: number,
    filename: string,
    rows: Record<string, string>[],
    mapping: ImportColumnMapping[]
  ): Promise<ImportResult> {
    const startTime = Date.now();
    const importId = `IMP-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const errors: ImportValidationError[] = [];
    let created = 0;
    let updated = 0;
    let failed = 0;

    // Map and prepare all rows
    const mappedRows = rows.map((row, index) => ({
      index,
      mapped: applyMapping(row, mapping),
    }));

    // Topological sort so parents are processed first
    const sorted = topologicalSort(mappedRows);

    // Track newly created assets by barcode for parent resolution within this import
    const newAssetsByBarcode = new Map<string, number>();

    for (const { index, mapped } of sorted) {
      // Validate row first
      const rowErrors = validateRow(index, mapped, customerID);
      if (rowErrors.length > 0) {
        errors.push(...rowErrors);
        failed++;
        continue;
      }

      try {
        // Resolve references by name to IDs
        const category = mapped["categoryName"]
          ? mockCategories.find(
              (c) =>
                c.customerId === customerID &&
                c.name.toLowerCase() === mapped["categoryName"]!.toLowerCase()
            )
          : undefined;

        const property = mapped["propertyName"]
          ? mockProperties.find(
              (p) =>
                p.customerID === customerID &&
                p.propertyName.toLowerCase() ===
                  mapped["propertyName"]!.toLowerCase()
            )
          : undefined;

        const location =
          mapped["locationName"] && property
            ? mockLocations.find(
                (l) =>
                  l.customerID === customerID &&
                  l.propertyID === property.propertyID &&
                  l.locationName.toLowerCase() ===
                    mapped["locationName"]!.toLowerCase()
              )
            : undefined;

        const manufacturer = mapped["manufacturerName"]
          ? mockManufacturers.find(
              (m) =>
                m.customerID === customerID &&
                m.manufacturerName.toLowerCase() ===
                  mapped["manufacturerName"]!.toLowerCase()
            )
          : undefined;

        // Resolve equipment type from category
        const equipmentType =
          category
            ? mockEquipmentTypes.find(
                (t) =>
                  t.customerID === customerID &&
                  t.categorySlug === category.slug
              )
            : undefined;

        // Resolve parent
        const parentEquipmentId = mapped["parentAssetId"]
          ? resolveParentId(mapped["parentAssetId"], customerID, newAssetsByBarcode)
          : null;

        // Check for existing asset by barcode (for upsert)
        const existingByBarcode = mapped["equipmentBarCodeID"]
          ? mockAssets.find(
              (a) =>
                a.customerID === customerID &&
                a.isActive &&
                a.equipmentBarCodeID?.toLowerCase() ===
                  mapped["equipmentBarCodeID"]!.toLowerCase()
            )
          : undefined;

        // Also check by serial number for upsert
        const existingBySerial =
          !existingByBarcode && mapped["serialNumber"]
            ? mockAssets.find(
                (a) =>
                  a.customerID === customerID &&
                  a.isActive &&
                  a.serialNumber?.toLowerCase() ===
                    mapped["serialNumber"]!.toLowerCase()
              )
            : undefined;

        const existing = existingByBarcode ?? existingBySerial;

        const now = new Date().toISOString();

        if (existing) {
          // Update existing asset
          const idx = mockAssets.findIndex(
            (a) => a.equipmentRecordID === existing.equipmentRecordID
          );
          if (idx !== -1) {
            mockAssets[idx] = {
              ...existing,
              equipmentName:
                mapped["equipmentName"] || existing.equipmentName,
              equipmentDescription:
                mapped["equipmentDescription"] ??
                existing.equipmentDescription,
              serialNumber:
                mapped["serialNumber"] ?? existing.serialNumber,
              equipmentBarCodeID:
                mapped["equipmentBarCodeID"] ?? existing.equipmentBarCodeID,
              modelNumber:
                mapped["modelNumber"] ?? existing.modelNumber,
              acquisitionDate: mapped["acquisitionDate"]
                ? new Date(mapped["acquisitionDate"]).toISOString()
                : existing.acquisitionDate,
              acquisitionCost: mapped["acquisitionCost"]
                ? parseFloat(mapped["acquisitionCost"])
                : existing.acquisitionCost,
              warrantyExpiration: mapped["warrantyExpiration"]
                ? new Date(mapped["warrantyExpiration"]).toISOString()
                : existing.warrantyExpiration,
              expectedLifeYears: mapped["expectedLifeYears"]
                ? parseInt(mapped["expectedLifeYears"], 10)
                : existing.expectedLifeYears,
              notes: mapped["notes"] ?? existing.notes,
              propertyID: property?.propertyID ?? existing.propertyID,
              assetLocationID:
                location?.assetLocationID ?? existing.assetLocationID,
              equipmentTypeID:
                equipmentType?.equipmentTypeID ?? existing.equipmentTypeID,
              manufacturerRecordID:
                manufacturer?.manufacturerRecordID ??
                existing.manufacturerRecordID,
              parentEquipmentId:
                parentEquipmentId ?? existing.parentEquipmentId,
              dateModified: now,
              modifiedBy: contactId,
              propertyName: property?.propertyName ?? existing.propertyName,
              locationName: location?.locationName ?? existing.locationName,
              categorySlug: category?.slug ?? existing.categorySlug,
              categoryName: category?.name ?? existing.categoryName,
              manufacturerName:
                manufacturer?.manufacturerName ?? existing.manufacturerName,
              equipmentTypeName:
                equipmentType?.equipmentTypeName ??
                existing.equipmentTypeName,
            };
            updated++;

            // Track for parent resolution
            if (mockAssets[idx]!.equipmentBarCodeID) {
              newAssetsByBarcode.set(
                mockAssets[idx]!.equipmentBarCodeID!.toLowerCase(),
                mockAssets[idx]!.equipmentRecordID
              );
            }
          }
        } else {
          // Create new asset
          const newId = nextAssetId++;
          const newAsset: AssetRecord = {
            equipmentRecordID: newId,
            customerID,
            propertyID: property?.propertyID ?? null,
            assetLocationID: location?.assetLocationID ?? null,
            equipmentName: mapped["equipmentName"] || "Unnamed Asset",
            equipmentDescription: mapped["equipmentDescription"] ?? null,
            equipmentTypeID: equipmentType?.equipmentTypeID ?? null,
            serialNumber: mapped["serialNumber"] ?? null,
            equipmentBarCodeID: mapped["equipmentBarCodeID"] ?? null,
            manufacturerRecordID:
              manufacturer?.manufacturerRecordID ?? null,
            modelNumber: mapped["modelNumber"] ?? null,
            acquisitionDate: mapped["acquisitionDate"]
              ? new Date(mapped["acquisitionDate"]).toISOString()
              : null,
            acquisitionCost: mapped["acquisitionCost"]
              ? parseFloat(mapped["acquisitionCost"])
              : null,
            warrantyExpiration: mapped["warrantyExpiration"]
              ? new Date(mapped["warrantyExpiration"]).toISOString()
              : null,
            expectedLifeYears: mapped["expectedLifeYears"]
              ? parseInt(mapped["expectedLifeYears"], 10)
              : null,
            lifecycleStatus: "Active",
            conditionRating: null,
            lastConditionDate: null,
            isActive: true,
            dateCreated: now,
            dateModified: null,
            createdBy: contactId,
            modifiedBy: null,
            notes: mapped["notes"] ?? null,
            parentEquipmentId: parentEquipmentId,
            operationalStatus: "online",
            statusReasonCode: null,
            statusChangedAt: null,
            statusChangedBy: null,
            propertyName: property?.propertyName ?? null,
            locationName: location?.locationName ?? null,
            categorySlug: category?.slug ?? null,
            categoryName: category?.name ?? null,
            manufacturerName: manufacturer?.manufacturerName ?? null,
            equipmentTypeName: equipmentType?.equipmentTypeName ?? null,
          };

          mockAssets.push(newAsset);
          created++;

          // Track for parent resolution
          if (newAsset.equipmentBarCodeID) {
            newAssetsByBarcode.set(
              newAsset.equipmentBarCodeID.toLowerCase(),
              newId
            );
          }
        }
      } catch {
        failed++;
        errors.push({
          row: index + 1,
          field: "unknown",
          value: "",
          message: "Unexpected error processing row",
        });
      }
    }

    const duration = Date.now() - startTime;

    // Record in import history
    const historyEntry: ImportHistoryEntry = {
      id: importId,
      userId: contactId,
      username: "demo.user",
      filename,
      totalRows: rows.length,
      created,
      updated,
      failed,
      importedAt: new Date().toISOString(),
      duration,
    };
    importHistory.unshift(historyEntry);

    return {
      importId,
      totalRows: rows.length,
      created,
      updated,
      failed,
      errors,
      duration,
    };
  },

  async getHistory(customerID: number, page: number, limit: number) {
    // In the mock, all history belongs to customerID 1
    const filtered = importHistory.filter(() => customerID === 1);
    const total = filtered.length;
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  getTemplate(): ImportFieldDefinition[] {
    return IMPORTABLE_FIELDS;
  },
};
