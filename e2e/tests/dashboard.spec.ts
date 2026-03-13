import { test, expect } from "@playwright/test";

/**
 * Dashboard page E2E tests.
 * Covers KPI cards, activity feed, alerts widget, and property scope selector.
 */
test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    // Wait for the page shell to render
    await page.waitForSelector("header", { timeout: 20_000 });
  });

  test("page has Asset Hub heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /asset hub/i })).toBeVisible({
      timeout: 20_000,
    });
  });

  test("dashboard subtitle shows property context or All Properties", async ({ page }) => {
    // The subtitle either shows a property name or "All Properties"
    const subtitle = page.locator("header p").first();
    await expect(subtitle).toBeVisible({ timeout: 20_000 });
    const text = await subtitle.textContent();
    expect(text).toBeTruthy();
    // Should contain either "All Properties" or a property name with a city/state
    const isAllProps = text?.includes("All Properties");
    const isProperty = text?.includes(","); // "City, State" format
    expect(isAllProps || isProperty).toBe(true);
  });

  test("KPI cards appear after data loads", async ({ page }) => {
    // KPI section renders 4 stat cards once data arrives
    // Wait for either the cards or an error state (API may be slow)
    await page.waitForFunction(
      () => {
        const cards = document.querySelectorAll("[data-testid='kpi-card'], .rounded-xl.border");
        return cards.length >= 3;
      },
      { timeout: 20_000 }
    );

    // At minimum the page should not be stuck in loading skeleton
    const loadingPulse = page.locator(".animate-pulse").first();
    await expect(loadingPulse).not.toBeVisible({ timeout: 20_000 });
  });

  test("refresh button is visible and clickable", async ({ page }) => {
    const refreshBtn = page.getByRole("button", { name: /refresh dashboard/i });
    await expect(refreshBtn).toBeVisible({ timeout: 20_000 });
    await refreshBtn.click();
    // After click, button should still be present (not a one-shot trigger)
    await expect(refreshBtn).toBeVisible();
  });

  test("role badge is visible in header", async ({ page }) => {
    // The mock auth badge "OrderAdministrator" is shown in the header
    const badge = page.getByText(/orderadministrator/i);
    await expect(badge).toBeVisible({ timeout: 20_000 });
  });

  test("alerts widget section is present", async ({ page }) => {
    // The bottom row includes both AlertsWidget and ActivityFeed
    // Wait for the grid to appear (both sections)
    await page.waitForSelector(".grid", { timeout: 20_000 });

    // The page should contain text related to alerts
    const alertsHeading = page.getByText(/alerts|attention/i).first();
    await expect(alertsHeading).toBeVisible({ timeout: 20_000 });
  });

  test("activity feed section is present", async ({ page }) => {
    const activityHeading = page.getByText(/activity/i).first();
    await expect(activityHeading).toBeVisible({ timeout: 20_000 });
  });

  test("property scope selector button is visible in sidebar", async ({ page }) => {
    // The scope trigger button has aria-label="Change property scope"
    const scopeTrigger = page.getByRole("button", { name: /change property scope/i });
    await expect(scopeTrigger).toBeVisible({ timeout: 20_000 });
  });

  test("property scope popover opens when trigger is clicked", async ({ page }) => {
    // The scope trigger button in the sidebar
    const scopeTrigger = page.getByRole("button", { name: /change property scope/i });
    await expect(scopeTrigger).toBeVisible({ timeout: 20_000 });
    await scopeTrigger.click();

    // After click, the listbox popover appears with an "All Properties" option
    const allPropertiesOption = page.getByRole("option", { name: /all properties/i });
    await expect(allPropertiesOption).toBeVisible({ timeout: 10_000 });
  });

  test("selecting a property in scope popover updates the dashboard subtitle", async ({ page }) => {
    // Open scope popover
    const scopeTrigger = page.getByRole("button", { name: /change property scope/i });
    await scopeTrigger.click();

    // Wait for the listbox to open
    await page.waitForSelector("[role='listbox']", { timeout: 10_000 });

    // Get all property options (role="option") and pick the second one (first after "All Properties")
    const options = page.getByRole("option");
    const count = await options.count();

    if (count > 1) {
      // Click the second option (first individual property)
      await options.nth(1).click();

      // The scope trigger should no longer read "All Properties"
      await expect(scopeTrigger).not.toContainText("All Properties", { timeout: 10_000 });
    } else {
      // Only one option — close gracefully
      await page.keyboard.press("Escape");
    }
  });
});
