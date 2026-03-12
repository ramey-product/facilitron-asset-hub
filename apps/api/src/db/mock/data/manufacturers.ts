import type { ManufacturerRecord, ManufacturerModelRecord } from "../../../types/providers.js";

export const mockManufacturers: ManufacturerRecord[] = [
  { manufacturerRecordID: 1, customerID: 1, manufacturerName: "Carrier", contactInfo: "1-800-227-7437", website: "https://www.carrier.com", isActive: true },
  { manufacturerRecordID: 2, customerID: 1, manufacturerName: "Trane", contactInfo: "1-888-872-6348", website: "https://www.trane.com", isActive: true },
  { manufacturerRecordID: 3, customerID: 1, manufacturerName: "Lennox", contactInfo: "1-800-953-6669", website: "https://www.lennox.com", isActive: true },
  { manufacturerRecordID: 4, customerID: 1, manufacturerName: "Kohler", contactInfo: "1-800-456-4537", website: "https://www.kohler.com", isActive: true },
  { manufacturerRecordID: 5, customerID: 1, manufacturerName: "Moen", contactInfo: "1-800-289-6636", website: "https://www.moen.com", isActive: true },
  { manufacturerRecordID: 6, customerID: 1, manufacturerName: "Eaton", contactInfo: "1-877-386-2273", website: "https://www.eaton.com", isActive: true },
  { manufacturerRecordID: 7, customerID: 1, manufacturerName: "Siemens", contactInfo: "1-800-964-4114", website: "https://www.siemens.com", isActive: true },
  { manufacturerRecordID: 8, customerID: 1, manufacturerName: "Gilbarco Veeder-Root", contactInfo: "1-800-800-7498", website: "https://www.gilbarco.com", isActive: true },
  { manufacturerRecordID: 9, customerID: 1, manufacturerName: "Wayne (Dover Fueling)", contactInfo: "1-888-201-3822", website: "https://www.doverfuelingsolutions.com", isActive: true },
  { manufacturerRecordID: 10, customerID: 1, manufacturerName: "Verifone", contactInfo: "1-800-837-4366", website: "https://www.verifone.com", isActive: true },
  { manufacturerRecordID: 11, customerID: 1, manufacturerName: "NCR", contactInfo: "1-800-225-5627", website: "https://www.ncr.com", isActive: true },
  { manufacturerRecordID: 12, customerID: 1, manufacturerName: "Otis Elevator", contactInfo: "1-800-233-6847", website: "https://www.otis.com", isActive: true },
  { manufacturerRecordID: 13, customerID: 1, manufacturerName: "Honeywell", contactInfo: "1-800-328-5111", website: "https://www.honeywell.com", isActive: true },
  { manufacturerRecordID: 14, customerID: 1, manufacturerName: "A.O. Smith", contactInfo: "1-800-527-1953", website: "https://www.aosmith.com", isActive: true },
  { manufacturerRecordID: 15, customerID: 1, manufacturerName: "Generac", contactInfo: "1-888-436-3722", website: "https://www.generac.com", isActive: true },
];

export const mockManufacturerModels: ManufacturerModelRecord[] = [
  // Carrier models
  { id: 1, manufacturerRecordId: 1, customerId: 1, modelName: "WeatherExpert 48TC", modelNumber: "48TC-D16A2A0A0A0A0", categorySlug: "hvac", specifications: "15 ton rooftop unit, gas heat, electric cool", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 2, manufacturerRecordId: 1, customerId: 1, modelName: "WeatherExpert 50XC", modelNumber: "50XC-A24---7", categorySlug: "hvac", specifications: "20 ton rooftop unit, dual circuit", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 3, manufacturerRecordId: 1, customerId: 1, modelName: "AquaEdge 23XRV", modelNumber: "23XRV-5-60", categorySlug: "hvac", specifications: "Water-cooled chiller, variable speed", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 4, manufacturerRecordId: 1, customerId: 1, modelName: "Comfort 24ACC636", modelNumber: "24ACC636A003", categorySlug: "hvac", specifications: "3 ton split system condenser", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },

  // Trane models
  { id: 5, manufacturerRecordId: 2, customerId: 1, modelName: "Voyager TC/TCD", modelNumber: "TCD150B400BB", categorySlug: "hvac", specifications: "12.5 ton commercial rooftop", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 6, manufacturerRecordId: 2, customerId: 1, modelName: "IntelliPak SXHF", modelNumber: "SXHF-C40-DA", categorySlug: "hvac", specifications: "30-40 ton high-efficiency rooftop", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 7, manufacturerRecordId: 2, customerId: 1, modelName: "XR15", modelNumber: "4TTR5030E1000A", categorySlug: "hvac", specifications: "2.5 ton residential heat pump", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 8, manufacturerRecordId: 2, customerId: 1, modelName: "CenTraVac CVHF", modelNumber: "CVHF-1280", categorySlug: "hvac", specifications: "Centrifugal water-cooled chiller", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },

  // Lennox models
  { id: 9, manufacturerRecordId: 3, customerId: 1, modelName: "Energence LGA", modelNumber: "LGA090H4SM3G", categorySlug: "hvac", specifications: "7.5 ton commercial rooftop", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 10, manufacturerRecordId: 3, customerId: 1, modelName: "Landmark LGH", modelNumber: "LGH180H4EM1G", categorySlug: "hvac", specifications: "15 ton rooftop with economizer", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 11, manufacturerRecordId: 3, customerId: 1, modelName: "XC25", modelNumber: "XC25-060-230", categorySlug: "hvac", specifications: "5 ton ultra-high efficiency AC", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },

  // Kohler models (plumbing)
  { id: 12, manufacturerRecordId: 4, customerId: 1, modelName: "Cimarron Toilet", modelNumber: "K-3609-0", categorySlug: "plumbing", specifications: "1.28 GPF elongated toilet", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 13, manufacturerRecordId: 4, customerId: 1, modelName: "Highline Toilet", modelNumber: "K-25224-0", categorySlug: "plumbing", specifications: "1.0 GPF high-efficiency toilet", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 14, manufacturerRecordId: 4, customerId: 1, modelName: "Triton Faucet", modelNumber: "K-7305-5A-CP", categorySlug: "plumbing", specifications: "Commercial sink faucet, wrist blade handles", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },

  // Moen models (plumbing)
  { id: 15, manufacturerRecordId: 5, customerId: 1, modelName: "M-Power Sensor Faucet", modelNumber: "8302", categorySlug: "plumbing", specifications: "Battery-powered sensor faucet", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 16, manufacturerRecordId: 5, customerId: 1, modelName: "M-Dura Faucet", modelNumber: "8215", categorySlug: "plumbing", specifications: "Commercial two-handle faucet", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },

  // Eaton models (electrical)
  { id: 17, manufacturerRecordId: 6, customerId: 1, modelName: "PRL1A Panelboard", modelNumber: "PRL1A3225X42AS", categorySlug: "electrical", specifications: "225A, 42-circuit panelboard", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 18, manufacturerRecordId: 6, customerId: 1, modelName: "Pow-R-Line PRL4", modelNumber: "PRL4G-3225-42-AS", categorySlug: "electrical", specifications: "225A, 3-phase main lug panelboard", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 19, manufacturerRecordId: 6, customerId: 1, modelName: "9395 UPS", modelNumber: "9395-550-4-1", categorySlug: "electrical", specifications: "550kVA uninterruptible power supply", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },

  // Siemens models (fire safety + electrical)
  { id: 20, manufacturerRecordId: 7, customerId: 1, modelName: "Cerberus PRO FC922", modelNumber: "FC922-ZA", categorySlug: "fire-safety", specifications: "Addressable fire alarm panel, 2 loop", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 21, manufacturerRecordId: 7, customerId: 1, modelName: "Desigo CC", modelNumber: "PXC36-E.D", categorySlug: "electrical", specifications: "Building automation controller", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 22, manufacturerRecordId: 7, customerId: 1, modelName: "FireFinder XLS", modelNumber: "XLS-MK5", categorySlug: "fire-safety", specifications: "Networked fire alarm panel, 10 loops", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },

  // Gilbarco models (fuel dispensers)
  { id: 23, manufacturerRecordId: 8, customerId: 1, modelName: "Encore 700 S", modelNumber: "ENR-700-S-4P", categorySlug: "electrical", specifications: "Multi-product fuel dispenser, 4 hose", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 24, manufacturerRecordId: 8, customerId: 1, modelName: "Encore 500 S", modelNumber: "ENR-500-S-2P", categorySlug: "electrical", specifications: "Standard fuel dispenser, 2 hose", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 25, manufacturerRecordId: 8, customerId: 1, modelName: "Passport POS", modelNumber: "PA03570002", categorySlug: "electrical", specifications: "Point-of-sale system for C-store", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },

  // Wayne (Dover) models
  { id: 26, manufacturerRecordId: 9, customerId: 1, modelName: "Helix 6000", modelNumber: "HLX-6000-4G", categorySlug: "electrical", specifications: "Next-gen fuel dispenser, 4 grade", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 27, manufacturerRecordId: 9, customerId: 1, modelName: "Ovation2", modelNumber: "OVT2-4R-2P", categorySlug: "electrical", specifications: "Fuel dispenser, 2 product, 4 hose", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },

  // Verifone models
  { id: 28, manufacturerRecordId: 10, customerId: 1, modelName: "Commander Site Controller", modelNumber: "CMD-SC-2", categorySlug: "electrical", specifications: "Fuel site controller and POS", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 29, manufacturerRecordId: 10, customerId: 1, modelName: "MX 915 Terminal", modelNumber: "MX915-3P", categorySlug: "electrical", specifications: "Payment terminal with PIN pad", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },

  // NCR models
  { id: 30, manufacturerRecordId: 11, customerId: 1, modelName: "FastLane SelfServ", modelNumber: "NCR-7350-K010", categorySlug: "electrical", specifications: "Self-checkout terminal", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },

  // Otis models (structural)
  { id: 31, manufacturerRecordId: 12, customerId: 1, modelName: "Gen2 MRL Elevator", modelNumber: "GEN2-MRL-4000", categorySlug: "structural", specifications: "Machine-room-less traction elevator, 4000 lb", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 32, manufacturerRecordId: 12, customerId: 1, modelName: "SkyRise Elevator", modelNumber: "SKYRISE-3500", categorySlug: "structural", specifications: "High-rise geared traction elevator", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },

  // Honeywell models (fire safety)
  { id: 33, manufacturerRecordId: 13, customerId: 1, modelName: "Silent Knight 6820", modelNumber: "SK-6820-EVS", categorySlug: "fire-safety", specifications: "Addressable fire alarm panel, voice evacuation", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 34, manufacturerRecordId: 13, customerId: 1, modelName: "VESDA VLP", modelNumber: "VLP-600", categorySlug: "fire-safety", specifications: "Very early smoke detection apparatus", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },

  // A.O. Smith models (plumbing)
  { id: 35, manufacturerRecordId: 14, customerId: 1, modelName: "Cyclone Mxi", modelNumber: "BTH-500A-130", categorySlug: "plumbing", specifications: "130-gallon commercial water heater, 500k BTU", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 36, manufacturerRecordId: 14, customerId: 1, modelName: "ProLine XE", modelNumber: "GNBE-50-125", categorySlug: "plumbing", specifications: "50-gallon high-efficiency gas water heater", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },

  // Generac models (electrical)
  { id: 37, manufacturerRecordId: 15, customerId: 1, modelName: "Protector QS 48kW", modelNumber: "RG04854ANAX", categorySlug: "electrical", specifications: "48kW standby generator, natural gas", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 38, manufacturerRecordId: 15, customerId: 1, modelName: "Protector 150kW", modelNumber: "RD15034ADAE", categorySlug: "electrical", specifications: "150kW diesel standby generator", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
  { id: 39, manufacturerRecordId: 15, customerId: 1, modelName: "Industrial 500kW", modelNumber: "SD500", categorySlug: "electrical", specifications: "500kW industrial diesel generator", isActive: true, createdAt: "2024-01-15T00:00:00.000Z" },
];
