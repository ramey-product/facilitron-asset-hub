-- Migration: Legacy Consumables → P1-17 Parts Catalog
-- Purpose: Maps existing tblInventoryItems to the P1 parts schema
-- Target: Run against SQL Server when transitioning from legacy to P1 data model
-- Status: TEMPLATE — column names will be confirmed during real DB integration

-- Step 1: Create P1 parts table if not exists
-- (In production this comes from Drizzle migration, shown here for reference)
/*
CREATE TABLE tblP1Parts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customerID INT NOT NULL,
    partNumber NVARCHAR(50) NOT NULL,
    name NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    category NVARCHAR(100),
    subcategory NVARCHAR(100),
    unitOfMeasure NVARCHAR(20) DEFAULT 'each',
    unitCost DECIMAL(12,2) DEFAULT 0,
    manufacturer NVARCHAR(200),
    modelNumber NVARCHAR(100),
    reorderPoint INT DEFAULT 0,
    reorderQuantity INT DEFAULT 0,
    preferredVendorId INT,
    storageLocation NVARCHAR(200),
    isActive BIT DEFAULT 1,
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_P1Parts_CustomerPart UNIQUE (customerID, partNumber)
);
*/

-- Step 2: Migrate legacy inventory items to P1 parts
INSERT INTO tblP1Parts (
    customerID,
    partNumber,
    name,
    description,
    category,
    unitOfMeasure,
    unitCost,
    reorderPoint,
    storageLocation,
    isActive,
    createdAt
)
SELECT
    li.CustomerID,
    COALESCE(li.ItemNumber, 'LEGACY-' + CAST(li.ItemID AS NVARCHAR(10))),
    li.ItemName,
    li.ItemDescription,
    li.CategoryName,
    COALESCE(li.UnitOfMeasure, 'each'),
    COALESCE(li.UnitPrice, 0),
    COALESCE(li.ReorderLevel, 0),
    li.LocationDescription,
    CASE WHEN li.IsDeleted = 1 THEN 0 ELSE 1 END,
    COALESCE(li.CreatedDate, GETUTCDATE())
FROM tblInventoryItems li
WHERE li.ItemType = 'Consumable'
ORDER BY li.CustomerID, li.ItemID;

-- Step 3: Log migration results
SELECT
    'legacy-consumables-to-p1-17' AS migration,
    COUNT(*) AS rows_migrated,
    COUNT(DISTINCT CustomerID) AS customers_affected,
    GETUTCDATE() AS executed_at
FROM tblP1Parts
WHERE partNumber LIKE 'LEGACY-%' OR createdAt >= DATEADD(MINUTE, -5, GETUTCDATE());
