/**
 * Mock seed data for P1-17 Parts Catalog and P1-18 Multi-Location Stock.
 * Realistic facilities maintenance parts across 8 categories.
 */

import type { PartRecord, PartCategory, StockLevel } from "@asset-hub/shared";

// ---- Part Categories ----

export const mockPartCategories: PartCategory[] = [
  { id: 1, customerID: 1, name: "Electrical", parentId: null, partCount: 7 },
  { id: 2, customerID: 1, name: "Plumbing", parentId: null, partCount: 6 },
  { id: 3, customerID: 1, name: "HVAC", parentId: null, partCount: 7 },
  { id: 4, customerID: 1, name: "Filters", parentId: null, partCount: 5 },
  { id: 5, customerID: 1, name: "Fasteners", parentId: null, partCount: 5 },
  { id: 6, customerID: 1, name: "Lighting", parentId: null, partCount: 5 },
  { id: 7, customerID: 1, name: "Safety", parentId: null, partCount: 4 },
  { id: 8, customerID: 1, name: "Janitorial", parentId: null, partCount: 6 },
];

// ---- Parts ----

export const mockParts: PartRecord[] = [
  // Electrical (categoryId: 1)
  { id: 1, customerID: 1, sku: "EL-BRK-20A", name: "20A Circuit Breaker", description: "Single-pole 20-amp circuit breaker, Square D QO series", categoryId: 1, categoryName: "Electrical", unitCost: 8.50, unitOfMeasure: "each", vendorId: 1, vendorName: "Grainger", minQty: 10, maxQty: 100, reorderPoint: 15, storageLocation: "Bin A-12", imageUrl: null, isActive: true, createdAt: "2025-06-15T10:00:00Z", updatedAt: "2025-12-01T08:30:00Z" },
  { id: 2, customerID: 1, sku: "EL-WIRE-12G", name: "12 AWG THHN Wire (500ft)", description: "Solid copper THHN/THWN wire, 500ft spool, black", categoryId: 1, categoryName: "Electrical", unitCost: 89.99, unitOfMeasure: "spool", vendorId: 1, vendorName: "Grainger", minQty: 2, maxQty: 20, reorderPoint: 3, storageLocation: "Shelf B-3", imageUrl: null, isActive: true, createdAt: "2025-06-15T10:00:00Z", updatedAt: "2025-11-15T14:20:00Z" },
  { id: 3, customerID: 1, sku: "EL-OUTLET-DPX", name: "Duplex Outlet (20A)", description: "Commercial grade 20A 125V duplex receptacle, white", categoryId: 1, categoryName: "Electrical", unitCost: 3.25, unitOfMeasure: "each", vendorId: 1, vendorName: "Grainger", minQty: 20, maxQty: 200, reorderPoint: 30, storageLocation: "Bin A-14", imageUrl: null, isActive: true, createdAt: "2025-06-15T10:00:00Z", updatedAt: "2025-12-10T09:00:00Z" },
  { id: 4, customerID: 1, sku: "EL-CNDUIT-1IN", name: "1\" EMT Conduit (10ft)", description: "Electrical metallic tubing, 1-inch diameter, 10-foot length", categoryId: 1, categoryName: "Electrical", unitCost: 12.75, unitOfMeasure: "stick", vendorId: 1, vendorName: "Grainger", minQty: 5, maxQty: 50, reorderPoint: 8, storageLocation: "Rack C-1", imageUrl: null, isActive: true, createdAt: "2025-07-01T10:00:00Z", updatedAt: "2025-12-01T08:30:00Z" },
  { id: 5, customerID: 1, sku: "EL-SWITCH-SP", name: "Single Pole Switch (15A)", description: "Commercial grade single-pole toggle switch, ivory", categoryId: 1, categoryName: "Electrical", unitCost: 2.10, unitOfMeasure: "each", vendorId: 1, vendorName: "Grainger", minQty: 15, maxQty: 150, reorderPoint: 25, storageLocation: "Bin A-13", imageUrl: null, isActive: true, createdAt: "2025-07-01T10:00:00Z", updatedAt: "2025-11-20T16:45:00Z" },
  { id: 6, customerID: 1, sku: "EL-PANEL-200A", name: "200A Main Breaker Panel", description: "200-amp main breaker load center, 40-space/40-circuit", categoryId: 1, categoryName: "Electrical", unitCost: 289.00, unitOfMeasure: "each", vendorId: 1, vendorName: "Grainger", minQty: 0, maxQty: 5, reorderPoint: 1, storageLocation: "Shelf B-1", imageUrl: null, isActive: true, createdAt: "2025-08-01T10:00:00Z", updatedAt: "2025-12-15T11:00:00Z" },
  { id: 7, customerID: 1, sku: "EL-GFCI-20A", name: "GFCI Outlet (20A)", description: "Ground fault circuit interrupter, 20A, weather-resistant", categoryId: 1, categoryName: "Electrical", unitCost: 18.50, unitOfMeasure: "each", vendorId: 1, vendorName: "Grainger", minQty: 5, maxQty: 50, reorderPoint: 8, storageLocation: "Bin A-15", imageUrl: null, isActive: true, createdAt: "2025-08-01T10:00:00Z", updatedAt: "2025-12-01T08:30:00Z" },

  // Plumbing (categoryId: 2)
  { id: 8, customerID: 1, sku: "PL-VALVE-1IN", name: "1\" Ball Valve (Brass)", description: "Full port brass ball valve, 1-inch threaded", categoryId: 2, categoryName: "Plumbing", unitCost: 15.99, unitOfMeasure: "each", vendorId: 2, vendorName: "Ferguson Supply", minQty: 5, maxQty: 40, reorderPoint: 8, storageLocation: "Bin D-5", imageUrl: null, isActive: true, createdAt: "2025-06-15T10:00:00Z", updatedAt: "2025-11-28T13:15:00Z" },
  { id: 9, customerID: 1, sku: "PL-FLUSHKIT", name: "Universal Flush Valve Kit", description: "2-inch flush valve repair kit with flapper and gasket", categoryId: 2, categoryName: "Plumbing", unitCost: 12.49, unitOfMeasure: "kit", vendorId: 2, vendorName: "Ferguson Supply", minQty: 10, maxQty: 80, reorderPoint: 15, storageLocation: "Bin D-8", imageUrl: null, isActive: true, createdAt: "2025-06-15T10:00:00Z", updatedAt: "2025-12-05T10:30:00Z" },
  { id: 10, customerID: 1, sku: "PL-PIPE-PVC-2", name: "2\" PVC Pipe (10ft)", description: "Schedule 40 PVC pipe, 2-inch diameter, 10-foot length", categoryId: 2, categoryName: "Plumbing", unitCost: 7.25, unitOfMeasure: "stick", vendorId: 2, vendorName: "Ferguson Supply", minQty: 5, maxQty: 30, reorderPoint: 8, storageLocation: "Rack C-3", imageUrl: null, isActive: true, createdAt: "2025-07-01T10:00:00Z", updatedAt: "2025-12-01T08:30:00Z" },
  { id: 11, customerID: 1, sku: "PL-FAUCET-LAV", name: "Lavatory Faucet (Chrome)", description: "Single-handle lavatory faucet, chrome finish, ADA compliant", categoryId: 2, categoryName: "Plumbing", unitCost: 65.00, unitOfMeasure: "each", vendorId: 2, vendorName: "Ferguson Supply", minQty: 2, maxQty: 15, reorderPoint: 3, storageLocation: "Shelf E-2", imageUrl: null, isActive: true, createdAt: "2025-07-15T10:00:00Z", updatedAt: "2025-12-10T09:00:00Z" },
  { id: 12, customerID: 1, sku: "PL-TRAP-1.5", name: "1-1/2\" P-Trap (PVC)", description: "PVC P-trap, 1-1/2 inch, with cleanout", categoryId: 2, categoryName: "Plumbing", unitCost: 6.75, unitOfMeasure: "each", vendorId: 2, vendorName: "Ferguson Supply", minQty: 8, maxQty: 60, reorderPoint: 12, storageLocation: "Bin D-6", imageUrl: null, isActive: true, createdAt: "2025-08-01T10:00:00Z", updatedAt: "2025-11-20T16:45:00Z" },
  { id: 13, customerID: 1, sku: "PL-SUPPLY-3/8", name: "3/8\" Supply Line (20\")", description: "Braided stainless steel supply line, 3/8\" x 20\"", categoryId: 2, categoryName: "Plumbing", unitCost: 8.99, unitOfMeasure: "each", vendorId: 2, vendorName: "Ferguson Supply", minQty: 10, maxQty: 80, reorderPoint: 15, storageLocation: "Bin D-7", imageUrl: null, isActive: true, createdAt: "2025-08-15T10:00:00Z", updatedAt: "2025-12-01T08:30:00Z" },

  // HVAC (categoryId: 3)
  { id: 14, customerID: 1, sku: "HV-BELT-A48", name: "V-Belt A48", description: "A48 classical V-belt for commercial HVAC blower motors", categoryId: 3, categoryName: "HVAC", unitCost: 11.25, unitOfMeasure: "each", vendorId: 3, vendorName: "Johnstone Supply", minQty: 4, maxQty: 30, reorderPoint: 6, storageLocation: "Bin F-2", imageUrl: null, isActive: true, createdAt: "2025-06-15T10:00:00Z", updatedAt: "2025-12-01T08:30:00Z" },
  { id: 15, customerID: 1, sku: "HV-CAPACITOR-45", name: "Run Capacitor 45/5 MFD", description: "Dual run capacitor, 45/5 MFD, 440V, round", categoryId: 3, categoryName: "HVAC", unitCost: 18.75, unitOfMeasure: "each", vendorId: 3, vendorName: "Johnstone Supply", minQty: 3, maxQty: 25, reorderPoint: 5, storageLocation: "Bin F-4", imageUrl: null, isActive: true, createdAt: "2025-06-15T10:00:00Z", updatedAt: "2025-11-28T13:15:00Z" },
  { id: 16, customerID: 1, sku: "HV-CONTACTOR-30A", name: "30A Contactor (2-Pole)", description: "2-pole definite purpose contactor, 30A, 24V coil", categoryId: 3, categoryName: "HVAC", unitCost: 22.50, unitOfMeasure: "each", vendorId: 3, vendorName: "Johnstone Supply", minQty: 3, maxQty: 20, reorderPoint: 5, storageLocation: "Bin F-5", imageUrl: null, isActive: true, createdAt: "2025-07-01T10:00:00Z", updatedAt: "2025-12-05T10:30:00Z" },
  { id: 17, customerID: 1, sku: "HV-THERMOSTAT-PRG", name: "Programmable Thermostat", description: "7-day programmable thermostat, dual-stage heating/cooling", categoryId: 3, categoryName: "HVAC", unitCost: 45.00, unitOfMeasure: "each", vendorId: 3, vendorName: "Johnstone Supply", minQty: 2, maxQty: 15, reorderPoint: 3, storageLocation: "Shelf G-1", imageUrl: null, isActive: true, createdAt: "2025-07-15T10:00:00Z", updatedAt: "2025-12-10T09:00:00Z" },
  { id: 18, customerID: 1, sku: "HV-REFRIG-R410A", name: "R-410A Refrigerant (25lb)", description: "R-410A refrigerant, 25-lb cylinder, EPA certified", categoryId: 3, categoryName: "HVAC", unitCost: 175.00, unitOfMeasure: "cylinder", vendorId: 3, vendorName: "Johnstone Supply", minQty: 1, maxQty: 8, reorderPoint: 2, storageLocation: "Cage H-1", imageUrl: null, isActive: true, createdAt: "2025-08-01T10:00:00Z", updatedAt: "2025-12-15T11:00:00Z" },
  { id: 19, customerID: 1, sku: "HV-MOTOR-1/3HP", name: "1/3 HP Blower Motor", description: "1/3 HP direct drive blower motor, 1075 RPM, 115V", categoryId: 3, categoryName: "HVAC", unitCost: 135.00, unitOfMeasure: "each", vendorId: 3, vendorName: "Johnstone Supply", minQty: 1, maxQty: 8, reorderPoint: 2, storageLocation: "Shelf G-2", imageUrl: null, isActive: true, createdAt: "2025-08-15T10:00:00Z", updatedAt: "2025-12-01T08:30:00Z" },
  { id: 20, customerID: 1, sku: "HV-IGNITOR-HOT", name: "Hot Surface Ignitor", description: "Universal hot surface ignitor, silicon nitride, 120V", categoryId: 3, categoryName: "HVAC", unitCost: 28.00, unitOfMeasure: "each", vendorId: 3, vendorName: "Johnstone Supply", minQty: 3, maxQty: 20, reorderPoint: 5, storageLocation: "Bin F-6", imageUrl: null, isActive: true, createdAt: "2025-09-01T10:00:00Z", updatedAt: "2025-11-20T16:45:00Z" },

  // Filters (categoryId: 4)
  { id: 21, customerID: 1, sku: "FL-MERV8-20X25", name: "MERV 8 Filter (20x25x1)", description: "Pleated air filter, MERV 8, 20x25x1 inch", categoryId: 4, categoryName: "Filters", unitCost: 5.50, unitOfMeasure: "each", vendorId: 3, vendorName: "Johnstone Supply", minQty: 24, maxQty: 200, reorderPoint: 36, storageLocation: "Shelf J-1", imageUrl: null, isActive: true, createdAt: "2025-06-15T10:00:00Z", updatedAt: "2025-12-01T08:30:00Z" },
  { id: 22, customerID: 1, sku: "FL-MERV13-20X25", name: "MERV 13 Filter (20x25x1)", description: "High efficiency pleated air filter, MERV 13, 20x25x1 inch", categoryId: 4, categoryName: "Filters", unitCost: 14.75, unitOfMeasure: "each", vendorId: 3, vendorName: "Johnstone Supply", minQty: 12, maxQty: 100, reorderPoint: 20, storageLocation: "Shelf J-2", imageUrl: null, isActive: true, createdAt: "2025-06-15T10:00:00Z", updatedAt: "2025-11-28T13:15:00Z" },
  { id: 23, customerID: 1, sku: "FL-MERV8-16X20", name: "MERV 8 Filter (16x20x1)", description: "Pleated air filter, MERV 8, 16x20x1 inch", categoryId: 4, categoryName: "Filters", unitCost: 4.75, unitOfMeasure: "each", vendorId: 3, vendorName: "Johnstone Supply", minQty: 24, maxQty: 200, reorderPoint: 36, storageLocation: "Shelf J-1", imageUrl: null, isActive: true, createdAt: "2025-07-01T10:00:00Z", updatedAt: "2025-12-05T10:30:00Z" },
  { id: 24, customerID: 1, sku: "FL-WATER-10", name: "10\" Water Filter Cartridge", description: "Sediment water filter cartridge, 10-inch, 5 micron", categoryId: 4, categoryName: "Filters", unitCost: 8.99, unitOfMeasure: "each", vendorId: 2, vendorName: "Ferguson Supply", minQty: 6, maxQty: 50, reorderPoint: 10, storageLocation: "Bin D-10", imageUrl: null, isActive: true, createdAt: "2025-07-15T10:00:00Z", updatedAt: "2025-12-10T09:00:00Z" },
  { id: 25, customerID: 1, sku: "FL-OIL-BURNER", name: "Oil Burner Nozzle Filter", description: "In-line oil filter for burner nozzle, sintered bronze", categoryId: 4, categoryName: "Filters", unitCost: 3.25, unitOfMeasure: "each", vendorId: 3, vendorName: "Johnstone Supply", minQty: 6, maxQty: 40, reorderPoint: 10, storageLocation: "Bin F-8", imageUrl: null, isActive: true, createdAt: "2025-08-01T10:00:00Z", updatedAt: "2025-11-20T16:45:00Z" },

  // Fasteners (categoryId: 5)
  { id: 26, customerID: 1, sku: "FS-BOLT-3/8X2", name: "3/8\" x 2\" Hex Bolt (25pk)", description: "Grade 5 hex bolt, 3/8-16 x 2 inch, zinc plated, 25-pack", categoryId: 5, categoryName: "Fasteners", unitCost: 9.50, unitOfMeasure: "pack", vendorId: 4, vendorName: "Fastenal", minQty: 5, maxQty: 40, reorderPoint: 8, storageLocation: "Bin K-1", imageUrl: null, isActive: true, createdAt: "2025-06-15T10:00:00Z", updatedAt: "2025-12-01T08:30:00Z" },
  { id: 27, customerID: 1, sku: "FS-SCREW-DRYWALL", name: "Drywall Screws #6 x 1-5/8\" (1lb)", description: "Coarse thread drywall screws, #6 x 1-5/8 inch, 1-lb box", categoryId: 5, categoryName: "Fasteners", unitCost: 6.25, unitOfMeasure: "box", vendorId: 4, vendorName: "Fastenal", minQty: 5, maxQty: 40, reorderPoint: 8, storageLocation: "Bin K-2", imageUrl: null, isActive: true, createdAt: "2025-06-15T10:00:00Z", updatedAt: "2025-11-28T13:15:00Z" },
  { id: 28, customerID: 1, sku: "FS-ANCHOR-1/4", name: "1/4\" Concrete Anchor (50pk)", description: "Wedge anchor, 1/4 x 2-1/4 inch, zinc plated, 50-pack", categoryId: 5, categoryName: "Fasteners", unitCost: 24.99, unitOfMeasure: "pack", vendorId: 4, vendorName: "Fastenal", minQty: 3, maxQty: 25, reorderPoint: 5, storageLocation: "Bin K-3", imageUrl: null, isActive: true, createdAt: "2025-07-01T10:00:00Z", updatedAt: "2025-12-05T10:30:00Z" },
  { id: 29, customerID: 1, sku: "FS-NUT-3/8", name: "3/8\" Hex Nut (100pk)", description: "3/8-16 hex nut, grade 5, zinc plated, 100-pack", categoryId: 5, categoryName: "Fasteners", unitCost: 7.50, unitOfMeasure: "pack", vendorId: 4, vendorName: "Fastenal", minQty: 3, maxQty: 25, reorderPoint: 5, storageLocation: "Bin K-1", imageUrl: null, isActive: true, createdAt: "2025-07-15T10:00:00Z", updatedAt: "2025-12-10T09:00:00Z" },
  { id: 30, customerID: 1, sku: "FS-WASHER-3/8", name: "3/8\" Flat Washer (100pk)", description: "SAE flat washer, 3/8 inch, zinc plated, 100-pack", categoryId: 5, categoryName: "Fasteners", unitCost: 4.99, unitOfMeasure: "pack", vendorId: 4, vendorName: "Fastenal", minQty: 3, maxQty: 25, reorderPoint: 5, storageLocation: "Bin K-1", imageUrl: null, isActive: true, createdAt: "2025-08-01T10:00:00Z", updatedAt: "2025-11-20T16:45:00Z" },

  // Lighting (categoryId: 6)
  { id: 31, customerID: 1, sku: "LT-LED-T8-4FT", name: "LED T8 Tube (4ft, 18W)", description: "4-foot LED T8 tube, 18W, 4000K, Type A/B compatible", categoryId: 6, categoryName: "Lighting", unitCost: 7.99, unitOfMeasure: "each", vendorId: 5, vendorName: "HD Supply", minQty: 20, maxQty: 200, reorderPoint: 30, storageLocation: "Shelf L-1", imageUrl: null, isActive: true, createdAt: "2025-06-15T10:00:00Z", updatedAt: "2025-12-01T08:30:00Z" },
  { id: 32, customerID: 1, sku: "LT-LED-PANEL-2X2", name: "LED Panel Light (2x2, 40W)", description: "2x2 foot LED flat panel, 40W, 5000K, drop ceiling mount", categoryId: 6, categoryName: "Lighting", unitCost: 42.00, unitOfMeasure: "each", vendorId: 5, vendorName: "HD Supply", minQty: 4, maxQty: 30, reorderPoint: 6, storageLocation: "Shelf L-2", imageUrl: null, isActive: true, createdAt: "2025-06-15T10:00:00Z", updatedAt: "2025-11-28T13:15:00Z" },
  { id: 33, customerID: 1, sku: "LT-EXIT-LED", name: "LED Exit Sign", description: "LED exit sign with emergency battery backup, red letters", categoryId: 6, categoryName: "Lighting", unitCost: 32.00, unitOfMeasure: "each", vendorId: 5, vendorName: "HD Supply", minQty: 2, maxQty: 15, reorderPoint: 3, storageLocation: "Shelf L-3", imageUrl: null, isActive: true, createdAt: "2025-07-01T10:00:00Z", updatedAt: "2025-12-05T10:30:00Z" },
  { id: 34, customerID: 1, sku: "LT-BALLAST-T8", name: "Electronic Ballast (T8, 4-lamp)", description: "Electronic instant start ballast, 4-lamp T8, 120-277V", categoryId: 6, categoryName: "Lighting", unitCost: 28.50, unitOfMeasure: "each", vendorId: 5, vendorName: "HD Supply", minQty: 3, maxQty: 20, reorderPoint: 5, storageLocation: "Shelf L-4", imageUrl: null, isActive: false, createdAt: "2025-07-15T10:00:00Z", updatedAt: "2026-01-10T09:00:00Z" },
  { id: 35, customerID: 1, sku: "LT-SENSOR-OCC", name: "Occupancy Sensor Switch", description: "PIR occupancy sensor wall switch, 180-degree, white", categoryId: 6, categoryName: "Lighting", unitCost: 24.00, unitOfMeasure: "each", vendorId: 5, vendorName: "HD Supply", minQty: 3, maxQty: 25, reorderPoint: 5, storageLocation: "Bin A-16", imageUrl: null, isActive: true, createdAt: "2025-08-01T10:00:00Z", updatedAt: "2025-12-01T08:30:00Z" },

  // Safety (categoryId: 7)
  { id: 36, customerID: 1, sku: "SF-SMOKE-PHT", name: "Photoelectric Smoke Detector", description: "Hardwired photoelectric smoke detector with battery backup", categoryId: 7, categoryName: "Safety", unitCost: 22.00, unitOfMeasure: "each", vendorId: 5, vendorName: "HD Supply", minQty: 5, maxQty: 40, reorderPoint: 8, storageLocation: "Shelf M-1", imageUrl: null, isActive: true, createdAt: "2025-06-15T10:00:00Z", updatedAt: "2025-12-01T08:30:00Z" },
  { id: 37, customerID: 1, sku: "SF-EXTINGUISH-5", name: "Fire Extinguisher (5lb ABC)", description: "5-lb ABC dry chemical fire extinguisher with bracket", categoryId: 7, categoryName: "Safety", unitCost: 48.00, unitOfMeasure: "each", vendorId: 6, vendorName: "Safety First Supply", minQty: 2, maxQty: 20, reorderPoint: 4, storageLocation: "Shelf M-2", imageUrl: null, isActive: true, createdAt: "2025-07-01T10:00:00Z", updatedAt: "2025-11-28T13:15:00Z" },
  { id: 38, customerID: 1, sku: "SF-FIRSTAID-KIT", name: "First Aid Kit (50-person)", description: "OSHA-compliant 50-person first aid kit, wall mountable", categoryId: 7, categoryName: "Safety", unitCost: 35.00, unitOfMeasure: "kit", vendorId: 6, vendorName: "Safety First Supply", minQty: 1, maxQty: 10, reorderPoint: 2, storageLocation: "Shelf M-3", imageUrl: null, isActive: true, createdAt: "2025-07-15T10:00:00Z", updatedAt: "2025-12-05T10:30:00Z" },
  { id: 39, customerID: 1, sku: "SF-EYEWASH-CART", name: "Emergency Eyewash Cartridge", description: "Replacement cartridge for gravity-fed eyewash station", categoryId: 7, categoryName: "Safety", unitCost: 42.00, unitOfMeasure: "each", vendorId: 6, vendorName: "Safety First Supply", minQty: 2, maxQty: 12, reorderPoint: 3, storageLocation: "Shelf M-4", imageUrl: null, isActive: true, createdAt: "2025-08-01T10:00:00Z", updatedAt: "2025-12-10T09:00:00Z" },

  // Janitorial (categoryId: 8)
  { id: 40, customerID: 1, sku: "JN-TRASH-44GAL", name: "Trash Bag 44 Gallon (100ct)", description: "Heavy duty 44-gallon trash bag, 1.5mil, black, 100-count", categoryId: 8, categoryName: "Janitorial", unitCost: 32.00, unitOfMeasure: "case", vendorId: 7, vendorName: "CleanSource Pro", minQty: 3, maxQty: 20, reorderPoint: 5, storageLocation: "Shelf N-1", imageUrl: null, isActive: true, createdAt: "2025-06-15T10:00:00Z", updatedAt: "2025-12-01T08:30:00Z" },
  { id: 41, customerID: 1, sku: "JN-CLEANER-MP", name: "Multi-Purpose Cleaner (1gal)", description: "Concentrated all-purpose cleaner, 1-gallon bottle", categoryId: 8, categoryName: "Janitorial", unitCost: 15.99, unitOfMeasure: "gallon", vendorId: 7, vendorName: "CleanSource Pro", minQty: 4, maxQty: 30, reorderPoint: 6, storageLocation: "Shelf N-2", imageUrl: null, isActive: true, createdAt: "2025-06-15T10:00:00Z", updatedAt: "2025-11-28T13:15:00Z" },
  { id: 42, customerID: 1, sku: "JN-MOP-HEAD", name: "Wet Mop Head (Large)", description: "Cotton wet mop head, large, looped end, 5-inch band", categoryId: 8, categoryName: "Janitorial", unitCost: 8.50, unitOfMeasure: "each", vendorId: 7, vendorName: "CleanSource Pro", minQty: 4, maxQty: 30, reorderPoint: 6, storageLocation: "Shelf N-3", imageUrl: null, isActive: true, createdAt: "2025-07-01T10:00:00Z", updatedAt: "2025-12-05T10:30:00Z" },
  { id: 43, customerID: 1, sku: "JN-PAPER-TOWEL", name: "Paper Towel Roll (6pk)", description: "Hardwound paper towel roll, 800ft, natural, 6-pack", categoryId: 8, categoryName: "Janitorial", unitCost: 44.00, unitOfMeasure: "case", vendorId: 7, vendorName: "CleanSource Pro", minQty: 3, maxQty: 20, reorderPoint: 5, storageLocation: "Shelf N-4", imageUrl: null, isActive: true, createdAt: "2025-07-15T10:00:00Z", updatedAt: "2025-12-10T09:00:00Z" },
  { id: 44, customerID: 1, sku: "JN-TP-JUMBO", name: "Jumbo Toilet Paper (12pk)", description: "Jumbo roll toilet paper, 2-ply, 12-pack, 1000ft/roll", categoryId: 8, categoryName: "Janitorial", unitCost: 38.00, unitOfMeasure: "case", vendorId: 7, vendorName: "CleanSource Pro", minQty: 3, maxQty: 20, reorderPoint: 5, storageLocation: "Shelf N-5", imageUrl: null, isActive: true, createdAt: "2025-08-01T10:00:00Z", updatedAt: "2025-11-20T16:45:00Z" },
  { id: 45, customerID: 1, sku: "JN-SANITIZER-GL", name: "Hand Sanitizer (1gal refill)", description: "Gel hand sanitizer refill, 70% alcohol, 1 gallon", categoryId: 8, categoryName: "Janitorial", unitCost: 22.00, unitOfMeasure: "gallon", vendorId: 7, vendorName: "CleanSource Pro", minQty: 2, maxQty: 15, reorderPoint: 4, storageLocation: "Shelf N-6", imageUrl: null, isActive: true, createdAt: "2025-08-15T10:00:00Z", updatedAt: "2025-12-01T08:30:00Z" },
];

// ---- Stock Locations ----

const LOCATIONS = [
  { id: 1, name: "Main Warehouse" },
  { id: 2, name: "North Facility" },
  { id: 3, name: "South Facility" },
  { id: 4, name: "Mobile Unit A" },
  { id: 5, name: "East Campus" },
];

// ---- Stock Levels (generated for each part across locations) ----

let stockId = 1;

function generateStockForPart(partId: number, reorderPoint: number): StockLevel[] {
  // Each part appears in 2-4 locations
  const numLocations = 2 + (partId % 3); // 2, 3, or 4
  const locations = LOCATIONS.slice(0, numLocations);

  return locations.map((loc) => {
    // Create variety: some parts intentionally low/out of stock
    let qtyOnHand: number;
    if (partId % 7 === 0) {
      // Out of stock at some locations
      qtyOnHand = loc.id === 1 ? Math.max(0, reorderPoint - 5) : 0;
    } else if (partId % 5 === 0) {
      // Low stock
      qtyOnHand = Math.max(1, Math.floor(reorderPoint * 0.4) + (loc.id * 2));
    } else {
      // Normal stock
      qtyOnHand = reorderPoint + (loc.id * 5) + (partId % 10) * 3;
    }

    const qtyReserved = Math.min(Math.floor(qtyOnHand * 0.1), qtyOnHand);
    const daysAgo = (partId * 3 + loc.id * 7) % 90;
    const countDate = new Date();
    countDate.setDate(countDate.getDate() - daysAgo);

    return {
      id: stockId++,
      partId,
      locationId: loc.id,
      locationName: loc.name,
      qtyOnHand,
      qtyReserved,
      available: qtyOnHand - qtyReserved,
      lastCountDate: countDate.toISOString(),
      lastCountBy: daysAgo < 30 ? "John Smith" : daysAgo < 60 ? "Maria Garcia" : "Bob Wilson",
    };
  });
}

export const mockStockLevels: StockLevel[] = mockParts
  .filter((p) => p.isActive)
  .flatMap((p) => generateStockForPart(p.id, p.reorderPoint));
