import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env["CI"],
  retries: process.env["CI"] ? 2 : 0,
  workers: 1,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
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
