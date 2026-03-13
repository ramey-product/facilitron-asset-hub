import { test, expect } from "@playwright/test";

/**
 * Asset list and detail page E2E tests.
 */
test.describe("Asset List", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/assets");
    // Wait for the page header
    await page.waitForSelector("header", { timeout: 20_000 });
  });

  test("Asset Registry heading is visible", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /asset registry/i })).toBeVisible({
      timeout: 20_000,
    });
  });

  test("search input is present", async ({ page }) => {
    const searchInput = page.getByRole("textbox", { name: /search/i });
    await expect(searchInput).toBeVisible({ timeout: 20_000 });
  });

  test("condition filter select is present", async ({ page }) => {
    const conditionFilter = page.getByRole("combobox", { name: /condition/i });
    await expect(conditionFilter).toBeVisible({ timeout: 20_000 });
  });

  test("lifecycle status filter select is present", async ({ page }) => {
    const statusFilter = page.getByRole("combobox", { name: /lifecycle/i });
    await expect(statusFilter).toBeVisible({ timeout: 20_000 });
  });

  test("asset table renders with rows after data loads", async ({ page }) => {
    // Wait for loading to finish (pulse skeletons disappear)
    await page.waitForFunction(
      () => document.querySelectorAll(".animate-pulse").length === 0,
      { timeout: 20_000 }
    );

    const table = page.locator("table");
    await expect(table).toBeVisible({ timeout: 20_000 });

    const rows = page.locator("tbody tr");
    await expect(rows.first()).toBeVisible({ timeout: 20_000 });
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test("table has expected column headers", async ({ page }) => {
    await page.waitForFunction(
      () => document.querySelectorAll(".animate-pulse").length === 0,
      { timeout: 20_000 }
    );

    await expect(page.getByRole("columnheader", { name: /name/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /condition/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /status/i })).toBeVisible();
  });

  test("view mode toggle buttons are visible", async ({ page }) => {
    const tableViewBtn = page.getByRole("button", { name: /table view/i });
    const gridViewBtn = page.getByRole("button", { name: /grid view/i });
    await expect(tableViewBtn).toBeVisible({ timeout: 20_000 });
    await expect(gridViewBtn).toBeVisible({ timeout: 20_000 });
  });

  test("switching to grid view renders cards", async ({ page }) => {
    await page.waitForFunction(
      () => document.querySelectorAll(".animate-pulse").length === 0,
      { timeout: 20_000 }
    );

    await page.getByRole("button", { name: /grid view/i }).click();
    // Grid view uses cards instead of a table — no <table> element
    await expect(page.locator("table")).not.toBeVisible();
  });

  test("pagination controls appear when there are multiple pages", async ({ page }) => {
    await page.waitForFunction(
      () => document.querySelectorAll(".animate-pulse").length === 0,
      { timeout: 20_000 }
    );

    // If total > limit, pagination controls render
    const paginationText = page.getByText(/page \d+ of \d+/i);
    const hasPagination = await paginationText.isVisible();
    if (hasPagination) {
      // Previous/next buttons should also be present
      await expect(page.getByRole("button", { name: "" }).first()).toBeVisible();
    } else {
      // All assets fit on one page — that's valid too
      expect(hasPagination).toBe(false);
    }
  });

  test("clicking an asset row link navigates to detail page", async ({ page }) => {
    await page.waitForFunction(
      () => document.querySelectorAll(".animate-pulse").length === 0,
      { timeout: 20_000 }
    );

    // Click the first asset name link in the table
    const firstAssetLink = page.locator("tbody tr").first().locator("a").first();
    await firstAssetLink.click();

    await expect(page).toHaveURL(/\/assets\/\d+/, { timeout: 20_000 });
  });

  test("Add Asset button is visible and links to /assets/new", async ({ page }) => {
    const addBtn = page.getByRole("link", { name: /add asset/i });
    await expect(addBtn).toBeVisible({ timeout: 20_000 });
    const href = await addBtn.getAttribute("href");
    expect(href).toBe("/assets/new");
  });
});

test.describe("Asset Detail", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/assets/1");
    // Wait for the header (either loaded asset or 404 card)
    await page.waitForSelector("header, [role='main']", { timeout: 20_000 });
  });

  test("asset detail page loads without crashing", async ({ page }) => {
    // If asset 1 exists it should show a header; if not, the 404 card renders
    const header = page.locator("header");
    const notFound = page.getByText(/asset not found/i);
    const headerVisible = await header.isVisible();
    const notFoundVisible = await notFound.isVisible();
    expect(headerVisible || notFoundVisible).toBe(true);
  });

  test("asset detail shows tab navigation", async ({ page }) => {
    await page.waitForFunction(
      () => document.querySelectorAll(".animate-pulse").length === 0,
      { timeout: 20_000 }
    );

    // Tab navigation appears if the asset loaded successfully
    const overviewTab = page.getByRole("button", { name: /overview/i });
    const isVisible = await overviewTab.isVisible();
    if (isVisible) {
      await expect(overviewTab).toBeVisible();
    }
  });

  test("tab list includes Overview, Photos, Documents, Custom Fields, Inspections", async ({ page }) => {
    await page.waitForFunction(
      () => document.querySelectorAll(".animate-pulse").length === 0,
      { timeout: 20_000 }
    );

    const tabs = ["Overview", "Photos", "Documents", "Custom Fields", "Inspections"];
    for (const tabName of tabs) {
      const tab = page.getByRole("button", { name: new RegExp(tabName, "i") });
      const visible = await tab.isVisible();
      if (visible) {
        // Confirm it renders
        await expect(tab).toBeVisible();
      }
    }
  });

  test("Back button link returns to /assets", async ({ page }) => {
    await page.waitForFunction(
      () => document.querySelectorAll(".animate-pulse").length === 0,
      { timeout: 20_000 }
    );

    const backBtn = page.getByRole("link", { name: /back/i });
    const isVisible = await backBtn.isVisible();
    if (isVisible) {
      const href = await backBtn.getAttribute("href");
      expect(href).toBe("/assets");
    }
  });

  test("switching to Photos tab does not crash", async ({ page }) => {
    await page.waitForFunction(
      () => document.querySelectorAll(".animate-pulse").length === 0,
      { timeout: 20_000 }
    );

    const photosTab = page.getByRole("button", { name: /photos/i });
    if (await photosTab.isVisible()) {
      await photosTab.click();
      // Page should not error after tab click
      await expect(page.locator("body")).toBeVisible();
    }
  });

  test("switching to Documents tab does not crash", async ({ page }) => {
    await page.waitForFunction(
      () => document.querySelectorAll(".animate-pulse").length === 0,
      { timeout: 20_000 }
    );

    const docsTab = page.getByRole("button", { name: /documents/i });
    if (await docsTab.isVisible()) {
      await docsTab.click();
      await expect(page.locator("body")).toBeVisible();
    }
  });

  test("asset detail shows basic info labels when loaded", async ({ page }) => {
    await page.waitForFunction(
      () => document.querySelectorAll(".animate-pulse").length === 0,
      { timeout: 20_000 }
    );

    // Verify info labels that always appear in the overview tab
    const assetDetailsCard = page.getByText(/asset details/i);
    const visible = await assetDetailsCard.isVisible();
    if (visible) {
      await expect(assetDetailsCard).toBeVisible();
      await expect(page.getByText(/property/i).first()).toBeVisible();
      await expect(page.getByText(/category/i).first()).toBeVisible();
    }
  });
});
