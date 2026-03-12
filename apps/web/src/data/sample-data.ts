// Rotten Robbie Gas Station Chain — Sample Data
// 3-level hierarchy: Property → System → Component

export type Condition = "Excellent" | "Good" | "Fair" | "Poor" | "Critical";
export type LifecycleStage = "Active" | "Under Maintenance" | "Flagged for Replacement" | "Decommissioned";
export type AssetCategory = "Fuel System" | "HVAC" | "Refrigeration" | "POS & IT" | "Lighting" | "Signage" | "Safety" | "Plumbing" | "Electrical";

export interface AssetAttachment {
  id: string;
  name: string;
  type: "manual" | "warranty" | "spec_sheet" | "photo" | "other";
  mimeType: string;
  size: string; // human readable, e.g. "2.4 MB"
  url: string;
  source: "manufacturer_auto" | "user_upload";
  addedDate: string;
}

export interface Asset {
  id: string;
  name: string;
  description: string;
  category: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchaseCost: number;
  warrantyExpiration: string;
  propertyId: string;
  propertyName: string;
  location: string;
  condition: Condition;
  lifecycleStage: LifecycleStage;
  parentId: string | null;
  children?: string[];
  lastServiceDate: string;
  nextServiceDue: string;
  totalMaintenanceCost: number;
  workOrderCount: number;
  assetTag: string;
  attachments?: AssetAttachment[];
  specs?: Record<string, string>;
  productUrl?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  region: string;
  assetCount: number;
  openWorkOrders: number;
}

export interface WorkOrder {
  id: string;
  title: string;
  assetId: string;
  assetName: string;
  propertyName: string;
  status: "Open" | "In Progress" | "Completed" | "Cancelled";
  priority: "Low" | "Medium" | "High" | "Critical";
  createdDate: string;
  completedDate: string | null;
  assignedTo: string;
  cost: number;
}

// --- PROPERTIES (12 representative locations out of 60+) ---
export const properties: Property[] = [
  { id: "prop-001", name: "Store #101 - San Jose Almaden", address: "5730 Almaden Expy", city: "San Jose", state: "CA", region: "South Bay", assetCount: 47, openWorkOrders: 3 },
  { id: "prop-002", name: "Store #102 - Milpitas", address: "1899 Calaveras Blvd", city: "Milpitas", state: "CA", region: "South Bay", assetCount: 42, openWorkOrders: 1 },
  { id: "prop-003", name: "Store #105 - Sunnyvale", address: "825 E El Camino Real", city: "Sunnyvale", state: "CA", region: "South Bay", assetCount: 51, openWorkOrders: 5 },
  { id: "prop-004", name: "Store #108 - Fremont", address: "3440 Mowry Ave", city: "Fremont", state: "CA", region: "East Bay", assetCount: 39, openWorkOrders: 2 },
  { id: "prop-005", name: "Store #112 - Hayward", address: "22120 Mission Blvd", city: "Hayward", state: "CA", region: "East Bay", assetCount: 44, openWorkOrders: 4 },
  { id: "prop-006", name: "Store #115 - San Mateo", address: "2020 S El Camino Real", city: "San Mateo", state: "CA", region: "Peninsula", assetCount: 38, openWorkOrders: 1 },
  { id: "prop-007", name: "Store #118 - Redwood City", address: "610 Veterans Blvd", city: "Redwood City", state: "CA", region: "Peninsula", assetCount: 45, openWorkOrders: 3 },
  { id: "prop-008", name: "Store #122 - Santa Clara", address: "1050 Walsh Ave", city: "Santa Clara", state: "CA", region: "South Bay", assetCount: 41, openWorkOrders: 2 },
  { id: "prop-009", name: "Store #125 - Mountain View", address: "170 E El Camino Real", city: "Mountain View", state: "CA", region: "South Bay", assetCount: 48, openWorkOrders: 6 },
  { id: "prop-010", name: "Store #130 - Palo Alto", address: "3959 El Camino Real", city: "Palo Alto", state: "CA", region: "Peninsula", assetCount: 36, openWorkOrders: 1 },
  { id: "prop-011", name: "Store #135 - Newark", address: "6155 Jarvis Ave", city: "Newark", state: "CA", region: "East Bay", assetCount: 43, openWorkOrders: 3 },
  { id: "prop-012", name: "Store #140 - Campbell", address: "525 E Hamilton Ave", city: "Campbell", state: "CA", region: "South Bay", assetCount: 40, openWorkOrders: 2 },
];

// --- ASSETS (representative set showing 3-level hierarchy) ---
export const assets: Asset[] = [
  // === STORE #101 - San Jose Almaden ===
  // Level 1: Systems
  {
    id: "ast-001", name: "Fuel Dispensing System", description: "Complete fuel delivery and dispensing system for all islands", category: "Fuel System",
    manufacturer: "Gilbarco Veeder-Root", model: "Encore 700 S", serialNumber: "GVR-700-2019-4421", purchaseDate: "2019-03-15", purchaseCost: 185000,
    warrantyExpiration: "2029-03-15", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Fuel Islands",
    condition: "Good", lifecycleStage: "Active", parentId: null, children: ["ast-002", "ast-003", "ast-004", "ast-005"],
    lastServiceDate: "2026-01-28", nextServiceDue: "2026-04-28", totalMaintenanceCost: 12400, workOrderCount: 8, assetTag: "RR-101-FUEL-001"
  },
  // Level 2: Components under Fuel System
  {
    id: "ast-002", name: "Fuel Pump #1 - Island A", description: "Multi-product dispenser, 4 hoses (Regular, Plus, Premium, Diesel)", category: "Fuel System",
    manufacturer: "Gilbarco Veeder-Root", model: "Encore 700 S", serialNumber: "GVR-DISP-2019-0112", purchaseDate: "2019-03-15", purchaseCost: 32000,
    warrantyExpiration: "2029-03-15", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Fuel Island A",
    condition: "Good", lifecycleStage: "Active", parentId: "ast-001", lastServiceDate: "2026-01-28", nextServiceDue: "2026-04-28",
    totalMaintenanceCost: 2100, workOrderCount: 3, assetTag: "RR-101-FUEL-002"
  },
  {
    id: "ast-003", name: "Fuel Pump #2 - Island A", description: "Multi-product dispenser, 4 hoses", category: "Fuel System",
    manufacturer: "Gilbarco Veeder-Root", model: "Encore 700 S", serialNumber: "GVR-DISP-2019-0113", purchaseDate: "2019-03-15", purchaseCost: 32000,
    warrantyExpiration: "2029-03-15", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Fuel Island A",
    condition: "Fair", lifecycleStage: "Active", parentId: "ast-001", lastServiceDate: "2026-02-05", nextServiceDue: "2026-05-05",
    totalMaintenanceCost: 4800, workOrderCount: 5, assetTag: "RR-101-FUEL-003"
  },
  {
    id: "ast-004", name: "Fuel Pump #3 - Island B", description: "Multi-product dispenser, 4 hoses", category: "Fuel System",
    manufacturer: "Gilbarco Veeder-Root", model: "Encore 700 S", serialNumber: "GVR-DISP-2019-0114", purchaseDate: "2019-03-15", purchaseCost: 32000,
    warrantyExpiration: "2029-03-15", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Fuel Island B",
    condition: "Good", lifecycleStage: "Active", parentId: "ast-001", lastServiceDate: "2025-12-10", nextServiceDue: "2026-03-10",
    totalMaintenanceCost: 1500, workOrderCount: 2, assetTag: "RR-101-FUEL-004"
  },
  {
    id: "ast-005", name: "Underground Storage Tank - Regular", description: "12,000 gallon double-wall fiberglass UST for regular unleaded", category: "Fuel System",
    manufacturer: "Xerxes Corporation", model: "FRP 12000-DW", serialNumber: "XRX-UST-2018-0887", purchaseDate: "2018-06-20", purchaseCost: 45000,
    warrantyExpiration: "2048-06-20", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Underground - West",
    condition: "Excellent", lifecycleStage: "Active", parentId: "ast-001", lastServiceDate: "2025-11-15", nextServiceDue: "2026-05-15",
    totalMaintenanceCost: 3200, workOrderCount: 2, assetTag: "RR-101-FUEL-005"
  },
  // HVAC System
  {
    id: "ast-006", name: "HVAC System - Store", description: "Rooftop package unit serving main store area", category: "HVAC",
    manufacturer: "Carrier", model: "50XC 060", serialNumber: "CAR-RTU-2020-7891", purchaseDate: "2020-08-10", purchaseCost: 28000,
    warrantyExpiration: "2030-08-10", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Rooftop",
    condition: "Good", lifecycleStage: "Active", parentId: null, children: ["ast-007", "ast-008", "ast-009"],
    lastServiceDate: "2026-01-15", nextServiceDue: "2026-04-15", totalMaintenanceCost: 6200, workOrderCount: 6, assetTag: "RR-101-HVAC-001"
  },
  {
    id: "ast-007", name: "Compressor Unit", description: "Scroll compressor for rooftop HVAC unit", category: "HVAC",
    manufacturer: "Copeland", model: "ZR72KC-TFD", serialNumber: "COP-COMP-2020-3311", purchaseDate: "2020-08-10", purchaseCost: 4200,
    warrantyExpiration: "2025-08-10", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Rooftop",
    condition: "Fair", lifecycleStage: "Active", parentId: "ast-006", lastServiceDate: "2026-01-15", nextServiceDue: "2026-03-15",
    totalMaintenanceCost: 3100, workOrderCount: 4, assetTag: "RR-101-HVAC-002"
  },
  {
    id: "ast-008", name: "Condenser Coil", description: "Outdoor condenser coil assembly", category: "HVAC",
    manufacturer: "Carrier", model: "CC-060-AL", serialNumber: "CAR-COND-2020-1155", purchaseDate: "2020-08-10", purchaseCost: 2800,
    warrantyExpiration: "2030-08-10", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Rooftop",
    condition: "Good", lifecycleStage: "Active", parentId: "ast-006", lastServiceDate: "2026-01-15", nextServiceDue: "2026-07-15",
    totalMaintenanceCost: 800, workOrderCount: 1, assetTag: "RR-101-HVAC-003"
  },
  {
    id: "ast-009", name: "Thermostat - Store Floor", description: "Smart thermostat for store climate control", category: "HVAC",
    manufacturer: "Honeywell", model: "T6 Pro Z-Wave", serialNumber: "HON-T6P-2022-4490", purchaseDate: "2022-03-01", purchaseCost: 350,
    warrantyExpiration: "2027-03-01", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Store Floor - North Wall",
    condition: "Excellent", lifecycleStage: "Active", parentId: "ast-006", lastServiceDate: "2025-10-20", nextServiceDue: "2026-10-20",
    totalMaintenanceCost: 0, workOrderCount: 0, assetTag: "RR-101-HVAC-004"
  },
  // Refrigeration System
  {
    id: "ast-010", name: "Refrigeration System", description: "Walk-in cooler and reach-in display case system", category: "Refrigeration",
    manufacturer: "Hussmann", model: "Protocol System", serialNumber: "HUS-REF-2019-5567", purchaseDate: "2019-05-22", purchaseCost: 65000,
    warrantyExpiration: "2029-05-22", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Store Interior",
    condition: "Fair", lifecycleStage: "Active", parentId: null, children: ["ast-011", "ast-012", "ast-013"],
    lastServiceDate: "2026-02-01", nextServiceDue: "2026-03-01", totalMaintenanceCost: 18900, workOrderCount: 12, assetTag: "RR-101-REF-001"
  },
  {
    id: "ast-011", name: "Walk-In Cooler", description: "8x10 walk-in cooler for beverage and dairy storage", category: "Refrigeration",
    manufacturer: "Hussmann", model: "WIC-810", serialNumber: "HUS-WIC-2019-2244", purchaseDate: "2019-05-22", purchaseCost: 22000,
    warrantyExpiration: "2029-05-22", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Back of Store",
    condition: "Fair", lifecycleStage: "Under Maintenance", parentId: "ast-010", lastServiceDate: "2026-02-10", nextServiceDue: "2026-02-28",
    totalMaintenanceCost: 8500, workOrderCount: 6, assetTag: "RR-101-REF-002"
  },
  {
    id: "ast-012", name: "Reach-In Display Case - Beverages", description: "5-door glass front beverage display cooler", category: "Refrigeration",
    manufacturer: "Hussmann", model: "RL-5D", serialNumber: "HUS-RL5-2019-3378", purchaseDate: "2019-05-22", purchaseCost: 18000,
    warrantyExpiration: "2029-05-22", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Store Floor - East Wall",
    condition: "Good", lifecycleStage: "Active", parentId: "ast-010", lastServiceDate: "2025-12-05", nextServiceDue: "2026-03-05",
    totalMaintenanceCost: 4200, workOrderCount: 3, assetTag: "RR-101-REF-003"
  },
  {
    id: "ast-013", name: "Reach-In Display Case - Frozen", description: "3-door glass front frozen food display", category: "Refrigeration",
    manufacturer: "Hussmann", model: "RF-3D", serialNumber: "HUS-RF3-2019-4456", purchaseDate: "2019-05-22", purchaseCost: 14000,
    warrantyExpiration: "2029-05-22", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Store Floor - East Wall",
    condition: "Poor", lifecycleStage: "Flagged for Replacement", parentId: "ast-010", lastServiceDate: "2026-02-12", nextServiceDue: "2026-02-20",
    totalMaintenanceCost: 6200, workOrderCount: 8, assetTag: "RR-101-REF-004"
  },
  // POS & IT
  {
    id: "ast-014", name: "POS System", description: "Complete point-of-sale terminal and payment processing system", category: "POS & IT",
    manufacturer: "Verifone", model: "Commander Site Controller", serialNumber: "VER-CSC-2021-8812", purchaseDate: "2021-01-15", purchaseCost: 24000,
    warrantyExpiration: "2026-01-15", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Checkout Counter",
    condition: "Good", lifecycleStage: "Active", parentId: null, children: ["ast-015", "ast-016"],
    lastServiceDate: "2025-11-30", nextServiceDue: "2026-05-30", totalMaintenanceCost: 1800, workOrderCount: 2, assetTag: "RR-101-POS-001"
  },
  {
    id: "ast-015", name: "POS Terminal #1", description: "Touchscreen POS register with integrated scanner", category: "POS & IT",
    manufacturer: "Verifone", model: "Topaz XL", serialNumber: "VER-TXL-2021-4433", purchaseDate: "2021-01-15", purchaseCost: 4500,
    warrantyExpiration: "2026-01-15", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Checkout Counter - Register 1",
    condition: "Good", lifecycleStage: "Active", parentId: "ast-014", lastServiceDate: "2025-11-30", nextServiceDue: "2026-05-30",
    totalMaintenanceCost: 600, workOrderCount: 1, assetTag: "RR-101-POS-002"
  },
  {
    id: "ast-016", name: "Payment Terminal - EMV", description: "EMV chip + contactless payment reader", category: "POS & IT",
    manufacturer: "Verifone", model: "MX 925", serialNumber: "VER-MX9-2022-7712", purchaseDate: "2022-06-01", purchaseCost: 1200,
    warrantyExpiration: "2027-06-01", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Checkout Counter",
    condition: "Excellent", lifecycleStage: "Active", parentId: "ast-014", lastServiceDate: "2025-11-30", nextServiceDue: "2026-11-30",
    totalMaintenanceCost: 0, workOrderCount: 0, assetTag: "RR-101-POS-003"
  },
  // Safety
  {
    id: "ast-017", name: "Fire Suppression System", description: "Complete fire suppression system for store and canopy", category: "Safety",
    manufacturer: "Ansul", model: "R-102", serialNumber: "ANS-R102-2018-5590", purchaseDate: "2018-06-20", purchaseCost: 8500,
    warrantyExpiration: "2028-06-20", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Throughout",
    condition: "Good", lifecycleStage: "Active", parentId: null, lastServiceDate: "2025-12-15", nextServiceDue: "2026-06-15",
    totalMaintenanceCost: 2400, workOrderCount: 4, assetTag: "RR-101-SAF-001"
  },
  // Lighting
  {
    id: "ast-018", name: "LED Canopy Lighting System", description: "LED retrofit canopy light fixtures (12 units)", category: "Lighting",
    manufacturer: "Cree", model: "CPY250", serialNumber: "CRE-CPY-2021-3300", purchaseDate: "2021-09-10", purchaseCost: 14400,
    warrantyExpiration: "2031-09-10", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Fuel Canopy",
    condition: "Excellent", lifecycleStage: "Active", parentId: null, lastServiceDate: "2025-09-10", nextServiceDue: "2026-09-10",
    totalMaintenanceCost: 0, workOrderCount: 0, assetTag: "RR-101-LIT-001"
  },
  // Signage
  {
    id: "ast-019", name: "Price Sign - LED", description: "Electronic fuel price sign, dual-face", category: "Signage",
    manufacturer: "Daktronics", model: "FP-2100", serialNumber: "DAK-FP21-2020-1100", purchaseDate: "2020-04-01", purchaseCost: 18000,
    warrantyExpiration: "2025-04-01", propertyId: "prop-001", propertyName: "Store #101 - San Jose Almaden", location: "Street Frontage",
    condition: "Fair", lifecycleStage: "Active", parentId: null, lastServiceDate: "2025-10-05", nextServiceDue: "2026-04-05",
    totalMaintenanceCost: 3500, workOrderCount: 3, assetTag: "RR-101-SIG-001"
  },

  // === STORE #105 - Sunnyvale (higher maintenance needs) ===
  {
    id: "ast-020", name: "Fuel Dispensing System", description: "Complete fuel delivery and dispensing system", category: "Fuel System",
    manufacturer: "Wayne", model: "Ovation II", serialNumber: "WYN-OV2-2017-2290", purchaseDate: "2017-06-15", purchaseCost: 165000,
    warrantyExpiration: "2027-06-15", propertyId: "prop-003", propertyName: "Store #105 - Sunnyvale", location: "Fuel Islands",
    condition: "Fair", lifecycleStage: "Active", parentId: null, children: ["ast-021", "ast-022"],
    lastServiceDate: "2026-02-08", nextServiceDue: "2026-03-08", totalMaintenanceCost: 28500, workOrderCount: 18, assetTag: "RR-105-FUEL-001"
  },
  {
    id: "ast-021", name: "Fuel Pump #1 - Island A", description: "Multi-product dispenser", category: "Fuel System",
    manufacturer: "Wayne", model: "Ovation II", serialNumber: "WYN-DISP-2017-0551", purchaseDate: "2017-06-15", purchaseCost: 28000,
    warrantyExpiration: "2027-06-15", propertyId: "prop-003", propertyName: "Store #105 - Sunnyvale", location: "Fuel Island A",
    condition: "Poor", lifecycleStage: "Under Maintenance", parentId: "ast-020", lastServiceDate: "2026-02-14", nextServiceDue: "2026-02-21",
    totalMaintenanceCost: 9800, workOrderCount: 8, assetTag: "RR-105-FUEL-002"
  },
  {
    id: "ast-022", name: "Underground Storage Tank - Premium", description: "10,000 gallon UST for premium fuel", category: "Fuel System",
    manufacturer: "Xerxes Corporation", model: "FRP 10000-DW", serialNumber: "XRX-UST-2017-0445", purchaseDate: "2017-06-15", purchaseCost: 38000,
    warrantyExpiration: "2047-06-15", propertyId: "prop-003", propertyName: "Store #105 - Sunnyvale", location: "Underground - North",
    condition: "Good", lifecycleStage: "Active", parentId: "ast-020", lastServiceDate: "2025-10-01", nextServiceDue: "2026-04-01",
    totalMaintenanceCost: 4200, workOrderCount: 3, assetTag: "RR-105-FUEL-003"
  },
  {
    id: "ast-023", name: "HVAC System - Store", description: "Split system HVAC for store interior", category: "HVAC",
    manufacturer: "Lennox", model: "XC21-060", serialNumber: "LNX-XC21-2018-6678", purchaseDate: "2018-09-01", purchaseCost: 32000,
    warrantyExpiration: "2028-09-01", propertyId: "prop-003", propertyName: "Store #105 - Sunnyvale", location: "Rooftop / Store Interior",
    condition: "Poor", lifecycleStage: "Flagged for Replacement", parentId: null, children: ["ast-024"],
    lastServiceDate: "2026-02-10", nextServiceDue: "2026-02-25", totalMaintenanceCost: 14200, workOrderCount: 15, assetTag: "RR-105-HVAC-001"
  },
  {
    id: "ast-024", name: "Compressor Unit", description: "Two-stage scroll compressor", category: "HVAC",
    manufacturer: "Copeland", model: "ZR94KC", serialNumber: "COP-ZR94-2018-9912", purchaseDate: "2018-09-01", purchaseCost: 5500,
    warrantyExpiration: "2023-09-01", propertyId: "prop-003", propertyName: "Store #105 - Sunnyvale", location: "Rooftop",
    condition: "Critical", lifecycleStage: "Flagged for Replacement", parentId: "ast-023", lastServiceDate: "2026-02-10", nextServiceDue: "2026-02-18",
    totalMaintenanceCost: 8900, workOrderCount: 11, assetTag: "RR-105-HVAC-002"
  },
  {
    id: "ast-025", name: "Refrigeration System", description: "Walk-in and display case refrigeration", category: "Refrigeration",
    manufacturer: "Hussmann", model: "Protocol System", serialNumber: "HUS-REF-2019-8834", purchaseDate: "2019-01-10", purchaseCost: 58000,
    warrantyExpiration: "2029-01-10", propertyId: "prop-003", propertyName: "Store #105 - Sunnyvale", location: "Store Interior",
    condition: "Good", lifecycleStage: "Active", parentId: null, lastServiceDate: "2026-01-20", nextServiceDue: "2026-04-20",
    totalMaintenanceCost: 7600, workOrderCount: 5, assetTag: "RR-105-REF-001"
  },

  // === STORE #112 - Hayward ===
  {
    id: "ast-026", name: "Fuel Dispensing System", description: "Complete fuel delivery system", category: "Fuel System",
    manufacturer: "Gilbarco Veeder-Root", model: "Encore 500 S", serialNumber: "GVR-500-2016-1198", purchaseDate: "2016-04-20", purchaseCost: 145000,
    warrantyExpiration: "2026-04-20", propertyId: "prop-005", propertyName: "Store #112 - Hayward", location: "Fuel Islands",
    condition: "Fair", lifecycleStage: "Active", parentId: null, children: ["ast-027"],
    lastServiceDate: "2026-01-30", nextServiceDue: "2026-04-30", totalMaintenanceCost: 34500, workOrderCount: 22, assetTag: "RR-112-FUEL-001"
  },
  {
    id: "ast-027", name: "Fuel Pump #1 - Island A", description: "Multi-product dispenser", category: "Fuel System",
    manufacturer: "Gilbarco Veeder-Root", model: "Encore 500 S", serialNumber: "GVR-DISP-2016-0887", purchaseDate: "2016-04-20", purchaseCost: 26000,
    warrantyExpiration: "2026-04-20", propertyId: "prop-005", propertyName: "Store #112 - Hayward", location: "Fuel Island A",
    condition: "Poor", lifecycleStage: "Flagged for Replacement", parentId: "ast-026", lastServiceDate: "2026-02-05", nextServiceDue: "2026-02-19",
    totalMaintenanceCost: 12300, workOrderCount: 10, assetTag: "RR-112-FUEL-002"
  },
  {
    id: "ast-028", name: "HVAC System - Store", description: "Packaged rooftop unit", category: "HVAC",
    manufacturer: "Trane", model: "Voyager YCD150", serialNumber: "TRA-VYG-2020-5543", purchaseDate: "2020-11-15", purchaseCost: 26000,
    warrantyExpiration: "2030-11-15", propertyId: "prop-005", propertyName: "Store #112 - Hayward", location: "Rooftop",
    condition: "Excellent", lifecycleStage: "Active", parentId: null,
    lastServiceDate: "2025-12-20", nextServiceDue: "2026-06-20", totalMaintenanceCost: 1200, workOrderCount: 2, assetTag: "RR-112-HVAC-001"
  },

  // === STORE #125 - Mountain View (highest open WOs) ===
  {
    id: "ast-029", name: "Fuel Dispensing System", description: "Complete fuel delivery system", category: "Fuel System",
    manufacturer: "Gilbarco Veeder-Root", model: "Encore 700 S", serialNumber: "GVR-700-2020-7712", purchaseDate: "2020-01-20", purchaseCost: 195000,
    warrantyExpiration: "2030-01-20", propertyId: "prop-009", propertyName: "Store #125 - Mountain View", location: "Fuel Islands",
    condition: "Good", lifecycleStage: "Active", parentId: null,
    lastServiceDate: "2026-02-01", nextServiceDue: "2026-05-01", totalMaintenanceCost: 8200, workOrderCount: 6, assetTag: "RR-125-FUEL-001"
  },
  {
    id: "ast-030", name: "Refrigeration System", description: "Complete cold storage and display system", category: "Refrigeration",
    manufacturer: "Hussmann", model: "Protocol System", serialNumber: "HUS-REF-2018-3321", purchaseDate: "2018-03-15", purchaseCost: 72000,
    warrantyExpiration: "2028-03-15", propertyId: "prop-009", propertyName: "Store #125 - Mountain View", location: "Store Interior",
    condition: "Poor", lifecycleStage: "Under Maintenance", parentId: null,
    lastServiceDate: "2026-02-14", nextServiceDue: "2026-02-21", totalMaintenanceCost: 24500, workOrderCount: 16, assetTag: "RR-125-REF-001"
  },
  {
    id: "ast-031", name: "EV Charging Station", description: "Level 2 dual-port EV charging station", category: "Electrical",
    manufacturer: "ChargePoint", model: "CT4021", serialNumber: "CP-CT40-2024-1155", purchaseDate: "2024-06-01", purchaseCost: 12000,
    warrantyExpiration: "2029-06-01", propertyId: "prop-009", propertyName: "Store #125 - Mountain View", location: "Parking Lot - East",
    condition: "Excellent", lifecycleStage: "Active", parentId: null,
    lastServiceDate: "2025-12-01", nextServiceDue: "2026-06-01", totalMaintenanceCost: 0, workOrderCount: 0, assetTag: "RR-125-EV-001"
  },

  // === A few more scattered across other stores ===
  {
    id: "ast-032", name: "Car Wash System", description: "Automatic touchless car wash bay", category: "Electrical",
    manufacturer: "PDQ", model: "LaserWash 360 Plus", serialNumber: "PDQ-LW360-2022-0091", purchaseDate: "2022-04-15", purchaseCost: 195000,
    warrantyExpiration: "2027-04-15", propertyId: "prop-004", propertyName: "Store #108 - Fremont", location: "Car Wash Bay",
    condition: "Good", lifecycleStage: "Active", parentId: null,
    lastServiceDate: "2026-01-25", nextServiceDue: "2026-03-25", totalMaintenanceCost: 8700, workOrderCount: 7, assetTag: "RR-108-CW-001"
  },
  {
    id: "ast-033", name: "Air/Water Station", description: "Free air and water station for customers", category: "Plumbing",
    manufacturer: "National Air", model: "VM2000", serialNumber: "NAT-VM2-2021-5544", purchaseDate: "2021-07-01", purchaseCost: 3500,
    warrantyExpiration: "2024-07-01", propertyId: "prop-006", propertyName: "Store #115 - San Mateo", location: "Exterior - South Side",
    condition: "Fair", lifecycleStage: "Active", parentId: null,
    lastServiceDate: "2025-11-10", nextServiceDue: "2026-02-10", totalMaintenanceCost: 1200, workOrderCount: 4, assetTag: "RR-115-PLB-001"
  },
  {
    id: "ast-034", name: "Security Camera System", description: "32-channel NVR with 24 IP cameras", category: "Safety",
    manufacturer: "Hanwha Vision", model: "Wisenet X Plus", serialNumber: "HWV-XP32-2023-0078", purchaseDate: "2023-01-10", purchaseCost: 18500,
    warrantyExpiration: "2028-01-10", propertyId: "prop-007", propertyName: "Store #118 - Redwood City", location: "Office / Throughout",
    condition: "Excellent", lifecycleStage: "Active", parentId: null,
    lastServiceDate: "2025-10-15", nextServiceDue: "2026-04-15", totalMaintenanceCost: 500, workOrderCount: 1, assetTag: "RR-118-SAF-001"
  },
  {
    id: "ast-035", name: "Backup Generator", description: "Standby diesel generator for power outages", category: "Electrical",
    manufacturer: "Generac", model: "Protector QS 48kW", serialNumber: "GEN-PQS48-2020-3344", purchaseDate: "2020-02-15", purchaseCost: 22000,
    warrantyExpiration: "2025-02-15", propertyId: "prop-002", propertyName: "Store #102 - Milpitas", location: "Exterior - Rear",
    condition: "Good", lifecycleStage: "Active", parentId: null,
    lastServiceDate: "2025-12-01", nextServiceDue: "2026-06-01", totalMaintenanceCost: 3600, workOrderCount: 3, assetTag: "RR-102-ELEC-001"
  },
];

// --- RECENT WORK ORDERS ---
export const recentWorkOrders: WorkOrder[] = [
  { id: "WO-2026-0847", title: "Walk-in cooler temperature alarm", assetId: "ast-011", assetName: "Walk-In Cooler", propertyName: "Store #101 - San Jose Almaden", status: "In Progress", priority: "High", createdDate: "2026-02-14", completedDate: null, assignedTo: "Mike Chen", cost: 0 },
  { id: "WO-2026-0845", title: "Frozen display case compressor failure", assetId: "ast-013", assetName: "Reach-In Display Case - Frozen", propertyName: "Store #101 - San Jose Almaden", status: "Open", priority: "Critical", createdDate: "2026-02-13", completedDate: null, assignedTo: "Unassigned", cost: 0 },
  { id: "WO-2026-0841", title: "HVAC compressor replacement evaluation", assetId: "ast-024", assetName: "Compressor Unit", propertyName: "Store #105 - Sunnyvale", status: "In Progress", priority: "High", createdDate: "2026-02-12", completedDate: null, assignedTo: "Dave Rodriguez", cost: 2800 },
  { id: "WO-2026-0838", title: "Fuel pump nozzle replacement", assetId: "ast-021", assetName: "Fuel Pump #1 - Island A", propertyName: "Store #105 - Sunnyvale", status: "In Progress", priority: "Medium", createdDate: "2026-02-11", completedDate: null, assignedTo: "Tony Nguyen", cost: 450 },
  { id: "WO-2026-0835", title: "Refrigeration system annual inspection", assetId: "ast-030", assetName: "Refrigeration System", propertyName: "Store #125 - Mountain View", status: "Open", priority: "Medium", createdDate: "2026-02-10", completedDate: null, assignedTo: "Mike Chen", cost: 0 },
  { id: "WO-2026-0830", title: "Fuel pump dispenser calibration", assetId: "ast-027", assetName: "Fuel Pump #1 - Island A", propertyName: "Store #112 - Hayward", status: "Completed", priority: "High", createdDate: "2026-02-07", completedDate: "2026-02-09", assignedTo: "Tony Nguyen", cost: 680 },
  { id: "WO-2026-0825", title: "Car wash sensor alignment", assetId: "ast-032", assetName: "Car Wash System", propertyName: "Store #108 - Fremont", status: "Completed", priority: "Medium", createdDate: "2026-02-05", completedDate: "2026-02-06", assignedTo: "Dave Rodriguez", cost: 320 },
  { id: "WO-2026-0820", title: "LED price sign panel replacement", assetId: "ast-019", assetName: "Price Sign - LED", propertyName: "Store #101 - San Jose Almaden", status: "Completed", priority: "Low", createdDate: "2026-02-03", completedDate: "2026-02-05", assignedTo: "Tony Nguyen", cost: 1200 },
  { id: "WO-2026-0815", title: "Quarterly HVAC filter change", assetId: "ast-028", assetName: "HVAC System - Store", propertyName: "Store #112 - Hayward", status: "Completed", priority: "Low", createdDate: "2026-02-01", completedDate: "2026-02-02", assignedTo: "Mike Chen", cost: 180 },
  { id: "WO-2026-0810", title: "Generator load bank test", assetId: "ast-035", assetName: "Backup Generator", propertyName: "Store #102 - Milpitas", status: "Completed", priority: "Medium", createdDate: "2026-01-29", completedDate: "2026-01-30", assignedTo: "Dave Rodriguez", cost: 550 },
];

// --- AGGREGATED STATS ---
export const dashboardStats = {
  totalAssets: 2847,
  totalProperties: 63,
  activeAssets: 2541,
  underMaintenance: 186,
  flaggedForReplacement: 89,
  decommissioned: 31,
  openWorkOrders: 47,
  overdueWorkOrders: 8,
  totalAssetValue: 18_450_000,
  ytdMaintenanceCost: 342_000,
  avgConditionScore: 7.2,
  criticalAssets: 12,
  warrantyExpiringSoon: 34,
};

// --- CHART DATA ---
export const conditionDistribution = [
  { name: "Excellent", value: 684, fill: "#10b981" },
  { name: "Good", value: 1138, fill: "#22c55e" },
  { name: "Fair", value: 612, fill: "#f59e0b" },
  { name: "Poor", value: 324, fill: "#f97316" },
  { name: "Critical", value: 89, fill: "#ef4444" },
];

export const maintenanceCostByMonth = [
  { month: "Sep", cost: 52000, workOrders: 38 },
  { month: "Oct", cost: 48000, workOrders: 35 },
  { month: "Nov", cost: 61000, workOrders: 42 },
  { month: "Dec", cost: 44000, workOrders: 31 },
  { month: "Jan", cost: 72000, workOrders: 51 },
  { month: "Feb", cost: 65000, workOrders: 47 },
];

export const assetsByCategory = [
  { category: "Fuel System", count: 756, value: 4200000 },
  { category: "Refrigeration", count: 504, value: 3800000 },
  { category: "HVAC", count: 441, value: 2900000 },
  { category: "POS & IT", count: 378, value: 2100000 },
  { category: "Lighting", count: 315, value: 1800000 },
  { category: "Safety", count: 189, value: 1400000 },
  { category: "Signage", count: 126, value: 1100000 },
  { category: "Electrical", count: 84, value: 750000 },
  { category: "Plumbing", count: 54, value: 400000 },
];

export const topPropertiesByMaintenance = [
  { name: "Store #105 - Sunnyvale", cost: 28400, workOrders: 42 },
  { name: "Store #125 - Mountain View", cost: 24100, workOrders: 38 },
  { name: "Store #112 - Hayward", cost: 19800, workOrders: 31 },
  { name: "Store #101 - San Jose Almaden", cost: 18200, workOrders: 28 },
  { name: "Store #118 - Redwood City", cost: 15600, workOrders: 24 },
];
