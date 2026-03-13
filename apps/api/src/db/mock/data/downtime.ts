/**
 * Seed data for P1-30 Downtime Tracking.
 * 60+ events across 20+ assets, mix of completed and ongoing.
 */

import type { DowntimeEvent } from "@asset-hub/shared";

export const mockDowntimeEvents: DowntimeEvent[] = [
  // Asset 1 — RTU-01 (multiple events, some resolved, some recent)
  { id: 1, assetId: 1, assetName: "RTU-01 Rooftop Unit", startTime: "2025-06-10T08:00:00Z", endTime: "2025-06-10T14:30:00Z", durationMinutes: 390, reason: "mechanical_failure", reasonDescription: "Compressor seized, emergency repair", associatedWoId: 1001, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-06-10T08:00:00Z", updatedAt: "2025-06-10T14:30:00Z" },
  { id: 2, assetId: 1, assetName: "RTU-01 Rooftop Unit", startTime: "2025-09-22T10:15:00Z", endTime: "2025-09-22T12:45:00Z", durationMinutes: 150, reason: "electrical_failure", reasonDescription: "Contactor burned out", associatedWoId: 1042, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-09-22T10:15:00Z", updatedAt: "2025-09-22T12:45:00Z" },
  { id: 3, assetId: 1, assetName: "RTU-01 Rooftop Unit", startTime: "2026-01-15T06:00:00Z", endTime: "2026-01-15T08:30:00Z", durationMinutes: 150, reason: "planned_maintenance", reasonDescription: "Annual coil cleaning and belt replacement", associatedWoId: 1098, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2026-01-15T06:00:00Z", updatedAt: "2026-01-15T08:30:00Z" },

  // Asset 2 — AHU-02
  { id: 4, assetId: 2, assetName: "AHU-02 Air Handler", startTime: "2025-07-08T13:00:00Z", endTime: "2025-07-08T16:00:00Z", durationMinutes: 180, reason: "parts_unavailable", reasonDescription: "Belt failed, waited for delivery", associatedWoId: 1020, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-07-08T13:00:00Z", updatedAt: "2025-07-08T16:00:00Z" },
  { id: 5, assetId: 2, assetName: "AHU-02 Air Handler", startTime: "2025-11-30T09:00:00Z", endTime: "2025-11-30T10:30:00Z", durationMinutes: 90, reason: "inspection", reasonDescription: "Quarterly filter inspection and change", associatedWoId: 1076, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-11-30T09:00:00Z", updatedAt: "2025-11-30T10:30:00Z" },

  // Asset 3 — Chiller Unit A (high downtime asset)
  { id: 6, assetId: 3, assetName: "Chiller Unit A", startTime: "2025-05-20T00:00:00Z", endTime: "2025-05-21T16:00:00Z", durationMinutes: 2400, reason: "mechanical_failure", reasonDescription: "Refrigerant leak — major repair required", associatedWoId: 998, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-05-20T00:00:00Z", updatedAt: "2025-05-21T16:00:00Z" },
  { id: 7, assetId: 3, assetName: "Chiller Unit A", startTime: "2025-08-15T07:30:00Z", endTime: "2025-08-15T09:00:00Z", durationMinutes: 90, reason: "electrical_failure", reasonDescription: "Control board fault, reset required", associatedWoId: 1030, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-08-15T07:30:00Z", updatedAt: "2025-08-15T09:00:00Z" },
  { id: 8, assetId: 3, assetName: "Chiller Unit A", startTime: "2025-10-05T14:00:00Z", endTime: "2025-10-07T10:00:00Z", durationMinutes: 2880, reason: "waiting_for_parts", reasonDescription: "Compressor bearing failed — OEM parts on order", associatedWoId: 1055, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-10-05T14:00:00Z", updatedAt: "2025-10-07T10:00:00Z" },
  { id: 9, assetId: 3, assetName: "Chiller Unit A", startTime: "2026-02-10T08:00:00Z", endTime: "2026-02-10T12:00:00Z", durationMinutes: 240, reason: "planned_maintenance", reasonDescription: "Tube cleaning service", associatedWoId: 1112, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2026-02-10T08:00:00Z", updatedAt: "2026-02-10T12:00:00Z" },

  // Asset 4 — Boiler Unit B
  { id: 10, assetId: 4, assetName: "Boiler Unit B", startTime: "2025-06-01T05:00:00Z", endTime: "2025-06-01T09:30:00Z", durationMinutes: 270, reason: "mechanical_failure", reasonDescription: "Pressure relief valve triggered — inspection needed", associatedWoId: 1005, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-06-01T05:00:00Z", updatedAt: "2025-06-01T09:30:00Z" },
  { id: 11, assetId: 4, assetName: "Boiler Unit B", startTime: "2025-12-20T06:00:00Z", endTime: "2025-12-20T14:00:00Z", durationMinutes: 480, reason: "inspection", reasonDescription: "Annual boiler inspection and certification", associatedWoId: 1082, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-12-20T06:00:00Z", updatedAt: "2025-12-20T14:00:00Z" },

  // Asset 6 — Generator GEN-01
  { id: 12, assetId: 6, assetName: "Generator GEN-01", startTime: "2025-07-15T19:30:00Z", endTime: "2025-07-15T22:00:00Z", durationMinutes: 150, reason: "electrical_failure", reasonDescription: "AVR fault during load test", associatedWoId: 1024, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-07-15T19:30:00Z", updatedAt: "2025-07-15T22:00:00Z" },
  { id: 13, assetId: 6, assetName: "Generator GEN-01", startTime: "2025-09-01T06:00:00Z", endTime: "2025-09-01T07:00:00Z", durationMinutes: 60, reason: "planned_maintenance", reasonDescription: "Monthly load test and oil level check", associatedWoId: 1038, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-09-01T06:00:00Z", updatedAt: "2025-09-01T07:00:00Z" },

  // Asset 7 — Service Van #1
  { id: 14, assetId: 7, assetName: "Service Van #1", startTime: "2025-08-10T08:00:00Z", endTime: "2025-08-10T11:30:00Z", durationMinutes: 210, reason: "mechanical_failure", reasonDescription: "Brake failure, roadside service", associatedWoId: 1033, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-08-10T08:00:00Z", updatedAt: "2025-08-10T11:30:00Z" },
  { id: 15, assetId: 7, assetName: "Service Van #1", startTime: "2025-11-15T07:30:00Z", endTime: "2025-11-15T09:30:00Z", durationMinutes: 120, reason: "planned_maintenance", reasonDescription: "Scheduled oil change and tire rotation", associatedWoId: 1070, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-11-15T07:30:00Z", updatedAt: "2025-11-15T09:30:00Z" },

  // Asset 8 — Forklift FL-02
  { id: 16, assetId: 8, assetName: "Forklift FL-02", startTime: "2025-06-25T10:00:00Z", endTime: "2025-06-25T13:00:00Z", durationMinutes: 180, reason: "mechanical_failure", reasonDescription: "Hydraulic cylinder leak", associatedWoId: 1015, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-06-25T10:00:00Z", updatedAt: "2025-06-25T13:00:00Z" },
  { id: 17, assetId: 8, assetName: "Forklift FL-02", startTime: "2026-02-05T09:00:00Z", endTime: "2026-02-05T11:00:00Z", durationMinutes: 120, reason: "inspection", reasonDescription: "Annual OSHA safety inspection", associatedWoId: 1110, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2026-02-05T09:00:00Z", updatedAt: "2026-02-05T11:00:00Z" },

  // Asset 9 — Scissor Lift SL-01
  { id: 18, assetId: 9, assetName: "Scissor Lift SL-01", startTime: "2025-07-20T08:30:00Z", endTime: "2025-07-20T10:00:00Z", durationMinutes: 90, reason: "electrical_failure", reasonDescription: "Battery charger fault", associatedWoId: 1026, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-07-20T08:30:00Z", updatedAt: "2025-07-20T10:00:00Z" },
  { id: 19, assetId: 9, assetName: "Scissor Lift SL-01", startTime: "2025-10-18T14:00:00Z", endTime: "2025-10-18T15:30:00Z", durationMinutes: 90, reason: "planned_maintenance", reasonDescription: "Hydraulic fluid change", associatedWoId: 1060, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-10-18T14:00:00Z", updatedAt: "2025-10-18T15:30:00Z" },

  // Asset 10 — Fire Pump FP-1
  { id: 20, assetId: 10, assetName: "Fire Pump FP-1", startTime: "2025-09-15T10:00:00Z", endTime: "2025-09-15T11:30:00Z", durationMinutes: 90, reason: "inspection", reasonDescription: "Annual fire pump test and certification", associatedWoId: 1048, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-09-15T10:00:00Z", updatedAt: "2025-09-15T11:30:00Z" },

  // Asset 11 — Circulation Pump CP-A (high downtime)
  { id: 21, assetId: 11, assetName: "Circulation Pump CP-A", startTime: "2025-06-12T06:30:00Z", endTime: "2025-06-12T09:00:00Z", durationMinutes: 150, reason: "mechanical_failure", reasonDescription: "Shaft seal failure, water leak", associatedWoId: 1008, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-06-12T06:30:00Z", updatedAt: "2025-06-12T09:00:00Z" },
  { id: 22, assetId: 11, assetName: "Circulation Pump CP-A", startTime: "2025-09-08T07:00:00Z", endTime: "2025-09-09T10:00:00Z", durationMinutes: 1620, reason: "waiting_for_parts", reasonDescription: "Bearing failure — parts ordered overnight", associatedWoId: 1043, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-09-08T07:00:00Z", updatedAt: "2025-09-09T10:00:00Z" },
  { id: 23, assetId: 11, assetName: "Circulation Pump CP-A", startTime: "2025-12-05T08:00:00Z", endTime: "2025-12-05T10:30:00Z", durationMinutes: 150, reason: "mechanical_failure", reasonDescription: "Impeller damage detected during inspection", associatedWoId: 1079, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-12-05T08:00:00Z", updatedAt: "2025-12-05T10:30:00Z" },
  { id: 24, assetId: 11, assetName: "Circulation Pump CP-A", startTime: "2026-03-02T07:00:00Z", endTime: null, durationMinutes: null, reason: "mechanical_failure", reasonDescription: "Ongoing: complete pump overhaul in progress", associatedWoId: 1118, resolvedBy: null, resolvedByName: null, createdAt: "2026-03-02T07:00:00Z", updatedAt: "2026-03-02T07:00:00Z" },

  // Asset 12 — Air Compressor AC-1
  { id: 25, assetId: 12, assetName: "Air Compressor AC-1", startTime: "2025-07-22T11:00:00Z", endTime: "2025-07-22T13:30:00Z", durationMinutes: 150, reason: "electrical_failure", reasonDescription: "Motor overload trip", associatedWoId: 1028, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-07-22T11:00:00Z", updatedAt: "2025-07-22T13:30:00Z" },
  { id: 26, assetId: 12, assetName: "Air Compressor AC-1", startTime: "2025-11-10T09:30:00Z", endTime: "2025-11-10T11:00:00Z", durationMinutes: 90, reason: "planned_maintenance", reasonDescription: "Oil change and air filter replacement", associatedWoId: 1068, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-11-10T09:30:00Z", updatedAt: "2025-11-10T11:00:00Z" },

  // Asset 13 — Elevator ELV-A
  { id: 27, assetId: 13, assetName: "Elevator ELV-A", startTime: "2025-05-05T07:00:00Z", endTime: "2025-05-05T10:00:00Z", durationMinutes: 180, reason: "mechanical_failure", reasonDescription: "Door sensor malfunction, elevator locked out", associatedWoId: 993, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-05-05T07:00:00Z", updatedAt: "2025-05-05T10:00:00Z" },
  { id: 28, assetId: 13, assetName: "Elevator ELV-A", startTime: "2025-08-20T08:00:00Z", endTime: "2025-08-20T16:00:00Z", durationMinutes: 480, reason: "inspection", reasonDescription: "State-required annual elevator inspection", associatedWoId: 1035, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-08-20T08:00:00Z", updatedAt: "2025-08-20T16:00:00Z" },
  { id: 29, assetId: 13, assetName: "Elevator ELV-A", startTime: "2025-12-12T14:00:00Z", endTime: "2025-12-12T15:00:00Z", durationMinutes: 60, reason: "unknown", reasonDescription: "Momentary stoppage, reset cleared it", associatedWoId: null, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-12-12T14:00:00Z", updatedAt: "2025-12-12T15:00:00Z" },

  // Asset 14 — Elevator ELV-B
  { id: 30, assetId: 14, assetName: "Elevator ELV-B", startTime: "2025-09-30T09:00:00Z", endTime: "2025-09-30T11:00:00Z", durationMinutes: 120, reason: "planned_maintenance", reasonDescription: "Lubrication and cable inspection", associatedWoId: 1053, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-09-30T09:00:00Z", updatedAt: "2025-09-30T11:00:00Z" },

  // Asset 15 — AHU-03
  { id: 31, assetId: 15, assetName: "AHU-03 Air Handler", startTime: "2025-08-05T07:00:00Z", endTime: "2025-08-05T09:00:00Z", durationMinutes: 120, reason: "electrical_failure", reasonDescription: "VFD fault alarm", associatedWoId: 1031, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-08-05T07:00:00Z", updatedAt: "2025-08-05T09:00:00Z" },
  { id: 32, assetId: 15, assetName: "AHU-03 Air Handler", startTime: "2025-10-28T10:00:00Z", endTime: "2025-10-28T11:00:00Z", durationMinutes: 60, reason: "inspection", reasonDescription: "Filter change", associatedWoId: 1063, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-10-28T10:00:00Z", updatedAt: "2025-10-28T11:00:00Z" },

  // Asset 16 — RTU-02
  { id: 33, assetId: 16, assetName: "RTU-02 Rooftop Unit", startTime: "2026-01-20T09:00:00Z", endTime: "2026-01-20T10:30:00Z", durationMinutes: 90, reason: "planned_maintenance", reasonDescription: "Filter change and coil inspection", associatedWoId: 1102, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2026-01-20T09:00:00Z", updatedAt: "2026-01-20T10:30:00Z" },

  // Asset 17 — Cooling Tower CT-2
  { id: 34, assetId: 17, assetName: "Cooling Tower CT-2", startTime: "2026-02-15T08:00:00Z", endTime: "2026-02-15T11:00:00Z", durationMinutes: 180, reason: "inspection", reasonDescription: "Seasonal startup inspection", associatedWoId: 1114, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2026-02-15T08:00:00Z", updatedAt: "2026-02-15T11:00:00Z" },

  // Asset 18 — Emergency Generator EG-2
  { id: 35, assetId: 18, assetName: "Emergency Generator EG-2", startTime: "2025-11-01T06:00:00Z", endTime: "2025-11-01T07:30:00Z", durationMinutes: 90, reason: "planned_maintenance", reasonDescription: "Monthly load bank test", associatedWoId: 1066, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-11-01T06:00:00Z", updatedAt: "2025-11-01T07:30:00Z" },
  { id: 36, assetId: 18, assetName: "Emergency Generator EG-2", startTime: "2026-01-10T07:00:00Z", endTime: "2026-01-10T09:00:00Z", durationMinutes: 120, reason: "electrical_failure", reasonDescription: "Battery failure — generator wouldn't start", associatedWoId: 1096, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2026-01-10T07:00:00Z", updatedAt: "2026-01-10T09:00:00Z" },

  // Asset 19 — Boiler Unit C
  { id: 37, assetId: 19, assetName: "Boiler Unit C", startTime: "2025-07-01T05:30:00Z", endTime: "2025-07-01T08:00:00Z", durationMinutes: 150, reason: "mechanical_failure", reasonDescription: "Feed water pump failure", associatedWoId: 1018, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-07-01T05:30:00Z", updatedAt: "2025-07-01T08:00:00Z" },
  { id: 38, assetId: 19, assetName: "Boiler Unit C", startTime: "2025-12-15T06:00:00Z", endTime: "2025-12-15T14:00:00Z", durationMinutes: 480, reason: "inspection", reasonDescription: "Annual boiler inspection and certification", associatedWoId: 1083, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-12-15T06:00:00Z", updatedAt: "2025-12-15T14:00:00Z" },

  // Asset 20 — Service Van #2
  { id: 39, assetId: 20, assetName: "Service Van #2", startTime: "2025-06-18T09:00:00Z", endTime: "2025-06-18T10:30:00Z", durationMinutes: 90, reason: "mechanical_failure", reasonDescription: "Flat tire on-site", associatedWoId: 1012, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-06-18T09:00:00Z", updatedAt: "2025-06-18T10:30:00Z" },
  { id: 40, assetId: 20, assetName: "Service Van #2", startTime: "2025-10-22T07:30:00Z", endTime: "2025-10-22T09:30:00Z", durationMinutes: 120, reason: "planned_maintenance", reasonDescription: "30,000 mile service", associatedWoId: 1062, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-10-22T07:30:00Z", updatedAt: "2025-10-22T09:30:00Z" },

  // Asset 21 — Hydraulic Press HP-1
  { id: 41, assetId: 21, assetName: "Hydraulic Press HP-1", startTime: "2025-07-05T10:00:00Z", endTime: "2025-07-06T08:00:00Z", durationMinutes: 1320, reason: "mechanical_failure", reasonDescription: "Hydraulic line rupture — major repair", associatedWoId: 1019, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-07-05T10:00:00Z", updatedAt: "2025-07-06T08:00:00Z" },
  { id: 42, assetId: 21, assetName: "Hydraulic Press HP-1", startTime: "2025-11-20T09:00:00Z", endTime: "2025-11-20T11:00:00Z", durationMinutes: 120, reason: "inspection", reasonDescription: "Safety valve and pressure relief inspection", associatedWoId: 1073, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-11-20T09:00:00Z", updatedAt: "2025-11-20T11:00:00Z" },

  // Asset 22 — Water Softener WS-1
  { id: 43, assetId: 22, assetName: "Water Softener WS-1", startTime: "2025-08-25T10:00:00Z", endTime: "2025-08-25T11:00:00Z", durationMinutes: 60, reason: "planned_maintenance", reasonDescription: "Salt and resin top-up", associatedWoId: 1037, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-08-25T10:00:00Z", updatedAt: "2025-08-25T11:00:00Z" },

  // Asset 23 — Vacuum Pump VP-1
  { id: 44, assetId: 23, assetName: "Vacuum Pump VP-1", startTime: "2025-09-12T13:00:00Z", endTime: "2025-09-12T14:30:00Z", durationMinutes: 90, reason: "mechanical_failure", reasonDescription: "Shaft seal worn — minor oil leak", associatedWoId: 1046, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-09-12T13:00:00Z", updatedAt: "2025-09-12T14:30:00Z" },
  { id: 45, assetId: 23, assetName: "Vacuum Pump VP-1", startTime: "2026-01-08T10:00:00Z", endTime: "2026-01-08T11:30:00Z", durationMinutes: 90, reason: "planned_maintenance", reasonDescription: "Oil change and filter replacement", associatedWoId: 1094, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2026-01-08T10:00:00Z", updatedAt: "2026-01-08T11:30:00Z" },

  // Asset 24 — Cooling Tower CT-3
  { id: 46, assetId: 24, assetName: "Cooling Tower CT-3", startTime: "2025-07-28T08:00:00Z", endTime: "2025-07-28T10:00:00Z", durationMinutes: 120, reason: "mechanical_failure", reasonDescription: "Fan blade cracked — replacement", associatedWoId: 1029, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-07-28T08:00:00Z", updatedAt: "2025-07-28T10:00:00Z" },
  { id: 47, assetId: 24, assetName: "Cooling Tower CT-3", startTime: "2025-10-01T07:00:00Z", endTime: "2025-10-01T16:00:00Z", durationMinutes: 540, reason: "inspection", reasonDescription: "Annual basin cleaning and treatment", associatedWoId: 1055, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-10-01T07:00:00Z", updatedAt: "2025-10-01T16:00:00Z" },

  // Asset 25 — Fire Panel FP-Main
  { id: 48, assetId: 25, assetName: "Fire Panel FP-Main", startTime: "2025-08-30T07:00:00Z", endTime: "2025-08-30T08:00:00Z", durationMinutes: 60, reason: "inspection", reasonDescription: "Monthly test and inspection", associatedWoId: 1036, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-08-30T07:00:00Z", updatedAt: "2025-08-30T08:00:00Z" },

  // Ongoing events (endTime = null)
  { id: 49, assetId: 3, assetName: "Chiller Unit A", startTime: "2026-03-12T06:00:00Z", endTime: null, durationMinutes: null, reason: "mechanical_failure", reasonDescription: "Ongoing: refrigerant recharge in progress", associatedWoId: 1121, resolvedBy: null, resolvedByName: null, createdAt: "2026-03-12T06:00:00Z", updatedAt: "2026-03-12T06:00:00Z" },
  { id: 50, assetId: 5, assetName: "Cooling Tower CT-1", startTime: "2026-03-11T14:00:00Z", endTime: null, durationMinutes: null, reason: "environmental", reasonDescription: "Freeze protection shutdown — weather hold", associatedWoId: null, resolvedBy: null, resolvedByName: null, createdAt: "2026-03-11T14:00:00Z", updatedAt: "2026-03-11T14:00:00Z" },

  // Extra events for variety
  { id: 51, assetId: 5, assetName: "Cooling Tower CT-1", startTime: "2025-06-30T07:00:00Z", endTime: "2025-06-30T10:00:00Z", durationMinutes: 180, reason: "mechanical_failure", reasonDescription: "Fill valve failed, manual override needed", associatedWoId: 1017, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-06-30T07:00:00Z", updatedAt: "2025-06-30T10:00:00Z" },
  { id: 52, assetId: 5, assetName: "Cooling Tower CT-1", startTime: "2025-11-01T08:00:00Z", endTime: "2025-11-01T10:00:00Z", durationMinutes: 120, reason: "inspection", reasonDescription: "Fall winterization service", associatedWoId: 1064, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-11-01T08:00:00Z", updatedAt: "2025-11-01T10:00:00Z" },
  { id: 53, assetId: 13, assetName: "Elevator ELV-A", startTime: "2026-03-01T10:00:00Z", endTime: null, durationMinutes: null, reason: "mechanical_failure", reasonDescription: "Ongoing: door interlock failure, parts on order", associatedWoId: 1116, resolvedBy: null, resolvedByName: null, createdAt: "2026-03-01T10:00:00Z", updatedAt: "2026-03-01T10:00:00Z" },
  { id: 54, assetId: 6, assetName: "Generator GEN-01", startTime: "2026-02-01T06:00:00Z", endTime: "2026-02-01T07:00:00Z", durationMinutes: 60, reason: "planned_maintenance", reasonDescription: "Monthly load test", associatedWoId: 1108, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2026-02-01T06:00:00Z", updatedAt: "2026-02-01T07:00:00Z" },
  { id: 55, assetId: 4, assetName: "Boiler Unit B", startTime: "2025-09-10T06:00:00Z", endTime: "2025-09-10T07:30:00Z", durationMinutes: 90, reason: "mechanical_failure", reasonDescription: "Burner igniter failed", associatedWoId: 1044, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-09-10T06:00:00Z", updatedAt: "2025-09-10T07:30:00Z" },
  { id: 56, assetId: 12, assetName: "Air Compressor AC-1", startTime: "2026-03-05T11:00:00Z", endTime: null, durationMinutes: null, reason: "unknown", reasonDescription: "Intermittent pressure drop — investigating", associatedWoId: 1120, resolvedBy: null, resolvedByName: null, createdAt: "2026-03-05T11:00:00Z", updatedAt: "2026-03-05T11:00:00Z" },
  { id: 57, assetId: 2, assetName: "AHU-02 Air Handler", startTime: "2026-03-01T09:00:00Z", endTime: "2026-03-01T10:00:00Z", durationMinutes: 60, reason: "operator_error", reasonDescription: "Incorrect setpoint caused shutdown", associatedWoId: null, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2026-03-01T09:00:00Z", updatedAt: "2026-03-01T10:00:00Z" },
  { id: 58, assetId: 16, assetName: "RTU-02 Rooftop Unit", startTime: "2025-08-14T08:00:00Z", endTime: "2025-08-14T09:00:00Z", durationMinutes: 60, reason: "electrical_failure", reasonDescription: "Fuse blown — replaced", associatedWoId: 1034, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2025-08-14T08:00:00Z", updatedAt: "2025-08-14T09:00:00Z" },
  { id: 59, assetId: 1, assetName: "RTU-01 Rooftop Unit", startTime: "2026-03-08T07:00:00Z", endTime: "2026-03-08T08:30:00Z", durationMinutes: 90, reason: "mechanical_failure", reasonDescription: "Filter bypass alarm — filter replaced", associatedWoId: 1119, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2026-03-08T07:00:00Z", updatedAt: "2026-03-08T08:30:00Z" },
  { id: 60, assetId: 19, assetName: "Boiler Unit C", startTime: "2026-02-20T05:30:00Z", endTime: "2026-02-20T08:00:00Z", durationMinutes: 150, reason: "mechanical_failure", reasonDescription: "Condensate trap failure, steam loss", associatedWoId: 1115, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2026-02-20T05:30:00Z", updatedAt: "2026-02-20T08:00:00Z" },
  { id: 61, assetId: 21, assetName: "Hydraulic Press HP-1", startTime: "2026-03-10T14:00:00Z", endTime: null, durationMinutes: null, reason: "mechanical_failure", reasonDescription: "Ongoing: seal replacement in progress", associatedWoId: 1122, resolvedBy: null, resolvedByName: null, createdAt: "2026-03-10T14:00:00Z", updatedAt: "2026-03-10T14:00:00Z" },
  { id: 62, assetId: 24, assetName: "Cooling Tower CT-3", startTime: "2026-02-28T08:00:00Z", endTime: "2026-02-28T10:00:00Z", durationMinutes: 120, reason: "mechanical_failure", reasonDescription: "Motor vibration — bearing replacement", associatedWoId: 1117, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2026-02-28T08:00:00Z", updatedAt: "2026-02-28T10:00:00Z" },
  { id: 63, assetId: 8, assetName: "Forklift FL-02", startTime: "2025-11-08T10:00:00Z", endTime: "2025-11-08T12:00:00Z", durationMinutes: 120, reason: "mechanical_failure", reasonDescription: "Mast tilt cylinder seal failure", associatedWoId: 1067, resolvedBy: 2, resolvedByName: "admin.user", createdAt: "2025-11-08T10:00:00Z", updatedAt: "2025-11-08T12:00:00Z" },
  { id: 64, assetId: 9, assetName: "Scissor Lift SL-01", startTime: "2026-01-25T13:00:00Z", endTime: "2026-01-25T14:30:00Z", durationMinutes: 90, reason: "mechanical_failure", reasonDescription: "Platform leveling sensor fault", associatedWoId: 1104, resolvedBy: 1, resolvedByName: "demo.user", createdAt: "2026-01-25T13:00:00Z", updatedAt: "2026-01-25T14:30:00Z" },
  { id: 65, assetId: 10, assetName: "Fire Pump FP-1", startTime: "2026-03-05T10:00:00Z", endTime: null, durationMinutes: null, reason: "inspection", reasonDescription: "Ongoing: annual fire pump test with authority having jurisdiction", associatedWoId: 1123, resolvedBy: null, resolvedByName: null, createdAt: "2026-03-05T10:00:00Z", updatedAt: "2026-03-05T10:00:00Z" },
];
