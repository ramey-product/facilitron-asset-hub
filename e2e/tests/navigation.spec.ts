import { test, expect } from "@playwright/test";

/**
 * Navigation smoke tests.
 * Verifies the app shell loads and sidebar navigation works.
 */
test.describe("Navigation", () => {
  test("root redirect: / sends user to /dashboard", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("app loads and sidebar is visible", async ({ page }) => {
    await page.goto("/dashboard");
    // Sidebar should be present (contains nav element with links)
    const sidebar = page.locator("aside, [role='navigation']").first();
    await expect(sidebar).toBeVisible({ timeout: 20_000 });
  });

  test("sidebar contains Hub Dashboard link", async ({ page }) => {
    await page.goto("/dashboard");
    const dashboardLink = page.getByRole("link", { name: /hub dashboard/i });
    await expect(dashboardLink).toBeVisible({ timeout: 20_000 });
  });

  test("sidebar contains Assets link", async ({ page }) => {
    await page.goto("/dashboard");
    const assetsLink = page.getByRole("link", { name: /^assets$/i });
    await expect(assetsLink).toBeVisible({ timeout: 20_000 });
  });

  test("sidebar contains Scan Asset link", async ({ page }) => {
    await page.goto("/dashboard");
    const scanLink = page.getByRole("link", { name: /scan asset/i });
    await expect(scanLink).toBeVisible({ timeout: 20_000 });
  });

  test("navigating to /assets via sidebar link works", async ({ page }) => {
    await page.goto("/dashboard");
    // Wait for sidebar to appear
    await page.waitForSelector("nav a[href='/assets']", { timeout: 20_000 });
    await page.click("nav a[href='/assets']");
    await expect(page).toHaveURL(/\/assets/);
    // Asset Registry heading should appear
    await expect(page.getByRole("heading", { name: /asset registry/i })).toBeVisible({
      timeout: 20_000,
    });
  });

  test("navigating to /scan via sidebar link works", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForSelector("nav a[href='/scan']", { timeout: 20_000 });
    await page.click("nav a[href='/scan']");
    await expect(page).toHaveURL(/\/scan/);
  });

  test("navigating to /settings via sidebar link works", async ({ page }) => {
    await page.goto("/dashboard");
    // Settings is in the sidebar's bottom section (outside the main <nav>)
    await page.waitForSelector("a[href='/settings']", { timeout: 20_000 });
    await page.click("a[href='/settings']");
    await expect(page).toHaveURL(/\/settings/);
  });
});
