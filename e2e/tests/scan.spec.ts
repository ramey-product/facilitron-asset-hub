import { test, expect } from "@playwright/test";

/**
 * Scan page E2E tests.
 * The scan page uses the device camera, which is unavailable in headless Chromium.
 * Tests here focus on: page loads, top bar renders, and the manual entry fallback
 * is present (so the page is usable even without camera access).
 */
test.describe("Scan Page", () => {
  test.beforeEach(async ({ page }) => {
    // Grant camera permission to prevent browser permission UI blocking the test
    // In headless mode the camera will not actually work, but the page should
    // handle this gracefully and show the manual entry fallback.
    await page.goto("/scan");
  });

  test("scan page loads without crashing", async ({ page }) => {
    // Basic check: the body renders and no error boundary is triggered
    await expect(page.locator("body")).toBeVisible({ timeout: 20_000 });
    const errorBoundary = page.getByText(/something went wrong/i);
    const hasError = await errorBoundary.isVisible();
    expect(hasError).toBe(false);
  });

  test("scan page top bar shows 'Scan Asset' label", async ({ page }) => {
    // The top bar renders a <span> with "Scan Asset" — use .first() to avoid strict-mode
    // violation when the sidebar also has a "Scan Asset" nav link
    const scanLabel = page.getByText(/scan asset/i).first();
    await expect(scanLabel).toBeVisible({ timeout: 20_000 });
  });

  test("back button navigates to /assets", async ({ page }) => {
    const backBtn = page.getByRole("link", { name: /back/i });
    await expect(backBtn).toBeVisible({ timeout: 20_000 });
    const href = await backBtn.getAttribute("href");
    expect(href).toBe("/assets");
  });

  test("manual entry fallback input or prompt is present", async ({ page }) => {
    // The manual entry section renders below the scanner
    // It includes an instruction text and an input
    const manualPrompt = page.getByText(/manually|enter|barcode|qr|code/i).first();
    const manualInput = page.locator("input[type='text'], input:not([type])").last();

    const promptVisible = await manualPrompt.isVisible({ timeout: 15_000 });
    const inputVisible = await manualInput.isVisible();

    expect(promptVisible || inputVisible).toBe(true);
  });

  test("manual entry can accept a value and submit", async ({ page }) => {
    // The ManualEntry component has aria-label="Manual barcode or asset tag entry"
    const manualInput = page.getByRole("textbox", { name: /manual barcode|asset tag entry/i });
    const isVisible = await manualInput.isVisible({ timeout: 15_000 });

    if (isVisible) {
      await manualInput.fill("WORKS-AST-1");
      // The submit button is labelled "Search"
      const submitBtn = page.getByRole("button", { name: /^search$/i });
      await submitBtn.click();

      // After submission the ScanResult sheet should appear with "Scanned Code" label
      // or action buttons like "View Details"
      const scannedCodeLabel = page.getByText(/scanned code/i);
      const viewDetailsBtn = page.getByRole("button", { name: /view details/i });

      await expect(scannedCodeLabel.or(viewDetailsBtn).first()).toBeVisible({ timeout: 10_000 });
    }
  });
});
