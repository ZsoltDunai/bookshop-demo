import { test, expect } from "@playwright/test";

test.describe("Login UI", () => {
  test("home page links to login", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("cta-login")).toBeVisible();
    await page.getByTestId("cta-login").click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId("login-heading")).toBeVisible();
  });

  test("successful login redirects to shop", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("login-email").fill("demo@bookshop.io");
    await page.getByTestId("login-password").fill("password123");
    await page.getByTestId("login-submit").click();

    await expect(page).toHaveURL(/\/shop/);
    await expect(page.getByTestId("shop-heading")).toBeVisible();
    await expect(page.getByTestId("book-grid")).toBeVisible();
  });

  test("invalid login shows error", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("login-email").fill("demo@bookshop.io");
    await page.getByTestId("login-password").fill("wrong");
    await page.getByTestId("login-submit").click();

    await expect(page.getByTestId("login-alert")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});
