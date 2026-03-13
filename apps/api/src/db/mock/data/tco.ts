/**
 * Seed data for P1-31 Asset Cost Rollup / TCO.
 * 30 assets with realistic cost breakdowns.
 */

import type { AssetTCO } from "@asset-hub/shared";

export const mockTCORecords: AssetTCO[] = [
  // HVAC — heavy maintenance loads
  { assetId: 1, assetName: "RTU-01 Rooftop Unit", categoryName: "HVAC", propertyName: "Main Campus", purchaseCost: 18500, maintenanceCost: 8200, partsCost: 3400, laborCost: 4800, downtimeCost: 1200, depreciationCost: 7400, totalTco: 43500, annualTco: 10875, replacementCost: 22000, tcoRatio: 1.98, recommendation: "red", ageYears: 4, acquisitionDate: "2022-03-15", calculatedAt: "2026-03-13T00:00:00Z" },
  { assetId: 2, assetName: "AHU-02 Air Handler", categoryName: "HVAC", propertyName: "Main Campus", purchaseCost: 14200, maintenanceCost: 3100, partsCost: 1200, laborCost: 1900, downtimeCost: 600, depreciationCost: 4260, totalTco: 23360, annualTco: 7787, replacementCost: 16000, tcoRatio: 1.46, recommendation: "red", ageYears: 3, acquisitionDate: "2023-06-01", calculatedAt: "2026-03-13T00:00:00Z" },
  { assetId: 3, assetName: "Chiller Unit A", categoryName: "HVAC", propertyName: "Main Campus", purchaseCost: 85000, maintenanceCost: 32000, partsCost: 14500, laborCost: 17500, downtimeCost: 9500, depreciationCost: 25500, totalTco: 156500, annualTco: 39125, replacementCost: 95000, tcoRatio: 1.65, recommendation: "red", ageYears: 4, acquisitionDate: "2022-03-01", calculatedAt: "2026-03-13T00:00:00Z" },
  { assetId: 4, assetName: "Boiler Unit B", categoryName: "HVAC", propertyName: "North Building", purchaseCost: 28000, maintenanceCost: 9200, partsCost: 3800, laborCost: 5400, downtimeCost: 1800, depreciationCost: 5600, totalTco: 48400, annualTco: 24200, replacementCost: 32000, tcoRatio: 1.51, recommendation: "red", ageYears: 2, acquisitionDate: "2024-01-10", calculatedAt: "2026-03-13T00:00:00Z" },
  { assetId: 5, assetName: "Cooling Tower CT-1", categoryName: "HVAC", propertyName: "Main Campus", purchaseCost: 42000, maintenanceCost: 7500, partsCost: 2800, laborCost: 4700, downtimeCost: 1500, depreciationCost: 8400, totalTco: 62200, annualTco: 31100, replacementCost: 48000, tcoRatio: 1.30, recommendation: "red", ageYears: 2, acquisitionDate: "2024-05-15", calculatedAt: "2026-03-13T00:00:00Z" },

  // Generators — moderate TCO
  { assetId: 6, assetName: "Generator GEN-01", categoryName: "Electrical", propertyName: "Main Campus", purchaseCost: 65000, maintenanceCost: 4200, partsCost: 1800, laborCost: 2400, downtimeCost: 600, depreciationCost: 8125, totalTco: 79725, annualTco: 63780, replacementCost: 75000, tcoRatio: 1.06, recommendation: "red", ageYears: 1.25, acquisitionDate: "2025-01-01", calculatedAt: "2026-03-13T00:00:00Z" },
  { assetId: 18, assetName: "Emergency Generator EG-2", categoryName: "Electrical", propertyName: "North Building", purchaseCost: 52000, maintenanceCost: 1800, partsCost: 800, laborCost: 1000, downtimeCost: 400, depreciationCost: 4333, totalTco: 59333, annualTco: 59333, replacementCost: 58000, tcoRatio: 1.02, recommendation: "red", ageYears: 1, acquisitionDate: "2025-06-01", calculatedAt: "2026-03-13T00:00:00Z" },

  // Fleet — yellow zone
  { assetId: 7, assetName: "Service Van #1", categoryName: "Fleet", propertyName: "Main Campus", purchaseCost: 38500, maintenanceCost: 7200, partsCost: 2900, laborCost: 4300, downtimeCost: 1100, depreciationCost: 11550, totalTco: 61250, annualTco: 17500, replacementCost: 42000, tcoRatio: 1.46, recommendation: "red", ageYears: 3.5, acquisitionDate: "2022-09-01", calculatedAt: "2026-03-13T00:00:00Z" },
  { assetId: 20, assetName: "Service Van #2", categoryName: "Fleet", propertyName: "North Building", purchaseCost: 36000, maintenanceCost: 4100, partsCost: 1600, laborCost: 2500, downtimeCost: 600, depreciationCost: 7200, totalTco: 49500, annualTco: 18000, replacementCost: 40000, tcoRatio: 1.24, recommendation: "red", ageYears: 2.75, acquisitionDate: "2023-07-01", calculatedAt: "2026-03-13T00:00:00Z" },

  // Lift equipment — green zone (newer, well-maintained)
  { assetId: 8, assetName: "Forklift FL-02", categoryName: "Equipment", propertyName: "Warehouse", purchaseCost: 45000, maintenanceCost: 3800, partsCost: 1500, laborCost: 2300, downtimeCost: 900, depreciationCost: 7875, totalTco: 59075, annualTco: 25318, replacementCost: 50000, tcoRatio: 1.18, recommendation: "red", ageYears: 2.33, acquisitionDate: "2023-11-01", calculatedAt: "2026-03-13T00:00:00Z" },
  { assetId: 9, assetName: "Scissor Lift SL-01", categoryName: "Equipment", propertyName: "Warehouse", purchaseCost: 28000, maintenanceCost: 2400, partsCost: 900, laborCost: 1500, downtimeCost: 500, depreciationCost: 4200, totalTco: 36000, annualTco: 12310, replacementCost: 30000, tcoRatio: 1.20, recommendation: "red", ageYears: 2.92, acquisitionDate: "2023-04-01", calculatedAt: "2026-03-13T00:00:00Z" },

  // Pumps — mixed
  { assetId: 10, assetName: "Fire Pump FP-1", categoryName: "Fire Safety", propertyName: "Main Campus", purchaseCost: 22000, maintenanceCost: 2100, partsCost: 800, laborCost: 1300, downtimeCost: 400, depreciationCost: 2444, totalTco: 27744, annualTco: 14767, replacementCost: 24000, tcoRatio: 1.16, recommendation: "red", ageYears: 1.88, acquisitionDate: "2024-06-01", calculatedAt: "2026-03-13T00:00:00Z" },
  { assetId: 11, assetName: "Circulation Pump CP-A", categoryName: "Plumbing", propertyName: "Main Campus", purchaseCost: 12000, maintenanceCost: 9800, partsCost: 4200, laborCost: 5600, downtimeCost: 3200, depreciationCost: 5520, totalTco: 34720, annualTco: 9355, replacementCost: 14000, tcoRatio: 2.48, recommendation: "red", ageYears: 3.71, acquisitionDate: "2022-07-15", calculatedAt: "2026-03-13T00:00:00Z" },

  // Compressors — yellow
  { assetId: 12, assetName: "Air Compressor AC-1", categoryName: "Equipment", propertyName: "Warehouse", purchaseCost: 18500, maintenanceCost: 4200, partsCost: 1600, laborCost: 2600, downtimeCost: 700, depreciationCost: 5550, totalTco: 30550, annualTco: 10183, replacementCost: 21000, tcoRatio: 1.45, recommendation: "red", ageYears: 3, acquisitionDate: "2023-03-01", calculatedAt: "2026-03-13T00:00:00Z" },

  // Elevators — yellow
  { assetId: 13, assetName: "Elevator ELV-A", categoryName: "Vertical Transport", propertyName: "Main Campus", purchaseCost: 125000, maintenanceCost: 22000, partsCost: 8500, laborCost: 13500, downtimeCost: 4500, depreciationCost: 25000, totalTco: 185000, annualTco: 44048, replacementCost: 145000, tcoRatio: 1.28, recommendation: "red", ageYears: 4.21, acquisitionDate: "2022-01-01", calculatedAt: "2026-03-13T00:00:00Z" },
  { assetId: 14, assetName: "Elevator ELV-B", categoryName: "Vertical Transport", propertyName: "Main Campus", purchaseCost: 118000, maintenanceCost: 8500, partsCost: 3200, laborCost: 5300, downtimeCost: 1500, depreciationCost: 16520, totalTco: 147720, annualTco: 52757, replacementCost: 135000, tcoRatio: 1.09, recommendation: "red", ageYears: 2.8, acquisitionDate: "2023-05-01", calculatedAt: "2026-03-13T00:00:00Z" },

  // HVAC — newer, green zone
  { assetId: 15, assetName: "AHU-03 Air Handler", categoryName: "HVAC", propertyName: "South Wing", purchaseCost: 15500, maintenanceCost: 1800, partsCost: 700, laborCost: 1100, downtimeCost: 350, depreciationCost: 2325, totalTco: 20675, annualTco: 12175, replacementCost: 17000, tcoRatio: 1.22, recommendation: "red", ageYears: 1.7, acquisitionDate: "2024-09-01", calculatedAt: "2026-03-13T00:00:00Z" },
  { assetId: 16, assetName: "RTU-02 Rooftop Unit", categoryName: "HVAC", propertyName: "South Wing", purchaseCost: 19200, maintenanceCost: 1200, partsCost: 400, laborCost: 800, downtimeCost: 250, depreciationCost: 1920, totalTco: 22970, annualTco: 19142, replacementCost: 22000, tcoRatio: 1.04, recommendation: "red", ageYears: 1.2, acquisitionDate: "2025-01-15", calculatedAt: "2026-03-13T00:00:00Z" },

  // Cooling towers
  { assetId: 17, assetName: "Cooling Tower CT-2", categoryName: "HVAC", propertyName: "North Building", purchaseCost: 38000, maintenanceCost: 1500, partsCost: 600, laborCost: 900, downtimeCost: 300, depreciationCost: 3167, totalTco: 43567, annualTco: 43567, replacementCost: 42000, tcoRatio: 1.04, recommendation: "red", ageYears: 1, acquisitionDate: "2025-03-01", calculatedAt: "2026-03-13T00:00:00Z" },
  { assetId: 24, assetName: "Cooling Tower CT-3", categoryName: "HVAC", propertyName: "East Campus", purchaseCost: 40000, maintenanceCost: 6800, partsCost: 2600, laborCost: 4200, downtimeCost: 1200, depreciationCost: 11667, totalTco: 62267, annualTco: 21422, replacementCost: 44000, tcoRatio: 1.42, recommendation: "red", ageYears: 2.9, acquisitionDate: "2023-06-01", calculatedAt: "2026-03-13T00:00:00Z" },

  // Boiler C
  { assetId: 19, assetName: "Boiler Unit C", categoryName: "HVAC", propertyName: "East Campus", purchaseCost: 32000, maintenanceCost: 8900, partsCost: 3500, laborCost: 5400, downtimeCost: 1800, depreciationCost: 9600, totalTco: 55800, annualTco: 16235, replacementCost: 36000, tcoRatio: 1.55, recommendation: "red", ageYears: 3.44, acquisitionDate: "2022-10-01", calculatedAt: "2026-03-13T00:00:00Z" },

  // Hydraulic press
  { assetId: 21, assetName: "Hydraulic Press HP-1", categoryName: "Equipment", propertyName: "Warehouse", purchaseCost: 55000, maintenanceCost: 14500, partsCost: 6200, laborCost: 8300, downtimeCost: 5500, depreciationCost: 16500, totalTco: 97700, annualTco: 30840, replacementCost: 62000, tcoRatio: 1.58, recommendation: "red", ageYears: 3.17, acquisitionDate: "2023-02-01", calculatedAt: "2026-03-13T00:00:00Z" },

  // Water treatment
  { assetId: 22, assetName: "Water Softener WS-1", categoryName: "Plumbing", propertyName: "Main Campus", purchaseCost: 8500, maintenanceCost: 1800, partsCost: 700, laborCost: 1100, downtimeCost: 200, depreciationCost: 1984, totalTco: 13184, annualTco: 4875, replacementCost: 9500, tcoRatio: 1.39, recommendation: "red", ageYears: 2.71, acquisitionDate: "2023-08-01", calculatedAt: "2026-03-13T00:00:00Z" },
  { assetId: 23, assetName: "Vacuum Pump VP-1", categoryName: "Equipment", propertyName: "Warehouse", purchaseCost: 7200, maintenanceCost: 2100, partsCost: 800, laborCost: 1300, downtimeCost: 300, depreciationCost: 1800, totalTco: 12200, annualTco: 4697, replacementCost: 8000, tcoRatio: 1.53, recommendation: "red", ageYears: 2.6, acquisitionDate: "2023-09-15", calculatedAt: "2026-03-13T00:00:00Z" },

  // Fire safety
  { assetId: 25, assetName: "Fire Panel FP-Main", categoryName: "Fire Safety", propertyName: "Main Campus", purchaseCost: 18000, maintenanceCost: 3200, partsCost: 1200, laborCost: 2000, downtimeCost: 400, depreciationCost: 7200, totalTco: 30000, annualTco: 7143, replacementCost: 20000, tcoRatio: 1.50, recommendation: "red", ageYears: 4.2, acquisitionDate: "2022-04-01", calculatedAt: "2026-03-13T00:00:00Z" },

  // Well-maintained newer assets (yellow range)
  { assetId: 30, assetName: "HVAC Split System SS-1", categoryName: "HVAC", propertyName: "South Wing", purchaseCost: 6800, maintenanceCost: 900, partsCost: 350, laborCost: 550, downtimeCost: 120, depreciationCost: 680, totalTco: 8850, annualTco: 8850, replacementCost: 7500, tcoRatio: 1.18, recommendation: "red", ageYears: 1, acquisitionDate: "2025-03-01", calculatedAt: "2026-03-13T00:00:00Z" },
  { assetId: 31, assetName: "Exhaust Fan EF-1", categoryName: "HVAC", propertyName: "Main Campus", purchaseCost: 3200, maintenanceCost: 480, partsCost: 180, laborCost: 300, downtimeCost: 80, depreciationCost: 640, totalTco: 4580, annualTco: 2290, replacementCost: 3500, tcoRatio: 1.31, recommendation: "red", ageYears: 2, acquisitionDate: "2024-03-01", calculatedAt: "2026-03-13T00:00:00Z" },
  { assetId: 32, assetName: "Backflow Preventer BP-1", categoryName: "Plumbing", propertyName: "Main Campus", purchaseCost: 2800, maintenanceCost: 600, partsCost: 200, laborCost: 400, downtimeCost: 60, depreciationCost: 840, totalTco: 4500, annualTco: 1500, replacementCost: 3200, tcoRatio: 1.41, recommendation: "red", ageYears: 3, acquisitionDate: "2023-03-01", calculatedAt: "2026-03-13T00:00:00Z" },
  { assetId: 33, assetName: "EV Charging Station EV-1", categoryName: "Electrical", propertyName: "Main Campus", purchaseCost: 12500, maintenanceCost: 400, partsCost: 150, laborCost: 250, downtimeCost: 50, depreciationCost: 625, totalTco: 13725, annualTco: 13725, replacementCost: 14000, tcoRatio: 0.98, recommendation: "yellow", ageYears: 1, acquisitionDate: "2025-03-01", calculatedAt: "2026-03-13T00:00:00Z" },
  { assetId: 34, assetName: "LED Lighting Panel LP-1", categoryName: "Electrical", propertyName: "North Building", purchaseCost: 4500, maintenanceCost: 200, partsCost: 80, laborCost: 120, downtimeCost: 30, depreciationCost: 450, totalTco: 5260, annualTco: 5260, replacementCost: 5000, tcoRatio: 1.05, recommendation: "red", ageYears: 1, acquisitionDate: "2025-03-01", calculatedAt: "2026-03-13T00:00:00Z" },
];
