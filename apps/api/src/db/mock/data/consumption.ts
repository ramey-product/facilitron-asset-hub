import type { ConsumptionRecord, InventoryAuditRecord } from "@asset-hub/shared";

/**
 * Generate 130 consumption records over the last 90 days,
 * linked to WO numbers WO-1001 through WO-1050.
 */
function generateConsumptionRecords(): ConsumptionRecord[] {
  const parts = [
    { id: 1, name: "HVAC Air Filter 20x25x4", sku: "FLT-2025-04" },
    { id: 2, name: "V-Belt A68", sku: "BLT-A68" },
    { id: 3, name: "Refrigerant R-410A (25lb)", sku: "REF-410A-25" },
    { id: 4, name: "Contactor 40A 3-Pole", sku: "ELC-CTR-40" },
    { id: 5, name: "Capacitor 45/5 MFD 440V", sku: "ELC-CAP-455" },
    { id: 6, name: "Thermocouple Universal 24\"", sku: "PLB-TC-24" },
    { id: 7, name: "Condensate Pump 1/30HP", sku: "PMP-CND-130" },
    { id: 8, name: "Fire Alarm Pull Station", sku: "FIR-PS-01" },
    { id: 9, name: "Sprinkler Head 155F", sku: "FIR-SPK-155" },
    { id: 10, name: "UPS Battery 12V 9Ah", sku: "ELC-BAT-129" },
    { id: 11, name: "Lubricant - Machine Oil 32oz", sku: "LUB-MO-32" },
    { id: 12, name: "Irrigation Valve 1\"", sku: "IRR-VLV-01" },
  ];

  const locations = [
    { id: 1, name: "Main Building - Mech Room" },
    { id: 2, name: "Admin Building - Storage" },
    { id: 3, name: "Roosevelt Campus - Mech Room" },
    { id: 4, name: "Central Warehouse" },
  ];

  const technicians = [
    "demo.user", "j.martinez", "t.chen", "r.patel", "k.wilson",
  ];

  const records: ConsumptionRecord[] = [];
  let id = 1;
  const now = Date.now();
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < 130; i++) {
    const part = parts[i % parts.length]!;
    const location = locations[i % locations.length]!;
    const tech = technicians[i % technicians.length]!;
    const woNum = 1001 + (i % 50);
    const daysAgo = Math.floor(Math.random() * 90);
    const loggedAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    const qty = Math.ceil(Math.random() * 4);
    const unitCost = [12.5, 18.75, 185.0, 42.0, 28.5, 8.25, 135.0, 55.0, 32.0, 89.0, 14.5, 45.0][i % parts.length]!;

    // ~8% of records are reversed
    const isReversed = i % 13 === 0;

    records.push({
      id,
      customerID: 1,
      workOrderId: woNum,
      workOrderNumber: `WO-${woNum}`,
      partId: part.id,
      partName: part.name,
      partSku: part.sku,
      locationId: location.id,
      locationName: location.name,
      qty,
      unitCost,
      totalCost: Math.round(qty * unitCost * 100) / 100,
      loggedBy: tech,
      loggedAt,
      isReversed,
      reversedBy: isReversed ? "admin.user" : null,
      reversedAt: isReversed
        ? new Date(new Date(loggedAt).getTime() + 2 * 60 * 60 * 1000).toISOString()
        : null,
    });
    id++;
  }

  // Sort by loggedAt descending
  records.sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());
  return records;
}

/**
 * Generate audit trail entries: one per consumption + some manual adjustments.
 */
function generateAuditRecords(consumptions: ConsumptionRecord[]): InventoryAuditRecord[] {
  const records: InventoryAuditRecord[] = [];
  let id = 1;

  // Audit entry for each consumption
  for (const c of consumptions) {
    const qtyBefore = 20 + Math.floor(Math.random() * 80);
    records.push({
      id: id++,
      customerID: 1,
      partId: c.partId,
      partName: c.partName,
      locationId: c.locationId,
      locationName: c.locationName,
      changeType: "consumption",
      qtyBefore,
      qtyAfter: qtyBefore - c.qty,
      qtyChanged: -c.qty,
      reason: `WO consumption: ${c.workOrderNumber}`,
      referenceId: c.workOrderNumber,
      changedBy: c.loggedBy,
      changedAt: c.loggedAt,
    });

    // If reversed, add a reversal audit entry
    if (c.isReversed && c.reversedAt) {
      const revBefore = qtyBefore - c.qty;
      records.push({
        id: id++,
        customerID: 1,
        partId: c.partId,
        partName: c.partName,
        locationId: c.locationId,
        locationName: c.locationName,
        changeType: "reversal",
        qtyBefore: revBefore,
        qtyAfter: revBefore + c.qty,
        qtyChanged: c.qty,
        reason: `Reversed consumption from ${c.workOrderNumber}`,
        referenceId: c.workOrderNumber,
        changedBy: c.reversedBy!,
        changedAt: c.reversedAt,
      });
    }
  }

  // Add 15 manual adjustments
  const adjustmentParts = [
    { id: 1, name: "HVAC Air Filter 20x25x4" },
    { id: 3, name: "Refrigerant R-410A (25lb)" },
    { id: 10, name: "UPS Battery 12V 9Ah" },
    { id: 5, name: "Capacitor 45/5 MFD 440V" },
  ];

  const adjustReasons = [
    "Physical count correction",
    "Cycle count adjustment",
    "Damaged stock write-off",
    "Found misplaced inventory",
    "Expired product disposal",
  ];

  const now = Date.now();
  for (let i = 0; i < 15; i++) {
    const part = adjustmentParts[i % adjustmentParts.length]!;
    const daysAgo = Math.floor(Math.random() * 90);
    const qtyBefore = 30 + Math.floor(Math.random() * 50);
    const change = Math.round((Math.random() - 0.4) * 10);

    records.push({
      id: id++,
      customerID: 1,
      partId: part.id,
      partName: part.name,
      locationId: ((i % 4) + 1),
      locationName: ["Main Building - Mech Room", "Admin Building - Storage", "Roosevelt Campus - Mech Room", "Central Warehouse"][i % 4]!,
      changeType: "adjustment",
      qtyBefore,
      qtyAfter: qtyBefore + change,
      qtyChanged: change,
      reason: adjustReasons[i % adjustReasons.length]!,
      referenceId: null,
      changedBy: "admin.user",
      changedAt: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  // 5 receiving entries
  for (let i = 0; i < 5; i++) {
    const part = adjustmentParts[i % adjustmentParts.length]!;
    const daysAgo = Math.floor(Math.random() * 60);
    const qtyBefore = 5 + Math.floor(Math.random() * 20);
    const qtyReceived = 10 + Math.floor(Math.random() * 40);

    records.push({
      id: id++,
      customerID: 1,
      partId: part.id,
      partName: part.name,
      locationId: 4, // Central Warehouse
      locationName: "Central Warehouse",
      changeType: "receiving",
      qtyBefore,
      qtyAfter: qtyBefore + qtyReceived,
      qtyChanged: qtyReceived,
      reason: "PO receiving",
      referenceId: `PO-${2001 + i}`,
      changedBy: "admin.user",
      changedAt: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  records.sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());
  return records;
}

export const mockConsumptionRecords = generateConsumptionRecords();
export const mockAuditRecords = generateAuditRecords(mockConsumptionRecords);
