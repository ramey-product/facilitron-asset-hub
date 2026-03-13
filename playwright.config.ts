import { defineConfig, devices } from "@playwright/test";

/**
 * Root-level Playwright config for the Asset Hub monorepo.
 * Runs Chromium only. Starts both API (port 3001) and web (port 3000) servers.
 */
export default defineConfig({
  testDir: "./e2e/tests",
  fullyParallel: false,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  workers: 1,
  reporter: [["html", { outputFolder: "e2e/playwright-report" }], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Reasonable timeouts for a dev prototype
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "npx pnpm --filter @asset-hub/api dev",
      url: "http://localhost:3001/health",
      reuseExistingServer: !process.env["CI"],
      timeout: 60_000,
    },
    {
      command: "npx pnpm --filter @asset-hub/web dev",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env["CI"],
      timeout: 90_000,
    },
  ],
});
