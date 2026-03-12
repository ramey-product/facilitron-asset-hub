import type { StatusReason } from "@asset-hub/shared";

/**
 * Standard reason codes for taking an asset offline.
 */
export const mockStatusReasons: StatusReason[] = [
  {
    code: "SCH_MAINT",
    label: "Scheduled Maintenance",
    description: "Planned maintenance window — asset will return to service after completion",
    requiresNotes: false,
  },
  {
    code: "EMRG_REPAIR",
    label: "Emergency Repair",
    description: "Unplanned breakdown requiring immediate repair",
    requiresNotes: true,
  },
  {
    code: "PARTS_ORDER",
    label: "Awaiting Parts",
    description: "Repair paused — waiting on parts delivery",
    requiresNotes: false,
  },
  {
    code: "SEASONAL",
    label: "Seasonal Shutdown",
    description: "Asset taken offline for seasonal reasons (e.g., winterization)",
    requiresNotes: false,
  },
  {
    code: "DECOMM",
    label: "Decommissioned",
    description: "Asset permanently removed from service",
    requiresNotes: true,
  },
  {
    code: "INVSTG",
    label: "Under Investigation",
    description: "Asset offline pending safety or performance investigation",
    requiresNotes: true,
  },
  {
    code: "OTHER",
    label: "Other",
    description: "Other reason — please provide notes",
    requiresNotes: true,
  },
];
