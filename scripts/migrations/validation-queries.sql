-- Validation Queries — Post-Migration Checks
-- Run after legacy-consumables-to-p1-17.sql and legacy-stock-to-p1-18.sql
-- All queries should return 0 rows if migration was successful

-- ═══════════════════════════════════════════════════════════════════
-- CHECK 1: Orphaned parts (legacy items not migrated)
-- ═══════════════════════════════════════════════════════════════════
SELECT
    'orphaned_parts' AS check_name,
    li.CustomerID,
    li.ItemID,
    li.ItemName,
    li.ItemNumber
FROM tblInventoryItems li
LEFT JOIN tblP1Parts p
    ON p.customerID = li.CustomerID
    AND (p.partNumber = li.ItemNumber OR p.partNumber = 'LEGACY-' + CAST(li.ItemID AS NVARCHAR(10)))
WHERE li.ItemType = 'Consumable'
    AND li.IsDeleted = 0
    AND p.id IS NULL;

-- ═══════════════════════════════════════════════════════════════════
-- CHECK 2: Stock without matching part (broken FK)
-- ═══════════════════════════════════════════════════════════════════
SELECT
    'stock_without_part' AS check_name,
    sl.id,
    sl.partId,
    sl.quantityOnHand
FROM tblP1StockLevels sl
LEFT JOIN tblP1Parts p ON p.id = sl.partId
WHERE p.id IS NULL;

-- ═══════════════════════════════════════════════════════════════════
-- CHECK 3: Duplicate part numbers within same customer
-- ═══════════════════════════════════════════════════════════════════
SELECT
    'duplicate_part_numbers' AS check_name,
    customerID,
    partNumber,
    COUNT(*) AS duplicate_count
FROM tblP1Parts
GROUP BY customerID, partNumber
HAVING COUNT(*) > 1;

-- ═══════════════════════════════════════════════════════════════════
-- CHECK 4: Negative stock quantities
-- ═══════════════════════════════════════════════════════════════════
SELECT
    'negative_stock' AS check_name,
    sl.id,
    p.partNumber,
    p.name,
    sl.quantityOnHand
FROM tblP1StockLevels sl
INNER JOIN tblP1Parts p ON p.id = sl.partId
WHERE sl.quantityOnHand < 0;

-- ═══════════════════════════════════════════════════════════════════
-- CHECK 5: Row count comparison (legacy vs P1)
-- ═══════════════════════════════════════════════════════════════════
SELECT
    'row_count_comparison' AS check_name,
    (SELECT COUNT(*) FROM tblInventoryItems WHERE ItemType = 'Consumable' AND IsDeleted = 0) AS legacy_active_count,
    (SELECT COUNT(*) FROM tblP1Parts WHERE isActive = 1) AS p1_active_count,
    (SELECT COUNT(*) FROM tblInventoryStock WHERE QuantityOnHand IS NOT NULL) AS legacy_stock_rows,
    (SELECT COUNT(*) FROM tblP1StockLevels) AS p1_stock_rows;

-- ═══════════════════════════════════════════════════════════════════
-- SUMMARY: Overall migration health
-- ═══════════════════════════════════════════════════════════════════
SELECT
    'migration_summary' AS report,
    (SELECT COUNT(*) FROM tblP1Parts) AS total_parts,
    (SELECT COUNT(*) FROM tblP1Parts WHERE isActive = 1) AS active_parts,
    (SELECT COUNT(*) FROM tblP1StockLevels) AS stock_records,
    (SELECT SUM(quantityOnHand) FROM tblP1StockLevels) AS total_units,
    (SELECT COUNT(DISTINCT customerID) FROM tblP1Parts) AS customers;
