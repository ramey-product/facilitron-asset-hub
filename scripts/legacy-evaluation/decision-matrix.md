# Legacy Ticket Evaluation — P1-41 S1

Evaluates legacy inventory tickets against P1 prototype coverage.

## Decision Criteria

| Decision | Meaning |
|----------|---------|
| **Superseded** | P1 prototype fully covers this ticket's scope — close as Won't Do |
| **Needs New Story** | P1 covers partially — create a new story for the gap |
| **Obsolete** | Original requirement is no longer relevant |

## Evaluation

### WORKS-943: Consumable Inventory Tracking
- **Original Scope**: Track consumable parts with quantities, locations, reorder points
- **P1 Coverage**: P1-17 (Parts Catalog), P1-18 (Stock Tracking), P1-26 (Consumables Dashboard), P1-27 (Consumable Detail)
- **Decision**: **Superseded**
- **Notes**: P1 prototype provides comprehensive parts catalog with stock levels, reorder points, location tracking, consumption history, and a dedicated dashboard. Exceeds original ticket scope.

### WORKS-1674: Inventory Reports — Usage by Department
- **Original Scope**: Generate reports showing parts usage broken down by department/cost center
- **P1 Coverage**: P1-28 (Inventory Use Report) — includes Usage by Part, Location, WO Type, Cost Analysis, Vendor Spend with date ranges, grouping, and export
- **Decision**: **Needs New Story**
- **Gap**: P1-28 groups by Part, Location, WO Type, Category, and Vendor — but not explicitly by Department. Department grouping should be added as a report type or grouping option when real data is connected.
- **New Story**: "Add Department/Cost Center grouping to Inventory Use Report" (~3 SP)

### WORKS-1675: Barcode Scanning for Inventory
- **Original Scope**: Scan barcodes to look up parts and adjust stock
- **P1 Coverage**: P0-11 (Mobile Scanning) covers barcode/QR scanning for assets. P1-18 has stock adjustment capabilities.
- **Decision**: **Needs New Story**
- **Gap**: Mobile scanning (P0-11) focuses on asset lookup. Need to extend scan-to-part-lookup and scan-to-adjust-stock flow for consumables.
- **New Story**: "Extend Mobile Scanning to support consumable part lookup and stock adjustment" (~5 SP)

### WORKS-352: Tool Room Management
- **Original Scope**: Track tool checkouts, returns, overdue items
- **P1 Coverage**: P1-40 (Toolroom) — checkout/return workflow, overdue alerts, popular tools chart, stats dashboard
- **Decision**: **Superseded**
- **Notes**: P1-40 provides a complete toolroom management UI with checkout/return modals, due date tracking, overdue alerts, and usage analytics. Fully covers and exceeds the original ticket scope.

## Summary

| Ticket | Decision | Action |
|--------|----------|--------|
| WORKS-943 | Superseded | Close as Won't Do — covered by P1-17, P1-18, P1-26, P1-27 |
| WORKS-1674 | Needs New Story | Create story: Department grouping for P1-28 (~3 SP) |
| WORKS-1675 | Needs New Story | Create story: Scanning for consumables (~5 SP) |
| WORKS-352 | Superseded | Close as Won't Do — covered by P1-40 |
