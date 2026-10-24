import { test, expect } from "@playwright/test";

test.describe("Website Smoke & Usability Test", () => {
  test("compiles, boots, and serves primary pages with navigation", async ({ page }) => {
    // 1. Home page loads without crashing
    const homeRes = await page.goto("/home");
    expect(homeRes?.status()).toBe(200);
    await expect(page.locator("header")).toBeVisible();

    // 2. Main navigation routes load cleanly (HTTP 200)
    for (const route of ["/projects", "/members", "/events"]) {
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator("header")).toBeVisible();
    }

    // 3. Navigation interaction works
    const projectsLink = page.locator('header a[href*="/projects"]').first();
    if (await projectsLink.isVisible()) {
      await projectsLink.click();
      await expect(page).toHaveURL(/.*projects/);
    }
  });
});

