-- Rollback Script — Undo P1 Migration
-- WARNING: This drops all P1 inventory data. Legacy tables are NOT modified.
-- Only run this if migration needs to be re-executed from scratch.

-- Step 1: Drop stock levels (depends on parts via FK)
IF OBJECT_ID('tblP1StockLevels', 'U') IS NOT NULL
BEGIN
    PRINT 'Dropping tblP1StockLevels...';
    DROP TABLE tblP1StockLevels;
    PRINT 'Done.';
END
ELSE
    PRINT 'tblP1StockLevels does not exist — skipping.';

-- Step 2: Drop parts table
IF OBJECT_ID('tblP1Parts', 'U') IS NOT NULL
BEGIN
    PRINT 'Dropping tblP1Parts...';
    DROP TABLE tblP1Parts;
    PRINT 'Done.';
END
ELSE
    PRINT 'tblP1Parts does not exist — skipping.';

-- Step 3: Confirm rollback
SELECT
    'rollback_complete' AS status,
    CASE WHEN OBJECT_ID('tblP1Parts', 'U') IS NULL THEN 'DROPPED' ELSE 'STILL EXISTS' END AS tblP1Parts,
    CASE WHEN OBJECT_ID('tblP1StockLevels', 'U') IS NULL THEN 'DROPPED' ELSE 'STILL EXISTS' END AS tblP1StockLevels,
    GETUTCDATE() AS executed_at;
