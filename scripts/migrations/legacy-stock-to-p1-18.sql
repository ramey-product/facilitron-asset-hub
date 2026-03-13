-- Migration: Legacy Stock Levels → P1-18 Stock Tracking
-- Purpose: Migrates existing stock quantities and transaction history to P1 schema
-- Target: Run against SQL Server when transitioning from legacy to P1 data model
-- Status: TEMPLATE — column names will be confirmed during real DB integration

-- Step 1: Create P1 stock levels table (reference — actual DDL from Drizzle migration)
/*
CREATE TABLE tblP1StockLevels (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customerID INT NOT NULL,
    partId INT NOT NULL REFERENCES tblP1Parts(id),
    locationId INT,
    quantityOnHand INT DEFAULT 0,
    quantityReserved INT DEFAULT 0,
    quantityOnOrder INT DEFAULT 0,
    lastCountDate DATETIME2,
    lastCountBy NVARCHAR(100),
    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_P1Stock_PartLocation UNIQUE (partId, locationId)
);
*/

-- Step 2: Migrate legacy stock quantities
INSERT INTO tblP1StockLevels (
    customerID,
    partId,
    locationId,
    quantityOnHand,
    quantityReserved,
    quantityOnOrder,
    updatedAt
)
SELECT
    p.customerID,
    p.id AS partId,
    ls.LocationID,
    COALESCE(ls.QuantityOnHand, 0),
    COALESCE(ls.QuantityReserved, 0),
    COALESCE(ls.QuantityOnOrder, 0),
    COALESCE(ls.LastUpdated, GETUTCDATE())
FROM tblInventoryStock ls
INNER JOIN tblP1Parts p
    ON p.customerID = ls.CustomerID
    AND (p.partNumber = ls.ItemNumber OR p.partNumber = 'LEGACY-' + CAST(ls.ItemID AS NVARCHAR(10)))
WHERE ls.QuantityOnHand IS NOT NULL;

-- Step 3: Log migration results
SELECT
    'legacy-stock-to-p1-18' AS migration,
    COUNT(*) AS rows_migrated,
    COUNT(DISTINCT customerID) AS customers_affected,
    SUM(quantityOnHand) AS total_units_migrated,
    GETUTCDATE() AS executed_at
FROM tblP1StockLevels
WHERE updatedAt >= DATEADD(MINUTE, -5, GETUTCDATE());
