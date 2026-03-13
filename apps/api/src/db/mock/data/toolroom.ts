/**
 * Mock seed data for P1-30 Tool Room Management.
 * 12 tools and 18 checkout records with realistic usage patterns.
 */

import type { ToolCheckout } from "@asset-hub/shared";

// Helper to get ISO date string N days ago at a specific hour
function daysAgo(n: number, hour = 8): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
}

// Helper: date N days in the future
function daysFromNow(n: number, hour = 17): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

/**
 * Tools are a subset of assets that live in the tool room.
 * These reference asset-like records but are focused on checkout/return tracking.
 */
export const mockTools = [
  { toolId: 101, customerID: 1, toolName: "Fluke 87V Multimeter", assetTag: "TOOL-001", category: "Electrical", lastReturnCondition: "good" as const },
  { toolId: 102, customerID: 1, toolName: "Tektronix TBS1052C Oscilloscope", assetTag: "TOOL-002", category: "Electrical", lastReturnCondition: "good" as const },
  { toolId: 103, customerID: 1, toolName: "CDI 2503MFRMH Torque Wrench", assetTag: "TOOL-003", category: "Mechanical", lastReturnCondition: "fair" as const },
  { toolId: 104, customerID: 1, toolName: "RIDGID 300 Pipe Threader", assetTag: "TOOL-004", category: "Plumbing", lastReturnCondition: "good" as const },
  { toolId: 105, customerID: 1, toolName: "Greenlee 555 Conduit Bender", assetTag: "TOOL-005", category: "Electrical", lastReturnCondition: "good" as const },
  { toolId: 106, customerID: 1, toolName: "Bosch GLL3-330CG Laser Level", assetTag: "TOOL-006", category: "General", lastReturnCondition: "good" as const },
  { toolId: 107, customerID: 1, toolName: "FLIR C5 Thermal Camera", assetTag: "TOOL-007", category: "HVAC", lastReturnCondition: null },
  { toolId: 108, customerID: 1, toolName: "Enerpac RC-256 Hydraulic Press", assetTag: "TOOL-008", category: "Mechanical", lastReturnCondition: "good" as const },
  { toolId: 109, customerID: 1, toolName: "Greenlee 6001 Cable Puller", assetTag: "TOOL-009", category: "Electrical", lastReturnCondition: "fair" as const },
  { toolId: 110, customerID: 1, toolName: "DeWalt DCD771 Drill Press", assetTag: "TOOL-010", category: "General", lastReturnCondition: "good" as const },
  { toolId: 111, customerID: 1, toolName: "Milwaukee 6232-21 Band Saw", assetTag: "TOOL-011", category: "General", lastReturnCondition: "poor" as const },
  { toolId: 112, customerID: 1, toolName: "Yellow Jacket 49987 Pressure Gauge Set", assetTag: "TOOL-012", category: "HVAC", lastReturnCondition: "good" as const },
];

export const mockToolCheckouts: ToolCheckout[] = [
  // --- Currently checked out: 4 total (2 overdue) ---
  {
    id: 1, customerID: 1,
    toolId: 107, toolName: "FLIR C5 Thermal Camera", toolAssetTag: "TOOL-007",
    checkedOutBy: 2, checkedOutByName: "Mike Johnson",
    checkedOutAt: daysAgo(5, 7),
    expectedReturnDate: daysAgo(2, 17), // overdue by 2 days
    returnedAt: null, returnedCondition: null, returnedBy: null, returnedByName: null,
    status: "overdue",
    notes: "Thermal survey of Building A roof units",
  },
  {
    id: 2, customerID: 1,
    toolId: 103, toolName: "CDI 2503MFRMH Torque Wrench", toolAssetTag: "TOOL-003",
    checkedOutBy: 3, checkedOutByName: "Tom Wilson",
    checkedOutAt: daysAgo(4, 8),
    expectedReturnDate: daysAgo(1, 17), // overdue by 1 day
    returnedAt: null, returnedCondition: null, returnedBy: null, returnedByName: null,
    status: "overdue",
    notes: "Bolt torque verification on rooftop supports",
  },
  {
    id: 3, customerID: 1,
    toolId: 105, toolName: "Greenlee 555 Conduit Bender", toolAssetTag: "TOOL-005",
    checkedOutBy: 2, checkedOutByName: "Mike Johnson",
    checkedOutAt: daysAgo(1, 7),
    expectedReturnDate: daysFromNow(2),
    returnedAt: null, returnedCondition: null, returnedBy: null, returnedByName: null,
    status: "checked-out",
    notes: "New conduit run in server room",
  },
  {
    id: 4, customerID: 1,
    toolId: 112, toolName: "Yellow Jacket 49987 Pressure Gauge Set", toolAssetTag: "TOOL-012",
    checkedOutBy: 4, checkedOutByName: "Sarah Chen",
    checkedOutAt: daysAgo(0, 7),
    expectedReturnDate: daysFromNow(1),
    returnedAt: null, returnedCondition: null, returnedBy: null, returnedByName: null,
    status: "checked-out",
    notes: "HVAC commissioning, Building C",
  },

  // --- Returned: 14 historical records ---
  {
    id: 5, customerID: 1,
    toolId: 101, toolName: "Fluke 87V Multimeter", toolAssetTag: "TOOL-001",
    checkedOutBy: 2, checkedOutByName: "Mike Johnson",
    checkedOutAt: daysAgo(3, 7), expectedReturnDate: daysAgo(2, 17),
    returnedAt: daysAgo(2, 16), returnedCondition: "good", returnedBy: 2, returnedByName: "Mike Johnson",
    status: "returned", notes: "Panel troubleshooting complete",
  },
  {
    id: 6, customerID: 1,
    toolId: 106, toolName: "Bosch GLL3-330CG Laser Level", toolAssetTag: "TOOL-006",
    checkedOutBy: 3, checkedOutByName: "Tom Wilson",
    checkedOutAt: daysAgo(7, 8), expectedReturnDate: daysAgo(5, 17),
    returnedAt: daysAgo(5, 15), returnedCondition: "good", returnedBy: 3, returnedByName: "Tom Wilson",
    status: "returned", notes: "Drop ceiling grid alignment",
  },
  {
    id: 7, customerID: 1,
    toolId: 104, toolName: "RIDGID 300 Pipe Threader", toolAssetTag: "TOOL-004",
    checkedOutBy: 3, checkedOutByName: "Tom Wilson",
    checkedOutAt: daysAgo(10, 7), expectedReturnDate: daysAgo(8, 17),
    returnedAt: daysAgo(8, 14), returnedCondition: "good", returnedBy: 3, returnedByName: "Tom Wilson",
    status: "returned", notes: null,
  },
  {
    id: 8, customerID: 1,
    toolId: 110, toolName: "DeWalt DCD771 Drill Press", toolAssetTag: "TOOL-010",
    checkedOutBy: 4, checkedOutByName: "Sarah Chen",
    checkedOutAt: daysAgo(12, 9), expectedReturnDate: daysAgo(10, 17),
    returnedAt: daysAgo(10, 16), returnedCondition: "good", returnedBy: 4, returnedByName: "Sarah Chen",
    status: "returned", notes: "Mounting bracket installation",
  },
  {
    id: 9, customerID: 1,
    toolId: 101, toolName: "Fluke 87V Multimeter", toolAssetTag: "TOOL-001",
    checkedOutBy: 4, checkedOutByName: "Sarah Chen",
    checkedOutAt: daysAgo(15, 7), expectedReturnDate: daysAgo(14, 17),
    returnedAt: daysAgo(14, 11), returnedCondition: "good", returnedBy: 4, returnedByName: "Sarah Chen",
    status: "returned", notes: "Voltage checks on new circuits",
  },
  {
    id: 10, customerID: 1,
    toolId: 109, toolName: "Greenlee 6001 Cable Puller", toolAssetTag: "TOOL-009",
    checkedOutBy: 2, checkedOutByName: "Mike Johnson",
    checkedOutAt: daysAgo(18, 7), expectedReturnDate: daysAgo(15, 17),
    returnedAt: daysAgo(16, 15), returnedCondition: "fair", returnedBy: 2, returnedByName: "Mike Johnson",
    status: "returned", notes: "Long pull through ceiling, some cable fray on guide",
  },
  {
    id: 11, customerID: 1,
    toolId: 108, toolName: "Enerpac RC-256 Hydraulic Press", toolAssetTag: "TOOL-008",
    checkedOutBy: 3, checkedOutByName: "Tom Wilson",
    checkedOutAt: daysAgo(20, 8), expectedReturnDate: daysAgo(18, 17),
    returnedAt: daysAgo(18, 12), returnedCondition: "good", returnedBy: 3, returnedByName: "Tom Wilson",
    status: "returned", notes: "Bearing press-fit job",
  },
  {
    id: 12, customerID: 1,
    toolId: 111, toolName: "Milwaukee 6232-21 Band Saw", toolAssetTag: "TOOL-011",
    checkedOutBy: 2, checkedOutByName: "Mike Johnson",
    checkedOutAt: daysAgo(22, 7), expectedReturnDate: daysAgo(20, 17),
    returnedAt: daysAgo(20, 16), returnedCondition: "poor", returnedBy: 2, returnedByName: "Mike Johnson",
    status: "returned", notes: "Blade needs replacement, tracking is off",
  },
  {
    id: 13, customerID: 1,
    toolId: 102, toolName: "Tektronix TBS1052C Oscilloscope", toolAssetTag: "TOOL-002",
    checkedOutBy: 4, checkedOutByName: "Sarah Chen",
    checkedOutAt: daysAgo(25, 9), expectedReturnDate: daysAgo(23, 17),
    returnedAt: daysAgo(23, 14), returnedCondition: "good", returnedBy: 4, returnedByName: "Sarah Chen",
    status: "returned", notes: "VFD troubleshooting on AHU-2",
  },
  {
    id: 14, customerID: 1,
    toolId: 106, toolName: "Bosch GLL3-330CG Laser Level", toolAssetTag: "TOOL-006",
    checkedOutBy: 2, checkedOutByName: "Mike Johnson",
    checkedOutAt: daysAgo(28, 8), expectedReturnDate: daysAgo(26, 17),
    returnedAt: daysAgo(27, 10), returnedCondition: "good", returnedBy: 2, returnedByName: "Mike Johnson",
    status: "returned", notes: null,
  },
  {
    id: 15, customerID: 1,
    toolId: 112, toolName: "Yellow Jacket 49987 Pressure Gauge Set", toolAssetTag: "TOOL-012",
    checkedOutBy: 4, checkedOutByName: "Sarah Chen",
    checkedOutAt: daysAgo(30, 7), expectedReturnDate: daysAgo(28, 17),
    returnedAt: daysAgo(28, 15), returnedCondition: "good", returnedBy: 4, returnedByName: "Sarah Chen",
    status: "returned", notes: "Refrigerant charge check on 3 RTUs",
  },
  {
    id: 16, customerID: 1,
    toolId: 101, toolName: "Fluke 87V Multimeter", toolAssetTag: "TOOL-001",
    checkedOutBy: 3, checkedOutByName: "Tom Wilson",
    checkedOutAt: daysAgo(35, 7), expectedReturnDate: daysAgo(34, 17),
    returnedAt: daysAgo(34, 13), returnedCondition: "good", returnedBy: 3, returnedByName: "Tom Wilson",
    status: "returned", notes: "Ground fault investigation",
  },
  {
    id: 17, customerID: 1,
    toolId: 104, toolName: "RIDGID 300 Pipe Threader", toolAssetTag: "TOOL-004",
    checkedOutBy: 2, checkedOutByName: "Mike Johnson",
    checkedOutAt: daysAgo(40, 8), expectedReturnDate: daysAgo(38, 17),
    returnedAt: daysAgo(38, 16), returnedCondition: "good", returnedBy: 2, returnedByName: "Mike Johnson",
    status: "returned", notes: "Gas line extension project",
  },
  {
    id: 18, customerID: 1,
    toolId: 110, toolName: "DeWalt DCD771 Drill Press", toolAssetTag: "TOOL-010",
    checkedOutBy: 3, checkedOutByName: "Tom Wilson",
    checkedOutAt: daysAgo(45, 7), expectedReturnDate: daysAgo(43, 17),
    returnedAt: daysAgo(43, 11), returnedCondition: "good", returnedBy: 3, returnedByName: "Tom Wilson",
    status: "returned", notes: null,
  },
];
