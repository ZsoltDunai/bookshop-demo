import { test, expect } from "@playwright/test";

test.describe("Shop UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("login-email").fill("demo@bookshop.io");
    await page.getByTestId("login-password").fill("password123");
    await page.getByTestId("login-submit").click();
    await expect(page).toHaveURL(/\/shop/);
  });

  test("displays book catalog", async ({ page }) => {
    const cards = page.getByTestId("book-card");
    await expect(cards.first()).toBeVisible();
    await expect(cards).toHaveCount(6);
    await expect(page.getByTestId("book-title").first()).not.toBeEmpty();
    await expect(page.getByTestId("book-price").first()).toContainText("$");
  });

  test("add book to cart shows success message", async ({ page }) => {
    await page.getByTestId("add-to-cart").first().click();
    await expect(page.getByTestId("shop-alert")).toBeVisible();
    await expect(page.getByTestId("shop-alert")).toHaveText("Added to cart!");
  });

  test("navigate to cart from shop", async ({ page }) => {
    await page.getByTestId("add-to-cart").first().click();
    await page.getByTestId("nav-cart").click();
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByTestId("cart-item")).toHaveCount(1);
  });
});
