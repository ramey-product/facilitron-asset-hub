import { test as base, expect } from "@playwright/test";

export { expect };

/**
 * Extended test fixture with common helpers for Asset Hub E2E tests.
 *
 * Usage:
 *   import { test, expect } from './fixtures';
 */
export const test = base.extend<{
  /** Navigate to the dashboard and wait for the page shell to settle */
  dashboard: void;
}>({
  dashboard: [
    async ({ page }, use) => {
      await page.goto("/dashboard");
      // Wait for the sidebar nav to be present (confirms app shell rendered)
      await page.waitForSelector("nav", { timeout: 20_000 });
      await use();
    },
    { auto: false },
  ],
});

/** The base URL for direct API calls in tests that use `request` fixture */
export const API_BASE = "http://localhost:3001";
