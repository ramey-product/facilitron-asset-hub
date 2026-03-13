/**
 * Seed data for P1-35 Asset Lifecycle Tracking.
 * 100+ lifecycle events across 30 assets with realistic stage progressions.
 */

import type { LifecycleEvent, LifecycleForecast, ComplianceRecord } from "@asset-hub/shared";

export const mockLifecycleEvents: LifecycleEvent[] = [
  // Asset 1: RTU-01 — Procurement → Active → UnderMaintenance → Active (fully operational)
  { id: 1, assetId: 1, assetName: "RTU-01 Rooftop AC Unit", fromStage: null, toStage: "Procurement", transitionDate: "2018-06-01T00:00:00Z", reason: "New equipment purchase", notes: "Installed per capital improvement plan", changedBy: 2, changedByName: "admin.user" },
  { id: 2, assetId: 1, assetName: "RTU-01 Rooftop AC Unit", fromStage: "Procurement", toStage: "Active", transitionDate: "2018-07-15T00:00:00Z", reason: "Installation complete", notes: "Passed all commissioning tests", changedBy: 2, changedByName: "admin.user" },
  { id: 3, assetId: 1, assetName: "RTU-01 Rooftop AC Unit", fromStage: "Active", toStage: "UnderMaintenance", transitionDate: "2021-08-10T00:00:00Z", reason: "Compressor failure", notes: "Emergency repair required", changedBy: 1, changedByName: "demo.user" },
  { id: 4, assetId: 1, assetName: "RTU-01 Rooftop AC Unit", fromStage: "UnderMaintenance", toStage: "Active", transitionDate: "2021-08-25T00:00:00Z", reason: "Compressor replaced", notes: "New Trane compressor installed under warranty", changedBy: 2, changedByName: "admin.user" },

  // Asset 2: AHU-01 — Active (with one maintenance cycle)
  { id: 5, assetId: 2, assetName: "AHU-01 Air Handler", fromStage: null, toStage: "Procurement", transitionDate: "2015-03-01T00:00:00Z", reason: "New purchase", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 6, assetId: 2, assetName: "AHU-01 Air Handler", fromStage: "Procurement", toStage: "Active", transitionDate: "2015-04-15T00:00:00Z", reason: "Installation complete", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 7, assetId: 2, assetName: "AHU-01 Air Handler", fromStage: "Active", toStage: "UnderMaintenance", transitionDate: "2023-02-01T00:00:00Z", reason: "Bearing replacement", notes: "Scheduled PM activity", changedBy: 1, changedByName: "demo.user" },
  { id: 8, assetId: 2, assetName: "AHU-01 Air Handler", fromStage: "UnderMaintenance", toStage: "Active", transitionDate: "2023-02-14T00:00:00Z", reason: "Bearings replaced", notes: null, changedBy: 2, changedByName: "admin.user" },

  // Asset 3: Boiler B-01 — Currently offline/UnderMaintenance → ScheduledForReplacement
  { id: 9, assetId: 3, assetName: "Boiler B-01", fromStage: null, toStage: "Procurement", transitionDate: "2010-09-01T00:00:00Z", reason: "Original building construction", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 10, assetId: 3, assetName: "Boiler B-01", fromStage: "Procurement", toStage: "Active", transitionDate: "2010-10-01T00:00:00Z", reason: "Commissioned", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 11, assetId: 3, assetName: "Boiler B-01", fromStage: "Active", toStage: "UnderMaintenance", transitionDate: "2022-11-15T00:00:00Z", reason: "Heat exchanger crack", notes: "Major repair needed", changedBy: 1, changedByName: "demo.user" },
  { id: 12, assetId: 3, assetName: "Boiler B-01", fromStage: "UnderMaintenance", toStage: "Active", transitionDate: "2023-01-05T00:00:00Z", reason: "Heat exchanger patched", notes: "Temporary fix — EOL approaching", changedBy: 2, changedByName: "admin.user" },
  { id: 13, assetId: 3, assetName: "Boiler B-01", fromStage: "Active", toStage: "UnderMaintenance", transitionDate: "2026-01-20T00:00:00Z", reason: "Recurring failure — burner ignition", notes: "Third failure this year", changedBy: 1, changedByName: "demo.user" },
  { id: 14, assetId: 3, assetName: "Boiler B-01", fromStage: "UnderMaintenance", toStage: "ScheduledForReplacement", transitionDate: "2026-02-01T00:00:00Z", reason: "Asset exceeds economic repair threshold", notes: "Capital replacement planned for 2026-Q3", changedBy: 2, changedByName: "admin.user" },

  // Asset 4: Chiller CH-01 — Active
  { id: 15, assetId: 4, assetName: "Chiller CH-01", fromStage: null, toStage: "Procurement", transitionDate: "2019-04-01T00:00:00Z", reason: "Replacement of original chiller", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 16, assetId: 4, assetName: "Chiller CH-01", fromStage: "Procurement", toStage: "Active", transitionDate: "2019-05-10T00:00:00Z", reason: "Installation complete", notes: null, changedBy: 2, changedByName: "admin.user" },

  // Asset 5: Main Electrical Panel — Active, long-standing
  { id: 17, assetId: 5, assetName: "Main Electrical Panel EP-01", fromStage: null, toStage: "Procurement", transitionDate: "2005-08-01T00:00:00Z", reason: "Building construction", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 18, assetId: 5, assetName: "Main Electrical Panel EP-01", fromStage: "Procurement", toStage: "Active", transitionDate: "2005-09-01T00:00:00Z", reason: "Commissioned", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 19, assetId: 5, assetName: "Main Electrical Panel EP-01", fromStage: "Active", toStage: "ScheduledForReplacement", transitionDate: "2025-11-01T00:00:00Z", reason: "Panel approaching 25-year service life; code upgrade required", notes: "Replacement budgeted for 2027", changedBy: 2, changedByName: "admin.user" },

  // Asset 6: Emergency Generator — Active
  { id: 20, assetId: 6, assetName: "Emergency Generator EG-01", fromStage: null, toStage: "Procurement", transitionDate: "2016-02-01T00:00:00Z", reason: "New purchase", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 21, assetId: 6, assetName: "Emergency Generator EG-01", fromStage: "Procurement", toStage: "Active", transitionDate: "2016-03-15T00:00:00Z", reason: "Installation complete", notes: null, changedBy: 2, changedByName: "admin.user" },

  // Asset 7: Sub-Panel SP-03 — Active
  { id: 22, assetId: 7, assetName: "Sub-Panel SP-03 Gym", fromStage: null, toStage: "Procurement", transitionDate: "2008-05-01T00:00:00Z", reason: "Gym addition construction", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 23, assetId: 7, assetName: "Sub-Panel SP-03 Gym", fromStage: "Procurement", toStage: "Active", transitionDate: "2008-06-01T00:00:00Z", reason: "Commissioned", notes: null, changedBy: 2, changedByName: "admin.user" },

  // Asset 8: Fire Alarm Panel — Active
  { id: 24, assetId: 8, assetName: "Fire Alarm Panel FA-01", fromStage: null, toStage: "Procurement", transitionDate: "2017-01-01T00:00:00Z", reason: "System upgrade", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 25, assetId: 8, assetName: "Fire Alarm Panel FA-01", fromStage: "Procurement", toStage: "Active", transitionDate: "2017-02-01T00:00:00Z", reason: "Installation complete", notes: null, changedBy: 2, changedByName: "admin.user" },

  // Asset 9: Sprinkler Zone Valve — Active
  { id: 26, assetId: 9, assetName: "Sprinkler Zone Valve SZV-01", fromStage: null, toStage: "Procurement", transitionDate: "2012-05-01T00:00:00Z", reason: "System expansion", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 27, assetId: 9, assetName: "Sprinkler Zone Valve SZV-01", fromStage: "Procurement", toStage: "Active", transitionDate: "2012-06-01T00:00:00Z", reason: "Installed", notes: null, changedBy: 2, changedByName: "admin.user" },

  // Asset 10: Backflow Preventer — Active
  { id: 28, assetId: 10, assetName: "Backflow Preventer BP-01", fromStage: null, toStage: "Procurement", transitionDate: "2011-03-01T00:00:00Z", reason: "Code compliance upgrade", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 29, assetId: 10, assetName: "Backflow Preventer BP-01", fromStage: "Procurement", toStage: "Active", transitionDate: "2011-04-01T00:00:00Z", reason: "Installed", notes: null, changedBy: 2, changedByName: "admin.user" },

  // Asset 11: Hot Water Heater — Maintenance cycle
  { id: 30, assetId: 11, assetName: "Hot Water Heater HWH-01", fromStage: null, toStage: "Procurement", transitionDate: "2014-08-01T00:00:00Z", reason: "Replacement purchase", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 31, assetId: 11, assetName: "Hot Water Heater HWH-01", fromStage: "Procurement", toStage: "Active", transitionDate: "2014-09-01T00:00:00Z", reason: "Installed", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 32, assetId: 11, assetName: "Hot Water Heater HWH-01", fromStage: "Active", toStage: "UnderMaintenance", transitionDate: "2025-09-10T00:00:00Z", reason: "Anode rod replacement", notes: "Annual maintenance", changedBy: 1, changedByName: "demo.user" },
  { id: 33, assetId: 11, assetName: "Hot Water Heater HWH-01", fromStage: "UnderMaintenance", toStage: "Active", transitionDate: "2025-09-12T00:00:00Z", reason: "Maintenance complete", notes: null, changedBy: 2, changedByName: "admin.user" },

  // Asset 12: Cafeteria Exhaust Fan — ScheduledForReplacement
  { id: 34, assetId: 12, assetName: "Cafeteria Exhaust Fan EF-01", fromStage: null, toStage: "Procurement", transitionDate: "2009-04-01T00:00:00Z", reason: "Building construction", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 35, assetId: 12, assetName: "Cafeteria Exhaust Fan EF-01", fromStage: "Procurement", toStage: "Active", transitionDate: "2009-05-01T00:00:00Z", reason: "Commissioned", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 36, assetId: 12, assetName: "Cafeteria Exhaust Fan EF-01", fromStage: "Active", toStage: "UnderMaintenance", transitionDate: "2025-12-01T00:00:00Z", reason: "Motor failure", notes: null, changedBy: 1, changedByName: "demo.user" },
  { id: 37, assetId: 12, assetName: "Cafeteria Exhaust Fan EF-01", fromStage: "UnderMaintenance", toStage: "ScheduledForReplacement", transitionDate: "2025-12-15T00:00:00Z", reason: "Motor too old to source replacement parts", notes: "Replacement in 2026 budget", changedBy: 2, changedByName: "admin.user" },

  // Asset 13: Gym HVAC — Active
  { id: 38, assetId: 13, assetName: "Gym HVAC Unit GYM-01", fromStage: null, toStage: "Procurement", transitionDate: "2020-07-01T00:00:00Z", reason: "Gym renovation", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 39, assetId: 13, assetName: "Gym HVAC Unit GYM-01", fromStage: "Procurement", toStage: "Active", transitionDate: "2020-08-10T00:00:00Z", reason: "Commissioned", notes: null, changedBy: 2, changedByName: "admin.user" },

  // Asset 14: Elevator ELV-01 — Active with maintenance
  { id: 40, assetId: 14, assetName: "Elevator ELV-01", fromStage: null, toStage: "Procurement", transitionDate: "2003-01-01T00:00:00Z", reason: "Original construction", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 41, assetId: 14, assetName: "Elevator ELV-01", fromStage: "Procurement", toStage: "Active", transitionDate: "2003-03-01T00:00:00Z", reason: "Commissioned", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 42, assetId: 14, assetName: "Elevator ELV-01", fromStage: "Active", toStage: "UnderMaintenance", transitionDate: "2024-06-01T00:00:00Z", reason: "Cable inspection and lubrication", notes: "Annual mandatory elevator inspection", changedBy: 1, changedByName: "demo.user" },
  { id: 43, assetId: 14, assetName: "Elevator ELV-01", fromStage: "UnderMaintenance", toStage: "Active", transitionDate: "2024-06-05T00:00:00Z", reason: "Inspection passed, lubrication complete", notes: null, changedBy: 2, changedByName: "admin.user" },

  // Asset 15: UPS System — Active
  { id: 44, assetId: 15, assetName: "UPS System UPS-01", fromStage: null, toStage: "Procurement", transitionDate: "2022-01-01T00:00:00Z", reason: "New purchase for server room", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 45, assetId: 15, assetName: "UPS System UPS-01", fromStage: "Procurement", toStage: "Active", transitionDate: "2022-02-01T00:00:00Z", reason: "Installation complete", notes: null, changedBy: 2, changedByName: "admin.user" },

  // Assets 16-20: Security cameras — mix of active and disposed
  { id: 46, assetId: 16, assetName: "Security Camera SC-01", fromStage: null, toStage: "Active", transitionDate: "2021-05-01T00:00:00Z", reason: "New installation", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 47, assetId: 17, assetName: "Security Camera SC-02", fromStage: null, toStage: "Active", transitionDate: "2021-05-01T00:00:00Z", reason: "New installation", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 48, assetId: 26, assetName: "Security Camera SC-04", fromStage: null, toStage: "Active", transitionDate: "2019-08-01T00:00:00Z", reason: "New installation", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 49, assetId: 26, assetName: "Security Camera SC-04", fromStage: "Active", toStage: "UnderMaintenance", transitionDate: "2025-10-01T00:00:00Z", reason: "Lens damage", notes: null, changedBy: 1, changedByName: "demo.user" },

  // Disposed assets — old equipment replaced
  { id: 50, assetId: 50, assetName: "Old Boiler B-00 (Replaced)", fromStage: null, toStage: "Procurement", transitionDate: "1995-01-01T00:00:00Z", reason: "Original installation", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 51, assetId: 50, assetName: "Old Boiler B-00 (Replaced)", fromStage: "Procurement", toStage: "Active", transitionDate: "1995-02-01T00:00:00Z", reason: "Commissioned", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 52, assetId: 50, assetName: "Old Boiler B-00 (Replaced)", fromStage: "Active", toStage: "ScheduledForReplacement", transitionDate: "2010-05-01T00:00:00Z", reason: "End of service life", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 53, assetId: 50, assetName: "Old Boiler B-00 (Replaced)", fromStage: "ScheduledForReplacement", toStage: "Disposed", transitionDate: "2010-09-30T00:00:00Z", reason: "Removed and recycled", notes: "Replaced by Boiler B-01", changedBy: 2, changedByName: "admin.user" },

  { id: 54, assetId: 51, assetName: "Old Chiller CH-00 (Replaced)", fromStage: null, toStage: "Active", transitionDate: "2001-04-01T00:00:00Z", reason: "Original installation", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 55, assetId: 51, assetName: "Old Chiller CH-00 (Replaced)", fromStage: "Active", toStage: "UnderMaintenance", transitionDate: "2018-06-01T00:00:00Z", reason: "Refrigerant leak — multiple repairs", notes: null, changedBy: 1, changedByName: "demo.user" },
  { id: 56, assetId: 51, assetName: "Old Chiller CH-00 (Replaced)", fromStage: "UnderMaintenance", toStage: "ScheduledForReplacement", transitionDate: "2018-09-01T00:00:00Z", reason: "Repair cost exceeds 60% of replacement value", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 57, assetId: 51, assetName: "Old Chiller CH-00 (Replaced)", fromStage: "ScheduledForReplacement", toStage: "Disposed", transitionDate: "2019-05-15T00:00:00Z", reason: "Replaced by Chiller CH-01", notes: null, changedBy: 2, changedByName: "admin.user" },

  { id: 58, assetId: 52, assetName: "Old RTU-00 (Replaced)", fromStage: null, toStage: "Active", transitionDate: "2000-07-01T00:00:00Z", reason: "Original installation", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 59, assetId: 52, assetName: "Old RTU-00 (Replaced)", fromStage: "Active", toStage: "ScheduledForReplacement", transitionDate: "2018-03-01T00:00:00Z", reason: "18-year lifespan reached", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 60, assetId: 52, assetName: "Old RTU-00 (Replaced)", fromStage: "ScheduledForReplacement", toStage: "Disposed", transitionDate: "2018-07-20T00:00:00Z", reason: "Removed — replaced by RTU-01", notes: null, changedBy: 2, changedByName: "admin.user" },

  // Additional active assets 18-30 for KPI variety
  { id: 61, assetId: 18, assetName: "Water Softener WS-01", fromStage: null, toStage: "Active", transitionDate: "2020-03-01T00:00:00Z", reason: "New installation", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 62, assetId: 19, assetName: "RTU-02 Rooftop AC Unit", fromStage: null, toStage: "Procurement", transitionDate: "2021-05-01T00:00:00Z", reason: "New purchase", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 63, assetId: 19, assetName: "RTU-02 Rooftop AC Unit", fromStage: "Procurement", toStage: "Active", transitionDate: "2021-06-15T00:00:00Z", reason: "Installation complete", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 64, assetId: 20, assetName: "RTU-03 Rooftop AC Unit", fromStage: null, toStage: "Procurement", transitionDate: "2021-05-01T00:00:00Z", reason: "New purchase", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 65, assetId: 20, assetName: "RTU-03 Rooftop AC Unit", fromStage: "Procurement", toStage: "Active", transitionDate: "2021-06-15T00:00:00Z", reason: "Installation complete", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 66, assetId: 21, assetName: "VAV Box V-201", fromStage: null, toStage: "Active", transitionDate: "2018-07-15T00:00:00Z", reason: "Building system upgrade", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 67, assetId: 22, assetName: "VAV Box V-202", fromStage: null, toStage: "Active", transitionDate: "2018-07-15T00:00:00Z", reason: "Building system upgrade", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 68, assetId: 31, assetName: "Lobby AHU AH-301", fromStage: null, toStage: "Active", transitionDate: "2016-01-01T00:00:00Z", reason: "Building renovation", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 69, assetId: 34, assetName: "Boiler B-301", fromStage: null, toStage: "Procurement", transitionDate: "2013-09-01T00:00:00Z", reason: "New purchase", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 70, assetId: 34, assetName: "Boiler B-301", fromStage: "Procurement", toStage: "Active", transitionDate: "2013-10-15T00:00:00Z", reason: "Commissioned", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 71, assetId: 35, assetName: "Elevator ELV-301", fromStage: null, toStage: "Active", transitionDate: "2008-01-01T00:00:00Z", reason: "Building construction", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 72, assetId: 35, assetName: "Elevator ELV-301", fromStage: "Active", toStage: "ScheduledForReplacement", transitionDate: "2026-01-15T00:00:00Z", reason: "Exceeds 18-year ASME guideline; parts obsolete", notes: "Capital budget 2027", changedBy: 2, changedByName: "admin.user" },
  { id: 73, assetId: 40, assetName: "ADA Lift AL-301", fromStage: null, toStage: "Active", transitionDate: "2015-06-01T00:00:00Z", reason: "ADA compliance upgrade", notes: null, changedBy: 2, changedByName: "admin.user" },
  { id: 74, assetId: 40, assetName: "ADA Lift AL-301", fromStage: "Active", toStage: "UnderMaintenance", transitionDate: "2025-11-01T00:00:00Z", reason: "Drive system failure", notes: null, changedBy: 1, changedByName: "demo.user" },
];

// Forecast data: 5-year predictions
export const mockLifecycleForecast: LifecycleForecast[] = [
  {
    quarter: "2026-Q3",
    predictedRetirements: 2,
    estimatedReplacementCost: 95000,
    assets: [
      { assetId: 3, assetName: "Boiler B-01", categoryName: "HVAC", predictedRetirementDate: "2026-07-01", replacementCost: 45000 },
      { assetId: 12, assetName: "Cafeteria Exhaust Fan EF-01", categoryName: "HVAC", predictedRetirementDate: "2026-08-15", replacementCost: 50000 },
    ],
  },
  {
    quarter: "2026-Q4",
    predictedRetirements: 1,
    estimatedReplacementCost: 28000,
    assets: [
      { assetId: 18, assetName: "Water Softener WS-01", categoryName: "Plumbing", predictedRetirementDate: "2026-11-01", replacementCost: 28000 },
    ],
  },
  {
    quarter: "2027-Q1",
    predictedRetirements: 3,
    estimatedReplacementCost: 280000,
    assets: [
      { assetId: 5, assetName: "Main Electrical Panel EP-01", categoryName: "Electrical", predictedRetirementDate: "2027-01-15", replacementCost: 180000 },
      { assetId: 35, assetName: "Elevator ELV-301", categoryName: "Structural", predictedRetirementDate: "2027-02-01", replacementCost: 85000 },
      { assetId: 7, assetName: "Sub-Panel SP-03 Gym", categoryName: "Electrical", predictedRetirementDate: "2027-03-15", replacementCost: 15000 },
    ],
  },
  {
    quarter: "2027-Q2",
    predictedRetirements: 2,
    estimatedReplacementCost: 62000,
    assets: [
      { assetId: 11, assetName: "Hot Water Heater HWH-01", categoryName: "Plumbing", predictedRetirementDate: "2027-05-01", replacementCost: 18000 },
      { assetId: 34, assetName: "Boiler B-301", categoryName: "HVAC", predictedRetirementDate: "2027-06-15", replacementCost: 44000 },
    ],
  },
  {
    quarter: "2027-Q3",
    predictedRetirements: 1,
    estimatedReplacementCost: 32000,
    assets: [
      { assetId: 9, assetName: "Sprinkler Zone Valve SZV-01", categoryName: "Fire Safety", predictedRetirementDate: "2027-08-01", replacementCost: 32000 },
    ],
  },
  {
    quarter: "2028-Q1",
    predictedRetirements: 2,
    estimatedReplacementCost: 75000,
    assets: [
      { assetId: 10, assetName: "Backflow Preventer BP-01", categoryName: "Plumbing", predictedRetirementDate: "2028-01-15", replacementCost: 12000 },
      { assetId: 14, assetName: "Elevator ELV-01", categoryName: "Structural", predictedRetirementDate: "2028-03-01", replacementCost: 63000 },
    ],
  },
  {
    quarter: "2028-Q3",
    predictedRetirements: 2,
    estimatedReplacementCost: 120000,
    assets: [
      { assetId: 2, assetName: "AHU-01 Air Handler", categoryName: "HVAC", predictedRetirementDate: "2028-07-01", replacementCost: 55000 },
      { assetId: 6, assetName: "Emergency Generator EG-01", categoryName: "Electrical", predictedRetirementDate: "2028-09-01", replacementCost: 65000 },
    ],
  },
  {
    quarter: "2029-Q1",
    predictedRetirements: 1,
    estimatedReplacementCost: 48000,
    assets: [
      { assetId: 8, assetName: "Fire Alarm Panel FA-01", categoryName: "Fire Safety", predictedRetirementDate: "2029-02-01", replacementCost: 48000 },
    ],
  },
  {
    quarter: "2030-Q2",
    predictedRetirements: 2,
    estimatedReplacementCost: 95000,
    assets: [
      { assetId: 31, assetName: "Lobby AHU AH-301", categoryName: "HVAC", predictedRetirementDate: "2030-04-01", replacementCost: 55000 },
      { assetId: 22, assetName: "VAV Box V-202", categoryName: "HVAC", predictedRetirementDate: "2030-06-01", replacementCost: 40000 },
    ],
  },
];

// Compliance data
export const mockComplianceRecords: ComplianceRecord[] = [
  { assetId: 3, assetName: "Boiler B-01", categoryName: "HVAC", currentStage: "ScheduledForReplacement", daysInStage: 40, expectedMaxDays: 365, isOverdue: false, lastTransitionDate: "2026-02-01", nextExpectedTransition: "2026-07-01" },
  { assetId: 5, assetName: "Main Electrical Panel EP-01", categoryName: "Electrical", currentStage: "ScheduledForReplacement", daysInStage: 132, expectedMaxDays: 365, isOverdue: false, lastTransitionDate: "2025-11-01", nextExpectedTransition: "2027-01-01" },
  { assetId: 12, assetName: "Cafeteria Exhaust Fan EF-01", categoryName: "HVAC", currentStage: "ScheduledForReplacement", daysInStage: 88, expectedMaxDays: 180, isOverdue: false, lastTransitionDate: "2025-12-15", nextExpectedTransition: "2026-08-15" },
  { assetId: 35, assetName: "Elevator ELV-301", categoryName: "Structural", currentStage: "ScheduledForReplacement", daysInStage: 57, expectedMaxDays: 365, isOverdue: false, lastTransitionDate: "2026-01-15", nextExpectedTransition: "2027-01-15" },
  { assetId: 40, assetName: "ADA Lift AL-301", categoryName: "Structural", currentStage: "UnderMaintenance", daysInStage: 132, expectedMaxDays: 90, isOverdue: true, lastTransitionDate: "2025-11-01", nextExpectedTransition: null },
  { assetId: 26, assetName: "Security Camera SC-04", categoryName: "Security", currentStage: "UnderMaintenance", daysInStage: 162, expectedMaxDays: 30, isOverdue: true, lastTransitionDate: "2025-10-01", nextExpectedTransition: null },
  { assetId: 14, assetName: "Elevator ELV-01", categoryName: "Structural", currentStage: "Active", daysInStage: 282, expectedMaxDays: 3650, isOverdue: false, lastTransitionDate: "2024-06-05", nextExpectedTransition: "2025-06-05" },
  { assetId: 1, assetName: "RTU-01 Rooftop AC Unit", categoryName: "HVAC", currentStage: "Active", daysInStage: 1571, expectedMaxDays: 3285, isOverdue: false, lastTransitionDate: "2021-08-25", nextExpectedTransition: "2027-07-15" },
  { assetId: 4, assetName: "Chiller CH-01", categoryName: "HVAC", currentStage: "Active", daysInStage: 2498, expectedMaxDays: 5475, isOverdue: false, lastTransitionDate: "2019-05-10", nextExpectedTransition: "2034-05-10" },
  { assetId: 13, assetName: "Gym HVAC Unit GYM-01", categoryName: "HVAC", currentStage: "Active", daysInStage: 2041, expectedMaxDays: 5475, isOverdue: false, lastTransitionDate: "2020-08-10", nextExpectedTransition: "2035-08-10" },
  { assetId: 6, assetName: "Emergency Generator EG-01", categoryName: "Electrical", currentStage: "Active", daysInStage: 3650, expectedMaxDays: 4380, isOverdue: false, lastTransitionDate: "2016-03-15", nextExpectedTransition: "2028-03-15" },
  { assetId: 8, assetName: "Fire Alarm Panel FA-01", categoryName: "Fire Safety", currentStage: "Active", daysInStage: 3328, expectedMaxDays: 4380, isOverdue: false, lastTransitionDate: "2017-02-01", nextExpectedTransition: "2029-02-01" },
  { assetId: 2, assetName: "AHU-01 Air Handler", categoryName: "HVAC", currentStage: "Active", daysInStage: 1122, expectedMaxDays: 3650, isOverdue: false, lastTransitionDate: "2023-02-14", nextExpectedTransition: "2028-04-15" },
  { assetId: 11, assetName: "Hot Water Heater HWH-01", categoryName: "Plumbing", currentStage: "Active", daysInStage: 548, expectedMaxDays: 3650, isOverdue: false, lastTransitionDate: "2025-09-12", nextExpectedTransition: "2027-09-01" },
  { assetId: 15, assetName: "UPS System UPS-01", categoryName: "Electrical", currentStage: "Active", daysInStage: 1499, expectedMaxDays: 2555, isOverdue: false, lastTransitionDate: "2022-02-01", nextExpectedTransition: "2029-02-01" },
];
