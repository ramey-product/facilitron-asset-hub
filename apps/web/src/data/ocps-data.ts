// Orange County Public Schools (OCPS) — Sample Data
// 3-level hierarchy: Property → Building System → Component

import { Asset, Property, WorkOrder } from './sample-data';

export type OcpsAssetCategory =
  | "HVAC"
  | "Electrical"
  | "Plumbing"
  | "Roofing"
  | "Flooring"
  | "Fire & Life Safety"
  | "IT & Network"
  | "Kitchen Equipment"
  | "Playground & Athletic"
  | "Furniture & Fixtures"
  | "Portables & Relocatables"
  | "Elevator & Accessibility";

// --- PROPERTIES (15 representative schools from OCPS) ---
export const ocpsProperties: Property[] = [
  // Elementary Schools (7)
  { id: "ocps-prop-001", name: "Dillard Street Elementary School", address: "311 North Dillard Street", city: "Winter Garden", state: "FL", region: "Northwest Maintenance Area", assetCount: 52, openWorkOrders: 2 },
  { id: "ocps-prop-002", name: "Dream Lake Elementary School", address: "500 North Park Avenue", city: "Apopka", state: "FL", region: "Northwest Maintenance Area", assetCount: 48, openWorkOrders: 1 },
  { id: "ocps-prop-003", name: "Hunters Creek Elementary School", address: "4650 Town Center Boulevard", city: "Orlando", state: "FL", region: "South Maintenance Area", assetCount: 51, openWorkOrders: 3 },
  { id: "ocps-prop-004", name: "Dr Phillips Elementary School", address: "6909 Dr Phillips Boulevard", city: "Orlando", state: "FL", region: "South Maintenance Area", assetCount: 49, openWorkOrders: 0 },
  { id: "ocps-prop-005", name: "Hamlin Elementary School", address: "16145 Silver Grove Boulevard", city: "Winter Garden", state: "FL", region: "Northwest Maintenance Area", assetCount: 46, openWorkOrders: 2 },
  { id: "ocps-prop-006", name: "Oakridge Elementary School", address: "2700 Oakridge Lane", city: "Orlando", state: "FL", region: "Northeast Maintenance Area", assetCount: 50, openWorkOrders: 1 },
  { id: "ocps-prop-007", name: "Windermere Elementary School", address: "8505 Winter Garden Vineland Road", city: "Windermere", state: "FL", region: "South Maintenance Area", assetCount: 47, openWorkOrders: 2 },

  // Middle Schools (3)
  { id: "ocps-prop-008", name: "Ocoee Middle School", address: "300 S Bluford Avenue", city: "Ocoee", state: "FL", region: "Northwest Maintenance Area", assetCount: 64, openWorkOrders: 3 },
  { id: "ocps-prop-009", name: "Conway Middle School", address: "4600 Anderson Road", city: "Orlando", state: "FL", region: "South Maintenance Area", assetCount: 68, openWorkOrders: 2 },
  { id: "ocps-prop-010", name: "Lake Nona Middle School", address: "13700 Narcoossee Road", city: "Orlando", state: "FL", region: "South Maintenance Area", assetCount: 62, openWorkOrders: 4 },

  // High Schools (3)
  { id: "ocps-prop-011", name: "Evans High School", address: "4949 Silver Star Road", city: "Orlando", state: "FL", region: "Northeast Maintenance Area", assetCount: 89, openWorkOrders: 5 },
  { id: "ocps-prop-012", name: "Olympia High School", address: "4301 South Apopka Vineland Road", city: "Orlando", state: "FL", region: "South Maintenance Area", assetCount: 91, openWorkOrders: 3 },
  { id: "ocps-prop-013", name: "Timber Creek High School", address: "1001 Avalon Park Boulevard", city: "Orlando", state: "FL", region: "Northeast Maintenance Area", assetCount: 87, openWorkOrders: 4 },

  // Technical College (1)
  { id: "ocps-prop-014", name: "Orange Technical College-Orlando Tech (Main)", address: "301 W Amelia St", city: "Orlando", state: "FL", region: "Northeast Maintenance Area", assetCount: 156, openWorkOrders: 8 },

  // Administrative/Maintenance Facility (1)
  { id: "ocps-prop-015", name: "John T. Morris Facilities Complex", address: "6501 Magic Way", city: "Orlando", state: "FL", region: "Northeast Maintenance Area", assetCount: 78, openWorkOrders: 2 },
];

// --- ASSETS (35 assets showing 3-level hierarchy) ---
export const ocpsAssets: Asset[] = [
  // === DILLARD STREET ELEMENTARY (ocps-prop-001) ===
  // HVAC System - Main Building
  {
    id: "ocps-ast-001", name: "HVAC System - Main Building", description: "Rooftop units serving elementary main building", category: "HVAC",
    manufacturer: "Trane", model: "XR15a 3-ton", serialNumber: "TRA-XR15-2015-2244", purchaseDate: "2015-07-20", purchaseCost: 24000,
    warrantyExpiration: "2025-07-20", propertyId: "ocps-prop-001", propertyName: "Dillard Street Elementary School", location: "Rooftop - Main",
    condition: "Fair", lifecycleStage: "Active", parentId: null, children: ["ocps-ast-002", "ocps-ast-003"],
    lastServiceDate: "2026-01-10", nextServiceDue: "2026-04-10", totalMaintenanceCost: 3400, workOrderCount: 5, assetTag: "OCPS-DSE-HVAC-001"
  },
  {
    id: "ocps-ast-002", name: "Rooftop Unit #1", description: "3-ton rooftop packaged HVAC unit", category: "HVAC",
    manufacturer: "Trane", model: "XR15a 3-ton", serialNumber: "TRA-RTU-2015-0812", purchaseDate: "2015-07-20", purchaseCost: 12500,
    warrantyExpiration: "2025-07-20", propertyId: "ocps-prop-001", propertyName: "Dillard Street Elementary School", location: "Rooftop - Main",
    condition: "Fair", lifecycleStage: "Active", parentId: "ocps-ast-001", lastServiceDate: "2026-01-10", nextServiceDue: "2026-04-10",
    totalMaintenanceCost: 1800, workOrderCount: 3, assetTag: "OCPS-DSE-HVAC-002"
  },
  {
    id: "ocps-ast-003", name: "Rooftop Unit #2", description: "3-ton rooftop packaged HVAC unit", category: "HVAC",
    manufacturer: "Carrier", model: "50XC 3-ton", serialNumber: "CAR-RTU-2015-1498", purchaseDate: "2015-07-20", purchaseCost: 11500,
    warrantyExpiration: "2025-07-20", propertyId: "ocps-prop-001", propertyName: "Dillard Street Elementary School", location: "Rooftop - Main",
    condition: "Fair", lifecycleStage: "Active", parentId: "ocps-ast-001", lastServiceDate: "2026-01-10", nextServiceDue: "2026-04-10",
    totalMaintenanceCost: 1600, workOrderCount: 2, assetTag: "OCPS-DSE-HVAC-003"
  },

  // Fire Alarm System
  {
    id: "ocps-ast-004", name: "Fire Alarm System", description: "Building fire detection and alarm system", category: "Fire & Life Safety",
    manufacturer: "Notifier", model: "FireWarden 3000", serialNumber: "NOT-FW3K-2018-3344", purchaseDate: "2018-03-15", purchaseCost: 8500,
    warrantyExpiration: "2028-03-15", propertyId: "ocps-prop-001", propertyName: "Dillard Street Elementary School", location: "Throughout",
    condition: "Good", lifecycleStage: "Active", parentId: null, children: ["ocps-ast-005", "ocps-ast-006"],
    lastServiceDate: "2025-12-01", nextServiceDue: "2026-06-01", totalMaintenanceCost: 1200, workOrderCount: 2, assetTag: "OCPS-DSE-FLS-001"
  },
  {
    id: "ocps-ast-005", name: "Fire Panel", description: "Central fire alarm control panel", category: "Fire & Life Safety",
    manufacturer: "Notifier", model: "FPA-500", serialNumber: "NOT-FPA5-2018-0556", purchaseDate: "2018-03-15", purchaseCost: 5200,
    warrantyExpiration: "2028-03-15", propertyId: "ocps-prop-001", propertyName: "Dillard Street Elementary School", location: "Main Office",
    condition: "Good", lifecycleStage: "Active", parentId: "ocps-ast-004", lastServiceDate: "2025-12-01", nextServiceDue: "2026-06-01",
    totalMaintenanceCost: 600, workOrderCount: 1, assetTag: "OCPS-DSE-FLS-002"
  },
  {
    id: "ocps-ast-006", name: "Fire Alarm Pull Stations", description: "Manual pull stations throughout building", category: "Fire & Life Safety",
    manufacturer: "Notifier", model: "Manual Station", serialNumber: "NOT-MPS-2018-1122", purchaseDate: "2018-03-15", purchaseCost: 3300,
    warrantyExpiration: "2028-03-15", propertyId: "ocps-prop-001", propertyName: "Dillard Street Elementary School", location: "Hallways / Exits",
    condition: "Good", lifecycleStage: "Active", parentId: "ocps-ast-004", lastServiceDate: "2025-12-01", nextServiceDue: "2026-06-01",
    totalMaintenanceCost: 600, workOrderCount: 1, assetTag: "OCPS-DSE-FLS-003"
  },

  // === EVANS HIGH SCHOOL (ocps-prop-011) ===
  // Kitchen Equipment System
  {
    id: "ocps-ast-007", name: "Kitchen Equipment System", description: "Cafeteria cooking and refrigeration equipment", category: "Kitchen Equipment",
    manufacturer: "Hobart", model: "Service Package", serialNumber: "HOB-KIT-2016-4477", purchaseDate: "2016-09-10", purchaseCost: 85000,
    warrantyExpiration: "2026-09-10", propertyId: "ocps-prop-011", propertyName: "Evans High School", location: "Cafeteria",
    condition: "Fair", lifecycleStage: "Active", parentId: null, children: ["ocps-ast-008", "ocps-ast-009", "ocps-ast-010"],
    lastServiceDate: "2026-02-08", nextServiceDue: "2026-03-08", totalMaintenanceCost: 6800, workOrderCount: 8, assetTag: "OCPS-EHS-KIT-001"
  },
  {
    id: "ocps-ast-008", name: "Walk-In Cooler", description: "8x12 walk-in cooler for food storage", category: "Kitchen Equipment",
    manufacturer: "True Manufacturing", model: "T-Series WIC", serialNumber: "TRU-WIC-2016-2288", purchaseDate: "2016-09-10", purchaseCost: 32000,
    warrantyExpiration: "2026-09-10", propertyId: "ocps-prop-011", propertyName: "Evans High School", location: "Cafeteria - Rear",
    condition: "Fair", lifecycleStage: "Under Maintenance", parentId: "ocps-ast-007", lastServiceDate: "2026-02-14", nextServiceDue: "2026-02-28",
    totalMaintenanceCost: 3400, workOrderCount: 4, assetTag: "OCPS-EHS-KIT-002"
  },
  {
    id: "ocps-ast-009", name: "Commercial Dishwasher", description: "High-capacity commercial dishwasher for 1000+ meals/day", category: "Kitchen Equipment",
    manufacturer: "Hobart", model: "Advansys Undercounter", serialNumber: "HOB-DW-2016-3399", purchaseDate: "2016-09-10", purchaseCost: 28000,
    warrantyExpiration: "2026-09-10", propertyId: "ocps-prop-011", propertyName: "Evans High School", location: "Cafeteria - Scullery",
    condition: "Good", lifecycleStage: "Active", parentId: "ocps-ast-007", lastServiceDate: "2026-01-22", nextServiceDue: "2026-04-22",
    totalMaintenanceCost: 2100, workOrderCount: 2, assetTag: "OCPS-EHS-KIT-003"
  },
  {
    id: "ocps-ast-010", name: "Grease Trap System", description: "Grease trap and waste management for kitchen", category: "Kitchen Equipment",
    manufacturer: "Thermaco", model: "WaterMark 200", serialNumber: "THM-GT-2016-5511", purchaseDate: "2016-09-10", purchaseCost: 25000,
    warrantyExpiration: "2026-09-10", propertyId: "ocps-prop-011", propertyName: "Evans High School", location: "Underground - Kitchen",
    condition: "Fair", lifecycleStage: "Active", parentId: "ocps-ast-007", lastServiceDate: "2026-02-10", nextServiceDue: "2026-03-10",
    totalMaintenanceCost: 1300, workOrderCount: 2, assetTag: "OCPS-EHS-KIT-004"
  },

  // === TIMBER CREEK HIGH SCHOOL (ocps-prop-013) ===
  // IT Network Infrastructure
  {
    id: "ocps-ast-011", name: "IT Network Infrastructure", description: "Server room and network backbone systems", category: "IT & Network",
    manufacturer: "Cisco/Meraki", model: "Enterprise Package", serialNumber: "CSC-NET-2019-6622", purchaseDate: "2019-08-15", purchaseCost: 125000,
    warrantyExpiration: "2029-08-15", propertyId: "ocps-prop-013", propertyName: "Timber Creek High School", location: "Server Room - Basement",
    condition: "Good", lifecycleStage: "Active", parentId: null, children: ["ocps-ast-012", "ocps-ast-013", "ocps-ast-014"],
    lastServiceDate: "2026-01-30", nextServiceDue: "2026-04-30", totalMaintenanceCost: 4200, workOrderCount: 3, assetTag: "OCPS-TCH-IT-001"
  },
  {
    id: "ocps-ast-012", name: "Server Room Equipment", description: "Core networking switches, routers, patch panels", category: "IT & Network",
    manufacturer: "Cisco", model: "Catalyst 3650 Stack", serialNumber: "CSC-SRV-2019-3344", purchaseDate: "2019-08-15", purchaseCost: 65000,
    warrantyExpiration: "2029-08-15", propertyId: "ocps-prop-013", propertyName: "Timber Creek High School", location: "Server Room - Basement",
    condition: "Good", lifecycleStage: "Active", parentId: "ocps-ast-011", lastServiceDate: "2026-01-30", nextServiceDue: "2026-04-30",
    totalMaintenanceCost: 2100, workOrderCount: 1, assetTag: "OCPS-TCH-IT-002"
  },
  {
    id: "ocps-ast-013", name: "Wireless Access Points", description: "Campus-wide Wi-Fi infrastructure (48 APs)", category: "IT & Network",
    manufacturer: "Meraki", model: "MR46E", serialNumber: "MER-WAP-2019-2255", purchaseDate: "2019-08-15", purchaseCost: 38000,
    warrantyExpiration: "2029-08-15", propertyId: "ocps-prop-013", propertyName: "Timber Creek High School", location: "Throughout Campus",
    condition: "Good", lifecycleStage: "Active", parentId: "ocps-ast-011", lastServiceDate: "2026-01-20", nextServiceDue: "2026-04-20",
    totalMaintenanceCost: 1500, workOrderCount: 1, assetTag: "OCPS-TCH-IT-003"
  },
  {
    id: "ocps-ast-014", name: "PA System", description: "Paging/public address system for campus announcements", category: "IT & Network",
    manufacturer: "Polycom", model: "RealPresence Prime", serialNumber: "PLY-PA-2019-4466", purchaseDate: "2019-08-15", purchaseCost: 22000,
    warrantyExpiration: "2029-08-15", propertyId: "ocps-prop-013", propertyName: "Timber Creek High School", location: "Control Room / Throughout",
    condition: "Good", lifecycleStage: "Active", parentId: "ocps-ast-011", lastServiceDate: "2026-02-05", nextServiceDue: "2026-05-05",
    totalMaintenanceCost: 600, workOrderCount: 1, assetTag: "OCPS-TCH-IT-004"
  },

  // === OLYMPIA HIGH SCHOOL (ocps-prop-012) ===
  // Elevator System (standalone, not hierarchical)
  {
    id: "ocps-ast-015", name: "Passenger Elevator System", description: "3-stop passenger elevator in 4-story wing", category: "Elevator & Accessibility",
    manufacturer: "Otis", model: "Gen2 Classic", serialNumber: "OTS-ELV-2017-7788", purchaseDate: "2017-04-10", purchaseCost: 185000,
    warrantyExpiration: "2027-04-10", propertyId: "ocps-prop-012", propertyName: "Olympia High School", location: "Academic Building - West",
    condition: "Good", lifecycleStage: "Active", parentId: null, lastServiceDate: "2026-01-15", nextServiceDue: "2026-04-15",
    totalMaintenanceCost: 2800, workOrderCount: 2, assetTag: "OCPS-OHS-ELV-001"
  },

  // === DREAM LAKE ELEMENTARY (ocps-prop-002) ===
  // Plumbing System
  {
    id: "ocps-ast-016", name: "Building Plumbing System", description: "Main water distribution and waste systems", category: "Plumbing",
    manufacturer: "Various", model: "Standard Installation", serialNumber: "PLB-SYS-2014-1000", purchaseDate: "2014-05-20", purchaseCost: 42000,
    warrantyExpiration: "2024-05-20", propertyId: "ocps-prop-002", propertyName: "Dream Lake Elementary School", location: "Throughout",
    condition: "Fair", lifecycleStage: "Active", parentId: null, children: ["ocps-ast-017", "ocps-ast-018"],
    lastServiceDate: "2026-02-05", nextServiceDue: "2026-03-05", totalMaintenanceCost: 2100, workOrderCount: 3, assetTag: "OCPS-DLE-PLB-001"
  },
  {
    id: "ocps-ast-017", name: "Main Water Meter & Shutoff", description: "Building main water shutoff and metering", category: "Plumbing",
    manufacturer: "Mueller", model: "ABS/PVC", serialNumber: "MUE-WM-2014-0555", purchaseDate: "2014-05-20", purchaseCost: 3500,
    warrantyExpiration: "2024-05-20", propertyId: "ocps-prop-002", propertyName: "Dream Lake Elementary School", location: "Underground - Entry",
    condition: "Good", lifecycleStage: "Active", parentId: "ocps-ast-016", lastServiceDate: "2025-12-01", nextServiceDue: "2026-06-01",
    totalMaintenanceCost: 400, workOrderCount: 1, assetTag: "OCPS-DLE-PLB-002"
  },
  {
    id: "ocps-ast-018", name: "Bathroom Fixtures & Traps", description: "Sinks, toilets, drains throughout building", category: "Plumbing",
    manufacturer: "American Standard", model: "Standard Fixtures", serialNumber: "AMS-FIX-2014-1666", purchaseDate: "2014-05-20", purchaseCost: 18000,
    warrantyExpiration: "2024-05-20", propertyId: "ocps-prop-002", propertyName: "Dream Lake Elementary School", location: "Multiple Bathrooms",
    condition: "Fair", lifecycleStage: "Active", parentId: "ocps-ast-016", lastServiceDate: "2026-02-10", nextServiceDue: "2026-03-10",
    totalMaintenanceCost: 1700, workOrderCount: 2, assetTag: "OCPS-DLE-PLB-003"
  },

  // === HUNTERS CREEK ELEMENTARY (ocps-prop-003) ===
  // Roofing System
  {
    id: "ocps-ast-019", name: "Roof System - Main Building", description: "TPO membrane roof for elementary main structure", category: "Roofing",
    manufacturer: "GAF", model: "Everguard TPO", serialNumber: "GAF-RF-2013-2211", purchaseDate: "2013-06-01", purchaseCost: 68000,
    warrantyExpiration: "2033-06-01", propertyId: "ocps-prop-003", propertyName: "Hunters Creek Elementary School", location: "Roof - Main",
    condition: "Fair", lifecycleStage: "Active", parentId: null, children: ["ocps-ast-020"],
    lastServiceDate: "2025-11-20", nextServiceDue: "2026-05-20", totalMaintenanceCost: 3200, workOrderCount: 4, assetTag: "OCPS-HCE-RF-001"
  },
  {
    id: "ocps-ast-020", name: "Roof Drainage & Gutters", description: "Metal gutters and downspout system", category: "Roofing",
    manufacturer: "Galvalume Steel", model: "Commercial Grade", serialNumber: "GAL-GT-2013-3322", purchaseDate: "2013-06-01", purchaseCost: 12000,
    warrantyExpiration: "2033-06-01", propertyId: "ocps-prop-003", propertyName: "Hunters Creek Elementary School", location: "Perimeter",
    condition: "Fair", lifecycleStage: "Active", parentId: "ocps-ast-019", lastServiceDate: "2025-11-20", nextServiceDue: "2026-05-20",
    totalMaintenanceCost: 1600, workOrderCount: 2, assetTag: "OCPS-HCE-RF-002"
  },

  // === OCOEE MIDDLE SCHOOL (ocps-prop-008) ===
  // Flooring System
  {
    id: "ocps-ast-021", name: "Gymnasium Flooring", description: "Wood gym floor with shock-absorbing underlayment", category: "Flooring",
    manufacturer: "Robbins", model: "Challenger II Maple", serialNumber: "ROB-GYM-2012-4433", purchaseDate: "2012-08-15", purchaseCost: 185000,
    warrantyExpiration: "2032-08-15", propertyId: "ocps-prop-008", propertyName: "Ocoee Middle School", location: "Gymnasium",
    condition: "Fair", lifecycleStage: "Flagged for Replacement", parentId: null, lastServiceDate: "2026-01-05", nextServiceDue: "2026-04-05",
    totalMaintenanceCost: 8400, workOrderCount: 6, assetTag: "OCPS-OMS-FLR-001"
  },

  // === DR PHILLIPS ELEMENTARY (ocps-prop-004) ===
  // Electrical System
  {
    id: "ocps-ast-022", name: "Main Electrical Service", description: "1200A main service with distribution panels", category: "Electrical",
    manufacturer: "Square D", model: "QO Series", serialNumber: "SQD-MES-2016-5544", purchaseDate: "2016-02-20", purchaseCost: 42000,
    warrantyExpiration: "2026-02-20", propertyId: "ocps-prop-004", propertyName: "Dr Phillips Elementary School", location: "Electrical Room",
    condition: "Good", lifecycleStage: "Active", parentId: null, children: ["ocps-ast-023", "ocps-ast-024"],
    lastServiceDate: "2025-12-15", nextServiceDue: "2026-06-15", totalMaintenanceCost: 1200, workOrderCount: 2, assetTag: "OCPS-DPE-ELEC-001"
  },
  {
    id: "ocps-ast-023", name: "Lighting Control System", description: "LED lighting with occupancy sensors throughout", category: "Electrical",
    manufacturer: "Philips Hue", model: "Commercial System", serialNumber: "PHL-LCS-2016-2266", purchaseDate: "2016-02-20", purchaseCost: 18000,
    warrantyExpiration: "2026-02-20", propertyId: "ocps-prop-004", propertyName: "Dr Phillips Elementary School", location: "Throughout",
    condition: "Good", lifecycleStage: "Active", parentId: "ocps-ast-022", lastServiceDate: "2025-10-10", nextServiceDue: "2026-04-10",
    totalMaintenanceCost: 400, workOrderCount: 1, assetTag: "OCPS-DPE-ELEC-002"
  },
  {
    id: "ocps-ast-024", name: "Emergency Backup Generator", description: "100kW standby generator for critical systems", category: "Electrical",
    manufacturer: "Caterpillar", model: "C15 100kW", serialNumber: "CAT-GEN-2016-6677", purchaseDate: "2016-02-20", purchaseCost: 65000,
    warrantyExpiration: "2021-02-20", propertyId: "ocps-prop-004", propertyName: "Dr Phillips Elementary School", location: "Exterior - Rear",
    condition: "Fair", lifecycleStage: "Active", parentId: "ocps-ast-022", lastServiceDate: "2026-01-30", nextServiceDue: "2026-03-30",
    totalMaintenanceCost: 3600, workOrderCount: 3, assetTag: "OCPS-DPE-ELEC-003"
  },

  // === CONWAY MIDDLE SCHOOL (ocps-prop-009) ===
  // Playground & Athletic Equipment
  {
    id: "ocps-ast-025", name: "Playground Equipment System", description: "Multi-unit playground structure with safety surfacing", category: "Playground & Athletic",
    manufacturer: "Playworld Systems", model: "Adventure Landscape XL", serialNumber: "PLW-PG-2015-3388", purchaseDate: "2015-04-10", purchaseCost: 125000,
    warrantyExpiration: "2025-04-10", propertyId: "ocps-prop-009", propertyName: "Conway Middle School", location: "Outdoor Recreation Area",
    condition: "Fair", lifecycleStage: "Active", parentId: null, lastServiceDate: "2026-02-01", nextServiceDue: "2026-04-01",
    totalMaintenanceCost: 5200, workOrderCount: 4, assetTag: "OCPS-CMS-PG-001"
  },

  // === LAKE NONA MIDDLE SCHOOL (ocps-prop-010) ===
  // Furniture & Fixtures
  {
    id: "ocps-ast-026", name: "Cafeteria Seating & Tables", description: "Student seating for 800+ capacity cafeteria", category: "Furniture & Fixtures",
    manufacturer: "Uniframe", model: "Dur-O-Matic", serialNumber: "UNI-FURN-2017-4499", purchaseDate: "2017-07-15", purchaseCost: 45000,
    warrantyExpiration: "2027-07-15", propertyId: "ocps-prop-010", propertyName: "Lake Nona Middle School", location: "Cafeteria",
    condition: "Good", lifecycleStage: "Active", parentId: null, lastServiceDate: "2025-11-01", nextServiceDue: "2026-11-01",
    totalMaintenanceCost: 1200, workOrderCount: 1, assetTag: "OCPS-LNMS-FURN-001"
  },

  // === EDGEWATER HIGH SCHOOL (ocps-prop-016 - bonus) ===
  // Portables & Relocatables
  {
    id: "ocps-ast-027", name: "Portable Classroom Module - 4 Units", description: "4 modular classroom buildings for temporary expansion", category: "Portables & Relocatables",
    manufacturer: "McGrath", model: "RentModular ClassPlus", serialNumber: "MGR-PORT-2018-5500", purchaseDate: "2018-01-22", purchaseCost: 320000,
    warrantyExpiration: "2028-01-22", propertyId: "ocps-prop-013", propertyName: "Timber Creek High School", location: "North Campus Lot",
    condition: "Good", lifecycleStage: "Active", parentId: null, lastServiceDate: "2025-12-10", nextServiceDue: "2026-06-10",
    totalMaintenanceCost: 4800, workOrderCount: 3, assetTag: "OCPS-PORT-001"
  },

  // === ORANGE TECH COLLEGE (ocps-prop-014) ===
  // Additional HVAC for large facility
  {
    id: "ocps-ast-028", name: "HVAC System - Building A", description: "Central chiller plant serving academic building", category: "HVAC",
    manufacturer: "Carrier", model: "19DV500A Chiller", serialNumber: "CAR-CHL-2014-6611", purchaseDate: "2014-11-01", purchaseCost: 185000,
    warrantyExpiration: "2024-11-01", propertyId: "ocps-prop-014", propertyName: "Orange Technical College-Orlando Tech (Main)", location: "Mechanical Room - B2",
    condition: "Poor", lifecycleStage: "Flagged for Replacement", parentId: null, lastServiceDate: "2026-02-10", nextServiceDue: "2026-02-20",
    totalMaintenanceCost: 12400, workOrderCount: 9, assetTag: "OCPS-OTC-HVAC-001"
  },

  // === JOHN T. MORRIS FACILITIES (ocps-prop-015) ===
  // Maintenance facility equipment
  {
    id: "ocps-ast-029", name: "Fleet Vehicle Maintenance Lift System", description: "4-post lifts and service equipment for maintenance fleet", category: "Furniture & Fixtures",
    manufacturer: "Mohawk", model: "Industrial 4-Post 12k", serialNumber: "MHK-LIFT-2012-7722", purchaseDate: "2012-03-10", purchaseCost: 95000,
    warrantyExpiration: "2022-03-10", propertyId: "ocps-prop-015", propertyName: "John T. Morris Facilities Complex", location: "Maintenance Bay",
    condition: "Fair", lifecycleStage: "Active", parentId: null, lastServiceDate: "2026-01-20", nextServiceDue: "2026-03-20",
    totalMaintenanceCost: 3400, workOrderCount: 3, assetTag: "OCPS-FAC-MAINT-001"
  },

  // === HAMLIN ELEMENTARY (ocps-prop-005) ===
  // Fire Suppression System
  {
    id: "ocps-ast-030", name: "Fire Suppression System", description: "Wet pipe sprinkler system throughout building", category: "Fire & Life Safety",
    manufacturer: "Simplex Grinnell", model: "SmartSpot WP", serialNumber: "SMP-FS-2014-8833", purchaseDate: "2014-09-01", purchaseCost: 52000,
    warrantyExpiration: "2024-09-01", propertyId: "ocps-prop-005", propertyName: "Hamlin Elementary School", location: "Throughout",
    condition: "Good", lifecycleStage: "Active", parentId: null, lastServiceDate: "2025-12-20", nextServiceDue: "2026-06-20",
    totalMaintenanceCost: 2100, workOrderCount: 2, assetTag: "OCPS-HES-FS-001"
  },

  // === OCOEE MIDDLE SCHOOL (ocps-prop-008) - Additional ===
  // Athletic Field Lighting
  {
    id: "ocps-ast-031", name: "Athletic Field Lighting System", description: "LED pole lights for baseball, soccer fields", category: "Electrical",
    manufacturer: "Musco", model: "FieldPro LED", serialNumber: "MSC-FLD-2017-3344", purchaseDate: "2017-05-20", purchaseCost: 185000,
    warrantyExpiration: "2027-05-20", propertyId: "ocps-prop-008", propertyName: "Ocoee Middle School", location: "Athletic Fields",
    condition: "Good", lifecycleStage: "Active", parentId: null, lastServiceDate: "2025-11-15", nextServiceDue: "2026-05-15",
    totalMaintenanceCost: 1800, workOrderCount: 1, assetTag: "OCPS-OMS-ATHL-001"
  },

  // === FREEDOM HIGH SCHOOL (bonus property) ===
  {
    id: "ocps-ast-032", name: "HVAC System - Portable Classrooms", description: "Split HVAC units serving portable classrooms", category: "HVAC",
    manufacturer: "Lennox", model: "XP15 3-ton Split", serialNumber: "LNX-PORT-2019-4455", purchaseDate: "2019-09-10", purchaseCost: 18000,
    warrantyExpiration: "2029-09-10", propertyId: "ocps-prop-011", propertyName: "Evans High School", location: "North Portable Lot",
    condition: "Good", lifecycleStage: "Active", parentId: null, lastServiceDate: "2026-01-15", nextServiceDue: "2026-04-15",
    totalMaintenanceCost: 900, workOrderCount: 1, assetTag: "OCPS-FHS-HVAC-PORT"
  },

  // === EDGEWATER HIGH SCHOOL (bonus) ===
  {
    id: "ocps-ast-033", name: "Library Climate Control System", description: "Precision humidity and temperature for rare books collection", category: "HVAC",
    manufacturer: "Trane", model: "Sintesis", serialNumber: "TRA-LIB-2018-5566", purchaseDate: "2018-06-01", purchaseCost: 42000,
    warrantyExpiration: "2028-06-01", propertyId: "ocps-prop-011", propertyName: "Evans High School", location: "Library Media Center",
    condition: "Excellent", lifecycleStage: "Active", parentId: null, lastServiceDate: "2026-01-25", nextServiceDue: "2026-04-25",
    totalMaintenanceCost: 1200, workOrderCount: 1, assetTag: "OCPS-LIB-HVAC-001"
  },

  // === WINDERMERE ELEMENTARY (ocps-prop-007) ===
  {
    id: "ocps-ast-034", name: "Water Treatment & Softening", description: "Building water softener and filtration system", category: "Plumbing",
    manufacturer: "Pentair", model: "Fleck 5600SXT", serialNumber: "PNT-WS-2016-6677", purchaseDate: "2016-04-01", purchaseCost: 8500,
    warrantyExpiration: "2026-04-01", propertyId: "ocps-prop-007", propertyName: "Windermere Elementary School", location: "Mechanical Room",
    condition: "Good", lifecycleStage: "Active", parentId: null, lastServiceDate: "2025-12-10", nextServiceDue: "2026-06-10",
    totalMaintenanceCost: 1600, workOrderCount: 2, assetTag: "OCPS-WES-PLB-001"
  },

  // === OAKRIDGE ELEMENTARY (ocps-prop-006) ===
  {
    id: "ocps-ast-035", name: "Portable Ramp & Accessibility System", description: "ADA compliant ramp systems for building entrances", category: "Elevator & Accessibility",
    manufacturer: "EZ-Access", model: "Suitcase Ramp", serialNumber: "EZA-RAMP-2015-7788", purchaseDate: "2015-08-01", purchaseCost: 18000,
    warrantyExpiration: "2025-08-01", propertyId: "ocps-prop-006", propertyName: "Oakridge Elementary School", location: "Main Entrances",
    condition: "Fair", lifecycleStage: "Active", parentId: null, lastServiceDate: "2026-01-10", nextServiceDue: "2026-07-10",
    totalMaintenanceCost: 2400, workOrderCount: 2, assetTag: "OCPS-OES-ACC-001"
  },
];

// --- RECENT WORK ORDERS ---
export const ocpsRecentWorkOrders: WorkOrder[] = [
  { id: "WO-OCPS-0847", title: "HVAC not cooling in portable classroom", assetId: "ocps-ast-032", assetName: "HVAC System - Portable Classrooms", propertyName: "Evans High School", status: "Open", priority: "High", createdDate: "2026-02-14", completedDate: null, assignedTo: "Unassigned", cost: 0 },
  { id: "WO-OCPS-0845", title: "Cafeteria walk-in cooler temperature alarm", assetId: "ocps-ast-008", assetName: "Walk-In Cooler", propertyName: "Evans High School", status: "In Progress", priority: "High", createdDate: "2026-02-13", completedDate: null, assignedTo: "Robert Martinez", cost: 1200 },
  { id: "WO-OCPS-0841", title: "Roof leak in Building 3", assetId: "ocps-ast-019", assetName: "Roof System - Main Building", propertyName: "Hunters Creek Elementary School", status: "Open", priority: "High", createdDate: "2026-02-12", completedDate: null, assignedTo: "Unassigned", cost: 0 },
  { id: "WO-OCPS-0838", title: "Playground equipment safety inspection", assetId: "ocps-ast-025", assetName: "Playground Equipment System", propertyName: "Conway Middle School", status: "In Progress", priority: "Medium", createdDate: "2026-02-11", completedDate: null, assignedTo: "Sarah Johnson", cost: 350 },
  { id: "WO-OCPS-0835", title: "Fire alarm panel fault - Building A", assetId: "ocps-ast-005", assetName: "Fire Panel", propertyName: "Dillard Street Elementary School", status: "Open", priority: "Critical", createdDate: "2026-02-10", completedDate: null, assignedTo: "Unassigned", cost: 0 },
  { id: "WO-OCPS-0830", title: "Elevator annual inspection due", assetId: "ocps-ast-015", assetName: "Passenger Elevator System", propertyName: "Olympia High School", status: "In Progress", priority: "Medium", createdDate: "2026-02-08", completedDate: null, assignedTo: "Certified Elevator Tech", cost: 800 },
  { id: "WO-OCPS-0825", title: "Network switch failure affecting 20 classrooms", assetId: "ocps-ast-012", assetName: "Server Room Equipment", propertyName: "Timber Creek High School", status: "Completed", priority: "Critical", createdDate: "2026-02-05", completedDate: "2026-02-07", assignedTo: "IT Director", cost: 2400 },
  { id: "WO-OCPS-0820", title: "Bathroom plumbing backup - East wing", assetId: "ocps-ast-018", assetName: "Bathroom Fixtures & Traps", propertyName: "Dream Lake Elementary School", status: "Completed", priority: "High", createdDate: "2026-02-03", completedDate: "2026-02-04", assignedTo: "Plumbing Services", cost: 650 },
  { id: "WO-OCPS-0815", title: "Gym floor refinishing quote needed", assetId: "ocps-ast-021", assetName: "Gymnasium Flooring", propertyName: "Ocoee Middle School", status: "Open", priority: "Medium", createdDate: "2026-02-01", completedDate: null, assignedTo: "Facilities Manager", cost: 0 },
  { id: "WO-OCPS-0810", title: "PA system crackling in East Wing", assetId: "ocps-ast-014", assetName: "PA System", propertyName: "Timber Creek High School", status: "Completed", priority: "Low", createdDate: "2026-01-29", completedDate: "2026-02-02", assignedTo: "Audio Technician", cost: 380 },
];

// --- AGGREGATED STATS ---
export const ocpsDashboardStats = {
  totalAssets: 12450,
  totalProperties: 254,
  activeAssets: 10980,
  underMaintenance: 890,
  flaggedForReplacement: 420,
  decommissioned: 160,
  openWorkOrders: 187,
  overdueWorkOrders: 31,
  totalAssetValue: 245_000_000,
  ytdMaintenanceCost: 4_280_000,
  avgConditionScore: 6.4,
  criticalAssets: 67,
  warrantyExpiringSoon: 156,
};

// --- CHART DATA ---
export const ocpsConditionDistribution = [
  { name: "Excellent", value: 1242, fill: "#10b981" },
  { name: "Good", value: 4356, fill: "#22c55e" },
  { name: "Fair", value: 3890, fill: "#f59e0b" },
  { name: "Poor", value: 2145, fill: "#f97316" },
  { name: "Critical", value: 827, fill: "#ef4444" },
];

export const ocpsMaintenanceCostByMonth = [
  { month: "Sep", cost: 680000, workOrders: 142 },
  { month: "Oct", cost: 725000, workOrders: 158 },
  { month: "Nov", cost: 780000, workOrders: 172 },
  { month: "Dec", cost: 620000, workOrders: 135 },
  { month: "Jan", cost: 875000, workOrders: 187 },
  { month: "Feb", cost: 800000, workOrders: 165 },
];

export const ocpsAssetsByCategory = [
  { category: "HVAC", count: 2145, value: 52_400_000 },
  { category: "Fire & Life Safety", count: 1876, value: 38_200_000 },
  { category: "Electrical", count: 1654, value: 35_600_000 },
  { category: "Kitchen Equipment", count: 987, value: 28_900_000 },
  { category: "IT & Network", count: 1243, value: 42_100_000 },
  { category: "Plumbing", count: 1456, value: 22_800_000 },
  { category: "Roofing", count: 432, value: 18_500_000 },
  { category: "Flooring", count: 876, value: 15_200_000 },
  { category: "Playground & Athletic", count: 654, value: 12_400_000 },
  { category: "Furniture & Fixtures", count: 1232, value: 14_300_000 },
  { category: "Elevator & Accessibility", count: 389, value: 8_600_000 },
  { category: "Portables & Relocatables", count: 526, value: 6_000_000 },
];

export const ocpsTopPropertiesByMaintenance = [
  { name: "Orange Technical College-Orlando Tech (Main)", cost: 687400, workOrders: 78 },
  { name: "Timber Creek High School", cost: 562100, workOrders: 67 },
  { name: "Evans High School", cost: 543800, workOrders: 64 },
  { name: "Olympia High School", cost: 521600, workOrders: 61 },
  { name: "John T. Morris Facilities Complex", cost: 448900, workOrders: 52 },
];
