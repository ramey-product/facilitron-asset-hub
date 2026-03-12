import type { ConditionLogRecord } from "../../../types/providers.js";

/**
 * 74 mock condition log entries across multiple assets.
 * Covers manual, inspection, and work_order sources with realistic score progressions.
 */
export const mockConditionLogs: ConditionLogRecord[] = [
  // Asset 1 — Fuel Dispensing System (trend: stable at 4)
  { id: 1, equipmentRecordId: 1, customerId: 1, conditionScore: 5, previousScore: null, source: "inspection", notes: "Initial commissioning inspection — all systems nominal.", loggedBy: 1, loggedAt: "2024-04-15T09:00:00Z" },
  { id: 2, equipmentRecordId: 1, customerId: 1, conditionScore: 5, previousScore: 5, source: "inspection", notes: "Annual inspection passed.", loggedBy: 1, loggedAt: "2024-10-20T10:30:00Z" },
  { id: 3, equipmentRecordId: 1, customerId: 1, conditionScore: 4, previousScore: 5, source: "work_order", notes: "Minor nozzle wear noted during WO repair.", loggedBy: 2, loggedAt: "2025-03-10T14:15:00Z" },
  { id: 4, equipmentRecordId: 1, customerId: 1, conditionScore: 4, previousScore: 4, source: "inspection", notes: "Semi-annual inspection — good overall condition.", loggedBy: 1, loggedAt: "2025-09-05T08:45:00Z" },
  { id: 5, equipmentRecordId: 1, customerId: 1, conditionScore: 4, previousScore: 4, source: "manual", notes: "Routine check, no changes.", loggedBy: 1, loggedAt: "2026-01-28T11:00:00Z" },

  // Asset 2 — Fuel Pump #1 Island A (trend: stable at 4)
  { id: 6, equipmentRecordId: 2, customerId: 1, conditionScore: 5, previousScore: null, source: "inspection", notes: "Install inspection.", loggedBy: 1, loggedAt: "2024-04-15T09:30:00Z" },
  { id: 7, equipmentRecordId: 2, customerId: 1, conditionScore: 4, previousScore: 5, source: "manual", notes: "Normal wear and tear.", loggedBy: 2, loggedAt: "2025-01-10T10:00:00Z" },
  { id: 8, equipmentRecordId: 2, customerId: 1, conditionScore: 4, previousScore: 4, source: "inspection", notes: "Annual inspection passed.", loggedBy: 1, loggedAt: "2025-10-20T09:00:00Z" },

  // Asset 3 — Fuel Pump #2 Island A (trend: declining)
  { id: 9, equipmentRecordId: 3, customerId: 1, conditionScore: 5, previousScore: null, source: "inspection", notes: "Brand new installation.", loggedBy: 1, loggedAt: "2024-04-15T09:45:00Z" },
  { id: 10, equipmentRecordId: 3, customerId: 1, conditionScore: 4, previousScore: 5, source: "manual", notes: "Minor wear on hose assembly.", loggedBy: 2, loggedAt: "2024-11-15T14:00:00Z" },
  { id: 11, equipmentRecordId: 3, customerId: 1, conditionScore: 3, previousScore: 4, source: "work_order", notes: "Replaced leaking seal — downgraded condition.", loggedBy: 2, loggedAt: "2025-06-22T16:30:00Z" },
  { id: 12, equipmentRecordId: 3, customerId: 1, conditionScore: 3, previousScore: 3, source: "inspection", notes: "Fair condition, monitor closely.", loggedBy: 1, loggedAt: "2026-02-05T10:00:00Z" },

  // Asset 5 — UST (trend: stable excellent)
  { id: 13, equipmentRecordId: 5, customerId: 1, conditionScore: 5, previousScore: null, source: "inspection", notes: "Post-install tank integrity test passed.", loggedBy: 1, loggedAt: "2024-01-10T08:00:00Z" },
  { id: 14, equipmentRecordId: 5, customerId: 1, conditionScore: 5, previousScore: 5, source: "inspection", notes: "Annual leak detection — all clear.", loggedBy: 1, loggedAt: "2024-11-15T09:00:00Z" },
  { id: 15, equipmentRecordId: 5, customerId: 1, conditionScore: 5, previousScore: 5, source: "inspection", notes: "Cathodic protection check passed.", loggedBy: 1, loggedAt: "2025-11-15T09:30:00Z" },

  // Asset 6 — HVAC System Store 101 (trend: stable at 4)
  { id: 16, equipmentRecordId: 6, customerId: 1, conditionScore: 5, previousScore: null, source: "inspection", notes: "Commissioning complete.", loggedBy: 1, loggedAt: "2024-02-10T10:00:00Z" },
  { id: 17, equipmentRecordId: 6, customerId: 1, conditionScore: 4, previousScore: 5, source: "manual", notes: "Normal seasonal wear.", loggedBy: 2, loggedAt: "2024-08-15T14:00:00Z" },
  { id: 18, equipmentRecordId: 6, customerId: 1, conditionScore: 4, previousScore: 4, source: "inspection", notes: "Annual HVAC inspection passed.", loggedBy: 1, loggedAt: "2025-02-10T09:00:00Z" },
  { id: 19, equipmentRecordId: 6, customerId: 1, conditionScore: 4, previousScore: 4, source: "work_order", notes: "Filter replaced, system running well.", loggedBy: 2, loggedAt: "2025-08-15T11:00:00Z" },
  { id: 20, equipmentRecordId: 6, customerId: 1, conditionScore: 4, previousScore: 4, source: "inspection", notes: "Bi-annual inspection — good.", loggedBy: 1, loggedAt: "2026-01-15T09:00:00Z" },

  // Asset 7 — Compressor Unit (trend: declining to 3)
  { id: 21, equipmentRecordId: 7, customerId: 1, conditionScore: 5, previousScore: null, source: "inspection", notes: "New compressor install.", loggedBy: 1, loggedAt: "2024-02-10T10:30:00Z" },
  { id: 22, equipmentRecordId: 7, customerId: 1, conditionScore: 4, previousScore: 5, source: "manual", notes: "Slightly elevated vibration noted.", loggedBy: 2, loggedAt: "2024-09-20T15:00:00Z" },
  { id: 23, equipmentRecordId: 7, customerId: 1, conditionScore: 3, previousScore: 4, source: "work_order", notes: "Bearing replacement needed, condition downgraded.", loggedBy: 2, loggedAt: "2025-05-10T14:00:00Z" },
  { id: 24, equipmentRecordId: 7, customerId: 1, conditionScore: 3, previousScore: 3, source: "inspection", notes: "Fair — warranty expired, monitor closely.", loggedBy: 1, loggedAt: "2026-01-15T10:00:00Z" },

  // Asset 10 — Refrigeration System (trend: declining to 3)
  { id: 25, equipmentRecordId: 10, customerId: 1, conditionScore: 4, previousScore: null, source: "inspection", notes: "Initial assessment.", loggedBy: 1, loggedAt: "2024-03-01T09:00:00Z" },
  { id: 26, equipmentRecordId: 10, customerId: 1, conditionScore: 4, previousScore: 4, source: "inspection", notes: "Semi-annual check — performing well.", loggedBy: 1, loggedAt: "2024-09-01T09:30:00Z" },
  { id: 27, equipmentRecordId: 10, customerId: 1, conditionScore: 3, previousScore: 4, source: "work_order", notes: "Compressor running hot, needs monitoring.", loggedBy: 2, loggedAt: "2025-04-15T16:00:00Z" },
  { id: 28, equipmentRecordId: 10, customerId: 1, conditionScore: 3, previousScore: 3, source: "inspection", notes: "Fair condition, temperature fluctuations noted.", loggedBy: 1, loggedAt: "2025-10-01T09:00:00Z" },
  { id: 29, equipmentRecordId: 10, customerId: 1, conditionScore: 3, previousScore: 3, source: "manual", notes: "Unchanged since last check.", loggedBy: 1, loggedAt: "2026-02-01T10:00:00Z" },

  // Asset 11 — Walk-In Cooler (trend: declining to 3, under maintenance)
  { id: 30, equipmentRecordId: 11, customerId: 1, conditionScore: 4, previousScore: null, source: "inspection", notes: "Installed and tested.", loggedBy: 1, loggedAt: "2024-03-01T10:00:00Z" },
  { id: 31, equipmentRecordId: 11, customerId: 1, conditionScore: 4, previousScore: 4, source: "manual", notes: "Door seal checked — good.", loggedBy: 2, loggedAt: "2024-10-15T11:00:00Z" },
  { id: 32, equipmentRecordId: 11, customerId: 1, conditionScore: 3, previousScore: 4, source: "work_order", notes: "Evaporator fan motor replaced.", loggedBy: 2, loggedAt: "2025-06-20T15:00:00Z" },
  { id: 33, equipmentRecordId: 11, customerId: 1, conditionScore: 3, previousScore: 3, source: "inspection", notes: "Temperature alarm triggered twice this quarter.", loggedBy: 1, loggedAt: "2026-02-10T09:30:00Z" },

  // Asset 13 — Frozen Display Case (trend: declining to 2, flagged)
  { id: 34, equipmentRecordId: 13, customerId: 1, conditionScore: 4, previousScore: null, source: "inspection", notes: "Install check passed.", loggedBy: 1, loggedAt: "2024-03-01T10:30:00Z" },
  { id: 35, equipmentRecordId: 13, customerId: 1, conditionScore: 3, previousScore: 4, source: "work_order", notes: "Defrost timer malfunction fixed.", loggedBy: 2, loggedAt: "2024-09-10T14:00:00Z" },
  { id: 36, equipmentRecordId: 13, customerId: 1, conditionScore: 2, previousScore: 3, source: "work_order", notes: "Compressor failing, gasket leaks. Flagged for replacement.", loggedBy: 2, loggedAt: "2025-07-15T16:00:00Z" },
  { id: 37, equipmentRecordId: 13, customerId: 1, conditionScore: 2, previousScore: 2, source: "inspection", notes: "Poor — replacement approved in next capital cycle.", loggedBy: 1, loggedAt: "2026-02-12T10:00:00Z" },

  // Asset 20 — Fuel System Sunnyvale (trend: stable at 3)
  { id: 38, equipmentRecordId: 20, customerId: 1, conditionScore: 4, previousScore: null, source: "inspection", notes: "Baseline assessment.", loggedBy: 1, loggedAt: "2024-01-20T09:00:00Z" },
  { id: 39, equipmentRecordId: 20, customerId: 1, conditionScore: 3, previousScore: 4, source: "work_order", notes: "Multiple pump repairs this year.", loggedBy: 2, loggedAt: "2024-08-10T15:00:00Z" },
  { id: 40, equipmentRecordId: 20, customerId: 1, conditionScore: 3, previousScore: 3, source: "inspection", notes: "Fair condition — aging equipment.", loggedBy: 1, loggedAt: "2025-02-08T09:00:00Z" },
  { id: 41, equipmentRecordId: 20, customerId: 1, conditionScore: 3, previousScore: 3, source: "manual", notes: "No change since last inspection.", loggedBy: 1, loggedAt: "2026-02-08T10:00:00Z" },

  // Asset 21 — Fuel Pump Sunnyvale (trend: declining to 2)
  { id: 42, equipmentRecordId: 21, customerId: 1, conditionScore: 4, previousScore: null, source: "inspection", notes: "Working normally.", loggedBy: 1, loggedAt: "2024-01-20T09:30:00Z" },
  { id: 43, equipmentRecordId: 21, customerId: 1, conditionScore: 3, previousScore: 4, source: "work_order", notes: "Nozzle replaced, hose cracking.", loggedBy: 2, loggedAt: "2024-07-15T14:00:00Z" },
  { id: 44, equipmentRecordId: 21, customerId: 1, conditionScore: 2, previousScore: 3, source: "work_order", notes: "Card reader malfunction, pump intermittent.", loggedBy: 2, loggedAt: "2025-04-20T16:00:00Z" },
  { id: 45, equipmentRecordId: 21, customerId: 1, conditionScore: 2, previousScore: 2, source: "manual", notes: "Under maintenance — awaiting parts.", loggedBy: 1, loggedAt: "2026-02-14T10:00:00Z" },

  // Asset 23 — HVAC Sunnyvale (trend: declining to 2, flagged)
  { id: 46, equipmentRecordId: 23, customerId: 1, conditionScore: 4, previousScore: null, source: "inspection", notes: "Post-install OK.", loggedBy: 1, loggedAt: "2024-01-05T10:00:00Z" },
  { id: 47, equipmentRecordId: 23, customerId: 1, conditionScore: 3, previousScore: 4, source: "work_order", notes: "Refrigerant leak repaired.", loggedBy: 2, loggedAt: "2024-06-15T15:00:00Z" },
  { id: 48, equipmentRecordId: 23, customerId: 1, conditionScore: 2, previousScore: 3, source: "work_order", notes: "Compressor failing, excessive noise.", loggedBy: 2, loggedAt: "2025-03-10T14:00:00Z" },
  { id: 49, equipmentRecordId: 23, customerId: 1, conditionScore: 2, previousScore: 2, source: "inspection", notes: "Poor — flagged for full replacement.", loggedBy: 1, loggedAt: "2026-02-10T09:00:00Z" },

  // Asset 24 — Compressor Sunnyvale (trend: declining to 1, critical)
  { id: 50, equipmentRecordId: 24, customerId: 1, conditionScore: 3, previousScore: null, source: "inspection", notes: "Already showing age at install.", loggedBy: 1, loggedAt: "2024-01-05T10:30:00Z" },
  { id: 51, equipmentRecordId: 24, customerId: 1, conditionScore: 2, previousScore: 3, source: "work_order", notes: "Bearing noise, overheating.", loggedBy: 2, loggedAt: "2024-09-20T16:00:00Z" },
  { id: 52, equipmentRecordId: 24, customerId: 1, conditionScore: 1, previousScore: 2, source: "work_order", notes: "Critical failure imminent. Emergency replacement recommended.", loggedBy: 2, loggedAt: "2025-08-15T17:00:00Z" },
  { id: 53, equipmentRecordId: 24, customerId: 1, conditionScore: 1, previousScore: 1, source: "inspection", notes: "Critical — replacement in progress.", loggedBy: 1, loggedAt: "2026-02-10T10:00:00Z" },

  // Asset 28 — HVAC Hayward (trend: stable excellent)
  { id: 54, equipmentRecordId: 28, customerId: 1, conditionScore: 5, previousScore: null, source: "inspection", notes: "Brand new install.", loggedBy: 1, loggedAt: "2024-05-15T09:00:00Z" },
  { id: 55, equipmentRecordId: 28, customerId: 1, conditionScore: 5, previousScore: 5, source: "inspection", notes: "Annual inspection — excellent.", loggedBy: 1, loggedAt: "2025-05-15T09:00:00Z" },
  { id: 56, equipmentRecordId: 28, customerId: 1, conditionScore: 5, previousScore: 5, source: "work_order", notes: "Filter change only, unit excellent.", loggedBy: 2, loggedAt: "2025-12-20T10:00:00Z" },

  // Asset 29 — Fuel System Mountain View (trend: stable at 4)
  { id: 57, equipmentRecordId: 29, customerId: 1, conditionScore: 5, previousScore: null, source: "inspection", notes: "Commissioning OK.", loggedBy: 1, loggedAt: "2024-02-20T09:00:00Z" },
  { id: 58, equipmentRecordId: 29, customerId: 1, conditionScore: 4, previousScore: 5, source: "manual", notes: "Minor wear, still good.", loggedBy: 2, loggedAt: "2024-12-01T10:00:00Z" },
  { id: 59, equipmentRecordId: 29, customerId: 1, conditionScore: 4, previousScore: 4, source: "inspection", notes: "Annual check — good.", loggedBy: 1, loggedAt: "2025-08-20T09:00:00Z" },
  { id: 60, equipmentRecordId: 29, customerId: 1, conditionScore: 4, previousScore: 4, source: "manual", notes: "Routine check.", loggedBy: 1, loggedAt: "2026-02-01T10:00:00Z" },

  // Asset 30 — Refrigeration MV (trend: declining to 2)
  { id: 61, equipmentRecordId: 30, customerId: 1, conditionScore: 4, previousScore: null, source: "inspection", notes: "System baseline.", loggedBy: 1, loggedAt: "2024-03-15T09:00:00Z" },
  { id: 62, equipmentRecordId: 30, customerId: 1, conditionScore: 3, previousScore: 4, source: "work_order", notes: "Multiple compressor trips.", loggedBy: 2, loggedAt: "2024-10-20T15:00:00Z" },
  { id: 63, equipmentRecordId: 30, customerId: 1, conditionScore: 2, previousScore: 3, source: "work_order", notes: "Condenser coil corroded, major leak repaired.", loggedBy: 2, loggedAt: "2025-06-10T16:00:00Z" },
  { id: 64, equipmentRecordId: 30, customerId: 1, conditionScore: 2, previousScore: 2, source: "inspection", notes: "Poor — under active maintenance.", loggedBy: 1, loggedAt: "2026-02-14T09:00:00Z" },

  // Asset 31 — EV Charging (trend: stable excellent)
  { id: 65, equipmentRecordId: 31, customerId: 1, conditionScore: 5, previousScore: null, source: "inspection", notes: "Brand new install.", loggedBy: 1, loggedAt: "2024-06-15T09:00:00Z" },
  { id: 66, equipmentRecordId: 31, customerId: 1, conditionScore: 5, previousScore: 5, source: "manual", notes: "6-month check — excellent.", loggedBy: 1, loggedAt: "2024-12-15T10:00:00Z" },
  { id: 67, equipmentRecordId: 31, customerId: 1, conditionScore: 5, previousScore: 5, source: "inspection", notes: "Annual check — excellent.", loggedBy: 1, loggedAt: "2025-12-01T09:00:00Z" },

  // Asset 32 — Car Wash (trend: stable at 4)
  { id: 68, equipmentRecordId: 32, customerId: 1, conditionScore: 5, previousScore: null, source: "inspection", notes: "Commissioning complete.", loggedBy: 1, loggedAt: "2024-05-01T09:00:00Z" },
  { id: 69, equipmentRecordId: 32, customerId: 1, conditionScore: 4, previousScore: 5, source: "work_order", notes: "Sensor recalibrated.", loggedBy: 2, loggedAt: "2025-01-25T14:00:00Z" },
  { id: 70, equipmentRecordId: 32, customerId: 1, conditionScore: 4, previousScore: 4, source: "manual", notes: "Good overall.", loggedBy: 1, loggedAt: "2026-01-25T10:00:00Z" },

  // Asset 34 — Security Cameras (trend: stable excellent)
  { id: 71, equipmentRecordId: 34, customerId: 1, conditionScore: 5, previousScore: null, source: "inspection", notes: "Install verification.", loggedBy: 1, loggedAt: "2024-02-10T09:00:00Z" },
  { id: 72, equipmentRecordId: 34, customerId: 1, conditionScore: 5, previousScore: 5, source: "manual", notes: "All cameras operational.", loggedBy: 1, loggedAt: "2025-10-15T10:00:00Z" },

  // Asset 35 — Backup Generator (trend: stable at 4)
  { id: 73, equipmentRecordId: 35, customerId: 1, conditionScore: 4, previousScore: null, source: "inspection", notes: "Baseline load bank test.", loggedBy: 1, loggedAt: "2024-03-01T09:00:00Z" },
  { id: 74, equipmentRecordId: 35, customerId: 1, conditionScore: 4, previousScore: 4, source: "work_order", notes: "Annual load bank test passed.", loggedBy: 2, loggedAt: "2026-01-30T14:00:00Z" },
];
