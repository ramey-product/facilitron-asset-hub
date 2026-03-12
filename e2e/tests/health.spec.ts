import { test, expect } from "@playwright/test";

test("API health check returns ok", async ({ request }) => {
  const res = await request.get("http://localhost:3001/health");
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.status).toBe("ok");
});

test("homepage renders Asset Hub heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Asset Hub" })).toBeVisible();
});
