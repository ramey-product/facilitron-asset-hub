/**
 * Seed data for P1-32 Depreciation.
 * 30 assets with straight-line and declining-balance methods, varying useful lives.
 */

import type { AssetDepreciation } from "@asset-hub/shared";

const CURRENT_YEAR = 2026;

// Helper: compute accumulated depreciation for straight-line
function slAccumulated(purchaseCost: number, salvageValue: number, usefulLife: number, yearsElapsed: number): number {
  const annual = (purchaseCost - salvageValue) / usefulLife;
  const accumulated = Math.min(annual * yearsElapsed, purchaseCost - salvageValue);
  return Math.round(accumulated * 100) / 100;
}

// Helper: compute accumulated depreciation for declining-balance (200% DB)
function dbAccumulated(purchaseCost: number, salvageValue: number, usefulLife: number, yearsElapsed: number): number {
  const rate = 2 / usefulLife;
  let bookValue = purchaseCost;
  let accumulated = 0;
  for (let i = 0; i < yearsElapsed; i++) {
    const dep = Math.min(bookValue * rate, bookValue - salvageValue);
    if (dep <= 0) break;
    accumulated += dep;
    bookValue -= dep;
  }
  return Math.round(accumulated * 100) / 100;
}

function makeRecord(
  assetId: number, assetName: string, categoryName: string,
  method: "straight-line" | "declining-balance",
  usefulLifeYears: number, salvageValue: number, purchaseCost: number,
  acquisitionDate: string
): AssetDepreciation {
  const acqYear = parseInt(acquisitionDate.split("-")[0]!);
  const yearsElapsed = Math.min(CURRENT_YEAR - acqYear, usefulLifeYears);
  const annualDep = method === "straight-line"
    ? Math.round(((purchaseCost - salvageValue) / usefulLifeYears) * 100) / 100
    : Math.round(((purchaseCost - salvageValue) / usefulLifeYears) * 2 * 100) / 100; // first-year approx
  const accumulated = method === "straight-line"
    ? slAccumulated(purchaseCost, salvageValue, usefulLifeYears, yearsElapsed)
    : dbAccumulated(purchaseCost, salvageValue, usefulLifeYears, yearsElapsed);
  const currentBookValue = Math.round((purchaseCost - accumulated) * 100) / 100;
  const isFullyDepreciated = currentBookValue <= salvageValue;

  return {
    assetId, assetName, categoryName, method, usefulLifeYears, salvageValue, purchaseCost,
    annualDepreciation: annualDep,
    accumulatedDepreciation: accumulated,
    currentBookValue: Math.max(currentBookValue, salvageValue),
    yearsElapsed,
    isFullyDepreciated,
    acquisitionDate,
    dateCalculated: "2026-03-13T00:00:00Z",
  };
}

export const mockDepreciationRecords: AssetDepreciation[] = [
  makeRecord(1, "RTU-01 Rooftop Unit", "HVAC", "straight-line", 15, 1850, 18500, "2022-03-15"),
  makeRecord(2, "AHU-02 Air Handler", "HVAC", "straight-line", 15, 1420, 14200, "2023-06-01"),
  makeRecord(3, "Chiller Unit A", "HVAC", "declining-balance", 20, 8500, 85000, "2022-03-01"),
  makeRecord(4, "Boiler Unit B", "HVAC", "straight-line", 20, 2800, 28000, "2024-01-10"),
  makeRecord(5, "Cooling Tower CT-1", "HVAC", "straight-line", 20, 4200, 42000, "2024-05-15"),
  makeRecord(6, "Generator GEN-01", "Electrical", "declining-balance", 15, 6500, 65000, "2025-01-01"),
  makeRecord(7, "Service Van #1", "Fleet", "declining-balance", 5, 3850, 38500, "2022-09-01"),
  makeRecord(8, "Forklift FL-02", "Equipment", "straight-line", 10, 4500, 45000, "2023-11-01"),
  makeRecord(9, "Scissor Lift SL-01", "Equipment", "straight-line", 10, 2800, 28000, "2023-04-01"),
  makeRecord(10, "Fire Pump FP-1", "Fire Safety", "straight-line", 20, 2200, 22000, "2024-06-01"),
  makeRecord(11, "Circulation Pump CP-A", "Plumbing", "straight-line", 10, 1200, 12000, "2022-07-15"),
  makeRecord(12, "Air Compressor AC-1", "Equipment", "straight-line", 10, 1850, 18500, "2023-03-01"),
  makeRecord(13, "Elevator ELV-A", "Vertical Transport", "straight-line", 30, 12500, 125000, "2022-01-01"),
  makeRecord(14, "Elevator ELV-B", "Vertical Transport", "straight-line", 30, 11800, 118000, "2023-05-01"),
  makeRecord(15, "AHU-03 Air Handler", "HVAC", "straight-line", 15, 1550, 15500, "2024-09-01"),
  makeRecord(16, "RTU-02 Rooftop Unit", "HVAC", "straight-line", 15, 1920, 19200, "2025-01-15"),
  makeRecord(17, "Cooling Tower CT-2", "HVAC", "straight-line", 20, 3800, 38000, "2025-03-01"),
  makeRecord(18, "Emergency Generator EG-2", "Electrical", "declining-balance", 15, 5200, 52000, "2025-06-01"),
  makeRecord(19, "Boiler Unit C", "HVAC", "straight-line", 20, 3200, 32000, "2022-10-01"),
  makeRecord(20, "Service Van #2", "Fleet", "declining-balance", 5, 3600, 36000, "2023-07-01"),
  makeRecord(21, "Hydraulic Press HP-1", "Equipment", "straight-line", 15, 5500, 55000, "2023-02-01"),
  makeRecord(22, "Water Softener WS-1", "Plumbing", "straight-line", 10, 850, 8500, "2023-08-01"),
  makeRecord(23, "Vacuum Pump VP-1", "Equipment", "straight-line", 10, 720, 7200, "2023-09-15"),
  makeRecord(24, "Cooling Tower CT-3", "HVAC", "straight-line", 20, 4000, 40000, "2023-06-01"),
  makeRecord(25, "Fire Panel FP-Main", "Fire Safety", "straight-line", 15, 1800, 18000, "2022-04-01"),
  // Fully depreciated assets
  makeRecord(26, "Boiler Unit A (Legacy)", "HVAC", "straight-line", 20, 2500, 25000, "2006-01-01"),
  makeRecord(27, "HVAC Unit (Warehouse)", "HVAC", "straight-line", 15, 800, 8000, "2010-05-01"),
  makeRecord(28, "Old Forklift FL-01", "Equipment", "declining-balance", 7, 2000, 20000, "2015-03-01"),
  makeRecord(29, "Compressor (North Bldg)", "Equipment", "straight-line", 10, 500, 5000, "2014-08-01"),
  makeRecord(30, "HVAC Split System SS-1", "HVAC", "straight-line", 10, 680, 6800, "2025-03-01"),
];
