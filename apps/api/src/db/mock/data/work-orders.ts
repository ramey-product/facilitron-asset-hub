import type { WorkOrderRecord } from "../../../types/providers.js";

/**
 * 35 mock work orders linked to assets, with cost breakdowns.
 * Spread across 12 months of the current year (2025-03 through 2026-02).
 */
export const mockWorkOrders: WorkOrderRecord[] = [
  // Asset 1 — Gym RTU #1
  { workOrderId: 4401, customerID: 1, equipmentRecordID: 1, workOrderNumber: "WO-4401", description: "Quarterly filter replacement", laborCost: 150, partsCost: 280, vendorCost: 0, completedDate: "2025-04-15T00:00:00.000Z", status: "Completed" },
  { workOrderId: 4445, customerID: 1, equipmentRecordID: 1, workOrderNumber: "WO-4445", description: "Quarterly filter replacement", laborCost: 150, partsCost: 280, vendorCost: 0, completedDate: "2025-07-12T00:00:00.000Z", status: "Completed" },
  { workOrderId: 4490, customerID: 1, equipmentRecordID: 1, workOrderNumber: "WO-4490", description: "Quarterly filter replacement + belt tension", laborCost: 200, partsCost: 320, vendorCost: 0, completedDate: "2025-10-18T00:00:00.000Z", status: "Completed" },

  // Asset 2 — Gym RTU #2
  { workOrderId: 4402, customerID: 1, equipmentRecordID: 2, workOrderNumber: "WO-4402", description: "Quarterly filter replacement", laborCost: 150, partsCost: 280, vendorCost: 0, completedDate: "2025-04-15T00:00:00.000Z", status: "Completed" },
  { workOrderId: 4480, customerID: 1, equipmentRecordID: 2, workOrderNumber: "WO-4480", description: "Compressor diagnostic and refrigerant top-off", laborCost: 350, partsCost: 180, vendorCost: 850, completedDate: "2025-09-22T00:00:00.000Z", status: "Completed" },

  // Asset 5 — Admin Boiler
  { workOrderId: 4410, customerID: 1, equipmentRecordID: 5, workOrderNumber: "WO-4410", description: "Annual boiler inspection", laborCost: 400, partsCost: 0, vendorCost: 1200, completedDate: "2025-05-10T00:00:00.000Z", status: "Completed" },
  { workOrderId: 4512, customerID: 1, equipmentRecordID: 5, workOrderNumber: "WO-4512", description: "Burner assembly replacement", laborCost: 1200, partsCost: 4500, vendorCost: 3050, completedDate: "2026-02-01T00:00:00.000Z", status: "InProgress" },

  // Asset 7 — Portable P-3 Mini-Split
  { workOrderId: 4420, customerID: 1, equipmentRecordID: 7, workOrderNumber: "WO-4420", description: "Refrigerant leak investigation", laborCost: 300, partsCost: 0, vendorCost: 450, completedDate: "2025-06-05T00:00:00.000Z", status: "Completed" },
  { workOrderId: 4510, customerID: 1, equipmentRecordID: 7, workOrderNumber: "WO-4510", description: "Evaporator coil replacement", laborCost: 500, partsCost: 1800, vendorCost: 0, completedDate: "2026-02-15T00:00:00.000Z", status: "InProgress" },

  // Asset 8 — Multipurpose Room HVAC
  { workOrderId: 4430, customerID: 1, equipmentRecordID: 8, workOrderNumber: "WO-4430", description: "Economizer damper inspection", laborCost: 250, partsCost: 0, vendorCost: 0, completedDate: "2025-06-20T00:00:00.000Z", status: "Completed" },
  { workOrderId: 4502, customerID: 1, equipmentRecordID: 8, workOrderNumber: "WO-4502", description: "Economizer damper motor replacement", laborCost: 450, partsCost: 1200, vendorCost: 800, completedDate: "2025-11-20T00:00:00.000Z", status: "Completed" },
  { workOrderId: 4403, customerID: 1, equipmentRecordID: 8, workOrderNumber: "WO-4403", description: "Pre-season startup and inspection", laborCost: 300, partsCost: 150, vendorCost: 0, completedDate: "2025-04-01T00:00:00.000Z", status: "Completed" },

  // Asset 9 — Emergency Generator
  { workOrderId: 4435, customerID: 1, equipmentRecordID: 9, workOrderNumber: "WO-4435", description: "Monthly load test — June", laborCost: 200, partsCost: 0, vendorCost: 0, completedDate: "2025-06-15T00:00:00.000Z", status: "Completed" },
  { workOrderId: 4470, customerID: 1, equipmentRecordID: 9, workOrderNumber: "WO-4470", description: "Monthly load test — September", laborCost: 200, partsCost: 0, vendorCost: 0, completedDate: "2025-09-15T00:00:00.000Z", status: "Completed" },
  { workOrderId: 4500, customerID: 1, equipmentRecordID: 9, workOrderNumber: "WO-4500", description: "Oil change and load test — December", laborCost: 300, partsCost: 180, vendorCost: 0, completedDate: "2025-12-15T00:00:00.000Z", status: "Completed" },

  // Asset 10 — Main Distribution Panel A
  { workOrderId: 4440, customerID: 1, equipmentRecordID: 10, workOrderNumber: "WO-4440", description: "Annual thermal scan", laborCost: 200, partsCost: 0, vendorCost: 600, completedDate: "2025-07-01T00:00:00.000Z", status: "Completed" },

  // Asset 12 — Parking Garage UPS
  { workOrderId: 4495, customerID: 1, equipmentRecordID: 12, workOrderNumber: "WO-4495", description: "Annual battery replacement cycle 1", laborCost: 400, partsCost: 8500, vendorCost: 0, completedDate: "2025-11-01T00:00:00.000Z", status: "Completed" },

  // Asset 15 — Admin Water Heater
  { workOrderId: 4415, customerID: 1, equipmentRecordID: 15, workOrderNumber: "WO-4415", description: "Anode rod inspection", laborCost: 150, partsCost: 0, vendorCost: 0, completedDate: "2025-05-20T00:00:00.000Z", status: "Completed" },
  { workOrderId: 4505, customerID: 1, equipmentRecordID: 15, workOrderNumber: "WO-4505", description: "Thermocouple replacement", laborCost: 200, partsCost: 85, vendorCost: 0, completedDate: "2026-01-05T00:00:00.000Z", status: "Completed" },

  // Asset 19 — Main Fire Alarm Panel
  { workOrderId: 4425, customerID: 1, equipmentRecordID: 19, workOrderNumber: "WO-4425", description: "Annual fire alarm inspection", laborCost: 0, partsCost: 0, vendorCost: 2800, completedDate: "2025-06-15T00:00:00.000Z", status: "Completed" },

  // Asset 20 — Roosevelt Fire Panel
  { workOrderId: 4485, customerID: 1, equipmentRecordID: 20, workOrderNumber: "WO-4485", description: "Annual fire alarm inspection", laborCost: 0, partsCost: 0, vendorCost: 3200, completedDate: "2025-11-01T00:00:00.000Z", status: "Completed" },

  // Asset 23 — Elevator #1
  { workOrderId: 4450, customerID: 1, equipmentRecordID: 23, workOrderNumber: "WO-4450", description: "Quarterly elevator inspection", laborCost: 0, partsCost: 0, vendorCost: 1800, completedDate: "2025-07-15T00:00:00.000Z", status: "Completed" },
  { workOrderId: 4497, customerID: 1, equipmentRecordID: 23, workOrderNumber: "WO-4497", description: "Door operator adjustment", laborCost: 0, partsCost: 450, vendorCost: 1200, completedDate: "2025-12-01T00:00:00.000Z", status: "Completed" },

  // Asset 24 — Elevator #2
  { workOrderId: 4451, customerID: 1, equipmentRecordID: 24, workOrderNumber: "WO-4451", description: "Quarterly elevator inspection", laborCost: 0, partsCost: 0, vendorCost: 1800, completedDate: "2025-07-15T00:00:00.000Z", status: "Completed" },
  { workOrderId: 4601, customerID: 1, equipmentRecordID: 24, workOrderNumber: "WO-4601", description: "Drive unit replacement", laborCost: 2500, partsCost: 18000, vendorCost: 5500, completedDate: "2026-03-01T00:00:00.000Z", status: "InProgress" },

  // Asset 26 — Athletic Field Irrigation
  { workOrderId: 4460, customerID: 1, equipmentRecordID: 26, workOrderNumber: "WO-4460", description: "Spring startup and testing", laborCost: 300, partsCost: 0, vendorCost: 0, completedDate: "2025-04-01T00:00:00.000Z", status: "Completed" },
  { workOrderId: 4489, customerID: 1, equipmentRecordID: 26, workOrderNumber: "WO-4489", description: "Zone 7 valve replacement", laborCost: 250, partsCost: 320, vendorCost: 0, completedDate: "2025-10-15T00:00:00.000Z", status: "Completed" },

  // Asset 3 — Building B RTU
  { workOrderId: 4455, customerID: 1, equipmentRecordID: 3, workOrderNumber: "WO-4455", description: "Annual PM inspection", laborCost: 350, partsCost: 200, vendorCost: 0, completedDate: "2025-08-10T00:00:00.000Z", status: "Completed" },

  // Asset 6 — Executive Floor HVAC
  { workOrderId: 4465, customerID: 1, equipmentRecordID: 6, workOrderNumber: "WO-4465", description: "Quarterly PM", laborCost: 200, partsCost: 150, vendorCost: 0, completedDate: "2025-08-20T00:00:00.000Z", status: "Completed" },

  // Asset 17 — Lab Emergency Eyewash
  { workOrderId: 4478, customerID: 1, equipmentRecordID: 17, workOrderNumber: "WO-4478", description: "Weekly flush test — Q3 summary", laborCost: 100, partsCost: 0, vendorCost: 0, completedDate: "2025-10-01T00:00:00.000Z", status: "Completed" },

  // Asset 21 — Kitchen Fire Suppression
  { workOrderId: 4475, customerID: 1, equipmentRecordID: 21, workOrderNumber: "WO-4475", description: "Semi-annual Ansul inspection", laborCost: 0, partsCost: 0, vendorCost: 1500, completedDate: "2025-08-01T00:00:00.000Z", status: "Completed" },

  // Asset 14 — Building Automation Controller
  { workOrderId: 4492, customerID: 1, equipmentRecordID: 14, workOrderNumber: "WO-4492", description: "Software update and calibration", laborCost: 300, partsCost: 0, vendorCost: 800, completedDate: "2025-10-20T00:00:00.000Z", status: "Completed" },

  // Asset 16 — Main Building Water Heater
  { workOrderId: 4468, customerID: 1, equipmentRecordID: 16, workOrderNumber: "WO-4468", description: "Annual flush and anode check", laborCost: 200, partsCost: 0, vendorCost: 0, completedDate: "2025-09-01T00:00:00.000Z", status: "Completed" },

  // Asset 13 — Server Room Generator
  { workOrderId: 4498, customerID: 1, equipmentRecordID: 13, workOrderNumber: "WO-4498", description: "Annual PM and load test", laborCost: 250, partsCost: 120, vendorCost: 0, completedDate: "2025-12-01T00:00:00.000Z", status: "Completed" },
];
