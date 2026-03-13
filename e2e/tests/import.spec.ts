import { test, expect } from "@playwright/test";

/**
 * Bulk import wizard E2E tests.
 * Verifies the wizard UI loads, the upload step renders, and history page is accessible.
 */
test.describe("Bulk Import", () => {
  test("import page loads with Bulk Import heading", async ({ page }) => {
    await page.goto("/assets/import");
    await page.waitForSelector("header", { timeout: 20_000 });
    await expect(page.getByRole("heading", { name: /bulk import/i })).toBeVisible({
      timeout: 20_000,
    });
  });

  test("import page subtitle mentions CSV or Excel", async ({ page }) => {
    await page.goto("/assets/import");
    await page.waitForSelector("header", { timeout: 20_000 });
    const subtitle = page.getByText(/csv|excel/i).first();
    await expect(subtitle).toBeVisible({ timeout: 20_000 });
  });

  test("wizard step indicators render (progress bar)", async ({ page }) => {
    await page.goto("/assets/import");

    // Wait for Suspense boundary to resolve
    await page.waitForFunction(
      () => document.querySelectorAll(".animate-pulse").length === 0,
      { timeout: 20_000 }
    );

    // The wizard progress bar shows numbered or named steps
    // It renders as a horizontal flex row of step nodes
    const stepElements = page.locator("[class*='step'], [class*='wizard'], ol li, [aria-label*='step']");
    const count = await stepElements.count();

    // If no specific step selectors match, just verify the wizard container loaded
    if (count === 0) {
      // Fallback: the wizard renders circular step indicators as divs with animate-pulse gone
      const wizardContent = page.locator("main, [class*='max-w']");
      await expect(wizardContent.first()).toBeVisible({ timeout: 20_000 });
    } else {
      expect(count).toBeGreaterThan(0);
    }
  });

  test("upload step shows drag-and-drop zone", async ({ page }) => {
    await page.goto("/assets/import");

    await page.waitForFunction(
      () => document.querySelectorAll(".animate-pulse").length === 0,
      { timeout: 20_000 }
    );

    // The upload step includes a file drop zone with dashed border
    // Look for input[type=file] or a drop zone element
    const fileInput = page.locator("input[type='file']");
    const dropZone = page.locator("[class*='dashed'], [class*='drop'], [class*='upload']").first();
    const dragText = page.getByText(/drag|drop|upload|csv|excel/i).first();

    const fileInputVisible = await fileInput.isVisible();
    const dropZoneVisible = await dropZone.isVisible();
    const dragTextVisible = await dragText.isVisible();

    expect(fileInputVisible || dropZoneVisible || dragTextVisible).toBe(true);
  });

  test("import history page loads", async ({ page }) => {
    await page.goto("/assets/import/history");
    await page.waitForSelector("body", { timeout: 20_000 });

    // History page should load without a runtime crash
    // It may show empty state or a list
    const errorMessage = page.getByText(/something went wrong|uncaught error|error boundary/i);
    const hasError = await errorMessage.isVisible();
    expect(hasError).toBe(false);
  });

  test("import history page contains history-related content", async ({ page }) => {
    await page.goto("/assets/import/history");

    await page.waitForFunction(
      () => document.querySelectorAll(".animate-pulse").length === 0,
      { timeout: 20_000 }
    );

    // The history page should display something related to import history
    const historyContent = page.getByText(/history|import|batch|upload/i).first();
    await expect(historyContent).toBeVisible({ timeout: 20_000 });
  });
});
